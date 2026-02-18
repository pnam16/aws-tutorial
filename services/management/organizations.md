# AWS Organizations

## 1. Tổng quan (Overview)

AWS Organizations là dịch vụ giúp quản lý tập trung (centrally manage) và quản trị (govern) nhiều tài khoản AWS (multi-account environment).

- **Mục đích**: Consolidated Billing (Gộp hóa đơn), Centralized Policy Management (Quản lý chính sách tập trung), Account Creation (Tạo tài khoản tự động).
- **Cấu trúc**: Root -> Organizational Units (OUs) -> Accounts.

## 2. Các lợi ích chính (Key Benefits)

### a. Consolidated Billing (Thanh toán hợp nhất)

- Gộp tất cả hóa đơn của các tài khoản con (Member Accounts) về 1 tài khoản chủ (Management Account/Master Account).
- **Volume Discount**: Cộng dồn mức sử dụng (EC2, S3) của tất cả tài khoản để đạt tier giảm giá cao hơn.
- **Reserved Instances Sharing**: Nếu Acc A mua RI nhưng không dùng hết, Acc B có thể dùng ké -> Tiết kiệm tiền.

### b. Service Control Policies (SCPs)

- Chính sách JSON để **giới hạn quyền hạn tối đa** (Max Permissions) cho các tài khoản thành viên hoặc OUs.
- **Khác với IAM Policy**: IAM cấp quyền, SCP giới hạn quyền.
- Even if AdministratorAccess (FullAdmin) được cấp cho user trong acc con, nếu SCP chặn (Deny) hành động đó -> User cũng không làm được.
- _Ví dụ_: Chặn không cho bất kỳ ai (kể cả Root user của acc con) được phép tắt CloudTrail.
- _Ví dụ_: Chỉ cho phép chạy EC2 instance loại t2.micro ở region us-east-1.

### c. Automated Account Creation

- Tạo tài khoản mới bằng API/CLI hoặc Console một cách nhanh chóng.
- Tự động join vào Organization và áp dụng SCP.

## 3. Best Practices (Thực hành tốt nhất)

1.  **Multi-Account Strategy**:
    - Tách biệt môi trường (Dev, Test, Prod) ra các tài khoản riêng.
    - Tách biệt chức năng (Security Account, Logging Account, Shared Services Account).
    - Giảm thiểu **Blast Radius** (Phạm vi ảnh hưởng): Nếu 1 acc bị hack, các acc khác vẫn an toàn.

2.  **OU Structure**:
    - Nhóm các account có cùng tính chất vào chung 1 OU (ví dụ: Prod OU, Non-Prod OU, Sandbox OU).
    - Áp dụng SCP ở cấp độ OU thay vì từng Account lẻ tẻ.

## 4. Exam Tips (Lưu ý thi SAA)

- Nếu đề bài nói về **nhiều tài khoản (Multiple Accounts)** và muốn **quản lý tập trung** hoặc **thanh toán gộp (Consolidated Billing)** -> Chọn **AWS Organizations**.
- Để **ngăn chặn** User ở tài khoản con (dù có Full Admin) làm điều gì đó (ví dụ: mua Reserved Instance, tắt CloudTrail) -> Dùng **SCP**.
- Để nhận được **giảm giá theo số lượng (Volume Discount)** cho S3/EC2 -> Dùng **Consolidated Billing** trong Organizations.
- **SCP không áp dụng cho Master Account**. Nó chỉ ảnh hưởng Member Accounts.
- Muốn chia sẻ tài nguyên (Resource Sharing) như VPC Subnet, Transit Gateway giữa các account -> Dùng **AWS RAM (Resource Access Manager)** tích hợp với Organizations.
