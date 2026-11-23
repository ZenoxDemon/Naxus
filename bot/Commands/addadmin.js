module.exports = {
  name: "addadmin",

  async execute(api, event, adminStore) {
    const threadID = String(event.threadID);

    if (!event.messageReply || !event.messageReply.senderID) {
      try {
        await api.sendMessage(
          "⚠️ يجب الرد على رسالة الشخص الذي تريد تعيينه أدمن.",
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

    if (adminStore.isAdmin(targetID)) {
      try {
        await api.sendMessage("✅ هذا الشخص أدمن بالفعل.", threadID);
      } catch (e) {}
      return;
    }

    const added = adminStore.add(targetID);
    if (added) {
      try {
        await api.sendMessage(
          "✅ تم تعيينه أدمن بنجاح.\n теперь يمكنه استخدام جميع أوامر البوت.",
          threadID,
        );
      } catch (e) {}
    } else {
      try {
        await api.sendMessage("❌ تعذر تعيينه أدمن.", threadID);
      } catch (e) {}
    }
  },
};
