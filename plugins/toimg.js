let handler = async (m, { conn, usedPrefix, command }) => {
    const notStickerMessage = `✳️ رد على الستيكرات بـ:\n\n *${usedPrefix + command}*`
    if (!m.quoted) throw notStickerMessage
    const q = m.quoted || m
    let mime = q.mediaType || ''
    if (/webp/.test(mime)) throw notStickerMessage
    let media = await q.download()
    await conn.sendMessage(m.chat, {image: media, caption: '*تــم بنـجـاح*'}, {quoted: m})
}
handler.help = ['toimg']
handler.tags = ['sticker']
handler.command = /^(toimg)$/i
handler.limit = true 
export default handler
