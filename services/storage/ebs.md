# Amazon EBS (Elastic Block Store)

## 1. Tổng quan (Overview)

Amazon EBS là dịch vụ lưu trữ dạng khối (block storage) hiệu năng cao, được thiết kế để sử dụng với Amazon EC2.

- **Network Drive**: EBS Volume được kết nối với EC2 qua mạng (tuy nhiên độ trễ rất thấp).
- **Availability**: Dữ liệu được replicate trong 1 Availability Zone (AZ) để chống mất dữ liệu do lỗi phần cứng.
- **Persistence**: Dữ liệu tồn tại độc lập với vòng đời của EC2 instance (trừ khi chọn "Delete on Termination").

## 2. Các loại EBS Volume (Volume Types)

1.  **General Purpose SSD (gp3, gp2)**:
    - Cân bằng giá/hiệu năng.
    - **gp3**: Cho phép chỉnh IOPS và Throughput độc lập với dung lượng (Khuyên dùng).
    - _Use Case_: Boot volumes, Web servers, Dev/Test, Small Database.

2.  **Provisioned IOPS SSD (io2 Block Express, io1)**:
    - Hiệu năng cao nhất, độ trễ thấp nhất (low latency).
    - Hỗ trợ **Multi-Attach** (gắn 1 volume vào nhiều EC2 cùng lúc - chỉ io1/io2).
    - _Use Case_: Critical Database (Oracle, SAP HANA), NoSQL (Cassandra, MongoDB).

3.  **Throughput Optimized HDD (st1)**:
    - Ổ đĩa từ (HDD) tối ưu băng thông (throughput).
    - _Use Case_: Big Data, Data Warehousing, Log processing. (Không dùng làm boot volume).

4.  **Cold HDD (sc1)**:
    - Rẻ nhất. Ít truy cập.
    - _Use Case_: File Server archive.

## 3. Các tính năng chính (Key Features)

### a. Snapshots

- Sao lưu (Backup) EBS Volume vào S3 (Incremental backup - chỉ lưu phần thay đổi).
- Snapshot có tính chất **Region**. Muốn dùng ở Region khác phải **Copy Snapshot**.

### b. Encryption

- Mã hóa toàn bộ dữ liệu trong volume và snapshot bằng KMS.
- Mặc định: Mã hóa được bật ở level Account/Region (Opt-in).

### c. Elastic Volumes

- Cho phép thay đổi kích thước (tăng dung lượng), loại volume (gp2 -> io1), và hiệu năng (tăng IOPS) **khi đang chạy** (không cần stop instance).

## 4. Exam Tips (Lưu ý thi SAA)

- Nếu đề bài yêu cầu **hiệu năng cao, low latency** và **I/O ổn định** -> Chọn **Provisioned IOPS (io1/io2)**.
- Nếu đề bài yêu cầu **Big Data** xử lý tuần tự (sequential I/O), throughput cao -> Chọn **st1**.
- Nếu muốn **chia sẻ dữ liệu** block storage giữa nhiều EC2 instance -> Dùng **EBS Multi-Attach** (chỉ io1/io2, cùng AZ) hoặc chuyển sang **EFS** (Multi-AZ).
- Để **di chuyển EBS Volume** sang AZ khác -> Snapshot -> Create Volume from Snapshot (chọn AZ mới).
- Để **di chuyển EBS** sang Region khác -> Snapshot -> Copy Snapshot to Region B -> Create Volume.
- EBS Volume là **Zonal Resource** (chỉ nằm trong 1 AZ). Nếu AZ đó sập, volume không truy cập được (khác với EFS/S3 là Regional).
