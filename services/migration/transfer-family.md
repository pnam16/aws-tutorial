# AWS Transfer Family

## 1. Tổng quan (Overview)

AWS Transfer Family là dịch vụ truyền tệp (File Transfer) an toàn, có thể mở rộng và đáng tin cậy sang Amazon S3 và Amazon EFS.

- **Mục đích**: Giúp các đối tác, khách hàng (B2B) upload/download file lên cloud của bạn bằng các giao thức chuẩn (SFTP, FTPS, FTP) mà không cần bạn tự dựng server FTP.
- **Fully Managed**: AWS lo hạ tầng, scale, patching.

## 2. Giao thức hỗ trợ (Protocols)

1.  **SFTP (Secure File Transfer Protocol)**: Truyền file qua SSH. (Phổ biến nhất).
2.  **FTPS (File Transfer Protocol over SSL)**: Truyền file qua SSL/TLS.
3.  **FTP (File Transfer Protocol)**: Truyền file không mã hóa (Chỉ được dùng trong VPC, không được public ra Internet).
4.  **AS2 (Applicability Statement 2)**: Giao thức truyền dữ liệu B2B chuyên dụng (Retail, Healthcare).

## 3. Kiến trúc (Integration)

- **Identity Provider**:
  - **Service Managed**: Lưu user/pass ngay trong Transfer Family.
  - **AWS Directory Service**: Tích hợp với Active Directory.
  - **Custom**: Dùng Lambda/API Gateway để authenticate user (từ DB riêng, Okta, Auth0).
- **Endpoint**:
  - **Public**: Truy cập từ Internet.
  - **VPC**: Truy cập từ trong VPC hoặc qua VPN/Direct Connect (Internal only).

## 4. Storage Backend

1.  **Amazon S3**: File upload lên sẽ thành Object trong S3 Bucket.
2.  **Amazon EFS**: File upload lên sẽ nằm trong EFS File System (POSIX compliant).

## 5. Exam Tips (Lưu ý thi SAA)

- Nếu đề bài yêu cầu di chuyển quy trình **SFTP/FTPS** hiện tại lên AWS mà **không sửa code client** (vẫn dùng FileZilla, WinSCP...) -> Chọn **AWS Transfer Family**.
- Transfer Family **lưu trữ dữ liệu ở đâu**? -> **S3** hoặc **EFS**.
- Để authenticate user từ **Active Directory** -> Cấu hình Transfer Family dùng **AWS Directory Service**.
- FTP thường (không S) chỉ nên dùng trong mạng nội bộ (VPC Endpoint).
