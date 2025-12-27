import axios from 'axios';

/**
 * Configuração dos webhooks do Discord
 */
const WEBHOOKS = {
  REGISTRATION: 'https://discord.com/api/webhooks/1440183702125805580/fM4ufSX-aCSmf2UuZiEquiS5Hjy-x4upl55qR9j0VwdvSyc7wI0-wLI4_scCXaQv7CoT',
  PUBLICATION: 'https://discord.com/api/webhooks/1440181459372736663/zOznDZBFEdB5HxbGw3oGMnDHdJsARx_rRtTPKg36HHzmWvMR9DucQmgCVMa3ciBzJZO6'
};

/**
 * Obtém a data e hora atual no fuso horário de São Paulo
 * @returns {string} Data e hora formatada em pt-BR
 */
function getFormattedDateTime() {
  return new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
} 

/**
 * Envia notificação para o canal de REGISTRO
 * @param {string} email - Email do usuário
 * @param {string} codigo - Código de registro
 * @returns {Promise<{success: boolean, message: string, timestamp: string}>}
 */
async function registrado(email, codigo) {
  const webhook = WEBHOOKS.REGISTRATION.trim(); 
  const dataHora = getFormattedDateTime();
  const discordMessage = {
    content: `🟣 Novo cadastro | data: \`${dataHora}\` | email: \`${email}\` | código: \`${codigo}\``
  };

  try {
    const response = await axios.post(webhook, discordMessage);
    console.log('✅ Notificação de registro enviada com sucesso');
    return {
      success: true,
      message: 'Notificação de registro enviada',
      timestamp: dataHora,
      statusCode: response.status
    };
  } catch (error) {
    console.error('❌ Erro ao enviar notificação de registro:', error.message);
    return {
      success: false,
      message: `Erro ao enviar: ${error.message}`,
      timestamp: getFormattedDateTime()
    };
  }
}

/**
 * Envia notificação para o canal de PUBLICAÇÃO
 * @param {string} email - Email do usuário (opcional)
 * @param {string} codigo - Código do projeto (opcional)
 * @returns {Promise<{success: boolean, message: string, timestamp: string}>}
 */
async function publicado(email = '', codigo = '') {
  const webhook = WEBHOOKS.PUBLICATION.trim(); 

  const dataHora = getFormattedDateTime();
  const discordMessage = {
    content: `🟢 PROJETO PUBLICADO | data: \`${dataHora}\` | email: \`${email || 'N/A'}\` | código: \`${codigo || 'N/A'}\``
  };

  try {
    const response = await axios.post(webhook, discordMessage);
    console.log('✅ Notificação de publicação enviada com sucesso');
    return {
      success: true,
      message: 'Notificação de publicação enviada',
      timestamp: dataHora,
      statusCode: response.status
    };
  } catch (error) {
    console.error('❌ Erro ao enviar notificação de publicação:', error.message);
    return {
      success: false,
      message: `Erro ao enviar: ${error.message}`,
      timestamp: getFormattedDateTime()
    };
  }
}

export { registrado, publicado };
