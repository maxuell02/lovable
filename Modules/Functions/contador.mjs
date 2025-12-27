import fs from 'node:fs';
import path from 'node:path';

const FILE = path.resolve(process.cwd(), 'status.json');

function loadStats() {
  try {
    const raw = fs.readFileSync(FILE, 'utf8');
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function saveStats(stats) {
  fs.writeFileSync(FILE, JSON.stringify(stats, null, 2));
}

export function contabilizarUso(code) {
  const stats = loadStats();
  if (!stats[code]) {
    stats[code] = { utilizado: 0, time: [] };
  }
  stats[code].utilizado += 1;
  stats[code].time.push(
    new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })
  );
  saveStats(stats);
}
