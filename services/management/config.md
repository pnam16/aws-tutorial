# AWS Config

## 1. Tổng quan (Overview)

AWS Config là dịch vụ cho phép bạn đánh giá, kiểm tra và đánh giá cấu hình của các tài nguyên AWS.

- **Mục đích**: Quản lý cấu hình (Configuration Management) và Tuân thủ (Compliance).
- **Trả lời câu hỏi**: "Cấu hình hiện tại của tài nguyên là gì?", "Nó có tuân thủ chính sách bảo mật không?", "Cấu hình đã thay đổi như thế nào theo thời gian?".

## 2. Các tính năng chính (Key Features)

### a. Configuration History (Lịch sử cấu hình)

- Ghi lại dòng thời gian thay đổi cấu hình của tài nguyên.
- _Ví dụ_: Security Group A đã thay đổi inbound rule vào ngày hôm qua. Trước đó nó như thế nào?

### b. Config Rules (Quy tắc cấu hình)

- Kiểm tra xem tài nguyên có tuân thủ quy tắc hay không.
- **Managed Rules**: Quy tắc AWS cung cấp sẵn (75+ rules).
  - _Ví dụ_: `encrypted-volumes` (EBS phải mã hóa), `s3-bucket-public-read-prohibited` (S3 không được public), `ssh-restricted` (Không mở port 22 cho 0.0.0.0/0).
- **Custom Rules**: Viết Lambda function để kiểm tra logic riêng.

### c. Remediation (Khắc phục)

- Tự động sửa lỗi khi phát hiện tài nguyên không tuân thủ (Non-compliant) bằng cách dùng **AWS Systems Manager Automation Documents**.
- _Ví dụ_: Nếu phát hiện Security Group mở port 22 bừa bãi -> Tự động chạy script xóa rule đó đi (hoặc đóng lại).

### d. Aggregators

- Thu thập dữ liệu cấu hình từ nhiều tài khoản (Accounts) và nhiều vùng (Regions) về một nơi tập trung để xem tổng quan.

## 3. Config vs CloudTrail

| Đặc điểm     | AWS Config                                    | AWS CloudTrail                                                |
| :----------- | :-------------------------------------------- | :------------------------------------------------------------ |
| **Câu hỏi**  | "WHAT": Tài nguyên trông như thế nào? (State) | "WHO": Ai đã làm thay đổi nó? (Action)                        |
| **Mục đích** | Compliance, Audit lịch sử cấu hình.           | Security Audit, API Investigation.                            |
| **Ví dụ**    | "Security Group đang mở port 80"              | "User Alice đã gọi API AuthorizeSecurityGroupIngress port 80" |

## 4. Exam Tips (Lưu ý thi SAA)

- Nếu đề bài yêu cầu **Compliance**, **Audit cấu hình**, xem lịch sử thay đổi cấu hình -> Chọn **AWS Config**.
- Nếu muốn **tự động khắc phục** tài nguyên không tuân thủ (ví dụ: tự động bật S3 Versioning, tự động encrypt EBS) -> Chọn **AWS Config Remediation**.
- Để giám sát tuân thủ cho **nhiều tài khoản** -> Chọn **AWS Config Aggregator**.
- Để nhận thông báo khi cấu hình thay đổi -> AWS Config đẩy sự kiện sang EventBridge/SNS.
