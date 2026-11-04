(function () {
  const app = document.getElementById("app");
  const search = document.getElementById("search");
  const byId = Object.fromEntries(CHARACTERS.map(c => [c.id, c]));

  const esc = s => String(s ?? "").replace(/[&<>"']/g, ch =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
  const el = c => `--el:var(--${(c && c.element) || "geo"})`;
  const hasGuide = c => !!(c.teams?.length || c.skills?.length || c.build);

  function pic(c) {
    const url = c.icon;
    const initial = esc((c.name || "?")[0]);
    return url
      ? `<img src="${esc(url)}" alt="${esc(c.name)}" loading="lazy" onerror="this.outerHTML='<div class=&quot;ph&quot;>${initial}</div>'">`
      : `<div class="ph">${initial}</div>`;
  }

  const splitKey = code => {
    const m = String(code).trim().match(/^(.*?)(?:\s*[x×]\s*(\d+))?$/i);
    return [m[1].trim(), m[2]];
  };
  function key(code) {
    const [base, n] = splitKey(code);
    const a = ACTIONS[base] || { label: base, type: "basic" };
    return `<span class="key ${a.type}" title="${esc(a.label)}">${esc(base)}${n ? `<span class="x">×${n}</span>` : ""}</span>`;
  }
  const keys = list => list.map(key).join('<span class="then">›</span>');

  // Thuật ngữ: bọc chữ trùng key trong GLOSSARY để hiện giải thích
  const GLOSS = typeof GLOSSARY === "object" && GLOSSARY ? GLOSSARY : {};
  const glossRe = Object.keys(GLOSS).length
    ? new RegExp(`(?<![\\p{L}\\p{N}])(${Object.keys(GLOSS).sort((a, b) => b.length - a.length)
        .map(k => esc(k).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})(?![\\p{L}\\p{N}])`, "gu")
    : null;
  const txt = s => {
    const h = esc(s).replace(/\n/g, "<br>");
    return glossRe ? h.replace(glossRe, m => `<span class="term" tabindex="0" data-term="${m}">${m}</span>`) : h;
  };

  // ---------- Danh sách ----------
  function renderList(q = "") {
    q = q.trim().toLowerCase();
    const list = CHARACTERS.filter(c => !q || c.name.toLowerCase().includes(q));
    app.innerHTML = `
      <div class="list-head">
        <h1>Sổ tay nhân vật</h1>
        <p>Cách chơi, rotation và build mình hay dùng.</p>
      </div>
      <div class="grid">
        ${list.map(c => `
          <a class="card ${hasGuide(c) ? "" : "empty-guide"}" href="#/${esc(c.id)}" style="${el(c)}">
            <div class="pic">${pic(c)}${ELEMENTS[c.element]?.icon ? `<img class="badge" src="${esc(ELEMENTS[c.element].icon)}" alt="">` : ""}</div>
            <div class="info">
              <div class="nm">${esc(c.name)}</div>
              <div class="meta">${hasGuide(c) ? esc(c.role || "") : "Chưa có ghi chú"}</div>
            </div>
          </a>`).join("") || '<p class="empty">Không tìm thấy nhân vật.</p>'}
      </div>`;
  }

  // ---------- Trang nhân vật ----------
  function renderChar(c) {
    const b = c.build || {};
    const sections = [];
    const add = (id, title, html) => sections.push({ id, title, html });

    if (c.skills?.length) add("skills", "Kỹ năng", `
      <div class="block">
        ${c.skills.map(s => `
          <div class="skill">
            <div class="sk-ico">${s.icon ? `<img src="${esc(s.icon)}" alt="" loading="lazy">` : key(s.key)}</div>
            <div><div class="nm">${s.icon ? key(s.key) : ""} ${esc(s.name)}</div><p>${txt(s.desc)}</p></div></div>`).join("")}
      </div>`);

    // Nhiều đội → mỗi đội gập / mở được (đội đầu mở sẵn).
    // Lúc gập, dưới tên đội hiện dải avatar theo thứ tự ra sân.
    const multi = (c.teams?.length || 0) > 1;
    const strip = t => [...new Set(t.rotation.map(r => r.char))].map(id => {
      const m = byId[id] || { id, name: id };
      return `<span class="ava" style="${el(m)}" title="${esc(m.name)}">${pic(m)}</span>`;
    }).join(`<i class="ln"></i>`);

    if (c.teams?.length) add("rotation", "Rotation", c.teams.map((t, ti) => `
      <${multi ? `details class="team fold"${ti === 0 ? " open" : ""}` : `div class="team"`}>
        ${multi
          ? `<summary><span class="team-name">${esc(t.name)}</span><span class="chev" aria-hidden="true"></span>
               <span class="strip">${strip(t)}</span></summary>`
          : `<div class="team-name">${esc(t.name)}</div>`}
        <div class="members">
          ${t.members.map(id => { const m = byId[id] || { id, name: id };
            return `<a href="#/${esc(id)}" style="${el(m)}"><div class="ava">${pic(m)}</div>${esc(m.name)}</a>`; }).join("")}
        </div>
        ${t.video?.url ? `<a class="video" href="${esc(t.video.url)}" target="_blank" rel="noopener">▶ ${esc(t.video.title || "Xem video")}</a>` : ""}
        <ol class="timeline">
          ${t.rotation.map((r, i) => { const rc = byId[r.char] || { name: r.char };
            return `<li class="step" style="${el(rc)}">
              <span class="n">${i + 1}</span>
              <div class="head"><span class="who${r.char === c.id ? " me" : ""}">${esc(rc.name)}</span>${keys(r.actions)}</div>
              ${r.why ? `<p class="why">${txt(r.why)}</p>` : ""}
              ${r.warn ? `<div class="warn"><b>Chú ý:</b> ${txt(r.warn)}</div>` : ""}
            </li>`; }).join("")}
        </ol>
        <div class="legend">${legendFor(t.rotation)}</div>
      </${multi ? "details" : "div"}>`).join(""));

    const ms = Array.isArray(b.mainStats) ? b.mainStats.filter(m => m.stat) : [];
    const buildHtml = [
      b.stats?.length ? `<div class="stats">
        ${b.stats.map(s => `<div class="stat"><div class="lb">${esc(s.label)}</div>
          <div class="val ${s.bad ? "bad" : ""}">${esc(s.target)}</div>
          ${s.note ? `<div class="nt">${txt(s.note)}</div>` : ""}</div>`).join("")}
      </div>` : "",
      b.artifacts?.length ? `<div class="sub">Thánh di vật</div><div class="block">
        ${b.artifacts.map(a => `<div class="weapon">
          <div class="w-ico">${a.icon ? `<img src="${esc(a.icon)}" alt="" loading="lazy">` : ""}</div>
          <div>${a.pieces ? `<span class="tier">${a.pieces} món</span>` : ""}<div class="nm">${esc(a.set)}</div>
            ${a.note ? `<div class="nt">${txt(a.note)}</div>` : ""}</div></div>`).join("")}
      </div>` : "",
      ms.length ? `<div class="sub">Dòng chính</div><div class="block">
        ${ms.map(m => `<div class="ms"><span class="slot">${esc(m.slot)}</span>
          <div><div class="nm">${esc(m.stat)}</div>${m.note ? `<div class="nt">${txt(m.note)}</div>` : ""}</div></div>`).join("")}
      </div>` : "",
      b.weapons?.length ? `<div class="sub">Vũ khí <span class="hint">· ưu tiên từ trên xuống</span></div><div class="block">
        ${b.weapons.map(w => `<div class="weapon">
          <div class="w-ico">${w.icon ? `<img src="${esc(w.icon)}" alt="" loading="lazy">` : ""}</div>
          <div>${w.tier ? `<span class="tier">${esc(w.tier)}</span>` : ""}<div class="nm">${esc(w.name)}</div>
            ${w.note ? `<div class="nt">${txt(w.note)}</div>` : ""}</div></div>`).join("")}
      </div>` : "",
    ].join("");
    if (buildHtml) add("build", "Build", buildHtml);

    if (c.notes?.length) add("notes", "Ghi chú", `<ul class="notes">${c.notes.map(n => `<li>${txt(n)}</li>`).join("")}</ul>`);

    const E = ELEMENTS[c.element], W = WEAPONS[c.weapon];
    const ico = u => u ? `<img class="ti" src="${esc(u)}" alt="">` : "";
    const tags = [
      c.element ? `<span class="el">${ico(E?.icon)}${esc(E?.name || c.element)}</span>` : "",
      c.weapon ? `<span>${ico(W?.icon)}${esc(W?.name || c.weapon)}</span>` : "",
      ...[c.role, c.region].filter(Boolean).map(t => `<span>${esc(t)}</span>`),
    ].join("");

    app.innerHTML = `
      <a class="back" href="#/">‹ Tất cả nhân vật</a>
      <div class="hero" style="${el(c)}">
        <div class="hero-img">${pic(c)}</div>
        <div>
          ${c.rarity ? `<div class="stars">${"★".repeat(c.rarity)}</div>` : ""}
          <h1>${esc(c.name)}</h1>
          ${c.title ? `<div class="title">${esc(c.title)}</div>` : ""}
          <div class="tags">${tags}</div>
        </div>
      </div>
      ${c.summary ? `<p class="summary">${txt(c.summary)}</p>` : ""}
      ${sections.map(s => `<section id="${s.id}"><h2>${s.title}</h2>${s.html}</section>`).join("")
        || '<p class="empty">Chưa có ghi chú cho nhân vật này.</p>'}`;
  }

  function legendFor(rotation) {
    const used = [...new Set(rotation.flatMap(r => r.actions.map(a => splitKey(a)[0])))];
    return used.map(k => `<span>${key(k)} ${esc((ACTIONS[k] || {}).label || k)}</span>`).join("");
  }

  // ---------- Hộp giải thích thuật ngữ ----------
  const tip = document.createElement("div");
  tip.className = "tip"; tip.setAttribute("role", "tooltip"); tip.hidden = true;
  document.body.appendChild(tip);
  let tipFor = null;
  function showTip(t) {
    const text = GLOSS[t.dataset.term];
    if (!text) return;
    tipFor = t;
    tip.innerHTML = `<b>${esc(t.dataset.term)}</b> ${esc(text)}`;
    tip.hidden = false;
    const r = t.getBoundingClientRect(), w = tip.offsetWidth, h = tip.offsetHeight;
    const left = Math.min(Math.max(8, r.left + r.width / 2 - w / 2), innerWidth - w - 8);
    const below = r.bottom + 8 + h < innerHeight;
    tip.style.left = left + scrollX + "px";
    tip.style.top = (below ? r.bottom + 8 : r.top - h - 8) + scrollY + "px";
  }
  function hideTip() { tip.hidden = true; tipFor = null; }
  const termOf = e => e.target.closest && e.target.closest(".term");
  document.addEventListener("pointerover", e => { const t = termOf(e); if (t && e.pointerType === "mouse") showTip(t); });
  document.addEventListener("pointerout", e => { const t = termOf(e); if (t && e.pointerType === "mouse" && tipFor === t) hideTip(); });
  document.addEventListener("click", e => { const t = termOf(e); t ? showTip(t) : hideTip(); });
  document.addEventListener("focusin", e => { const t = termOf(e); if (t) showTip(t); });
  document.addEventListener("focusout", e => { if (termOf(e)) hideTip(); });
  addEventListener("scroll", () => { if (tipFor) hideTip(); }, { passive: true });
  addEventListener("hashchange", hideTip);

  // ---------- Điều hướng ----------
  let lastId = null;
  function route() {
    const [, id, anchor] = location.hash.split("/");
    const c = id && byId[decodeURIComponent(id)];
    if (c) {
      search.value = "";
      if (lastId !== c.id) { renderChar(c); lastId = c.id; if (!anchor) window.scrollTo(0, 0); }
      const target = anchor && document.getElementById(anchor);
      if (target) setTimeout(() => {
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 105, behavior: "smooth" });
      }, 30);
    } else {
      lastId = null;
      renderList(search.value);
      if (document.activeElement !== search) window.scrollTo(0, 0);
    }
  }
  search.addEventListener("input", () => {
    if (location.hash && location.hash !== "#/") location.hash = "#/";
    renderList(search.value);
  });
  window.addEventListener("hashchange", route);
  route();
})();
