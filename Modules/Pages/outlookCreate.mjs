import { 
  generateRandomFirstName, 
  generateRandomLastName, 
  generateRandomDay, 
  generateRandomMonth, 
  generateRandomYear, 
  getRandomEmailPrefix, 
  getRandomDomain } 
  from '../Functions/gerador.mjs';
import { saveCredentials, readFirstPassword } from '../Functions/credentials.mjs';
import fs from 'node:fs';
import path, { dirname } from 'node:path'; 
import { exec } from 'node:child_process'; 

export async function manipulateOutlookCreate(page) {  
  
const emailPrefix = getRandomEmailPrefix();
const domain = getRandomDomain();
  await page.waitForLoadState('domcontentloaded');
  await page.getByRole('textbox', { name: 'Novo email' }).click();
  await page.getByRole('textbox', { name: 'Novo email' }).fill(emailPrefix);
  await page.getByRole('combobox', { name: 'Opções de domínio de email' }).click();
  
  await page.getByRole('option', { name: domain, exact: true }).click();
  await page.getByTestId('primaryButton').click();

  const password = readFirstPassword() || '';
  await page.getByRole('textbox', { name: 'Senha' }).click();
  await page.getByRole('textbox', { name: 'Senha' }).fill(password);
  await page.getByTestId('primaryButton').click();

const day = generateRandomDay();
const month = generateRandomMonth();
const year = generateRandomYear();
  await page.getByRole('combobox', { name: 'Dia do aniversário' }).click();
  await page.getByRole('option', { name: day }).click();

  await page.getByRole('combobox', { name: 'Mês do aniversário' }).click();
  await page.getByRole('option', { name: month }).click();

  try { await page.getByRole('spinbutton', { name: 'Ano de nascimento' }).focus(); } catch {}
  await page.getByRole('spinbutton', { name: 'Ano de nascimento' }).fill(year);
  await page.getByTestId('primaryButton').click();

const name = generateRandomFirstName();
const lastname = generateRandomLastName();
  await page.getByRole('textbox', { name: 'Primeiro nome' }).click();
  await page.getByRole('textbox', { name: 'Primeiro nome' }).fill(name);
  await page.getByText('Último nome').click();
  await page.getByRole('textbox', { name: 'Último nome' }).fill(lastname);
  await page.getByTestId('primaryButton').click();  
  
  try {
    await page.waitForURL('https://outlook.live.com/mail/0/', { timeout: 240000 }); 
    console.log('Outlook carregada:', await page.title());
    const fullEmail = `${emailPrefix}${domain}`;
    saveCredentials(fullEmail);
    console.log('Credenciais salvas:', fullEmail); 
    try { await page.close(); } catch {}
    return fullEmail;
  } catch {
    console.log('Indiferente carregada:', await page.title());
    return null;
  }
} 
