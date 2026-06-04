// ============================================================
//  📖  السيرة — سيرة النبي ﷺ بصوت نبيل العوضي
//  الأمر : .seerah  |  .seerah <رقم الحلقة>
//  التصنيف : إسلامي
//  الإضافة بواسطة noureddine Ouafy
// ============================================================

const EPISODES = [
  { ep: 1,  size: '13.2M', url: 'https://ia800809.us.archive.org/14/items/seera_nabawiya_al3awadi/seera01.mp3' },
  { ep: 2,  size: '14.3M', url: 'https://archive.org/download/seera_nabawiya_al3awadi/seera02.mp3' },
  { ep: 3,  size: '13.4M', url: 'https://archive.org/download/seera_nabawiya_al3awadi/seera03.mp3' },
  { ep: 4,  size: '12.8M', url: 'https://archive.org/download/seera_nabawiya_al3awadi/seera04.mp3' },
  { ep: 5,  size: '12.8M', url: 'https://archive.org/download/seera_nabawiya_al3awadi/seera05.mp3' },
  { ep: 6,  size: '12.6M', url: 'https://archive.org/download/seera_nabawiya_al3awadi/seera06.mp3' },
  { ep: 7,  size: '13.6M', url: 'https://archive.org/download/seera_nabawiya_al3awadi/seera07.mp3' },
  { ep: 8,  size: '13.4M', url: 'https://archive.org/download/seera_nabawiya_al3awadi/seera08.mp3' },
  { ep: 9,  size: '12.7M', url: 'https://archive.org/download/seera_nabawiya_al3awadi/seera09.mp3' },
  { ep: 10, size: '14.6M', url: 'https://archive.org/download/seera_nabawiya_al3awadi/seera10.mp3' },
  { ep: 11, size: '13.7M', url: 'https://archive.org/download/seera_nabawiya_al3awadi/seera11.mp3' },
  { ep: 12, size: '12.9M', url: 'https://archive.org/download/seera_nabawiya_al3awadi/seera12.mp3' },
  { ep: 13, size: '14.6M', url: 'https://archive.org/download/seera_nabawiya_al3awadi/seera13.mp3' },
  { ep: 14, size: '13.8M', url: 'https://archive.org/download/seera_nabawiya_al3awadi/seera14.mp3' },
  { ep: 15, size: '15.7M', url: 'https://archive.org/download/seera_nabawiya_al3awadi/seera15.mp3' },
  { ep: 16, size: '14.5M', url: 'https://archive.org/download/seera_nabawiya_al3awadi/seera16.mp3' },
  { ep: 17, size: '14.2M', url: 'https://archive.org/download/seera_nabawiya_al3awadi/seera17.mp3' },
  { ep: 18, size: '12.9M', url: 'https://archive.org/download/seera_nabawiya_al3awadi/seera18.mp3' },
  { ep: 19, size: '13.9M', url: 'https://archive.org/download/seera_nabawiya_al3awadi/seera19.mp3' },
  { ep: 20, size: '15.3M', url: 'https://archive.org/download/seera_nabawiya_al3awadi/seera20.mp3' },
  { ep: 21, size: '16.0M', url: 'https://archive.org/download/seera_nabawiya_al3awadi/seera21.mp3' },
  { ep: 22, size: '15.5M', url: 'https://archive.org/download/seera_nabawiya_al3awadi/seera22.mp3' },
  { ep: 23, size: '13.5M', url: 'https://archive.org/download/seera_nabawiya_al3awadi/seera23.mp3' },
  { ep: 24, size: '14.5M', url: 'https://archive.org/download/seera_nabawiya_al3awadi/seera24.mp3' },
  { ep: 25, size: '14.3M', url: 'https://archive.org/download/seera_nabawiya_al3awadi/seera25.mp3' },
  { ep: 26, size: '13.9M', url: 'https://archive.org/download/seera_nabawiya_al3awadi/seera26.mp3' },
  { ep: 27, size: '14.2M', url: 'https://archive.org/download/seera_nabawiya_al3awadi/seera27.mp3' },
  { ep: 28, size: '13.2M', url: 'https://archive.org/download/seera_nabawiya_al3awadi/seera28.mp3' },
  { ep: 29, size: '15.7M', url: 'https://archive.org/download/seera_nabawiya_al3awadi/seera29.mp3' },
  { ep: 30, size: '13.8M', url: 'https://archive.org/download/seera_nabawiya_al3awadi/seera30.mp3' },
]

