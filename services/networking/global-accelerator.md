# AWS Global Accelerator

## 1. Tổng quan (Overview)

AWS Global Accelerator là dịch vụ mạng giúp cải thiện tính sẵn sàng (Availability) và hiệu năng (Performance) cho các ứng dụng toàn cầu của bạn bằng cách sử dụng mạng lưới AWS global network.

- **Anycast IP**: Cung cấp 2 địa chỉ IP tĩnh (Static IP) toàn cầu. Người dùng ở bất kỳ đâu trên thế giới đều truy cập vào cùng 1 IP này.
- **Edge Optimization**: Traffic từ người dùng sẽ đi vào Edge Location gần nhất, sau đó đi qua mạng cáp quang riêng của AWS (AWS Backbone) để đến đích (thay vì đi lòng vòng qua Internet công cộng nhiều rủi ro).

## 2. Các lợi ích chính (Key Benefits)

### a. Performance Improvement

- Giảm jitter, latency và packet loss tới 60%.
- Đặc biệt tốt cho các ứng dụng game (UDP), voice over IP (VoIP), hoặc IoT cần kết nối TCP/UDP ổn định.

### b. Instant Failover

- Tự động kiểm tra sức khỏe của các endpoint (Health Check).
- Nếu endpoint ở Region A chết -> Global Accelerator định tuyến traffic sang Region B **ngay lập tức** (trong vòng vài giây).
- **Không phụ thuộc DNS Cache**: Vì IP client truy cập không đổi (Anycast IP), nên không cần chờ DNS TTL hết hạn như Route 53 Failover.

### c. Client IP Preservation

- Giữ nguyên địa chỉ IP gốc của người dùng khi traffic đến ALB (Application Load Balancer) hoặc EC2 instance (mặc định với ALB).

## 3. Global Accelerator vs CloudFront

| Đặc điểm      | AWS Global Accelerator                                    | Amazon CloudFront                                |
| :------------ | :-------------------------------------------------------- | :----------------------------------------------- |
| **Giao thức** | TCP và UDP (Non-HTTP).                                    | HTTP/HTTPS và Websocket.                         |
| **Cơ chế**    | Proxy packet ở Layer 4 (Transport). Không cache nội dung. | Proxy và Cache nội dung ở Layer 7 (Application). |
| **Use Case**  | Game server (UDP), VoIP, IoT (MQTT), Non-HTTP workload.   | Website, Video streaming, API, Static Content.   |
| **IP**        | Static Anycast IP.                                        | Dynamic IP (thay đổi theo Edge).                 |

## 4. Exam Tips (Lưu ý thi SAA)

- Nếu đề bài yêu cầu **IP tĩnh (Static IP)** cho ứng dụng toàn cầu -> Chọn **Global Accelerator**.
- Nếu ứng dụng dùng giao thức **UDP** (Game, Media) hoặc **TCP non-HTTP** -> Chọn **Global Accelerator**.
- Nếu cần **failover cực nhanh** giữa các Region mà không lo vấn đề DNS Cache -> Chọn **Global Accelerator**.
- Nếu chỉ là web tĩnh/động thông thường (HTTP/S) -> Chọn **CloudFront**.
- Để bảo vệ ứng dụng khỏi DDoS -> Cả hai đều tích hợp **AWS Shield Standard**.
