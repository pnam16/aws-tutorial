# AWS Storage Gateway

## 1. Tổng quan (Overview)

AWS Storage Gateway là dịch vụ lưu trữ lai (Hybrid Cloud Storage) giúp kết nối các ứng dụng tại chỗ (On-premise) của bạn với bộ nhớ đám mây AWS.

- **Mục đích**: Backup dữ liệu lên Cloud, Mở rộng dung lượng lưu trữ cho server nội bộ, Giảm độ trễ truy cập dữ liệu Cloud (nhờ Local Cache).
- **Deploy**: Dạng máy ảo (VMware/Hyper-V/KVM) cài trên server của bạn hoặc thiết bị phần cứng (Hardware Appliance).

## 2. Các loại Gateway (Gateway Types)

### a. S3 File Gateway

- **Giao thức**: NFS (Linux) hoặc SMB (Windows).
- **Backend**: Amazon S3 (File -> Object).
- **Local Cache**: Lưu các file thường xuyên truy cập tại server on-premise để truy cập nhanh.
- _Use Case_: Thay thế File Server cũ, Backup dữ liệu lên S3, Tiering dữ liệu.

### b. FSx File Gateway

- **Giao thức**: SMB.
- **Backend**: Amazon FSx for Windows File Server.
- _Use Case_: Mở rộng dung lượng cho Windows File Server on-premise nhưng vẫn giữ độ trễ thấp.

### c. Volume Gateway

- **Giao thức**: iSCSI.
- **Backend**: Amazon S3 (nhưng hiển thị như ổ cứng block storage).
- **Chế độ**:
  1.  **Stored Volumes**: Dữ liệu **toàn bộ** nằm ở on-premise. Backup async lên AWS (Snapshot). (Dùng khi cần low latency cho toàn bộ data).
  2.  **Cached Volumes**: Dữ liệu **chính** nằm ở S3. Chỉ **cache** dữ liệu hay dùng ở on-premise. (Dùng khi muốn mở rộng dung lượng vô hạn).

### d. Tape Gateway

- **Giao thức**: iSCSI VTL (Virtual Tape Library).
- **Backend**: S3 Glacier & Glacier Deep Archive.
- \*Use Case\*\*: Thay thế hệ thống sao lưu băng từ vật lý (Physical Tape Library) đắt tiền và cồng kềnh.

## 3. Exam Tips (Lưu ý thi SAA)

- Nếu đề bài yêu cầu **truy cập file S3** từ on-premise qua giao thức **NFS/SMB** -> Chọn **S3 File Gateway**.
- Nếu muốn **mở rộng ổ cứng (iSCSI)** cho server on-premise mà dữ liệu chính vẫn nằm trên Cloud -> Chọn **Volume Gateway (Cached Mode)**.
- Nếu muốn **backup băng từ (Tape)** lên Cloud để lưu trữ lâu dài -> Chọn **Tape Gateway**.
- Để **giảm độ trễ** truy cập dữ liệu Cloud từ on-premise -> AWS Storage Gateway luôn có tính năng **Local Cache**.
