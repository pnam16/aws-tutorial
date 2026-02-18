# AWS Quiz App - Hướng dẫn sử dụng

## 🚀 Cách chạy ứng dụng

Do trình duyệt chặn CORS khi mở file HTML trực tiếp, bạn cần chạy ứng dụng qua local web server.

### Cách 1: Sử dụng Python (Khuyến nghị)

```bash
cd /Users/buidokhoinguyen/Desktop/aws/quiz-app
python3 -m http.server 8000
```

Sau đó mở trình duyệt và truy cập: `http://localhost:8000`

### Cách 2: Sử dụng Node.js

```bash
cd /Users/buidokhoinguyen/Desktop/aws/quiz-app
npx serve
```

### Cách 3: Sử dụng VS Code Live Server

1. Cài extension "Live Server" trong VS Code
2. Right-click vào `index.html`
3. Chọn "Open with Live Server"

## ✨ Tính năng

- ☁️ **684 câu hỏi AWS SAA-C03** từ các file markdown
- 🎯 **Chọn đáp án** và xem kết quả ngay lập tức
- 💡 **Giải thích chi tiết** bằng tiếng Việt sau mỗi câu trả lời
- 📊 **Theo dõi tiến độ** và điểm số
- 💾 **Lưu tiến độ** tự động (localStorage)
- 🔍 **Lọc câu hỏi** theo phạm vi (1-50, 51-100, ...)
- 🔄 **Làm lại** từ đầu bất cứ lúc nào
- 📱 **Responsive** - hoạt động tốt trên mobile và desktop

## 🎨 Giao diện

- Dark theme hiện đại với gradient màu tím/xanh
- Hiệu ứng glassmorphism
- Animation mượt mà
- Màu sắc trực quan (xanh = đúng, đỏ = sai)

## 📝 Cấu trúc thư mục

```
quiz-app/
├── index.html      # Giao diện chính
├── style.css       # Styling
├── parser.js       # Parse markdown questions
├── app.js          # Logic ứng dụng
└── README.md       # File này
```

## 🐛 Khắc phục sự cố

**Lỗi: "Loading questions..." không biến mất**

- Nguyên nhân: CORS restriction khi mở file:// trực tiếp
- Giải pháp: Chạy qua web server (xem hướng dẫn trên)

**Câu hỏi không hiển thị**

- Kiểm tra đường dẫn đến thư mục `/questions`
- Đảm bảo các file markdown tồn tại

## 📸 Screenshots

Ứng dụng đã được test và hoạt động tốt với:

- ✅ Load câu hỏi từ markdown
- ✅ Hiển thị đáp án
- ✅ Chọn đáp án và xem giải thích
- ✅ Navigation (Next/Previous)
- ✅ Progress tracking
