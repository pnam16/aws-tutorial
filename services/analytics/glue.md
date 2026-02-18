# AWS Glue

## 1. Tổng quan (Overview)

AWS Glue là một dịch vụ tích hợp dữ liệu (Data Integration) không máy chủ (serverless), giúp dễ dàng khám phá, chuẩn bị và kết hợp dữ liệu cho phân tích, học máy và phát triển ứng dụng. Chức năng chính được biết đến nhiều nhất là **Extract, Transform, Load (ETL)**.

- **Serverless**: Không cần quản lý hạ tầng.
- **Data Catalog**: Kho lưu trữ metadata trung tâm.
- **ETL Jobs**: Chạy mã Python/Scala để biến đổi dữ liệu.

## 2. Các tính năng chính (Key Features)

### a. AWS Glue Data Catalog

- Là một kho lưu trữ metadata trung tâm (Hive Metastore compatible).
- Lưu trữ định nghĩa bảng (table definitions), schema, và vị trí dữ liệu.
- Được sử dụng bởi **Athena**, **Redshift Spectrum**, và **EMR** để hiểu cấu trúc dữ liệu trên S3.

### b. Glue Crawlers

- Chương trình tự động quét dữ liệu trên S3, RDS, DynamoDB... để suy ra schema (cấu trúc cột, kiểu dữ liệu).
- Tự động tạo hoặc cập nhật bảng trong Glue Data Catalog.
- _Ví dụ_: Bạn thả file CSV mới vào S3 -> Chạy Crawler -> Catalog tự cập nhật thêm partition mới.

### c. Glue ETL Jobs

- Tao tác vụ trích xuất, biến đổi và tải dữ liệu (ETL).
- Tự động tạo code (Python/Scala) dựa trên Spark.
- Hỗ trợ:
  - **Spark Jobs**: Xử lý dữ liệu lớn phân tán.
  - **Python Shell Jobs**: Xử lý nhẹ nhàng, rẻ hơn.
  - **Gue Studio**: Giao diện trực quan để thiết kế luồng ETL (No-code/Low-code).

### d. Glue DataBrew

- Công cụ chuẩn bị dữ liệu trực quan (Visual Data Prep) dành cho Data Analyst / Data Scientist.
- Làm sạch và chuẩn hóa dữ liệu mà không cần viết code (ví dụ: xóa null, format date, one-hot encoding).

## 3. Cơ chế hoạt động (How It Works)

1.  **Discover**: Chạy **Crawler** để quét S3 và tạo Metadata trong **Data Catalog**.
2.  **Develop**: Viết script ETL hoặc dùng Glue Studio để kéo thả.
3.  **Execute**: Chạy Glue Job (Serverless Spark cluster được bật lên, chạy xong tự tắt).
4.  **Load**: Ghi dữ liệu đã làm sạch vào đích đến (S3, Redshift, RDS).

## 4. Use Cases (Trường hợp sử dụng)

1.  **Data Lake ETL**:
    - Raw data (JSON/CSV) trên S3 -> Glue Job (Convert to Parquet, Partitioning) -> Processed data trên S3 -> Athena query.

2.  **Data Warehouse Loading**:
    - Dữ liệu từ nhiều nguồn -> Glue ETL -> Redshift.

3.  **Schema Registry**:
    - Quản lý sự thay đổi của schema luồng dữ liệu streaming (kết hợp với Kinesis).

## 5. Pricing (Định giá)

- **ETL Jobs and Crawlers**: Tính theo DPU-hour (Data Processing Unit). Chi trả cho tài nguyên compute sử dụng (tối thiểu 1 phút).
- **Data Catalog**: 1 triệu objects đầu tiên miễn phí lưu trữ, tính phí request truy cập.

## 6. Exam Tips (Lưu ý thi SAA)

- Nếu đề bài hỏi về **tự động phát hiện schema** (schema discovery) từ S3 -> Chọn **Glue Crawler**.
- Nếu cần **Serverless ETL** để biến đổi dữ liệu -> Chọn **AWS Glue**.
- Nếu cần **chuyển đổi định dạng** (JSON sang Parquet) cho Athena -> Chọn **AWS Glue ETL**.
- Nếu đề bài nhắc đến **Data Catalog** dùng chung cho Athena/Redshift Spectrum -> Chọn **AWS Glue Data Catalog**.
- Phân biệt Glue vs EMR:
  - **Glue**: Serverless, ETL đơn giản, metadata management.
  - **EMR**: Quản lý cluster Hadoop/Spark tùy chỉnh sâu, khối lượng công việc cực lớn (Big Data processing), chạy 24/7.
