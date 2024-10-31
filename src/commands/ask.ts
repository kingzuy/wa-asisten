import { Message } from 'whatsapp-web.js';
import { Gemini } from '../gemini/gemini';
import { chatHistory } from '../utils/chatHistory';

export async function handleAskCommand(msg: Message, gemini: Gemini) {
    const senderId = msg.from;
    const question = msg.body.slice(5);

    try {
        await msg.react('⏳');
        
        if (!chatHistory.has(senderId)) {
            chatHistory.set(senderId, []);
        }
        const history = chatHistory.get(senderId)!;

        history.push({ role: 'user', content: question });

        if (history.length > 10) {
            history.splice(0, history.length - 10);
        }

        gemini.setSystemInstruction("You are a helpful AI assistant.");
        history.forEach(msg => {
            gemini.addContent({ role: msg.role, parts: [{ text: msg.content }] });
        });

        const result = await gemini.generate();
        const responseText = result.response.text();

        history.push({ role: 'model', content: responseText });
        
        await msg.react('');
        const sentMessage = await msg.reply(responseText);
        
        if (sentMessage) {
            await sentMessage.react('🤖');
        }
    } catch (error) {
        console.error('Error in ask command:', error);
        await msg.react('');
        const errorMessage = await msg.reply('Maaf, terjadi kesalahan saat memproses pertanyaan Anda.');
        if (errorMessage) {
            await errorMessage.react('❌');
        }
    }
}