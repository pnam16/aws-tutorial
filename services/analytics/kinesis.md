# Amazon Kinesis

## 1. Tổng quan (Overview)

Amazon Kinesis là bộ dịch vụ được thiết kế để thu thập, xử lý và phân tích dữ liệu streaming (dữ liệu truyền trực tiếp) theo thời gian thực (real-time). Dữ liệu streaming bao gồm website clickstreams, ứng dụng logs, IoT telemetry, dữ liệu tài chính, v.v.

Kinesis bao gồm 4 dịch vụ con chính:

1.  **Kinesis Data Streams (KDS)**: Thu thập và lưu trữ stream.
2.  **Kinesis Data Firehose (KDF)**: Tải stream vào kho dữ liệu (S3, Redshift...).
3.  **Kinesis Data Analytics (KDA)**: Phân tích stream bằng SQL/Java.
4.  **Kinesis Video Streams**: Xử lý stream video.

---

## 2. Kinesis Data Streams (KDS)

### a. Khái niệm chính

- **Shard (Phân đoạn)**: Đơn vị cơ bản của Kinesis Stream.
  - 1 Shard cung cấp: **1MB/s** hoặc **1000 records/s** (Input - Write) và **2MB/s** (Output - Read).
  - Tổng capacity của stream = Số lượng Shards.
- **Retention Period**: Dữ liệu được lưu giữ mặc định 24h, tối đa 365 ngày.
- **Partition Key**: Dùng để xác định record sẽ chui vào Shard nào.

### b. Cơ chế hoạt động

- **Producers** (EC2, Mobile App, Kinesis Agent): Đẩy dữ liệu vào Stream.
- **Consumers** (EC2, Lambda, Kinesis Data Analytics): Lấy dữ liệu từ Stream để xử lý.
- **Re-sharding**: Tăng/giảm số lượng Shard để scale (nhưng phải làm thủ công hoặc dùng API, không auto-scale tức thì như Firehose).

### c. Provisioned vs On-Demand Mode

- **Provisioned**: Bạn chọn số lượng Shards (thủ công). Rẻ hơn nếu traffic ổn định.
- **On-Demand**: AWS tự động quản lý Shards dựa trên traffic. Phù hợp traffic không đoán trước.

---

## 3. Kinesis Data Firehose (KDF)

### a. Khái niệm chính

- Dịch vụ ETL đơn giản nhất để **load** dữ liệu streaming vào các đích đến (Destinations).
- **Fully Managed & Auto-scaling**: Không cần quản lý shards, nó tự động scale theo traffic.
- **Near Real-time**: Có độ trễ khoảng 60 giây (buffer) tối thiểu, không phải real-time tuyệt đối như KDS.

### b. Destinations (Đích đến hỗ trợ)

1.  **AWS Destinations**: Amazon S3, Amazon Redshift (qua S3), Amazon OpenSearch Service.
2.  **Third-party Destinations**: Splunk, Datadog, MongoDB Cloud.
3.  **Custom HTTP Endpoint**.

### c. Tính năng biến đổi dữ liệu

- Có thể dùng **AWS Lambda** để biến đổi dữ liệu (ví dụ: convert JSON -> Parquet, unzip, filter) trước khi gửi đến đích.
- Hỗ trợ chuyển đổi định dạng (Record Format Conversion) sang Parquet/ORC để tối ưu cho Athena/S3.

---

## 4. Kinesis Data Analytics (KDA)

- Dùng để phân tích dữ liệu đang chảy trong KDS hoặc KDF.
- Sử dụng **SQL** hoặc **Apache Flink** (Java/Scala) để chạy query.
- _Ví dụ_: Tính trung bình trượt (sliding window) của nhiệt độ cảm biến trong 10 phút qua.
- Output có thể gửi tiếp vào một Kinesis Stream khác hoặc Firehose.

---

## 5. Use Cases (Trường hợp sử dụng)

1.  **Real-time Log Analytics**:
    - Thu thập Application Logs -> Kinesis Data Streams -> Kinesis Data Analytics (phát hiện lỗi) -> OpenSearch (dashboard).

2.  **Lưu trữ dữ liệu vào Data Lake**:
    - IoT Sensors -> Kinesis Firehose -> Convert to Parquet -> S3 (Data Lake) -> Athena query.

3.  **Real-time Leaderboard gaming**:
    - Game events -> Kinesis Data Streams -> Lambda/KDA -> DynamoDB (update score).

---

## 6. Kinesis vs SQS

| Đặc điểm       | Kinesis Data Streams            | Amazon SQS                         |
| :------------- | :------------------------------ | :--------------------------------- |
| **Mục đích**   | Real-time Big Data Streaming    | Message Queue (Decoupling)         |
| **Thứ tự**     | Đảm bảo thứ tự trong cùng Shard | Standard: Không đảm bảo / FIFO: Có |
| **Consumers**  | Nhiều consumers đọc cùng 1 data | 1 consumer đọc xong message bị xóa |
| **Retention**  | 1 ngày - 365 ngày (replay được) | Tối đa 14 ngày (xóa sau khi xử lý) |
| **Throughput** | Rất cao (MB/s, GB/s)            | Message-based                      |

---

## 7. Exam Tips (Lưu ý thi SAA)

- Nếu đề bài nhắc đến **"real-time streaming data"**, **"clickstream"**, **"IoT telemetry"** -> Nghĩ ngay đến **Kinesis**.
- Nếu cần **lưu dữ liệu vào S3/Redshift/OpenSearch** một cách dễ dàng nhất (load data) -> Chọn **Kinesis Data Firehose**.
- Nếu cần xử lý dữ liệu với độ trễ thấp (**< 1 giây**), custom consumer -> Chọn **Kinesis Data Streams**.
- Nếu muốn phân tích dữ liệu stream bằng **SQL** -> Chọn **Kinesis Data Analytics**.
- Firehose **KHÔNG** phải real-time hoàn toàn (dưới 60s latency). Stream là real-time (< 1s).
- Nếu cần đảm bảo thứ tự xử lý dữ liệu (ordering) -> **Kinesis Data Streams** (qua Partition Key) hoặc SQS FIFO.
- Kinesis Data Streams cho phép **nhiều application cùng consume** một luồng dữ liệu (fan-out). SQS thì một khi message được process và xóa thì app khác không thấy nữa.
