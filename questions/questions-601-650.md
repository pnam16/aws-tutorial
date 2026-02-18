# AWS Certification Exam Questions 601-650

Tài liệu được biên soạn chi tiết với giải thích bằng tiếng Việt, bao gồm phân tích vì sao các đáp án sai, giúp bạn hiểu sâu về các dịch vụ AWS.

---

## Câu 601

**Đề bài**: Migrate **RDS PostgreSQL** to **Aurora PostgreSQL**. Minimal downtime and **Least operational overhead**.

**Phân tích đáp án**:

- **A. Snapshot (Create DB snapshot... populate new Aurora).**
  - _Tại sao sai?_ Restoration từ Snapshot mất thời gian (dựa trên size DB). Trong thời gian đó DB phải dừng write để đảm bảo data consistency -> **Downtime cao**.
- **B. Create an Aurora read replica of RDS. Promote to new Cluster.**
  - _Tại sao đúng?_
    - **Aurora Read Replica**: AWS hỗ trợ tạo Aurora Read Replica trực tiếp từ RDS PostgreSQL.
    - Data được replicate liên tục (gần như realtime).
    - Khi switch over, chỉ cần stop write -> chờ catchup (vài giây/phút) -> Promote Replica thành Primary.
    - **Minimal downtime** và **Least overhead** (Managed workflow).
- **C. Import S3.**
  - _Tại sao sai?_ Phức tạp (Dump data ra file -> Upload S3 -> Import). Downtime rất lớn.
- **D. pg_dump.**
  - _Tại sao sai?_ Công cụ thủ công. Backup/Restore kiểu này với DB lớn sẽ mất hàng giờ -> Downtime lớn + High overhead.

**Đáp án đúng**: **B**

---

## Câu 602

**Đề bài**: Disaster Recovery. Hundreds of EC2 instances with EBS. **Recover every EC2 instance**. **Least amount of effort**.

**Phân tích đáp án**:

- **A. Snapshot -> CloudFormation.**
  - _Tại sao sai?_ Việc tạo CloudFormation template thủ công cho "hàng trăm" instances là **High effort**.
- **B. Elastic Beanstalk.**
  - _Tại sao sai?_ Elastic Beanstalk là dịch vụ deploy web app, không phải công cụ DR cho generic EC2 fleet.
- **C. AWS Backup.**
  - _Tại sao đúng?_
    - **AWS Backup**: Dịch vụ quản lý backup tập trung. Hỗ trợ backup cả group EC2 (dựa trên Tag).
    - Để restore hàng loạt ("Recover every instance"): Dùng **AWS CLI/API** để trigger restore job cho danh sách Recovery Points là cách nhanh nhất và ít effort nhất so với làm thủ công.
- **D. Lambda snapshot -> Lambda restore.**
  - _Tại sao sai?_ Phải viết, duy trì và debug code Lambda phức tạp cho quy trình backup/restore -> **High effort**.

**Đáp án đúng**: **C**

---

## Câu 603

**Đề bài**: Serverless. **Large-scale parallel on-demand processing**. Semistructured dataset (S3). Process **thousands of items in parallel**. **Most operational efficiency**.

**Phân tích đáp án**:

- **A. Step Functions Map Inline.**
  - _Tại sao sai?_ **Inline Map** state chạy các iteration trong context của workflow hiện tại, bị giới hạn về concurrency (khoảng 40) và history limit (25,000 events). Không đủ cho "Large-scale parallel" với hàng ngàn items.
- **B. Step Functions Map state in Distributed mode.**
  - _Tại sao đúng?_
    - **Distributed Map**: Tính năng thiết kế riêng cho **High Concurrency Parallel Processing**.
    - Hỗ trợ xử lý trực tiếp objects từ S3 (S3 List Objects).
    - Có thể scale lên hàng chục ngàn parallel executions (Lambda/Fargate).
    - Đáp ứng đúng "thousands of items in parallel" và "Operational efficiency" (Serverless orchestration).
- **C. AWS Glue.**
  - _Tại sao sai?_ Glue là ETL tool, tốt cho batch processing lớn. Tuy nhiên với mô tả "Serverless solution for on-demand processing... items in parallel", Distributed Map + Lambda thường linh hoạt và khởi động nhanh hơn (lower overhead) cho item-level processing. Câu này Distributed Map fit keyword "thousands of items in parallel" hơn.
- **D. Several Lambda functions.**
  - _Tại sao sai?_ "Use several... process in parallel". Tự quản lý việc fan-out và tracking state của hàng ngàn Lambda executions rất thủ công và high effort. Distributed Map làm việc này tự động.

**Đáp án đúng**: **B**

---

## Câu 604

**Đề bài**: Migrate **10 PB** in **6 weeks**. **500 Mbps uplink** (80% usage = 400 Mbps).

**Tính toán**:

- 400 Mbps = 0.05 GB/s.
- 10 PB = 10,000,000 GB.
- Thời gian = 10,000,000 / 0.05 = 200,000,000 giây ~ 2,314 ngày ~ 6 năm.
- Deadline: **6 tuần**. -> Mạng internet không thể đáp ứng.

**Phân tích đáp án**:

- **A. AWS DataSync.**
  - _Tại sao sai?_ DataSync chạy qua mạng (Internet/DX). Băng thông không đủ.
- **B. rsync.**
  - _Tại sao sai?_ Chạy qua mạng -> Quá chậm.
- **C. AWS CLI.**
  - _Tại sao sai?_ Chạy qua mạng -> Quá chậm.
- **D. Order multiple AWS Snowball devices.**
  - _Tại sao đúng?_
    - **Snowball Edge Storage Optimized** (80TB/device).
    - Offline data transfer.
    - Sử dụng nhiều thiết bị song song (Cluster) hoặc nhiều chuyến xe.
    - Loại bỏ phụ thuộc vào băng thông internet. Khả thi trong 6 tuần (với đủ số lượng device).

**Đáp án đúng**: **D**

---

## Câu 605

**Đề bài**: ISCSI network storage servers (On-Prem). Move to AWS. Provide **low-latency access to frequently used data** on-prem. **Minimal infrastructure changes**.

**Phân tích đáp án**:

- **A. S3 File Gateway.**
  - _Tại sao sai?_ S3 File Gateway cung cấp giao thức **NFS/SMB** (File interface). Đề bài đang dùng **iSCSI** (Block interface). Infrastructure change lớn (thay đổi cách mount drive từ iSCSI sang Network Share).
