# Amazon Cognito

## 1. Tổng quan (Overview)

Amazon Cognito cung cấp tính năng định danh (Identity) cho ứng dụng web và di động của bạn. Nó gồm 2 thành phần chính:

1.  **User Pools**: Danh bạ người dùng (User Directory). Dùng để **Đăng ký (Sign-up)** và **Đăng nhập (Sign-in)**.
2.  **Identity Pools**: Cấp quyền truy cập vào tài nguyên AWS cho người dùng (Đã đăng nhập hoặc Khách/Guest).

## 2. Cognito User Pools (CUP)

- **Chức năng**: Authentication (Xác thực - Bạn là ai?).
- **Identity Provider (IdP)**:
  - Tích hợp sẵn database user/pass.
  - Hỗ trợ Social Login (Google, Facebook, Apple).
  - Hỗ trợ SAML / OIDC (Doanh nghiệp).
- **Tính năng**:
  - MFA (SMS, TOTP).
  - Password reset, Email verification.
  - Trả về **JWT Token** (JSON Web Token) sau khi login thành công.

## 3. Cognito Identity Pools (Federated Identities)

- **Chức năng**: Authorization (Ủy quyền - Bạn được làm gì?).
- **Cơ chế**:
  - Nhận Token từ User Pools (hoặc Facebook/Google).
  - Đổi Token đó lấy **AWS Temporary Credentials** (Access Key, Secret Key, Session Token) tạm thời.
  - Credentials này gắn liền với 1 **IAM Role**.
- **Use Case**:
  - Cho phép User upload file trực tiếp lên S3 bucket của riêng họ.
  - Cho phép User truy cập DynamoDB (Row-level security).
  - Cho phép Guest (chưa login) truy cập một số tài nguyên public.

## 4. Quy trình hoạt động (Workflow)

1.  **User** nhập user/pass vào App.
2.  App gửi đến **User Pool**.
3.  User Pool xác thực và trả về **JWT Token**.
4.  App gửi JWT Token đến **Identity Pool**.
5.  Identity Pool kiểm tra và trả về **AWS Credentials**.
6.  App dùng AWS Credentials để gọi API **S3/DynamoDB** trực tiếp.

## 5. Exam Tips (Lưu ý thi SAA)

- Nếu đề bài yêu cầu **Sign-up / Sign-in** cho Mobile App -> Chọn **Cognito User Pools**.
- Nếu đề bài yêu cầu cấp quyền truy cập **S3/DynamoDB trực tiếp** cho Mobile App -> Chọn **Cognito Identity Pools**.
- Để cho phép user đăng nhập bằng **Facebook/Google** -> Dùng **User Pools Fédération**.
- Để cho phép **Guest (Unauthenticated users)** truy cập tài nguyên -> Dùng **Identity Pools** (với Unauthenticated IAM Role).
- Phân biệt: **User Pools** = Authentication (Identity). **Identity Pools** = Authorization (Access to AWS Resources).
