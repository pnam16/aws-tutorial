# Amazon SQS (Simple Queue Service)

## 1. Tổng quan (Overview)

Amazon SQS là dịch vụ hàng đợi thông điệp (message queuing) được quản lý hoàn toàn, giúp tách biệt (decouple) và mở rộng các vi dịch vụ (microservices), hệ thống phân tán và ứng dụng serverless.

- **Decoupling**: Producer gửi tin, Consumer nhận tin. Hai bên không cần biết nhau, không cần online cùng lúc.
- **Buffer**: Giúp hấp thụ traffic đột biến (spike) để backend xử lý từ từ (không bị sập).
- **Pull-based**: Consumer phải chủ động kéo (poll) message về để xử lý.

## 2. Các loại hàng đợi (Queue Types)

### a. Standard Queue (Hàng đợi tiêu chuẩn)

- **Throughput**: Không giới hạn số lượng message/giây (Unlimited).
- **Ordering**: Best-effort ordering (Nỗ lực sắp xếp, nhưng không đảm bảo 100% đúng thứ tự).
- **Delivery**: At-least-once (Message có thể được gửi > 1 lần, cần xử lý idempotent).
- _Use Case_: Tách biệt các component, xử lý ảnh upload, gửi email.

### b. FIFO Queue (First-In-First-Out)

- **Throughput**: Giới hạn (300 msg/s không batching, 3000 msg/s có batching).
- **Ordering**: Đảm bảo chính xác thứ tự vào ra (First-In-First-Out).
- **Delivery**: Exactly-once (Mỗi message chỉ được xử lý đúng 1 lần).
- _Tên Queue_: Phải kết thúc bằng `.fifo`.
- _Use Case_: Giao dịch ngân hàng, đặt vé máy bay, thương mại điện tử (cần đúng thứ tự).

## 3. Các tính năng cấu hình (Configuration)

### a. Visibility Timeout

- Khoảng thời gian (mặc định 30s) mà message bị "ẩn" đi sau khi một consumer đã nhận nó.
- Giúp ngăn consumer khác nhận trùng message đó trong khi consumer đầu đang xử lý.
- Nếu consumer xử lý xong -> Xóa message (DeleteMessage).
- Nếu consumer chết hoặc timeout -> Message hiện lại trong queue để consumer khác xử lý.

### b. Dead Letter Queue (DLQ - Hàng đợi thư chết)

- Nếu một message bị lỗi và trả lại queue quá số lần quy định (MaximumReceives), nó sẽ bị đẩy sang DLQ.
- Giúp debug các message bị lỗi (poison pills) mà không làm tắc nghẽn hệ thống.

### c. Long Polling vs Short Polling

- **Short Polling**: Trả về ngay lập tức, kể cả khi không có message (hoặc có ít). Tốn tiền request.
- **Long Polling** (WaitTimeSeconds > 0): Chờ một chút (tối đa 20s) nếu queue rỗng. Khi có message mới đến hoặc hết thời gian chờ mới trả về. -> **Tiết kiệm tiền và giảm số request rỗng**.

### d. Delay Queue

- Trì hoãn việc gửi message để consumers không nhìn thấy ngay lập tức (ví dụ: delay 15 phút).

## 4. Exam Tips (Lưu ý thi SAA)

- Nếu đề bài nói về **Decoupling application components** -> Chọn **SQS**.
- Nếu cần đảm bảo **thứ tự** (ordering) và **không trùng lặp** (exactly-once) -> Chọn **SQS FIFO**.
- Nếu message bị xử lý nhiều lần hoặc consumer không kịp xử lý trong 30s -> Tăng **Visibility Timeout**.
- Nếu muốn tiết kiệm chi phí gọi API nhận tin -> Bật **Long Polling** (set WaitTimeSeconds = 20s).
- **SQS vs SNS**: SQS là **Queue** (1-to-1, Pull). SNS là **Topic** (1-to-many, Push).
- **Fan-out pattern**: Kết hợp SNS + SQS. Gửi 1 tin vào SNS -> SNS đẩy vào 3 SQS Queues khác nhau để 3 service xử lý song song.
- Kích thước message tối đa: **256KB**. (Muốn lớn hơn phải dùng S3 + SQS để chứa pointer - thư viện SQS Extended Client).
