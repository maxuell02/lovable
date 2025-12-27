import { chromium } from 'playwright-core';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { handleNewPage } from './modules/NewPage/gettingStarted.mjs';
import { manipulateOutlookLogin } from './modules/Pages/outlook.mjs';
import { manipulateInviteJoin } from './modules/Pages/inviteJoin.mjs';
import { setEmailAndCode } from './modules/Functions/state.mjs';
import { getInvitationCode } from './modules/Functions/convite.mjs';

const openedPages = [];

async function openTabViaWindow(opener, url) {
  const popup = await opener.context().newPage();
  await popup.goto(url, { waitUntil: 'domcontentloaded' });
  return popup;
}

async function main() {
  const code = getInvitationCode();
  const SECOND_URL = `https://lovable.dev/invite/${code}`;
  const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'edge-profile-'));  
  const context = await chromium.launchPersistentContext(userDataDir, {
    channel: 'msedge',
    headless: false, 
    locale: 'pt-BR',
    extraHTTPHeaders: { 'Accept-Language': 'pt-BR,pt;q=0.9', 'Save-Data': 'on' },
    viewport: { width: 1280, height: 720 },
    screen: { width: 1280, height: 720 },
    deviceScaleFactor: 1
  });
  const LOW_CONSUMPTION = process.env.LOW_CONSUMPTION !== 'false';
  await context.route('**/*', (route) => {
    const req = route.request();
    const type = req.resourceType();
    const url = req.url();
    const isOutlook = /:\/\/outlook\.live\.com/i.test(url);
    if (isOutlook && LOW_CONSUMPTION && type === 'stylesheet') return route.abort();
    if (isOutlook && (type === 'image' || type === 'font' || type === 'media')) return route.abort();
    if (isOutlook && type === 'image' && (/favicon/i.test(url) || /\.ico(\?.*)?$/i.test(url) || /\/icons?\//i.test(url))) return route.abort();
    return route.continue();
  });
  
const URL = 'https://outlook.live.com/mail/0/?prompt=select_account&deeplink=mail%2F0%2F';

  const outlookPage = context.pages()[0] || await context.newPage();
  await outlookPage.goto(URL, { waitUntil: 'domcontentloaded', timeout: 60000 }); 
  context.on('page', async (p) => {
    openedPages.push(p);
    await handleNewPage(p);
  });
  context.on('response', async (res) => {
    try {
      if (res.status() === 429) {
        const f = res.request().frame();
        const pg = f && 'page' in f ? f.page() : null;
        if (pg) {
          await pg.waitForTimeout(2000);
          await pg.reload({ waitUntil: 'domcontentloaded' });
        }
      }
    } catch {}
  });

  const lovablePage = await openTabViaWindow(outlookPage, SECOND_URL);
  const emailToCopy = await manipulateOutlookLogin(outlookPage);
  setEmailAndCode(emailToCopy, code);
  
  await manipulateInviteJoin(lovablePage, emailToCopy);
  openedPages.push(lovablePage);
  await handleNewPage(lovablePage);



  console.log('Total de páginas no contexto:', context.pages().length);
  process.once('SIGINT', async () => {
    try { await context.close(); } catch {}
    try { fs.rmSync(userDataDir, { recursive: true, force: true }); } catch {}
    process.exit(0);
  });
  process.once('SIGTERM', async () => {
    try { await context.close(); } catch {}
    try { fs.rmSync(userDataDir, { recursive: true, force: true }); } catch {}
    process.exit(0);
  });
  await new Promise(() => {});
}

main().catch((err) => {
  console.error('Erro ao abrir Camoufox:', err);
  process.exit(1);
});
