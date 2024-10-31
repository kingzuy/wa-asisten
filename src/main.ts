import { Client, LocalAuth } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import dotenv from 'dotenv';
import { Gemini, GenerativeModelName } from './gemini/gemini';
import { handleMessage } from './handlers/messageHandler';

// Load environment variables
dotenv.config();

// Initialize Gemini AI
const gemini = Gemini.make(process.env.GEMINI_API_KEY);
gemini.setModel('gemini-pro' as GenerativeModelName);

// Initialize WhatsApp client
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: ['--no-sandbox']
    }
});

client.on('qr', (qr) => {
    console.log('QR RECEIVED', qr);
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message', async (msg) => {
    await handleMessage(msg, gemini);
});

client.on('auth_failure', () => {
    console.error('Authentication failed!');
});

// Initialize client
client.initialize();