// instagram.com/noureddine_ouafy
/**
 * Plugin: .sc
 * Description: إرسال روابط السورس كود والقناة الرسمية
 */

let handler = async (m, { conn }) => {
  const teks = 
   
    `📢 *القناة الرسـمية علـى واتسـاب:*\n` +
    `https://whatsapp.com/channel/0029Vb7nYRZHAdNWqXl8ug1b\n\n` +
    ``;

  await conn.reply(m.chat, teks, m);
};

handler.help = handler.command = ['sc','script'];
handler.tags = ['tools'];
handler.limit = true;
export default handler;
