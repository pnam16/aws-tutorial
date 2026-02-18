# Amazon OpenSearch Service (Elasticsearch cũ)

## 1. Tổng quan (Overview)

Amazon OpenSearch Service là phiên bản được quản lý (managed service) của công cụ tìm kiếm và phân tích mã nguồn mở **OpenSearch** (trước đây là Elasticsearch). Dịch vụ này giúp bạn dễ dàng triển khai, vận hành và mở rộng quy mô các cụm (cluster) OpenSearch trên nền tảng đám mây AWS.

- **Mục đích**: Tìm kiếm toàn văn (Full-text search), phân tích log ứng dụng, giám sát thời gian thực.
- **Visualization**: Đi kèm với **OpenSearch Dashboards** (trước đây là Kibana) để trực quan hóa dữ liệu.

## 2. Các tính năng chính (Key Features)

### a. Tìm kiếm & Phân tích (Search & Analytics)

- **Full-text Search**: Khả năng tìm kiếm văn bản phức tạp, fuzzy search (tìm kiếm mờ), auto-complete, highlighting.
- **Log Analytics**: Thu thập log từ servers, ứng dụng, IoT devices để phân tích lỗi, performance.

### b. Kiến trúc Cluster

- **Master Nodes**: Quản lý trạng thái cluster (không chứa dữ liệu).
- **Data Nodes**: Lưu trữ dữ liệu (indices/shards) và xử lý truy vấn tìm kiếm.
- **UltraWarm Nodes**: Lưu trữ dữ liệu ít truy cập (warm data) trên S3 nhưng vẫn query được, giúp giảm chi phí lưu trữ EBS.
- **Cold Storage**: Lưu trữ dữ liệu rất ít truy cập trên S3 với chi phí cực thấp, cần "thaw" (làm ấm) trước khi query.

### c. Tích hợp (Integrations)

- **Kinesis Data Firehose**: Load dữ liệu streaming trực tiếp vào OpenSearch mà không cần viết code lambda.
- **CloudWatch Logs**: Subscription filter đẩy log vào OpenSearch.
- **AWS IoT**: Rule action đẩy data vào OpenSearch.

## 3. Cơ chế hoạt động (How It Works)

1.  **Ingest**: Đẩy dữ liệu (JSON documents) vào cluster qua API hoặc Firehose/Logstash/Fluentd.
2.  **Index**: OpenSearch phân tích và đánh chỉ mục (indexing) dữ liệu để tối ưu hóa tìm kiếm (Inverted Index).
3.  **Search**: Người dùng/Apps gửi query (DSL) để tìm kiếm. OpenSearch trả về kết quả cực nhanh.
4.  **Visualize**: Dùng OpenSearch Dashboards để vẽ biểu đồ, tạo dashboard giám sát.

## 4. Security & Access Control

- **VPC Access**: Chạy cluster trong VPC private subnet để bảo mật kết nối.
- **Fine-grained Access Control**: Kiểm soát quyền truy cập tới mức index, document, và field.
- **Cognito Authentication**: Cho phép user đăng nhập vào OpenSearch Dashboards bằng user pool của Cognito.
- **Encryption**: KMS cho data at rest, TLS cho data in transit (node-to-node).

## 5. Use Cases (Trường hợp sử dụng)

1.  **Application Search**:
    - Tích hợp ô tìm kiếm cho trang web thương mại điện tử (tìm sản phẩm, gợi ý, bộ lọc).

2.  **Log Analytics (ELK Stack)**:
    - Thu thập log hệ thống (EC2, Container) -> Logstash/Firehose -> OpenSearch -> Dashboards.
    - Phát hiện lỗi 500, latency cao trong thời gian thực.

3.  **Security Information and Event Management (SIEM)**:
    - Phân tích log bảo mật (VPC Flow Logs, GuardDuty findings) để phát hiện mối đe dọa.

## 6. Pricing (Định giá)

- **Instance hours**: Trả phí cho thời gian chạy các node (EC2 instances).
- **Storage**: Phí EBS volumes (Magnetic/GP3/IO1) gắn vào Data nodes.
- **UltraWarm/Cold storage**: Phí lưu trữ rẻ hơn nhiều so với EBS.

## 7. Exam Tips (Lưu ý thi SAA)

- Nếu đề bài yêu cầu **tìm kiếm sản phẩm**, **full-text search**, **auto-complete** cho website -> Chọn **OpenSearch Service**.
- Nếu đề bài yêu cầu **phân tích log ứng dụng/hệ thống** (application logs) và **visualize** (Kibana/Dashboards) -> Chọn **OpenSearch Service**.
- Nếu nhắc đến **ELK Stack** (Elasticsearch, Logstash, Kibana) trên AWS -> Chọn **OpenSearch Service**.
- Để giảm chi phí lưu trữ log lâu dài trên OpenSearch -> Sử dụng **UltraWarm** hoặc **Cold Storage** tiers.
- Phân biệt với **Athena**: Athena query trực tiếp file trên S3 (ad-hoc, chậm hơn, rẻ hơn cho query ít). OpenSearch index dữ liệu vào RAM/Disk (real-time search, nhanh hơn, đắt hơn vì chạy cluster 24/7).
