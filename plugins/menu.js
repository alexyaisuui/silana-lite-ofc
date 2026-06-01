import moment from 'moment-timezone'

let handler = async (m, { conn, usedPrefix, command, args }) => {
    const cmd = (args[0] || 'list').toLowerCase()

    let d = new Date()
    let date = d.toLocaleDateString('en', { day: 'numeric', month: 'long', year: 'numeric' })
    let time = moment().tz('Africa/Casablanca').format('HH:mm:ss')

    const bgImage = 'https://files.catbox.moe/sn6cpj.jpg'
    const channelUrl = 'https://whatsapp.com/channel/0029Vb7nYRZHAdNWqXl8ug1b'

    const tagCount = {}
    const tagHelpMapping = {}

    Object.values(global.plugins)
  .filter(p =>!p.disabled && p.help && p.tags)
  .forEach(plugin => {
        const tags = Array.isArray(plugin.tags)? plugin.tags : [plugin.tags]
        const helps = Array.isArray(plugin.help)? plugin.help : [plugin.help]

        tags.forEach(tag => {
            if (!tag) return
            if (!tagCount[tag]) {
                tagCount[tag] = 0
                tagHelpMapping[tag] = []
            }
            tagCount[tag] += helps.length
            tagHelpMapping[tag].push(...helps)
        })
    })

    const totalCmd = Object.values(tagCount).reduce((a, b) => a + b, 0)
    const tagList = Object.keys(tagCount).sort()

    const headerText = `╭───「 *${conn.user.name}* 」───╮
│ *Hello @${m.pushName}* 👋
│ *${date}* 📅
│ *${time}* ⏰
│ *${totalCmd} ${tagList.length}* 📦
╰────────────────────────╯

🤖 *مرحباً بقائمة أوامر البوت*
اختر تصنيف من القائمة أو حمل الملف الكامل`

    const sendList = async (caption) => {
        if (caption.length > 4096) caption = caption.slice(0, 4090) + '\n\n...القائمة طويلة جداً'
        return conn.sendMessage(m.chat, {
            image: { url: bgImage },
            caption,
            mentions: [m.sender]
        })
    }

    // القائمة الرئيسية مع الأزرار
    if (cmd === 'list' || cmd === 'menu') {
        const sections = [{
            title: "التـصنيـفات",
            rows: tagList.map(tag => ({
                id: `${usedPrefix}${command} ${tag}`,
                title: tag.toUpperCase(),
                description: `${tagCount[tag]} أمر`
            }))
        }]

        return conn.sendMessage(m.chat, {
            image: { url: bgImage },
            caption: headerText,
            footer: "© ALEXY AI",
            buttons: [
                { buttonId: `${usedPrefix}${command} all`, buttonText: { displayText: "📦 كـل الأوامـر" }, type: 1 },
                { buttonId: `${usedPrefix}${command} download`, buttonText: { displayText: "📥 تـحميـل الـقائـمة" }, type: 1 },
                { buttonId: `${usedPrefix}${command} قناة`, buttonText: { displayText: "📢 قـنـاة واتسـاب" }, type: 1 },
                {
                    buttonId: 'list_menu',
                    buttonText: { displayText: "📋 اخـتر تصـنيـف" },
                    type: 4,
                    nativeFlowInfo: {
                        name: 'single_select',
                        paramsJson: JSON.stringify({ title: "اختر التصنيف", sections })
                    }
                }
            ],
            headerType: 4,
            mentions: [m.sender]
        })

    // عرض كل الأوامر
    } else if (cmd === 'all') {
        let allTagsAndHelp = tagList.map(tag => {
            const daftarHelp = tagHelpMapping[tag].sort().map(h => ` ◦ ${usedPrefix}${h}`).join('\n')
            return `╭──「 *${tag.toUpperCase()}* 」──╮\n${daftarHelp}\n╰──────────────────╯`
        }).join('\n\n')
        return sendList(`${headerText}\n\n${allTagsAndHelp}`)

    // تحميل القائمة كملف txt
    } else if (cmd === 'download') {
        let txt = `قائمة أوامر ${conn.user.name}\nالتاريخ: ${date} ${time}\n\n`
        tagList.forEach(tag => {
            txt += `[${tag.toUpperCase()}]\n`
            tagHelpMapping[tag].sort().forEach(h => txt += `${usedPrefix}${h}\n`)
            txt += '\n'
        })
        return conn.sendMessage(m.chat, {
            document: Buffer.from(txt, 'utf-8'),
            mimetype: 'text/plain',
            fileName: `menu_${conn.user.name}.txt`,
            caption: `📥 تـم تجهيـز ${totalCmd} أمـر لك`
        }, { quoted: m })

    // عرض رابط القناة
    } else if (cmd === 'قناة' || cmd === 'channel') {
        return conn.sendMessage(m.chat, {
            text: `📢 *تابع قناتنا على واتساب*\n\nهنا ينزل كل جديد وتحديثات البوت\n${channelUrl}`,
            footer: "© ALEXY AI",
            buttons: [
                { buttonId: 'url', buttonText: { displayText: "🔗 تـم" }, type: 2, url: channelUrl }
            ],
            headerType: 1
        }, { quoted: m })

    // عرض تصنيف معين
    } else if (tagCount[cmd]) {
        const daftarHelp = tagHelpMapping[cmd].sort().map(h => ` ◦ ${usedPrefix}${h}`).join('\n')
        const list2 = `${headerText}\n\n╭───「 *${cmd.toUpperCase()}* 」───╮\n${daftarHelp}\n╰────────────────────────╯\n\n*الإجمالي: ${tagHelpMapping[cmd].length} أمر*`
        return sendList(list2)
    }
}

handler.help = ['menu', 'قناة']
handler.command = ['menu', 'help', 'list', 'قناة', 'channel']
handler.register = false
export default handler
