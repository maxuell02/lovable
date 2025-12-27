import { saveCredentials, readFirstEmail, readPasswordForEmail } from '../Functions/credentials.mjs';
import fs from 'node:fs';
import path, { dirname } from 'node:path'; 
import { exec } from 'node:child_process';
import { clickIfVisible, waitVisible } from '../Functions/domHelpers.mjs';

export async function manipulateOutlookLogin(page) {  
   
  await page.waitForLoadState('domcontentloaded');

  const email = readFirstEmail();
  await page.getByRole('textbox', { name: 'Insira o seu email, telefone' }).click();
  await page.getByRole('textbox', { name: 'Insira o seu email, telefone' }).fill(email);  
  await page.getByRole('button', { name: 'Avançar' }).click();

  const password = readPasswordForEmail(email) || '';
  await page.getByRole('textbox', { name: 'Senha' }).click();
  await page.getByRole('textbox', { name: 'Senha' }).fill(password);
  await page.getByTestId('primaryButton').click(); 

  await waitVisible(page.getByTestId('secondaryButton'));
  await clickIfVisible(page.getByTestId('secondaryButton')); 

  
  try {
    await page.waitForURL('https://outlook.live.com/mail/0/', { timeout: 240000 });  
    console.log('Navegou para Outlook Inbox:', await page.url());
    
    const fullEmail = email; 
    return fullEmail;
  } catch {
    console.log('Indiferente carregada:', await page.title());
  }
}

export async function resumeOutlook(page) { 
  try {
    await clickIfVisible(page.getByText('Lixo Eletrônico'));
    const popupPromise = page.waitForEvent('popup', { timeout: 10000 }).catch(() => null);
    await clickIfVisible(page.getByText('Verify your email for Lovable'));
    await clickIfVisible(page.getByRole('button', { name: 'Rejeitar' }));
    await clickIfVisible(page.getByRole('link', { name: 'https://lovable.dev/auth/' }));
    await clickIfVisible(page.getByRole('button', { name: 'Visitar Link' }));
    try { await popupPromise; } catch {}
    return true;
  } catch {
    return false;
  }
}
