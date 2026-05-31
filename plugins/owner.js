import fetch from 'node-fetch'

let handler = async (m, { conn }) => {
    const ownerNumber = '212709138520'
    const channelUrl = 'https://whatsapp.com/channel/0029Vb7nYRZHAdNWqXl8ug1b'
    const thumbUrl = 'https://files.catbox.moe/i8ntv0.jpg' // غيرها لصورتك لو حاب

    let caption = `
*🗂️ معلومات مطور البوت*

👨‍💻 *المطور:* 
wa.me/${ownerNumber}

✨ *قناة الواتساب:* 
${channelUrl}

📞 اضغط الزر تحت للتواصل مباشرة
`.trim()

    // إرسال بصورة + أزرار
    await conn.sendMessage(m.chat, {
        image: { url: thumbUrl },
        caption: caption,
        buttons: [
            { buttonId: `wa.me/${ownerNumber}`, buttonText: { displayText: '' }, type: 1 },
            { buttonId: channelUrl, buttonText: { displayText: '' }, type: 1 }
        ],
        footer: 'Owner Command',
        headerType: 4
    }, { quoted: m })

    // إرسال جهة اتصال المطور كـ vCard زيادة
    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:Bot Owner
TEL;waid=${ownerNumber}:${ownerNumber}
END:VCARD`
    await conn.sendMessage(m.chat, { 
        contacts: { 
            displayName: 'Bot Owner', 
            contacts: [{ vcard }] 
        }
    }, { quoted: m })
}

handler.help = ['owner']
handler.tags = ['infobot']
handler.command = /^(owner|مطور)$/i
handler.limit = false

export default handler
