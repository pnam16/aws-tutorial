# AWS Direct Connect (DX)

## 1. Tổng quan (Overview)

AWS Direct Connect là giải pháp kết nối mạng chuyên dụng (dedicated network connection) từ cơ sở hạ tầng tại chỗ (On-premise) của bạn đến AWS.

- **Bypass Internet**: Kết nối vật lý riêng biệt, không đi qua Internet công cộng.
- **Consistent Performance**: Băng thông ổn định, độ trễ thấp hơn so với VPN qua Internet.
- **Bandwidth**: Từ 50 Mbps đến 100 Gbps.

## 2. Các thành phần chính (Key Components)

### a. Virtual Interfaces (VIFs)

1.  **Private VIF**: Kết nối tới tài nguyên riêng trong VPC (EC2, RDS, Private IP).
2.  **Public VIF**: Kết nối tới các dịch vụ AWS công cộng (S3, DynamoDB, Public IP) mà không cần đi qua Internet.
3.  **Transit VIF**: Kết nối tới **AWS Transit Gateway** (để truy cập hàng trăm VPCs).

### b. Direct Connect Gateway

- Cho phép 1 kết nối Direct Connect truy cập tới nhiều VPC ở **nhiều Region khác nhau** (Multi-Region) thuộc cùng một tài khoản AWS.
- Giảm số lượng kết nối vật lý cần thiết.

### c. Connection Types

- **Dedicated Connection**: Cáp vật lý 1Gbps hoặc 10Gbps/100Gbps dành riêng cho bạn. Phải đặt (order) qua AWS Console và đấu nối tại Direct Connect Location.
- **Hosted Connection**: Chia sẻ băng thông từ một đối tác của AWS (Partner). Linh hoạt hơn (50Mbps - 10Gbps) và có thể thêm/bớt dễ dàng.

## 3. Direct Connect vs VPN

| Đặc điểm                 | AWS Direct Connect                                                                    | Site-to-Site VPN                               |
| :----------------------- | :------------------------------------------------------------------------------------ | :--------------------------------------------- |
| **Môi trường truyền**    | Cáp quang riêng (Dedicated fiber).                                                    | Internet công cộng (Shared).                   |
| **Độ ổn định**           | Rất cao, cam kết SLA.                                                                 | Phụ thuộc vào ISP và tình trạng mạng Internet. |
| **Bảo mật**              | Không mã hóa mặc định (Physical isolation). Có thể dùng MACsec hoặc chạy VPN trên DX. | Mã hóa IPSec tunnel mặc định.                  |
| **Thời gian triển khai** | Vài tuần đến vài tháng (Physical setup).                                              | Vài phút (Software setup).                     |
| **Chi phí**              | Cao (Port fee + Data transfer out).                                                   | Rẻ (VPN Connection fee + Data transfer).       |

## 4. High Availability (HA) & Resiliency

- **Development**: 1 DX connection (Không có HA).
- **Production**: Khuyên dùng tối thiểu **2 DX connections** tại 2 Direct Connect Locations khác nhau (Redundancy) để đạt HA tối đa.
- **Cost-effective Backup**: Sử dụng **DX làm đường chính** và **Site-to-Site VPN làm đường backup** (Active/Passive). Nếu DX đứt -> Traffic tự động chuyển sang VPN.

## 5. Exam Tips (Lưu ý thi SAA)

- Nếu đề bài yêu cầu kết nối **ổn định, bandwidth lớn, độ trễ thấp** -> Chọn **Direct Connect**.
- Nếu cần **triển khai nhanh** trong vài phút để test -> Chọn **VPN**.
- Nếu cần **bảo mật (Encryption) trên đường truyền Direct Connect** -> Dùng **AWS Direct Connect + VPN** (VPN over DX) hoặc **MACsec** (Layer 2 encryption) cho các kết nối 10Gbps/100Gbps.
- Để kết nối 1 DX tới nhiều VPC ở nhiều Region -> Dùng **Direct Connect Gateway**.
