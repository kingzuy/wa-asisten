import { Message } from 'whatsapp-web.js';

export async function handleHelpCommand(msg: Message) {
    const helpMessage = `
*Available Commands:*
.ask [pertanyaan] - Tanya apa saja ke AI
.ping - Test bot
.group - Tampilkan info grup (dalam grup)
.all - Mention semua member (dalam grup)
.help - Tampilkan bantuan ini
.reset - Reset chat history
    `.trim();
    
    const sentHelpMessage = await msg.reply(helpMessage);
    if (sentHelpMessage) {
        await sentHelpMessage.react('📚');
    }
}