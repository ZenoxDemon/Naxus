module.exports = {
  name: "removeadmin",

  async execute(api, event, adminStore) {
    const threadID = String(event.threadID);

    if (!event.messageReply || !event.messageReply.senderID) {
      try {
        await api.sendMessage(
          "⚠️ يجب الرد على رسالة الشخص الذي تريد إزالة أدمن.",
          threadID,
        );
      } catch (e) {}
      return;
    }

    const targetID = String(event.messageReply.senderID);

    if (!adminStore) {
      try {
        await api.sendMessage("❌ نظام إدارة الأدمنز غير متوفر.", threadID);
      } catch (e) {}
      return;
    }

    if (!adminStore.isAdmin(targetID)) {
      try {
        await api.sendMessage("⚠️ هذا الشخص ليس أدمن.", threadID);
      } catch (e) {}
      return;
    }

    const removed = adminStore.remove(targetID);
    if (removed) {
      try {
        await api.sendMessage(
          "✅ تم إزالته من الأدمن.\n لم يعد يستطيع استخدام أوامر البوت.",
          threadID,
        );
      } catch (e) {}
    } else {
      try {
        await api.sendMessage("❌ تعذر إزالته من الأدمن.", threadID);
      } catch (e) {}
    }
  },
};