- **B. EBS.**
  - _Tại sao sai?_ EBS chỉ gắn được vào EC2 trên AWS, on-cloud only. On-prem server không mount trực tiếp EBS được.
- **C. Volume Gateway - Stored Volumes.**
  - _Tại sao sai?_ **Stored Volumes** lưu toàn bộ dữ liệu ở local (on-prem), chỉ backup snapshot lên S3. Đề bài yêu cầu "Reduce dependency on on-premise servers" (giảm số lượng server/dung lượng lưu trữ). Stored Volume vẫn cần full storage ở local.
- **D. Volume Gateway - Cached Volumes.**
  - _Tại sao đúng?_
    - **Cached Volumes**: Lưu dữ liệu chính trên S3 (giảm dependency local storage).
    - Chỉ lưu **Frequently accessed data** ở bộ đệm local -> Đáp ứng "Low latency access to frequently used data".
    - Cung cấp giao thức **iSCSI** -> Compatible với hạ tầng hiện tại (Block volume). Minimal change.

**Đáp án đúng**: **D**

---

## Câu 606

**Đề bài**: Upload objects to S3. **Maximize durability**. Readily available (any time). First 30 days: **Frequent access**. After 30 days: **Less likely** (Infrequent). **Most Cost-effectively**.

**Phân tích đáp án**:

- **A. Standard -> Glacier.**
  - _Tại sao sai?_ **Glacier** (Flexible Retrieval) cần thời gian restore (vài phút đến giờ). Không đáp ứng "Readily available at any time" (tức thì). (Trừ khi là Glacier Instant Retrieval, nhưng option chỉ ghi "Glacier" thường ám chỉ class cũ/standard).
- **B. Standard -> S3 Standard-IA.**
  - _Tại sao đúng?_
    - **S3 Standard-IA**: Thiết kế cho Infrequent access nhưng vẫn available tức thì (milliseconds latency).
    - Rẻ hơn Standard khoảng 40%.
    - Durability 11 số 9 (Maximize durability, hơn One Zone).
- **C. Standard -> One Zone-IA.**
  - _Tại sao sai?_ **One Zone-IA** lưu data trong một AZ duy nhất. Nếu AZ đó bị hủy hoại -> Mất data. Durability thấp hơn Standard-IA. Yêu cầu "Maximize durability" -> Standard-IA tốt hơn.
- **D. Intelligent-Tiering -> Standard-IA.**
  - _Tại sao sai?_ Rule này thừa/sai logic. Intelligent-Tiering tự động move data giữa các tier. Bản thân nó là 1 class.

**Đáp án đúng**: **B**

---

## Câu 607

**Đề bài**: Oracle RDS Multi-AZ. 12 TB storage. **Store documents (BLOBs) 6 MB**. DB size grown reducing performance. **Cost-effective** improvement.

**Phân tích đáp án**:

- **A / B. Resize Instance/Storage.**
  - _Tại sao sai?_ Việc lưu binary files (BLOBs) lớn trong Relational DB là bad practice (tốn storage đắt đỏ của DB, làm chậm backup/restore, buffer cache bị chiếm dụng). Tăng instance chỉ giải quyết triệu chứng tạm thời và tốn kém (High Cost).
- **C. Offload documents to S3. Store metadata in DB.**
  - _Tại sao đúng?_
    - S3 rẻ hơn rất nhiều so với EBS/RDS storage ($0.023 vs $0.10+).
    - DB performance tăng vì table nhỏ lại, query nhanh hơn.
    - Giải quyết tận gốc vấn đề lưu trữ. **Most cost-effective**.
- **D. Migrate to DynamoDB.**
  - _Tại sao sai?_ DynamoDB cũng giới hạn item size (400KB), không lưu được 6MB document trực tiếp hiệu quả. Migration từ Oracle sang NoSQL tốn effort lớn.

**Đáp án đúng**: **C**

---

## Câu 608

**Đề bài**: 20,000 retail locations. HTTPS/443. Access Web App (ALB). **Restrict access to only registered IP addresses**.

**Phân tích đáp án**:

- **A. AWS WAF.**
  - _Tại sao đúng?_
    - **AWS WAF IP Set** có thể chứa tới 10,000 CIDR ranges mỗi set.
    - Có thể gắn vào ALB.
    - Quản lý dễ dàng qua Rule. Phù hợp cho số lượng IP lớn (20k).
- **B. Firewall Manager.**
  - _Tại sao sai?_ Firewall Manager dùng để quản lý WAF policies cho _nhiều accounts_. Ở đây chỉ nói về "A company... the application" (context đơn lẻ). Dù dùng FM cũng được, nhưng WAF là core component thực hiện việc filter. A trực tiếp hơn.
- **C. DynamoDB + Lambda Authorizer.**
  - _Tại sao sai?_ ALB hỗ trợ Lambda Authorizer (check header/token), nhưng custom logic check source IP trong Lambda phức tạp và latency cao hơn WAF (native layer 7 filter).
- **D. Network ACL.**
  - _Tại sao sai?_ NACL giới hạn tối đa 20-40 rules (Inbound). Không thể chứa 20,000 IPs.

**Đáp án đúng**: **A**

---

## Câu 609

**Đề bài**: **Lake Formation**. Secure solution to prevent access to portions of data (sensitive info). **Least operational overhead**.

**Phân tích đáp án**:

- **A. IAM Role.**
  - _Tại sao sai?_ IAM Role quản lý quyền ở mức API/Resource (Bucket/Table), không support **Row-level/Column-level security** granular như Lake Formation yêu cầu ("portions of data").
- **B. Create data filters to implement row-level security and cell-level security.**
  - _Tại sao đúng?_
    - Đây là tính năng native của **AWS Lake Formation**.
    - Cho phép define **Data Filters** để ẩn các cột/hàng nhạy cảm mà không cần copy data ra bảng khác hay viết code ETL xóa.
    - **Least overhead**.
- **C. Lambda remove sensitive info.**
  - _Tại sao sai?_ Phải viết code, maintain pipeline. High overhead. Tạo ra bản copy của data -> Tốn storage.
- **D. Lambda periodically query remove.**
  - _Tại sao sai?_ Không realtime, data sensitive vẫn tồn tại trong khoảng thời gian giữa các lần chạy.

