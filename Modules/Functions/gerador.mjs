import data from '../data.json' with { type: 'json' };

/**
 * Gera um número aleatório com a quantidade de dígitos especificada
 * @param {number} digits - Quantidade de dígitos (padrão: 4)
 * @returns {string} Número aleatório como string
 */
function generateRandomNumber(digits = 4) {
  let result = "";
  for (let i = 0; i < digits; i++) {
    result += Math.floor(Math.random() * 10);
  }
  return result;
}

/**
 * Gera um primeiro nome aleatório a partir da lista de dados
 * @returns {string} Primeiro nome aleatório
 */
function generateRandomFirstName() {
  const firstNames = data.firstNames;
  return firstNames[Math.floor(Math.random() * firstNames.length)];
}

/**
 * Gera um sobrenome aleatório a partir da lista de dados
 * @returns {string} Sobrenome aleatório
 */
function generateRandomLastName() {
  const lastNames = data.lastNames;
  return lastNames[Math.floor(Math.random() * lastNames.length)];
}

/**
 * Gera um dia aleatório (1-28)
 * @returns {number} Dia aleatório
 */
function generateRandomDay() {
  return Math.floor(Math.random() * 28) + 1;
}

/**
 * Gera um mês aleatório (1-12)
 * @returns {number} Mês aleatório
 */
function generateRandomMonth() {
  const months = data.months;
  const idx = Math.floor(Math.random() * months.length);
  return months[idx];
}

/**
 * Gera um ano aleatório (1970-2007)
 * @returns {string} Ano aleatório como string
 */
function generateRandomYear() {
  return String(Math.floor(Math.random() * (2007 - 1970 + 1)) + 1970);
}

/**
 * Retorna um domínio de email aleatório a partir da lista de dados
 * @returns {string} Domínio de email aleatório
 */
function getRandomDomain() {
  const domains = data.domains;
  const idx = Math.floor(Math.random() * domains.length);
  return domains[idx];
}

/**
 * Gera um prefixo de email aleatório combinando partes de nomes e números
 * @returns {string} Prefixo de email aleatório
 */
function getRandomEmailPrefix() {
  const nameParts = data.emailPrefixes;
  const firstName = nameParts[Math.floor(Math.random() * nameParts.length)];
  const lastName = nameParts[Math.floor(Math.random() * nameParts.length)];
  const number = generateRandomNumber(Math.floor(Math.random() * 3) + 2);
  return `${firstName}${lastName}${number}`;
}

export {
  generateRandomNumber,
  generateRandomFirstName,
  generateRandomLastName,
  generateRandomDay,
  generateRandomMonth,
  generateRandomYear,
  getRandomEmailPrefix,
  getRandomDomain
};
