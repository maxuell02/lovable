import { Camoufox, launchOptions } from 'camoufox-js';
import { firefox } from 'playwright-core'; 
import { manipulateOutlookCreate } from './modules/Pages/outlookCreate.mjs'; 
import { setEmailAndCode } from './Modules/Functions/state.mjs';
import { handleNewPage } from './Modules/NewPage/gettingStarted.mjs'; 

const openedPages = []; 

async function main() { 
  const browser = await firefox.launch({
    ...(await launchOptions({ headless: false, humanize: false })),
    firefoxUserPrefs: {
      'browser.link.open_newwindow': 1,
      'browser.link.open_newwindow.restriction': 0,
      'dom.disable_open_during_load': false,
    },
    proxy: {
      server: 'http://74.81.81.81:823',
      username: '07036529c0d3abe7eaed__cr.br',
      password: 'f973a7cc868a7c7e'
    }
  });
  const context = await browser.newContext({
    locale: 'pt-BR',
    extraHTTPHeaders: { 'Accept-Language': 'pt-BR,pt;q=0.9', 'Save-Data': 'on' },
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
  
const URL = 'https://outlook.live.com/mail/0/?prompt=create_account';

  const outlookPage = await context.newPage();
  await outlookPage.goto(URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  const title = await outlookPage.title();
  console.log('Página carregada:', title);
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
  const emailToCopy = await manipulateOutlookCreate(outlookPage);
  setEmailAndCode(emailToCopy); 


  console.log('Total de páginas no contexto:', context.pages().length);
  process.once('SIGINT', async () => {
    try { await context.close(); } catch {}
    try { await browser.close(); } catch {}
    process.exit(0);
  });
  process.once('SIGTERM', async () => {
    try { await context.close(); } catch {}
    try { await browser.close(); } catch {}
    process.exit(0);
  });
  await new Promise(() => {});
}

main().catch((err) => {
  console.error('Erro ao abrir Camoufox:', err);
  process.exit(1);
});
