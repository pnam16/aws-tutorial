# Amazon ElastiCache

## 1. Tổng quan (Overview)

Amazon ElastiCache là dịch vụ bộ nhớ đệm (In-memory Caching) được quản lý, tương thích với **Redis** và **Memcached**. Nó giúp cải thiện hiệu năng ứng dụng web bằng cách cho phép truy xuất dữ liệu từ bộ nhớ RAM tốc độ cao thay vì dựa hoàn toàn vào ổ đĩa chậm chạp.

- **Caching**: Giảm tải cho DB (RDS, DynamoDB) và tăng tốc độ phản hồi (microsecond latency).
- **Session Store**: Lưu trữ phiên làm việc của người dùng.

## 2. Redis vs Memcached

| Đặc điểm              | Redis                                                                     | Memcached                                                                |
| :-------------------- | :------------------------------------------------------------------------ | :----------------------------------------------------------------------- |
| **Data Types**        | Complex (Strings, Hashes, Lists, Sets, Sorted Sets, Bitmaps, Geospatial). | Simple Key-Value (String -> String).                                     |
| **High Availability** | Có (Replication, Multi-AZ Auto Failover).                                 | Không (Node failure = Data loss, cần re-populate).                       |
| **Persistence**       | Có (AOF/RDB Snapshot saved to disk).                                      | Không (Dữ liệu mất khi restart).                                         |
| **Scaling**           | Scale Read (Read Replicas), Scale Write (Cluster Mode/Sharding).          | Scale Out (Thêm nodes) - Multithreaded.                                  |
| **Use Case**          | Leaderboard, Chat apps, Pub/Sub, Geospatial, Caching with advanced logic. | Simple web caching (HTML fragment), Session storage (nếu chấp nhận mất). |

## 3. Caching Strategies (Chiến lược Caching)

### a. Lazy Loading (Cache-Aside)

- Ứng dụng hỏi Cache trước.
- Nếu **Miss** (không có trong Cache) -> Hỏi DB -> Ghi kết quả vào Cache -> Trả về User.
- **Ưu điểm**: Chỉ cache dữ liệu được yêu cầu. Tiết kiệm bộ nhớ.
- **Nhược điểm**: Lần đầu tiên (Miss) sẽ chậm (3 hop). Dữ liệu có thể cũ (DB đổi nhưng Cache chưa hết hạn).

### b. Write Through

- Khi Ghi vào DB, ứng dụng đồng thời Ghi luôn vào Cache.
- **Ưu điểm**: Dữ liệu trong Cache luôn mới nhất (không stale).
- **Nhược điểm**: Ghi chậm hơn (2 hop). Cache chứa cả dữ liệu ít dùng (Waste memory).

### c. TTL (Time to Live)

- Đặt thời gian sống cho key (ví dụ: 300s).
- Giúp tự động xóa dữ liệu cũ, tránh stale data quá lâu. Luôn dùng TTL với Lazy Loading.

## 4. Redis Cluster Mode

1.  **Cluster Mode Disabled**:
    - 1 Primary Node (Read/Write) + Tối đa 5 Read Replicas (Read Only).
    - Tốt cho Read-heavy workload, dataset nhỏ (vừa RAM của 1 node).
    - Nếu Primary chết -> Failover sang Replica.

2.  **Cluster Mode Enabled**:
    - Dữ liệu được chia nhỏ (Shard) ra nhiều Primary Nodes (tối đa 500 shards).
    - Tốt cho Write-heavy workload hoặc dataset cực lớn (vượt quá RAM 1 node).
    - Mỗi Shard có thể có các Replica riêng.

## 5. Exam Tips (Lưu ý thi SAA)

- Nếu đề bài yêu cầu **caching** đơn giản, **multithreaded** -> Chọn **Memcached**.
- Nếu đề bài yêu cầu **High Availability**, **Persistence**, **Advanced Data Types** (Sorted Sets cho bảng xếp hạng) -> Chọn **Redis**.
- Nếu cần **giảm tải cho Database** -> Dùng ElastiCache (cho Read) hoặc SQS (cho Write buffer).
- Để lưu trữ **Session State** phân tán -> Dùng **ElastiCache Redis** (hoặc DynamoDB).
- Để tăng khả năng **chịu lỗi (Fault Tolerance)** cho Redis -> Bật **Multi-AZ with Auto-Failover**.
- Redis Auth dùng **Redis AUTH** command. Memcached Auth dùng **SASL**.
