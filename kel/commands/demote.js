export const command = {
    name: 'demote',
    adminOnly: true,
    async execute(sock, m, args, { isGroup }) {
        if (!isGroup) return;
        const from = m.key.remoteJid;

        const metadata = await sock.groupMetadata(from);
        const botId = sock.user.id.split(':') + '@s.whatsapp.net';
        const isBotAdmin = metadata.participants.find(p => p.id === botId)?.admin;

        if (!isBotAdmin) {
            return sock.sendMessage(from, { 
                text: "🚫 *ACCESS DENIED*\n\nI need *Admin Rights* to demote other admins. Kindly promote me first! ⚖️📉" 
            }, { quoted: m });
        }

        let user = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || m.message.extendedTextMessage?.contextInfo?.participant;
        if (!user) return sock.sendMessage(from, { text: "📝 *Tag an admin or reply to their message to demote them!*" });

        await sock.groupParticipantsUpdate(from, [user], "demote");
        await sock.sendMessage(from, { text: "📉 *Admin privileges have been revoked from this user!* 👤" });
    }
};
