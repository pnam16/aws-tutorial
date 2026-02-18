# AWS Fargate

## 1. Tổng quan (Overview)

AWS Fargate là một công cụ tính toán serverless (không máy chủ) dành cho các container. Nó hoạt động với cả **Amazon ECS** và **Amazon EKS**.

- **Serverless**: Không cần cung cấp, định cấu hình hoặc quản lý các cụm máy ảo EC2 để chạy container.
- **Isolation**: Mỗi Task/Pod chạy trong môi trường cách biệt, kernel riêng, ENI riêng.
- **Rightsizing**: Chỉ trả tiền cho lượng vCPU và Memory mà ứng dụng Container của bạn yêu cầu.

## 2. Các tính năng chính (Key Features)

### a. Compute & Resource Allocation

- Bạn định nghĩa CPU và RAM ở cấp độ Task (ECS) hoặc Pod (EKS).
- AWS tự động tìm máy chủ vật lý phù hợp để chạy container đó.
- Không có khái niệm "Instance Type" hay "Cluster Scaling" cho hạ tầng bên dưới.

### b. Networking (awsvpc mode)

- Mỗi Fargate Task có một **Elastic Network Interface (ENI)** riêng và một IP private trong VPC subnet.
- Security Group được gắn trực tiếp vào Task (thay vì EC2 instance).
- Điều này mang lại khả năng kiểm soát mạng và bảo mật rất chi tiết (Micro-segmentation).

### c. Pricing

- Tính tiền theo vCPU và GB-RAM mỗi giây.
- Có thể đắt hơn EC2 Spot hoặc Reserved Instances nếu chạy 24/7 với tải ổn định, nhưng rẻ hơn nếu tải biến động hoặc cluster EC2 không được tận dụng hết (bin packing kém).
- **Fargate Spot**: Giảm giá tới 70% cho các ứng dụng có thể chịu lỗi (fault-tolerant).

## 3. Storage Options (Lưu trữ)

1.  **Ephemeral Storage**: Mặc định 20GB cho mỗi task (có thể tăng lên 200GB). Dữ liệu mất khi task dừng.
2.  **Amazon EFS**: Gắn volumes EFS vào Fargate task để lưu trữ bền vững, chia sẻ dữ liệu giữa các containers. (Rất quan trọng cho web server cần share file upload).

## 4. Fargate vs EC2 Launch Type

| Đặc điểm            | Fargate                                                           | EC2 Launch Type                                             |
| :------------------ | :---------------------------------------------------------------- | :---------------------------------------------------------- |
| **Quản lý**         | Không quản lý OS, patching, cluster scaling.                      | Phải quản lý AMI, patching, Auto Scaling Group (ASG).       |
| **Giá**             | Trả theo resource request (CPU/RAM). Thường cao hơn EC2 một chút. | Trả theo instance size. Cần tối ưu hóa (bin packing) để rẻ. |
| **Start Time**      | Chậm hơn một chút (30-60s để provision ENI/VM).                   | Nhanh hơn nếu Instance đã có sẵn trong cluster.             |
| **Networking**      | Luôn là `awsvpc` (ENI riêng).                                     | Có thể dùng `bridge`, `host`, `awsvpc`.                     |
| **Privileged Mode** | Không hỗ trợ (không thể chạy Docker in Docker).                   | Hỗ trợ đầy đủ.                                              |

## 5. Exam Tips (Lưu ý thi SAA)

- Nếu đề bài yêu cầu chạy container/microservices mà **không muốn quản lý máy chủ (EC2)** -> Chọn **Fargate**.
- Nếu muốn **tối ưu chi phí quản lý hành chính** (operational overhead) cho container -> Chọn **Fargate**.
- Nếu ứng dụng cần truy cập **GPU**, hoặc cần chế độ đặc quyền (**Privileged mode**) -> Phải dùng **EC2 Launch Type** (Fargate hiện tại hỗ trợ GPU hạn chế và không privileged).
- Để chia sẻ dữ liệu bền vững giữa các Fargate tasks -> Sử dụng **Amazon EFS** (Fargate không hỗ trợ gắn EBS).
- Nếu cần **chạy định kỳ (Cron tasks)** container -> Sử dụng **EventBridge Scheduler** kích hoạt **ECS Task trên Fargate**.
