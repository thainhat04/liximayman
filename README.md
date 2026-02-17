# 🧧 Lì Xì Năm Mới

Ứng dụng tạo và chia sẻ bao lì xì năm mới trực tuyến với giao diện đẹp mắt và hiện đại.

## ✨ Tính năng

- 🎨 Chọn từ 6 mẫu bao lì xì đẹp mắt
- 💰 Tạo nhiều bao lì xì với số tiền tùy ý
- 🔗 Tạo link công khai để chia sẻ
- 🎁 **Mở từng bao lì xì tương tác** - Nhấn để mở và nhận may mắn!
- 🔒 **Bao lì xì hết hạn sau khi mở** - Mỗi bao chỉ mở được 1 lần
- ✨ **Animation đẹp mắt** - Hiệu ứng celebrate khi mở bao
- 👀 **Ẩn số tiền** - Số tiền chỉ hiển thị sau khi mở
- ✏️ Chỉnh sửa bao lì xì với token creator
- 📱 Giao diện responsive, hoạt động mượt mà trên mọi thiết bị
- 🎉 Không cần đăng nhập/đăng ký

## 🚀 Cài đặt và Chạy

### Cách nhanh nhất (Recommended)

**macOS/Linux:**
```bash
./start-dev.sh
```

**Windows:**
```bash
start-dev.bat
```

Script sẽ tự động:
- Cài đặt dependencies (nếu chưa có)
- Khởi chạy backend (port 3000)
- Khởi chạy frontend (port 5173)

### Hoặc chạy thủ công

**Terminal 1 - Backend:**
```bash
cd backend
npm install
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
npm run dev
```

### Truy cập ứng dụng

🌐 Mở trình duyệt: `http://localhost:5173`

## 🎯 Cách sử dụng

1. **Tạo bao lì xì:**
   - Truy cập trang chủ
   - Nhập số tiền cho mỗi bao lì xì
   - Chọn mẫu bao lì xì yêu thích
   - Thêm nhiều bao lì xì tùy ý
   - Nhấn "Tạo bao lì xì"

2. **Chia sẻ:**
   - Copy link công khai để chia sẻ với bạn bè
   - Lưu link chỉnh sửa để có thể thay đổi sau

3. **Chỉnh sửa:**
   - Sử dụng link chỉnh sửa (có token)
   - Thêm, xóa hoặc thay đổi bao lì xì
   - Lưu thay đổi

## 🏗️ Kiến trúc

### Backend (Node.js + Express + TypeScript)
- RESTful API
- In-memory storage (có thể mở rộng với database)
- Token-based authorization cho chỉnh sửa

### Frontend (React + Vite + TypeScript)
- Modern React với Hooks
- React Router cho navigation
- Axios cho API calls
- Responsive CSS với modern design

## 📁 Cấu trúc thư mục

```
.
├── backend/
│   ├── src/
│   │   ├── routes/         # API routes
│   │   ├── types/          # TypeScript types & DTOs
│   │   ├── storage/        # Data storage
│   │   └── server.ts       # Main server file
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/
    ├── src/
    │   ├── components/     # React components
    │   ├── pages/          # Page components
    │   ├── models/         # TypeScript interfaces
    │   ├── services/       # API services
    │   ├── constants/      # App constants
    │   ├── App.tsx
    │   ├── App.css
    │   └── main.tsx
    ├── index.html
    ├── package.json
    └── vite.config.ts
```

## 🔒 Bảo mật

- Link public chỉ cho phép xem
- Chỉnh sửa yêu cầu creator token
- Token được lưu trong localStorage của người tạo
- Mỗi bao lì xì có ID và token riêng biệt

## 🎨 Thiết kế

Ứng dụng sử dụng màu sắc và design lấy cảm hứng từ Tết Nguyên Đán:
- Đỏ - May mắn và thịnh vượng
- Vàng - Tài lộc và phú quý
- Gradient hiện đại kết hợp truyền thống

## 📝 API Endpoints

### POST `/api/red-envelopes`
Tạo bao lì xì mới

### GET `/api/red-envelopes/:id`
Xem bao lì xì (public)

### PUT `/api/red-envelopes/:id?token=TOKEN`
Cập nhật bao lì xì (cần token)

## 🔮 Mở rộng trong tương lai

- [ ] Thêm database (MongoDB/PostgreSQL)
- [ ] Upload hình ảnh tùy chỉnh
- [ ] Thêm lời chúc vào bao lì xì
- [ ] Thống kê số lượt xem
- [ ] Chia sẻ lên social media
- [ ] PWA support

## 📄 License

MIT

---

Chúc mừng năm mới! 🎊🧧
