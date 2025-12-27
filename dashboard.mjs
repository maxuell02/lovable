import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

app.use(express.static('public'));
app.use(express.json());

// Rota para iniciar o processo
app.post('/start', (req, res) => {
    const { inviteLink } = req.body;

    if (!inviteLink.includes('/invite/')) {
        return res.status(400).json({ error: 'Link inválido!' });
    }

    // Atualiza o invite.json (Substituindo a lógica do PowerShell no .bat)
    const inviteData = { "01": [inviteLink] };
    fs.writeFileSync(path.join(__dirname, 'invite.json'), JSON.stringify(inviteData, null, 2));

    // Inicia o script finish-him.mjs
    const child = spawn('node', ['finish-him.mjs'], { shell: true });

    child.stdout.on('data', (data) => {
        io.emit('log', data.toString()); // Envia log para o front-end
    });

    child.stderr.on('data', (data) => {
        io.emit('log', `ERRO: ${data.toString()}`);
    });

    child.on('close', (code) => {
        io.emit('log', `Processo finalizado com código: ${code}`);
    });

    res.json({ message: 'Processo iniciado!' });
});

httpServer.listen(3000, () => {
    console.log('Dashboard rodando em http://localhost:3000');
});