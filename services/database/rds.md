# Amazon RDS (Relational Database Service)

## 1. Tổng quan (Overview)

Amazon RDS là dịch vụ cơ sở dữ liệu quan hệ được quản lý (Managed Relational Database Service). Nó giúp dễ dàng thiết lập, vận hành và mở rộng cơ sở dữ liệu quan hệ trong đám mây.

- **Managed Service**: AWS lo việc patching OS, cài đặt DB, backup, recovery, failure detection.
- **Engines**: Hỗ trợ 6 engines: Amazon Aurora, PostgreSQL, MySQL, MariaDB, Oracle, SQL Server.
- **OLTP**: Tối ưu cho xử lý giao dịch trực tuyến (Online Transaction Processing).

## 2. Các tính năng chính (Key Features)

### a. Multi-AZ Deployments (High Availability)

- **Mục đích**: Disaster Recovery (DR) và High Availability (HA).
- **Cơ chế**: Dữ liệu được sao chép đồng bộ (synchronous replication) sang một Standby instance ở Availability Zone (AZ) khác.
- **Failover**: Nếu Primary chết, AWS tự động chuyển DNS sang Standby (thời gian 60-120s).
- **Lưu ý**: Standby instance **KHÔNG** dùng để đọc (trừ Aurora). Nó chỉ nằm chờ.

### b. Read Replicas (Scalability)

- **Mục đích**: Tăng khả năng đọc (Scale Read).
- **Cơ chế**: Dữ liệu được sao chép bất đồng bộ (asynchronous replication) từ Primary.
- **Sử dụng**: Ứng dụng có thể kết nối trực tiếp vào Read Replica để chạy các câu lệnh SELECT (báo cáo, analytics).
- **Promotion**: Có thể promote Read Replica thành Primary database (để DR hoặc sharding).

### c. Backup & Restore

1.  **Automated Backups**:
    - Snapshot toàn bộ DB hàng ngày (Daily).
    - Lưu Transaction Logs mỗi 5 phút.
    - Cho phép **Point-in-Time Recovery (PITR)**: Khôi phục về bất kỳ giây nào trong thời gian retention period (1-35 ngày).
2.  **Manual Snapshots**:
    - Do người dùng kích hoạt.
    - Tồn tại vĩnh viễn cho đến khi bạn xóa (kể cả khi xóa DB instance).

### d. Storage Auto Scaling

- Tự động tăng dung lượng ổ đĩa (Storage) khi gần đầy mà không gây downtime.

### e. IAM Authentication

- Cho phép dùng IAM Role/User để đăng nhập vào DB (PostgreSQL/MySQL) thay vì dùng password.
- An toàn hơn vì không cần hardcode password trong code, dùng token tạp thời (15 phút).

## 3. Storage Types (Lưu trữ)

1.  **General Purpose SSD (gp2, gp3)**:
    - Cân bằng giữa giá cả và hiệu năng. Dùng cho Dev/Test hoặc Prod nhỏ.
2.  **Provisioned IOPS SSD (io1, io2)**:
    - Hiệu năng cao, độ trễ thấp, I/O ổn định.
    - Dùng cho các ứng dụng Production quan trọng (Mission-critical).
3.  **Magnetic**: Dòng cũ (legacy), rẻ nhưng chậm.

## 4. Encryption

- **At Rest**: Dùng AWS KMS (AES-256). Phải bật lúc tạo DB, không thể bật sau khi đã tạo (muốn bật phải Snapshot -> Copy Snapshot with Encryption -> Restore).
- **In Transit**: Dùng SSL/TLS connection.

## 5. Exam Tips (Lưu ý thi SAA)

- Nếu đề bài yêu cầu **High Availability (HA)** và tự động failover -> Chọn **Multi-AZ**.
- Nếu đề bài yêu cầu giảm tải **đọc (read heavy)** cho Primary DB -> Chọn **Read Replicas**.
- Nếu đề bài yêu cầu **Disaster Recovery (DR)** thấp chi phí -> Tạo **Cross-Region Read Replica**.
- Nếu cần truy cập hệ điều hành (SSH) để cài plugin lạ -> RDS **KHÔNG** hỗ trợ SSH. Phải dùng **EC2 cài DB tự quản lý**.
- Nếu database chạy chậm, CPU cao -> Scale up instance type (Vertical scaling) hoặc dùng Read Replica (nếu do đọc nhiều).
- Để mã hóa DB đã có (Unencrypted) -> Snapshot -> Copy (Encrypt) -> Restore.