**Đáp án đúng**: **B**

---

## Câu 610

**Đề bài**: EC2 in VPC. Load data to S3. **Must not be transmitted over public internet**. On-prem servers consume from EC2 application.

**Phân tích đáp án**:

- **A. Interface Endpoint EC2 + VPN.**
  - _Tại sao sai?_ "Interface Vpc endpoint for Amazon EC2" là để gọi API điều khiển EC2, không phải để EC2 truy cập S3 data.
- **B. Gateway VPC Endpoint for S3 + Direct Connect.**
  - _Tại sao đúng?_
    - **Gateway VPC Endpoint for S3**: Cho phép EC2 truy cập S3 qua đường private của AWS (không qua Internet Gateway). Đáp ứng "Must not be transmitted over public internet".
    - **Direct Connect (DX)**: Kết nối On-prem với VPC qua đường riêng (Private).
    - Kết hợp lại đảm bảo toàn trình Private.
- **C. Transit Gateway + VPN.**
  - _Tại sao sai?_ Transit Gateway nối VPC và VPN. Nhưng EC2 truy cập S3 mặc định đi ra Internet Gateway. Cần VPC Endpoint mới chặn đường internet của S3 traffic hiệu quả nhất.
- **D. Proxy EC2 + NAT Gateway.**
  - _Tại sao sai?_ **NAT Gateway** đẩy traffic ra Internet (dù AWS quản lý đường ra, nhưng traffic S3 đi qua Public Endpoint và tính phí Data Processing). Gateway Endpoint (B) là miễn phí data processing và private hơn.

**Đáp án đúng**: **B**

---

## Câu 611

**Đề bài**: REST Interface. Near-real time. 3rd party sends data -> 503 Errors when volume spikes. Application **unable to process all requests** (compute limit). **Scalable solution**.

**Phân tích đáp án**:

- **A. Kinesis Data Streams.**
  - _Tại sao đúng?_
    - Mô hình **Decoupling**.
    - Kinesis đóng vai trò buffer, có khả năng ingest data cực nhanh (Scalable ingestion).
    - App (Lambda/EC2) đọc từ Kinesis theo tốc độ nó xử lý được -> Không bao giờ bị overload/503.
    - Phù hợp "Near-real time".
- **B. API Gateway + Throttling.**
  - _Tại sao sai?_ Throttling sẽ trả về lỗi **429 Too Many Requests** cho client. Client vẫn bị reject request -> Không giải quyết vấn đề "Application unable to process all requests" (mục tiêu là process hết, không phải reject).
- **C. SNS.**
  - _Tại sao sai?_ SNS push model. Nếu backend overload, SNS retry -> vẫn overload. SNS không phải buffer stream mạnh như Kinesis.
- **D. ECS.**
  - _Tại sao sai?_ ECS giúp scale compute, nhưng nếu burst traffic quá nhanh so với tốc độ scaling -> vẫn 503. Cần hàng đợi (Queue/Stream) để hấp thụ shock.

**Đáp án đúng**: **A**

---

## Câu 612

**Đề bài**: EC2 in **Private Subnet**. Process data from **S3**. **Must not use internet**.

**Phân tích đáp án**:

- **A. Internet Gateway.** (Public Internet -> Sai).
- **B. VPN.** (VPN nối đi đâu? Không nối S3 trực tiếp).
- **C. NAT Gateway.**
  - _Tại sao sai?_ NAT Gateway cho phép outbound internet access. Traffic đi từ Private Subnet -> NAT -> IGW -> S3 Public Endpoint. Về kỹ thuật traffic vẫn đi ra "Internet zone" của AWS (dù không ra public web). Gateway Endpoint tối ưu hơn. Key là "Must not use the internet". NAT GW is "Internet Access Method".
- **D. VPC Endpoint.**
  - _Tại sao đúng?_
    - **Gateway VPC Endpoint for S3**: Route traffic S3 ở lại trong mạng AWS Private Network hoàn toàn. Không cần Internet Gateway hay NAT.

**Đáp án đúng**: **D**

---

## Câu 613

**Đề bài**: EKS. Kubernetes **Secrets**. Want to **Encrypt**. **Least operational overhead**.

**Phân tích đáp án**:

- **A. Application encrypt.** (Phải sửa code app -> Overhead).
- **B. Enable secrets encryption in the EKS cluster by using AWS KMS.**
  - _Tại sao đúng?_
    - EKS hỗ trợ native feature: **Envelope Encryption** cho Kubernetes Secrets.
    - KMS Key của bạn sẽ encrypt Data Key, Data Key encrypt Secret trong etcd.
    - Chỉ cần bật config trên Cluster. Transparent với ứng dụng. Least overhead.
- **C. Lambda.** (Custom solution -> Overhead).
- **D. Parameter Store.** (Thay đổi kiến trúc: App phải gọi API SSM thay vì đọc K8s Secret volume -> High overhead).

**Đáp án đúng**: **B**

---

## Câu 614

**Đề bài**: Multi-tier. Web Servers (ASG) -> App Servers (ASG). Check access. **Limit access to App Servers** so **only Web Servers** can access.

**Phân tích đáp án**:

- **A. PrivateLink.** (Dùng để connect service giữa các VPCs hoặc accounts. Trong cùng 1 app stack multi-tier thì không cần thiết và phức tạp).
- **B. VPC Endpoint.** (Sai công dụng).
- **C. NLB + NACL.**
  - _Tại sao sai?_ NACL hoạt động dựa trên IP/Subnet. Web Servers scale in/out -> IP thay đổi liên tục. Rất khó maintain NACL rule allow đúng IP của Web Servers.
- **D. ALB + Security Group.**
  - _Tại sao đúng?_
    - **Security Group Referencing**: Trong SG của App Server, tạo rule Allow Inbound từ Source là **Security Group ID của Web Server**.
    - AWS tự động cập nhật IP cho phép khi Web Server scale.
    - Đây là best practice cho multi-tier security.

**Đáp án đúng**: **D**

---

## Câu 615

**Đề bài**: EKS Microservices. Collect, aggregate, summarize **metrics and logs** in **centralized location**.

**Phân tích đáp án**:

