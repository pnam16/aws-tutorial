# AWS Certificate Manager (ACM)

## 1. Tổng quan (Overview)

AWS Certificate Manager (ACM) là dịch vụ giúp bạn dễ dàng cung cấp, quản lý và triển khai các chứng chỉ **SSL/TLS** công cộng và riêng tư để sử dụng với các dịch vụ AWS.

- **Miễn phí**: SSL/TLS certificate cho các tên miền công cộng là hoàn toàn miễn phí (khi dùng với ELB, CloudFront, API Gateway).
- **Tự động gia hạn (Auto-renewal)**: ACM tự động gia hạn chứng chỉ trước khi hết hạn, giúp tránh downtime do quên gia hạn.

## 2. Các loại chứng chỉ (Certificate Types)

### a. Public Certificates

- Dùng cho các tên miền công cộng (ví dụ: `www.example.com`).
- Phải xác minh quyền sở hữu tên miền:
  1.  **DNS Validation**: Thêm CNAME record vào DNS (Khuyên dùng, nhanh, hỗ trợ auto-renewal).
  2.  **Email Validation**: Gửi email xác nhận (Chậm, khó auto-renewal).

### b. Private Certificates

- Dùng cho mạng nội bộ (Internal network).
- Cần thiết lập **ACM Private CA** (Certificate Authority) - Tính phí khá cao ($400/tháng).

## 3. Tích hợp (Integration)

ACM Certificate chỉ có thể được cài đặt trực tiếp vào các dịch vụ sau:

1.  **Elastic Load Balancer (ELB)**: ALB, NLB.
2.  **Amazon CloudFront**: Cần request certificate ở region **us-east-1** (N. Virginia).
3.  **Amazon API Gateway**.
4.  **AWS Elastic Beanstalk**.
5.  **AWS CloudFormation**.

_Lưu ý_: Bạn **KHÔNG** thể export private key của ACM Public Certificate để cài lên EC2 instance (Apache/Nginx/Tomcat).
(Nếu muốn cài lên EC2, bạn phải mua SSL ở ngoài hoặc dùng Let's Encrypt, rồi tự quản lý).

## 4. Exam Tips (Lưu ý thi SAA)

- Nếu đề bài yêu cầu **SSL miễn phí**, **tự động gia hạn** cho ELB/CloudFront -> Chọn **ACM**.
- Để dùng SSL cho **CloudFront**, chứng chỉ ACM bắt buộc phải nằm ở region **us-east-1**.
- Nếu muốn dùng SSL trên **EC2 Instance**, ACM **KHÔNG** hỗ trợ trực tiếp. Phải dùng SSL bên thứ 3 hoặc đặt EC2 sau Load Balancer (Offload SSL tại ALB).
- **DNS Validation** được ưu tiên hơn Email Validation vì nó hỗ trợ tự động gia hạn mà không cần Admin click email.
