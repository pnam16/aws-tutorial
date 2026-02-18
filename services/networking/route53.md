# Amazon Route 53

## 1. Tổng quan (Overview)

Amazon Route 53 là dịch vụ Hệ thống tên miền (DNS) web có khả năng mở rộng và tính khả dụng cao.

- **Chức năng chính**:
  1.  **Domain Registration**: Đăng ký tên miền (ví dụ: `example.com`).
  2.  **DNS Service**: Phân giải tên miền thành IP (ví dụ: `example.com` -> `192.0.2.1`).
  3.  **Health Checks**: Kiểm tra sức khỏe tài nguyên và định tuyến người dùng đến nơi khỏe mạnh.

## 2. Các loại bản ghi (Record Types)

- **A**: Hostname -> IPv4.
- **AAAA**: Hostname -> IPv6.
- **CNAME**: Hostname -> Hostname khác (Không được dùng cho root domain / Zone Apex, ví dụ `example.com`).
- **Alias**: Tính năng riêng của Route 53.
  - Hostname -> AWS Resource (ELB, CloudFront, S3 Bucket, API Gateway...).
  - **Được phép** dùng cho Zone Apex.
  - **Nên dùng Alias thay vì CNAME** khi trỏ tới tài nguyên AWS (Hiệu năng tốt hơn, cập nhật tự động khi IP resource thay đổi, miễn phí query).

## 3. Chính sách định tuyến (Routing Policies)

1.  **Simple Routing**:
    - 1 Record trỏ tới 1 hoặc nhiều IP.
    - Nếu nhiều IP, trả về ngẫu nhiên (Round Robin). Không có Health Check.

2.  **Weighted Routing**:
    - Phân chia traffic theo tỷ trọng (ví dụ: 80% về Instance A, 20% về Instance B).
    - _Use Case_: A/B Testing, Blue/Green Deployment.

3.  **Latency Routing**:
    - Định tuyến người dùng đến Region có **độ trễ thấp nhất** (nhanh nhất) đối với họ.
    - _Use Case_: Ứng dụng toàn cầu, tối ưu hiệu năng.

4.  **Failover Routing**:
    - Cấu hình **Primary** và **Secondary** (DR).
    - Có **Health Check**: Nếu Primary chết -> Route 53 tự động chuyển traffic sang Secondary.

5.  **Geolocation Routing**:
    - Định tuyến dựa trên **vị trí địa lý thực tế** của User (Quốc gia, Châu lục).
    - _Use Case_: Phân phối nội dung bản địa hóa (Người Pháp vào trang tiếng Pháp), chặn IP từ quốc gia cấm (Geofencing).

6.  **Geoproximity Routing**:
    - Định tuyến dựa trên vị trí địa lý của User VÀ Tài nguyên. Có thể dùng **Bias** (độ lệch) để mở rộng/thu hẹp vùng phục vụ của 1 resource.
    - Phải dùng **Route 53 Traffic Flow**.

7.  **Multivalue Answer Routing**:
    - Giống Simple Routing nhưng có Health Check.
    - Trả về tối đa 8 IP khỏe mạnh ngẫu nhiên.

## 4. Route 53 Resolver (Hybrid DNS)

- **Inbound Endpoint**: Cho phép On-premise query tên miền AWS (ví dụ: `database.Internal`).
- **Outbound Endpoint**: Cho phép AWS query tên miền On-premise (ví dụ: `corp.example.internal`).

## 5. Exam Tips (Lưu ý thi SAA)

- Nếu đề bài yêu cầu trỏ **Root Domain (Zone Apex)** tới ELB/CloudFront -> Chọn **Alias Record**. (CNAME không làm được).
- Nếu muốn **người dùng ở đâu truy cập server gần đó nhất** -> Chọn **Latency Policy**.
- Nếu muốn **người dùng Đức vào server Đức, người dùng Mỹ vào server Mỹ** (chính xác theo biên giới quốc gia) -> Chọn **Geolocation Policy**.
- Nếu muốn làm **Disaster Recovery** (Active-Passive) -> Chọn **Failover Policy** với Health Checks.
- Để kết nối DNS giữa **On-premise và AWS** -> Dùng **Route 53 Resolver** (Inbound/Outbound).
- **Split-view DNS**: Dùng **Private Hosted Zone** cho nội bộ và **Public Hosted Zone** cho Internet với cùng 1 tên miền `example.com` (split-horizon).