- **A. CloudWatch Agent.** (Config tay low level).
- **B. App Mesh.** (Service Mesh, focus vào traffic control/tracing hơn là log aggregation central).
- **C. CloudTrail.** (Audit API calls, không phải app logs/metrics).
- **D. CloudWatch Container Insights.**
  - _Tại sao đúng?_
    - **Container Insights**: Giải pháp monitoring trọn gói cho EKS.
    - Tự động deploy agent (CloudWatch Agent + Fluent Bit) dưới dạng DaemonSet.
    - Thu thập Metrics (CPU, Mem, Net) và Logs.
    - Hiển thị Dashboard tập trung.

**Đáp án đúng**: **D**

---

## Câu 616

**Đề bài**: Detect **Malicious attacks**, **Suspicious activity**. Monitor AWS Account, Workloads, S3 access patterns. Dashboard.

**Phân tích đáp án**:

- **A. Macie.** (Focus vào Data Privacy/PII discovery).
- **B. Inspector.** (Vulnerability Scanning cho EC2/ECR).
- **C. Monitor with Amazon GuardDuty.**
  - _Tại sao đúng?_
    - **GuardDuty**: Threat Detection Service.
    - Phát hiện "Malicious attacks", "Suspicious activity" (VD: Crypto mining, Unauthorized access).
    - Nguồn: CloudTrail, VPC Flow Logs, DNS Logs, **S3 Data Events**.
    - Tích hợp Security Hub (Dashboard).
- **D. Config.** (Resource Inventory & Compliance History).

**Đáp án đúng**: **C**

---

## Câu 617

**Đề bài**: Migrate **NFS-based** storage server (200GB) to AWS. **Without interruption**. Access by **NFS protocol**. **Cost-effectively**. (Choose two).

**Phân tích đáp án**:

- **A. FSx for Lustre.** (Đắt, chuyên cho HPC, không tối ưu cost cho general requirement).
- **B. Amazon EFS.**
  - _Tại sao đúng?_ EFS là **Managed NFS** file system. Cost-effective (đặc biệt với Lifecycle Management). Phù hợp thay thế NFS server truyền thống.
- **C. S3.** (Không phải NFS protocol).
- **D. Manual copy.** (Gây gián đoạn "interruption", khó sync data đang thay đổi).
- **E. AWS DataSync.**
  - _Tại sao đúng?_
    - Công cụ migrate data online.
    - Hỗ trợ NFS source -> EFS destination.
    - Chạy incremental sync giúp switch over với downtime thấp nhất (Minimal interruption).

**Đáp án đúng**: **B, E**

---

## Câu 618

**Đề bài**: FSx for Windows File Server (us-east-1). **Replicate to us-west-2**. **RPO 5 mins** for planned maintenance. Replicated data **must not be deleted for 5 years**.

**Phân tích đáp án**:
(Đã phân tích kỹ ở batch trước, tóm tắt sự khác biệt)

- **Compliance Mode** vs **Governance Mode**: Yêu cầu "Replicated data must not be deleted by **any user**" -> **Compliance Mode** (Không ai, kể cả root, xóa được trong retention period). Governance mode cho phép user có quyền đặc biệt xóa. -> Loại B, D.
- **Single-AZ** vs **Multi-AZ**: Yêu cầu "RPO 5 mins for **planned system maintenance**".
  - **Single-AZ**: Khi maintenance (patching), file system offline ~20 phút. Trong thời gian này data không được replicate/sync continuous? RPO có thể bị ảnh hưởng nếu crash đúng lúc?
  - Thực tế, **Multi-AZ** đảm bảo High Availability trong quá trình maintenance (Failover sang standby), giúp service online liên tục, đảm bảo RPO/RTO tốt hơn.
  - Tuy nhiên câu hỏi nhấn mạnh RPO 5 mins.
  - Điểm quyết định: **Compliance Mode** là bắt buộc. Multi-AZ an toàn hơn cho production RPO.
  - Backup plan copy cross-region đáp ứng replication.

**Đáp án đúng**: **C**

---

## Câu 619

**Đề bài**: Developer Accounts via **Organizations**. Developers have **Root Access** to their accounts. Ensure **mandatory CloudTrail** is **not modified**.

**Phân tích đáp án**:

- **A. IAM Policy.** (Root user có thể delete/detach policy của chính mình hoặc sửa nó).
- **B. New trail.** (Dev có quyền Root -> Có thể xóa trail này).
- **C. Service Control Policy (SCP).**
  - _Tại sao đúng?_
    - SCP áp dụng từ Organization Root/OU xuống account con.
    - Root user của account con **bị giới hạn** bởi SCP.
    - SCP Deny `cloudtrail:StopLogging`, `cloudtrail:DeleteTrail` -> Dev bó tay, không xóa được.
- **D. Service-linked role.** (Không dùng để chặn quyền user).

**Đáp án đúng**: **C**

---

## Câu 620

**Đề bài**: Business-critical app. **Durable storage**. **Consistent, low-latency performance**.

**Phân tích đáp án**:

- **A. Instance store.**
  - _Tại sao sai?_ Low latency tuyệt vời nhưng **Ephemeral** (mất dữ liệu khi stop instance) -> Không đáp ứng "Durable storage".
- **B. Memcached.**
  - _Tại sao sai?_ In-memory cache, data mất khi reboot -> Không durable.
- **C. Provisioned IOPS SSD (io1/io2).**
  - _Tại sao đúng?_
    - **Durable**: Dữ liệu EBS được replicate trong AZ.
    - **Provisioned IOPS**: Cam kết performance ổn định (Consistent), low latency. Dành cho Business-critical app.
- **D. Throughput Optimized HDD.**
  - _Tại sao sai?_ HDD có latency cao hơn SSD, throughput tốt nhưng IOPS performance kém và biến thiên.

**Đáp án đúng**: **C**

---

## Câu 621

**Đề bài**: S3 in us-west-1. **Store a copy** of all new photos in **us-east-1**. **Least operational effort**.

**Phân tích đáp án**:

- **A. S3 Cross-Region Replication (CRR).**
  - _Tại sao đúng?_ Tính năng có sẵn ("Turn on and forget"). AWS tự động copy mọi object mới sang bucket đích. Least effort.
- **B. CORS.** (Quy định quyền truy cập trình duyệt, không copy data).
- **C. Lifecycle rule.** (Chuyển storage class hoặc expire, không copy sang region khác như replication task).
- **D. Lambda + Event.** (Tự viết code -> High operational effort).

**Đáp án đúng**: **A**

---

## Câu 622

