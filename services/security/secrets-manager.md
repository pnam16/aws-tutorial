# AWS Secrets Manager

## 1. Tổng quan (Overview)

AWS Secrets Manager giúp bạn bảo vệ các bí mật cần thiết để truy cập vào ứng dụng, dịch vụ và tài nguyên CNTT.

- **Mục đích**: Thay vì hardcode thông tin đăng nhập (Username/Password, API Key) trong code, bạn lưu chúng trong Secrets Manager.
- **Tự động xoay vòng (Automatic Rotation)**: Tính năng quan trọng nhất, giúp thay đổi mật khẩu Database/API Key định kỳ mà không làm gián đoạn ứng dụng.

## 2. Các tính năng chính (Key Features)

### a. Automatic Rotation (Xoay vòng tự động)

- Secrets Manager sử dụng **Lambda function** để tự động đổi mật khẩu.
- Hỗ trợ sẵn (Built-in rotation) cho: **Amazon RDS**, **Amazon Aurora**, **Amazon Redshift**, **Amazon DocumentDB**.
- Tạo mật khẩu mới -> Cập nhật vào Database -> Cập nhật vào Secrets Manager -> Done.

### b. Integration with RDS Proxy

- RDS Proxy kết nối trực tiếp với Secrets Manager để lấy thông tin đăng nhập DB.
- Ứng dụng Lambda chỉ cần gọi RDS Proxy (dùng IAM Auth) mà không cần biết mật khẩu DB.

### c. Cross-Region Replication

- Tự động sao chép bí mật sang Region khác để phục vụ cho Disaster Recovery hoặc Multi-Region Application.

## 3. Secrets Manager vs Systems Manager Parameter Store

| Đặc điểm                 | AWS Secrets Manager                                    | SSM Parameter Store                                                                  |
| :----------------------- | :----------------------------------------------------- | :----------------------------------------------------------------------------------- |
| **Giá**                  | $0.40/secret/tháng + $0.05/10,000 requests. (Đắt hơn). | Miễn phí (Standard param).                                                           |
| **Xoay vòng (Rotation)** | Tự động (Built-in Lambda).                             | Không hỗ trợ tự động xoay vòng (phải tự viết script phức tạp).                       |
| **Cross-Account**        | Dễ dàng chia sẻ qua Resource Policy.                   | Khó hơn.                                                                             |
| **Use Case**             | DB Credentials, API Keys cần xoay vòng thường xuyên.   | Cấu hình ứng dụng, biến môi trường (Environment Variables), License Key ít thay đổi. |

## 4. Exam Tips (Lưu ý thi SAA)

- Nếu đề bài yêu cầu **tự động xoay vòng (rotate)** mật khẩu database -> Chọn **Secrets Manager**.
- Nếu đề bài yêu cầu lưu trữ cấu hình **giá rẻ/miễn phí** và không cần xoay vòng mật khẩu thường xuyên -> Chọn **SSM Parameter Store**.
- Để truy cập bí mật trong VPC private -> Dùng **Secrets Manager VPC Interface Endpoint**.
- Mật khẩu luôn được **mã hóa (Encrypted)** bằng KMS key.
