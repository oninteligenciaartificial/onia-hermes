"""Bounded, no-overwrite filesystem sink for finite native result bundles.

Production use requires POSIX directory fsync, an existing private root owned by
the current user, and a stable directory fingerprint. Windows fixture injection
exists only to exercise byte and no-overwrite behavior; it is not durable proof.
This does not sandbox against arbitrary code running as the same user.
"""
import base64
import binascii
from contextlib import contextmanager
import hashlib
import json
import os
from pathlib import Path
import re
import secrets
import stat
import uuid

from native_work_entrypoint import MAX_RESULT_BUNDLE_BYTES


_OPERATION_ID = re.compile(r"[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}\Z")
_SHA256 = re.compile(r"[0-9a-f]{64}\Z")
_REF = re.compile(r"native-result-v1-[0-9a-f]{32}\Z")
_ENVELOPE_FIELDS = frozenset((
    "schema", "operation_id", "request_sha", "bundle_sha256", "bundle_bytes", "bundle_b64",
))
_MAX_ENVELOPE_BYTES = 4 * ((MAX_RESULT_BUNDLE_BYTES + 2) // 3) + 4096


class ResultStoreError(RuntimeError):
    """Base class for bounded result-store failures; messages carry no payload."""


class UnsupportedResultStoreError(ResultStoreError):
    """Raised when the filesystem cannot provide the required durability gates."""


class ResultStoreConflictError(ResultStoreError):
    """Raised when an operation already has different request or result bytes."""


class ResultStoreIntegrityError(ResultStoreError):
    """Raised for symlinks, non-regular files, corruption, or identity mismatch."""


class ResultStoreNotFoundError(ResultStoreError):
    """Raised when no atomically published result exists for the operation."""


def _no_duplicate_pairs(pairs):
    result = {}
    for key, value in pairs:
        if key in result:
            raise ValueError("duplicate envelope field")
        result[key] = value
    return result


def _reject_constant(_value):
    raise ValueError("non-finite envelope number")


def _validate_identity(operation_id, request_sha):
    if (type(operation_id) is not str or not _OPERATION_ID.fullmatch(operation_id)
            or str(uuid.UUID(operation_id)) != operation_id):
        raise ValueError("invalid operation id")
    if type(request_sha) is not str or not _SHA256.fullmatch(request_sha):
        raise ValueError("invalid request digest")


def _result_key(operation_id):
    return hashlib.sha256(b"native-result-store-v1\0" + operation_id.encode("ascii")).hexdigest()[:32]


class FileResultSink:
    """Persist one immutable bundle per operation and load it after restart.

    ``root_dir`` is trusted caller configuration, never request data. It must be
    an existing absolute directory. No directories are created by this class.
    A result reference is opaque and stable for its operation. The POSIX write
    path fsyncs the staged file, publishes with a same-directory no-replace
    hard link, then fsyncs the directory entry before acknowledging it.

    ``_fixture_dir_fsync`` is private test support. It may simulate directory
    sync in a Windows fixture and must never be used by a production connector.
    """

    def __init__(self, root_dir, *, _fixture_dir_fsync=None):
        if type(root_dir) is not str and not isinstance(root_dir, Path):
            raise ValueError("absolute result root required")
        self.root = Path(root_dir)
        if not self.root.is_absolute() or ".." in self.root.parts or self.root != Path(os.path.normpath(str(self.root))):
            raise ValueError("absolute normalized result root required")
        self._fixture_dir_fsync = _fixture_dir_fsync
        if _fixture_dir_fsync is not None and not callable(_fixture_dir_fsync):
            raise ValueError("fixture directory sync must be callable")
        self._fixture_mode = _fixture_dir_fsync is not None
        if os.name != "posix" and not self._fixture_mode:
            raise UnsupportedResultStoreError("POSIX directory fsync is required")
        self._root_fingerprint = self._validate_root(initial=True)
        # Probe the exact durability operation at construction, before any
        # provider event can be delegated by a connector.
        self._sync_root_directory()
        self._probe_publication()

    def _validate_root(self, *, initial=False):
        current = Path(self.root.anchor)
        for part in self.root.parts[1:]:
            current = current / part
            try:
                component = os.lstat(current)
            except FileNotFoundError as exc:
                raise ResultStoreError("result root must already exist") from exc
            if stat.S_ISLNK(component.st_mode):
                raise ResultStoreIntegrityError("symlink in result root path")
        try:
            root_stat = os.lstat(self.root)
        except FileNotFoundError as exc:
            raise ResultStoreError("result root must already exist") from exc
        if stat.S_ISLNK(root_stat.st_mode) or not stat.S_ISDIR(root_stat.st_mode):
            raise ResultStoreIntegrityError("result root is not a real directory")
        for ancestor in (self.root, *self.root.parents):
            marker = ancestor / ".git"
            try:
                os.lstat(marker)
            except FileNotFoundError:
                continue
            raise ResultStoreIntegrityError("result root must be outside Git worktrees")
        if os.name == "posix":
            if root_stat.st_uid != os.geteuid() or stat.S_IMODE(root_stat.st_mode) & 0o077:
                raise ResultStoreIntegrityError("result root must be owner-private")
        elif not self._fixture_mode:
            raise UnsupportedResultStoreError("POSIX owner and mode checks are required")
        fingerprint = (root_stat.st_dev, root_stat.st_ino, root_stat.st_uid,
                       stat.S_IMODE(root_stat.st_mode))
        if not initial and fingerprint != self._root_fingerprint:
            raise ResultStoreIntegrityError("result root fingerprint changed")
        return fingerprint

    def _sync_root_directory(self):
        self._validate_root()
        if self._fixture_mode:
            try:
                self._fixture_dir_fsync(self.root)
            except OSError as exc:
                raise UnsupportedResultStoreError("fixture directory sync failed") from exc
            return
        try:
            with self._root_directory_fd() as descriptor:
                os.fsync(descriptor)
        except OSError as exc:
            raise UnsupportedResultStoreError("directory fsync is unavailable") from exc

    @contextmanager
    def _root_directory_fd(self):
        if os.name != "posix":
            raise UnsupportedResultStoreError("POSIX directory descriptors are required")
        self._validate_root()
        flags = os.O_RDONLY | getattr(os, "O_DIRECTORY", 0) | getattr(os, "O_NOFOLLOW", 0)
        descriptor = os.open(self.root, flags)
        try:
            opened = os.fstat(descriptor)
            fingerprint = (opened.st_dev, opened.st_ino, opened.st_uid,
                           stat.S_IMODE(opened.st_mode))
            if not stat.S_ISDIR(opened.st_mode) or fingerprint != self._root_fingerprint:
                raise ResultStoreIntegrityError("opened result root fingerprint changed")
            yield descriptor
        finally:
            os.close(descriptor)

    @contextmanager
    def _directory_handle(self):
        if os.name == "posix":
            with self._root_directory_fd() as descriptor:
                yield descriptor
        else:
            self._validate_root()
            yield None

    @staticmethod
    def _stat_entry(path, directory_fd):
        if directory_fd is None:
            return os.lstat(path)
        return os.stat(path.name, dir_fd=directory_fd, follow_symlinks=False)

    @staticmethod
    def _open_entry(path, flags, directory_fd):
        if directory_fd is None:
            return os.open(path, flags)
        return os.open(path.name, flags, dir_fd=directory_fd)

    @contextmanager
    def _root_guard(self):
        self._validate_root()
        yield
        self._validate_root()

    def _filename(self, operation_id):
        return f"bundle-{_result_key(operation_id)}.json"

    def _reference(self, operation_id):
        return f"native-result-v1-{_result_key(operation_id)}"

    def _decode_envelope(self, raw, operation_id, request_sha, expected_sha):
        try:
            envelope = json.loads(raw.decode("utf-8", errors="strict"),
                                  object_pairs_hook=_no_duplicate_pairs,
                                  parse_constant=_reject_constant)
        except (UnicodeError, ValueError, TypeError, RecursionError) as exc:
            raise ResultStoreIntegrityError("result envelope is invalid") from exc
        if type(envelope) is not dict or set(envelope) != _ENVELOPE_FIELDS:
            raise ResultStoreIntegrityError("result envelope fields are invalid")
        if (type(envelope["schema"]) is not int or envelope["schema"] != 1
                or envelope["operation_id"] != operation_id
                or envelope["request_sha"] != request_sha):
            raise ResultStoreConflictError("result identity differs")
        if (type(envelope["bundle_sha256"]) is not str or not _SHA256.fullmatch(envelope["bundle_sha256"])
                or envelope["bundle_sha256"] != expected_sha
                or type(envelope["bundle_bytes"]) is not int
                or not 0 <= envelope["bundle_bytes"] <= MAX_RESULT_BUNDLE_BYTES
                or type(envelope["bundle_b64"]) is not str):
            raise ResultStoreConflictError("result digest differs")
        try:
            bundle = base64.b64decode(envelope["bundle_b64"].encode("ascii"), validate=True)
        except (UnicodeError, ValueError, binascii.Error) as exc:
            raise ResultStoreIntegrityError("result encoding is invalid") from exc
        if (len(bundle) != envelope["bundle_bytes"]
                or hashlib.sha256(bundle).hexdigest() != envelope["bundle_sha256"]):
            raise ResultStoreIntegrityError("result bytes do not match digest")
        return bundle

    def _read_published(self, operation_id, request_sha, expected_sha):
        path = self.root / self._filename(operation_id)
        with self._directory_handle() as directory_fd:
            try:
                before = self._stat_entry(path, directory_fd)
            except FileNotFoundError as exc:
                raise ResultStoreNotFoundError("result is not published") from exc
            if stat.S_ISLNK(before.st_mode) or not stat.S_ISREG(before.st_mode):
                raise ResultStoreIntegrityError("published result is not a regular file")
            if before.st_size <= 0 or before.st_size > _MAX_ENVELOPE_BYTES:
                raise ResultStoreIntegrityError("published result exceeds bounds")
            flags = os.O_RDONLY | getattr(os, "O_NOFOLLOW", 0)
            try:
                descriptor = self._open_entry(path, flags, directory_fd)
            except OSError as exc:
                raise ResultStoreIntegrityError("published result cannot be opened safely") from exc
            try:
                opened = os.fstat(descriptor)
                if (not stat.S_ISREG(opened.st_mode) or opened.st_dev != before.st_dev
                        or opened.st_ino != before.st_ino or opened.st_size != before.st_size):
                    raise ResultStoreIntegrityError("published result changed while opening")
                chunks = []
                total = 0
                while total <= _MAX_ENVELOPE_BYTES:
                    chunk = os.read(descriptor, min(65536, _MAX_ENVELOPE_BYTES + 1 - total))
                    if not chunk:
                        break
                    chunks.append(chunk)
                    total += len(chunk)
                after = os.fstat(descriptor)
                if (total != opened.st_size or total > _MAX_ENVELOPE_BYTES
                        or (after.st_dev, after.st_ino, after.st_size, after.st_mtime_ns)
                        != (opened.st_dev, opened.st_ino, opened.st_size, opened.st_mtime_ns)):
                    raise ResultStoreIntegrityError("published result changed while reading")
            finally:
                os.close(descriptor)
        return self._decode_envelope(b"".join(chunks), operation_id, request_sha, expected_sha)

    def _read_pending_raw(self, path):
        with self._directory_handle() as directory_fd:
            try:
                item = self._stat_entry(path, directory_fd)
            except FileNotFoundError as exc:
                raise ResultStoreNotFoundError("pending result is absent") from exc
            if stat.S_ISLNK(item.st_mode) or not stat.S_ISREG(item.st_mode):
                raise ResultStoreIntegrityError("pending result is not a regular file")
            if item.st_size <= 0 or item.st_size > _MAX_ENVELOPE_BYTES:
                raise ResultStoreIntegrityError("pending result exceeds bounds")
            # O_RDWR is needed by Windows to fsync the opened file handle; on
            # POSIX it still pins the exact checked inode and avoids path reopen.
            descriptor = self._open_entry(path, os.O_RDWR | getattr(os, "O_NOFOLLOW", 0), directory_fd)
            try:
                opened = os.fstat(descriptor)
                chunks = []
                total = 0
                while total <= _MAX_ENVELOPE_BYTES:
                    chunk = os.read(descriptor, min(65536, _MAX_ENVELOPE_BYTES + 1 - total))
                    if not chunk:
                        break
                    chunks.append(chunk)
                    total += len(chunk)
                after = os.fstat(descriptor)
                raw = b"".join(chunks)
                if (not stat.S_ISREG(opened.st_mode) or opened.st_ino != item.st_ino
                        or len(raw) != opened.st_size or len(raw) > _MAX_ENVELOPE_BYTES
                        or (after.st_dev, after.st_ino, after.st_size, after.st_mtime_ns)
                        != (opened.st_dev, opened.st_ino, opened.st_size, opened.st_mtime_ns)):
                    raise ResultStoreIntegrityError("pending result changed while reading")
                # Flush the validated opened inode itself before recovery can
                # publish it; never reopen by path between validation and fsync.
                os.fsync(descriptor)
                return raw
            finally:
                os.close(descriptor)

    def recover_pending(self, operation_id, request_sha):
        """Validate and publish this operation's complete candidate without provider access."""
        return self._recover_pending(operation_id, request_sha)

    def _recover_pending(self, operation_id, request_sha, expected_bundle=None):
        _validate_identity(operation_id, request_sha)
        with self._root_guard():
            pending = self.root / f".{self._filename(operation_id)}.pending"
            raw = self._read_pending_raw(pending)
            try:
                envelope = json.loads(raw.decode("utf-8", errors="strict"),
                                      object_pairs_hook=_no_duplicate_pairs,
                                      parse_constant=_reject_constant)
                digest = envelope["bundle_sha256"]
            except (UnicodeError, ValueError, TypeError, KeyError, RecursionError) as exc:
                raise ResultStoreIntegrityError("pending result envelope is invalid") from exc
            if type(digest) is not str or not _SHA256.fullmatch(digest):
                raise ResultStoreIntegrityError("pending result digest is invalid")
            bundle = self._decode_envelope(raw, operation_id, request_sha, digest)
            if expected_bundle is not None and bundle != expected_bundle:
                raise ResultStoreConflictError("pending result bytes differ from requested result")
            final = self.root / self._filename(operation_id)
            try:
                self._link_noreplace(pending, final)
            except FileExistsError:
                existing = self._read_published(operation_id, request_sha, digest)
                if existing != bundle:
                    raise ResultStoreConflictError("published result differs from pending candidate")
            self._sync_root_directory()
            self._remove_stage(pending)
            self._sync_root_directory()
            return {"ref": self._reference(operation_id), "sha256": digest,
                    "bytes_written": len(bundle)}

    def _encode_envelope(self, operation_id, request_sha, bundle_bytes):
        envelope = {
            "schema": 1,
            "operation_id": operation_id,
            "request_sha": request_sha,
            "bundle_sha256": hashlib.sha256(bundle_bytes).hexdigest(),
            "bundle_bytes": len(bundle_bytes),
            "bundle_b64": base64.b64encode(bundle_bytes).decode("ascii"),
        }
        encoded = json.dumps(envelope, sort_keys=True, separators=(",", ":"),
                             ensure_ascii=True, allow_nan=False).encode("utf-8")
        if len(encoded) > _MAX_ENVELOPE_BYTES:
            raise ValueError("result envelope exceeds bounds")
        return encoded

    def _write_stage(self, stage_path, encoded):
        flags = os.O_WRONLY | os.O_CREAT | os.O_EXCL | getattr(os, "O_NOFOLLOW", 0)
        with self._directory_handle() as directory_fd:
            descriptor = os.open(stage_path, flags, 0o600) if directory_fd is None else os.open(
                stage_path.name, flags, 0o600, dir_fd=directory_fd)
            try:
                if not stat.S_ISREG(os.fstat(descriptor).st_mode):
                    raise ResultStoreIntegrityError("staging result is not a regular file")
                view = memoryview(encoded)
                offset = 0
                while offset < len(view):
                    written = os.write(descriptor, view[offset:])
                    if written <= 0:
                        raise OSError("staging write made no progress")
                    offset += written
                os.fsync(descriptor)
            finally:
                os.close(descriptor)

    def _link_noreplace(self, stage_path, final_path):
        # Hard-link publication is atomic and fails if any entry already exists.
        with self._directory_handle() as directory_fd:
            if directory_fd is None:
                source_stat = os.lstat(stage_path)
                if not stat.S_ISREG(source_stat.st_mode):
                    raise ResultStoreIntegrityError("staging result is not a regular file")
                os.link(stage_path, final_path, follow_symlinks=False)
                target_stat = os.lstat(final_path)
            else:
                source_stat = os.stat(stage_path.name, dir_fd=directory_fd, follow_symlinks=False)
                if not stat.S_ISREG(source_stat.st_mode):
                    raise ResultStoreIntegrityError("staging result is not a regular file")
                os.link(stage_path.name, final_path.name, src_dir_fd=directory_fd,
                        dst_dir_fd=directory_fd, follow_symlinks=False)
                target_stat = os.stat(final_path.name, dir_fd=directory_fd, follow_symlinks=False)
            if (not stat.S_ISREG(target_stat.st_mode) or target_stat.st_dev != source_stat.st_dev
                    or target_stat.st_ino != source_stat.st_ino):
                raise ResultStoreIntegrityError("published link differs from staged inode")

    def _remove_stage(self, stage_path):
        with self._directory_handle() as directory_fd:
            try:
                item = self._stat_entry(stage_path, directory_fd)
            except FileNotFoundError:
                return
            if stat.S_ISLNK(item.st_mode) or not stat.S_ISREG(item.st_mode):
                raise ResultStoreIntegrityError("staging entry is not a regular file")
            if directory_fd is None:
                os.unlink(stage_path)
            else:
                os.unlink(stage_path.name, dir_fd=directory_fd)

    def _probe_publication(self):
        """Fail closed unless private staging, no-replace links, and dir fsync work."""
        suffix = secrets.token_hex(16)
        source = self.root / f".native-result-v1-probe-stage-{suffix}"
        target = self.root / f".native-result-v1-probe-final-{suffix}"
        try:
            self._write_stage(source, b"probe")
            self._link_noreplace(source, target)
            self._sync_root_directory()
            try:
                self._link_noreplace(source, target)
            except FileExistsError:
                pass
            else:
                raise UnsupportedResultStoreError("filesystem link does not prevent replacement")
            self._remove_stage(source)
            self._remove_stage(target)
            self._sync_root_directory()
        except OSError as exc:
            raise UnsupportedResultStoreError("atomic durable publication is unavailable") from exc

    def store(self, operation_id, request_sha, bundle_bytes):
        """Write once; identical retries return the existing evidence without rewrite."""
        _validate_identity(operation_id, request_sha)
        if type(bundle_bytes) is not bytes or len(bundle_bytes) > MAX_RESULT_BUNDLE_BYTES:
            raise ValueError("result bundle must be bounded bytes")
        with self._root_guard():
            final_path = self.root / self._filename(operation_id)
            try:
                existing = self._read_published(
                    operation_id, request_sha, hashlib.sha256(bundle_bytes).hexdigest())
            except ResultStoreNotFoundError:
                existing = None
            if existing is not None:
                if existing != bundle_bytes:
                    raise ResultStoreConflictError("published result bytes differ")
                self._sync_root_directory()
                return {"ref": self._reference(operation_id),
                        "sha256": hashlib.sha256(existing).hexdigest(),
                        "bytes_written": len(existing)}

            encoded = self._encode_envelope(operation_id, request_sha, bundle_bytes)
            stage_path = self.root / f".{final_path.name}.pending"
            try:
                pending_raw = self._read_pending_raw(stage_path)
            except ResultStoreNotFoundError:
                pass
            else:
                try:
                    envelope = json.loads(pending_raw.decode("utf-8", errors="strict"),
                                          object_pairs_hook=_no_duplicate_pairs,
                                          parse_constant=_reject_constant)
                    pending_sha = envelope["bundle_sha256"]
                except (UnicodeError, ValueError, TypeError, KeyError, RecursionError) as exc:
                    raise ResultStoreIntegrityError("pending result envelope is invalid") from exc
                pending_bundle = self._decode_envelope(
                    pending_raw, operation_id, request_sha, pending_sha)
                if pending_bundle != bundle_bytes:
                    raise ResultStoreConflictError("pending result bytes differ from requested result")
                return self._recover_pending(operation_id, request_sha, expected_bundle=bundle_bytes)
            # Any exception after creation leaves the named stage for explicit
            # reconciliation; this method never cleans crash remnants broadly.
            self._write_stage(stage_path, encoded)
            self._validate_root()
            try:
                self._link_noreplace(stage_path, final_path)
            except FileExistsError:
                existing = self._read_published(
                    operation_id, request_sha, hashlib.sha256(bundle_bytes).hexdigest())
                if existing != bundle_bytes:
                    raise ResultStoreConflictError("published result bytes differ")
                self._remove_stage(stage_path)
                self._sync_root_directory()
                return {"ref": self._reference(operation_id),
                        "sha256": hashlib.sha256(existing).hexdigest(),
                        "bytes_written": len(existing)}
            self._sync_root_directory()
            self._remove_stage(stage_path)
            self._sync_root_directory()
            return {"ref": self._reference(operation_id),
                    "sha256": hashlib.sha256(bundle_bytes).hexdigest(),
                    "bytes_written": len(bundle_bytes)}

    def load(self, ref, operation_id, request_sha, expected_sha):
        """Load exact bytes only when opaque ref, operation, request, and digest match."""
        _validate_identity(operation_id, request_sha)
        if type(ref) is not str or not _REF.fullmatch(ref) or ref != self._reference(operation_id):
            raise ResultStoreIntegrityError("result reference does not match operation")
        if type(expected_sha) is not str or not _SHA256.fullmatch(expected_sha):
            raise ValueError("invalid expected result digest")
        with self._root_guard():
            bundle = self._read_published(operation_id, request_sha, expected_sha)
            self._sync_root_directory()
            return bundle
