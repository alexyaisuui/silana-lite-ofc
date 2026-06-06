import axios from "axios";
import cheerio from "cheerio";
import qs from "qs";

let handler = async (m, { conn, usedPrefix, command, text }) => {
    if (!text) return m.reply(`• *مـثال*: ${usedPrefix + command} *[رابـط إنسـتغرام]*`);
    if (!text.includes('instagram.com')) return m.reply(`• *مـثال*: ${usedPrefix + command} *[رابط إنسـتغرام]*`);

    m.reply("⏳ يـرجـى الانتـظار...");
    try {
        const result = await Instagram(text);
        if (!result.url || result.url.length === 0) return m.reply("لـم يتم العـثور على وسـائط.");

        const mediaUrls = result.url;
        const metadata = result.metadata;

        const caption = `*乂 ALEXY AI *

   *الـعنـوان:* ${metadata.caption}
   *النـاشـر:* ${metadata.username}
   *الـنـوع:* ${metadata.isVideo ? "فيديو" : "صورة"}
   *الإعـجابـات:* ${formatShortNumber(metadata.like)}
   *التـعليقـات:* ${formatShortNumber(metadata.comment)}`.trim();

        for (const mediaUrl of mediaUrls) {
            await conn.sendFile(m.chat, mediaUrl, "", caption, m);
        }
    } catch (error) {
        m.reply("حدث خطأ، حاول مرة أخرى لاحقًا.");
    }
};

handler.help = ["ig", "instagram"];
handler.tags = ["downloader"];
handler.command = ["ig", "instagram"];

export default handler;

function formatShortNumber(number) {
    if (number >= 1e6) {
        return (number / 1e6).toFixed(1) + "M";
    } else if (number >= 1e3) {
        return (number / 1e3).toFixed(1) + "K";
    }
    return number.toString();
}

const getDownloadLinks = (url) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!url.match(/(?:https?:\/\/(web\.|www\.|m\.)?(facebook|fb)\.(com|watch)\S+)?$/) && !url.match(/(https|http):\/\/www.instagram.com\/(p|reel|tv|stories)/gi)) {
                return reject({ msg: "رابط غير صالح" });
            }

            function decodeData(data) {
                let [part1, part2, part3, part4, part5, part6] = data;

                function decodeSegment(segment, base, length) {
                    const charSet = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+/".split("");
                    let baseSet = charSet.slice(0, base);
                    let decodeSet = charSet.slice(0, length);

                    let decodedValue = segment.split("").reverse().reduce((accum, char, index) => {
                        if (baseSet.indexOf(char) !== -1) {
                            return accum += baseSet.indexOf(char) * Math.pow(base, index);
                        }
                    }, 0);

                    let result = "";
                    while (decodedValue > 0) {
                        result = decodeSet[decodedValue % length] + result;
                        decodedValue = Math.floor(decodedValue / length);
                    }

                    return result || "0";
                }

                part6 = "";
                for (let i = 0, len = part1.length; i < len; i++) {
                    let segment = "";
                    while (part1[i] !== part3[part5]) {
                        segment += part1[i];
                        i++;
                    }

                    for (let j = 0; j < part3.length; j++) {
                        segment = segment.replace(new RegExp(part3[j], "g"), j.toString());
                    }
                    part6 += String.fromCharCode(decodeSegment(segment, part5, 10) - part4);
                }
                return decodeURIComponent(encodeURIComponent(part6));
            }

            function extractParams(data) {
                return data.split("decodeURIComponent(escape(r))}(")[1].split("))")[0].split(",").map(item => item.replace(/"/g, "").trim());
            }

            function extractDownloadUrl(data) {
                return data.split("getElementById(\"download-section\").innerHTML = \"")[1].split("\"; document.getElementById(\"inputData\").remove(); ")[0].replace(/\\(\\)?/g, "");
            }

            function getVideoUrl(data) {
                return extractDownloadUrl(decodeData(extractParams(data)));
            }

            const response = await axios.post("https://snapsave.app/action.php?lang=id", "url=" + url, {
                headers: {
                    accept: "*/*",
                    "content-type": "application/x-www-form-urlencoded",
                    origin: "https://snapsave.app",
                    referer: "https://snapsave.app/id",
                    "user-agent": "Mozilla/5.0"
                }
            });

            const data = response.data;
            const videoPageContent = getVideoUrl(data);
            const $ = cheerio.load(videoPageContent);
            const downloadLinks = [];

            $("div.download-items__btn").each((i, el) => {
                let link = $(el).find("a").attr("href");
                if (!/^https?:\/\//.test(link)) link = "https://snapsave.app" + link;
                downloadLinks.push(link);
            });

            if (!downloadLinks.length) {
                return reject({ msg: "لم يتم العثور على بيانات" });
            }

            return resolve({
                url: downloadLinks,
                metadata: {
                    url: url
                }
            });
        } catch (error) {
            return reject({ msg: error.message });
        }
    });
};

const HEADERS = {
    Accept: "*/*",
    "Content-Type": "application/x-www-form-urlencoded",
    "User-Agent": "Mozilla/5.0"
};

function getInstagramPostId(url) {
    const regex = /instagram\.com\/(?:p|tv|stories|reel)\/([^/?#&]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

async function ig(url) {
    const postId = getInstagramPostId(url);
    if (!postId) throw new Error("رابط إنستغرام غير صالح");

    const response = await axios.get(`https://www.instagram.com/p/${postId}/?__a=1`);
    const media = response.data.graphql.shortcode_media;

    return {
        url: [media.video_url || media.display_url],
        metadata: {
            caption: media.edge_media_to_caption.edges[0]?.node.text || "",
            username: media.owner.username,
            like: media.edge_media_preview_like.count,
            comment: media.edge_media_to_comment.count,
            isVideo: media.is_video
        }
    };
}

async function Instagram(url) {
    try {
        return await ig(url);
    } catch {
        return await getDownloadLinks(url);
    }
    }
