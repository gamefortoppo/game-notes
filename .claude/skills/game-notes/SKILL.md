---
name: game-notes
description: Thêm hoặc cập nhật nhân vật trong sổ tay Mê.Mô (site/data.js, D:\Jolie\Game) – kỹ năng, rotation, build, vũ khí, thánh di vật, icon, thuật ngữ – đối chiếu với wiki, kiểm tra, xem thử trên mobile rồi push lên GitHub Pages. Dùng khi Dung gửi thông tin / ảnh chụp / đoạn dán về cách chơi một nhân vật, nói "làm tiếp cho <nhân vật>", "thêm nhân vật", "update theo feedback", "cập nhật build", "sửa rotation", "lấy icon / hình", "thêm giải thích hover", hoặc "push lên".
---

# Mê.Mô – thêm / cập nhật nhân vật

Dự án: `D:\Jolie\Game` · Repo: `gamefortoppo/game-notes` · Trang: https://gamefortoppo.github.io/game-notes/
Đọc `CLAUDE.md` ở gốc dự án trước (quy tắc Dung đã chốt). Trả lời Dung bằng tiếng Việt, nhẹ nhàng.

## Quy trình chuẩn (khi Dung dán thông tin một nhân vật)
1. **Đọc đoạn dán** – thường do AI khác viết, có link nguồn `[1](...)`, emoji 💡🔴🔵, tên tiếng Việt tự dịch.
2. **Đối chiếu với wiki** (mục 3) – tên chính thức, cơ chế, đồng đội, vũ khí, bộ thánh di vật, icon.
3. **Ghi `site/data.js`** theo mẫu (mục 2), bỏ link nguồn và emoji.
4. **Kiểm tra + xem mobile** (mục 4).
5. **Báo Dung**: bảng "Bản dán ghi → Wiki ghi", ý mình tự suy luận, phần bỏ đi vì không kiểm chứng,
   phần giữ nguyên chưa đối chiếu (ví dụ con số build). Hỏi có push không.
6. **Push chỉ khi Dung nói** (mục 5).

Khi Dung đang chờ deploy mà nhờ làm nhân vật khác → cứ làm song song, deploy xong thì báo.

## 1. Quy tắc nội dung
- Thao tác chỉ dùng key trong `ACTIONS`: E, E giữ, Q, BA, CA, CA giữ, Nhảy, Lướt. **NA → BA.** Số lần: `"BA x2"`.
  Cần thao tác mới → thêm vào `ACTIONS` với `type` skill / burst / basic / charged / move.
- KHÔNG có bước "Đổi nhân vật"; mỗi bước ghi nhân vật đứng sân là đủ.
- `why` / `warn` viết **câu liền mạch, tự nhiên** như nói với bạn chơi cùng
  ("Nhớ bấm Q ngay sau E…", "Đừng chậm tay ở bước này, vì…"). Tránh ghi chú cụt ("Chậm tay bấm Q: …"),
  tránh nhồi ngoặc / hai chấm, không emoji, không 💡.
- Tên kỹ năng, vũ khí, thánh di vật, trạng thái, phản ứng: **tên tiếng Việt chính thức theo wiki vi**,
  không ghi kèm tên tiếng Anh. Thuật ngữ: Tỷ Lệ Bạo Kích, ST Bạo Kích, Tinh Thông Nguyên Tố, Tăng ST Băng…
- Chỉ ghi điều kiểm chứng được. Ý không tìm thấy trên wiki (vd "nhận sát thương cũng tích Chiến Ý",
  "Qiqi có đòn phối hợp") → bỏ, báo Dung. Ý mình tự suy ra từ cơ chế → được ghi nhưng phải nói rõ với Dung.
- Lý do sai nhưng thao tác hợp lý → giữ thao tác, viết lại lý do theo wiki, báo Dung.
- `bad: true` cho chỉ số "không cần / bỏ qua" (hiện đỏ).
- Muốn xuống dòng trong chữ: dùng `\n` (vd hiệu ứng "2 món: …\n4 món: …").
- Thuật ngữ khó (2U, Tinh-Siêu Dẫn, Vùng Trục Sao…) → thêm vào `GLOSSARY` (1–3 câu, viết chung,
  không gắn với một nhân vật). Trang tự gạch chân chấm mọi chỗ xuất hiện, rê / chạm hiện giải thích.
- Đồng đội trong `members` chưa có trong `CHARACTERS` → thêm bản ghi ngắn ở cuối mảng
  (id, name, rarity, element, weapon, role, region, icon).
