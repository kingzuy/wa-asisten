export const chatHistory: Map<string, Array<{ role: string; content: string }>> = new Map();

export const resetChatHistory = (senderId: string) => {
    chatHistory.delete(senderId);
};