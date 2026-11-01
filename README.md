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
- Bản hiện tại: **thiệp nhà trai**.
- Ngày cưới chính: **28.11.2026**.
- Lễ vu quy: **15:00, Thứ Bảy 28.11.2026**.
- Tiệc cưới nhà trai: **17:00, Thứ Sáu 27.11.2026**.
- Địa điểm: **Nhà văn hóa thể thao Như Lân**.

## Cần bổ sung

- Địa chỉ chi tiết / link Google Maps nếu muốn.
- Thông tin tài khoản mừng cưới (nếu muốn hiển thị hộp quà).
- Nội dung câu chuyện tình yêu riêng (hiện đang dùng lời dẫn chung).

## Cấu trúc

```text
index.html
assets/
  css/style.css
  js/main.js
  fonts/
  img/
```

Sổ lưu bút và xác nhận tham dự hiện lưu trên thiết bị của khách. Khi cần đồng bộ tập trung, có thể nối Google Apps Script sau.
