# AWS PrivateLink & VPC Endpoints

## 1. Tổng quan (Overview)

AWS PrivateLink là công nghệ cho phép kết nối riêng tư (private connectivity) giữa các VPC, các dịch vụ AWS và các ứng dụng on-premise của bạn mà không để lộ lưu lượng truy cập ra Internet công cộng.

- **Bảo mật cao**: Traffic luôn nằm trong mạng AWS.
- **Đơn giản hóa mạng**: Không cần IGW, NAT Gateway, VPN hay VPC Peering phức tạp (tránh trùng IP CIDR).

## 2. Các loại VPC Endpoints

### a. Interface Endpoints (Powered by PrivateLink)

- Đây là loại phổ biến nhất.
- Tạo ra một **Elastic Network Interface (ENI)** với Private IP trong subnet của bạn.
- Hỗ trợ hầu hết các dịch vụ AWS (EC2 API, SNS, SQS, Kinesis, SageMaker...).
- **Có tính phí** (theo giờ + data transfer).
- Hỗ trợ truy cập từ **On-premise** (qua DX/VPN).

### b. Gateway Endpoints

- Loại cũ, chỉ hỗ trợ **Amazon S3** và **Amazon DynamoDB**.
- Hoạt động bằng cách thêm **Route** vào Route Table (Destination: `pl-xxxxxx` -> Target: `vpce-gw-xxxxxx`).
- **Miễn phí**.
- **KHÔNG** hỗ trợ truy cập từ On-premise. (On-premise muốn gọi S3 private phải đi qua Proxy trong VPC hoặc dùng Interface Endpoint cho S3 - mới hỗ trợ gần đây).

### c. Gateway Load Balancer Endpoints (GWLB Endpoint)

- Dùng để chèn các thiết bị bảo mật (Firewall appliance, IDS/IPS) của bên thứ 3 vào luồng traffic.
- Traffic đến/đi từ Internet sẽ đi qua GWLB Endpoint -> Đến Firewall Appliance -> Rồi mới vào App.

## 3. Sharing Services (Chia sẻ dịch vụ)

Sử dụng PrivateLink để chia sẻ ứng dụng của bạn (Service Provider) cho các tài khoản AWS khác (Service Consumer).

1.  **Provider**: Tạo **Network Load Balancer (NLB)** trước ứng dụng -> Tạo **Endpoint Service**.
2.  **Consumer**: Tạo **Interface Endpoint** trỏ tới Service Name của Provider.
3.  **Result**: Consumer truy cập ứng dụng của Provider như thể nó đang nằm trong VPC của Consumer (qua Private IP).
4.  **Benefit**: Không cần VPC Peering (tránh xung đột IP), Scalable.

## 4. Exam Tips (Lưu ý thi SAA)

- Nếu đề bài yêu cầu truy cập **S3 hoặc DynamoDB** riêng tư, giá rẻ nhất -> Chọn **Gateway Endpoint**.
- Nếu đề bài yêu cầu truy cập **các dịch vụ khác (SQS, SNS, API Gateway...)** hoặc truy cập S3 từ **On-premise** -> Chọn **Interface Endpoint (PrivateLink)**.
- Nếu muốn **chia sẻ dịch vụ (SaaS)** cho hàng nghìn VPC khác nhau mà không lo trùng IP CIDR -> Dùng **PrivateLink** (Endpoint Services).
- Nếu muốn triển khai **Firewall Appliance** để inspect traffic -> Dùng **Gateway Load Balancer Endpoint**.
