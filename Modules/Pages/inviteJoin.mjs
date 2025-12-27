import { registrado } from "../Functions/discord.mjs";
import { resumeOutlook } from "../Pages/outlook.mjs";
import { deletemail, savedel, readPasswordForEmail } from "../Functions/credentials.mjs";
import { clickIfVisible } from '../Functions/domHelpers.mjs';

export async function manipulateInviteJoin(page, emailToCopy) {
  await page.waitForLoadState('domcontentloaded');
  const email = page.getByRole('textbox', { name: 'E-mail' });
  await email.click();
  await email.fill(emailToCopy);
  await page.getByRole('button', { name: 'Continuar', exact: true }).click();
  
  const consulta = page.url()
  const codigo = consulta.split('/').pop()
  await registrado(emailToCopy, codigo);
  await savedel(emailToCopy);
  await deletemail(emailToCopy);
  await clickIfVisible(page.getByRole('textbox', { name: 'Senha' }));
  const password = readPasswordForEmail(emailToCopy) || '';
  await page.getByRole('textbox', { name: 'Senha' }).fill(password);
  await clickIfVisible(page.getByRole('button', { name: 'Criar sua conta' }));
  try {
    await page.getByText('Email address not eligible').first().waitFor({ state: 'visible', timeout: 5000 });
    try { await page.context().close(); } catch {}
    try { await page.context().browser()?.close(); } catch {}
    process.exit(0);
  } catch {}
  let navigated = false;
  
  try { 
    await waitForUrl(page, 'https://lovable.dev/verify-email', 240000); navigated = true; 
        try {
        await page.getByText('Email address not eligible').first().waitFor({ state: 'visible', timeout: 5000 });
           try { await page.context().close(); } catch {}
          try { await page.context().browser()?.close(); } catch {}
        process.exit(0);
    }catch {}
      console.log('Navegou para https://lovable.dev/verify-email');
      await clickIfVisible(page.getByText('Reenviar email'));
  }catch {}
  try {
    const ctx = page.context();
    const outlookPage = ctx.pages().find(p => p.url().startsWith('https://outlook.live.com/mail/0/'));
    if (outlookPage) await resumeOutlook(outlookPage);
  } catch {}
} 
