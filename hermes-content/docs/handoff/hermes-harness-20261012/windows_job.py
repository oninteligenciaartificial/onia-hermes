"""Windows-only containment for one suspended child and all its descendants.

Uses documented Win32 Job and Toolhelp APIs through the Python standard library.
Assignment happens before ResumeThread; any setup failure leaves the child suspended
and terminates it. Closing the job handle kills associated descendants.
"""

import ctypes
from ctypes import wintypes
import os
import subprocess


if os.name != "nt":
    raise ImportError("windows_job is Windows-only")


_KERNEL32 = ctypes.WinDLL("kernel32", use_last_error=True)
_HANDLE = wintypes.HANDLE
_DWORD = wintypes.DWORD
_SIZE_T = ctypes.c_size_t
_ULONG_PTR = ctypes.c_size_t


class _BasicLimit(ctypes.Structure):
    _fields_ = [
        ("PerProcessUserTimeLimit", ctypes.c_int64),
        ("PerJobUserTimeLimit", ctypes.c_int64),
        ("LimitFlags", _DWORD),
        ("MinimumWorkingSetSize", _SIZE_T),
        ("MaximumWorkingSetSize", _SIZE_T),
        ("ActiveProcessLimit", _DWORD),
        ("Affinity", _ULONG_PTR),
        ("PriorityClass", _DWORD),
        ("SchedulingClass", _DWORD),
    ]


class _IoCounters(ctypes.Structure):
    _fields_ = [(name, ctypes.c_uint64) for name in (
        "ReadOperationCount", "WriteOperationCount", "OtherOperationCount",
        "ReadTransferCount", "WriteTransferCount", "OtherTransferCount",
    )]


class _ExtendedLimit(ctypes.Structure):
    _fields_ = [
        ("BasicLimitInformation", _BasicLimit),
        ("IoInfo", _IoCounters),
        ("ProcessMemoryLimit", _SIZE_T),
        ("JobMemoryLimit", _SIZE_T),
        ("PeakProcessMemoryUsed", _SIZE_T),
        ("PeakJobMemoryUsed", _SIZE_T),
    ]


class _ThreadEntry(ctypes.Structure):
    _fields_ = [
        ("dwSize", _DWORD), ("cntUsage", _DWORD),
        ("th32ThreadID", _DWORD), ("th32OwnerProcessID", _DWORD),
        ("tpBasePri", wintypes.LONG), ("tpDeltaPri", wintypes.LONG),
        ("dwFlags", _DWORD),
    ]


_KERNEL32.CreateJobObjectW.argtypes = (ctypes.c_void_p, wintypes.LPCWSTR)
_KERNEL32.CreateJobObjectW.restype = _HANDLE
_KERNEL32.SetInformationJobObject.argtypes = (_HANDLE, ctypes.c_int, ctypes.c_void_p, _DWORD)
_KERNEL32.SetInformationJobObject.restype = wintypes.BOOL
_KERNEL32.AssignProcessToJobObject.argtypes = (_HANDLE, _HANDLE)
_KERNEL32.AssignProcessToJobObject.restype = wintypes.BOOL
_KERNEL32.OpenProcess.argtypes = (_DWORD, wintypes.BOOL, _DWORD)
_KERNEL32.OpenProcess.restype = _HANDLE
_KERNEL32.CreateToolhelp32Snapshot.argtypes = (_DWORD, _DWORD)
_KERNEL32.CreateToolhelp32Snapshot.restype = _HANDLE
_KERNEL32.Thread32First.argtypes = (_HANDLE, ctypes.POINTER(_ThreadEntry))
_KERNEL32.Thread32First.restype = wintypes.BOOL
_KERNEL32.Thread32Next.argtypes = (_HANDLE, ctypes.POINTER(_ThreadEntry))
_KERNEL32.Thread32Next.restype = wintypes.BOOL
_KERNEL32.OpenThread.argtypes = (_DWORD, wintypes.BOOL, _DWORD)
_KERNEL32.OpenThread.restype = _HANDLE
_KERNEL32.ResumeThread.argtypes = (_HANDLE,)
_KERNEL32.ResumeThread.restype = _DWORD
_KERNEL32.CloseHandle.argtypes = (_HANDLE,)
_KERNEL32.CloseHandle.restype = wintypes.BOOL


