const fs = require("fs");
const path = require("path");
const { writeFileAtomic } = require("./atomic-file");

const DEFAULT_ADMINS_PATH = path.join(__dirname, "data", "admins.json");

function normalizeID(id) {
  return String(id || "")
    .replace(/(?:fb)?id[:.]/iu, "")
    .trim();
}

function createAdminStore({ filePath = DEFAULT_ADMINS_PATH, seedAdmins = [] } = {}) {
  const resolvedPath = path.resolve(filePath);
  const admins = new Set();

  for (const id of seedAdmins) {
    const nid = normalizeID(id);
    if (nid) admins.add(nid);
  }

  try {
    const data = JSON.parse(fs.readFileSync(resolvedPath, "utf8"));
    if (data && Array.isArray(data.admins)) {
      for (const id of data.admins) {
        const nid = normalizeID(id);
        if (nid) admins.add(nid);
      }
    }
  } catch (error) {
    if (error.code !== "ENOENT") {
      console.error("[admin-store] تعذر قراءة ملف الأدمنز:", error.message);
    }
  }

  function save() {
    const content = JSON.stringify(
      { admins: [...admins].sort() },
      null,
      2,
    );
    writeFileAtomic(resolvedPath, content);
  }

  function isAdmin(id) {
    return admins.has(normalizeID(id));
  }

  function add(id) {
    const nid = normalizeID(id);
    if (!nid) return false;
    if (admins.has(nid)) return false;
    admins.add(nid);
    save();
    return true;
  }

  function remove(id) {
    const nid = normalizeID(id);
    if (!admins.has(nid)) return false;
    admins.delete(nid);
    save();
    return true;
  }

  function list() {
    return [...admins].sort();
  }

  return { isAdmin, add, remove, list };
}

module.exports = { createAdminStore, normalizeID };
