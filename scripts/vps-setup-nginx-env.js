#!/usr/bin/env node
"use strict";
const { connectSsh, exec } = require('./lib/ssh');

connectSsh().then(async conn => {
  console.log('Installing nginx...');
  const ng = await exec(conn, 'apt-get install -y nginx 2>&1 | tail -3 ; systemctl enable nginx ; systemctl start nginx ; systemctl is-active nginx');
  console.log(ng.stdout);

  console.log('Configuring hermes-assets location...');
  const conf = await exec(conn, `
mkdir -p /var/www/html/hermes-assets/videos && \
chmod 755 /var/www/html/hermes-assets && \
chmod 755 /var/www/html/hermes-assets/videos && \
echo "nginx + dir configured"
`);
  console.log(conf.stdout);
  conn.end();
}).catch(e => console.error(e.message));
