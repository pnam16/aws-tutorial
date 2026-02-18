# Amazon RDS Proxy

## 1. Tổng quan (Overview)

Amazon RDS Proxy là một proxy database được quản lý hoàn toàn cho Amazon RDS và Amazon Aurora. Nó đóng vai trò trung gian giữa ứng dụng và cơ sở dữ liệu để quản lý các kết nối (connections).

- **Mục đích**: Giảm tải việc thiết lập kết nối (connection overhead) cho DB, đặc biệt là với các ứng dụng Serverless (Lambda).
- **Connection Pooling**: Gom nhóm và tái sử dụng các kết nối DB.

## 2. Vấn đề giải quyết

### a. "Too Many Connections" Error

- Với kiến trúc truyền thống (EC2), application server giữ một pool kết nối cố định (ví dụ: 100 connections).
- Với **Lambda**, mỗi function invocation có thể mở một connection mới tới DB. Nếu traffic tăng đột biến (ví dụ: 1000 concurrent executions) -> DB bị quá tải kết nối -> Sập.
- RDS Proxy nằm giữa, giữ một số lượng connection ổn định tới DB, và chia sẻ chúng cho hàng nghìn Lambda function.

### b. Failover Time Reduction

- Khi RDS/Aurora failover (Primary chết, Standby lên thay), ứng dụng thường mất 30-60s để DNS cập nhật IP mới.
- RDS Proxy giữ địa chỉ IP không đổi. Nó tự động phát hiện failover và trỏ connection pool sang DB mới. -> Giảm thời gian gián đoạn xuống **66%**.

## 3. Các tính năng chính

1.  **Connection Pooling & Multiplexing**: Chia sẻ connection hiệu quả.
2.  **Seamless Failover**: Tự động route traffic sang instance khỏe mạnh.
3.  **Security Integration**:
    - Tích hợp với **AWS Secrets Manager** để quản lý credentials.
    - Cho phép dùng **IAM Authentication** để connect tới Proxy (thay vì dùng user/password DB).

## 4. Use Cases (Trường hợp sử dụng)

1.  **Serverless Applications**:
    - Lambda connect tới RDS MySQL/PostgreSQL. Đây là use case phổ biến nhất.

2.  **High Concurrency Apps**:
    - Ứng dụng PHP/Node.js mở quá nhiều kết nối ngắn hạn tới DB.

3.  **Resiliency Improvement**:
    - Ứng dụng cần RTO (Recovery Time Objective) cực thấp khi DB failover.

## 5. Exam Tips (Lưu ý thi SAA)

- Nếu đề bài nói về **Lambda connect tới RDS** và gặp lỗi **"Too many connections"** hoặc **timeout** -> Chọn **RDS Proxy**.
- Nếu muốn **giảm thời gian failover** cho RDS/Aurora mà không sửa code ứng dụng -> Chọn **RDS Proxy**.
- RDS Proxy **KHÔNG** support tất cả các engine. Hiện tại chủ yếu là MySQL, PostgreSQL, Aurora.
- RDS Proxy cần được deploy trong **VPC**. Lambda cũng phải trong VPC để connect tới Proxy.

---

# Các dịch vụ Database khác (Tóm tắt)

## Amazon DocumentDB

- Tương thích **MongoDB**.
- Dùng cho lưu trữ JSON documents quy mô lớn, managed.

## Amazon Neptune

- **Graph Database** (Cơ sở dữ liệu đồ thị).
- Dùng cho: Mạng xã hội (Social feeds), Recommendation engines, Fraud detection (phát hiện gian lận dựa trên mối quan hệ).
- Query languages: Gremlin, SPARQL.

## Amazon Timestream

- **Time-series Database** (Chuỗi thời gian).
- Serverless, tự động scale.
- Dùng cho: IoT metrics ($1000 sensors gửi nhiệt độ mỗi giây), DevOps logs.

## Amazon Quantum Ledger Database (QLDB)

- **Ledger Database** (Sổ cái).
- **Immutable** (Bất biến), **Cryptographically verifiable** (Có thể xác minh bằng mật mã).
- Dùng cho: Tài chính, chuỗi cung ứng (Supply chain), lịch sử giao dịch không được phép sửa đổi.
- _Lưu ý_: Khác với Blockchain (Managed Blockchain là phi tập trung, QLDB là tập trung - 1 authority sở hữu).
