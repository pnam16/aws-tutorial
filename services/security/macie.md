# Amazon Macie

## 1. Tổng quan (Overview)

Amazon Macie là dịch vụ bảo mật dữ liệu sử dụng machine learning và pattern matching để khám phá và bảo vệ dữ liệu nhạy cảm (sensitive data) trong AWS.

- **Mục đích**: Phát hiện PII (Personally Identifiable Information - Thông tin định danh cá nhân) như Tên, Số CMND/CCCD, Số thẻ tín dụng, SĐT...
- **Phạm vi**: Chỉ hoạt động trên **Amazon S3**.

## 2. Các tính năng chính (Key Features)

### a. Sensitive Data Discovery

- Tạo các **Job** để quét S3 bucket (một lần hoặc định kỳ).
- Phát hiện dữ liệu nhạy cảm dựa trên:
  - **Managed Data Identifiers**: Pattern có sẵn của AWS (Credit Card, Passport USA, GDPR data).
  - **Custom Data Identifiers**: Regex pattern do bạn tự định nghĩa (ví dụ: Mã nhân viên công ty `EMP-1234`).

### b. S3 Bucket Inventory

- Tự động đánh giá tình trạng an toàn của tất cả S3 buckets.
- Cảnh báo nếu bucket đang **Public** hoặc **Unencrypted** (không mã hóa).

### c. Findings

- Kết quả quét được gửi về Macie Console và EventBridge.
- Có thể tích hợp với **AWS Security Hub**.

## 3. Exam Tips (Lưu ý thi SAA)

- Nếu đề bài yêu cầu **phát hiện dữ liệu nhạy cảm (PII, Credit Card)** trong **S3** -> Chọn **Macie**.
- Nếu muốn tuân thủ **GDPR** hoặc **HIPAA** về bảo vệ dữ liệu khách hàng lưu trên S3 -> Dùng **Macie** để audit.
- Macie **không** quét EBS, RDS hay DynamoDB. Chỉ S3.
- Macie sử dụng **Machine Learning** để nhận diện pattern phức tạp (ví dụ: Tên người + Địa chỉ trong văn bản).
