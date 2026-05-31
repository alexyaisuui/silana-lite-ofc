import yts from 'yt-search'

let handler = async (m, { conn, text }) => {
  if (!text) throw 'هذا الأمر للبحث في اليوتيوب والحصول على روابط الفيديوهات.\nمثال:\n*.yts* alan walker faded'

  await conn.sendMessage(m.chat, { text: 'جـاري البـحث... ⏳' }, { quoted: m })

  let results = await yts(text)
  let videos = results.videos.slice(0, 5) // أول 5 فيديوهات

  if (!videos.length) throw 'ما لقيت نتائج'

  let teks = videos.map(v => {
    return `
° *_${v.title}_*
↳ 🔗 *الـرابـط:* ${v.url}
↳ 🕒 *الـمـدة:* ${v.timestamp}
↳ 📥 *تاريـخ الـرفع:* ${v.ago}
↳ 👁 *المشاهـدات:* ${v.views.toLocaleString()}`
  }).join('\n\n────────────────\n\n')

  await conn.sendMessage(m.chat, {
    image: { url: videos[0].thumbnail },
    caption: teks
  }, { quoted: m })
}

handler.help = ['yts']
handler.tags = ['search']
handler.command = ['yts', 'ytsearch']
handler.limit = 1
export default handler
