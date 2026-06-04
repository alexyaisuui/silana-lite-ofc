import axios from 'axios';

// كائن خاص بجلب التلاوات (المقرئين)
const Murottal = {
    // جلب قائمة التلاوات
    async list() {
        try {
            let res = await axios.get('https://www.assabile.com/ajax/loadplayer-12-9');
            
            // التحقق من صحة البيانات
            if (!res.data || !res.data.Recitation) throw new Error('تنسيق البيانات غير صحيح');
            
            return res.data.Recitation;
        } catch (error) {
            console.error('حدث خطأ أثناء جلب قائمة التلاوات:', error.message);
            return [];
        }
    },

    // البحث عن سورة بالاسم أو الرقم
    async search(q) {
        let list = await Murottal.list();
        if (list.length === 0) return [];

        // إذا كان الإدخال رقم يرجع السورة مباشرة
        if (typeof q === 'number') return [list[q - 1]];

        // تنظيف النص والبحث
        q = q.toLowerCase().replace(/\W/g, '');
        return list.filter(_ => 
            _.span_name.toLowerCase().replace(/\W/g, '').includes(q)
        );
    },

    // جلب رابط الصوت
    async audio(d) {
        try {
            if (!d.href) throw new Error('البيانات لا تحتوي على رابط');

            let res = await axios.get(`https://www.assabile.com/ajax/getrcita-link-${d.href.slice(1)}`, {
                headers: {
                    'authority': 'www.assabile.com',
                    'accept': '*/*',
                    'referer': 'https://www.assabile.com/abdul-rahman-al-sudais-12/abdul-rahman-al-sudais.htm',
                    'sec-ch-ua': '"Not A(Brand";v="8", "Chromium";v="132"',
                    'sec-ch-ua-mobile': '?1',
                    'sec-ch-ua-platform': '"Android"',
                    'sec-fetch-mode': 'cors',
                    'sec-fetch-site': 'same-origin',
                    'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Mobile Safari/537.36',
                    'x-requested-with': 'XMLHttpRequest'
                },
                decompress: true
            });

            if (!res.data) throw new Error('فشل في جلب الصوت');

            return res.data;
        } catch (error) {
            console.error('حدث خطأ أثناء جلب الصوت:', error.message);
            return null;
        }
    }
};

// الهاندلر (الأمر الخاص بالبوت)
let handler = async (m, { conn, text }) => {

    // التحقق من إدخال المستخدم
    if (!text) return m.reply('يرجى إدخال اسم السورة أو رقمها.');

    try {
        // البحث عن السورة
        let searchResults = await Murottal.search(isNaN(parseInt(text)) ? text : parseInt(text));
        
        if (searchResults.length === 0) 
            return m.reply('لم يتم العثور على تلاوة مطابقة.');

        // جلب رابط الصوت
        let audioUrl = await Murottal.audio(searchResults[0]);
        
        if (!audioUrl) 
            return m.reply('فشل في جلب الصوت.');

        // إرسال الصوت
        await conn.sendMessage(
            m.chat,
            { audio: { url: audioUrl }, mimetype: 'audio/mp4' },
            { quoted: m }
        );

    } catch (error) {
        console.error(error);
        m.reply('حدث خطأ أثناء جلب البيانات.');
    }
};

// معلومات الأمر
handler.help = ['quranmp3'];
handler.tags = ['islamic'];
handler.command = /^(quranmp3)$/i;

export default handler;
