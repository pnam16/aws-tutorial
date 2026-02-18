# AWS Systems Manager (SSM)

## 1. Tổng quan (Overview)

AWS Systems Manager (SSM) là một công cụ quản lý thống nhất (unified interface) để người dùng xem dữ liệu vận hành từ nhiều dịch vụ AWS và tự động hóa các tác vụ quản lý trên các tài nguyên AWS (EC2, RDS, S3,...).

- **Mục đích**: Patching, Configuration Management, Parameter Store, Session Manager.
- **SSM Agent**: Cài đặt trên EC2 instance để SSM quản lý (Mặc định cài sẵn trên Amazon Linux 2 AMI).

## 2. Các tính năng chính (Key Capabilities)

### a. Run Command

- Thực thi lệnh từ xa (Remote Command execution) trên hàng loạt EC2 instances cùng lúc.
- Không cần mở port 22 (SSH) hay 3389 (RDP).
- _Ví dụ_: Cập nhật `yum update -y` trên 100 web servers.

### b. Session Manager

- Đăng nhập vào EC2 instance qua trình duyệt (Browser-based shell) hoặc CLI.
- **Không cần Bastion Host / JHump Box**.
- **Không cần mở port 22**. Chỉ cần SSM Agent kết nối HTTPS (port 443) tới SSM endpoint.
- Ghi lại toàn bộ session (video record) vào S3/CloudWatch Logs để audit.

### c. Parameter Store

- Lưu trữ tập trung các tham số cấu hình (DB Connection String, Password, License Key).
- **Secure String**: Mã hóa bằng KMS.
- **Hierarchy**: Quản lý theo đường dẫn (ví dụ: `/prod/db/userId`, `/dev/db/userId`).
- _Use Case_: Thay vì hardcode pass trong code, lambda gọi SSM Parameter Store để lấy pass lúc runtime.

### d. Patch Manager

- Tự động vá lỗi (Apply patches) cho OS (Windows/Linux).
- **Maintenance Windows**: Lên lịch vá vào giờ thấp điểm.
- **Patch Baseline**: Định nghĩa bản vá nào được phép cài (ví dụ: Critical only, release > 7 days).

### e. Automation

- Tự động hóa các quy trình vận hành phức tạp (Runbook).
- _Ví dụ_: Tự động tạo AMI backup, resize instance, tắt instance không dùng.

## 3. Systems Manager vs OpsWorks vs Beanstalk

| Đặc điểm     | Systems Manager                        | Chef/Puppet (OpsWorks)                             | Elastic Beanstalk  |
| :----------- | :------------------------------------- | :------------------------------------------------- | :----------------- |
| **Mục đích** | Operational tasks (Patching, Command). | Configuration Management (Infrastructure as Code). | Deploy App (PaaS). |
| **Agent**    | SSM Agent (nhẹ).                       | Chef/Puppet Agent (nặng).                          | Beanstalk Agent.   |
| **Scale**    | Global scale (hàng nghìn instances).   | Cluster scale.                                     | Application scale. |

## 4. Exam Tips (Lưu ý thi SAA)

- Nếu đề bài yêu cầu **quản lý cấu hình**, **vá lỗi (patching)** hàng loạt EC2 -> Chọn **Systems Manager**.
- Nếu muốn **SSH vào EC2 mà không mở port 22**, không dùng Bastion Host -> Chọn **Session Manager**.
- Nếu muốn lưu trữ **biến môi trường, password** an toàn và reuse cho nhiều Lambda/EC2 -> Chọn **Parameter Store**.
- Nếu muốn **tự động hóa** quy trình (ví dụ: Restart instance khi CPU cao) -> Dùng **SSM Automation** (kết hợp CloudWatch Alarm).
- SSM cũng quản lý được cả **On-premise servers** (Hybrid environment) nếu cài SSM Agent và có Activation Code.