**Đề bài**: Web App. **Millions of users** for 4 hours. **Few thousand** rest of day. **Rapidly evolve schema**. **Most Scalability**. (Choose two).

**Phân tích đáp án**:

- **A. DynamoDB On-Demand.**
  - _Tại sao đúng?_
    - "Rapidly evolve schema" -> NoSQL (DynamoDB) linh hoạt hơn SQL (Aurora).
    - "Millions" -> "Thousands" (Biến thiên cực lớn): On-Demand scaling tức thì, không cần warm-up. (Provisioned Auto Scaling có thể bị lag khi spike quá nhanh).
- **B. Aurora Serverless.** (SQL Schema migration khó evolve rapid như NoSQL).
- **C. DynamoDB Auto Scaling.** (Scalable, nhưng On-Demand tốt hơn cho case "unpredictable/extreme spikes" hoặc "simple management". Tuy nhiên A vs C thì A flexible hơn).
- **D. Static content in S3 + CloudFront.**
  - _Tại sao đúng?_ Solution chuẩn để scale static content cho millions users globally. Offload tải khỏi server.
- **E. EC2 + EFS.** (EFS throughput limit, EC2 scaling lag -> Kém hơn S3+CloudFront).

**Đáp án đúng**: **A, D**

---

## Câu 623

**Đề bài**: API Gateway. Protect from **SQL Injection** and **XSS**. **Most operationally efficient**.

**Phân tích đáp án**:

- **A. AWS Shield.** (Chống DDoS, không chống SQLi/XSS lớp ứng dụng).
- **B. AWS WAF.**
  - _Tại sao đúng?_
    - WAF chuyên trị SQLi, XSS (Layer 7).
    - Tích hợp trực tiếp vào API Gateway.
    - Efficient nhất (Native integration).
- **C/D. CloudFront + Shield/WAF.**
  - _Tại sao sai/kém hơn?_ Đặt thêm CloudFront chỉ để gắn WAF (nếu API GW đã public) là thêm 1 component -> thêm operational overhead so với gắn WAF trực tiếp vào API GW. (Tuy nhiên nếu đã dùng CloudFront thì ok, nhưng đề bài không nhắc đến distribution needs, chỉ cần protection). B ngắn gọn và trực tiếp nhất.

**Đáp án đúng**: **B**

---

## Câu 624

**Đề bài**: 1500 users. On-prem **Active Directory**. Access AWS resources. **Do not want to maintain another identity**.

**Phân tích đáp án**:

- **A. IAM User.** (Phải tạo 1500 user mới ở AWS -> Duplicate identity maintenance -> Sai).
- **B. Cognito.** (Thường cho Mobile/Web App user, không phải cho corporate Internal access to AWS Resources/Console management).
- **C. Cross-account roles.** (Map roles to AD directly? Cần cơ chế Federation).
- **D. SAML 2.0-based federation.**
  - _Tại sao đúng?_
    - Cấu hình trust giữa AWS (Service Provider) và AD ADFS/IdP (Identity Provider) qua SAML.
    - User giữ nguyên login AD. Đăng nhập qua Portal -> Assume Role vào AWS.
    - Không cần tạo user ở AWS.

**Đáp án đúng**: **D**

---

## Câu 625

**Đề bài**: Website behind Multiple ALBs. **Distribution rights** around the world (Different content for different users). **Serve correct content**.

**Phân tích đáp án**:

- **A/B. WAF.** (WAF block request, nhưng logic điều hướng "Serve correct content" dựa trên location thì Route 53 tốt hơn và user experience tốt hơn là block).
- **C. Route 53 Geolocation Routing Policy.**
  - _Tại sao đúng?_
    - Route user từ Vietnam -> ALB Vietnam (Content Vietnam).
    - Route user từ US -> ALB US (Content US).
    - Giải quyết việc phân phối nội dung theo vùng địa lý ngay từ DNS lookup.
- **D. Geoproximity.** (Dựa trên khoảng cách/Bias để traffic engineering/load balancing, không chia region strict như Geolocation cho legal rights).

**Đáp án đúng**: **C**

---

## Câu 626

**Đề bài**: On-prem to S3. **Automatically validate integrity**.

**Phân tích đáp án**:

- **A. Snowball Edge.** (Offline transfer).
- **B. AWS DataSync.**
  - _Tại sao đúng?_ Có tính năng builtin: Verification of data integrity during transfer và after transfer.
- **C. S3 File Gateway.** (Giao thức file, integrity check ngầm nhưng không phải tool migrate chuyên dụng verify report rõ ràng như DataSync cho "Data Migration Project").
- **D. Transfer Acceleration.** (Chỉ tăng tốc đường truyền).

**Đáp án đúng**: **B**

---

## Câu 627

**Đề bài**: Migrate **2 DNS Servers**. **200 Zones**. **1 million requests/day**. Maximize availability, **minimize overhead**.

**Phân tích đáp án**:

- **A. Route 53.**
  - _Tại sao đúng?_
    - Managed DNS Service. 100% SLA Availability.
    - Import zone file dễ dàng.
    - Operational overhead = Gần như Zero (Không server update/patching).
- **B. EC2.** (Tự quản lý server bind/named -> High overhead).
- **C. SMS.** (Server Migration Service migrate VM -> Vẫn là EC2 -> High overhead).
- **D. EC2 ASG.** (Overhead management).

**Đáp án đúng**: **A**

---

## Câu 628

**Đề bài**: Organizations. **Multipart uploads** incomplete. Report for cost compliance. **Least operational overhead**.

**Phân tích đáp án**:

- **A. Config.** (Config rule check configuration, check incomplete multipart upload data inside bucket is hard/expensive via Config generic rules).
- **B. SCP.** (SCP là policy, không phải reporting tool).
- **C. S3 Storage Lens.**
  - _Tại sao đúng?_ Dashboard miễn phí (hoặc advanced) có sẵn metric **Incomplete Multipart Upload Bytes**. View được toàn bộ Organization.
- **D. Multi-Region Access Point.** (Routing traffic, không phải reporting).

**Đáp án đúng**: **C**

---

## Câu 629

**Đề bài**: RDS MySQL. **Upgrade version**. **Quick solution**. **Test functionality**. **Minimize downtime/risk**.

**Phân tích đáp án**:

