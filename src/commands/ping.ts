import { Message } from 'whatsapp-web.js';

export async function handlePingCommand(msg: Message) {
    const pongMessage = await msg.reply('pong');
    if (pongMessage) {
        await pongMessage.react('🏓');
    }
}