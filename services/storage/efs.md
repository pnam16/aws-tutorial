# Amazon EFS (Elastic File System)

## 1. Tổng quan (Overview)

Amazon EFS là hệ thống tệp tin đàn hồi (elastic file system), tự động mở rộng, fully managed, dùng cho Linux (POSIX-compliant).

- **Regional Resource**: Dữ liệu được lưu trữ trên nhiều Availability Zones (AZs) trong 1 Region. -> Có tính sẵn sàng cao (HA) hơn EBS.
- **Shared Access**: Có thể được mount bởi hàng nghìn EC2 instances cùng lúc.

## 2. Storage Classes

1.  **EFS Standard**:
    - Lưu trữ trên 3+ AZs.
    - Dùng cho dữ liệu truy cập thường xuyên.

2.  **EFS Infrequent Access (EFS-IA)**:
    - Giá lưu trữ rẻ hơn (~90%), nhưng phí truy cập cao hơn.
    - Dùng Lifecycle Policy để tự động chuyển file không dùng sau 7 ngày sang IA.

3.  **EFS One Zone**:
    - Lưu trữ trên 1 AZ. Rẻ hơn nhưng rủi ro mất dữ liệu nếu AZ sập.

## 3. Performance Modes

1.  **General Purpose (Mặc định)**:
    - Độ trễ thấp nhất.
    - Phù hợp cho Web Server, CMS, Home directories.

2.  **Max I/O**:
    - Throughput cao hơn, IOPS cao hơn, nhưng độ trễ cao hơn.
    - Phù hợp cho Big Data, Media processing song song cực lớn.

## 4. Exam Tips (Lưu ý thi SAA)

- Nếu đề bài yêu cầu **chia sẻ file** giữa nhiều Linux EC2 instances -> Chọn **EFS**. (EBS Multi-Attach chỉ cho phép tối đa 16 instances và cùng AZ, EFS cho phép hàng nghìn và khác AZ).
- EFS hỗ trợ giao thức **NFS** (Network File System).
- EFS tương thích với **Linux Only**. (Windows không mount được EFS -> Phải dùng FSx for Windows File Server).
- Để tối ưu chi phí EFS -> Bật **Lifecycle Management** để chuyển data sang **EFS-IA**.
- Để move data từ On-premise lên EFS -> Dùng **DataSync**.
