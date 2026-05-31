import fs from 'fs';
import path from 'path';
import { pipeline } from 'stream';
import { promisify } from 'util';
const streamPipeline = promisify(pipeline);

const MAX_SIZE_MB = 200;
const tmpDir = './tmp';
if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);

const HEADERS = {
  "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 Chrome/120.0.0.0 Mobile Safari/537.36",
  "Accept": "application/json, text/plain, */*",
  "Accept-Language": "en-US,en;q=0.9",
  "Referer": "https://en.aptoide.com/",
  "Origin": "https://en.aptoide.com"
};

const quickApps = [
  { name: 'instagram', title: 'Instagram' },
  { name: 'whatsapp', title: 'WhatsApp' },
  { name: 'facebook lite', title: 'Facebook Lite' },
  { name: 'tiktok', title: 'TikTok' },
  { name: 'youtube', title: 'YouTube' }
];

let handler = async (m, { conn, usedPrefix, command, args, text }) => {
  try {
    await conn.sendMessage(m.chat, { react: { text: '⌛', key: m.key } });

    const cmd = args[0]?.toLowerCase() || '';

    // Case 1: no text = show list menu
    if (!text) {
      const sections = [{
        title: "التطبيقات السريعة",
        rows: quickApps.map(app => ({
          id: `${usedPrefix}${command} ${app.name}`,
          title: app.title,
          description: "اضغط للتحميل المباشر"
        }))
      }];

      await conn.sendMessage(m.chat, {
        text: "اختر تطبيق من القائمة أو اكتب `.apk اسم التطبيق` للبحث\nمثال: `.apk clash of clans`",
        footer: "© APK Downloader",
        buttons: [{
          buttonId: 'apk_menu',
          buttonText: { displayText: "📱 اضغط هنا واختر تطبيق" },
          type: 4,
          nativeFlowInfo: {
            name: 'single_select',
            paramsJson: JSON.stringify({ title: "اختر التطبيق", sections })
          }
        }],
        headerType: 1
      }, { quoted: m });

      await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
      return;
    }

    // Case 2: user selected from search results
    if (cmd === 'dl') {
      const appData = JSON.parse(Buffer.from(args[1], 'base64').toString());
      return downloadApk(m, conn, appData);
    }

    // Case 3: search and show results list
    let results = await searchApk(text);
    if (!results || results.length === 0) throw new Error("ما لقيت تطبيقات، جرب اسم ثاني");

    const sections = [{
      title: `نتائج البحث عن: ${text}`,
      rows: results.slice(0, 10).map((app, i) => ({
        id: `${usedPrefix}${command} dl ${Buffer.from(JSON.stringify(app)).toString('base64')}`,
        title: app.appname,
        description: `${app.developer} | ${app.size}`
      }))
    }];

    await conn.sendMessage(m.chat, {
      text: `لقيت ${results.length} نتيجة. اختر التطبيق اللي تبيه:`,
      footer: "© APK Downloader",
      buttons: [{
        buttonId: 'apk_results',
        buttonText: { displayText: "📋 عرض النتائج" },
        type: 4,
        nativeFlowInfo: {
          name: 'single_select',
          paramsJson: JSON.stringify({ title: "اختر التطبيق", sections })
        }
      }],
      headerType: 1
    }, { quoted: m });

    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

  } catch (e) {
    console.error('APK Error:', e);
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
    m.reply(`صار خطأ:\n${e.message}`);
  }
};

// دالة التحميل
async function downloadApk(m, conn, app) {
  let sizeMB = parseFloat(app.size);
  let caption = `
*🔖 اسم التطبيق:* ${app.appname}
*👨‍💻 المطور:* ${app.developer}
*📦 الحجم:* ${app.size}
`.trim();

  await conn.sendMessage(m.chat, { image: { url: app.img }, caption }, { quoted: m });

  if (!isNaN(sizeMB) && sizeMB > MAX_SIZE_MB) {
    await conn.sendMessage(m.chat, {
      text: `⚠️ حجم التطبيق ${app.size} كبير جداً\nرابط التحميل المباشر:\n${app.link}`
    }, { quoted: m });
    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
    return;
  }

  await conn.sendMessage(m.chat, { text: "⏳ جاري تحميل الملف..." }, { quoted: m });

  const fileName = app.appname.replace(/[<>:"/\\|?*]/g, '_') + ".apk";
  const filePath = path.join(tmpDir, fileName);

  const res = await fetch(app.link, {
    headers: { "User-Agent": HEADERS["User-Agent"] },
    timeout: 180000
  });
  if (!res.ok) throw new Error(`فشل التحميل: ${res.status}`);

  await streamPipeline(res.body, fs.createWriteStream(filePath));

  await conn.sendMessage(
    m.chat,
    {
      document: fs.readFileSync(filePath),
      fileName: fileName,
      mimetype: "application/vnd.android.package-archive",
    },
    { quoted: m },
  );

  fs.unlinkSync(filePath);
  await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
}

// دالة البحث - ترجع مصفوفة نتائج
async function searchApk(query) {
  let apps = [];
  try {
    let search = await fetch(`https://ws75.aptoide.com/api/7/apps/search?query=${encodeURIComponent(query)}&limit=10`, {
      headers: HEADERS,
      timeout: 10000
    });
    let s = await search.json();
    if (s.datalist?.list) {
      apps = s.datalist.list.map(app => ({
        img: app.icon,
        developer: app.store?.name || 'Unknown',
        appname: app.name,
        size: app.size? (app.size / 1024 / 1024).toFixed(1) + " MB" : "N/A",
        link: app.file?.path || null,
      })).filter(a => a.link);
    }
  } catch (e) { console.log('Aptoide failed:', e.message); }

  return apps;
}

handler.help = ["apk"];
handler.tags = ["downloader"];
handler.command = /^(apk)$/i;
handler.limit = true;
export default handler;
