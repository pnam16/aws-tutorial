# Amazon DynamoDB

## 1. Tổng quan (Overview)

Amazon DynamoDB là dịch vụ cơ sở dữ liệu **NoSQL** dạng Key-Value và Document, hoàn toàn được quản lý (fully managed), serverless. Nó được thiết kế để cung cấp hiệu năng cực nhanh (single-digit millisecond latency) ở mọi quy mô.

- **Serverless**: Không có server để patch hay quản lý.
- **High Scale**: Tự động scale ngang (horizontal scaling) để xử lý hàng triệu requests/giây.
- **High Availability**: Tự động replication qua 3 AZs.

## 2. Các khái niệm chính (Key Concepts)

### a. Table (Bảng)

- Tập hợp các Items (Mục). Không có Schema cố định (schemaless), trừ Primary Key.

### b. Items (Mục)

- Giống như một row (hàng) trong SQL.
- Gồm nhiều Attributes (Thuộc tính).
- Kích thước tối đa 400KB.

### c. Primary Key (Khóa chính)

Có 2 loại:

1.  **Partition Key (PK - Hash Key)**: Dùng để phân tán dữ liệu. Phải là duy nhất nếu bảng chỉ có PK.
2.  **Composite Key (PK + Sort Key)**:
    - _Partition Key_: Xác định partition.
    - _Sort Key (Range Key)_: Sắp xếp dữ liệu trong cùng partition.
    - Cho phép nhiều item có cùng PK nhưng khác SK.

## 3. Capacity Modes (Chế độ dung lượng)

### a. Provisioned Mode (Mặc định)

- Bạn định nghĩa số lượng **RCU (Read Capacity Units)** và **WCU (Write Capacity Units)**.
- RCU: 1 RCU = 1 strong consistent read (4KB) / giây hoặc 2 eventually consistent reads (4KB) / giây.
- WCU: 1 WCU = 1 write (1KB) / giây.
- Có thể bật **Auto Scaling** để điều chỉnh RCU/WCU.
- _Dùng khi_: Traffic ổn định, đoán trước được, muốn tối ưu chi phí.

### b. On-Demand Mode

- Tự động scale dựa trên request thực tế. Trả tiền theo mỗi request (Pay-per-request).
- Đắt hơn Provisioned nếu traffic cao và ổn định.
- _Dùng khi_: Traffic đột biến, không đoán trước được, hoặc ứng dụng mới.

## 4. Advanced Features

### a. Indexes (Chỉ mục)

1.  **LSI (Local Secondary Index)**:
    - Cùng PK như bảng chính, nhưng khác SK.
    - Chỉ được tạo **lúc tạo bảng**.
2.  **GSI (Global Secondary Index)**:
    - PK và SK khác hoàn toàn bảng chính.
    - Có thể **tạo/xóa bất kỳ lúc nào**.
    - GSI có RCU/WCU riêng (nếu dùng Provisioned).

### b. DynamoDB Accelerator (DAX)

- Dịch vụ In-memory Cache dành riêng cho DynamoDB.
- Giảm độ trễ từ miliseconds -> **microseconds**.
- **Transparent Cache**: Ứng dụng không cần sửa code cache logic, chỉ cần trỏ endpoint vào DAX.

### c. DynamoDB Streams

- Ghi lại (Capture) mọi thay đổi (INSERT, UPDATE, DELETE) trong bảng theo thời gian thực (trong 24h).
- Dùng để kích hoạt **Lambda** (Trigger) để xử lý sự kiện (ví dụ: khi user đăng ký -> gửi email chào mừng).

### d. Global Tables

- Replica bảng sang nhiều AWS Regions (Active-Active replication).
- Người dùng ở US ghi vào bảng US, người dùng ở EU ghi vào bảng EU -> DynamoDB tự động đồng bộ 2 chiều.
- Cần bật DynamoDB Streams.

### e. TTL (Time to Live)

- Tự động xóa items sau một thời gian (dựa trên timestamp).
- Miến phí xóa. Dùng cho session data, logs.

## 5. Consistency Models

- **Eventually Consistent Reads (Mặc định)**: Dữ liệu có thể cũ (vài giây) sau khi ghi. Tiết kiệm 1/2 RCU.
- **Strongly Consistent Reads**: Đảm bảo đọc thấy dữ liệu mới nhất. Tốn gấp đôi RCU.

## 6. Exam Tips (Lưu ý thi SAA)

- Nếu đề bài yêu cầu DB **NoSQL**, **Key-Value**, hiệu năng cao **milisecond** -> Chọn **DynamoDB**.
- Nếu cần giảm độ trễ xuống **microsecond** -> Chọn **DAX**.
- Nếu cần **Disaster Recovery** đa vùng (Multi-Region) hoặc user toàn cầu truy cập local -> Chọn **Global Tables**.
- Nếu traffic **không đoán trước được** -> Chọn **On-Demand Mode**.
- Nếu muốn chạy logic khi **data thay đổi** -> Chọn **DynamoDB Streams + Lambda**.
- Nếu muốn query linh hoạt ngoài Primary Key -> Tạo **GSI**.
- Lưu trữ Session state của Web App -> **DynamoDB** (hoặc ElastiCache). Dùng TTL để tự xóa session.
