// Generic file upload to the VPS via SFTP.
// Usage: VPS_HOST=.. VPS_KEY_PATH=.. node scripts/vps-put.js <localPath> <remotePath> [modeOctal]
const { connectSsh, sftp, putFile } = require("./lib/ssh");

const [localPath, remotePath, mode] = process.argv.slice(2);
if (!localPath || !remotePath) {
  console.error("Usage: node vps-put.js <localPath> <remotePath> [modeOctal]");
  process.exit(1);
}

connectSsh()
  .then(async (conn) => {
    const sf = await sftp(conn);
    await putFile(sf, localPath, remotePath, mode ? parseInt(mode, 8) : undefined);
    conn.end();
    console.log(`uploaded ${localPath} -> ${remotePath}`);
  })
  .catch((e) => {
    console.error("SSH:", e.message);
    process.exit(1);
  });
