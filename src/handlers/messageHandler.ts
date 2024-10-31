import { Message } from 'whatsapp-web.js';
import { Gemini } from '../gemini/gemini';
import { handleAskCommand } from '../commands/ask';
import { handlePingCommand } from '../commands/ping';
import { handleGroupCommand } from '../commands/group';
import { handleAllCommand } from '../commands/all';
import { handleHelpCommand } from '../commands/help';
import { handleKickCommand } from '../commands/kick';
import { resetChatHistory } from '../utils/chatHistory';
import { handleGroupOnlyCommand } from '../commands/groupOnlyCommand'

export async function handleMessage(msg: Message, gemini: Gemini) {
    const text = msg.body.toLowerCase();
    const command = text.split(' ')[0];

    switch (command) {
        case '.ask':
            if (text.startsWith('.ask ')) {
                await handleAskCommand(msg, gemini);
            }
            break;
        case '.ping':
            await handlePingCommand(msg);
            break;
        case '.group':
            await handleGroupCommand(msg);
            break;
        case '.all':
            if (text.startsWith('.all ')) {
                await handleAllCommand(msg);
            }
            break;
        case '.help':
            await handleHelpCommand(msg);
            break;
        case '.reset':
            resetChatHistory(msg.from);
            const resetMessage = await msg.reply('Chat history telah direset! 🔄');
            if (resetMessage) {
                await resetMessage.react('🔄');
            }
            break;
        case '.kick':
            await handleKickCommand(msg);
            break;
        case '.gconly':
            await handleGroupOnlyCommand(msg);
            break;
        default:
            // Handle unknown command or non-command messages
            break;
    }
}