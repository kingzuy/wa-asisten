import { Client, LocalAuth, Message, GroupChat } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

// Inisialisasi WhatsApp client
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: ['--no-sandbox']
    }
});

// Fungsi untuk berkomunikasi dengan Gemini
async function askGemini(question: string): Promise<string> {
    try {
        const result = await model.generateContent(question);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error('Error asking Gemini:', error);
        return 'Maaf, terjadi kesalahan saat berkomunikasi dengan AI.';
    }
}

// Chat history untuk konteks percakapan
const chatHistory: Map<string, Array<{ role: string; content: string }>> = new Map();

// Fungsi untuk chat dengan konteks
async function chatWithGemini(senderId: string, message: string): Promise<string> {
    try {
        // Dapatkan atau buat history chat untuk pengirim
        if (!chatHistory.has(senderId)) {
            chatHistory.set(senderId, []);
        }
        const history = chatHistory.get(senderId)!;

        // Tambahkan pesan user ke history
        history.push({ role: 'user', content: message });

        // Batasi history ke 10 pesan terakhir untuk menghemat token
        if (history.length > 10) {
            history.splice(0, history.length - 10);
        }

        // Generate respons dengan konteks
        const chat = model.startChat({
            history: history.map(msg => ({
                role: msg.role === 'assistant' ? 'model' : msg.role, // Ubah 'assistant' menjadi 'model'
                parts: [{ text: msg.content }],
            })),
        });        

        const result = await chat.sendMessage(message);
        const response = await result.response;
        const responseText = response.text();

        // Tambahkan respons AI ke history
        history.push({ role: 'assistant', content: responseText });

        return responseText;
    } catch (error) {
        console.error('Error in chat:', error);
        return 'Maaf, terjadi kesalahan saat memproses percakapan.';
    }
}

// Menampilkan QR code untuk login
client.on('qr', (qr) => {
    console.log('QR RECEIVED', qr);
    qrcode.generate(qr, { small: true });
});

// Event ketika client siap
client.on('ready', () => {
    console.log('Client is ready!');
});

// Event ketika menerima pesan
client.on('message', async (msg: Message) => {
    const chat = await msg.getChat();
    const senderId = msg.from;
    
    // Command untuk bertanya ke AI
    if (msg.body.toLowerCase().startsWith('@ask ')) {
        const question = msg.body.slice(5); // Menghapus '@ask ' dari pesan
        
        try {
            // Reaksi dengan emoji jam pasir
            await msg.react('⏳');
            
            const answer = await chatWithGemini(senderId, question);
            
            // Hapus reaksi jam pasir
            await msg.react('');
            
            // Kirim jawaban
            const sentMessage = await msg.reply(answer);
            
            // Tambahkan reaksi robot pada pesan yang dikirim
            if (sentMessage) {
                await sentMessage.react('🤖');
            }
        } catch (error) {
            console.error('Error in message handling:', error);
            await msg.react(''); // Hapus reaksi jam pasir jika terjadi error
            msg.reply('Maaf, terjadi kesalahan saat memproses pertanyaan Anda.');
        }
    }

    // Mengirim pesan yang dikutip
    if (msg.hasQuotedMsg) {
        const quotedMsg = await msg.getQuotedMessage();
        if (quotedMsg) {
            await chat.sendMessage('Pesan ini adalah respons terhadap pesan yang dikutip.', {
                quotedMessageId: quotedMsg.id._serialized,
            });
        } else {
            console.log('Tidak ada pesan yang dikutip.');
        }
    }

    // Reset chat history
    if (msg.body.toLowerCase() === '@reset') {
        chatHistory.delete(senderId);
        msg.reply('Chat history telah direset! 🔄');
    }

    // Contoh auto-reply
    if (msg.body.toLowerCase() === '@ping') {
        msg.reply('pong');
    }

    // Contoh mengirim pesan ke grup
    if (msg.body.toLowerCase() === '@group') {
        if (chat.isGroup) {
            const groupChat = chat as GroupChat;
            msg.reply(`Group Info:\nNama: ${groupChat.name}`);
        }
    }

    if (msg.body.toLowerCase() === '@everyone') {
        const chat = await msg.getChat();
        const contact = await msg.getContact();

        if (chat.isGroup) {
            const groupChat = chat as GroupChat;
            const participants = await groupChat.participants;

            // Memeriksa apakah pengirim adalah admin
            const isAdmin = participants.some(participant => participant.id._serialized === contact.id._serialized && participant.isAdmin);

            if (isAdmin) {
                const idsString = participants.map(p => `@${p.id._serialized.slice(0, -5)}`).join(' ');
                const mentions = participants.map(p => p.id._serialized);

                await groupChat.sendMessage(`Hello everyone! ${idsString}`, {
                    mentions: mentions
                });
            } else {
                msg.reply('Hanya admin yang dapat menggunakan perintah ini.');
            }
        }
    }

    // Bantuan command
    if (msg.body.toLowerCase() === '@help') {
        const helpMessage = `
*Available Commands:*
!ask [pertanyaan] - Tanya apa saja ke AI
!ping - Test bot
!group - Tampilkan info grup (dalam grup)
!everyone - Mention semua member (dalam grup)
!help - Tampilkan bantuan ini
        `.trim();
        msg.reply(helpMessage);
    }
});

// Event ketika ada error
client.on('auth_failure', () => {
    console.error('Authentication failed!');
});

// Inisialisasi client
client.initialize();
