export const command = {
    name: "promote",
    adminOnly: true,
    async execute(sock, m, args, { isGroup }) {
        if (!isGroup) return;
        const from = m.key.remoteJid;

        const metadata = await sock.groupMetadata(from);
        const botId = sock.user.id.split(':')[0] + '@s.whatsapp.net';
        const isBotAdmin = metadata.participants.find(p => p.id === botId)?.admin;

        if (!isBotAdmin) {
            return sock.sendMessage(from, { 
                text: "🚫 *ACCESS DENIED*\n\nI need *Admin Rights* to manage group roles. Kindly promote me first! ⚖️👑" 
            }, { quoted: m });
        }

        let user = m.message.extendedTextMessage?.contextInfo?.mentionedJid[0] || m.message.extendedTextMessage?.contextInfo?.participant;
        if (!user) return sock.sendMessage(from, { text: "📝 *Reply to a message or tag a user to promote them!*" });

        await sock.groupParticipantsUpdate(from, [user], "promote");
        await sock.sendMessage(from, { text: "⭐ *User has been promoted to Admin! Congratulations!* 🎉" });
    }
};