- **A. Manual snapshot/Upgrade.** (Downtime lâu khi restore hoặc inplace upgrade).
- **B. Native backup.** (Chậm).
- **C. DMS.** (Setup phức tạp).
- **D. Amazon RDS Blue/Green Deployments.**
  - _Tại sao đúng?_
    - Tạo môi trường Green (Staging) đã upgrade. Data sync từ Blue.
    - Test thoải mái trên Green.
    - Switch over 1 phút. An toàn và nhanh chóng.

**Đáp án đúng**: **D**

---

## Câu 630

**Đề bài**: Data job runs once daily. **Take up to 2 hours**. If interrupted, restart from beginning. **Most cost-effective**.

**Phân tích đáp án**:

- **A. EC2 Reserved.** (Trả tiền 24h cho job 2h -> Sai).
- **B. Lambda.** (Timeout 15 phút -> Sai job 2h).
- **C. ECS Fargate.**
  - _Tại sao đúng?_
    - Serverless container.
    - Chỉ trả tiền cho 2h sử dụng.
    - Dùng Fargate On-Demand: Không bị interrupted (trừ khi AWS sự cố lớn). Đáp ứng "If interrupted...". (Nếu dùng Fargate Spot sẽ rẻ hơn nhưng risk of interruption -> restart 2h job -> tốn hơn/delay). On-Demand Fargate là balance hợp lý nhất cost/risk cho task ngắn hạn.
- **D. ECS on EC2.** (Quản lý cụm EC2 phức tạp hơn Fargate. Billing EC2 thường granularity theo giờ hoặc cần auto scaling aggressive).

**Đáp án đúng**: **C**

---

## Câu 631

**Đề bài**: User profiles, relationships. **Analyze relationships**. Provide recommendations. **Least operational overhead**.

**Phân tích đáp án**:

- **A. Neptune + Kinesis.**
- **B. Neptune + Neptune Streams.**
  - _Tại sao đúng?_
    - **Neptune**: Graph DB hoàn hảo cho relationship data.
    - **Neptune Streams**: Native CDC (Change Data Capture) của Neptune để xử lý thay đổi. Least overhead so với tự build Kinesis integration.
- **C/D. QLDB.** (Ledger Database - Dùng cho lịch sử giao dịch bất biến, không tối ưu cho Graph traversal/recommendation).

**Đáp án đúng**: **B**

---

## Câu 632

**Đề bài**: Large amount of data. Analyzed hourly. Modified by **Several EC2 instances** across **Multiple Availability Zones**. Storage grow 6 months.

**Phân tích đáp án**:

- **A. Glacier.** (Không thể modify/analyze hourly nhanh).
- **B. EBS.** (Chỉ mount được cho 1 instance - trừ Multi-Attach io1/io2 nhưng chỉ trong **1 AZ**).
- **C. Amazon EFS.**
  - _Tại sao đúng?_
    - Shared File System.
    - **Multi-AZ Access**: Hàng nghìn EC2 từ nhiều AZ có thể read/write đồng thời.
    - Elastic Storage: Tự động grow.
- **D. EBS Provisioned IOPS.** (Như B, limit single AZ).

**Đáp án đúng**: **C**

---

## Câu 633

**Đề bài**: RDS PostgreSQL Multi-AZ. **Slow performance due to queries** (Read intensive). Improve performance.

**Phân tích đáp án**:

- **A. Standby.** (RDS Multi-AZ Standby không cho phép truy cập Read. Nó chỉ để Failover).
- **B. Transfer Acceleration.** (S3 feature).
- **C. Read Replica.**
  - _Tại sao đúng?_ Tạo bản sao Async để phục vụ Read Traffic -> Giảm tải cho Primary DB.
- **D. Firehose.** (Ingestion service).

**Đáp án đúng**: **C**

---

## Câu 634

**Đề bài**: Share S3 data 10GB daily with **Consulting Agencies**. **Maximizes security and operational efficiency**.

**Phân tích đáp án**:

- **A. Global tables.** (DynamoDB feature).
- **B. Public bucket.** (Insecure).
- **C. Cross-account access.**
  - _Tại sao đúng?_
    - Sử dụng IAM Role/Bucket Policy để grant access cho Account ID của đối tác.
    - Đối tác tự quản lý user của họ.
    - Không cần tạo user mới trong account của mình, không share credentials lung tung. Secure & Efficient.
- **D. IAM User for each analyst.** (Quản lý hàng đống user cho người ngoài -> High overhead + Risk).

**Đáp án đúng**: **C**

---

## Câu 635

**Đề bài**: FSx for NetApp ONTAP (us-east-1). **DR in Secondary Region**. Access using **same protocols**. **Least operational overhead**.

**Phân tích đáp án**:

- **A. Copy to S3.** (Mất protocol access NFS/SMB trực tiếp, phải restore).
- **B. AWS Backup copy.** (Backup/Restore plan ok, nhưng SnapMirror là native feature mạnh hơn cho NetApp).
- **C. NetApp SnapMirror.**
  - _Tại sao đúng?_ Feature native của ONTAP để replicate data cực kỳ hiệu quả (Block level incremental). FSx hỗ trợ setup SnapMirror giữa các file system. Minimal overhead cho việc sync liên tục.
- **D. EFS.** (Không hỗ trợ SMB, khác protocol).

**Đáp án đúng**: **C**

---

## Câu 636

**Đề bài**: S3 Events -> SNS. **Process events in Scalable way**.

**Phân tích đáp án**:

- **A/B. ECS/EKS.** (SNS push vào Container service cần setup HTTP endpoint, scaling container chậm hơn Lambda/Queue).
- **C. SNS -> SQS -> Lambda.**
  - _Tại sao đúng?_
    - **Fan-out**: SNS nhận event.
    - **Buffering**: SQS queue lưu trữ event, bảo vệ Lambda khỏi bị overwhelm nếu S3 burst event (upload hàng loạt).
    - **Lambda**: Poll từ Queue để xử lý.
    - Kiến trúc loosely coupled, highly scalable.
- **D. SMS.** (Server Migration Service ??? Sai context hoàn toàn).

**Đáp án đúng**: **C**

---

## Câu 637

**Đề bài**: API Gateway Service. Request **unpredictable** (0 -> 500/s). Data < 1GB. **Simple Key-Value requests**. (Choose two).

**Phân tích đáp án**:

- **A. Fargate.** (Container startup chậm hơn Lambda cold start, quản lý scaling policy phức tạp hơn cho 0->500 burst).
- **B. AWS Lambda.**
  - _Tại sao đúng?_ Event-driven, scale to zero, handle burst tốt (với burst limit cao). Phù hợp logic đơn giản.
