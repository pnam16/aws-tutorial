# AWS CloudTrail

## 1. Tổng quan (Overview)

AWS CloudTrail là dịch vụ giúp quản trị, tuân thủ (compliance), kiểm tra hoạt động (operational auditing) và kiểm tra rủi ro (risk auditing) tài khoản AWS.

- **Mục đích**: Ghi lại lịch sử hoạt động (API calls) của tài khoản AWS.
- **Trả lời câu hỏi**: "Ai (Who) đã làm gì (What), khi nào (When), ở đâu (Where) và từ địa chỉ IP nào?".

## 2. Các loại sự kiện (Event Types)

### a. Management Events (Sự kiện quản lý)

- Ghi lại các thao tác trên **Control Plane** (cấu hình tài nguyên).
- _Ví dụ_: `CreateBucket`, `RunInstances`, `ModiySecurityGroup`.
- **Mặc định**: CloudTrail **luôn ghi lại** Management Events miễn phí (lưu 90 ngày).

### b. Data Events (Sự kiện dữ liệu)

- Ghi lại các thao tác trên **Data Plane** (dữ liệu bên trong tài nguyên).
- _Ví dụ_: `s3:GetObject` (tải file), `lambda:Invoke` (chạy hàm), `dynamodb:PutItem`.
- **Mặc định**: **Tắt** (Disabled) vì khối lượng quá lớn. Phải bật thủ công và trả phí.

### c. Insights Events

- Phát hiện các hoạt động bất thường (Anomaly detection).
- _Ví dụ_: Đột nhiên số lượng API call `TerminateInstances` tăng vọt so với mức bình thường.
- Giúp phát hiện lỗi vận hành hoặc tấn công.

## 3. Trails (Đường vết)

- Mặc định, bạn chỉ xem được lịch sử 90 ngày trong Event History.
- Để lưu lâu dài (vĩnh viễn), bạn cần tạo một **Trail**:
  - Lưu log vào **S3 Bucket**.
  - Tùy chọn gửi log vào **CloudWatch Logs** (để tạo metric filter/alarm).
  - Tùy chọn bật **Log File Validation** (đảm bảo tính toàn vẹn của log, không ai sửa xóa được).

## 4. Organization Trails

- Tạo Trail ở tài khoản Master (Management Account) và áp dụng cho tất cả tài khoản thành viên trong AWS Organization.
- Đảm bảo không tài khoản con nào có thể tắt logging.

## 5. Exam Tips (Lưu ý thi SAA)

- Nếu đề bài yêu cầu **Audit**, **Compliance**, **Tracking User Activity** -> Chọn **CloudTrail**.
- Nếu muốn biết **ai đã xóa EC2 instance** hoặc **S3 bucket** -> Xem **CloudTrail History**.
- Nếu muốn theo dõi ai truy cập vào file S3 cụ thể (`s3:GetObject`) -> Bật **Data Events** logging trong CloudTrail.
- Để đảm bảo **không ai sửa đổi log file** -> Bật **Log File Validation**.
- Để nhận thông báo tức thì khi có hành động nguy hiểm (ví dụ: xóa Security Group) -> CloudTrail -> CloudWatch Logs -> Metric Filter "DeleteSecurityGroup" -> CloudWatch Alarm -> SNS.
- Phân biệt **CloudWatch vs CloudTrail**:
  - **CloudWatch**: Giám sát **hiệu năng** (CPU, RAM) và Logs ứng dụng.
  - **CloudTrail**: Giám sát **API calls** (Who did what).
