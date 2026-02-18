# AWS Backup

## 1. Tổng quan (Overview)

AWS Backup là dịch vụ giúp tập trung hóa và tự động hóa việc sao lưu dữ liệu (data protection) cho các dịch vụ AWS.

- **Mục đích**: Thay vì phải vào từng dịch vụ (EC2, RDS, DynamoDB, EFS...) để cấu hình backup riêng lẻ, AWS Backup cung cấp một nơi duy nhất để quản lý chính sách backup (Backup Plan) cho toàn bộ tài nguyên.
- **Cross-Region / Cross-Account**: Hỗ trợ copy backup sang vùng khác hoặc tài khoản khác (qua AWS Organizations) để Disaster Recovery.

## 2. Các tính năng chính (Key Features)

### a. Backup Plan

- Định nghĩa lịch (Schedule): Backup khi nào? (Hàng ngày lúc 2AM).
- Định nghĩa vòng đời (Lifecycle): Giữ backup bao lâu? (Giữ 30 ngày rồi chuyển sang Cold Storage, xóa sau 365 ngày).
- Gán Resource: Tag-based (backup tất cả resource có tag `Env=Prod`) hoặc Resource ID.

### b. Backup Vault

- Nơi chứa các bản Recovery Points (Backups).
- **Lock Vault (WORM - Write Once Read Many)**: Ngăn chặn bất kỳ ai (kể cả Admin) xóa hoặc thay đổi backup trong thời gian quy định. -> Chống Ransomware hoặc User xóa nhầm.

### c. Supported Services (Dịch vụ hỗ trợ)

- EC2 (AMI), EBS.
- RDS (Aurora, Neptune, DocumentDB).
- DynamoDB.
- EFS, FSx.
- Storage Gateway (Volume Gateway).
- S3.

## 3. Exam Tips (Lưu ý thi SAA)

- Nếu đề bài yêu cầu **quản lý backup tập trung** cho nhiều dịch vụ AWS -> Chọn **AWS Backup**.
- Nếu muốn **sao lưu EFS**: EFS không có cơ chế snapshot tích hợp sẵn trong console EFS cũ -> Phải dùng **AWS Backup**.
- Để tuân thủ yêu cầu pháp lý (Compliance) **không được xóa backup** trong 5 năm -> Dùng **AWS Backup Vault Lock**.
- Để **tiết kiệm chi phí** backup lâu dài -> Cấu hình Lifecycle Policy để chuyển backup sang **Cold Storage** (giá rẻ hơn).
- Cross-Account Backup: Backup từ Acc A sang Acc B (để cách ly dữ liệu an toàn nhất) -> Dùng AWS Backup tích hợp Organizations.
