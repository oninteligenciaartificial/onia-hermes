#!/usr/bin/env python3
"""Single authorized read-only cloud status call; stdlib only."""
import hashlib,json,os,pathlib,re,shlex,shutil,signal,subprocess,sys,tempfile,time
from datetime import datetime,timezone
TASK="01a13910-ec21-768c-abe9-2f8250a4401b"
SSH_KEY=r"C:\Users\PC\.ssh\onia_hermes_vps_ed25519"
KNOWN=r"C:\Users\PC\.ssh\known_hosts"
TARGET="root@187.77.16.63"
CODEX="/opt/onia-codex-cli/0.161.0/node_modules/.bin/codex"
HOME="/root"; CHOME="/opt/onia-codex-cli/0.161.0/auth-home"
FRAME="__CLOUD_STATUS_PROBE_DONE__:"
REMOTE=r'''import json,os,pathlib,re,shutil,signal,subprocess,sys,tempfile,time
CODEX="/opt/onia-codex-cli/0.161.0/node_modules/.bin/codex"; TASK="01a13910-ec21-768c-abe9-2f8250a4401b"
BASE=pathlib.Path("/tmp"); scratch=None; keeper=None; child=None; stopped=False; quiet=False; cleaned=False; rc=None; out=b""; err=b""
def members(g,k):
 p=pathlib.Path("/proc"); found=[]
 if not p.is_dir(): return None
 try:
  with os.scandir(p) as es:
   for i,e in enumerate(es):
    if i>=8192:return None
    if not e.name.isdigit():continue
    try:r=pathlib.Path(e.path,"stat").read_text(encoding="ascii")
    except FileNotFoundError:continue
    except OSError:return None
    j=r.rfind(")"); f=r[j+1:].split() if j>=0 else []
    if len(f)<3:return None
    try:s=f[0]; pg=int(f[2])
    except (ValueError,IndexError):return None
    if pg==g and int(e.name)!=k and s not in ("Z","X"):found.append(int(e.name))
 except OSError:return None
 return found
def cleanup():
 global stopped,quiet
 if keeper is None:return child is None or child.poll() is not None
 try:os.killpg(keeper.pid,signal.SIGTERM)
 except ProcessLookupError:return False
 end=time.monotonic()+1.25; m=members(keeper.pid,keeper.pid)
 while m and time.monotonic()<end:time.sleep(.05);m=members(keeper.pid,keeper.pid)
 try:os.killpg(keeper.pid,signal.SIGKILL)
 except ProcessLookupError:m=None
 end=time.monotonic()+.45
 while m is not None and m and time.monotonic()<end:time.sleep(.025);m=members(keeper.pid,keeper.pid)
 quiet=m==[]
 if child is not None:
  try:child.wait(timeout=.1)
  except subprocess.TimeoutExpired:pass
  stopped=child.poll() is not None
 try:keeper.wait(timeout=.1)
 except subprocess.TimeoutExpired:quiet=False
 return quiet and stopped and keeper.returncode is not None
def sig(a,b):raise SystemExit(124)
signal.signal(signal.SIGTERM,sig);signal.signal(signal.SIGHUP,sig)
status="UNKNOWN"; http="UNKNOWN"; group_ok=False
try:
 base=BASE.resolve(strict=True)
 if base!=pathlib.Path("/tmp") or not os.access(base,os.W_OK|os.X_OK):raise SystemExit(120)
 scratch=pathlib.Path(tempfile.mkdtemp(prefix="codex-cloud-status-",dir=str(base))).resolve(strict=True)
 st=scratch.lstat()
 if scratch.parent!=base or not scratch.name.startswith("codex-cloud-status-") or st.st_uid!=os.getuid() or st.st_mode&0o777!=0o700 or scratch.is_symlink():raise SystemExit(120)
 if not os.path.isfile(CODEX) or not os.access(CODEX,os.X_OK):raise SystemExit(121)
 env={"PATH":"/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin","HOME":"/root","CODEX_HOME":"/opt/onia-codex-cli/0.161.0/auth-home","LANG":"C.UTF-8","TZ":"UTC","NO_COLOR":"1"}
 keeper=subprocess.Popen([sys.executable,"-c","import signal,time;signal.signal(signal.SIGTERM,signal.SIG_IGN);time.sleep(60)"],cwd=str(scratch),env=env,stdin=subprocess.DEVNULL,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL,process_group=0)
 if keeper.poll() is not None or keeper.pid==os.getpid():keeper=None;raise SystemExit(122)
 child=subprocess.Popen([CODEX,"cloud","status",TASK],cwd=str(scratch),env=env,stdin=subprocess.DEVNULL,stdout=subprocess.PIPE,stderr=subprocess.PIPE,process_group=keeper.pid)
 try:out,err=child.communicate(timeout=25);rc=child.returncode;stopped=child.poll() is not None
 except subprocess.TimeoutExpired:rc=124
 if rc==124:group_ok=cleanup()
 first=out.splitlines()[0] if out else b""
 m=re.match(rb"^\[(READY|PENDING|RUNNING|ERROR)\](?:\s|$)",first)
 if m:status=m.group(1).decode("ascii")
 s=(out+b"\n"+err).decode("utf-8","ignore")
 m=re.search(r"(?<![0-9])([1-5][0-9][0-9]) (Not Found|Unauthorized|Forbidden|Too Many Requests|Bad Gateway|Service Unavailable|Gateway Timeout)(?![A-Za-z])",s)
 if m:http=m.group(1)
finally:
 if keeper is not None and not group_ok:group_ok=cleanup()
 if scratch is not None and group_ok:
  try:
   p=scratch.resolve(strict=True);st=p.lstat()
   if p.parent==BASE.resolve(strict=True) and p.name.startswith("codex-cloud-status-") and st.st_uid==os.getuid() and not p.is_symlink():shutil.rmtree(p);cleaned=True
  except (OSError,RuntimeError):pass
 if child is not None and child.poll() is not None:stopped=True
 report={"returncode":rc,"status":status,"http_code":http,"stdout_bytes":len(out),"stderr_bytes":len(err),"cleanup_confirmed":bool(group_ok and cleaned and stopped),"hold":not bool(group_ok and cleaned and stopped)}
 print("__CLOUD_STATUS_PROBE_DONE__:"+json.dumps(report,separators=(",",":"),sort_keys=True),flush=True)
sys.exit(0 if report["cleanup_confirmed"] else 123)
'''
def main():
 source=pathlib.Path(__file__).resolve(); sha=hashlib.sha256(source.read_bytes()).hexdigest().upper(); started=time.monotonic(); frame=None; hold=None; ssh_rc=None
 ssh=shutil.which("ssh")
 if not ssh or not pathlib.Path(SSH_KEY).is_file() or not pathlib.Path(KNOWN).is_file():hold="pinned_ssh_material_unavailable"
 else:
  remote="python3 -c "+shlex.quote(REMOTE)
  argv=[ssh,"-T","-i",SSH_KEY,"-o","BatchMode=yes","-o","StrictHostKeyChecking=yes","-o","IdentitiesOnly=yes","-o","ClearAllForwardings=yes","-o",f"UserKnownHostsFile={KNOWN}","-o","ConnectTimeout=8",TARGET,remote]
  try:
   p=subprocess.Popen(argv,stdin=subprocess.DEVNULL,stdout=subprocess.PIPE,stderr=subprocess.PIPE,creationflags=getattr(subprocess,"CREATE_NEW_PROCESS_GROUP",0))
   try:raw,discard=p.communicate(timeout=35);ssh_rc=p.returncode
   except subprocess.TimeoutExpired:
    p.terminate()
    try:raw,discard=p.communicate(timeout=2);ssh_rc=p.returncode
    except subprocess.TimeoutExpired:p.kill();raw,discard=p.communicate(timeout=2);ssh_rc=p.returncode
    hold="local_watchdog_timeout"
   fs=[x[len(FRAME):] for x in raw.decode("utf-8","ignore").splitlines() if x.startswith(FRAME)]
   if len(fs)==1:
    try:frame=json.loads(fs[0])
    except Exception:hold="invalid_supervisor_frame"
   elif hold is None:hold="supervisor_frame_missing_or_ambiguous"
  except Exception:hold="local_driver_error"
 if frame is None:frame={"returncode":None,"status":"UNKNOWN","http_code":"UNKNOWN","stdout_bytes":0,"stderr_bytes":0,"cleanup_confirmed":False}
 elif hold is None and (frame.get("hold") or ssh_rc!=0):hold="remote_cleanup_or_ssh_unconfirmed"
 status=frame.get("status");status=status if status in {"READY","PENDING","RUNNING","ERROR"} else "UNKNOWN"
 hc=frame.get("http_code");hc=hc if hc in {"400","401","403","404","408","429","500","502","503","504"} else "UNKNOWN"
 rec={"timestamp_utc":datetime.now(timezone.utc).isoformat().replace("+00:00","Z"),"command":"codex cloud status <authorized-task-id>","target":"existing-cloud-task-literal","returncode":frame.get("returncode"),"elapsed_seconds":round(time.monotonic()-started,3),"status":status,"http_code":hc,"stdout_bytes":frame.get("stdout_bytes",0),"stderr_bytes":frame.get("stderr_bytes",0),"cli_invocations":1,"model_requests":0,"hold_reason":hold,"cleanup_confirmed":bool(frame.get("cleanup_confirmed")),"source_sha256":sha}
 path=source.parent/("receipt-"+datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%S_%fZ")+".json")
 with path.open("x",encoding="utf-8") as f:json.dump(rec,f,separators=(",",":"),sort_keys=True);f.write("\n");f.flush();os.fsync(f.fileno())
 print(json.dumps({"receipt":path.name,"status":status,"http_code":hc,"hold":bool(hold),"source_sha256":sha},separators=(",",":")))
 return 0 if hold is None else 2
if __name__=="__main__":raise SystemExit(main())
