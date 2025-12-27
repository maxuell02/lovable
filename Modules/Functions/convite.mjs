import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const normalize = (s) => {
  s = String(s || '').trim();
  if (!s) return '';
  if (s.includes('/invite/')) {
    try {
      return new URL(s).pathname.split('/').pop() || '';
    } catch (_) {
      const i = s.indexOf('/invite/');
      return s.slice(i + 8).split(/[\s"']/)[0];
    }
  }
  return s.replace(/[`\"]/g, '');
};

const collect = (v, out = []) => {
  if (Array.isArray(v)) v.forEach(x => collect(x, out));
  else if (v && typeof v === 'object') Object.values(v).forEach(x => collect(x, out));
  else out.push(String(v));
  return out;
};

const loadCode = (file) => {
  const data = JSON.parse(fs.readFileSync(file));
  const email = Object.keys(data)[0];
  if (email && data[email]?.[0]) {
    const url = String(data[email][0]).trim();
    const code = (url.split('/invite/')[1] || new URL(url).pathname.split('/').pop() || '').trim();
    if (!code) throw new Error('Código de convite inválido em love-invite.json');
    return code;
  }
  throw new Error('Nenhum código de convite válido encontrado em love-invite.json');
};

const checkBlacklist = (code, file) => {
  try {
    if (!fs.existsSync(file)) return false;
    const raw = fs.readFileSync(file, 'utf8');
    let values = [];
    try { values = collect(JSON.parse(raw)); }
    catch (_) { values = collect(raw.split(/\n+/)); }
    return values.map(normalize).map(String).filter(Boolean).includes(code);
  } catch (_) {
    return false;
  }
};

const invitePath = path.join(__dirname, '../../invite.json');
const blacklistPath = path.join(__dirname, '../../blacklist.json');

const getInvitationCode = (inviteFile = invitePath, blacklistFile = blacklistPath) => {
  try {
    const code = loadCode(inviteFile);
    if (checkBlacklist(code, blacklistFile)) {
      console.error(`Código '${code}' está na blacklist. Abortando execução.`);
      process.exit(0);
    }
    console.log(`Código de convite carregado: ${code}`);
    return code;
  } catch (error) {
    console.error(`Erro: ${error.message}`);
    process.exit(1);
  }
};

export { normalize as normalizeInviteCode, collect as collectCodes, loadCode as loadInvitationCode, checkBlacklist as isBlacklisted, getInvitationCode };
