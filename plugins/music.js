// تم الترجمة والتعديل بواسطة noureddine
// البلجن بواسطة Izuku-mi

import axios from "axios"
import crypto from "crypto"
import yts from "yt-search"

const handler = async (m, { text, conn }) => {
    try {
        if (!text) return m.reply("🎧 ما هي الأغنيـة التي تريد تشغيلها؟")

        const { all } = await yts(text)
        const metadata = all[0]
        if (!metadata) return m.reply("❌ لـم يـتم العـثور على الأغنـية")

        const url = metadata.url

        const client = axios.create({
            headers: {
                "content-type": "application/json",
                "origin": "https://yt.savetube.me",
                "user-agent": "Mozilla/5.0 (Linux; Android 15) AppleWebKit/537.36 Chrome/130 Mobile Safari/537.36"
            }
        })

        // استخراج معرف الفيديو
        const idMatch = url.match(/(?:youtu\.be\/|v=)([a-zA-Z0-9_-]{11})/)
        if (!idMatch) throw new Error("رابط يوتيوب غير صالح")

        const videoId = idMatch[1]

        // جلب CDN
        const { data: cdnRes } = await client.get("https://media.savetube.vip/api/random-cdn")
        const cdn = cdnRes.cdn

        // جلب المعلومات المشفرة
        const { data: infoRes } = await client.post(`https://${cdn}/v2/info`, {
            url: `https://www.youtube.com/watch?v=${videoId}`
        })

        // فك التشفير
        const encrypted = Buffer.from(infoRes.data, "base64")
        const key = Buffer.from("C5D58EF67A7584E4A29F6C35BBC4EB12", "hex")
        const iv = encrypted.subarray(0, 16)

        const decipher = crypto.createDecipheriv("aes-128-cbc", key, iv)
        const decrypted = Buffer.concat([
            decipher.update(encrypted.subarray(16)),
            decipher.final()
        ])

        const meta = JSON.parse(decrypted.toString())

        // طلب التحميل
        const { data: dlRes } = await client.post(`https://${cdn}/download`, {
            id: videoId,
            downloadType: "audio",
            quality: "128",
            key: meta.key
        })

        const download = dlRes?.data?.downloadUrl
        if (!download) throw new Error("فشل في الحصول على رابط التحميل")

        const caption = `*🎵 تـشغيل الأغـنيـة:*
*🌴 العـنوان:* ${metadata.title || ""}
*🎨 الـفنان:* ${metadata.author?.name || ""}
*🔗 الـرابـط:* ${metadata.url || ""}
*⏱️ المـدة:* ${metadata.timestamp || ""}

*✨ بـوسطة :* Alexy Ai

        await conn.sendMessage(
            m.chat,
            {
                image: { url: meta.thumbnail },
                caption
            },
            { quoted: m }
        )

        await conn.sendMessage(
            m.chat,
            {
                audio: { url: download },
                mimetype: "audio/mpeg"
            },
            { quoted: m }
        )

    } catch (e) {
        console.error(e)
        m.reply("❌ حـدث خطأ، ربما هناك ضغط كبير على السيرفر")
    }
}

handler.command = ["music"]
handler.help = ["music"]
handler.tags = ["downloader"]
export default handler
