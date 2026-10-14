"""Defense-in-depth draft; not called by the disabled public path."""
import ipaddress,socket
from urllib.parse import urlsplit
MAX_BYTES=2_000_000
MIMES={"text/html","text/css","text/plain","application/javascript","text/javascript","application/json","image/jpeg","image/png","image/webp","font/woff2","application/font-woff"}
class Blocked(ValueError): pass

def validate_url(url,allow_hosts,resolver=socket.getaddrinfo):
    p=urlsplit(url)
    if p.scheme not in {"http","https"} or not p.hostname or p.username is not None or p.password is not None: raise Blocked("scheme, host, or credentials")
    host=p.hostname.rstrip(".").encode("idna").decode().lower()
    allow={h.rstrip(".").encode("idna").decode().lower() for h in allow_hosts}
    if host not in allow: raise Blocked("host not allowlisted")
    port=80 if p.scheme=="http" else 443
    if p.port not in (None,port): raise Blocked("port blocked")
    try: ips=(str(ipaddress.ip_address(host)),)
    except ValueError:
        try: ips=tuple(sorted({r[4][0] for r in resolver(host,p.port or port,type=socket.SOCK_STREAM)}))
        except (OSError,ValueError) as e: raise Blocked("DNS failed") from e
    if not ips or any(not ipaddress.ip_address(i).is_global for i in ips): raise Blocked("private/mixed DNS")
    return host,ips

def route_handler(allow_hosts):
    def handle(route):
        try:
            validate_url(route.request.url,allow_hosts)
            r=route.fetch(max_redirects=0,max_retries=0,timeout=10000)
            h=r.headers; mime=h.get("content-type","").split(";",1)[0].strip().lower(); size=h.get("content-length")
            if r.status<200 or r.status>=300 or mime not in MIMES: route.abort(); return
            if size is not None and (not size.isdigit() or int(size)>MAX_BYTES): route.abort(); return
            if len(r.body())>MAX_BYTES: route.abort(); return
            route.fulfill(response=r)
        except Exception:
            try: route.abort()
            except Exception: pass
    return handle
