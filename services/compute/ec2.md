# Amazon EC2 (Elastic Compute Cloud)

## 1. Tổng quan (Overview)

Amazon EC2 là dịch vụ web cung cấp khả năng tính toán an toàn và có thể thay đổi kích thước (resizable compute capacity) trong đám mây. Nó được thiết kế để giúp việc tính toán quy mô web (web-scale cloud computing) trở nên dễ dàng hơn cho các nhà phát triển.

- **IaaS (Infrastructure as a Service)**: Cung cấp máy chủ ảo (Virtual Machines).
- **Kiểm soát toàn diện**: Bạn có quyền truy cập root/admin vào OS.
- **Linh hoạt**: Chọn loại CPU, RAM, Storage, Network phù hợp với nhu cầu.

## 2. Các loại Instances (Instance Types)

Để tối ưu chi phí và hiệu năng, cần chọn đúng dòng instance:

1.  **General Purpose (Đa dụng)**:
    - _Dòng_: T (T3, T4g - Burstable), M (M5, M6g).
    - _Use Case_: Web servers, microservices, small databases.
2.  **Compute Optimized (Tối ưu tính toán)**:
    - _Dòng_: C (C5, C6g, C7g).
    - _Use Case_: High-performance web servers, xử lý batch, media encoding, machine learning inference, gaming servers.
3.  **Memory Optimized (Tối ưu bộ nhớ)**:
    - _Dòng_: R (R5, R6g), X (X1).
    - _Use Case_: Database hiệu năng cao (RDS, ElastiCache), in-memory databases (SAP HANA), real-time big data analytics.
4.  **Storage Optimized (Tối ưu lưu trữ)**:
    - _Dòng_: I (I3), D (D2), H (H1).
    - _Use Case_: NoSQL databases (Cassandra, MongoDB), Data Warehousing, Distributed File Systems.
5.  **Accelerated Computing (Tăng tốc tính toán)**:
    - _Dòng_: P, G (GPU), F (FPGA).
    - _Use Case_: Machine Learning Training, Graphics Rendering, Video Transcoding.

_Mẹo nhớ_: **M** (Main/Memory?), **C** (Compute), **R** (RAM), **I** (IOPS/Storage), **G** (Graphics).

## 3. Các mô hình mua (Purchasing Options)

1.  **On-Demand (Theo nhu cầu)**:
    - Trả tiền theo giây/giờ. Không cam kết, không trả trước.
    - _Use Case_: Short-term, ứng dụng mới, testing.
2.  **Reserved Instances (RI)**:
    - Cam kết 1 hoặc 3 năm. Giảm giá tới 72% so với On-Demand.
    - _Standard RI_: Không đổi loại instance family -> Giảm nhiều nhất.
    - _Convertible RI_: Có thể đổi loại instance -> Giảm ít hơn.
    - _Use Case_: Steady-state usage (database, backend chạy 24/7).
3.  **Savings Plans**:
    - Linh hoạt hơn RI. Cam kết chi tiêu ($/giờ) trong 1 hoặc 3 năm.
    - _Compute Savings Plans_: Áp dụng cho EC2, Fargate, Lambda. Rất linh hoạt (đổi vùng, đổi dòng instance).
4.  **Spot Instances**:
    - Đấu giá dung lượng thừa của AWS. Giảm tới 90%.
    - **Rủi ro**: Bị AWS thu hồi với thông báo trước 2 phút.
    - _Use Case_: Batch processing, stateless apps, CI/CD, HPC.
5.  **Dedicated Hosts**:
    - Máy chủ vật lý dành riêng cho bạn.
    - _Use Case_: License phần mềm yêu cầu (BYOL - Bring Your Own License), Compliance cực gắt.

## 4. EC2 Storage (Lưu trữ cho EC2)

1.  **EBS (Elastic Block Store)**:
    - Ổ đĩa mạng (Network drive). Dữ liệu bền vững dù tắt instance.
    - Có thể tách rời và gắn sang instance khác (cùng AZ).
2.  **Instance Store (Ephemeral Storage)**:
    - Ổ đĩa vật lý gắn trực tiếp vào máy chủ.
    - Hiệu năng I/O cực cao.
    - **Mất dữ liệu** nếu tắt/stop instance. Chỉ dùng cho cache, temporary data.

## 5. Các tính năng quan trọng

### a. User Data

- Script chạy **một lần duy nhất** khi instance khởi động lần đầu tiên.
- Dùng để cài đặt phần mềm, cập nhật OS, tải source code.

### b. Metadata

- Thông tin về instance (IP, Instance ID, hostname).
- Truy cập từ bên trong instance tại: `http://169.254.169.254/latest/meta-data/`.

### c. Placement Groups

- Điều khiển cách các instance được đặt trên phần cứng vật lý.
  1.  **Cluster**: Gom cụm lại gần nhau (cùng Rack/AZ) -> Low latency, High network throughput (HPC).
  2.  **Spread**: Tách ra các Rack khác nhau -> Giảm rủi ro phần cứng hỏng cùng lúc (Critical apps).
  3.  **Partition**: Tách ra các phân vùng logic (Hadoop, Kafka).

## 6. Exam Tips (Lưu ý thi SAA)

- Nếu cần **tiết kiệm chi phí nhất** cho task có thể bị gián đoạn -> Chọn **Spot Instances**.
- Nếu cần **chạy ổn định 24/7** trong 1-3 năm -> Chọn **Reserved Instances** hoặc **Savings Plans**.
- Nếu cần **hiệu năng cao nhất** về mạng (low latency) giữa các instances -> Chọn **Cluster Placement Group** + **Enhanced Networking** (ENA).
- Nếu cần **khôi phục tự động** khi instance chết -> Dùng **Auto Scaling Group** (kể cả chỉ chạy 1 instance, set Min=1, Max=1).
- Nếu instance không kết nối được Internet -> Kiểm tra **Security Group** (Outbound), **NACL**, **Route Table** (IGW/NAT Gateway).
- Nếu mất SSH key -> Không thể khôi phục key. Phải tạo AMI từ instance đó và launch lại với key mới (hoặc dùng Session Manager).
