# Amazon QuickSight

## 1. Tổng quan (Overview)

Amazon QuickSight là dịch vụ Business Intelligence (BI) không máy chủ (serverless), hoạt động trên nền tảng đám mây, giúp bạn tạo và xuất bản các bảng điều khiển (dashboards) tương tác bao gồm thông tin chuyên sâu về máy học (ML Insights).

- **Serverless**: Tự động mở rộng đén hàng chục nghìn người dùng mà không cần quản lý hạ tầng.
- **SPICE**: Engine tính toán trong bộ nhớ siêu nhanh.
- **Embeddable**: Có thể nhúng dashboard vào ứng dụng web của bạn.

## 2. Các tính năng chính (Key Features)

### a. SPICE Engine

- **S**uper-fast, **P**arallel, **I**n-memory **C**alculation **E**ngine.
- QuickSight sao chép dữ liệu từ nguồn vào SPICE để truy vấn cực nhanh (in-memory).
- Mỗi user được cấp một lượng dung lượng SPICE nhất định (ví dụ 10GB).

### b. ML Insights (Thông tin chi tiết máy học)

- **Auto-narratives**: Tự động tạo mô tả bằng văn bản về dữ liệu (ví dụ: "Doanh số tăng 20% so với tháng trước").
- **Anomaly Detection**: Phát hiện sự bất thường trong dữ liệu thời gian thực.
- **Forecasting**: Dự báo xu hướng tương lai (ví dụ: dự báo doanh số tháng sau) chỉ bằng cú click chuột.

### c. Q (Natural Language Query)

- Cho phép người dùng đặt câu hỏi bằng ngôn ngữ tự nhiên (Tiếng Anh) để nhận câu trả lời dưới dạng biểu đồ.
- _Ví dụ_: "Show me total sales by region in 2023" -> QuickSight tự vẽ biểu đồ cột.

### d. Data Sources

- Hỗ trợ kết nối tời: RDS, Aurora, Redshift, Athena, S3, OpenSearch.
- SaaS: Salesforce, Jira, GitHub.
- On-premises databases (qua file upload hoặc VPC connection).

## 3. Cơ chế hoạt động (How It Works)

1.  **Connect**: Kết nối tới nguồn dữ liệu (ví dụ: Athena query S3, hoặc Redshift).
2.  **Analyze**: Tạo "Analysis" - môi trường làm việc để vẽ biểu đồ, thêm filter, tính toán field mới.
3.  **Publish**: Xuất bản Analysis thành "Dashboard" (chế độ chỉ xem).
4.  **Share**: Chia sẻ Dashboard cho người dùng trong tổ chức hoặc nhúng vào web.

## 4. Workflows phổ biến

- **Data Lake BI**: S3 (Raw Data) -> Glue (ETL) -> Athena (SQL) -> QuickSight (Visualization).
- **Data Warehouse BI**: App -> RDS -> DMS -> Redshift -> QuickSight.

## 5. Security & Pricing

### Security

- **Row-Level Security (RLS)**: Kiểm soát ai nhìn thấy dòng dữ liệu nào. Ví dụ: Manager khu vực A chỉ thấy dữ liệu của khu vực A.
- **Private VPC Access**: Kết nối tới database trong VPC private subnet mà không cần public internet.

### Pricing

- **Authors**: Người tạo dashboard (trả phí tháng ~$24/user).
- **Readers**: Người xem dashboard (trả phí theo session dùng, tối đa $5/tháng - Pay-per-session). Đây là mô hình rất rẻ cho số lượng user lớn.

## 6. Exam Tips (Lưu ý thi SAA)

- Nếu đề bài yêu cầu **dịch vụ BI (Business Intelligence)**, vẽ biểu đồ, visualization -> Chọn **QuickSight**.
- Nếu đề bài nhắc đến **Machine Learning insights** (dự báo, phát hiện bất thường) trong báo cáo mà không cần team ML -> Chọn **QuickSight ML Insights**.
- Nếu cần **tích hợp dashboard vào ứng dụng** web của công ty -> Chọn **QuickSight Embedded**.
- Nếu muốn **trả phí theo phiên sử dụng (pay-per-session)** -> QuickSight là lựa chọn tối ưu chi phí cho Reader.
- Nếu cần giới hạn dữ liệu hiển thị cho từng user (**Row-Level Security**) -> Chọn **QuickSight**.
