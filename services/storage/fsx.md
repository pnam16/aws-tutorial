# Amazon FSx

## 1. Tổng quan (Overview)

Amazon FSx cung cấp hệ thống tệp tin (File System) được quản lý hoàn toàn cho các workload đặc thù hoặc hiệu suất cao.

## 2. Các loại FSx (FSx Types)

### a. FSx for Windows File Server

- **Giao thức**: SMB (Server Message Block).
- **Workload**: Windows-based applications (SharePoint, SQL Server, Home Directories).
- **Tính năng**:
  - Tích hợp Active Directory (AD).
  - Hỗ trợ DFS Namespaces.
  - Data Deduplication (khử trùng lặp giúp tiết kiệm dung lượng).

### b. FSx for Lustre

- **Giao thức**: Lustre (Linux).
- **Workload**: High Performance Computing (HPC), Machine Learning, Video Processing.
- **Tính năng**:
  - Tốc độ cực cao (sub-millisecond latency), throughput khủng (hàng trăm GB/s).
  - Tích hợp với **S3**: Có thể load data từ S3 vào FSx Lustre để xử lý nhanh, sau đó ghi kết quả ngược lại S3.

### c. FSx for NetApp ONTAP

- **Giao thức**: NFS, SMB, iSCSI.
- **Workload**: Ứng dụng doanh nghiệp đang chạy trên NetApp on-premise muốn chuyển lên Cloud.
- **Tính năng**:
  - Snapshot, Clone, Replication cực mạnh của NetApp.
  - Tiering data sang S3 (Capacity Pool) để tiết kiệm chi phí.

### d. FSx for OpenZFS

- **Giao thức**: NFS.
- **Workload**: ZFS-based applications.
- **Tính năng**: Tốc độ cao (1 triệu IOPS), snapshot hiệu quả.

## 3. Exam Tips (Lưu ý thi SAA)

- Nếu đề bài yêu cầu **chia sẻ file cho Windows EC2** dùng giao thức **SMB** -> Chọn **FSx for Windows File Server**. (Nếu là Linux dùng NFS -> Chọn EFS).
- Nếu đề bài yêu cầu **HPC (High Performance Computing)**, xử lý dữ liệu song song cực lớn, tích hợp với **S3** -> Chọn **FSx for Lustre**.
- Nếu muốn migration workload từ **NetApp on-premise** lên AWS -> Chọn **FSx for NetApp ONTAP**.
- FSx for Windows File Server hỗ trợ **Multi-AZ** (High Availability) và **Data Deduplication**.
