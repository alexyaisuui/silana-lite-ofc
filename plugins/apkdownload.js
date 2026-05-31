// @noureddine_ouafy
// APK Downloader Plugin using NexOracle API

import axios from 'axios';

let handler = async (m, { conn, args }) => {
  const appName = args.join(" ");
  if (!appName) {
    return m.reply('الـمرجو كتـابة اسـم التطبيق. مـثال: \n.apkdownload whatsapp');
  }

  // رسالة انتظار
  await m.reply("⏳ المرجو الانتظار قليلا لا تنسى ان تتابع \nhttps://instagram.com/manon_tech__99");

  try {
    const apiUrl = `https://api.nexoracle.com/downloader/apk`;
    const params = {
      apikey: 'free_key@maher_apis',
      q: appName
    };

    const response = await axios.get(apiUrl, { params });

    if (!response.data || response.data.status !== 200 || !response.data.result) {
      return m.reply('❌ لم يتم العثور على التطبيق. حاول مرة أخرى.');
    }

    const { name, lastup, package: pkg, size, icon, dllink } = response.data.result;

    // إرسال صورة التطبيق مع رسالة
    await conn.sendMessage(m.chat, {
      image: { url: icon },
      caption: `📦 *جـاري تحـمـيل ${name}...*`
    }, { quoted: m });

    const apkRes = await axios.get(dllink, { responseType: 'arraybuffer' });
    const apkBuffer = Buffer.from(apkRes.data, 'binary');

    const caption = `📦 *معـلومات التـطبيق:*\n\n` +
                    `🔖 *الاسـم:* ${name}\n` +
                    `📅 *آخـر تحـديـث:* ${lastup}\n` +
                    `📦 *الـحزمـة:* ${pkg}\n` +
                    `📏 *الحـجم:* ${size}\n\n` +
                    `> 📥 تـم التـحـميل بواسـطة Alexy Ai`;

    await conn.sendMessage(m.chat, {
      document: apkBuffer,
      mimetype: 'application/vnd.android.package-archive',
      fileName: `${name}.apk`,
      caption
    }, { quoted: m });

    await m.reply("✅ تـم إرسـال التطـبيق بنـجاح");

  } catch (error) {
    console.error('خطأ أثناء تحـميل التطـبيق:', error);
    await m.reply('❌ حصل خـطأ أثنـاء تـحميل التطـبيق.');
  }
};

handler.help = ['apkdownload'];
handler.tags = ['downloader'];
handler.command = ['apkdownload'];
handler.limit = true;
export default handler;
