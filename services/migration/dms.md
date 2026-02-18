# AWS Database Migration Service (DMS)

## 1. Tổng quan (Overview)

AWS DMS là dịch vụ giúp bạn di chuyển cơ sở dữ liệu (Database) sang AWS một cách dễ dàng và an toàn.

- **Zero Downtime (Gần như không downtime)**: Database nguồn (Source) vẫn hoạt động bình thường trong quá trình di chuyển.
- **Supports**: Cả di chuyển đồng nhất (Homogeneous) và không đồng nhất (Heterogeneous).

## 2. Các loại di chuyển (Migration Types)

### a. Homogeneous Migration (Đồng nhất)

- Di chuyển giữa 2 database cùng loại engine (ví dụ: Oracle -> Oracle trên EC2/RDS, MySQL -> Aurora MySQL).
- **Công cụ**: Native tools của engine đó (ví dụ: Oracle Data Pump, MySQL Dump) hoặc DMS.

### b. Heterogeneous Migration (Không đồng nhất)

- Di chuyển giữa 2 database khác loại engine (ví dụ: Oracle -> Aurora PostgreSQL, SQL Server -> MySQL).
- **Quy trình 2 bước**:
  1.  **Schema Conversion Tool (SCT)**: Chuyển đổi schema (bảng, view, store procedure) từ engine nguồn sang engine đích. (Chạy trên máy local của bạn, không phải dịch vụ AWS).
  2.  **DMS**: Di chuyển dữ liệu.

## 3. Các tính năng chính (Key Features)

### a. Replication Instance

- Máy chủ trung gian thực hiện việc di chuyển.
- Kết nối Source DB và Target DB.
- Cần chọn instance type phù hợp (Compute optimized cho việc convert data nặng, Memory optimized cho việc load nhanh).

### b. Task

- Định nghĩa việc di chuyển: Source Endpoint -> Target Endpoint.
- **Full Load**: Copy toàn bộ dữ liệu hiện có.
- **CDC (Change Data Capture)**: Sao chép các thay đổi (INSERT, UPDATE, DELETE) liên tục từ Source sang Target để giữ đồng bộ (Replication).

## 4. Exam Tips (Lưu ý thi SAA)

- Nếu đề bài yêu cầu **di chuyển Database** sang AWS với **downtime tối thiểu** -> Chọn **DMS**.
- Nếu engine nguồn và đích **khác nhau** (Heterogeneous) -> Chọn **SCT (Schema Conversion Tool)** để convert schema trước, sau đó dùng **DMS** để move data.
- Nếu muốn **replicating data liên tục** từ On-premise lên AWS để làm Analytics -> Chọn **DMS với CDC**.
- DMS không hỗ trợ convert **Stored Procedures** phức tạp một cách tự động hoàn toàn -> Cần SCT và có thể phải sửa tay một chút.
- DMS cần kết nối mạng tới cả Source và Target (qua VPN, Direct Connect hoặc Internet).
