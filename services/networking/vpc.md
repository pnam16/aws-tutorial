# Amazon VPC (Virtual Private Cloud)

## 1. Tổng quan (Overview)

Amazon VPC cho phép bạn khởi chạy các tài nguyên AWS vào một mạng ảo (virtual network) mà bạn xác định. Mạng ảo này gần giống với mạng truyền thống mà bạn vận hành trong trung tâm dữ liệu của riêng mình, với lợi ích sử dụng cơ sở hạ tầng có thể mở rộng của AWS.

- **Region-scoped**: Một VPC nằm trong một Region (ví dụ: `us-east-1`), nhưng trải dài trên tất cả các Availability Zones (AZs) của Region đó.
- **CIDR Block**: Một dải IP riêng (ví dụ: `10.0.0.0/16`) được gán cho VPC.

## 2. Các thành phần chính (Key Components)

### a. Subnets (Mạng con)

- Chia nhỏ dải IP của VPC. Một Subnet luôn nằm trọn trong **1 Availability Zone** (không thể trải dài qua nhiều AZ).
- **Public Subnet**: Có đường route đi Internet (qua Internet Gateway). Các instance trong này có Public IP (hoặc Elastic IP).
- **Private Subnet**: Không có đường route đi Internet. Để truy cập Internet (lấy update), phải đi qua **NAT Gateway** (nằm ở Public Subnet).

### b. Route Tables (Bảng định tuyến)

- Chứa các quy tắc (routes) để xác định nơi traffic sẽ đi.
- Mỗi Subnet phải liên kết với 1 Route Table (Mặc định là Main Route Table).
- _Local Route_: Mặc định, cho phép các instance trong cùng VPC giao tiếp với nhau.

### c. Internet Gateway (IGW)

- Cổng kết nối giữa VPC và Internet.
- Một VPC chỉ có 1 IGW.
- Để Public Subnet ra được Internet -> Add route `0.0.0.0/0` -> Target `igw-xxx`.

### d. NAT Gateway vs NAT Instance

| Đặc điểm           | NAT Gateway                                | NAT Instance                                      |
| :----------------- | :----------------------------------------- | :------------------------------------------------ |
| **Quản lý**        | Managed by AWS (Highly Available).         | Self-managed EC2 instance (User lo patching, HA). |
| **Scale**          | Tự động scale băng thông.                  | Phụ thuộc instance type.                          |
| **Public IP**      | Cần gán 1 Elastic IP.                      | Cần gán 1 Public/Elastic IP.                      |
| **Security Group** | Không dùng SG.                             | Dùng SG.                                          |
| **Giá**            | Đắt hơn (tính theo giờ + data processing). | Rẻ hơn (tính theo giờ EC2).                       |

### e. Security Group vs Network ACL (NACL)

| Đặc điểm     | Security Group                                                                                         | Network ACL (NACL)                                                                      |
| :----------- | :----------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------- |
| **Phạm vi**  | Instance Level (EC2 network interface).                                                                | Subnet Level (Bảo vệ cả subnet).                                                        |
| **State**    | **Stateful**: Nếu cho phép Inbound -> Tự động cho phép Outbound phản hồi (bất kể rule Outbound là gì). | **Stateless**: Phải định nghĩa cả rule Inbound và Outbound riêng biệt.                  |
| **Quy tắc**  | Chỉ có rule **Allow**. (Mọi thứ bị chặn mặc định).                                                     | Có cả rule **Allow** và **Deny**.                                                       |
| **Thứ tự**   | Tất cả rules được đánh giá cùng lúc (trước khi quyết định allow).                                      | Đánh giá theo **số thứ tự** (Rule #100, #200...). Rule nào khớp trước thì áp dụng ngay. |
| **Use Case** | Tường lửa chính cho server.                                                                            | Chặn IP cụ thể (Blacklist IP).                                                          |

## 3. Các kết nối khác (Other Connections)

### a. VPC Peering

- Kết nối 2 VPC với nhau (cùng hoặc khác Region, cùng hoặc khác Account).
- **Transitive Peering**: KHÔNG hỗ trợ. (Nếu A nối B, B nối C -> A KHÔNG thể nói chuyện với C qua B). A phải nối trực tiếp C.

### b. VPC Endpoints

- Kết nối private tới các dịch vụ AWS khác (S3, DynamoDB) mà không cần đi qua Internet Gateway/NAT Gateway.
- **Gateway Endpoints**: Chỉ hỗ trợ **S3** và **DynamoDB**. (Sửa Route Table).
- **Interface Endpoints (PrivateLink)**: Hỗ trợ hầu hết các dịch vụ khác (API Gateway, SNS, SQS...). Tạo ra ENI trong subnet của bạn.

### c. VPC Flow Logs

- Ghi lại thông tin về lưu lượng IP đi vào và ra khỏi các network interfaces trong VPC.
- Lưu vào **S3** hoặc **CloudWatch Logs**.
- Giúp debug các vấn đề kết nối (Security Group chặn, NACL chặn).

## 4. Exam Tips (Lưu ý thi SAA)

- Nếu đề bài yêu cầu **chặn 1 địa chỉ IP cụ thể** -> Dùng **NACL** (Rule Deny). Security Group không có rule Deny.
- Nếu 2 instances trong cùng VPC không ping được nhau -> Kiểm tra **Security Group** (cả Inbound của đích và Outbound của nguồn) và **NACL**.
- Để truy cập **S3/DynamoDB** từ Private Subnet an toàn, rẻ, không qua Internet -> Dùng **Gateway VPC Endpoint**.
- **NAT Gateway** phải luôn tạo trong **Public Subnet** và cần có định tuyến từ Private Subnet trỏ tới nó (`0.0.0.0/0 -> nat-gw`).
- VPC Peering không hỗ trợ **Transitive Routing** (Bắc cầu).
