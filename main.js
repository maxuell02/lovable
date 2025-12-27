import { app, BrowserWindow } from 'electron';
import { fork } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
let serverProcess;

function createWindow() {
  const win = new BrowserWindow({
    width: 900,
    height: 700,
    title: "Lovable Bot Dashboard",
    autoHideMenuBar: true, // Esconde a barra de menu (File, Edit, etc)
    webPreferences: {
      nodeIntegration: false
    }
  });

  // Inicia o seu servidor dashboard.mjs em background
  serverProcess = fork(path.join(__dirname, 'dashboard.mjs'));

  // Espera um pouco para o servidor subir e carrega a URL
  setTimeout(() => {
    win.loadURL('http://localhost:3000');
  }, 1000);

  win.on('closed', () => {
    if (serverProcess) serverProcess.kill();
    app.quit();
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    if (serverProcess) serverProcess.kill();
    app.quit();
  }
});