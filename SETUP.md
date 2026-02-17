# 🚀 Hướng dẫn Setup và Chạy ứng dụng

## Yêu cầu hệ thống

- Node.js >= 16.x
- npm hoặc yarn

## Các bước cài đặt

### 1. Clone hoặc download project

```bash
cd Lixinammoi
```

### 2. Cài đặt Backend

```bash
cd backend
npm install
```

**Cấu hình Environment:**
```bash
cp .env.example .env
```

Hoặc tạo file `.env` với nội dung:
```env
PORT=3000
FRONTEND_URL=http://localhost:5173
```

### 3. Cài đặt Frontend

```bash
cd ../frontend
npm install
```

**Cấu hình Environment:**
File `.env` đã có sẵn:
```env
VITE_API_BASE_URL=http://localhost:3000/api
```

## Chạy ứng dụng

### Chạy Backend (Terminal 1)

```bash
cd backend
npm run dev
```

✅ Backend sẽ chạy tại: `http://localhost:3000`

### Chạy Frontend (Terminal 2)

```bash
cd frontend
npm run dev
```

✅ Frontend sẽ chạy tại: `http://localhost:5173`

## Mở trình duyệt

Truy cập: `http://localhost:5173`

## Test Flow

### 1. Tạo bao lì xì
- Nhập số tiền (VD: 100000)
- Chọn mẫu bao lì xì
- Nhấn "Thêm bao lì xì"
- Có thể thêm nhiều bao
- Nhấn "Tạo bao lì xì"

### 2. Nhận link
- Copy link công khai để chia sẻ
- Copy link chỉnh sửa để giữ quyền edit
- Có thể xem ngay bao lì xì vừa tạo

### 3. Xem công khai
- Mở link công khai ở tab mới (hoặc chia sẻ cho người khác)
- Chỉ xem được, không thể chỉnh sửa

### 4. Chỉnh sửa
- Sử dụng link chỉnh sửa (có token)
- Có thể thêm, xóa bao lì xì
- Lưu thay đổi

## Build cho Production

### Backend

```bash
cd backend
npm run build
npm start
```

### Frontend

```bash
cd frontend
npm run build
npm run preview
```

## Troubleshooting

### Port đã được sử dụng

**Backend (port 3000):**
```bash
# macOS/Linux
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Frontend (port 5173):**
```bash
# macOS/Linux
lsof -ti:5173 | xargs kill -9

# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

### CORS errors

Đảm bảo backend đang chạy trước khi chạy frontend. Vite proxy đã được cấu hình sẵn.

### Module not found

```bash
# Xóa node_modules và reinstall
rm -rf node_modules package-lock.json
npm install
```

## Kiến trúc

```
Client (Browser) → Frontend (React - Port 5173) → Backend API (Express - Port 3000)
```

Frontend sử dụng Vite proxy để forward các request `/api/*` đến backend.

## Notes

- Backend sử dụng in-memory storage, dữ liệu sẽ mất khi restart server
- Creator token được lưu trong localStorage của browser
- Link public có thể chia sẻ, link edit cần giữ bí mật
