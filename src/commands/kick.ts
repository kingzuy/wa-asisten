import { Message, Chat } from 'whatsapp-web.js';

interface GroupChat extends Chat {
    isGroup: boolean;
    groupMetadata: {
        participants: Array<{
            id: {
                _serialized: string;
            };
            isAdmin: boolean;
        }>;
    };
    removeParticipants: (participantIds: string[]) => Promise<void>;
}

export async function handleKickCommand(msg: Message) {
    try {
        const chat = await msg.getChat() as GroupChat;
        if (!chat.isGroup) {
            await msg.reply('Perintah ini hanya dapat digunakan dalam grup!');
            return;
        }

        // Dapatkan participants dari groupMetadata
        const participants = chat.groupMetadata.participants;
        const sender = participants.find(p => p.id._serialized === msg.author);
        
        if (!sender?.isAdmin) {
            await msg.reply('Anda harus menjadi admin untuk menggunakan perintah ini!');
            return;
        }

        const mentions = await msg.getMentions();
        const quotedMsg = await msg.getQuotedMessage();
        
        if (mentions.length === 0 && !quotedMsg) {
            await msg.reply('Tag atau reply pesan user yang ingin dikeluarkan!\nContoh: .kick @user atau reply pesan dengan .kick');
            return;
        }

        const targetUsers = mentions.length > 0 ? mentions : [await quotedMsg.getContact()];
        
        for (const user of targetUsers) {
            const targetParticipant = participants.find(p => p.id._serialized === user.id._serialized);
            if (targetParticipant?.isAdmin) {
                await msg.reply(`Tidak dapat mengeluarkan @${user.id.user} karena dia adalah admin!`);
                continue;
            }

            try {
                await chat.removeParticipants([user.id._serialized]);
                await msg.react('✅');
            } catch (error) {
                console.error(`Error kicking user ${user.id.user}:`, error);
            }
        }
    } catch (error) {
        console.error('Error in kick command:', error);
        await msg.reply('Terjadi kesalahan saat mengeluarkan user dari grup.');
    }
}