def _win_error(operation: str) -> OSError:
    return OSError(ctypes.get_last_error(), operation)


def _close(handle: int | None) -> None:
    if handle:
        _KERNEL32.CloseHandle(handle)


def _single_suspended_thread(pid: int) -> int:
    snapshot = _KERNEL32.CreateToolhelp32Snapshot(0x00000004, 0)  # TH32CS_SNAPTHREAD
    if snapshot == ctypes.c_void_p(-1).value:
        raise _win_error("CreateToolhelp32Snapshot")
    try:
        entry = _ThreadEntry()
        entry.dwSize = ctypes.sizeof(_ThreadEntry)
        if not _KERNEL32.Thread32First(snapshot, ctypes.byref(entry)):
            raise _win_error("Thread32First")
        matches = []
        while True:
            if entry.th32OwnerProcessID == pid:
                matches.append(entry.th32ThreadID)
            if not _KERNEL32.Thread32Next(snapshot, ctypes.byref(entry)):
                if ctypes.get_last_error() != 18:  # ERROR_NO_MORE_FILES
                    raise _win_error("Thread32Next")
                break
        if len(matches) != 1:
            raise RuntimeError("expected exactly one suspended primary thread")
        return matches[0]
    finally:
        _close(snapshot)


class WindowsJob:
    def __init__(self, handle: int):
        self._handle = handle

    def close(self) -> None:
        if self._handle:
            if not _KERNEL32.CloseHandle(self._handle):
                raise _win_error("CloseHandle(job)")
            self._handle = None


def _assign(job: int, process_handle: int) -> None:
    if not _KERNEL32.AssignProcessToJobObject(job, process_handle):
        raise _win_error("AssignProcessToJobObject")


def launch(argv: tuple[str, ...], cwd: os.PathLike[str]) -> tuple[subprocess.Popen[str], WindowsJob]:
    """Create suspended, assign to a non-breakaway kill-on-close job, then resume."""
    job = _KERNEL32.CreateJobObjectW(None, None)
    if not job:
        raise _win_error("CreateJobObjectW")
    process = None
    try:
        limits = _ExtendedLimit()
        limits.BasicLimitInformation.LimitFlags = 0x00002000  # JOB_OBJECT_LIMIT_KILL_ON_JOB_CLOSE
        if not _KERNEL32.SetInformationJobObject(job, 9, ctypes.byref(limits), ctypes.sizeof(limits)):
            raise _win_error("SetInformationJobObject")
        process = subprocess.Popen(
            argv, cwd=cwd, stdin=subprocess.DEVNULL, stdout=subprocess.PIPE,
            stderr=subprocess.PIPE, text=True, encoding="utf-8", errors="replace",
            close_fds=True, creationflags=0x00000004,  # CREATE_SUSPENDED; no breakaway flag
        )
        # Holding Popen's process handle prevents PID reuse while OpenProcess runs.
        process_handle = _KERNEL32.OpenProcess(0x0100 | 0x0001, False, process.pid)
        if not process_handle:
            raise _win_error("OpenProcess")
        try:
            _assign(job, process_handle)
        finally:
            _close(process_handle)
        thread_id = _single_suspended_thread(process.pid)
        thread_handle = _KERNEL32.OpenThread(0x0002, False, thread_id)  # THREAD_SUSPEND_RESUME
        if not thread_handle:
            raise _win_error("OpenThread")
        try:
            if _KERNEL32.ResumeThread(thread_handle) != 1:
                raise _win_error("ResumeThread")
        finally:
            _close(thread_handle)
        return process, WindowsJob(job)
    except Exception:
        # Close the job first: if assigned, the kernel kills every member.
        _close(job)
        if process is not None:
            if process.poll() is None:
                process.kill()  # Popen holds this exact process handle; no PID lookup.
            process.wait(timeout=2)
            if process.stdout is not None:
                process.stdout.close()
            if process.stderr is not None:
                process.stderr.close()
        raise
