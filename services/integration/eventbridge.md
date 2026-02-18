# Amazon EventBridge (CloudWatch Events)

## 1. Tổng quan (Overview)

Amazon EventBridge là dịch vụ bus sự kiện không máy chủ (serverless event bus). Bạn có thể dễ dàng xây dựng các ứng dụng hướng sự kiện (event-driven architectures) trên quy mô lớn.

- **Event Bus**: Trung tâm tiếp nhận và phân phối các sự kiện.
- **Schema Registry**: Tự động phát hiện và quản lý schema của sự kiện (JSON structure).
- **Third-party Integration**: Nhận sự kiện trực tiếp từ các đối tác SaaS (Zendesk, Datadog, Shopify).

## 2. Các thành phần chính (Key Concepts)

### a. Event Sources (Nguồn sự kiện)

- **AWS Services**: Ví dụ: EC2 instance thay đổi trạng thái, S3 object upload, CodeBuild build success.
- **Custom Applications**: Ứng dụng của bạn gửi JSON event (qua SDK `PutEvents`).
- **SaaS Apps**: Auth0, Salesforce... gửi sự kiện vào Event Bus của bạn.

### b. Rules (Quy tắc)

- Quy tắc lọc sự kiện đến và định tuyến chúng đến các mục tiêu.
- **Event Pattern**: Lọc dựa trên nội dung JSON (ví dụ: `source: ["aws.ec2"]`, `detail-type: ["EC2 Instance State-change Notification"]`).
- **Scheduled (Cron)**: Chạy định kỳ (ví dụ: mỗi 5 phút, hay 8:00 AM mỗi ngày).

### c. Targets (Mục tiêu)

- Nơi sự kiện được gửi đến: Lambda, SNS, SQS, Kinesis, ECS Task, Step Functions, CodePipeline...
- Có thể biến đổi sự kiện (Input Transformer) trước khi gửi đến Target.

## 3. Event Bus Types

1.  **Default Event Bus**: Nhận sự kiện từ các dịch vụ AWS.
2.  **Custom Event Bus**: Nhận sự kiện từ ứng dụng tùy chỉnh của bạn.
3.  **Partner Event Bus**: Nhận sự kiện từ các đối tác SaaS tích hợp.

## 4. Archive & Replay

- **Archive**: Lưu trữ tất cả (hoặc một phần) sự kiện đi qua Bus vào một kho lưu trữ lâu dài.
- **Replay**: Phát lại các sự kiện đã lưu trữ vào Bus để debug, test lại bug, hoặc khôi phục dữ liệu sau sự cố.

## 5. Exam Tips (Lưu ý thi SAA)

- Nếu đề bài yêu cầu **xử lý sự kiện từ SaaS** (Salesforce, Zendesk...) mà không cần viết code integration phức tạp -> Chọn **EventBridge**.
- Nếu muốn **lọc sự kiện (content filtering)** dựa trên nội dung JSON chi tiết -> Chọn **EventBridge**. (SNS filter đơn giản hơn nhiều).
- Nếu muốn **lên lịch (Cron)** chạy Lambda/ECS Task -> Chọn **EventBridge Scheduler / Rules**.
- Nếu muốn **Decoupling** hệ thống bằng kiến trúc Event-Driven -> EventBridge là lựa chọn hàng đầu (Enterprise Service Bus).
- Phân biệt **EventBridge vs SNS**:
  - **SNS**: Fan-out, High throughput, Push notifications (Email/SMS). Ít tính năng lọc nội dung.
  - **EventBridge**: Routing phức tạp, SaaS integrations, Schema Registry. Throughput thấp hơn SNS một chút nhưng linh hoạt hơn.
