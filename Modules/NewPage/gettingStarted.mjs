import { generateRandomFirstName } from "../Functions/gerador.mjs"; 
import { askCopiesCli, multiplyCurrentPage, PageMultiplication, askConfirmation } from "../Functions/duplicate.mjs";
import { waitVisible, clickIfVisible, fillIfVisible, waitForUrl } from "../Functions/domHelpers.mjs"; 
import { publicado } from "../Functions/discord.mjs";
import { getEmailAndCode } from "../Functions/state.mjs";
import { contabilizarUso } from "../Functions/contador.mjs";

export function isAuthBase(u) {
  try {
    const url = typeof u === 'string' ? new URL(u) : new URL(u.url());
    return url.origin === 'https://lovable.dev' && url.pathname.startsWith('/auth/');
  } catch {
    return false;
  }
}


export async function handleNewPage(page) {
  await page.waitForLoadState('domcontentloaded');
  const url = page.url();
  console.log('Nova página detectada:', url);
  const startsAuth = isAuthBase(url);
  if (startsAuth) console.log('Detecção base /auth/ ativa');
  if (url === 'https://lovable.dev/getting-started') await manipulateGettingStarted(page);
  page.on('framenavigated', async (frame) => {
    if (frame === page.mainFrame()) {
      const current = frame.url();
      const authActive = isAuthBase(current);
      if (authActive) console.log('Detecção base /auth/ ativa');
      if (current === 'https://lovable.dev/getting-started') await manipulateGettingStarted(page);
    }
  });
  return page;
}

let handledGettingStarted = false;

export async function manipulateGettingStarted(page) {
  try {
    await page.waitForLoadState('domcontentloaded');
    if (handledGettingStarted) return;
    handledGettingStarted = true;
    const cont = page.getByRole('button', { name: 'Next' });
    try {
      await cont.waitFor({ state: 'visible', timeout: 0 });
      await cont.click();
    } catch (_) { 
    }
    const { emailToCopy, code } = getEmailAndCode();
    await contabilizarUso(code); 
    await publicado(emailToCopy, code);
     
    const nameInput = page.getByRole('textbox', { name: 'What\'s your name?' });
    await clickIfVisible(nameInput);
    await fillIfVisible(nameInput, generateRandomFirstName());
    await new Promise(resolve => setTimeout(resolve, 2000));

    const continuar = page.getByRole('button', { name: 'Next' });
    await clickIfVisible(continuar); 
    await clickIfVisible(page.getByRole('button', { name: 'Founder' }));
    await clickIfVisible(page.getByRole('button', { name: 'Just me' }));
    await waitVisible(page.locator('#chat-input'));
    ///pré finish
    await clickIfVisible(page.getByRole('link', { name: 'Screenshot of Ecommerce store' }));
    await clickIfVisible(page.getByRole('button', { name: 'Use Template' }));
    await clickIfVisible(page.getByRole('button', { name: 'Remix' }));

    await waitForUrl(page, '**/projects/**', 600000);  
    console.log('Projeto Criado');
    console.log('Solicitando quantidade pelo terminal...');
    const qty = await askCopiesCli(10, PageMultiplication.copies);
    console.log(`Quantidade informada/padrão utilizada: ${qty}`);
    await multiplyCurrentPage(page, qty);
    const allPages = page.context().pages();
    console.log(`Total de páginas abertas: ${allPages.length}`);  

    const targetPages = allPages.filter(p => p.url().includes('/projects/'));
    console.log(`Páginas alvo para publicação: ${targetPages.length}`);
    
    if (await askConfirmation('Deseja iniciar a publicação em todas as abas?')) {
      const publishTasks = targetPages.map(async (p) => { 
        try {  
          const publishBtn = p.getByRole('button', { name: 'Publish' });
          await publishBtn.waitFor({ state: 'visible', timeout: 10000 });
          await clickIfVisible(publishBtn);  
          await new Promise(resolve => setTimeout(resolve, 2000));
          await clickIfVisible(publishBtn);
          console.log(`[SUCESSO] Publicado na URL: ${p.url()}`);
        } catch (e) {
          console.log(`[FALHA] Erro ao tentar publicar na URL: ${p.url()} - ${e.message}`);
        }
      }); 

      await Promise.all(publishTasks); 
    } else {
      console.log('Publicação cancelada pelo usuário.');
    } 



  } catch {}
}
