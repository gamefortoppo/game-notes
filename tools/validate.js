// Kiểm tra site/data.js. Dùng chung cho tools/check.html (trình duyệt) và tools/validate.mjs (Node / GitHub Actions).
(function (root) {
  function validateData({ ACTIONS, ELEMENTS, WEAPONS, CHARACTERS }) {
    const errors = [], warnings = [];
    const err = (where, msg) => errors.push(`${where}: ${msg}`);
    const warn = (where, msg) => warnings.push(`${where}: ${msg}`);

    for (const [name, v] of Object.entries({ ACTIONS, ELEMENTS, WEAPONS, CHARACTERS }))
      if (!v) err("data.js", `thiếu biến ${name}`);
    if (errors.length) return { errors, warnings };
    if (!Array.isArray(CHARACTERS)) { err("CHARACTERS", "phải là mảng [...]"); return { errors, warnings }; }

    const baseKey = a => String(a).trim().replace(/\s*[x×]\s*\d+$/i, "").trim();
    const isUrl = u => /^https:\/\/\S+$/.test(u);
    const ids = new Set();

    for (const t of [["ELEMENTS", ELEMENTS], ["WEAPONS", WEAPONS]])
      for (const [k, v] of Object.entries(t[1])) {
        if (!v || !v.name) err(`${t[0]}.${k}`, "thiếu name");
        if (v && v.icon && !isUrl(v.icon)) err(`${t[0]}.${k}`, "icon không phải URL https");
      }

    CHARACTERS.forEach((c, i) => {
      const at = `Nhân vật #${i + 1}${c && c.name ? ` (${c.name})` : ""}`;
      if (!c || typeof c !== "object") return err(at, "không phải object {...}");
      if (!c.id) err(at, "thiếu id");
      else if (!/^[a-z0-9-]+$/.test(c.id)) err(at, `id "${c.id}" chỉ được dùng chữ thường, số, dấu gạch ngang`);
      else if (ids.has(c.id)) err(at, `id "${c.id}" bị trùng`);
      ids.add(c.id);
      if (!c.name) err(at, "thiếu name");
      if (c.element && !ELEMENTS[c.element]) err(at, `element "${c.element}" không có trong ELEMENTS (${Object.keys(ELEMENTS).join(", ")})`);
      if (!c.element) warn(at, "chưa có element");
      if (c.weapon && !WEAPONS[c.weapon]) err(at, `weapon "${c.weapon}" không có trong WEAPONS (${Object.keys(WEAPONS).join(", ")})`);
      if (c.rarity && ![4, 5].includes(c.rarity)) err(at, "rarity phải là 4 hoặc 5");
      if (!c.icon) warn(at, "chưa có icon");
      else if (!isUrl(c.icon)) err(at, "icon không phải URL https");
    });

    CHARACTERS.forEach(c => {
      if (!c || !c.id) return;
      const at = c.name || c.id;
      (c.skills || []).forEach((s, i) => {
        if (!ACTIONS[s.key]) err(`${at} › skills[${i + 1}]`, `phím "${s.key}" không có trong ACTIONS`);
        if (!s.name) warn(`${at} › skills[${i + 1}]`, "thiếu name");
      });
      (c.teams || []).forEach((t, ti) => {
        const tat = `${at} › đội "${t.name || ti + 1}"`;
        if (!t.name) warn(tat, "thiếu tên đội");
        const members = t.members || [];
        if (members.length !== 4) warn(tat, `đội có ${members.length} người (thường là 4)`);
        members.forEach(m => { if (!ids.has(m)) err(tat, `thành viên "${m}" chưa có trong CHARACTERS`); });
        if (t.video && t.video.url && !isUrl(t.video.url)) err(tat, "video.url không phải URL https");
        (t.rotation || []).forEach((r, ri) => {
          const rat = `${tat} › bước ${ri + 1}`;
          if (!ids.has(r.char)) err(rat, `nhân vật "${r.char}" chưa có trong CHARACTERS`);
          else if (!members.includes(r.char)) warn(rat, `"${r.char}" không nằm trong đội`);
          if (!Array.isArray(r.actions) || !r.actions.length) err(rat, "thiếu actions");
          else r.actions.forEach(a => { if (!ACTIONS[baseKey(a)]) err(rat, `thao tác "${a}" không có trong ACTIONS (${Object.keys(ACTIONS).join(", ")})`); });
          if (!r.why) warn(rat, "chưa có giải thích (why)");
        });
      });
      const b = c.build;
      if (b) (b.stats || []).forEach((s, i) => { if (!s.label || !s.target) err(`${at} › build.stats[${i + 1}]`, "cần cả label và target"); });
    });

    return { errors, warnings };
  }

  if (typeof module !== "undefined" && module.exports) module.exports = { validateData };
  else root.validateData = validateData;
})(typeof globalThis !== "undefined" ? globalThis : this);
