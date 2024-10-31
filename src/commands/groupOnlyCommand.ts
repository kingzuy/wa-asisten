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
    setMessagesAdminsOnly: (adminsOnly: boolean) => Promise<void>;
}

export async function handleGroupOnlyCommand(msg: Message) {
    try {
        const chat = await msg.getChat() as GroupChat;
        
        // Cek apakah pesan dari grup
        if (!chat.isGroup) {
            await msg.reply('Perintah ini hanya dapat digunakan dalam grup!');
            return;
        }

        // Cek apakah pengirim adalah admin
        const participants = chat.groupMetadata.participants;
        const sender = participants.find(p => p.id._serialized === msg.author);
        
        if (!sender?.isAdmin) {
            await msg.reply('Anda harus menjadi admin untuk menggunakan perintah ini!');
            return;
        }

        // Parse command arguments
        const args = msg.body.toLowerCase().split(' ');
        if (args.length < 2) {
            await msg.reply('Format: .gconly <on/off>');
            return;
        }

        const action = args[1];
        
        if (action !== 'on' && action !== 'off') {
            await msg.reply('Pilihan tidak valid! Gunakan "on" atau "off"');
            return;
        }

        // Set group settings
        await chat.setMessagesAdminsOnly(action === 'on');

        // Send confirmation and react
        const statusText = action === 'on' ? 'diaktifkan' : 'dinonaktifkan';
        await msg.reply(`✅ Mode hanya admin telah ${statusText}`);
        await msg.react('✅');

    } catch (error) {
        console.error('Error in gconly command:', error);
        await msg.reply('Terjadi kesalahan saat mengatur mode grup.');
    }
}