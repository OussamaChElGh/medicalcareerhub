import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, unlinkSync } from 'node:fs';
import net from 'node:net';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PID_FILE = resolve(ROOT, '.dev-server.pid');
const PORT = Number(process.env.PORT || 3000);
const HEALTH_URL = `http://127.0.0.1:${PORT}/api/premium/config`;
const COMMAND = process.argv[2] || 'status';
const POLL_MS = 300;

function readPid() {
  if (!existsSync(PID_FILE)) return null;
  const raw = readFileSync(PID_FILE, 'utf8').trim();
  const pid = Number(raw);
  return Number.isInteger(pid) && pid > 0 ? pid : null;
}

function removePid() {
  if (existsSync(PID_FILE)) unlinkSync(PID_FILE);
}

function isAlive(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

function delay(ms) {
  return new Promise((resolveDelay) => setTimeout(resolveDelay, ms));
}

function portInUse(port) {
  return new Promise((resolvePort) => {
    const socket = net.createConnection({ host: '127.0.0.1', port });
    let settled = false;

    const finish = (inUse) => {
      if (settled) return;
      settled = true;
      socket.destroy();
      resolvePort(inUse);
    };

    socket.setTimeout(1_000);
    socket.once('connect', () => finish(true));
    socket.once('timeout', () => finish(false));
    socket.once('error', () => finish(false));
  });
}

async function isHealthy() {
  try {
    const response = await fetch(HEALTH_URL, {
      signal: AbortSignal.timeout(1_200),
    });
    return response.ok;
  } catch {
    return false;
  }
}

function getListenerPid() {
  if (process.platform === 'win32') {
    const script = `(Get-NetTCPConnection -LocalPort ${PORT} -State Listen -ErrorAction SilentlyContinue | Select-Object -First 1).OwningProcess`;
    const result = spawnSync(
      'powershell.exe',
      ['-NoProfile', '-NonInteractive', '-Command', script],
      { encoding: 'utf8', windowsHide: true },
    );
    const firstLine = (result.stdout || '')
      .split(/\r?\n/)
      .map((line) => line.trim())
      .find(Boolean);
    const pid = Number(firstLine);
    return Number.isInteger(pid) && pid > 0 ? pid : null;
  }

  const result = spawnSync(
    'lsof',
    ['-ti', `tcp:${PORT}`, '-sTCP:LISTEN'],
    { encoding: 'utf8' },
  );
  const firstLine = (result.stdout || '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .find(Boolean);
  const pid = Number(firstLine);
  return Number.isInteger(pid) && pid > 0 ? pid : null;
}

function killTree(pid) {
  if (!pid || !isAlive(pid)) return false;

  if (process.platform === 'win32') {
    const result = spawnSync(
      'taskkill',
      ['/PID', String(pid), '/T', '/F'],
      { stdio: 'ignore', windowsHide: true },
    );
    return result.status === 0;
  }

  try {
    process.kill(-pid, 'SIGTERM');
    return true;
  } catch {
    try {
      process.kill(pid, 'SIGTERM');
      return true;
    } catch {
      return false;
    }
  }
}

async function waitForPortFree(timeoutMs = 5_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (!(await portInUse(PORT))) return true;
    await delay(POLL_MS);
  }
  return !(await portInUse(PORT));
}

async function stop() {
  const managedPid = readPid();
  const stopped = [];

  if (managedPid && isAlive(managedPid)) {
    if (killTree(managedPid)) stopped.push(managedPid);
  }

  removePid();
  await delay(400);

  const listenerPid = getListenerPid();
  if (listenerPid && listenerPid !== managedPid && isAlive(listenerPid)) {
    if (await isHealthy()) {
      if (killTree(listenerPid)) stopped.push(listenerPid);
    } else {
      console.error(
        `El puerto ${PORT} esta ocupado por el PID ${listenerPid}, que no responde como Arcanum. No se ha detenido.`,
      );
      process.exitCode = 1;
      return;
    }
  }

  const free = await waitForPortFree();
  if (!free) {
    console.error(`El puerto ${PORT} sigue ocupado despues de detener el servidor.`);
    process.exitCode = 1;
    return;
  }

  if (stopped.length > 0) {
    console.log(`Servidor detenido (PID ${stopped.join(', ')}).`);
  } else {
    console.log(`No hay ningun servidor de Arcanum en el puerto ${PORT}.`);
  }
}

async function status() {
  const managedPid = readPid();
  const alive = managedPid ? isAlive(managedPid) : false;
  const healthy = await isHealthy();
  const listenerPid = getListenerPid();
  const inUse = listenerPid !== null || (await portInUse(PORT));

  console.log(
    managedPid
      ? `PID gestionado: ${managedPid} (${alive ? 'vivo' : 'no vivo'})`
      : 'PID gestionado: ninguno',
  );
  console.log(
    listenerPid ? `PID escuchando: ${listenerPid}` : 'PID escuchando: ninguno',
  );
  console.log(`Salud: ${healthy ? 'OK' : 'no responde'}`);
  console.log(`Puerto ${PORT}: ${inUse ? 'ocupado' : 'libre'}.`);
}

async function main() {
  switch (COMMAND) {
    case 'stop':
      await stop();
      break;
    case 'status':
      await status();
      break;
    default:
      console.error(`Comando no reconocido: ${COMMAND}`);
      console.error('Uso: node scripts/dev-server.mjs [stop|status]');
      process.exitCode = 1;
  }
}

await main();
