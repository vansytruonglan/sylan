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

## Google Sheet / Excel (tùy chọn)

Hiện tại thiệp là bản tĩnh: xác nhận tham dự (RSVP) và lời chúc được lưu bằng `localStorage` trên thiết bị của khách. Muốn gom dữ liệu về một Google Sheet, làm theo các bước sau:

1. Tạo một Google Sheet mới.
2. Vào **Extensions → Apps Script**, dán nội dung `google-apps-script/Code.gs` vào `Code.gs`, bấm **Save**.
3. Chạy hàm `setup()` một lần và cấp quyền cho Google.
4. Vào **Deploy → New deployment → Web app**:
   - Execute as: **Me**
   - Who has access: **Anyone**
   - Sao chép **Web app URL**.
5. Dán URL vào `assets/js/config.js`:

```js
window.WEDDING_ENDPOINTS = {
  rsvp: "https://script.google.com/macros/s/.../exec",
  guestbook: "https://script.google.com/macros/s/.../exec"
};
```

Cho đến khi URL được điền, RSVP và lời chúc vẫn dùng `localStorage`. `main.js` đọc cấu hình từ `config.js`, nhưng repo này **chưa cấu hình backend trực tiếp** (các URL đang để trống); muốn đồng bộ dữ liệu lên Google Sheet thì làm các bước trên. Có thể tải Sheet về dưới dạng Excel (`.xlsx`) khi cần.

## Thông tin đã điền

- Chú rể: **Nguyễn Văn Sỹ** — bố Nguyễn Trung Kiên, mẹ Bùi Thị Hoa.
- Cô dâu: **Trương Thị Lan** — bố Trương Văn Khánh, mẹ Phạm Thị Quyên.
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
google-apps-script/Code.gs # mẫu Apps Script cho Google Sheet (nếu dùng)
```

Sổ lưu bút và xác nhận tham dự hiện lưu trên thiết bị của khách. Khi cần đồng bộ tập trung, có thể nối Google Apps Script theo hướng dẫn phía trên.