- **C. Amazon DynamoDB.**
  - _Tại sao đúng?_ Key-Value DB, On-Demand mode handle unpredictable workload perfect.
- **D. EC2 ASG.** (Slow scaling, manage VM).
- **E. Aurora.** (Relational DB overkill cho <1GB simple Key-Value).

**Đáp án đúng**: **B, C**

---

## Câu 638

**Đề bài**: S3 Share data with employees. **Minimizes operational overhead**. Secure.

**Phân tích đáp án**:

- **A. Presigned URL.** (Khó quản lý access revocation, distribute URL secure cho employees globally).
- **B. IAM User.** (Overhead management).
- **C. S3 File Gateway.** (Cần hardware/VM setup user mount, phức tạp cho distributed employees).
- **D. AWS Transfer Family (SFTP). Use Custom Identity Provider (Ad/LDAP).**
  - _Tại sao đúng?_
    - Cung cấp giao diện SFTP quen thuộc.
    - Tích hợp Identity Provider doanh nghiệp (AD) -> Employees dùng pass công ty.
    - Direct access S3 backend. Secure.

**Đáp án đúng**: **D**

---

## Câu 639

**Đề bài**: EC2 behind ALB. Incoming traffic **favors one EC2 instance** (Imbalance). **Disable sticky sessions**?

**Phân tích đáp án**:

- **A. Disable session affinity (sticky sessions) on the ALB.**
  - _Tại sao đúng?_ Sticky Session làm traffic từ 1 user (hoặc 1 corporate proxy IP lớn) dính chặt vào 1 instance. Nếu user đó gửi nhiều request, instance đó quá tải trong khi các instance khác rảnh. Tắt Sticky -> Round Robin -> Load đều.
- **B. NLB.** (Không liên quan imbalance).
- **C. Increase EC2.** (Vẫn bị lệch tải).
- **D. Health check.** (Không liên quan distribution algorithm).

**Đáp án đúng**: **A**

---

## Câu 640

**Đề bài**: Lambda download/decrypt S3 files (**KMS encrypted**). **Permissions**. (Choose two).

**Phân tích đáp án**:

- **A. Attach kms:decrypt to Lambda Resource Policy.** (Resource policy của Lambda dùng để _cho phép service khác gọi Lambda_, không phải cho _Lambda gọi service khác_).
- **B. Grant decrypt permission for the Lambda IAM role in the KMS key's policy.**
  - _Tại sao đúng?_ Key Policy kiểm soát ai được dùng Key. Cần Allow Lambda Role.
- **C. KMS Key Policy allow Lambda Resource Policy.** (Nonsense).
- **D. Create a new IAM policy with kms:decrypt... attach to Lambda function.**
  - _Tại sao đúng?_ Identity Policy (IAM Role của Lambda) cần có quyền thực hiện action `kms:Decrypt`.
  - (Best practice: Cần cả Key Policy Allow + IAM Policy Allow).

**Đáp án đúng**: **B, D**

---

## Câu 641

**Đề bài**: AWS Organizations. **Query Cost and Usage Reports (CUR)** for all accounts. **Once a month**. **Most Scalable and Cost-effective**.

**Phân tích đáp án**:

- **A. EMR.** (Overkill, tốn tiền cluster cho query 1 lần/tháng).
- **B. CUR to S3 -> Amazon Athena.**
  - _Tại sao đúng?_
    - Athena: Serverless Query Service. Chỉ trả tiền theo lượng data scan ($5/TB).
    - Rẻ nhất cho "Once a month" query.
    - Scalable với large dataset.
- **C. Redshift.** (Data warehouse đắt đỏ, phải chạy cluster hoặc Redshift Serverless phí cao hơn Athena cho infrequent use).
- **D. QuickSight.** (BI Tool visualization. Data source pipeline CUR -> QuickSight thường cũng qua Athena/S3). Dạng câu hỏi "Query" thì Athena trực diện hơn.

**Đáp án đúng**: **B**

---

## Câu 642

**Đề bài**: UDP Application. Auto Scaling. **UDP packets**. Scale out/in.

**Phân tích đáp án**:

- **A. Network Load Balancer (NLB).**
  - _Tại sao đúng?_ NLB là Load Balancer duy nhất của AWS hỗ trợ protocol **UDP** load balancing. Tương thích hoàn hảo với ASG.
- **B. ALB.** (Chỉ HTTP/HTTPS).
- **C. Route 53.** (DNS Load Balancing không handling session stickiness/failover instant tốt như NLB, và scale dynamic khó hơn).
- **D. NAT Instance.** (Cổ lỗ, bottleneck).

**Đáp án đúng**: **A**

---

## Câu 643

**Đề bài**: Web logs gigabytes/day. Analyze traffic patterns **on demand once a week**. **Standard SQL**. **Cost-effectively**.

**Phân tích đáp án**:

- **A. Store logs in S3. Use Amazon Athena.**
  - _Tại sao đúng?_ "Standard SQL" + "On demand once a week" (Infrequent) + "Cost-effectively" -> Athena là ứng viên số 1. Không tốn tiền server idle 6 ngày còn lại.
- **B. RDS.** (Load logs text vào Relational DB là sai lầm về performance và cost).
- **C. OpenSearch.** (Tốt cho Realtime/Search logs, nhưng đắt đỏ (RAM) cho case "once a week").
- **D. EMR.** (Batch processing mạnh, nhưng setup cluster chỉ để query sql 1 lần/tuần thì overhead và cost cao hơn Athena serverless).

**Đáp án đúng**: **A**

---

## Câu 644

**Đề bài**: Subdomains `example.com`, `country1.example.com`, `country2.example.com`. **Encrypt website data in transit** (HTTPS on ALB). **Wildcard**. (Choose two).

**Phân tích đáp án**:

- **A. Public certificate for `example.com` and `*.example.com`.**
  - _Tại sao đúng?_
    - Website public -> Cần Public Certificate.
    - `*.example.com` (Wildcard) bảo vệ `country1.example.com`, `country2...`.
    - `example.com` (Apex) cần khai báo riêng (Wildcard không match Apex domain).
