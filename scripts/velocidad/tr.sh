T=$(docker ps --format "{{.Names}}" | grep easypanel-traefik | head -1)
docker logs --since 72h $T 2>/dev/null > /tmp/tr_ro.log
echo "lines=$(wc -l < /tmp/tr_ro.log) since=$(head -1 /tmp/tr_ro.log | cut -d[ -f2 | cut -d] -f1)"
awk -F'"' 'NF>=11{print $8}' /tmp/tr_ro.log | sort | uniq -c | sort -rn | head -12
echo "--- onia-platform backend: class count p50 p90 p99 max (ms), status>=500 count"
awk -F'"' 'NF>=11 && $10 ~ /onia-platform[^-]|onia-platform:|onia-platform\// && $10 !~ /qa/ {split($2,r," "); m=r[1]; p=r[2]; d=$11; gsub(/[^0-9]/,"",d); split($3,s," "); st=s[1];
 c="page-GET"; if (p ~ /_rsc=/) c="rsc-nav"; else if (m=="POST" && p !~ /^\/api\//) c="server-action-POST"; else if (p ~ /^\/api\//) c="api-" m; else if (p ~ /^\/_next\//) c="static"; else if (m!="GET") c="other-" m;
 print c, d, st}' /tmp/tr_ro.log > /tmp/tr_ro.cls
for c in $(cut -d' ' -f1 /tmp/tr_ro.cls | sort -u); do grep "^$c " /tmp/tr_ro.cls | cut -d' ' -f2 | sort -n | awk -v c=$c '{a[NR]=$1} END{printf "%s n=%d p50=%d p90=%d p99=%d max=%d\n",c,NR,a[int(NR*0.5)+1],a[int(NR*0.9)+1],a[int(NR*0.99)+1],a[NR]}'; done
echo "5xx=$(awk '$3>=500' /tmp/tr_ro.cls | wc -l) 4xx=$(awk '$3>=400 && $3<500' /tmp/tr_ro.cls | wc -l)"
echo "--- slowest page/rsc paths (path without query, count, p90 ms)"
awk -F'"' 'NF>=11 && $10 ~ /onia-platform/ && $10 !~ /qa/ {split($2,r," "); p=r[2]; sub(/\?.*/,"",p); d=$11; gsub(/[^0-9]/,"",d); if (p !~ /^\/_next|^\/api\/|\.(png|svg|ico|woff2|js|json|webmanifest)$/) print p, d}' /tmp/tr_ro.log | awk '{gsub(/\/[0-9a-f-]{20,}/,"/:id",$1); print}' | sort -k1,1 -k2,2n | awk '{c[$1]++; v[$1,c[$1]]=$2} END{for(k in c){n=c[k]; if(n>=5) printf "%s n=%d p50=%d p90=%d max=%d\n",k,n,v[k,int(n*0.5)+1],v[k,int(n*0.9)+1],v[k,n]}}' | sort -t= -k4 -rn | head -15
rm -f /tmp/tr_ro.log /tmp/tr_ro.cls
