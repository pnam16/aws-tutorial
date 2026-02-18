# Amazon Athena

## 1. Tổng quan (Overview)

Amazon Athena là dịch vụ truy vấn tương tác giúp dễ dàng phân tích dữ liệu trực tiếp trong Amazon S3 bằng ngôn ngữ SQL chuẩn. Athena là dịch vụ không máy chủ (serverless), bạn không cần quản lý bất kỳ hạ tầng nào và chỉ phải trả tiền cho khối lượng dữ liệu được quét bởi mỗi truy vấn.

- **Serverless**: Không cần thiết lập hay quản lý hạ tầng hạ tầng (ETL).
- **Standard SQL**: Sử dụng SQL tiêu chuẩn (dựa trên Presto) để truy vấn.
- **Data Lake**: Truy vấn trực tiếp dữ liệu trên S3 mà không cần load vào database.
- **Pay-per-query**: Chỉ tính phí dựa trên lượng dữ liệu quét (scanned).

## 2. Các tính năng chính (Key Features)

### a. Truy vấn trực tiếp trên S3 (Query Data in S3)

- Athena có thể đọc dữ liệu trực tiếp từ S3 ở nhiều định dạng: CSV, JSON, ORC, Avro, Parquet.
- Không cần quy trình ETL phức tạp để di chuyển dữ liệu vào kho dữ liệu.

### b. Data Catalog & Glue Integration

- Athena sử dụng **AWS Glue Data Catalog** để lưu trữ thông tin về cơ sở dữ liệu, bảng (metadata) và schema.
- Khi bạn tạo bảng trong Athena, nó thực chất đang tạo metadata trong Glue Data Catalog trỏ tới dữ liệu gốc trên S3.

### c. Federated Query (Truy vấn liên kết)

- Cho phép chạy SQL truy vấn dữ liệu từ các nguồn khác ngoài S3 như: DynamoDB, RDS, Redshift, hoặc on-premises databases.
- Sử dụng **Athena Data Source Connectors** (chạy trên Lambda) để kết nối.

### d. Workgroups

- Tách biệt người dùng, team, hoặc ứng dụng để quản lý tài nguyên và chi phí.
- Có thể đặt giới hạn (quota) lượng dữ liệu quét cho từng workgroup để kiểm soát chi phí.

## 3. Cơ chế hoạt động (How It Works)

1.  **Lưu trữ**: Dữ liệu nằm trên **Amazon S3**.
2.  **Schema**: Định nghĩa cấu trúc bảng (Table Schema) trong Athena (được lưu trong Glue Data Catalog).
3.  **Truy vấn**: Người dùng viết câu lệnh SQL trong Athena Console hoặc qua JDBC/ODBC driver.
4.  **Xử lý**: Athena (dùng engine Presto) phân tán truy vấn, quét dữ liệu trên S3, và trả về kết quả.
5.  **Kết quả**: Kết quả truy vấn được hiển thị và cũng được lưu tự động vào một S3 bucket khác.

## 4. Performance Optimization (Tối ưu hóa hiệu năng & chi phí)

Vì Athena tính tiền theo lượng dữ liệu quét, việc tối ưu hóa là cực kỳ quan trọng:

1.  **Columnar Formats**: Sử dụng định dạng cột như **Parquet** hoặc **ORC**.
    - Ví dụ: File CSV 1GB -> Convert sang Parquet còn 200MB. Athena chỉ cần đọc cột cần thiết -> Tiết kiệm 90% chi phí và nhanh hơn.

2.  **Partitioning (Phân vùng)**:
    - Chia dữ liệu trên S3 theo thư mục (ví dụ: `s3://bucket/data/year=2023/month=10/`).
    - Khi truy vấn `WHERE year=2023`, Athena chỉ quét folder đó, bỏ qua các folder khác.

3.  **Compression**:
    - Nén dữ liệu (ví dụ: Snappy, Gzip) để giảm dung lượng cần đọc.

## 5. Use Cases (Trường hợp sử dụng)

1.  **Ad-hoc Analysis**:
    - Phân tích nhanh logs (CloudTrail logs, VPC Flow Logs, ELB logs) lưu trên S3 để debug hoặc audit.
    - Không cần setup server, có kết quả ngay.

2.  **Data Lake Analytics**:
    - Xây dựng báo cáo Business Intelligence (BI) trên dữ liệu hồ dữ liệu (Data Lake) với Amazon QuickSight kết nối trực tiếp với Athena.

3.  **Serverless ETL**:
    - Dùng câu lệnh `CREATE TABLE AS SELECT` (CTAS) để biến đổi dữ liệu từ định dạng này sang định dạng khác hoặc tổng hợp dữ liệu, lưu kết quả về S3.

## 6. Security & Compliance

- **IAM**: Kiểm soát quyền ai được chạy truy vấn và ai được truy cập S3 bucket nào.
- **Mã hóa**: Hỗ trợ SSE-S3, SSE-KMS, CSE-KMS cho dữ liệu trên S3 và kết quả truy vấn.
- **Fine-Grained Access Control**: Tích hợp với AWS Lake Formation để kiểm soát quyền truy cập ở cấp độ dòng (row) và cột (column).

## 7. Pricing (Định giá)

- **$5.00 cho mỗi Terabyte (TB)** dữ liệu được quét.
- Không tốn phí compute (EC2), không tốn phí idle.
- Lưu ý: DDL statements (CREATE/DROP TABLE) và Failed queries là miễn phí.
- _Mẹo_: Nén và chia cột dữ liệu để giảm chi phí đáng kể.

## 8. Exam Tips (Lưu ý thi SAA)

- Nếu đề bài yêu cầu **truy vấn/phân tích dữ liệu trực tiếp trên S3** bằng **SQL tiêu chuẩn** -> Chọn **Athena**.
- Nếu đề bài nhắc đến **"serverless SQL"** hoặc **"ad-hoc query"** trên S3 -> Chọn **Athena**.
- Nếu muốn **giảm chi phí** Athena: Chọn đáp án sừ dụng **Columnar format (Parquet/ORC)** và **Compressions**.
- Nếu muốn phân tích **logs (VPC Flow Logs, CloudTrail)** nhanh chóng mà không cần ETL -> Chọn **Athena**.
- Kết hợp: **QuickSight** thường dùng Athena làm nguồn dữ liệu để vẽ biểu đồ từ S3.
- Phân biệt với **Redshift Spectrum**: Redshift Spectrum cũng query S3, nhưng cần có Redshift cluster đang chạy. Athena thì hoàn toàn serverless.
