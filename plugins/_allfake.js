import fs from "fs";
import fetch from "node-fetch";
import moment from "moment-timezone";
import axios from "axios";
import speed from "performance-now";

let handler = (m) => m;

handler.all = async function (m) {
  let name = await conn.getName(m.sender);
  let logo = "https://files.catbox.moe/hnbuh3.jpg";
  let namebot = "ALEXY AI";
  let channelUrl = "https://whatsapp.com/channel/120363409733349082";
  let channelJid = "120363409733349082@newsletter";

  try {
    // pp = await this.profilePictureUrl(m.sender, "image");
  } catch (e) {
    console.error(e);
  } finally {
    global.emror = "https://files.catbox.moe/hnbuh3.jpg";

    global.doc = pickRandom([
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "application/msword",
      "application/pdf",
    ]);
    global.fsizedoc = pickRandom([2000, 3000, 2023000, 2024000]);

    global.axios = (await import("axios")).default;
    global.fetch = (await import("node-fetch")).default;
    global.cheerio = (await import("cheerio")).default;
    global.fs = (await import("fs")).default;

    let timestamp = speed();
    let latensi = speed() - timestamp;
    let ms = await latensi.toFixed(4);

    global.kontak2 = [
      [
        owner[0],
        await conn.getName(owner[0] + "@s.whatsapp.net"),
        "ALEXY AI",
        channelUrl,
        true,
      ],
    ];

    global.fkon = {
      key: {
        fromMe: false,
        participant: m.sender,
      ...(m.chat? { remoteJid: "BROADCAST GROUP" } : {}),
      },
      message: {
        contactMessage: {
          displayName: `${name}`,
          vcard: `BEGIN:VCARD\nVERSION:3.0\nN:;a,;;;\nFN:${name}\nitem1.TEL;waid=${m.sender.split("@")[0]}:${m.sender.split("@")[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`,
        },
      },
    };

    global.fVerif = {
      key: {
        participant: "0@s.whatsapp.net",
        remoteJid: "0@s.whatsapp.net",
      },
      message: {
        conversation: `_${namebot} تـم التـحقـق عـن طـريـق الـواتسـاب_`,
      },
    };

    global.ephemeral = "86400";
    global.ucapan = ucapan();
    global.botdate = date();

    // الحل: خلي adReply فانكشن باش يخدم مع أي شخص
    global.adReply = (text = "ALEXY AI") => ({
      contextInfo: {
        isForwarded: true,
        forwardingScore: 999,
        mentionedJid: [m.sender],
        forwardedNewsletterMessageInfo: {
          newsletterJid: channelJid,
          serverMessageId: 103,
          newsletterName: `ALEXY AI 🌠`,
        },
        externalAdReply: {
          title: namebot,
          body: text,
          thumbnailUrl: logo,
          sourceUrl: channelUrl,
          mediaType: 1,
          renderLargerThumbnail: true,
        },
      },
    });

    // نفس الشيء لـ fakeig
    global.fakeig = (text = "ALEXY AI") => ({
      contextInfo: {
        isForwarded: true,
        forwardingScore: 999,
        mentionedJid: [m.sender],
        forwardedNewsletterMessageInfo: {
          newsletterJid: channelJid,
          serverMessageId: 103,
          newsletterName: `ALEXY AI 🌠`,
        },
        externalAdReply: {
          showAdAttribution: true,
          title: namebot,
          body: text,
          thumbnailUrl: logo,
          sourceUrl: channelUrl,
        },
      },
    });
  }
};

export default handler;

function date() {
  let d = new Date(new Date() + 3600000);
  let locale = "ar";
  let week = d.toLocaleDateString(locale, { weekday: "long" });
  let date = d.toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" });
  return `${week}, ${date}`;
}

function ucapan() {
  const time = moment.tz("Africa/Casablanca").format("HH");
  if (time >= 4 && time < 10) return "صباح الخير 🌤️";
  if (time >= 10 && time < 15) return "مساء الخير ☀️";
  if (time >= 15 && time < 18) return "عواشركم مبروكة 🌅";
  if (time >= 18) return "مساء النور 🌙";
  return "اضغط هنا لمتابعة صاحب البوت";
}

function pickRandom(list) {
  return list[Math.floor(list.length * Math.random())];
      }
          
