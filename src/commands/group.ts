import { Message, GroupChat } from 'whatsapp-web.js';

export async function handleGroupCommand(msg: Message) {
    const chat = await msg.getChat();
    if (chat.isGroup) {
        const groupChat = chat as GroupChat;
        const groupInfoMessage = await msg.reply(`Group Info:\nNama: ${groupChat.name}`);
        if (groupInfoMessage) {
            await groupInfoMessage.react('ℹ️');
        }
    }
}