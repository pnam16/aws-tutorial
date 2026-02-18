# Amazon SNS (Simple Notification Service)

## 1. Tổng quan (Overview)

Amazon SNS là dịch vụ gửi thông báo (Pub/Sub messaging) được quản lý hoàn toàn. Nó cho phép phân phối tin nhắn từ một nguồn (Publisher) đến nhiều đích nhận (Subscribers) cùng một lúc.

- **Push-based**: Message được đẩy ngay lập tức tới subscriber (khác với SQS là Pull).
- **Pub/Sub Pattern**: 1 topic -> N subscribers.

## 2. Các khái niệm chính (Key Concepts)

### a. Topic (Chủ đề)

- Kênh logic để gửi thông điệp. Publisher gửi tin vào Topic.

### b. Subscribers (Người đăng ký)

- Các endpoints nhận tin từ Topic. Hỗ trợ nhiều giao thức:
  - **Application-to-Application (A2A)**: Amazon SQS, AWS Lambda, HTTP/HTTPS endpoint, Kinesis Data Firehose.
  - **Application-to-Person (A2P)**: SMS (tin nhắn điện thoại), Email, Mobile Push Notification (Google FCM, Apple APNS).

### c. Fanout Pattern

- Đây là design pattern phổ biến nhất dùng SNS + SQS.
- **Vấn đề**: Service A muốn gửi data cho Service B (resize ảnh) và Service C (fraud detection).
- **Giải pháp**: Service A gửi tin vào **SNS Topic**. Topic này có 2 subscriber là **SQS Queue B** và **SQS Queue C**.
- **Lợi ích**: Service A không cần biết ai sẽ nhận, chỉ cần gửi 1 lần. Service B và C hoạt động độc lập, không ảnh hưởng nhau.

## 3. Features

### a. Message Filtering

- Mặc định, subscriber nhận _tất cả_ message trong Topic.
- Filter Policy: Cho phép subscriber chỉ nhận những message thõa mãn điều kiện (ví dụ: chỉ nhận message có attribute `event_type = "order_cancelled"`).
- Giúp giảm tải cho subscriber và tiết kiệm chi phí chuyển dữ liệu.

### b. Security

- **Encryption**: KMS mã hóa data at rest.
- **Access Control**: IAM Policy và SNS Topic Policy (quy định ai được publish, ai được subscribe).

### c. FIFO Topic

- Tương tự SQS FIFO, SNS cũng hỗ trợ FIFO Topic để đảm bảo thứ tự và deduplication.
- Chỉ có thể subscribe **SQS FIFO** vào **SNS FIFO**. (Không thể mix Standard và FIFO).

## 4. Exam Tips (Lưu ý thi SAA)

- Nếu đề bài yêu cầu gửi **một thông điệp tới nhiều người nhận** (Fan-out) -> Chọn **SNS**.
- Nếu cần gửi **email** hoặc **SMS** thông báo cho Admin khi hệ thống lỗi -> Chọn **SNS**.
- Nếu cần filter message (chỉ service A nhận loại A, service B nhận loại B) từ một luồng tin chung -> Dùng **SNS Message Filtering**.
- Nếu cần **Push** message thay vì Poll -> Chọn **SNS**.
- Phân biệt **SNS vs SES**:
  - **SNS**: Gửi thông báo hệ thống ngắn gọn (Notifications), SMS, Push.
  - **SES (Simple Email Service)**: Gửi email marketing, email giao dịch chuyên nghiệp, HTML, nhận email inbound.
