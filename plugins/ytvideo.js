// تم تعديل الإضافة بواسطة instagram.com/noureddine_ouafy
// الكود الأصلي من https://github.com/mruniquehacker/Knightbot-MD/blob/main/commands/video.js شكراً له

import axios from 'axios'
import yts from 'yt-search'

const AXIOS_DEFAULTS = {
    timeout: 60000,
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Accept': 'application/json, text/plain, */*'
    }
}

// دالة لإعادة المحاولة في حالة فشل الطلب
async function tryRequest(getter, attempts = 3) {
    let lastError
    for (let attempt = 1; attempt <= attempts; attempt++) {
        try {
            return await getter()
        } catch (err) {
            lastError = err
            if (attempt < attempts) {
                await new Promise(r => setTimeout(r, 1000 * attempt))
            }
        }
    }
    throw lastError
}

// ===== مصادر التحميل =====

// API الأول
async function getEliteProTechVideoByUrl(youtubeUrl) {
    const apiUrl = `https://eliteprotech-apis.zone.id/ytdown?url=${encodeURIComponent(youtubeUrl)}&format=mp4`
    const res = await tryRequest(() => axios.get(apiUrl, AXIOS_DEFAULTS))
    if (res?.data?.success && res?.data?.downloadURL) {
        return {
            download: res.data.downloadURL,
            title: res.data.title
        }
    }
    throw new Error('فشل API الأول EliteProTech')
}

// API الثاني
async function getYupraVideoByUrl(youtubeUrl) {
    const apiUrl = `https://api.yupra.my.id/api/downloader/ytmp4?url=${encodeURIComponent(youtubeUrl)}`
    const res = await tryRequest(() => axios.get(apiUrl, AXIOS_DEFAULTS))
    if (res?.data?.success && res?.data?.data?.download_url) {
        return {
            download: res.data.data.download_url,
            title: res.data.data.title,
            thumbnail: res.data.data.thumbnail
        }
    }
    throw new Error('فشل API الثاني Yupra')
}

// API الثالث
async function getOkatsuVideoByUrl(youtubeUrl) {
    const apiUrl = `https://okatsu-rolezapiiz.vercel.app/downloader/ytmp4?url=${encodeURIComponent(youtubeUrl)}`
    const res = await tryRequest(() => axios.get(apiUrl, AXIOS_DEFAULTS))
    if (res?.data?.result?.mp4) {
        return {
            download: res.data.result.mp4,
            title: res.data.result.title
        }
    }
    throw new Error('فشل API الثالث Okatsu')
}

// ===== المعالج الرئيسي =====

let handler = async (m, { conn, text, usedPrefix, command }) => {
    try {
        if (!text) {
            return conn.reply(m.chat, 
`🎬 *تحميل فيديو من يوتيوب*

طريقة الاستخدام:
${usedPrefix}ytvideo <رابط يوتيوب>
أو
${usedPrefix}ytvideo <اسم الفيديو>

مثال:
${usedPrefix}ytvideo Alan Walker Faded
${usedPrefix}ytvideo https://youtu.be/dQw4w9WgXcQ`,
            m)
        }

        let videoUrl = ''
        let videoTitle = ''
        let videoThumbnail = ''

        // إذا المستخدم أرسل رابط مباشر
        if (text.startsWith('http://') || text.startsWith('https://')) {
            videoUrl = text
        } else {
            // البحث عن الفيديو
            const { videos } = await yts(text)
            if (!videos || !videos.length) {
                return conn.reply(m.chat, '❌ لم يتم العثور على فيديو.', m)
            }
            videoUrl = videos[0].url
            videoTitle = videos[0].title
            videoThumbnail = videos[0].thumbnail
        }

        await conn.reply(m.chat, '⏳ جاري تحميل الفيديو، يرجى الانتظار...', m)

        const apiMethods = [
            () => getEliteProTechVideoByUrl(videoUrl),
            () => getYupraVideoByUrl(videoUrl),
            () => getOkatsuVideoByUrl(videoUrl)
        ]

        let videoData
        for (let method of apiMethods) {
            try {
                videoData = await method()
                if (videoData?.download) break
            } catch { continue }
        }

        if (!videoData?.download) {
            throw new Error('فشلت جميع مصادر التحميل')
        }

        await conn.sendMessage(m.chat, {
            video: { url: videoData.download },
            mimetype: 'video/mp4',
            fileName: `${(videoData.title || videoTitle || 'video').replace(/[^\w\s-]/g, '')}.mp4`,
            caption: `🎬 *${videoData.title || videoTitle || 'فيديو'}*\n\nتم التحميل بنجاح!`
        }, { quoted: m })

    } catch (err) {
        console.error(err)
        conn.reply(m.chat, `❌ خطأ: ${err.message}`, m)
    }
}

// معلومات الأوامر
handler.help = ['ytvideo']
handler.tags = ['downloader']
handler.command = ['ytvideo']
handler.limit = true

export default handler
