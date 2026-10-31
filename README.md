# Thiệp cưới · Nguyễn Văn Sỹ & Trương Thị Lan

Thiệp cưới static HTML/CSS/JS, giao diện hồng phấn lấy cảm hứng từ mẫu Suns Wedding.

## Xem local

```bash
python -m http.server 4174
```

Mở `http://localhost:4174`.

- Bỏ qua bìa: `index.html?open=1`
- Cá nhân hóa tên khách: `index.html?guest=Vợ chồng anh Minh Hiếu`

## Thông tin đã điền

- Chú rể: **Nguyễn Văn Sỹ** — bố Nguyễn Trung Kiên, mẹ Bùi Thị Hoa.
- Cô dâu: **Trương Thị Lan** — bố Trương Văn Khánh, mẹ Phạm Thị Quyên.
- Ngày cưới: **Thứ Sáu, 27.11.2026**.
- Giờ làm lễ: **15:00**.
- Âm lịch: **19.10 Bính Ngọ**.
- Địa điểm: **Tư gia nhà gái**.

## Cần bổ sung

- Địa chỉ cụ thể.
- Thông tin tài khoản mừng cưới (nếu muốn hiển thị hộp quà).
- Nội dung câu chuyện tình yêu riêng (hiện đang dùng lời dẫn chung).

## Cấu trúc

```text
index.html
assets/
  css/style.css
  js/main.js
  js/photos.js
  fonts/
  img/
```

Sổ lưu bút và xác nhận tham dự hiện lưu trên thiết bị của khách. Khi cần đồng bộ tập trung, có thể nối Google Apps Script sau.