// ─── رسالة الدليل عند عدم إدخال رقم الحلقة ───────────────────
function buildGuide() {
  const episodeList = EPISODES.map(e =>
    `  📌 الحلقة ${String(e.ep).padStart(2, '0')} — ${e.size}`
  ).join('\n')

  return `
╔══════════════════════════════════╗
║  📖  السيرة — سيرة النبي ﷺ     ║
║        سلسلة كاملة صوتية        ║
╚══════════════════════════════════╝

🎙️ *تقديم:* الشيخ نبيل العوضي
📦 *عدد الحلقات:* ${EPISODES.length} حلقة
🗂️ *الصيغة:* MP3 صوتي

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 *الحلقات المتوفرة*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${episodeList}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📌 *طريقة الاستخدام*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
للحصول على حلقة معينة، اكتب:

  *.seerah <رقم الحلقة>*

  مثال → *.seerah 1*
  مثال → *.seerah 15*

سيقوم البوت بإرسال رابط مباشر
للتحميل أو الاستماع 🎧

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🕌 *عن هذه السلسلة*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
هذه سلسلة صوتية كاملة عن
سيرة النبي محمد ﷺ،
بصوت الشيخ نبيل العوضي.

الاستماع للسيرة يزيد حبك
للنبي ﷺ ويقوي شخصيتك.

جزاك الله خيرًا 🤲
`.trim()
}

// ─── المعالج الرئيسي ─────────────────────────────────────────
let handler = async (m, { conn, args }) => {

  if (args[0]) {
    const num = parseInt(args[0])

    if (isNaN(num) || num < 1 || num > EPISODES.length) {
      await conn.sendMessage(
        m.chat,
        {
          text:
            `❌ *رقم الحلقة غير صحيح!*\n\n` +
            `الرجاء إدخال رقم بين *1* و *${EPISODES.length}*.\n\n` +
            `مثال: *.seerah 5*`
        },
        { quoted: m }
      )
      return
    }

    const episode = EPISODES.find(e => e.ep === num)

    await conn.sendMessage(
      m.chat,
      {
        text:
          `⏳ *جاري تحميل الحلقة ${episode.ep} من ${EPISODES.length}...*\n\n` +
          `📖 السيرة — سيرة النبي ﷺ\n` +
          `👤 الشيخ نبيل العوضي\n` +
          `📦 الحجم: *${episode.size}*\n\n` +
          `_يرجى الانتظار حتى يتم إرسال الصوت..._`
      },
      { quoted: m }
    )

    await conn.sendMessage(
      m.chat,
      {
        audio: { url: episode.url },
        mimetype: 'audio/mpeg',
        ptt: false,
        fileName: `Seerah_Episode_${String(episode.ep).padStart(2, '0')}_NabilAlAwadi.mp3`,
      },
      { quoted: m }
    )

    await conn.sendMessage(
      m.chat,
      {
        text:
          `✅ *تم إرسال الحلقة ${episode.ep} بنجاح!*\n\n` +
          `_للاستماع إلى حلقة أخرى اكتب:_\n` +
          `*.seerah <رقم الحلقة>*\n\n` +
          `مثال: *.seerah ${episode.ep < EPISODES.length ? episode.ep + 1 : 1}*`
      },
      { quoted: m }
    )

  } else {
    await conn.sendMessage(
      m.chat,
      { text: buildGuide() },
      { quoted: m }
    )
  }
}

// ─── معلومات الأمر ───────────────────────────────────────────
handler.help    = ['seerah']
handler.command = ['seerah']
handler.tags    = ['islamic']
handler.limit   = true
export default handler
