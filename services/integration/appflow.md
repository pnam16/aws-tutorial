# Amazon AppFlow

## 1. Tổng quan (Overview)

Amazon AppFlow là dịch vụ tích hợp được quản lý hoàn toàn (fully managed integration service), giúp bạn truyền dữ liệu an toàn giữa các ứng dụng SaaS (Software-as-a-Service) và các dịch vụ AWS.

- **SaaS Sources**: Salesforce, ServiceNow, Zendesk, Slack, Marketo, Google Analytics...
- **AWS Destinations**: Amazon S3, Amazon Redshift, Snowflake, Amazon Lookout for Metrics.
- **No-code**: Giao diện trỏ và nhấp (point-and-click), không cần viết code integration.

## 2. Các tính năng chính (Key Features)

### a. Secure Data Transfer

- Dữ liệu được mã hóa khi truyền (in transit) và khi nghỉ (at rest).
- Hỗ trợ **AWS PrivateLink**: Cho phép truyền dữ liệu giữa AWS và SaaS app qua mạng riêng của AWS, không đi qua Internet công cộng (tăng bảo mật).

### b. Data Transformation & Filtering

- **Mapping**: Ánh xạ trường dữ liệu từ nguồn sang đích (ví dụ: `Account Name` -> `account_name`).
- **Filtering**: Chỉ lấy các bản ghi thỏa mãn điều kiện (ví dụ: chỉ lấy Opportunity đã đóng trong Salesforce).
- **Validation**: Kiểm tra dữ liệu hợp lệ trước khi truyền.

### c. Flow Triggers

- **On-demand**: Chạy ngay khi bạn bấm nút "Run flow".
- **Scheduled**: Chạy định kỳ (ví dụ: mỗi giờ).
- **Event-based**: Chạy khi có sự kiện thay đổi dữ liệu trong SaaS app (ví dụ: khi có Record mới tạo trong Salesforce).

## 3. Use Cases (Trường hợp sử dụng)

1.  **Salesforce Data Lake**:
    - Đồng bộ dữ liệu khách hàng (Opportunity, Account) từ Salesforce vào Amazon S3 (Data Lake) để phân tích bằng Athena hoặc Redshift.

2.  **SaaS Analytics**:
    - Lấy dữ liệu từ Google Analytics hoặc Marketo vào Redshift để chạy báo cáo marketing tổng hợp.

3.  **Customer Support Sentiment**:
    - Lấy ticket từ Zendesk -> S3 -> Trigger Lambda gọi Amazon Comprehend để phân tích cảm xúc khách hàng -> Ghi lại kết quả vào Zendesk.

## 4. Exam Tips (Lưu ý thi SAA)

- Nếu đề bài yêu cầu **tích hợp dữ liệu từ Salesforce, ServiceNow, Zendesk...** vào AWS (S3, Redshift) mà **không cần viết code** -> Chọn **Amazon AppFlow**.
- Nếu đề bài yêu cầu truyền dữ liệu **riêng tư (Private)** giữa SaaS và AWS -> Sử dụng **AppFlow tích hợp PrivateLink**.
- Phân biệt **AppFlow vs EventBridge**:
  - **AppFlow**: Chuyên về chuyển **dữ liệu lớn** (bulk data transfer), đồng bộ record.
  - **EventBridge**: Chuyên về xử lý **sự kiện** (real-time events), trigger workflow.
  - _Ví dụ_: AppFlow để copy 10,000 khách hàng cũ. EventBridge để báo tin khi có 1 khách hàng mới vừa đăng ký.
