import axios from 'axios';

let handler = async (m, { conn, text, command }) => {
    if (!text) return m.reply(`*🔍 اكتب اسم التطبيق*\n.${command} Instagram`);

    try {
        await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });

        const apiUrl = `https://ws75.aptoide.com/api/7/apps/search/query=${encodeURIComponent(text)}/limit=1`;
        const response = await axios.get(apiUrl, { timeout: 15000 });

        if (!response.data?.datalist?.list?.length) {
            return m.reply("❌ التطبيق غير موجود");
        }

        const app = response.data.datalist.list[0];
        const sizeMB = (app.size / (1024 * 1024)).toFixed(2);
        const developer = app.developer?.name || "غير معروف";

        const caption = `
*🔖 اسم التطبيق:* ${app.name}
*👨‍💻 المطور:* ${developer}
*📦 الحجم:* ${sizeMB} 
        `.trim();

        await conn.sendMessage(m.chat, {
            document: { url: app.file.path_alt },
            fileName: `${app.name}.apk`,
            mimetype: 'application/vnd.android.package-archive',
            caption: caption
        }, { quoted: m });

        await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });

    } catch (e) {
        console.error(e);
        await m.reply(`❌ خطأ: ${e.message}`);
    }
}

handler.command = ['apk2'];
export default handler;
