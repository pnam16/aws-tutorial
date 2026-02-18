# AWS Lambda

## 1. Tổng quan (Overview)

AWS Lambda là dịch vụ tính toán không máy chủ (serverless) cho phép bạn chạy mã (code) mà không cần cung cấp hay quản lý máy chủ. Bạn chỉ trả tiền cho thời gian tính toán mã của bạn chạy (tính bằng mili giây).

- **Event-driven**: Chạy code để phản hồi các sự kiện (upload file S3, record mới DynamoDB, HTTP request API Gateway).
- **Stateless**: Không lưu trạng thái giữa các lần chạy.
- **Short-lived**: Giới hạn thời gian chạy tối đa 15 phút.

## 2. Các tính năng chính (Key Features)

### a. Trình kích hoạt (Triggers)

Lambda được kích hoạt bởi nhiều dịch vụ AWS:

- **S3**: Khi có object mới (Image processing).
- **DynamoDB/Kinesis**: Khi có stream record mới (Data processing).
- **API Gateway/ALB**: Khi có HTTP request (Backend API).
- **EventBridge (CloudWatch Events)**: Chạy định kỳ (Cron job) hoặc phản ứng với sự thay đổi trạng thái hệ thống.
- **SNS/SQS**: Xử lý message/queue.

### b. Lambda Layers

- Cách để chia sẻ thư viện (libraries), dependencies, hoặc custom runtime giữa nhiều hàm Lambda.
- Giúp giảm kích thước gói deployment của từng hàm.

### c. Lambda Versions & Aliases

- **Versions**: Mỗi khi publish, code được snapshot thành version (1, 2, 3...). Version là immutable (không đổi).
- **Aliases**: Con trỏ trỏ tới một version cụ thể (ví dụ: `PROD` -> `v1`, `DEV` -> `$LATEST`).
- Giúp deploy an toàn (Blue/Green) bằng cách chuyển traffic dần dần giữa các version qua Alias.

### d. VPC Connectivity

- Mặc định Lambda chạy trong VPC của AWS (có internet access).
- Có thể cấu hình chạy trong **VPC của bạn** để truy cập tài nguyên private (RDS, ElastiCache).
- _Lưu ý_: Khi chạy trong VPC, Lambda cần **NAT Gateway** để truy cập Internet công cộng.

## 3. Cơ chế hoạt động (Execution Model)

1.  **Cold Start**: Lần đầu chạy, AWS cần tải code, khởi động container runtime. Tốn thời gian (latency).
2.  **Warm Start**: Các lần gọi tiếp theo dùng lại container đã sẵn sàng -> Rất nhanh.
3.  **Concurrency (Đồng thời)**:
    - Nếu có 100 requests cùng lúc, AWS bật 100 Lambda instances.
    - **Reserved Concurrency**: Đảm bảo luôn có số lượng instance dành riêng cho hàm này (tránh bị hàm khác chiếm hết quota).
    - **Provisioned Concurrency**: Giữ instance luôn "ấm" (warm) để loại bỏ Cold Start.

## 4. Pricing (Định giá)

- **Requests**: Số lượng requests ($0.20/triệu requests).
- **Duration**: Thời gian chạy \* Dung lượng RAM cấp phát (tính theo GB-seconds).
  - Cấp nhiều RAM -> CPU/Network cũng tăng theo -> Chạy nhanh hơn -> Có thể rẻ hơn nếu thời gian giảm đáng kể.

## 5. Use Cases (Trường hợp sử dụng)

1.  **File Processing**:
    - User upload ảnh -> S3 trigger Lambda -> Lambda tạo thumbnail, resize -> Lưu lại S3.

2.  **Serverless API Mainframe**:
    - API Gateway -> Lambda -> DynamoDB/RDS Proxy.

3.  **Real-time Stream Processing**:
    - Kinesis/DynamoDB Streams -> Lambda -> Firehose/S3.

4.  **Cron Jobs**:
    - EventBridge (Schedule) -> Lambda (Clean up resources, Generate reports) mỗi đêm.

## 6. Exam Tips (Lưu ý thi SAA)

- Nếu đề bài yêu cầu **xử lý sự kiện S3, DynamoDB, Kinesis** mà không muốn quản lý server -> Chọn **Lambda**.
- Nếu thời gian xử lý **ngắn (< 15 phút)** -> Lambda là phù hợp. Nếu **dài (> 15 phút)** -> Chọn **AWS Batch** hoặc **ECS/Fargate**.
- Để truy cập **RDS trong private subnet** -> Cấu hình Lambda trong VPC.
- Để giảm **Cold Start** latency cho ứng dụng nhạy cảm -> Dùng **Provisioned Concurrency**.
- Lambda quá tải kết nối đến RDS -> Sử dụng **RDS Proxy** để gom kết nối (connection pooling).
- Chi phí Lambda phụ thuộc vào **RAM**. Cần nhiều CPU hơn -> Tăng cấu hình RAM.
