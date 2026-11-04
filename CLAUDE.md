# Mê.Mô – sổ tay nhân vật cá nhân (repo gamefortoppo/game-notes)

Trang web tĩnh ghi cách chơi, rotation, build nhân vật game (hiện tại: Genshin Impact; sau này thêm Wuthering Waves và game khác).
Chủ dự án: Dung (tên ở trang: Mun). Người xem: Dung và vài người bạn.
Trang: https://gamefortoppo.github.io/game-notes/ · Tagline: "Mê nhân vật mô, ghi vô đây".

**Thêm / sửa nhân vật → dùng skill `game-notes`** (`.claude/skills/game-notes/SKILL.md`):
quy trình đối chiếu wiki, mẫu dữ liệu, lệnh tra fandom, kiểm tra, push.

## Đã có
Hướng dẫn đầy đủ: **Mavuika** (Tan Chảy), **Sandrone** (Tinh-Siêu Dẫn).
Nhân vật phụ (chưa có ghi chú): Xilonen, Bennett, Citlali, Alyosha, Diona, Sucrose.

## Cấu trúc
| Đường dẫn | Vai trò |
|---|---|
| `site/` | Toàn bộ trang được deploy. Không có bước build. |
| `site/data.js` | **Nội dung duy nhất cần sửa**: ACTIONS, ELEMENTS, WEAPONS, GLOSSARY, CHARACTERS |
| `site/app.js` | Render trang (hash router `#/<id>`), thuật ngữ + ô giải thích, `\n` → xuống dòng |
| `site/style.css` | Giao diện |
| `tools/validate.js` | Luật kiểm tra data.js (dùng chung trình duyệt + Node) |
| `tools/check.html` | Mở trong trình duyệt để kiểm tra data.js (máy Dung không có Node) |
| `tools/validate.mjs` | Bản Node, chạy trong GitHub Actions (`--urls` kiểm tra link ảnh) |
| `.github/workflows/deploy.yml` | Push lên `main` → kiểm tra → deploy `site/` lên Pages |

## Quy tắc nội dung (Dung đã chốt)
- Ký hiệu thao tác: **E, E giữ, Q, BA, CA, CA giữ, Nhảy, Lướt**. Dùng `BA`, KHÔNG dùng `NA`. Số lần: `"BA x2"`.
- Rotation: KHÔNG có thao tác "Đổi nhân vật" – mỗi bước ghi nhân vật nào đứng sân là đủ.
- Lời giải thích / chú ý: câu liền mạch, tự nhiên; không emoji (không 💡); không link nguồn.
- Tên kỹ năng, vũ khí, thánh di vật: tên tiếng Việt chính thức theo wiki vi, không kèm tên tiếng Anh.
- Thông tin Dung dán (thường do AI viết) phải đối chiếu wiki; ý không kiểm chứng được thì bỏ và báo.
- Ảnh: chỉ `icon` (avatar), kỹ năng, vũ khí, thánh di vật (món Hoa). KHÔNG có hình đứng/splash.
- Nguồn ảnh: genshin-impact.fandom.com, URL dạng `IMG + ".../revision/latest"`.
- `element`, `weapon` ghi bằng mã (pyro, claymore…), trang tự hiện tên tiếng Việt + icon.
- Thuật ngữ khó (2U, Tinh-Siêu Dẫn…) → `GLOSSARY`, trang tự hiện giải thích khi rê / chạm.

## Quy tắc giao diện (Dung đã chốt)
- Nền sáng, hiện đại, đơn giản, **giống sổ tay cá nhân** – không giống wiki official, không bảng kẻ ô.
- Không kiểu "AI": tránh chip/icon trang trí tràn lan, khung nền màu thừa.
- Không có thanh nhảy mục (Kỹ năng / Rotation / Build) – đã bỏ theo yêu cầu.
- Tối ưu cho điện thoại trước (375px).

## Quy trình làm việc
1. Sửa `site/data.js` (hoặc giao diện).
2. Kiểm tra: `python -m http.server 8765 --bind 127.0.0.1` ở thư mục gốc,
   mở `http://localhost:8765/tools/check.html` → phải 0 lỗi.
3. Xem `http://localhost:8765/site/#/<id>` ở khung mobile (375×812).
4. Chỉ commit / push khi Dung yêu cầu. Push lên `main` = trang public tự cập nhật (~1 phút).
   Tác giả commit đã đặt riêng cho repo: `Mun <gamefortoppo@users.noreply.github.com>` (không dùng email công ty).

Trả lời Dung bằng tiếng Việt, nhẹ nhàng, dễ hiểu.
