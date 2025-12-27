import fs from 'node:fs';
import path from 'node:path';

const CREDENTIALS_FILE = path.resolve(process.cwd(), 'credentials.txt');
const CREDENTIALS_FILED = path.resolve(process.cwd(), 'savedel.txt');

export function readFirstPassword() {
  try {
    const raw = fs.readFileSync(CREDENTIALS_FILE, 'utf8');
    const lines = raw.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    if (!lines.length) return null;
    const [, password] = lines[0].split('|');
    return String(password || '').trim() || null;
  } catch {
    return null;
  }
}

export function readPasswordForEmail(email) {
  try {
    const target = String(email || '').trim();
    if (!target) return readFirstPassword();
    const raw = fs.readFileSync(CREDENTIALS_FILE, 'utf8');
    const lines = raw.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    for (const l of lines) {
      const [e, p] = l.split('|');
      if (String(e || '').trim() === target) return String(p || '').trim() || null;
    }
    return readFirstPassword();
  } catch {
    return null;
  }
}

export function saveCredentials(email, password) {
  try {
    email = String(email || '').trim();
    password = String(password || '').trim() || readFirstPassword() || '';
    if (!email || !password) return;
    const line = `${email}|${password}\n`;
    fs.appendFileSync(CREDENTIALS_FILE, line, 'utf8');
  } catch {}
}

export function savedel(email, password) {
  try {
    email = String(email || '').trim();
    password = String(password || '').trim() || readFirstPassword() || '';
    if (!email || !password) return;
    const line = `${email}|${password}\n`;
    fs.appendFileSync(CREDENTIALS_FILED, line, 'utf8');
  } catch {}
}

export function readFirstEmail() {
  try {
    const raw = fs.readFileSync(CREDENTIALS_FILE, 'utf8');
    const lines = raw.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    if (!lines.length) return null;
    const [first] = lines;
    const [email] = first.split('|');
    const clean = String(email || '').trim();
    return clean || null;
  } catch {
    return null;
  }
}

export function deletemail(email) {
  try {
    const raw = fs.readFileSync(CREDENTIALS_FILE, 'utf8');
    const lines = raw.split(/\r?\n/);
    const target = String(email || '').trim();
    const filtered = lines.filter(l => {
      const s = String(l || '').trim();
      if (!s) return false;
      const [e] = s.split('|');
      return String(e || '').trim() !== target;
    });
    fs.writeFileSync(CREDENTIALS_FILE, (filtered.join('\n') + '\n'), 'utf8');
  } catch {}
}

export { CREDENTIALS_FILE };
