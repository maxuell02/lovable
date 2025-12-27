export const PageMultiplication = { copies: 10, max: 100 }; 

export async function askCopiesCli(defaultCopies = 1, fallback = 1) {
  const { createInterface } = await import('node:readline/promises');
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  let answer = '';
  try {
    console.log(`Aguardando entrada no terminal para quantidade de telas...`);
    answer = await rl.question(`Quantas telas deseja abrir? (máximo ${PageMultiplication.max}, padrão ${defaultCopies}): `);
  } catch {}
  try { rl.close(); } catch {}
  const parsed = Number(answer);
  const base = Number.isFinite(parsed) ? parsed : (Number.isFinite(defaultCopies) ? defaultCopies : fallback);
  const n = Math.max(1, Math.min(Number(base) || 1, PageMultiplication.max));
  if (!Number.isFinite(parsed)) {
    console.log(`Entrada inválida ou indisponível. Usando padrão: ${n}`);
  }
  return n;
}

export async function askConfirmation(question) {
  const { createInterface } = await import('node:readline/promises');
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  let answer = '';
  try {
    answer = await rl.question(`${question} (y/n): `);
  } catch {}
  try { rl.close(); } catch {}
  return ['y', 'yes', 's', 'sim'].includes(answer.trim().toLowerCase());
}

export async function multiplyCurrentPage(page, copies) {
  const ctx = page.context();
  const url = page.url();
  const n = Math.max(1, Math.min(Number(copies) || 1, PageMultiplication.max));
  for (let i = 0; i < n; i++) {
    try {
      const p = await ctx.newPage();
      await p.goto(url, { waitUntil: 'domcontentloaded' });
    } catch {}
  }
  return n;
}