- **B. Private Certificate.** (Cho internal app, Browser sẽ báo lỗi untrusted với Public User).
- **E. DNS Validation.**
  - _Tại sao đúng?_ Validate domain ownership bằng CNAME record là cách nhanh nhất, hỗ trợ auto-renewal. (Email validation phiền phức, dễ miss email).

**Đáp án đúng**: **A, E**

---

## Câu 645

**Đề bài**: **External Key Manager** (Outside AWS). **Regulatory requirements**. Retained outside AWS. **Least operational overhead**.

**Phân tích đáp án**:

- **A/D. CloudHSM.** (Key nằm trong HSM của AWS -> Vi phạm "Retained outside AWS").
- **B. AWS KMS external key store (XKS).**
  - _Tại sao đúng?_
    - Tính năng XKS cho phép KMS sử dụng khóa lưu trữ trong External Key Manager (outside AWS).
    - Cryptographic operations thực hiện ở ngoài AWS (optionally) hoặc dùng key material ngoài.
    - Đáp ứng strict regulatory requirement "Key outside Cloud".
- **C. Default KMS.** (Key in AWS).

**Đáp án đúng**: **B**

---

## Câu 646

**Đề bài**: HPC. Hundreds of instances. **Shared file system**. **Parallel access**. **Latency within 1 ms**. **After processing, need access for postprocessing**.

**Phân tích đáp án**:

- **A. EFS.** (Latency thường >1ms ở General Purpose mode. Max I/O mode latency cao hơn. Không chuyên dụng cho HPC parallel high throughput bằng Lustre).
- **B. S3.** (Object storage, latency cao ms-sec).
- **C. FSx for Lustre.**
  - _Tại sao đúng?_
    - **Lustre**: Parallel File System cho HPC. Sub-millisecond latency.
    - **Repository Integration with S3**: Load data từ S3 vào Lustre -> Xử lý (Nhanh) -> Sync kết quả về S3.
    - Post-processing có thể access kết quả từ S3 (bền vững) hoặc Lustre (nếu chưa tắt).
- **D. RAM Share?** (Resource Access Manager share S3? S3 bucket share policies, not mountable as parallel file system with low latency natively).

**Đáp án đúng**: **C**

---

## Câu 647

**Đề bài**: VoIP Application. **Highly Available**. **Automated Failover across Regions**. **Minimize latency**. **Not rely on IP address caching** (DNS issues).

**Phân tích đáp án**:

- **A. AWS Global Accelerator.**
  - _Tại sao đúng?_
    - Cung cấp **2 Static Anycast IPs**. Client connect vào IP này.
    - Traffic đi qua AWS Global Network (Tối ưu latency, giảm jitter - quan trọng cho VoIP).
    - **Instant Failover**: Route traffic sang Region khỏe mạnh ngay lập tức, không phụ thuộc DNS Cache ở client (việc đổi IP DNS cần chờ TTL hết hạn mới update).
- **B. Route 53.** (Phụ thuộc DNS Caching ở client/ISP -> Failover chậm).
- **C. CloudFront.** (Optimize chủ yếu cho HTTP/HTTPS Content, WebSocket support. UDP support hạn chế hơn GA cho VoIP custom protocols).
- **D. ALB.** (Regional resource, không failover cross-region tự động).

**Đáp án đúng**: **A**

---

## Câu 648

**Đề bài**: Weather forecasting. **Sub-millisecond latency**. **HPC**. Thousands of instances concurrent access. **Sustained throughput**. **Highly Available**.

**Phân tích đáp án**:

- **A. FSx for Lustre scratch.**
  - _Tại sao sai?_ **Scratch** file system không replicate data. Nếu server lỗi -> Mất data/downtime. Không giải quyết yêu cầu "Highly Available cloud storage". Scratch chỉ dùng cho temporary processing data tái tạo được.
- **B. FSx for Lustre persistent.**
  - _Tại sao đúng?_
    - **Persistent**: Data được replicate trong AZ. Nếu file server fail, tự động thay thế -> **Highly Available**.
    - Giữ nguyên ưu điểm HPC performance của Lustre (Sub-millisecond, High throughput).
- **C/D. EFS.** (EFS latency không bằng Lustre cho HPC workloads).

**Đáp án đúng**: **B**

---

## Câu 649

**Đề bài**: Postgres. **15,000 IOPS** peak. Migrate to **RDS PostgreSQL**. Provision IOPS **independent** of capacity. **Cost-effectively**.

**Phân tích đáp án**:

- **A. gp2.**
  - _Tại sao sai?_ IOPS của gp2 phụ thuộc vào Size (3 IOPS/GB). Muốn có 15,000 IOPS cần provision 5,000 GB (5TB) storage. Nếu DB thực tế nhỏ (VD 100GB) -> Phải trả tiền cho 5TB storage thừa thãi -> Không cost-effective.
- **B. io1.**
  - _Tại sao sai?_ Provisioned IOPS io1 đắt đỏ.
- **C. gp3.**
  - _Tại sao đúng?_
    - **gp3** cho phép configure IOPS và Throughput **độc lập** với Storage Size.
    - Baseline 3,000 IOPS free. Mua thêm lên 15,000 IOPS giá rẻ hơn nhiều so với io1 hoặc mua thừa dung lượng gp2.
    - Đây là lựa chọn tối ưu chi phí hiện đại nhất cho EBS.
- **D. Magnetic.** (Quá chậm).

**Đáp án đúng**: **C**

---

## Câu 650

**Đề bài**: Migrate On-prem **SQL Server Enterprise**. Online App + **Reporting/Analytics**. **Reduce operational overhead** (Managed Services). **Least overhead**.

**Phân tích đáp án**:

- **A. RDS for SQL Server. Use Read Replicas.**
  - _Tại sao đúng?_
    - **RDS**: Managed Service (Patching, Backup, HA lo hết) -> Reduce overhead.
    - **Read Replicas**: SQL Server Enterprise trên RDS hỗ trợ Read Replicas (dùng Always On Availability Groups technology ngầm). Tách traffic Reporting ra khỏi OLTP.
- **B. EC2 + Always On.**
  - _Tại sao sai?_ Tự quản lý OS, DB Installation, Replication config, Patching -> **High operational overhead**.
- **C. DynamoDB.** (Không tương thích SQL Server).
- **D. Aurora MySQL.** (Database engine migration từ SQL Server sang MySQL tốn effort lớn làm lại app/schema -> High migration overhead).

**Đáp án đúng**: **A**

---
