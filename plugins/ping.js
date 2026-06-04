import speed from "performance-now";
import { spawn, exec, execSync } from "child_process";

let handler = async (m, { conn }) => {
  // ⏱️ حساب السرعة
  let الوقت = speed();
  let السرعة = speed() - الوقت;

  // 📊 جلب معلومات النظام
  exec(`neofetch --stdout`, (error, stdout, stderr) => {
    let البيانات = stdout.toString("utf-8");

    // 🔁 استبدال كلمة Memory بـ RAM بالعربية
    let معلومات = البيانات.replace(/Memory:/, "الذاكرة:");

    // 📩 إرسال النتيجة
    m.reply(`${معلومات}
⚡ السرعة: ${السرعة.toFixed(4)} مللي ثانية`);
  });
};

// 📌 الأوامر
handler.help = ["ping"];
handler.tags = ["tools"];
handler.command = ["ping", "speed", "ping"];

export default handler;
