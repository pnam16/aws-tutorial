# Amazon Redshift

## 1. Tổng quan (Overview)

Amazon Redshift là dịch vụ kho dữ liệu (Data Warehouse) đám mây quy mô petabyte, nhanh và được quản lý hoàn toàn. Nó được thiết kế để phân tích dữ liệu (OLAP - Online Analytical Processing) bằng SQL tiêu chuẩn và các công cụ Business Intelligence (BI).

- **Columnar Storage**: Lưu trữ theo cột (thay vì hàng như RDS), tối ưu cực tốt cho việc tổng hợp dữ liệu (SUM, AVG) trên lượng lớn record.
- **MPP (Massively Parallel Processing)**: Xử lý song song dữ liệu trên nhiều nodes.

## 2. Kiến trúc Cluster (Cluster Architecture)

1.  **Leader Node**:
    - Nhận query (SELECT) từ ứng dụng/BI tool.
    - Phân tích, tối ưu hóa query (Query Plan).
    - Gửi các đoạn code C++ đã biên dịch xuống các Compute Node.

2.  **Compute Nodes**:
    - Thực thi câu lệnh query thực tế.
    - Lưu trữ dữ liệu cục bộ.
    - Gửi kết quả ngược lại cho Leader Node để tổng hợp.

## 3. Các tính năng chính (Key Features)

### a. Redshift Spectrum

- Cho phép query trực tiếp dữ liệu trên **Amazon S3** mà không cần load vào Redshift cluster.
- Dùng để mở rộng kho dữ liệu ra Data Lake (S3) với chi phí rẻ.
- _Ví dụ_: Join bảng "Sales 2023" (trong Redshift) với bảng "Sales 2010-2022" (trên S3).

### b. Resize Cluster

- **Elastic Resize**: Thêm/bớt node nhanh chóng (vài phút), downtime ngắn.
- **Classic Resize**: Copy dữ liệu sang cluster mới (vài giờ), tốt hơn nếu thay đổi instance type.

### c. Backup & Disaster Recovery

- Tự động sao lưu snapshot sang S3.
- **Cross-Region Snapshot Copy**: Tự động copy snapshot sang Region khác để DR.

### d. Workload Management (WLM)

- Ưu tiên query quan trọng (Short query) chạy trước query dài (Long query).
- Tạo các hàng đợi (queue) với mức độ ưu tiên khác nhau cho các nhóm user.

## 4. Performance Tuning (Tối ưu hiệu năng)

1.  **Distribution Styles**: Cách phân chia dữ liệu ra các node.
    - **AUTO**: Redshift tự chọn.
    - **EVEN**: Chia đều (Round-robin). Tốt khi không join.
    - **KEY**: Chia theo giá trị cột (Hash). Tốt khi join bảng lớn theo cột đó (Colocation).
    - **ALL**: Copy toàn bộ bảng nhỏ sang tất cả node. Tốt cho bảng dimension nhỏ.
2.  **Sort Keys**:
    - Sắp xếp dữ liệu trên ổ đĩa. Giống Index.
    - Giúp Redshift bỏ qua (skip) các block dữ liệu không cần thiết khi query (Zone Maps).

## 5. Exam Tips (Lưu ý thi SAA)

- Nếu đề bài yêu cầu **Data Warehouse**, phân tích **OLAP**, SQL queries phức tạp trên **Petabyte data** -> Chọn **Redshift**.
- Nếu muốn query **S3 trực tiếp** kết hợp với data trong kho -> Chọn **Redshift Spectrum**. (Nếu chỉ S3 không thì chọn Athena).
- Nếu muốn **High Availability** -> Bật **Multi-AZ** (mới hỗ trợ cho RA3 instances).
- Redshift **KHÔNG** dành cho **OLTP** (giao dịch nhanh, nhiều insert nhỏ). Dùng RDS/Aurora cho OLTP.
- Để **load dữ liệu** nhanh nhất từ S3 -> Dùng lệnh `COPY` (tận dụng parallel load) thay vì `INSERT` từng dòng.
- Để **visualize** dữ liệu Redshift -> Dùng **QuickSight**.
