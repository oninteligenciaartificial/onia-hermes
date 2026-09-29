{ v=$NF; sub(/ms$/,"",v); a[n++]=v+0 }
END{ if(n==0){print "n=0"; exit}; asort(a); printf "n=%d p50=%d p95=%d p99=%d max=%d\n", n, a[int(n*0.5)+1], a[int(n*0.95)+1], a[int(n*0.99)+1], a[n] }