- Ảnh: chỉ `icon` (avatar). KHÔNG có hình đứng / splash.

## 2. Mẫu dữ liệu

```js
{
  id: "sandrone",               // chữ thường, không dấu, gạch ngang
  name: "Sandrone", title: "Quan Chấp Hành Fatui", rarity: 5,
  element: "cryo",              // pyro hydro electro cryo anemo geo dendro
  weapon: "claymore",           // sword claymore polearm bow catalyst
  role: "Main DPS", region: "Snezhnaya",
  icon: IMG + "c/c8/Sandrone_Icon.png/revision/latest",
  summary: "2–3 câu: nhân vật chơi thế nào, cơ chế chính.",
  skills: [                     // thứ tự BA, E, Q
    { key: "BA", name: "...", icon: IMG + "..._<Vũ khí>_<Nguyên tố>.png...", desc: "..." },
    { key: "E",  name: "...", icon: IMG + "...Talent_....png...", desc: "..." },
    { key: "Q",  name: "...", icon: IMG + "...Talent_....png...", desc: "..." },
  ],
  build: {
    stats:     [{ label: "Bạo kích", target: "70% / 140%+", note: "...", bad: false }],
    artifacts: [{ set: "Ảo Tưởng Vụn Vỡ Trong Bóng Tối", pieces: 4, icon: IMG + "<món Hoa>", note: "2 món: ...\n4 món: ..." }],
    mainStats: [{ slot: "Đồng hồ", stat: "% Tấn Công", note: "..." },
                { slot: "Ly", stat: "..." }, { slot: "Nón", stat: "..." }],
    weapons:   [{ tier: "Trấn", name: "Muỗng Trà Siêu Việt", icon: IMG + "...", note: "..." }],
               // tier: "Trấn" / "5★ thay thế" / "4★" – xếp theo thứ tự ưu tiên
  },
  notes: [],
}
```
Nhân vật có hướng dẫn đặt **trước** dòng `// ---- Nhân vật phụ ...`; nhân vật phụ đặt sau.

**Đội hình KHÔNG ghi trong nhân vật** mà ghi chung trong mảng `TEAMS` ở cuối `data.js`.
Mỗi đội ghi **một lần**, trang tự hiện đội ở trang của **mọi thành viên** (tô vệt cọ tên người đang xem).
`members[0]` là chủ lực: ở trang chủ lực đội đó lên đầu và mở sẵn; trang có ≥2 đội thì tự gập / mở.

```js
{
  name: "Tinh-Siêu Dẫn · Sandrone",            // "<phản ứng> · <chủ lực>", không trùng tên đội khác
  members: ["sandrone", "alyosha", "diona", "sucrose"],   // chủ lực đứng đầu
  video: { title: "...", url: "" },          // tuỳ chọn, url trống thì không hiện
  rotation: [
    { char: "diona", actions: ["E giữ", "Q"], why: "...", warn: "(tuỳ chọn)" },
  ],
}
```
- Dung gửi đội mà đã có đội cùng thành viên + cùng chủ lực → sửa đội đó, đừng thêm bản thứ hai.
- `why` viết sao cho đọc ở trang của thành viên nào cũng hiểu (nhắc buff của từng người trong bước liên quan).

## 3. Tra wiki (dùng trình duyệt có sẵn, chạy JS trên một trang genshin-impact.fandom.com)
Hàm trợ giúp (dán trước các lệnh bên dưới):

```js
const clean = u => u?.replace(/\/revision\/latest.*$/, '/revision/latest');
const api = (w, q) => fetch(`${w}/api.php?${q}&format=json`).then(r => r.json());   // w = '' (EN) hoặc '/vi'
const search = async (w, s) => (await api(w, `action=query&list=search&srlimit=6&srsearch=${encodeURIComponent(s)}`)).query.search.map(x => x.title);
const viName = async ts => Object.values((await api('', `action=query&prop=langlinks&lllang=vi&redirects=1&titles=${encodeURIComponent(ts.join('|'))}`)).query.pages)
  .map(p => [p.title, p.missing !== undefined ? 'KHÔNG CÓ' : p.langlinks?.[0]?.['*'] ?? '(chưa có tên vi)']);
const fileUrl = async fs => Object.values((await api('', `action=query&prop=imageinfo&iiprop=url&titles=${encodeURIComponent(fs.map(f => 'File:' + f).join('|'))}`)).query.pages)
  .map(p => [p.title, clean(p.imageinfo?.[0]?.url) ?? 'KHÔNG CÓ']);
const pageText = async (w, page, n = 2500) => { const r = await api(w, `action=parse&prop=text&page=${encodeURIComponent(page)}`); if (r.error) return 'KHÔNG CÓ';
  const d = new DOMParser().parseFromString(r.parse.text['*'], 'text/html'); d.querySelectorAll('style,script').forEach(e => e.remove());
  return d.body.textContent.replace(/\s+/g, ' ').slice(0, n); };
```

