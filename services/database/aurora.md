# Amazon Aurora

## 1. Tổng quan (Overview)

Amazon Aurora là cơ sở dữ liệu quan hệ được xây dựng riêng cho đám mây (Cloud-native), tương thích hoàn toàn với **MySQL** và **PostgreSQL**.

- **Hiệu năng**: Nhanh hơn MySQL tới 5 lần, nhanh hơn PostgreSQL tới 3 lần trên cùng phần cứng.
- **Độ tin cậy**: Độ bền dữ liệu (Durability) vượt trội so với RDS thường.
- **Giá**: Đắt hơn RDS (~20%) nhưng hiệu quả hơn ở quy mô lớn.

## 2. Kiến trúc lưu trữ (Storage Architecture)

Đây là điểm khác biệt lớn nhất của Aurora:

- **Shared Storage Volume**: Dữ liệu không nằm trên instance mà nằm trên một lớp storage ảo hóa riêng biệt, tự động mở rộng (tối đa 128TB).
- **6 Copies**: Dữ liệu được tự động sao chép thành **6 bản** đặt tại **3 Availability Zones** (2 bản mỗi AZ).
- **Self-healing**: Tự động phát hiện và sửa lỗi disk blocks hỏng.
- **Fault Tolerance**: Chịu được mất 2 bản copies mà vẫn ghi được (Write availability), mất 3 bản mà vẫn đọc được (Read availability).

## 3. Các loại Endpoints

1.  **Cluster Endpoint (Writer Endpoint)**:
    - Trỏ đến Primary Instance duy nhất (Writer).
    - Dùng để thực hiện INSERT, UPDATE, DELETE.
2.  **Reader Endpoint**:
    - Tự động cân bằng tải (Load Balance) giữa tất cả các Aurora Replicas.
    - Dùng cho câu lệnh SELECT.
3.  **Custom Endpoint**:
    - Tùy chỉnh nhóm các replica (ví dụ: nhóm replica lớn cho Analytics, nhóm nhỏ cho Web App).

## 4. Các tính năng nâng cao

### a. Aurora Serverless (v1 & v2)

- Tự động khởi động, tắt và scale capacity (ACU - Aurora Capacity Units) dựa trên nhu cầu ứng dụng.
- Phù hợp cho: Workload không thường xuyên (Intermittent), không đoán trước (Unpredictable), hoặc Dev/Test.
- _v2_: Scale nhanh hơn (phần nghìn giây) và mịn hơn.

### b. Aurora Global Database

- Replicate dữ liệu sang các Region khác với độ trễ cực thấp (< 1 giây).
- **Disaster Recovery**: Nếu Region chính sập, promote Region phụ lên làm Primary trong < 1 phút.
- **Local Read**: Cho phép người dùng ở châu lục khác đọc dữ liệu nhanh (gần vị trí họ).

### c. Aurora Multi-Master

- (Chỉ MySQL) Cho phép ghi (Write) trên nhiều instance cùng lúc.
- Dùng cho ứng dụng cần uptime 100% ngay cả khi 1 writer chết (failover tức thì, không cần chờ promote).

### d. Backtrack

- (Chỉ MySQL) Quay ngược thời gian dữ liệu về quá khứ (ví dụ: quay lại 5 phút trước khi lỡ tay DROP TABLE) cực nhanh mà không cần restore snapshot.

## 5. High Availability & Scaling

- **Aurora Replicas**: Hỗ trợ tối đa **15 Read Replicas** (RDS thường chỉ 5).
- **Fast Failover**: Vì storage là shared, khi Primary chết, một Replica có thể được promote lên làm Primary rất nhanh (thường < 30s) mà không mất dữ liệu.

## 6. Exam Tips (Lưu ý thi SAA)

- Nếu đề bài yêu cầu database **tương thích MySQL/PostgreSQL** nhưng cần **hiệu năng cao, tự động scale storage, HA tốt hơn RDS** -> Chọn **Aurora**.
- Nếu workload **không đoán trước được** hoặc **ít sử dụng** -> Chọn **Aurora Serverless**.
- Nếu cần **Disaster Recovery** giữa các Region với RPO/RTO thấp nhất -> Chọn **Aurora Global Database**.
- Nếu cần khả năng **quay ngược thời gian (Rewind/Undo)** lỗi -> Chọn **Aurora Backtrack**.
- Aurora Replica vừa dùng để **Scale Read**, vừa dùng làm **Failover target**.
