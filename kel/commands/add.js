export const command = {
    name: 'add',
    adminOnly: true,
    async execute(sock, m, args, { isGroup }) {
        if (!isGroup) return;
        const from = m.key.remoteJid;

        try {
            const metadata = await sock.groupMetadata(from);
            const botId = sock.user.id.split(':') + '@s.whatsapp.net';
            const isBotAdmin = metadata.participants.find(p => p.id === botId)?.admin;

            if (!isBotAdmin) {
                return sock.sendMessage(from, { 
                    text: "⚠️ *ADMIN PRIVILEGES REQUIRED*\n\nI am not an admin here. Please promote me to add new members! 🛡️✨" 
                }, { quoted: m });
            }

            let users = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || args[0]?.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
            if (!users || users.length < 15) return sock.sendMessage(from, { text: "🔍 *Please provide a valid number or tag someone!*" });

            await sock.groupParticipantsUpdate(from, [users], "add");
            await sock.sendMessage(from, { text: "✅ *User has been successfully added to the group!* 🎊" });

        } catch (e) {
            sock.sendMessage(from, { text: "❌ *Could not add user. Their privacy settings might be restricted!*" });
        }
    }
};
