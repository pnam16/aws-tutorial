# AWS Identity and Access Management (IAM)

## 1. Tổng quan (Overview)

AWS IAM là dịch vụ giúp bạn quản lý quyền truy cập vào các dịch vụ và tài nguyên AWS một cách an toàn. Bạn có thể tạo và quản lý người dùng (Users), nhóm (Groups) và sử dụng các quyền (Permissions) để cho phép hoặc từ chối quyền truy cập của họ.

- **Global Service**: IAM là dịch vụ toàn cầu, không thuộc về Region cụ thể nào.
- **Root Account**: Tài khoản đầu tiên được tạo. Có toàn quyền (Full Access). Không nên dùng cho công việc hàng ngày. Bảo vệ bằng MFA.

## 2. Các thành phần chính (Key Components)

### a. IAM Users

- Đại diện cho một người hoặc một ứng dụng cụ thể.
- Có thể đăng nhập vào AWS Console (cần Password) hoặc dùng CLI/API (cần Access Key ID & Secret Access Key).

### b. IAM Groups

- Tập hợp các IAM Users.
- Giúp quản lý quyền dễ dàng hơn (Gán quyền cho Group -> Tất cả User trong Group đều có quyền đó).
- _Lưu ý_: Group không thể chứa Group khác (No nested groups).

### c. IAM Roles

- Một danh tính (identity) với các quyền cụ thể, nhưng **không gắn liền với một người cụ thể**.
- Được "đảm nhận" (Assume) bởi:
  1.  **AWS Services**: EC2, Lambda, ECS (để chúng truy cập S3, DynamoDB mà không cần lưu Access Key).
  2.  **Cross-Account**: User từ tài khoản A assume role sang tài khoản B.
  3.  **Federated Users**: User từ Active Directory hoặc Facebook/Google (Web Identity Federation).

### d. IAM Policies

- Văn bản JSON định nghĩa quyền hạn (Permissions).
- Cấu trúc:
  - **Effect**: `Allow` hoặc `Deny`.
  - **Principal**: Ai được phép? (Thường dùng trong Resource-based policy).
  - **Action**: Làm gì? (ví dụ: `s3:ListBucket`).
  - **Resource**: Trên tài nguyên nào? (ví dụ: `arn:aws:s3:::my-bucket`).
  - **Condition**: Khi nào? (ví dụ: Chỉ khi IP nguồn là 1.2.3.4).

## 3. Policy Types

1.  **Identity-based Policies**: Gắn vào User, Group, Role. (Trả lời: Tôi có thể làm gì?).
2.  **Resource-based Policies**: Gắn vào Tài nguyên (S3 Bucket Policy, SQS Queue Policy). (Trả lời: Ai có thể truy cập tôi?).
3.  **Permissions Boundaries**: Giới hạn quyền hạn tối đa mà một entity có thể có (Dù được gán FullAdmin nhưng Boundary chặn thì cũng không được).

## 4. IAM Best Practices

- **Lock away root user**: Không dùng Root user. Tạo IAM Admin user để quản trị.
- **MFA**: Bật Multi-Factor Authentication cho Root và các User quan trọng.
- **Least Privilege**: Chỉ cấp quyền tối thiểu cần thiết.
- **Rotate Credentials**: Thay đổi Access Key và Password định kỳ.
- **Use Roles**: Dùng Role cho EC2/Lambda thay vì lưu Access Key cứng trong code.

## 5. Exam Tips (Lưu ý thi SAA)

- Nếu đề bài yêu cầu **EC2 truy cập S3** -> Tạo **IAM Role** và gán cho EC2. Không dùng Access Key.
- Nếu đề bài yêu cầu quản lý quyền cho **hàng trăm Users** -> Dùng **IAM Group**.
- Để cấp quyền cho **người dùng tạm thời** (Temporary Access) hoặc **Cross-account** -> Dùng **IAM Role (AssumeRole)**.
- **Explicit Deny** luôn thắng **Explicit Allow**. (Nếu có 1 rule Deny thì mọi Allow đều vô nghĩa).
- Để kiểm tra xem Policy hoạt động như thế nào -> Dùng **IAM Policy Simulator**.
