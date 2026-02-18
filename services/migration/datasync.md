# AWS DataSync

## 1. Tổng quan (Overview)

AWS DataSync là dịch vụ truyền dữ liệu trực tuyến (online data transfer) an toàn giúp bạn tự động hóa việc di chuyển dữ liệu giữa bộ nhớ tại chỗ (on-premise storage) và Amazon S3, EFS, FSx.

- **Tốc độ**: Nhanh hơn 10 lần so với các công cụ mã nguồn mở (rsync).
- **Giao thức hỗ trợ**: NFS, SMB, Object Storage, HDFS.

## 2. Kiến trúc (Architecture)

1.  **DataSync Agent**:
    - Máy ảo (VM) cài đặt trên server on-premise của bạn (VMware, Hyper-V).
    - Kết nối với NAS/File Server qua NFS/SMB.
    - Truyền dữ liệu lên AWS qua Internet hoặc Direct Connect.
2.  **AWS Service**:
    - Tiếp nhận dữ liệu và ghi vào S3, EFS, FSx.

## 3. Các tính năng chính (Key Features)

- **Incremental Transfer**: Chỉ copy các file đã thay đổi (như rsync).
- **Data Validation Check**: Tự động kiểm tra tính toàn vẹn dữ liệu (checksum) trong quá trình truyền và sau khi truyền.
- **Schedule**: Lên lịch chạy định kỳ (ví dụ: mỗi đêm).
- **Bandwidth Throttling**: Giới hạn băng thông để không làm nghẽn mạng công ty.

## 4. DataSync vs Snow Family vs Storage Gateway

| Đặc điểm        | AWS DataSync                                       | Snow Family (Snowball)                                            | Storage Gateway                                            |
| :-------------- | :------------------------------------------------- | :---------------------------------------------------------------- | :--------------------------------------------------------- |
| **Loại truyền** | Online (Qua mạng).                                 | Offline (Qua thiết bị vật lý).                                    | Online (Hybrid Cloud Storage).                             |
| **Mục đích**    | Migration dữ liệu lớn nhanh chóng, Backup định kỳ. | Migration dữ liệu **cực lớn** (Petabytes) nơi mạng chậm/không có. | Mở rộng lưu trữ on-prem lên cloud, Cache file thường dùng. |
| **Tốc độ**      | Phụ thuộc băng thông mạng (Network bandwidth).     | Phụ thuộc tốc độ ship thiết bị (vài ngày/tuần).                   | Real-time access.                                          |

## 5. Exam Tips (Lưu ý thi SAA)

- Nếu đề bài yêu cầu di chuyển dữ liệu **qua mạng (Internet/Direct Connect)** từ On-premise lên S3/EFS một cách **nhanh nhất, tự động** -> Chọn **DataSync**.
- Nếu băng thông mạng **quá chậm** để di chuyển lượng dữ liệu lớn (TB/PB) -> Chọn **Snow Family** (Offline).
- Nếu muốn giữ lại file server cũ ở on-premise nhưng **mở rộng dung lượng vô hạn** lên S3 -> Chọn **Storage Gateway (File Gateway)**.
- DataSync hỗ trợ cả **HDFS** (Hadoop Distributed File System) để migrate Big Data.
