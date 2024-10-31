import { Message, GroupChat } from 'whatsapp-web.js';

export async function handleAllCommand(msg: Message) {
    const chat = await msg.getChat();
    const contact = await msg.getContact();

    if (chat.isGroup) {
        const groupChat = chat as GroupChat;
        const participants = await groupChat.participants;

        const isAdmin = participants.some(participant => 
            participant.id._serialized === contact.id._serialized && participant.isAdmin
        );

        if (isAdmin) {
            const idsString = participants.map(p => 
                `@${p.id._serialized.split('@')[0]}`
            ).join(' ');
            const mentions = participants.map(p => p.id._serialized);

            const everyoneMessage = await groupChat.sendMessage(`Hello everyone! ${idsString}`, {
                mentions: mentions
            });
            if (everyoneMessage) {
                await everyoneMessage.react('👋');
            }
        } else {
            const notAdminMessage = await msg.reply('Hanya admin yang dapat menggunakan perintah ini.');
            if (notAdminMessage) {
                await notAdminMessage.react('🚫');
            }
        }
    }
}