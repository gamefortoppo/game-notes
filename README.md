# Mê.Mô

Sổ tay cá nhân của Mun: cách chơi, rotation và build nhân vật nhiều game.

> Mê nhân vật mô, ghi vô đây.

Trang: https://gamefortoppo.github.io/game-notes/

## Sửa nội dung
Mọi nội dung nằm trong [`site/data.js`](site/data.js). Hướng dẫn ký hiệu ở đầu file.

## Kiểm tra trước khi đưa lên
```bash
python -m http.server 8765 --bind 127.0.0.1
```
Mở http://localhost:8765/tools/check.html (phải 0 lỗi) và http://localhost:8765/site/ để xem trang.

## Đưa lên mạng
Push lên nhánh `main`. GitHub Actions tự kiểm tra `data.js` rồi đưa thư mục `site/` lên GitHub Pages.
Nếu kiểm tra có lỗi, trang trên mạng giữ nguyên bản cũ.
