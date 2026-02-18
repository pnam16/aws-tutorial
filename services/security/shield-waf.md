# AWS Shield & AWS WAF

## 1. AWS Shield

**Mục đích**: Bảo vệ ứng dụng khỏi các cuộc tấn công từ chối dịch vụ (DDoS).

### a. AWS Shield Standard

- **Miễn phí**, tự động bật cho tất cả khách hàng AWS.
- Bảo vệ khỏi các cuộc tấn công DDoS lớp 3 (Network) và lớp 4 (Transport) phổ biến (SYN floods, UDP floods).

### b. AWS Shield Advanced

- **Trả phí**: $3,000/tháng (cam kết 1 năm).
- Bảo vệ nâng cao cho EC2, ELB, CloudFront, Global Accelerator, Route 53.
- **DDoS Response Team (DRT)**: Hỗ trợ 24/7 từ chuyên gia AWS trong lúc bị tấn công.
- **Cost Protection**: Hoàn tiền nếu cuộc tấn công DDoS làm tăng vọt chi phí resource (ví dụ: Auto Scaling dựng lên 1000 instances).

## 2. AWS WAF (Web Application Firewall)

**Mục đích**: Tường lửa ứng dụng web, bảo vệ hkhỏi các cuộc tấn công lớp 7 (Application Layer) như SQL Injection, XSS.

- **Deploy on**: Application Load Balancer (ALB), API Gateway, CloudFront, AppSync.
- **Rules (Quy tắc)**:
  - _Web ACL_: Danh sách điều khiển truy cập web.
  - _IP Set_: Chặn/Cho phép danh sách IP.
  - _Managed Rules_: Các bộ quy tắc do AWS hoặc đối tác (Fortinet, F5) soạn sẵn (ví dụ: AWSManagedRulesCommonRuleSet chặn OWASP Top 10).
  - _Rate-based Rules_: Chặn IP nếu gửi quá X requests/5 phút (Chống HTTP Flood).

## 3. AWS Firewall Manager

**Mục đích**: Quản lý tập trung các quy tắc bảo mật (WAF rules, Shield Advanced, Security Groups) cho **nhiều tài khoản** trong AWS Organizations.

- Tự động áp dụng WAF rule cho tài nguyên mới tạo.
- Đảm bảo tuân thủ chính sách bảo mật toàn công ty.

## 4. Exam Tips (Lưu ý thi SAA)

- Nếu đề bài nói về chống **DDoS**:
  - Cơ bản (L3/L4) -> **Shield Standard**.
  - Nâng cao, cần hỗ trợ chuyên gia, hoàn tiền, bảo vệ EC2/ELB/CloudFront chuyên sâu -> **Shield Advanced**.
- Nếu đề bài nói về chặn **SQL Injection**, **Cross-Site Scripting (XSS)**, hoặc chặn theo **Country**, **hacker IP** -> Chọn **AWS WAF**.
- WAF hoạt động ở **Layer 7** (HTTP/HTTPS). Shield hoạt động chủ yếu ở **Layer 3/4**.
- Để quản lý WAF cho 100 tài khoản con -> Dùng **Firewall Manager**.
- Để chặn tấn công HTTP Flood (quá nhiều request từ 1 IP) -> Dùng **WAF Rate-based Rule**.
