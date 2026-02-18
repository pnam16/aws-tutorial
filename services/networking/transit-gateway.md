# AWS Transit Gateway (TGW)

## 1. Tổng quan (Overview)

AWS Transit Gateway là một "bộ định tuyến đám mây" (Cloud Router) giúp kết nối hàng nghìn VPC và mạng on-premise với nhau thông qua một hub trung tâm.

- **Hub-and-spoke Topology**: Thay thế mô hình "Full Mesh Peering" rối rắm (VPC Peering n\*(n-1)/2 kết nối).
- **Simplified Management**: Chỉ cần kết nối mỗi VPC với TGW, mọi định tuyến được quản lý tại TGW Route Table.

## 2. Các tính năng chính (Key Features)

### a. Centralized Routing

- TGW hoạt động như một router khu vực (Regional Router).
- Hỗ trợ định tuyến giữa các VPC, VPN, Direct Connect Gateway.
- Hỗ trợ **Transitive Routing** (Bắc cầu): VPC A -> TGW -> VPC B -> TGW -> VPN -> On-premise. (VPC Peering không làm được điều này).

### b. Cross-Region Peering

- Kết nối TGW ở Region A với TGW ở Region B.
- Cho phép các VPC ở khắp thế giới giao tiếp với nhau qua mạng backbone của AWS.

### c. Multicast Support

- Hỗ trợ giao thức IP Multicast (gửi 1 gói tin tới nhiều đích cùng lúc).
- _Use Case_: Streaming video, teleconferencing. (Chỉ TGW hỗ trợ Multicast, VPC thường không hỗ trợ).

## 3. Transit Gateway vs VPC Peering

| Đặc điểm        | AWS Transit Gateway                                   | VPC Peering                                     |
| :-------------- | :---------------------------------------------------- | :---------------------------------------------- |
| **Mô hình**     | Hub-and-Spoke (Hình sao).                             | Point-to-Point (Điểm-Điểm).                     |
| **Độ phức tạp** | Thấp (Quản lý tập trung).                             | Cao (Nếu số lượng VPC lớn - N^2 connections).   |
| **Băng thông**  | Giới hạn tối đa (hiện tại là 50 Gbps per attachment). | Không giới hạn (bằng tốc độ cổng của instance). |
| **Transitive**  | Có.                                                   | Không.                                          |
| **Giá**         | Đắt hơn (Phí xử lý hourly + Data processing).         | Rẻ hơn (Chỉ data transfer).                     |

## 4. Architecture Patterns

- **Shared Services VPC**: Các công cụ chung (Logging, Monitoring, Security) đặt trong 1 VPC. Tất cả VPC khác connect qua TGW để dùng chung -> Giảm chi phí duplicate resource.
- **Inspection VPC**: Tất cả traffic internet đi qua TGW -> Inspection VPC (chạy Firewall appliance) -> Internet. Giúp kiểm soát bảo mật tập trung (Centralized Egress Filtering).

## 5. Exam Tips (Lưu ý thi SAA)

- Nếu đề bài có **hàng chục/trăm VPC** cần kết nối với nhau -> Chọn **Transit Gateway**.
- Nếu cần mô hình **Transitive Routing** (VPC A -> B -> C) -> Chọn **Transit Gateway**.
- Nếu cần hỗ trợ **IP Multicast** -> Chọn **Transit Gateway**.
- Để kết nối **nhiều VPN** cùng lúc (VPN ECMP - Equal Cost Multi-Path) để tăng băng thông VPN -> Kết nối VPN vào **Transit Gateway**.
