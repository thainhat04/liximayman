# ⚡ Quick Start Guide

## 1️⃣ Khởi chạy ứng dụng

### macOS/Linux
```bash
./start-dev.sh
```

### Windows
```bash
start-dev.bat
```

## 2️⃣ Mở trình duyệt

Truy cập: `http://localhost:5173`

## 3️⃣ Tạo bao lì xì đầu tiên

### Bước 1: Nhập số tiền
- Nhập số tiền VNĐ (ví dụ: 100000)
- Số tiền tối thiểu: 1,000 VNĐ

### Bước 2: Chọn mẫu bao lì xì
Chọn 1 trong 6 mẫu:
- 🧧 Đỏ Vàng Kim
- 🧧 Đỏ May Mắn
- 🧧 Vàng Phú Quý
- 🧧 Đỏ Thịnh Vượng
- 🧧 Hồng Mai
- 🧧 Vàng Hoàng Gia

### Bước 3: Thêm bao lì xì
Nhấn "Thêm bao lì xì" để thêm vào danh sách

### Bước 4: Tạo thêm bao (tùy chọn)
- Lặp lại bước 1-3 để thêm nhiều bao
- Có thể tạo bao nhiêu bao tùy ý

### Bước 5: Tạo link chia sẻ
Nhấn "🎉 Tạo bao lì xì"

## 4️⃣ Nhận và chia sẻ link

### Link công khai (Public)
```
http://localhost:5173/view/abc-xyz-123
```
- Chia sẻ link này cho bạn bè
- Chỉ xem, không thể chỉnh sửa

### Link chỉnh sửa (Edit)
```
http://localhost:5173/edit/abc-xyz-123?token=secret-token
```
- ⚠️ LƯU KỸ LINK NÀY!
- Chỉ có bạn mới có thể chỉnh sửa
- Không chia sẻ link này với người khác

## 5️⃣ Chỉnh sửa bao lì xì

1. Mở link chỉnh sửa (có token)
2. Thêm hoặc xóa bao lì xì
3. Nhấn "💾 Lưu thay đổi"

## 📱 Tips

- **Copy link nhanh:** Nhấn nút "Copy" bên cạnh link
- **Xem tổng tiền:** Hiển thị ở phía dưới danh sách bao
- **Xóa bao:** Nhấn dấu × ở góc trên bên phải của bao lì xì
- **Responsive:** Hoạt động tốt trên điện thoại và máy tính bảng

## ❓ Troubleshooting

### Không vào được trang
- Kiểm tra backend đã chạy chưa (port 3000)
- Kiểm tra frontend đã chạy chưa (port 5173)

### Không tạo được bao lì xì
- Kiểm tra console log (F12) để xem lỗi
- Đảm bảo nhập số tiền > 0
- Đảm bảo đã chọn mẫu bao lì xì

### Không chỉnh sửa được
- Đảm bảo đang dùng link có token
- Kiểm tra token có đúng không
- Token được lưu trong localStorage của browser tạo bao lì xì

## 🎉 Enjoy!

Chúc mừng năm mới! Hãy gửi lì xì cho người thân yêu của bạn! 🧧✨
