# Amazon EMR (Elastic MapReduce)

## 1. Tổng quan (Overview)

Amazon EMR là nền tảng đám mây chuyên dụng cho dữ liệu lớn (Big Data). Nó giúp bạn xử lý, phân tích khối lượng dữ liệu khổng lồ bằng các open-source frameworks như Apache Hadoop, Apache Spark, Hive, HBase, Presto, Flink.

- **Managed Cluster**: Tự động cài đặt và cấu hình cluster, nhưng bạn vẫn quản lý EC2 instances bên dưới (IaaS/PaaS hybrid).
- **Elastic**: Dễ dàng thêm/bớt node vào cluster đang chạy.
- **Cost-effective**: Tích hợp chặt chẽ với Spot Instances để giảm giá thành.

## 2. Kiến trúc Cluster (Cluster Architecture)

Một EMR cluster bao gồm các loại node (EC2 instances):

1.  **Master Node (1 node)**:
    - Quản lý cluster, điều phối các job, theo dõi trạng thái các node khác.
    - Chạy các service master như YARN Resource Manager, HDFS NameNode.
    - _Lưu ý_: Nếu Master node chết, cả cluster dừng hoạt động (trừ khi bật Multi-Master).

2.  **Core Nodes (Ít nhất 1 node)**:
    - Chạy các task và **lưu trữ dữ liệu** trong HDFS (Hadoop Distributed File System).
    - Không thể xóa Core node tùy tiện nếu dữ liệu chưa được replicate.

3.  **Task Nodes (Optional)**:
    - Chỉ chạy các task tính toán (compute only), **không lưu trữ dữ liệu** HDFS.
    - Có thể thêm/bớt Task nodes bất cứ lúc nào mà không sợ mất dữ liệu.
    - Lý tưởng để sử dụng **Spot Instances**.

## 3. Các tính năng chính (Key Features)

### a. EMRFS (EMR File System)

- Cho phép EMR truy cập trực tiếp dữ liệu trên **Amazon S3** như thể nó là HDFS.
- _Lợi ích_: Tách biệt Compute (EMR) và Storage (S3). Bạn có thể tắt cluster EMR mà dữ liệu vẫn còn trên S3.
- EMRFS Consistent View: Đảm bảo tính nhất quán (read-after-write) cho S3 (dù hiện tại S3 đã strong consistency, tính năng này vẫn hữu ích cho metadata sync).

### b. Integration with AWS Services

- **Glue Data Catalog**: Dùng làm metastore chung cho Hive/Spark.
- **Lake Formation**: Quản lý quyền truy cập dữ liệu mịn (fine-grained access control).
- **Step Functions**: Điều phối EMR jobs trong pipeline.

### c. EMR Studio & Notebooks

- Môi trường phát triển tích hợp (IDE) dựa trên Jupyter để data scientist chạy code Spark/Python trực tiếp trên cluster.

## 4. Cơ chế hoạt động (How It Works)

1.  **Launch Cluster**: Chọn ứng dụng (Spark, Hive...), chọn loại instance (m5.xlarge...), số lượng node.
2.  **Submit Job**: Gửi script (Python, Scala, SQL) lên cluster.
3.  **Process**: EMR chia nhỏ job thành các task, phân phối cho Core và Task nodes xử lý song song.
4.  **Output**: Kết quả ghi lại vào S3 hoặc HDFS.
5.  **Terminate**: Tắt cluster khi xong việc (Transient cluster) hoặc giữ chạy (Long-running cluster).

## 5. Pricing & Optimization (Định giá & Tối ưu)

- **EMR Price**: Phí quản lý EMR (tính theo giây, cộng thêm vào phí EC2).
- **EC2 Price**: Phí thuê máy chủ (On-Demand, Reserved, Spot).
- **Spot Instances Strategy**:
  - Dùng Spot cho **Task Nodes**: Vì Task nodes không giữ dữ liệu, nếu bị AWS thu hồi (reclaim) thì job chỉ cần chạy lại task đó trên node khác, không mất dữ liệu. Tiết kiệm tới 90%.
  - Không nên dùng Spot cho Master/Core nodes (trừ khi cluster rất ngắn hạn và chấp nhận rủi ro).

## 6. Exam Tips (Lưu ý thi SAA)

- Nếu đề bài nhắc đến **Hadoop**, **Spark**, **Hive**, **HBase**, **Flink** -> Chọn **EMR**.
- Nếu muốn xử lý **Big Data** nhưng cần kiểm soát server, cài đặt phần mềm tùy chỉnh -> Chọn **EMR**. (Glue là serverless, ít tùy chỉnh hơn).
- Nếu muốn **tách biệt Compute và Storage** cho Hadoop -> Chọn **EMR với EMRFS (S3)**.
- Nếu muốn **tiết kiệm chi phí** EMR -> Chọn **Spot Instances cho Task Nodes**.
- Nếu cần **chạy job Hive/Spark định kỳ** -> Dùng **Data Pipeline** hoặc **Step Functions** để spin up cluster -> chạy job -> terminate cluster.
- Phân biệt **EMR** (xử lý) vs **Redshift** (kho dữ liệu). EMR dùng để clean/transform/process data. Redshift dùng để query/warehouse data đã clean.
