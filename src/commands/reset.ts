import { Message } from 'whatsapp-web.js';
import { resetChatHistory } from '../utils/chatHistory';

export async function handleResetCommand(msg: Message) {
    resetChatHistory(msg.from);
    const resetMessage = await msg.reply('Chat history telah direset! 🔄');
    if (resetMessage) {
        await resetMessage.react('🔄');
    }
}