# AWS VPN (Virtual Private Network)

## 1. AWS Site-to-Site VPN

**Mục đích**: Kết nối mạng On-premise của bạn với AWS VPC thông qua đường truyền Internet công cộng được mã hóa (IPSec tunnel).

### a. Các thành phần chính

1.  **Virtual Private Gateway (VGW)**:
    - Gateway phía AWS.
    - Gắn vào VPC của bạn.
2.  **Customer Gateway (CGW)**:
    - Thiết bị vật lý (hoặc phần mềm) phía On-premise của bạn.
    - Bạn cần cung cấp Public IP của thiết bị này cho AWS.
3.  **VPN Connection**:
    - Đường hầm kết nối giữa VGW và CGW.
    - Gồm **2 tunnels** active-active để đảm bảo High Availability (nhưng cần set up routing để dùng cả 2).

### b. VPN CloudHub

- Mô hình kết nối nhiều site On-premise với nhau thông qua AWS VPC (kiểu Hub-and-Spoke).
- _Ví dụ_: Văn phòng HN connect VPN tới VPC, Văn phòng HCM connect VPN tới VPC -> HN nói chuyện được với HCM qua VPC (như router trung gian).

### c. Accelerated Site-to-Site VPN

- Kết hợp **AWS Global Accelerator** với Site-to-Site VPN.
- Traffic từ On-premise đi vào AWS Edge Location gần nhất -> Đi qua mạng AWS Backbone -> Đến VGW.
- Giúp giảm độ trễ và ổn định hơn so với VPN đi hoàn toàn qua Internet.

## 2. AWS Client VPN

**Mục đích**: Cho phép người dùng cá nhân (nhân viên làm việc từ xa) kết nối an toàn vào AWS VPC hoặc On-premise từ máy tính xách tay/di động của họ.

- **OpenVPN based**: Sử dụng giao thức OpenVPN chuẩn.
- **Authentication**: Hỗ trợ Active Directory, Multi-Factor Authentication (MFA), Certificate-based auth.
- **Split-tunneling**: Cho phép user truy cập Internet trực tiếp (không đi qua VPN) trong khi vẫn truy cập tài nguyên VPC qua VPN.

## 3. Exam Tips (Lưu ý thi SAA)

- Nếu đề bài yêu cầu **kết nối nhanh chóng, rẻ** giữa On-premise và AWS để test -> Chọn **VPN**. (Direct Connect lâu và đắt).
- Nếu muốn **mã hóa** đường truyền -> VPN dùng **IPSec** mặc định. Direct Connect không có encryption (trừ khi dùng MACsec hoặc VPN over DX).
- Để kết nối **người dùng di động (Mobile workforce)** -> Chọn **Client VPN**.
- Để kết nối **nhiều văn phòng chi nhánh** với nhau giá rẻ -> Dùng **VPN CloudHub**.
- Nếu **VPN connection** hay bị rớt mạng -> Kiểm tra cấu hình **Dead Peer Detection (DPD)** hoặc dùng **Accelerated VPN**.
