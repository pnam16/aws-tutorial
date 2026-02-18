# AWS Key Management Service (KMS)

## 1. Tổng quan (Overview)

AWS KMS là dịch vụ quản lý khóa (Key Management Service) giúp bạn dễ dàng tạo và kiểm soát các khóa mã hóa (encryption keys) được sử dụng để mã hóa dữ liệu.

- **Managed Service**: Tích hợp với hầu hết các dịch vụ AWS (EBS, S3, RDS, Redshift...).
- **FIPS 140-2 Level 2**: Phần cứng bảo mật (HSM) đạt chuẩn.

## 2. Các loại khóa (Key Types)

### a. KMS Keys (trước đây là CMK - Customer Master Key)

1.  **Symmetric Keys (Đối xứng)**:
    - Dùng cùng 1 khóa để mã hóa và giải mã (AES-256).
    - Phổ biến nhất, được dùng bởi các dịch vụ AWS.
    - Không bao giờ rời khỏi KMS (bạn không thể export key này).
2.  **Asymmetric Keys (Bất đối xứng)**:
    - Gồm Public Key và Private Key (RSA / ECC).
    - Public Key có thể download để mã hóa/verify. Private Key nằm trong KMS để giải mã/sign.
    - _Use Case_: Ký số (Digital Signatures).

### b. Data Keys

- Khóa dùng để mã hóa dữ liệu thực tế (Data).
- KMS Key dùng để mã hóa Data Key (Envelope Encryption).

## 3. Envelope Encryption (Mã hóa phong bì)

Vì KMS có giới hạn kích thước dữ liệu mã hóa (4KB), nên AWS dùng cơ chế này:

1.  KMS tạo ra một **Data Key** (bản rõ - plaintext) và một bản sao đã mã hóa của nó (encrypted data key).
2.  Dịch vụ (ví dụ S3) dùng **Plaintext Data Key** để mã hóa file dữ liệu to (GB/TB).
3.  Sau khi mã hóa xong, xóa Plaintext Data Key khỏi bộ nhớ.
4.  Lưu **Encrypted Data Key** cùng với dữ liệu đã mã hóa.

## 4. Key Policies

- Chính sách JSON để kiểm soát ai được truy cập Key.
- **Default Key Policy**: Cho phép Root user của account toàn quyền (để IAM Policy có thể quản lý tiếp).
- **Custom Key Policy**: Định nghĩa cụ thể User/Role nào được dùng Key.
- _Lưu ý_: Key Policy là **bắt buộc**. Nếu không có Key Policy cho phép, ngay cả Admin cũng không truy cập được Key.

## 5. Exam Tips (Lưu ý thi SAA)

- Nếu đề bài yêu cầu **mã hóa Database (RDS, DynamoDB)** hoặc **EBS Volume** -> Chọn **AWS KMS**.
- Nếu cần mã hóa dữ liệu **lớn hơn 4KB** -> Dùng **Envelope Encryption** (GenerateDataKey).
- Nếu lỡ xóa KMS Key -> Có thời gian chờ (Deletion Waiting Period) từ **7 - 30 ngày** để khôi phục. Sau đó sẽ mất vĩnh viễn (và mất luôn dữ liệu mã hóa bởi nó).
- **Automatic Key Rotation**: KMS tự động xoay vòng khóa mỗi 1 năm (cho Customer Managed Key). Backing key cũ vẫn được giữ để giải mã dữ liệu cũ.
- Để chia sẻ Encrypted Snapshot sang tài khoản khác -> Phải dùng **Customer Managed Key** (AWS Managed Key không share được).
