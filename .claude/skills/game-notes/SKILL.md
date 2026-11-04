---
name: game-notes
description: Thêm hoặc cập nhật nhân vật trong sổ tay Mê.Mô (site/data.js) – rotation, kỹ năng, build, icon – rồi kiểm tra và xem thử trên mobile. Dùng khi Dung gửi thông tin/ảnh chụp cách chơi một nhân vật, nói "thêm nhân vật", "cập nhật build", "sửa rotation", "lấy icon", hoặc muốn đưa trang lên GitHub.
---

# Mê.Mô – thêm / cập nhật nhân vật

Đọc `CLAUDE.md` ở gốc dự án trước (quy tắc ký hiệu và giao diện Dung đã chốt).

## 1. Chuyển thông tin Dung gửi thành dữ liệu
Dung thường gửi ảnh chụp câu trả lời AI / bài hướng dẫn. Tách thành:

```js
{
  id: "mavuika",                 // chữ thường, không dấu, gạch ngang
  name: "Mavuika", title: "Hỏa Thần", rarity: 5,
  element: "pyro", weapon: "claymore", role: "Main DPS", region: "Natlan",
  icon: IMG + "d/da/Mavuika_Icon.png/revision/latest",
  summary: "1–2 câu: nhân vật này chơi thế nào.",
  skills: [{ key: "E", name: "Thời Khắc Lưu Danh", icon: IMG + "...", desc: "..." }], // BA, E, Q
  teams: [{
    name: "Tan Chảy (Melt)",
    members: ["mavuika", "xilonen", "bennett", "citlali"],
    video: { title: "...", url: "" },
    rotation: [
      { char: "mavuika", actions: ["E"], why: "Vì sao bấm lúc này.", warn: "(tuỳ chọn) lỗi dễ mắc" },
    ],
  }],
  build: {
    stats: [{ label: "Tỷ lệ bạo kích", target: "~60%", note: "...", bad: false }],
    artifacts: [{ set: "Bí Điển Obsidian", pieces: 4, icon: IMG + "...", note: "2 món: ...\n4 món: ..." }], // icon = món Hoa (Flower of Life)
    mainStats: [{ slot: "Đồng hồ", stat: "% Tấn Công", note: "..." }],   // Đồng hồ, Ly, Nón
    weapons: [{ tier: "Trấn", name: "Thiên Dương Rực Lửa", icon: IMG + "...", note: "..." }], // thứ tự ưu tiên
  },
  notes: ["..."],
}
```

Quy tắc:
- Thao tác chỉ dùng key có trong `ACTIONS` (E, E giữ, Q, BA, CA, CA giữ, Nhảy, Lướt). NA → BA.
  Cần thao tác mới → thêm vào `ACTIONS` với `type` là skill / burst / basic / charged / move.
- Không thêm bước "Đổi nhân vật". `why` ngắn gọn, không emoji.
- `why` / `warn` viết thành câu liền mạch, tự nhiên như đang nói với bạn chơi cùng
  ("Nhớ bấm Q ngay sau E…", "Đừng chậm tay ở bước này, vì…"). Tránh kiểu ghi chú cụt
  ("Chậm tay bấm Q: …", "(+40%)"), tránh nhồi nhiều dấu ngoặc / hai chấm vào một câu.
- `bad: true` cho chỉ số "không cần / bỏ qua" (hiện màu đỏ).
- Thuật ngữ khó hiểu với người mới (2U, …) → thêm vào `GLOSSARY` trong data.js
  (`"2U": "giải thích 1–3 câu, dễ hiểu"`). Trang tự gạch chân chấm mọi chỗ chữ đó xuất hiện,
  rê chuột / chạm vào sẽ hiện giải thích. Giải thích viết chung, không gắn với một nhân vật cụ thể.
- Đồng đội trong `members` mà chưa có trong `CHARACTERS` → thêm bản ghi ngắn
  (id, name, rarity, element, weapon, role, region, icon).
- Tên kỹ năng, vũ khí, thánh di vật, trạng thái: dùng **tên tiếng Việt chính thức** (theo wiki vi),
  KHÔNG ghi kèm tên tiếng Anh. Thuật ngữ: Tỷ Lệ Bạo Kích, ST Bạo Kích, Tinh Thông Nguyên Tố, Tăng ST Hỏa…
- Feedback/hướng dẫn Dung dán vào (thường do AI viết) hay sai tên tiếng Việt hoặc cơ chế →
  đối chiếu với wiki vi; chỗ nào lệch thì báo Dung, đừng chép nguyên.
- Thông tin không chắc chắn (số liệu, tên thánh di vật) → hỏi Dung, đừng tự bịa.
- Trước khi ghi file: tóm tắt cho Dung những gì sẽ thêm/sửa.

## 2. Lấy URL icon
Mở `https://genshin-impact.fandom.com/wiki/Character/List` bằng trình duyệt có sẵn, chạy JS:

```js
const clean = u => u.replace(/\/revision\/latest.*$/, '/revision/latest');
Object.fromEntries([...document.querySelectorAll('.mw-parser-output img')]
  .filter(i => /TÊN1|TÊN2/i.test(i.dataset.imageKey || i.alt))
  .map(i => [i.dataset.imageKey || i.alt, clean(i.dataset.src || i.src)]));
```

Ghi vào data.js dạng `IMG + "<phần sau /images/>"`.

**Tên + icon kỹ năng:** mở `https://genshin-impact.fandom.com/vi/wiki/<Tên>`, tìm bảng chứa
"Kỹ Năng Nguyên Tố"; icon là ảnh `Talent_<Tên EN>.png`, Tấn Công Thường dùng `<Vũ khí>_<Nguyên tố>.png`.

**Tên tiếng Việt + icon vũ khí / bộ thánh di vật** (chạy trên trang fandom bất kỳ):

```js
const titles = ["A Thousand Blazing Suns", "Serpent Spine"];   // tên tiếng Anh
const r = await fetch(`https://genshin-impact.fandom.com/api.php?action=query&titles=${encodeURIComponent(titles.join('|'))}&prop=langlinks|pageimages&lllang=vi&piprop=original&redirects=1&format=json&origin=*`).then(r => r.json());
Object.values(r.query.pages).map(p => [p.title, p.missing !== undefined ? 'KHÔNG CÓ' : p.langlinks?.[0]?.['*'],
  p.original?.source?.replace(/\/revision\/latest.*$/, '/revision/latest')]);
```
"KHÔNG CÓ" = tên tiếng Anh sai → báo Dung.

## 3. Kiểm tra (bắt buộc)
1. Server tĩnh ở gốc dự án (chạy nền): `python -m http.server 8765 --bind 127.0.0.1`
2. Mở `http://localhost:8765/tools/check.html` → tiêu đề phải là "✅ OK" (0 lỗi). Có lỗi → sửa rồi kiểm tra lại.
3. Xem `http://localhost:8765/site/#/<id>` ở khung mobile 375×812: đầu trang, rotation, build;
   console không có lỗi. Ảnh lazy-load: chờ ~1s trước khi chụp.
4. Trả về mobile → reset viewport về desktop khi xong.

## 4. Đưa lên mạng
Chỉ khi Dung yêu cầu: `git add` → `git commit` → `git push`. GitHub Actions tự kiểm tra
(`node tools/validate.mjs --urls`) và deploy `site/` lên GitHub Pages; lỗi kiểm tra thì không deploy.
