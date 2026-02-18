# AWS Elastic Beanstalk

## 1. Tổng quan (Overview)

AWS Elastic Beanstalk là dịch vụ triển khai và điều phối (Orchestration) ứng dụng web. Đây là dịch vụ PaaS (Platform as a Service) giúp bạn tập trung vào viết code, trong khi AWS lo phần còn lại (hạ tầng, load balancing, scaling, monitoring).

- **Developer Focus**: Chỉ cần upload code (Zip file, WAR file) -> AWS tự động deploy.
- **Full Control**: Dù là PaaS, bạn vẫn có quyền truy cập vào các tài nguyên AWS bên dưới (EC2, S3, RDS) nếu cần.
- **No Charge**: Elastic Beanstalk là miễn phí. Bạn chỉ trả tiền cho các tài nguyên AWS nó tạo ra (EC2, ELB, RDS).

## 2. Các thành phần chính (Key Concepts)

### a. Application

- Container logic cho các phiên bản (Versions), môi trường (Environments) và cấu hình (Configuration Templates).

### b. Application Version

- Một bản build cụ thể của mã nguồn (ví dụ: `v1.0.zip`).
- Lưu trữ trong S3.

### c. Environment (Môi trường)

- Nơi ứng dụng thực sự chạy. Một Application có thể có nhiều Environments (Dev, Test, Prod).
- Hai loại môi trường chính:
  1.  **Web Server Environment**: Xử lý HTTP requests (Front-end, API). Gồm ELB + Auto Scaling Group.
  2.  **Worker Environment**: Xử lý background tasks (SQS queue processing). Gồm SQS + Auto Scaling Group (Daemon process).

### d. Platform (Nền tảng)

- Hỗ trợ đa ngôn ngữ: Java, .NET, PHP, Node.js, Python, Ruby, Go, Docker.
- AWS cung cấp các nền tảng được quản lý (Managed Platforms) với OS và runtime được patch tự động.

## 3. Deployment Policies (Chính sách triển khai)

Elastic Beanstalk cung cấp nhiều chiến lược deploy để giảm downtime:

1.  **All at Once**:
    - Deploy phiên bản mới lên tất cả instances cùng lúc.
    - **Downtime**: Yes (trong lúc restart app).
    - **Nhanh nhất**.

2.  **Rolling**:
    - Deploy từng nhóm (batch) instances (ví dụ: 2 instance một lần).
    - **Downtime**: No (nhưng giảm capacity).
    - Version cũ và mới cùng tồn tại trong một khoảng thời gian.

3.  **Rolling with Additional Batch**:
    - Khởi tạo một nhóm instance mới (batch) chạy version mới trước, sau đó mới deploy đè lên các instance cũ.
    - **Downtime**: No.
    - **Capacity**: Giữ nguyên (không giảm như Rolling thường).

4.  **Immutable**:
    - Tạo một Auto Scaling Group hoàn toàn mới cho version mới.
    - Nếu deploy thành công -> Switch traffic sang ASG mới -> Terminate ASG cũ.
    - **An toàn nhất** (dễ rollback nhất). Tốn tài nguyên nhất (Double capacity tạm thời).

5.  **Traffic Splitting (Canary)**:
    - Chuyển một phần nhỏ traffic (ví dụ 10%) sang version mới để test thực tế.
    - Nếu ổn -> Chuyển hết. Nếu lỗi -> Rollback ngay.

## 4. Advanced Concepts

### a. Configuration (.ebextensions)

- Thư mục `.ebextensions/` chứa các file YAML/JSON cấu hình môi trường.
- Cho phép cài đặt thêm packages (yum install), tạo file, chạy script, cấu hình resource AWS (DynamoDB, SQS) mà Beanstalk không hỗ trợ mặc định.

### b. Docker Platform

- **Single Container Docker**: Chạy 1 container trên mỗi EC2 instance.
- **Multi-container Docker**: Chạy nhiều container trên mỗi EC2 instance (dùng ECS ở bên dưới).

### c. Database Decoupling

- **Không nên** tạo RDS database _bên trong_ môi trường Elastic Beanstalk (vì khi xóa môi trường, DB sẽ bị xóa theo).
- **Nên** tạo RDS _bên ngoài_, sau đó kết nối vào Beanstalk qua Connection String (Environment Variables).

## 5. Exam Tips (Lưu ý thi SAA)

- Nếu đề bài yêu cầu **triển khai nhanh ứng dụng web (PHP, Java, Python...)** mà không muốn quản lý hạ tầng -> Chọn **Elastic Beanstalk**.
- Nếu muốn **A/B Testing** hoặc **Blue/Green Deployment** dễ dàng, an toàn -> Chọn **Elastic Beanstalk** (Swap Environment URLs hoặc Traffic Splitting).
- Nếu cần **chạy script cài đặt phần mềm** tùy chỉnh tự động khi deploy -> Dùng **.ebextensions** config files.
- Để **tách biệt Database khỏi vòng đời ứng dụng** -> Tạo RDS bên ngoài và truyền endpoint qua biến môi trường.
- Worker Environment thích hợp cho các tác vụ **xử lý background** (như resize ảnh, gửi email) lấy từ **SQS Queue**.
