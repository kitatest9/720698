export const command = {
    name: "kick", // Add ke liye alag file ya isi logic ko copy karein
    adminOnly: true,
    async execute(sock, m, args, { isGroup }) {
        if (!isGroup) return;
        const from = m.key.remoteJid;

        try {
            const metadata = await sock.groupMetadata(from);
            const botId = sock.user.id.split(':')[0] + '@s.whatsapp.net';
            const isBotAdmin = metadata.participants.find(p => p.id === botId)?.admin;

            if (!isBotAdmin) {
                return sock.sendMessage(from, { 
                    text: "⚠️ *ADMIN PRIVILEGES REQUIRED*\n\nI am not an admin in this group. Please promote me to perform this action! 🛡️✨" 
                }, { quoted: m });
            }

            let user = m.message.extendedTextMessage?.contextInfo?.mentionedJid[0] || m.message.extendedTextMessage?.contextInfo?.participant;
            if (!user) return sock.sendMessage(from, { text: "🔍 *Please tag or reply to the user you want to kick!*" });

            await sock.groupParticipantsUpdate(from, [user], "remove");
            await sock.sendMessage(from, { text: "🚫 *User successfully removed from the group!* 💨" });

        } catch (e) {
            sock.sendMessage(from, { text: "❌ *An unexpected error occurred while processing the request.*" });
        }
    }
};
