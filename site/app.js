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
          <div class="skill"><div>${key(s.key)}</div>
            <div><div class="nm">${esc(s.name)}</div><p>${esc(s.desc)}</p></div></div>`).join("")}
      </div>`);

    if (c.teams?.length) add("rotation", "Rotation", c.teams.map(t => `
      <div class="team">
        <div class="team-name">${esc(t.name)}</div>
        <div class="members">
          ${t.members.map(id => { const m = byId[id] || { id, name: id };
            return `<a href="#/${esc(id)}" style="${el(m)}"><div class="ava">${pic(m)}</div>${esc(m.name)}</a>`; }).join("")}
        </div>
        ${t.video?.url ? `<a class="video" href="${esc(t.video.url)}" target="_blank" rel="noopener">▶ ${esc(t.video.title || "Xem video")}</a>` : ""}
        <ol class="timeline">
          ${t.rotation.map((r, i) => { const rc = byId[r.char] || { name: r.char };
            return `<li class="step" style="${el(rc)}">
              <span class="n">${i + 1}</span>
              <div class="head"><span class="who">${esc(rc.name)}</span>${keys(r.actions)}</div>
              ${r.why ? `<p class="why">${esc(r.why)}</p>` : ""}
              ${r.warn ? `<div class="warn"><b>Chú ý:</b> ${esc(r.warn)}</div>` : ""}
            </li>`; }).join("")}
        </ol>
        <div class="legend">${legendFor(t.rotation)}</div>
      </div>`).join(""));

    const ms = b.mainStats || {};
    const buildHtml = [
      b.stats?.length ? `<div class="stats">
        ${b.stats.map(s => `<div class="stat"><div class="lb">${esc(s.label)}</div>
          <div class="val ${s.bad ? "bad" : ""}">${esc(s.target)}</div>
          ${s.note ? `<div class="nt">${esc(s.note)}</div>` : ""}</div>`).join("")}
      </div>` : "",
      b.artifacts?.length ? `<div class="sub">Thánh di vật</div><div class="block">
        ${b.artifacts.map(a => `<div class="row"><span class="nm">${esc(a.set)}</span>
          ${a.pieces ? `<span class="pcs">${a.pieces} món</span>` : ""}<span class="nt">${esc(a.note)}</span></div>`).join("")}
      </div>` : "",
      (ms.sands || ms.goblet || ms.circlet) ? `<div class="sub">Dòng chính</div><div class="mainstats">
        <div><small>Đồng hồ</small><b>${esc(ms.sands || "–")}</b></div>
        <div><small>Ly</small><b>${esc(ms.goblet || "–")}</b></div>
        <div><small>Nón</small><b>${esc(ms.circlet || "–")}</b></div>
      </div>` : "",
      b.weapons?.length ? `<div class="sub">Vũ khí</div><div class="block">
        ${b.weapons.map(w => `<div class="row"><span class="nm">${esc(w.name)}</span><span class="nt">${esc(w.note)}</span></div>`).join("")}
      </div>` : "",
    ].join("");
    if (buildHtml) add("build", "Build", buildHtml);

    if (c.notes?.length) add("notes", "Ghi chú", `<ul class="notes">${c.notes.map(n => `<li>${esc(n)}</li>`).join("")}</ul>`);

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
      ${c.summary ? `<p class="summary">${esc(c.summary)}</p>` : ""}
      ${sections.length > 1 ? `<nav class="jump">${sections.map(s => `<a href="#/${esc(c.id)}/${s.id}">${s.title}</a>`).join("")}</nav>` : ""}
      ${sections.map(s => `<section id="${s.id}"><h2>${s.title}</h2>${s.html}</section>`).join("")
        || '<p class="empty">Chưa có ghi chú cho nhân vật này.</p>'}`;
  }

  function legendFor(rotation) {
    const used = [...new Set(rotation.flatMap(r => r.actions.map(a => splitKey(a)[0])))];
    return used.map(k => `<span>${key(k)} ${esc((ACTIONS[k] || {}).label || k)}</span>`).join("");
  }

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
