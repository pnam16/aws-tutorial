# Amazon CloudWatch

## 1. Tổng quan (Overview)

Amazon CloudWatch là dịch vụ giám sát (Monitoring) và quan sát (Observability) được xây dựng cho các kỹ sư DevOps, nhà phát triển, kỹ sư độ tin cậy của trang web (SRE) và quản lý CNTT.

- **Mục đích**: Thu thập dữ liệu giám sát và vận hành dưới dạng nhật ký (logs), số liệu (metrics) và sự kiện (events).
- **Phạm vi**: Giám sát tài nguyên AWS (EC2, RDS, DynamoDB...) và ứng dụng on-premise.

## 2. Các thành phần chính (Key Components)

### a. CloudWatch Metrics

- **Metric**: Một biến số đo lường hiệu năng (ví dụ: `CPUUtility`, `DiskReadOps`).
- **Namespace**: Container chứa metrics (ví dụ: `AWS/EC2`).
- **Dimensions**: Thuộc tính để lọc metrics (ví dụ: `InstanceId`, `AutoScalingGroupName`).
- **Resolution**:
  - _Standard_: 1 phút (Mặc định).
  - _High Resolution_: 1 giây (Cần bật Custom Metric, tốn thêm tiền).

### b. CloudWatch Logs

- Thu thập và lưu trữ log files từ EC2 instances (qua CloudWatch Agent), CloudTrail, Route53, v.v.
- **Log Group**: Nhóm các log streams (thường là 1 app hoặc 1 service).
- **Log Stream**: Chuỗi log events từ 1 source cụ thể (ví dụ: 1 instance).
- **Metric Filters**: Tạo metric từ log (ví dụ: Đếm số lần xuất hiện chữ "Error" trong log).

### c. CloudWatch Alarms

- Theo dõi Metric và gửi thông báo khi ngưỡng (threshold) bị vi phạm.
- **Actions**:
  - Gửi tin nhắn SNS (Email/SMS).
  - Auto Scaling (Scale out/in).
  - EC2 Action (Recover, Stop, Terminate, Reboot).

### d. CloudWatch Dashboards

- Tạo bảng điều khiển trực quan (biểu đồ) để theo dõi tổng quan hệ thống.
- Có thể chia sẻ dashboard cho người không có tài khoản AWS.

## 3. CloudWatch Agent

- Mặc định, EC2 chỉ đẩy các metric cơ bản về Host (CPU, Network, Disk IO).
- Nó **KHÔNG** biết về Memory (RAM) và Disk Used Space (ổ cứng còn bao nhiêu).
- Cần cài **CloudWatch Agent** để đẩy **RAM usage**, **Disk usage**, và **Logs** lên CloudWatch.

## 4. CloudWatch Synthetics (Canaries)

- Tạo các đoạn script nhỏ (Node.js/Python) để chạy mô phỏng hành vi người dùng (ví dụ: load trang chủ, login, click nút Checkout).
- Chạy định kỳ (mỗi phút) để kiểm tra uptime và latency của ứng dụng web/API.

## 5. Exam Tips (Lưu ý thi SAA)

- Nếu đề bài yêu cầu **giám sát hiệu năng RAM (Memory Utilization)** của EC2 -> Chọn cài **CloudWatch Agent** (Custom Metric).
- Nếu muốn nhận **cảnh báo (Alert/Notification)** khi CPU cao -> Chọn **CloudWatch Alarm** + **SNS**.
- Nếu muốn **tự động phục hồi (Recover)** EC2 instance khi phần cứng lỗi -> Chọn **CloudWatch Alarm** + **EC2 Recover Action**.
- Nếu muốn **tập trung log** từ nhiều server về một chỗ -> Chọn **CloudWatch Logs**.
- Nếu muốn giám sát **uptime website** và luồng UI -> Chọn **CloudWatch Synthetics**.
- Nếu muốn tìm kiếm/phân tích log với query phức tạp -> Dùng **CloudWatch Logs Insights** (hoặc stream sang OpenSearch).
