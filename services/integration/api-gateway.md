# Amazon API Gateway

## 1. Tổng quan (Overview)

Amazon API Gateway là dịch vụ được quản lý hoàn toàn giúp các nhà phát triển dễ dàng tạo, xuất bản, duy trì, giám sát và bảo vệ các API ở mọi quy mô. Nó đóng vai trò là "cửa trước" (front door) cho các ứng dụng để truy cập dữ liệu, logic nghiệp vụ hoặc chức năng từ các dịch vụ backend.

- **Hosting**: Chạy API RESTful và WebSocket.
- **Security**: Xác thực (AuthN), Ủy quyền (AuthZ), Throttling, WAF.
- **Serverless**: Tích hợp hoàn hảo với AWS Lambda.

## 2. Các loại API (API Types)

1.  **REST API (RESTful)**:
    - Đầy đủ tính năng nhất (Validation, Request Transformation, Caching).
    - Hỗ trợ OIDC, OAuth2.
    - _Use Case_: Public API cho mobile app, web app.

2.  **HTTP API**:
    - Phiên bản nhẹ hơn, nhanh hơn và rẻ hơn của REST API.
    - Ít tính năng hơn (Không có caching, WAF, usage plans).
    - _Use Case_: Serverless proxy đơn giản tới Lambda hoặc HTTP backend.

3.  **WebSocket API**:
    - Giao tiếp hai chiều thời gian thực (real-time 2-way communication).
    - _Use Case_: Chat apps, dashboard chứng khoán, game online.

4.  **Private REST API**:
    - Chỉ có thể truy cập từ trong VPC (thông qua VPC Endpoint).

## 3. Các tính năng chính (Key Features)

### a. Endpoint Types

- **Edge-Optimized**: Sử dụng mạng lưới CloudFront POPs để giảm độ trễ cho user toàn cầu.
- **Regional**: API nằm trong một Region cụ thể. Tốt nếu client ở cùng region. Có thể kết hợp với CloudFront của riêng bạn.
- **Private**: Chỉ truy cập được từ trong VPC.

### b. Security & Auth

- **IAM Authorization**: Dùng IAM user/role để gọi API (Internal services).
- **Cognito User Pools Authorizer**: Dùng cho mobile/web app users (Login with Facebook/Google).
- **Lambda Authorizer (Custom)**: Viết code Lambda để validate token (ví dụ: JWT từ Auth0).
- **API Keys & Usage Plans**: Cấp key cho khách hàng và giới hạn số lượt gọi (Throttle/Quota) để tính tiền.

### c. Integration Types

- **Lambda Function**: Gọi Lambda (Serverless).
- **HTTP**: Proxy tới một HTTP backend khác (EC2, On-premise).
- **Mock**: Trả về phản hồi giả lập (để test khi backend chưa xong).
- **AWS Service**: Gọi trực tiếp dịch vụ AWS khác (ví dụ: PutItem vào DynamoDB, Publish vào SNS) mà không cần Lambda trung gian.

### d. Stages & Deployment

- Bạn cần "Deploy" API tới một "Stage" (Dev, Test, Prod) để nó có thể truy cập được.
- Hỗ trợ **Canary Release**: Triển khai phiên bản mới cho một % traffic nhỏ để test.

## 4. Caching & Throttling

- **Caching**: Cache phản hồi API tại Gateway để giảm tải cho backend và giảm độ trễ (TTL mặc định 300s).
- **Throttling**: Giới hạn số request/giây để bảo vệ backend khỏi bị DDoS hoặc quá tải.
  - _Account Level_: Giới hạn chung cho cả account.
  - _API/Stage Level_: Giới hạn cho từng API.
  - _Client Level_: Giới hạn cho từng API Key.

## 5. Exam Tips (Lưu ý thi SAA)

- Nếu đề bài yêu cầu **REST API** serverless, auth với **Cognito**, chống **DDoS** (WAF) -> Chọn **API Gateway**.
- Để **tiết kiệm chi phí** và **giảm độ trễ** cho các request giống nhau -> Bật **API Gateway Caching**.
- Để ngăn chặn backend bị quá tải bởi traffic đột biến -> Thiết lập **Throttling Rules**.
- Để expose một dịch vụ nội bộ (trên EC2/Lambda trong VPC) ra Internet một cách an toàn -> Dùng **API Gateway**.
- Nếu cần **real-time chat** -> Chọn **WebSocket API**.
- Nếu muốn gọi API mà không cần Internet (Internal only) -> Dùng **Private API** với **VPC Endpoint**.
- **403 Forbidden Error**: Thường do WAF chặn hoặc Auth thất bại.
- **429 Too Many Requests**: Do bị Throttling.
