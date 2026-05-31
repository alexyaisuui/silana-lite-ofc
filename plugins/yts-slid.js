import yts from "yt-search";
import axios from 'axios';
const { generateWAMessageContent, generateWAMessageFromContent, proto } = (await import('@adiwajshing/baileys')).default;

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return m.reply(`• *مثال:* ${usedPrefix + command} تعلم كيف تنشئ تطبيق`);

    await m.reply('*_`جاري البحث`_*');

    async function createImage(url) {
        const { imageMessage } = await generateWAMessageContent({
            image: { url }
        }, {
            upload: conn.waUploadToServer
        });
        return imageMessage;
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    let push = [];
    let results = await yts(text);
    let videos = results.videos.slice(0, 15); // أخذ أول 15 نتيجة
    shuffleArray(videos); // ترتيب عشوائي للنتائج

    let i = 1;
    for (let video of videos) {
        let imageUrl = video.thumbnail;
        push.push({
            body: proto.Message.InteractiveMessage.Body.fromObject({
                text: `🎬 *الـعـنوان:* ${video.title}\n⌛ *الـمـدة:* ${video.timestamp}\n👀 *الـمشاهـدات:* ${video.views}\n🔗 *الـرابـط:* ${video.url} \n`
            }),
            footer: proto.Message.InteractiveMessage.Footer.fromObject({
                text: 'ALEXY AI 🧠'
            }),
            header: proto.Message.InteractiveMessage.Header.fromObject({
                title: `فـيديـو ${i++}`,
                hasMediaAttachment: true,
                imageMessage: await createImage(imageUrl)
            }),
            nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                buttons: [
                    {
                        "name": "cta_url",
                        "buttonParamsJson": `{"display_text":"شاهد على يوتيوب","url":"${video.url}"}`
                    }
                ]
            })
        });
    }

    const bot = generateWAMessageFromContent(m.chat, {
        viewOnceMessage: {
            message: {
                messageContextInfo: {
                    deviceListMetadata: {},
                    deviceListMetadataVersion: 2
                },
                interactiveMessage: proto.Message.InteractiveMessage.fromObject({
                    body: proto.Message.InteractiveMessage.Body.create({
                        text: "`اكـتمـل البحـث...`"
                    }),
                    footer: proto.Message.InteractiveMessage.Footer.create({
                        text: 'ALEXY AI'
                    }),
                    header: proto.Message.InteractiveMessage.Header.create({
                        hasMediaAttachment: false
                    }),
                    carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({
                        cards: [...push]
                    })
                })
            }
        }
    }, {});

    await conn.relayMessage(m.chat, bot.message, { messageId: bot.key.id });
}

handler.help = ["yts-slid"];
handler.tags = [""];
handler.command = /^(yts-slid)$/i;
handler.limit = true 
export default handler;