| Cần gì | Cách lấy |
|---|---|
| Thông tin nhân vật (nguyên tố, vũ khí, độ hiếm, vùng) | `pageText('', 'Alyosha', 900)`; độ hiếm: categories `4-Star Characters` |
| Tên đúng khi bản dán viết sai (Alyosa…) | `search('', 'Alyosa')` → "Alyosha" |
| Icon nhân vật | `fileUrl(['Sandrone_Icon.png'])` |
| Tên + mô tả kỹ năng tiếng Việt | Mở trang `/vi/wiki/<Tên>`, `innerText` của bảng chứa "Kỹ Năng Nguyên Tố" |
| Icon kỹ năng | Ảnh `Talent_<Tên EN>.png` trong bảng đó; BA dùng `<Vũ khí>_<Nguyên tố>.png` (vd `Claymore_Cryo.png`) |
| Tên tiếng Việt vũ khí / bộ / phản ứng | `viName(['A Teaspoon of Transcendence', ...])`; "KHÔNG CÓ" = tên EN sai |
| Tìm tên tiếng Việt khi chỉ có tên VN tự dịch | `search('/vi', 'Thìa Siêu Việt')` → "Muỗng Trà Siêu Việt" |
| Đoán vũ khí / bộ mới mà bản dán gọi sai | Danh mục mới nhất: `action=query&list=categorymembers&cmtitle=Category:Claymores` (hoặc `Category:Artifact Sets`) `&cmsort=timestamp&cmdir=desc&cmlimit=12`, rồi `pageText` từng cái xem hiệu ứng có khớp không |
| Icon vũ khí | `fileUrl(["Weapon_<Tên EN>.png"])` (dấu `'` giữ nguyên) |
| Hiệu ứng + hình bộ thánh di vật | `pageText('', '<Tên bộ EN>', 700)`; hình = món **Hoa**: `action=parse&prop=images&page=<Tên bộ>` lọc `Item_*`, món Hoa là món đầu ghi sau "Flower of Life" |
| Cơ chế phản ứng / vùng | `pageText('', 'Stellar-Conduct')`, bản vi: `pageText('/vi', 'Giáo Trình/Phản Ứng Nguyên Tố: ...')` |

Ghi URL vào data.js dạng `IMG + "<phần sau /images/>"` (bỏ `https://static.wikia.nocookie.net/gensin-impact/images/`).

## 4. Kiểm tra (bắt buộc trước khi báo xong)
1. Server tĩnh ở **gốc dự án** (chạy nền, nếu chưa chạy):
   `cd "D:/Jolie/Game" && python -m http.server 8765 --bind 127.0.0.1`
2. Trình duyệt hay giữ bản cũ của file JS → trước khi reload chạy
   `await fetch('<file>.js', {cache:'reload'})` cho data.js / app.js / validate.js.
3. `http://localhost:8765/tools/check.html` → tiêu đề "✅ OK", 0 lỗi (cảnh báo thì xem và báo Dung).
4. `http://localhost:8765/site/#/<id>` ở khung mobile 375×812: đầu trang, kỹ năng, rotation, build, vũ khí.
   Ảnh lazy-load: cuộn tới rồi chờ ~1.5s trước khi chụp; kiểm `img.naturalWidth > 0`. Console không lỗi.
5. Reset viewport về desktop khi xong.

## 5. Đưa lên mạng (chỉ khi Dung nói "push")
1. `git add -A && git commit` (message tiếng Việt, có dòng Co-Authored-By) `&& git push`.
   Repo đã cấu hình tác giả `Mun <gamefortoppo@users.noreply.github.com>` – không đổi.
2. Đợi Actions (không poll tay; dùng Monitor 10s/lần):
   `curl -s "https://api.github.com/repos/gamefortoppo/game-notes/actions/runs?per_page=1"` → `head_sha`, `status`, `conclusion`.
3. Xác nhận bản trên mạng: `curl -s https://gamefortoppo.github.io/game-notes/data.js | grep '<chuỗi mới>'`.
4. Deploy lỗi ở bước validate → xem job log, sửa data.js, push lại.
