# Thiệp cưới · Nguyễn Văn Sỹ & Trương Thị Lan

Thiệp cưới static HTML/CSS/JS, giao diện hồng phấn lấy cảm hứng từ mẫu Suns Wedding.

## Hai phiên bản thiệp

- `index.html` — thiệp **nhà trai** (`<body data-side="nha-trai">`), có tiệc cưới nhà trai.
- `nha-gai.html` — thiệp **nhà gái** (`<body data-side="nha-gai">`), giữ nguyên ngày, ảnh, bố cục và liên kết; chỉ đổi nhãn tiệc thành “Tiệc cưới nhà gái”.

Cá nhân hóa tên khách trên bìa thiệp:

- `index.html?guest=Vợ chồng anh Minh Hiếu`
- `nha-gai.html?guest=Vợ chồng anh Minh Hiếu`
- Bỏ qua bìa: thêm `?open=1`

## Tạo link mời khách

Mở `tao-thiep.html`, nhập tên khách và bấm **Tạo link**. Trang tạo hai link tuyệt đối:

- **Link nhà trai** → `index.html?guest=...`
- **Link nhà gái** → `nha-gai.html?guest=...`

Mỗi link có nút **Sao chép**. Link được tạo bằng `new URL()` so với vị trí `tao-thiep.html`, nên dùng được cả khi chạy localhost lẫn khi deploy lên GitHub Pages (kể cả đường dẫn con). Trang này là trang quản trị, không hiển thị trong thiệp.

## Xem local

```bash
python -m http.server 4174
```

Mở `http://localhost:4174`, `http://localhost:4174/nha-gai.html` hoặc `http://localhost:4174/tao-thiep.html`.

## Nhạc nền

- Bài hát: **“Lễ Đường của Hải Long & Salim”** — Kai Đinh, video YouTube `XqgyD0yadH0`.
- Nhạc tự động phát khi khách vào thiệp (kể cả `?open=1`); nút nhạc nổi ở góc phải bên dưới dùng để tạm dừng hoặc phát lại.
- Nhạc phát qua YouTube IFrame API (không tải hay trích xuất âm thanh). Trình duyệt chỉ cho phép phát có âm thanh sau một thao tác của người dùng, nên nếu bị chặn, khách chỉ cần bấm nút nhạc hoặc chạm/bấm vào bất kỳ đâu; mở bìa thiệp luôn khởi động nhạc.

## Google Sheet / Excel

Backend đã được cấu hình: Web App URL của Google Apps Script được điền sẵn trong `assets/js/config.js` cho cả RSVP và sổ lưu bút. Vì vậy xác nhận tham dự (RSVP) và lời chúc được đồng bộ trực tiếp lên Google Sheet của cặp đôi; nếu mất mạng, thiệp vẫn lưu tạm bằng `localStorage` trên thiết bị của khách. Có thể tải Sheet về dưới dạng Excel (`.xlsx`) khi cần.

Nếu muốn dựng lại backend từ đầu, làm theo các bước sau:

1. Tạo một Google Sheet mới.
2. Vào **Extensions → Apps Script**, dán nội dung `google-apps-script/Code.gs` vào `Code.gs`, bấm **Save**.
3. Chạy hàm `setup()` một lần và cấp quyền cho Google.
4. Vào **Deploy → New deployment → Web app**:
   - Execute as: **Me**
   - Who has access: **Anyone**
   - Sao chép **Web app URL** (dạng `https://script.google.com/macros/s/.../exec`).
5. Dán URL vào `assets/js/config.js`:

```js
window.WEDDING_ENDPOINTS = {
  rsvp: "https://script.google.com/macros/s/.../exec",
  guestbook: "https://script.google.com/macros/s/.../exec"
};
```

`main.js` đọc cấu hình từ `config.js`; khi cả hai URL đã được điền, dữ liệu RSVP và lời chúc sẽ gửi lên Google Sheet thay vì chỉ nằm trên thiết bị khách.

## Thông tin đã điền

- Chú rể: **Nguyễn Văn Sỹ** — bố Nguyễn Trung Kiên, mẹ Bùi Thị Hoa.
- Cô dâu: **Trương Thị Lan** — bố Trương Văn Khánh, mẹ Phạm Thị Quyên.
- Ngày cưới chính: **28.11.2026**.
- Lễ vu quy: **15:00, Thứ Bảy 28.11.2026**.
- Tiệc cưới nhà trai: **17:00, Thứ Sáu 27.11.2026**.
- Địa điểm: **Nhà văn hóa thể thao Như Lân**.
- Bản nhà gái: Lễ vu quy 15:00 28.11.2026; Tiệc cưới nhà gái 09:00 28.11.2026; địa điểm Khu tái định cư Mễ Sở.

## Cần bổ sung

- Địa chỉ chi tiết / link Google Maps nếu muốn.
- Thông tin tài khoản mừng cưới (nếu muốn hiển thị hộp quà).
- Nội dung câu chuyện tình yêu riêng (hiện đang dùng lời dẫn chung).

## Cấu trúc

```text
index.html                 # thiệp nhà trai
nha-gai.html               # thiệp nhà gái
tao-thiep.html             # trang tạo link mời khách
assets/
  css/style.css
  js/config.js
  js/main.js
  js/tao-thiep.js
  fonts/
  img/
google-apps-script/Code.gs # mẫu Apps Script cho Google Sheet
```

Sổ lưu bút và xác nhận tham dự được đồng bộ lên Google Sheet qua Google Apps Script Web App đã cấu hình trong `assets/js/config.js`.
