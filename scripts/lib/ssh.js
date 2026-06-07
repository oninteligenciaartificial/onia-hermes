const fs = require("node:fs");
const path = require("node:path");
const { Client } = require("ssh2");

function requireEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing env var ${name}`);
  return value;
}

function connectSsh() {
  const host = requireEnv("VPS_HOST");
  const username = process.env.VPS_USER || "root";

  const privateKeyPath = process.env.VPS_KEY_PATH;
  const privateKey = privateKeyPath
    ? fs.readFileSync(path.resolve(privateKeyPath))
    : undefined;

  const password = process.env.VPS_PASSWORD;

  if (!privateKey && !password) {
    throw new Error(
      "Provide VPS_KEY_PATH (recommended) or VPS_PASSWORD to connect."
    );
  }

  const conn = new Client();
  return new Promise((resolve, reject) => {
    conn
      .on("ready", () => resolve(conn))
      .on("error", reject)
      .connect({
        host,
        username,
        privateKey,
        password,
        readyTimeout: 30000,
      });
  });
}

function exec(conn, command) {
  return new Promise((resolve, reject) => {
    conn.exec(command, { pty: false }, (err, stream) => {
      if (err) return reject(err);
      let stdout = "";
      let stderr = "";
      stream
        .on("close", (code) => resolve({ code, stdout, stderr }))
        .on("data", (d) => {
          stdout += d.toString("utf8");
        });
      stream.stderr.on("data", (d) => {
        stderr += d.toString("utf8");
      });
    });
  });
}

function sftp(conn) {
  return new Promise((resolve, reject) => {
    conn.sftp((err, sftpClient) => {
      if (err) return reject(err);
      resolve(sftpClient);
    });
  });
}

function putFile(sftpClient, localPath, remotePath, modeOctal) {
  return new Promise((resolve, reject) => {
    sftpClient.fastPut(localPath, remotePath, (err) => {
      if (err) return reject(err);
      if (!modeOctal) return resolve();
      sftpClient.chmod(remotePath, modeOctal, (chmodErr) => {
        if (chmodErr) return reject(chmodErr);
        resolve();
      });
    });
  });
}

module.exports = {
  connectSsh,
  exec,
  sftp,
  putFile,
  requireEnv,
};

