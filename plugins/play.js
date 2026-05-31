// بلاجن من Toxic-v2/xhclintohn شكراً 🌟
// تم التعديل بواسطة MANON TECH 

import fetch from "node-fetch";

let handler = async (m, { conn, text }) => {
  try {
    const query = text ? text.trim() : '';

    if (!query) {
      return m.reply(
        `╭───(    ALEXY AI  )───\n` +
        `├ 🇲🇦 نسيت تكتب حاجة!\n` +
        `├ عطيني اسم الأغنية أو رابط يوتيوب.\n` +
        `├ مثال: .play funk universo\n` +
        `╰──────────────────☉`
      );
    }

    if (query.length > 100) {
      return m.reply(`╭───(    ALEXY AI   )───\n├ 🇲🇦 البحث طويل بزاف! الحد الأقصى 100 حرف.\n╰──────────────────☉`);
    }

    await conn.sendMessage(m.chat, { react: { text: '🕘', key: m.key } });

    const response = await fetch(`https://api.nexray.web.id/downloader/ytplay?q=${encodeURIComponent(query)}`);
    const data = await response.json();

    if (!data.status || !data.result?.download_url) {
      await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
      return m.reply(`╭───(     ALEXY AI   )───\n├ 🇲🇦 ما لقيتش نتائج لـ: "${query}"\n╰──────────────────☉`);
    }

    const result = data.result;
    const audioUrl = result.download_url;
    const filename = result.title || 'أغنية غير معروفة';
    const safeName = filename.replace(/[<>:"/\\|?*]/g, '_') + '.mp3';

    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

    // تصحيح تحميل الـ buffer
    const audioRes = await fetch(audioUrl);
    const audioBuffer = Buffer.from(await audioRes.arrayBuffer());

    // 1. إرسال الصوت الأول
    await conn.sendMessage(m.chat, {
      audio: audioBuffer,
      mimetype: 'audio/mpeg',
      fileName: safeName,
      ptt: false
    }, { quoted: m });

    // نخلي تأخير صغير باش واتساب ما يبلوكيش الرسالة الثانية
    await new Promise(r => setTimeout(r, 1500));

    // 2. إرسال الملف كـ Document
    await conn.sendMessage(m.chat, {
      document: audioBuffer,
      mimetype: 'audio/mpeg',
      fileName: safeName,
      caption: `🎵 *${filename}*\n⏱️ ${result.duration || '-'}`
    }, { quoted: m });

  } catch (error) {
    console.error('Play error:', error);
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
    await m.reply(`⚠️ خطأ: ${error.message}`);
  }
};

handler.help = ['play'];
handler.command = /^(play)?$/i;
handler.tags = ['downloader'];
handler.limit = true;

export default handler;
