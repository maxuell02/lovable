let emailToCopy = '';
let code = '';

export function setEmailAndCode(email, c) {
  emailToCopy = String(email || '');
  code = String(c || '');
}

export function getEmailAndCode() {
  return { emailToCopy, code };
}
