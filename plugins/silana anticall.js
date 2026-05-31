conn.ev.on("call", async (json) => {
  for (let id of json) {
    if (id.status === "offer") {
      let msg = await conn.sendMessage(id.from, {
        text: `⚠️ تنبيه

نعتذر، لا يمكن للبوت استقبال المكالمات حالياً ❌

📩 إذا كنت تحتاج مساعدة أو طلب ميزة، تواصل مع المالك.

🚫 الاتصال بالبوت يسبب إزعاج، لذلك سيتم حظرك تلقائياً.

📸 إنستغرام:
https://instagram.com/manon_tech__99

⚡ المرجو احترام قوانين استخدام البوت`
      });

      conn.sendContact(id.from, global.owner, msg);
      await conn.rejectCall(id.id, id.from);

      // حظر المستخدم
      await conn.updateBlockStatus(id.from, "block");
    }
  }
});
