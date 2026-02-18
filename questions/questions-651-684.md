# AWS Certification Exam Questions 651-684

Tài liệu được biên soạn chi tiết với giải thích bằng tiếng Việt, bao gồm phân tích vì sao các đáp án khắc là sai, giúp bạn hiểu sâu về các dịch vụ AWS.

---

## Câu 651

**Đề bài**: S3 Images. First 180 days: Readily available. Next 180 days: Infrequently accessed. After 360 days: Archive, available instantly upon request. After 5 years: Auditors only, retrieve within 12 hours. No data loss. **Most Cost-effectively**.

**Tóm tắt yêu cầu**:

1. 0-180 ngày: Standard (Hidden constraint "Readily available").
2. 181-360 ngày: Infrequent Access.
3. 360 ngày - 5 năm: Archive but **Instantly Available**.
4. 5 năm+: Archive, retrieval < 12h.

**Phân tích đáp án**:

- **A. S3 One Zone-IA (180) -> Glacier Instant Retrieval (360) -> Glacier Deep Archive (5y).**
  - _Tại sao đúng?_
    - **S3 One Zone-IA**: Rẻ hơn Standard-IA. Phù hợp infrequent access. Mặc dù One Zone có durability thấp hơn (mất data nếu AZ sập), nhưng đề bài chỉ nói "Images cannot be lost during process" (ám chỉ quy trình chuyển đổi không làm mất, chứ không cấm One Zone nếu chấp nhận rủi ro thấp của AZ failure cho dữ liệu cũ. Tuy nhiên, nếu "cannot be lost" là strict durability requirement thì One Zone là rủi ro. Nhưng xét về cost-effective, đây là option rẻ nhất).
    - **S3 Glacier Instant Retrieval**: Đáp ứng "Archive but available instantly".
    - **S3 Glacier Deep Archive**: Đáp ứng "Retrieve within 12 hours" (Standard retrieval 12h) và rẻ nhất cho long-term.
  - _Tại sao B sai?_
    - **S3 Glacier Flexible Retrieval**: Retrieval time từ vài phút đến nhiều giờ. Không đáp ứng yêu cầu "Available instantly upon request" ở mốc 360 ngày.
  - _Tại sao C sai?_
    - **S3 Standard-IA**: Đắt hơn S3 One Zone-IA. Nếu đề bài không yêu cầu bắt buộc Multi-AZ durability, One Zone rẻ hơn. (Tuy nhiên argument "Data cannot be lost" thường ám chỉ tránh One Zone. Nhưng trong các đề thi AW S, sự kết hợp Glacier Instant Retrieval và Deep Archive ở A match chính xác các mốc thời gian và tính năng mới).
  - _Tại sao D sai?_
    - **S3 Standard-IA**: Đắt hơn One Zone.
    - **S3 Glacier Flexible Retrieval**: Không đáp ứng "Instant access".

**Lựa chọn tối ưu**: Giữa A và C. A rẻ hơn (One Zone). C an toàn hơn (Standard IA). Với cụm từ "Most cost-effectively" và các mốc thời gian khớp tính năng mới (Glacier Instant Retrieval), A thường là đáp án được mong đợi nếu chấp nhận One Zone model chi phí thấp cho dữ liệu cũ.

**Đáp án đúng**: **A** (Lưu ý: Nếu bạn cực kỳ strict về "Data cannot be lost" = 99.999999999% durability across zones, thì C mới đúng. Nhưng One Zone vẫn có 11 số 9 durability trong 1 AZ. Câu hỏi nhấn mạnh "Most cost-effectively").

---

## Câu 652

**Đề bài**: EMR Cluster. Runs 6 hours/day. **Big data critical workload** (Cannot lose data). **Most Cost-effectively**.

**Phân tích đáp án**:

- **A. Long-running cluster (Primary+Core On-Demand, Task Spot).**
  - _Tại sao sai?_ "Long-running" (chạy 24/7) lãng phí tiền vì job chỉ chạy 6 tiếng/ngày.
- **B. Transient cluster (Primary+Core On-Demand, Task Spot).**
  - _Tại sao đúng?_
    - **Transient**: Chỉ bật lên chạy job rồi tắt -> Tiết kiệm tiền cho 18 tiếng idle.
    - **Primary + Core on On-Demand**: Core nodes chứa HDFS data. Nếu dùng Spot cho Core và bị terminate, data có thể bị mất hoặc job fail -> Vi phạm "Cannot lose any data". On-Demand đảm bảo an toàn cho Core nodes.
    - **Task nodes on Spot**: Task nodes chỉ xử lý job, không chứa data HDFS. Nếu mất có thể chạy lại, tiết kiệm chi phí đáng kể.
- **C. Transient cluster (Primary On-Demand, Core+Task Spot).**
  - _Tại sao sai?_ **Core nodes on Spot**. Core nodes lưu trữ data HDFS. Nếu AWS thu hồi Spot instance, data bị mất -> Vi phạm "Cannot lose any data".
- **D. Long-running cluster...**
  - _Tại sao sai?_ Lãng phí chi phí chạy 24/7. Hơn nữa Core Spot rủi ro mất data.

**Đáp án đúng**: **B**

---

## Câu 653

**Đề bài**: Tagging resources with **Cost Center ID of creator**. Creator mapping in RDS.

**Phân tích đáp án**:

- **A. SCP.**
  - _Tại sao sai?_ SCP có thể chặn (Deny) nếu thiếu tag, nhưng không thể có logic "Tự động lấy ID từ RDS để tag" hoặc "Require correct ID" dựa trên logic query DB phức tạp. SCP chỉ check static condition.
- **B. Lambda + CloudTrail + EventBridge (React).**
  - _Tại sao đúng?_
    - Khi resource được tạo -> **CloudTrail** ghi lại event (có User identity).
    - **EventBridge** bắt event này -> Trigger **Lambda**.
    - Lambda lấy User ID, query **RDS** để lấy Cost Center -> **Tag** resource đó.
    - Đây là mô hình Reactive Tagging tự động chuẩn.
- **C. CloudFormation + Scheduled Rule.**
  - _Tại sao sai?_ CloudFormation để deploy infra, không phải để chạy logic tagging reactive. Scheduled Rule là định kỳ, không phải realtime reaction ngay sau khi tạo.
- **D. Lambda default value... Missing tag.**
  - _Tại sao sai?_ Đề bài yêu cầu "Tag with Cost Center ID of the user", không phải "Default value".

**Đáp án đúng**: **B**

---

## Câu 654

**Đề bài**: Redesign for **High Availability** & **Managed Solutions**. Current: EC2 (Apache static + PHP + Local Redis).

**Phân tích đáp án**:

- **A. Elastic Beanstalk (Single Instance? Public Subnet).**
  - _Tại sao sai?_ Đề bài không nói rõ Multi-AZ trong option này. Local Redis trên EC2 vẫn là điểm chết (Not managed, Not HA).
- **B. Lambda + API Gateway + ElastiCache Redis.**
  - _Tại sao sai?_ Lambda host "Static content" không phải pattern tốt (nên dùng S3/CloudFront). PHP trên Lambda cần custom runtime (hoặc support mới) nhưng static content trên Lambda là anti-pattern.
- **C. EC2 Backend + ElastiCache Redis Cluster Mode (Multi-AZ) + S3 Frontend.**
  - _Tại sao sai?_ "Keep backend code on the EC2 instance" (Single instance?) -> Vẫn chưa rõ ràng về HA của Compute layer.
- **D. CloudFront + S3 (Static) + ALB + ECS Fargate (PHP) + ElastiCache Redis (Multi-AZ).**
  - _Tại sao đúng?_
    - **Static content**: S3 + CloudFront (Managed, HA, Global).
    - **Compute**: ECS Fargate (Managed Serverless Containers, dễ scale, HA). Thay thế EC2 đơn lẻ.
    - **Session**: ElastiCache for Redis Multi-AZ (Managed, HA). Thay thế Local Redis.
    - Kiến trúc này sử dụng toàn bộ Managed Services và đảm bảo HA ở mọi tầng.

**Đáp án đúng**: **D**

---

## Câu 655

**Đề bài**: Web App public. Sticky Sessions required. **WAF required**. (Choose two).

**Phân tích đáp án**:

- **A. Network Load Balancer.**
  - _Tại sao sai?_ NLB hoạt động ở Layer 4 (TCP/UDP), không hỗ trợ Sticky Sessions (Application Cookie) và không tích hợp trực tiếp với AWS WAF (Layer 7).
- **B. Gateway Load Balancer.**
  - _Tại sao sai?_ GWLB dùng cho 3rd party appliances firewall, không phải cho web app stickiness standard.
- **C. Application Load Balancer.**
  - _Tại sao đúng?_ ALB hoạt động Layer 7, hỗ trợ **Sticky Sessions** (Target Group attribute) và tích hợp **AWS WAF**.
- **D. Second Target Group...**
  - _Tại sao sai?_ Không giải quyết vấn đề WAF/Sticky chính.
- **E. Create Web ACL in WAF. Associate with Endpoint (ALB).**
  - _Tại sao đúng?_ Để đáp ứng yêu cầu "WAF must be applied".

**Đáp án đúng**: **C, E**

---

## Câu 656

**Đề bài**: Stores images historical events. Search by year. **Request once or twice a year**. **Highly available**. **Most Cost-effectively**.

**Phân tích đáp án**:

- **A. EBS + EC2.**
  - _Tại sao sai?_ EBS đắt hơn S3. Cần chạy EC2 Web Server tốn kém. High Availability cần quản lý phức tạp (EBS chỉ nằm trong 1 AZ).
- **B. EFS + EC2.**
  - _Tại sao sai?_ EFS đắt hơn S3.
- **C. S3 Standard.**
  - _Tại sao sai?_ Access "once or twice a year" là rất ít -> S3 Standard (Designed cho frequent access) sẽ đắt hơn mức cần thiết.
- **D. S3 Standard-Infrequent Access (S3 Standard-IA).**
  - _Tại sao đúng?_
    - **S3 Standard-IA**: Rẻ hơn Standard về phí lưu trữ (Storage Cost).
    - Phù hợp cho data "Long-lived, infrequent access".
    - Vẫn đảm bảo "Highly Available" (Multi-AZ durability/availability).
    - Có thể serve static website trực tiếp.

**Đáp án đúng**: **D**

---

## Câu 657

**Đề bài**: Update Security Group rules (CIDR ranges) for multiple offices across Organization. **Centralize management**. **Minimize overhead**.

**Phân tích đáp án**:

- **A. Update in management account...**
  - _Tại sao sai?_ Security Group là regional và account-bound. Không thể tạo 1 cái ở Management Account rồi các account con dùng trực tiếp được (trừ khi dùng Firewall Manager để push rule, nhưng option này mô tả thủ công).
- **B. VPC Customer Managed Prefix List + RAM.**
  - _Tại sao đúng?_
    - **Prefix List**: Cho phép nhóm danh sách CIDR lại thành 1 object.
    - **RAM (Resource Access Manager)**: Chia sẻ Prefix List này từ account quản trị sang toàn bộ Organization.
    - Các account con tham chiếu Prefix List trong Security Group Rules của họ.
    - Khi có IP mới -> Chỉ cần update Prefix List ở account gốc -> Tự động update tất cả SG đang tham chiếu. Rất ít overhead.
- **C. AWS Managed Prefix List + Security Hub + Lambda.**
  - _Tại sao sai?_ "AWS Managed Prefix List" là của AWS (vd: S3 IPs), user không tạo/edit được object này với custom IPs. Phải là "Customer Managed Prefix List". Logic Lambda phức tạp.
- **D. Firewall Manager...**
  - _Tại sao sai?_ Firewall Manager policy quản lý common security groups là giải pháp tốt, nhưng Prefix List + RAM (B) trực tiếp giải quyết vấn đề "CIDR ranges management" gọn gàng hơn cho việc tham chiếu trong rules. Tuy nhiên D cũng là một ứng viên mạnh. Nhưng B "Customer Managed Prefix List" là tính năng sinh ra chính xác cho use case "Manage list of CIDRs centrally".

**Đáp án đúng**: **B**

---

## Câu 658

**Đề bài**: Migrate **HPC workloads** and **NAS storage** to AWS. **Latency-sensitive**. **NFS and SMB multi-protocol access** from file system. **Least latency**. (Choose two).

**Phân tích đáp án**:

- **Compute Layer:**
  - **A. Cluster Placement Group.**
    - _Tại sao đúng?_ **Cluster Placement Group** gom các instances vào chung 1 Rack/Zone để có network latency thấp nhất (Low network latency, high network throughput). Rất quan trọng cho HPC.
  - **B. Partition Placement Group.**
    - _Tại sao sai?_ Dùng cho Big Data (Hadoop/Kafka) để phân tán lỗi, không tối ưu latency cực thấp như Cluster.
- **Storage Layer:**
  - **C. FSx for Lustre.**
    - _Tại sao sai?_ Lustre mạnh về HPC nhưng chỉ hỗ trợ NFS client (Linux), **không hỗ trợ SMB** multi-protocol native tốt như NetApp.
  - **D. FSx for OpenZFS.**
    - _Tại sao sai?_ Chỉ hỗ trợ NFS.
  - **E. FSx for NetApp ONTAP.**
    - _Tại sao đúng?_
      - Hỗ trợ **Multi-protocol (NFS và SMB)** đồng thời trên cùng data.
      - Performance tốt, latency thấp.
      - Đáp ứng đúng requirement protocol.

**Đáp án đúng**: **A, E**

---

## Câu 659

**Đề bài**: Transfer **50 TB** in **2 weeks**. VPN 90% utilized (Full).

**Phân tích**:

- 50 TB cần băng thông lớn. VPN đang full -> Không dùng được đường mạng hiện tại.
- Thời gian 2 tuần là ngắn cho setup Direct Connect (thường mất vài tuần tới vài tháng để kéo dây).
- **Online Transfer**? Không khả thi qua VPN nghẽn. Cần đường mới or Offline.

**Phân tích đáp án**:

- **A. DataSync with VPC Endpoint.**
  - _Tại sao sai?_ DataSync cần đường mạng (VPN/DX/Internet). VPN full. Internet (nếu có) cũng chậm cho 50TB.
- **B. AWS Direct Connect.**
  - _Tại sao sai?_ Thời gian setup DX thường > 2 tuần (Physical connection).
- **C. AWS Snowball Edge Storage Optimized.**
  - _Tại sao đúng?_
    - Offline transfer.
    - Dung lượng device 80TB (Storage Optimized) -> Chứa đủ 50TB.
    - Thời gian ship đi và về + copy < 1 tuần. Đáp ứng deadline 2 tuần dễ dàng.
    - Không ảnh hưởng network VPN.
- **D. AWS Storage Gateway.**
  - _Tại sao sai?_ Sử dụng đường mạng (VPN/DX).

**Đáp án đúng**: **C**

---

## Câu 660

**Đề bài**: Auto Scaling. Slow performance at **start of peak hours**. Works properly after 2-3 hours. Ensure proper work **at the start**. Peak hours **same time each day**.

**Phân tích đáp án**:

- **A. ALB.**
  - _Tại sao sai?_ ALB phân phối tải nhưng không sinh thêm instance _trước_ khi tải đến.
- **B/C. Dynamic Scaling (Memory/CPU).**
  - _Tại sao sai?_ Dynamic Scaling là **Reactive**. Tải tăng -> Metrics tăng -> Trigger scale out -> Cần thời gian khởi động instance. Do đó luôn bị chậm ở "start of peak hours" (giai đoạn warm-up).
- **D. Scheduled Scaling.**
  - _Tại sao đúng?_
    - Biết trước giờ cao điểm ("same time each day").
    - **Scheduled Scaling**: Lên lịch tăng số lượng instance (Desired Capacity) _trước_ giờ cao điểm (ví dụ trước 30p).
    - Đảm bảo capacity sẵn sàng ngay khi peak bắt đầu -> Xử lý "Slow performance at start".

**Đáp án đúng**: **D**

---

## Câu 661

**Đề bài**: RDS connection scaling. Apps scale heavily. Need solution to **scale database more effectively** (Connection management). **Least operational overhead**.

**Phân tích đáp án**:

- **A. DynamoDB pooling...**
  - _Tại sao sai?_ Phải sửa ứng dụng đổi sang DynamoDB (NoSQL) -> Overhead lớn.
- **B. Amazon RDS Proxy.**
  - _Tại sao đúng?_
    - Dịch vụ managed **Connection Pooling** cho RDS.
    - Giúp ứng dụng chia sẻ connection, giảm tải connection setup lên Database.
    - Ít sửa đổi code nhất (chỉ trỏ endpoint sang Proxy).
    - Least overhead (Managed Service).
- **C. Custom Proxy (EC2).**
  - _Tại sao sai?_ Tự quản lý EC2, setup proxy software (PgBouncer/SQLProxy) -> High overhead.
- **D. Lambda Pooling Code.**
  - _Tại sao sai?_ Phức tạp, phải viết code pooling trong Lambda hoặc layer.

**Đáp án đúng**: **B**

---

## Câu 662

**Đề bài**: Optimize **EBS storage and snapshot costs**. Storage/Snapshot costs increase but **storage size purchased doesn't change**? (Actually text says "does not purchase additional EBS _storage_ every month". Implies volumes are static, but maybe data grows inside? Or Snapshots accumulate). Optimize **monthly costs** for **current storage usage**. **Least operational overhead**.

**Phân tích đáp án**:

- **A. CloudWatch Logs -> Elastic Volumes Reduce Size.**
  - _Tại sao sai?_ Giảm size EBS (Shrink) không được hỗ trợ trực tiếp (EBS Elastic Volumes chỉ support Increase size. Muốn giảm phải tạo volume mới + copy data -> High overhead).
- **B. Custom script -> Reduce size.**
  - _Tại sao sai?_ Tương tự A, khó giảm size.
- **C. Delete expired/unused snapshots manually.**
  - _Tại sao sai?_ Thủ công, risk.
- **D. Delete nonessential snapshots. Use Amazon Data Lifecycle Manager (DLM).**
  - _Tại sao đúng?_
    - **Data Lifecycle Manager**: Tự động hóa việc tạo và **xóa** snapshots cũ theo policy (Retention policy).
    - Giải quyết vấn đề "Snapshot costs increase" do tích tụ snapshot cũ.
    - Least operational overhead (Automated).

**Đáp án đúng**: **D**

---

## Câu 663

**Đề bài**: ECS Cluster, S3 Bucket, RDS MySQL. **Sensitive info**. Ensure **ONLY the ECS cluster** can access data in RDS and S3.

**Phân tích đáp án**:

- **A/B. KMS Encryption.**
  - _Tại sao sai?_ Encryption bảo vệ data at rest, nhưng không chặn access network/identity nếu user khác có quyền hoặc key. Câu hỏi về Access Control.
- **C. S3 Policy restricted to Task Role. VPC Endpoint RDS + SG restricted to ECS Subnets.**
  - _Tại sao sai?_ Thiếu S3 VPC Endpoint để đảm bảo network path private và strict. Option D đầy đủ hơn.
- **D. VPC Endpoint for RDS & S3. RDS SG allow only ECS subnets. S3 Policy allow only S3 VPC Endpoint.**
  - _Tại sao đúng?_
    - **RDS Security Group**: Chỉ allow Log in từ Subnets của ECS -> Chặn network access từ nơi khác.
    - **S3 VPC Endpoint**:
      - Tạo Gateway Endpoint.
      - **S3 Bucket Policy**: Sử dụng Condition `aws:SourceVpce` để chỉ cho phép traffic đi qua Endpoint này. -> Chặn access từ Internet hoặc VPC khác/User khác không qua endpoint này.
    - Đây là combo "Network isolation" mạnh nhất.

**Đáp án đúng**: **D**

---

## Câu 664

**Đề bài**: Latency issues twice a month. CPU spike 10x. **Elastic Beanstalk**. **Improve latency**. **Scale automatically**.

**Phân tích đáp án**:

- **A. Burstable (Unlimited) + Scale on Requests.**
  - _Tại sao sai?_ CPU spike 10x suggest CPU bound workload cần CPU mạnh. Burstable (T series) unlimited có thể tốn Credit cost cao. "Scale on requests" (NetworkIn/RequestCount) có thể không phản ánh đúng load nếu nghẽn cổ chai là CPU.
- **B. Compute Optimized + Scale on Requests.**
  - _Tại sao sai?_ Scale on Requests cho latency issue do CPU spike? Usually CPU utilization metric is better for CPU bound.
- **C. Compute Optimized + Scale on Schedule.**
  - _Tại sao sai?_ "Latency issues occur twice each month" nhưng không nói rõ "Known time". Nếu random -> Schedule fail.
- **D. Burstable (Unlimited) + Scale on Predictive Metrics?** Wait.
  - Let's reconsider "Compute Optimized" vs "Burstable". CPU increases 10x -> Cần CPU mạnh. Compute Optimized (C family) là chuẩn.
  - Tuy nhiên, vấn đề là "Latency". Scale based on what?
  - Lựa chọn giữa A và others. Option A dùng Burstable Unlimited. Unlimited cho phép sustain high CPU (trả thêm phí).
  - Nhưng key là **Scaling Trigger**. "Latency issues".
  - AWS Elastic Beanstalk hỗ trợ `Latency` metric (AvgResponseTime) nếu dùng ALB.
  - Option nào nhắc đến trigger phù hợp?
  - Option D: "Predictive metrics". Twice a month pattern? Maybe predictive scaling finds it?
  - Usually for CPU spikes, **Compute Optimized (C family)** is better than Burstable. So B or C.
  - Option B scales on "Requests". If CPU spikes per request, Request count correlates.
  - Nhưng latency issue thường do CPU hết -> Scale theo CPU Utilization chuẩn hơn. Không có option Scale on CPU?
  - Trường hợp "Latency issue", trigger scale bằng `Latency` metric (từ ALB) là trực tiếp nhất.
  - Hãy nhìn Option A/D: "Burstable". Dòng T3/T4g unlimited có thể handle spike tốt nếu ngắn, nhưng nếu sustained heavy load thì C family rẻ/tốt hơn.
  - Tuy nhiên, nếu ứng dụng idle phần lớn thời gian và chỉ spike 2 lần/tháng -> **Burstable Performance** instances là cost-effective nhất (Base cost thấp). Unlimited mode giúp vượt qua đỉnh 10x CPU mà không bị throttle.
  - **Scaling on Requests**: Số lượng request tăng dẫn đến CPU tăng? Có thể.
  - Hãy xem xét ngữ cảnh: On-prem bị latency -> Migrate AWS Elastic Beanstalk. 2 lần/tháng.
  - Giữa Compute Optimized (Luôn đắt) và Burstable (Rẻ + Unlimited fee). Burstable hợp với "Twice a month" spike frequency.
  - Giữa Scale on Requests (A) và Predictive (D). Requests là real metrics.
  - Nhiều khả năng **A** hoặc **B**. Nhưng với frequency thấp, Burstable instances thường được recommend để tiết kiệm. Unlimited mode xử lý vụ 10x CPU.

**Lựa chọn**: **A** (Burstable Unlimited handle spikes rare events cost effectively. Scale on requests/network is generic EB default logic capability).

---

## Câu 665

**Đề bài**: **Secure systems automation**. Track and audit all **incremental changes**.

**Phân tích đáp án**:

- **A. Organizations + Config.**
  - _Tại sao sai?_ Organizations để quản lý account. Config track changes nhưng setup infra ban đầu automation?
- **B. CloudFormation + Config.**
  - _Tại sao đúng?_
    - **CloudFormation**: "Automation to set up infrastructure". Infrastructure as Code.
    - **AWS Config**: "Track and audit all incremental changes" to the infrastructure configurations (History).
    - Đây là cặp bài trùng kinh điển cho Infra Provisioning + Auditing.
- **C/D. Service Catalog.**
  - _Tại sao sai?_ Service Catalog dùng để _k govern_ việc user launch product gì. Nó không hẳn là tool chính để "Track incremental changes" sâu như Config (Config ghi lại từng thay đổi attribute của resource).

**Đáp án đúng**: **B**

---

## Câu 666

**Đề bài**: Stateless Python + MySQL on **Single EC2**. **Migrate to HA**. Cannot modify code. (Choose two).

**Phân tích đáp án**:

- **A. IGW in each AZ.** (Network infra, not HA architecture by itself).
- **B. Migrate database to RDS Users Multi-AZ.**
  - _Tại sao đúng?_ Managed HA Database. Tương thích MySQL. Không cần sửa code (chỉ đổi connection string config).
- **C. DynamoDB.** (Sai vì phải sửa code từ SQL sang NoSQL).
- **D. DataSync.** (Sync file, not DB HA strategy real-time).
- **E. Create ALB + ASG across 2 AZs.**
  - _Tại sao đúng?_ Web App là **Stateless** -> Có thể chạy trên nhiều EC2 trong ASG. ALB phân tải. Đảm bảo HA cho tầng Web.

**Đáp án đúng**: **B, E**

---

## Câu 667

**Đề bài**: Access S3 from Region & On-prem. **Direct Connect** established. **Data must not traverse internet**.

**Phân tích đáp án**:

- **A. Gateway Endpoint.**
  - _Tại sao sai?_ Gateway Endpoint **không thể** được truy cập trực tiếp từ On-premises qua VPN/Direct Connect (Technical limitation của Gateway Endpoint). Nó chỉ dùng cho EC2 trong VPC.
- **B. Transit Gateway?** (Phức tạp hơn cần thiết hoặc sai context access S3).
- **C. Interface Endpoints.**
  - _Tại sao đúng?_
    - **Interface VPC Endpoint (PrivateLink)**: Tạo ENI (Private IP) trong VPC.
    - On-premise access S3 bằng cách gọi vào **Private IP** này qua Direct Connect.
    - Traffic hoàn toàn private, không qua internet. Đây là solution chuẩn để On-prem access S3 private.
- **D. KMS.** (Encryption, not Access method).

**Đáp án đúng**: **C**

---

## Câu 668

**Đề bài**: Organizations + Identity Center (SSO). Dev teams. Require **Application Name Tag** with approved value. **Create resources only if tag is present and valid**.

**Phân tích đáp án**:

- **A. IAM Group conditional Allow.**
  - _Tại sao sai?_ SSO dùng Permission Sets/Roles, management tập trung ở SSO/Organizations level thường dùng Tag Policy hoặc SCP. Nhưng IAM Policy cũng làm được. Tuy nhiên, option D mạnh hơn ở level Organization governance.
- **B. Cross-account role Deny.** (Phức tạp).
- **C. Resource Groups.** (Chỉ grouping, không enforce creation).
- **D. Tag Policy in Organizations.**
  - _Tại sao đúng?_
    - **Tag Policy**: Tính năng của AWS Organizations để chuẩn hóa tagging.
    - Có thể define "Tag key capitalization" và "Allowed values".
    - Có thể **Enforce** (Prevent resource creation) nếu tag không đúng chuẩn (cho một số resource types support enforcement).
    - Đây là giải pháp Governance tập trung đúng chuẩn Organizations.

**Đáp án đúng**: **D**

---

## Câu 669

**Đề bài**: RDS PostgreSQL. **Manage master user password**. **Rotate every 30 days**. **Least operational overhead**.

**Phân tích đáp án**:

- **A. EventBridge + Lambda.** (Custom code -> High overhead).
- **B. CLI.** (Manual/Script -> Overhead).
- **C. AWS Secrets Manager.**
  - _Tại sao đúng?_
    - **Secrets Manager**: Có tính năng **Native Rotation** cho RDS.
    - Chỉ cần bật Rotation, chọn kỳ hạn 30 days. AWS tự deploy Lambda rotation function chuẩn (hoặc dùng managed logic) để đổi pass trong DB và update secret.
    - Zero code (template sẵn), fully managed.
- **D. Parameter Store.** (Không có native rotation automation mạnh mẽ như Secrets Manager - phải tự viết automation).

**Đáp án đúng**: **C**

---

## Câu 670

**Đề bài**: DynamoDB tests. **4 hours once a week**. Knows R/W operations count. **Optimize costs**. Current usage only for this test.

**Phân tích đáp án**:

- **A. On-demand mode.**
  - _Tại sao sai?_ On-Demand đắt hơn Provisioned nếu tải ổn định và dự đoán được. Tuy nhiên ở đây dùng rất ít (4h/tuần).
  - Hãy tính toán: Provisioned mode trả tiền theo giờ cho capacity _đã setting_ (kể cả idle). Nếu set Provisioned capacity và để đó 24/7 -> Lãng phí 164 giờ idle. Nếu dùng Auto Scaling (Provisioned) thì nó scale down về Min (vẫn mất phí Min).
  - Nếu dùng script set capacity lên mức cần thiết trước test, rồi set về 0 (hoặc xóa bảng) sau test?
  - Nhưng On-Demand tiện lợi cho "spiky/infrequent".
  - Tuy nhiên, đề bài nói "Knows exactly how many R/W...".
  - Phân tích sâu hơn: Test chạy 4 tiếng, 1 tuần 1 lần.
  - Option **B: Provisioned Mode**. Update capacity appropriately.
    - Nghĩa là: Trước khi test -> Tăng WCU/RCU. Sau khi test -> Giảm WCU/RCU về min.
    - Vì biết chính xác load, Provisioned Capacity sẽ rẻ hơn On-Demand (On-Demand rate cao gấp 5-7 lần Provisioned).
    - Và quan trọng là Provisioned có thể tắt/giảm khi không dùng.
    - Nhưng On-Demand tiện (không cần script update).
    - Keyword "Optimize cost": Provisioned (tuned) luôn rẻ hơn On-demand cho known workload. Đặc biệt nếu tắt được (giảm về 1).
    - Tuy nhiên, nếu không có automation script được nhắc đến, thì On-Demand là "Solution" đỡ overhead.
    - Nhưng Cost là ưu tiên. Provisioned rẻ hơn đáng kể cho high throughput predictable.
    - Dù vậy, với tần suất 4h/168h (2.3% active time). Nếu dùng Provisioned + Auto Scaling (scale to zero is impossible, min 1). Cost idle 164h _ 1 unit _ price. Vs Cost active 4h _ HighLoad _ Price.
    - On-demand: 4h _ HighLoad _ HighPrice.
    - Thường thì **Provisioned** với strategy scaling/schedule là đáp án cho "Predictable/Known workload" để rẻ nhất.
- **C/D. Reserved Capacity.**
  - _Tại sao sai?_ Commitment 1 năm/3 năm liên tục. Workload chỉ chạy 4h/tuần -> Lãng phí capacity mua 24/7.

**Đáp án đúng**: **B** (Provisioned with manual/scheduled adjustment is cheapest strategy for known predictable load compared to On-demand premium rate).

---

## Câu 671

**Đề bài**: Prevent/Notify **Unusual Spending**.

**Phân tích đáp án**:

- **A. Zero spend budget.** (Báo ngay khi tốn 1 xu -> Noise, không phải "Unusual spending" logic thông minh).
- **B. AWS Cost Anomaly Detection.**
  - _Tại sao đúng?_ Sử dụng Machine Learning để học pattern chi tiêu và phát hiện các bất thường (Anomaly) -> Gửi alert. Đúng yêu cầu "Identified unusual spending".
- **C. Pricing Calculator.** (Estimate, not monitor).
- **D. CloudWatch.** (Cần set static threshold alarms. Khó detect "unusual" dynamic patterns nếu không dùng Anomaly Detection feature).

**Đáp án đúng**: **B**

---

## Câu 672

**Đề bài**: Clickstream data in S3. **Abalyze quickly**. Determine if process further. **Least operational overhead**.

**Phân tích đáp án**:

- **A. Spark + Glue.** (ETL jobs startup time, code complexity).
- **B. Glue Crawler + Athena.**
  - _Tại sao đúng?_
    - **Crawler**: Tự động discover schema của data mới trong S3.
    - **Athena**: Serverless SQL query trực tiếp trên S3.
    - Quickly analyze ad-hoc. Không cần provision server/cluster. Least overhead.
- **C. EMR.** (Phức tạp setup cluster).
- **D. Kinesis Data Analytics.** (Stream processing, data đã nằm trong S3 (batch/files) -> Athena phù hợp hơn Kinesis Analytics (thường nối vào Stream)).

**Đáp án đúng**: **B**

---

## Câu 673

**Đề bài**: SMB File Server. **Large files**. Frequently access **7 days**. After 7 days: **Retrieval time 24 hours**.

**Phân tích đáp án**:

- **A. DataSync.** (Copy tool, not transparent storage extension).
- **B. S3 File Gateway + Deep Archive.**
  - _Tại sao đúng?_
    - **S3 File Gateway**: Cung cấp giao thức SMB, cache file thường dùng (7 ngày) ở local -> High performance access. File đẩy lên S3.
    - **Lifecycle Policy -> Deep Archive**: Sau 7 ngày chuyển sang Deep Archive.
    - **Retrieval time**: Deep Archive Standard Retrieval (12h) hoặc Bulk (48h). Requirement "Max 24h" -> Standard Retrieval (12h) đáp ứng tốt.
    - (Lưu ý: File Gateway không đọc được trực tiếp file đã bị chuyển sang Deep Archive ngay lập tức, phải restore. Requirement "able to access... max retrieval 24h" ám chỉ restore process).
- **C. FSx File Gateway.** (Dùng cho FSx for Windows, backend không phải S3 tiering flexible như S3 Gateway với Deep Archive).
- **D. User S3 access...** (Mất giao diện SMB file share quen thuộc).

**Đáp án đúng**: **B**

---

## Câu 674

**Đề bài**: RDS PostgreSQL. Slow when traffic increases. **Heavy Read Load**. (Choose two).

**Phân tích đáp án**:

- **A. Auto Scaling DB.** (RDS Storage Autoscaling có, nhưng Compute Autoscaling (Aurora Serverless) thì có, còn RDS thường (PostgreSQL Instance) thì không scale compute dọc tự động dễ dàng).
- **B. Create Read Replica + Configure App to read from it.**
  - _Tại sao đúng?_ Giải pháp kinh điển để giảm tải Read cho Primary DB.
- **C. Multi-AZ.**
  - _Tại sao sai?_ Standby trong Multi-AZ Instance không nhận Read traffic.
- **D. ElastiCache.**
  - _Tại sao đúng?_ Caching query results giảm tải Read xuống DB.
- **E. Subnets.** (Không liên quan performance).

**Đáp án đúng**: **B, D**

---

## Câu 675

**Đề bài**: EBS Snapshot daily. **Prevent accidental deletion**. **Force retention**. NOT change administrative rights of storage admin. **Least effort**.

**Phân tích đáp án**:

- **A. IAM Role...** (Phức tạp, admin user vẫn có quyền xóa).
- **B. Deny Policy.** (Admin user có thể gỡ policy nếu họ có quyền IAM Admin. Và đề bài bảo "Not change rights").
- **C. Recycle Bin.**
  - _Tại sao đúng?_
    - **Recycle Bin for EBS Snapshots**: Tính năng cho phép giữ lại snapshot đã bị xóa trong X ngày (Retention Rule).
    - Dù admin run command `delete-snapshot`, nó vẫn chui vào Recycle Bin và restore được.
    - Không cần thay đổi quyền IAM của admin.
- **D. Lock Snapshot.** (Feature này mới có? AWS Backup Vault Lock thì có. EBS Snapshot Lock (WORM) cũng mới ra mắt. Lock ngăn xóa.).
  - Tuy nhiên Recycle Bin được thiết kế cho case "Accidental Deletion" recovery net.
  - Snapshot Lock (Compliance) chặt chẽ hơn.
  - Recycle Bin rule based on Tags (Option C). "Add tags... Create retention rules". -> Matches feature usage.

**Đáp án đúng**: **C**

---

## Câu 676

**Đề bài**: Capture **VPC Flow Logs** near real time. Send to **OpenSearch**.

**Phân tích đáp án**:

- **A. CloudWatch Logs -> VPC Flow Logs -> Kinesis Data Streams -> OpenSearch.**
  - Stream -> OpenSearch cần Lambda hoặc App connector. Data Streams không direct put OpenSearch native dễ như Firehose?
- **B. CloudWatch Logs -> VPC Flow Logs -> Kinesis Data Firehose -> OpenSearch.**
  - _Tại sao đúng?_
    - VPC Flow Logs ghi vào CloudWatch Logs.
    - Log Group Subscription Filter đẩy qua **Kinesis Firehose**.
    - **Firehose** có native destination là **OpenSearch Service**. Setup đơn giản, fully managed (delivery stream), near real-time.
- **C/D. CloudTrail?**
  - _Tại sao sai?_ VPC Flow Logs không ghi vào CloudTrail.

**Đáp án đúng**: **B**

---

## Câu 677

**Đề bài**: EKS Prod (On-Demand). **Dev Cluster** needed. Infrequent use. Test resiliency. **EKS manage all nodes**. **Most cost-effective**.

**Phân tích đáp án**:

- **A. Managed Node Group (Spot Only).**
  - _Tại sao đúng?_
    - Dev cluster, "Infrequent use". **Spot Instances** rẻ hơn On-Demand tới 90%.
    - "Test resiliency": Spot interruption mô phỏng failures thực tế -> Tốt cho test resiliency.
    - "EKS manage all nodes": Managed Node Group hỗ trợ Spot.
    - Cost-effective nhất.
- **B. Mixed (On-Demand + Spot).** (Đắt hơn Spot only).
- **C. ASG Launch Config.** (Manual legacy management, not "EKS Managed Node Group" simplicity experience).
- **D. On-Demand.** (Đắt nhất).

**Đáp án đúng**: **A**

---

## Câu 678

**Đề bài**: Encrypt S3 data. Company **fully control** create, rotate, disable keys. **Minimal effort**.

**Phân tích đáp án**:

- **A. SSE-S3.** (AWS quản lý key, user không control rotation/disable riêng lẻ).
- **B. Customer Managed Key (CMK) in KMS.**
  - _Tại sao đúng?_
    - **KMS CMK**: User tạo key, user config rotation policy (auto/manual), user disable/delete key được.
    - **SSE-KMS**: Tích hợp S3 native. Minimal effort (chỉ cần chọn key khi upload/bucket default).
- **C. AWS Managed Key.** (User không control rotation schedule, không delete được).
- **D. Client-side encryption.** (High effort: download, encrypt, upload).

**Đáp án đúng**: **B**

---

## Câu 679

**Đề bài**: Backup on-prem VMs to S3. **Retain 30 days**. **Automatically delete after 30 days**. (Choose three).

**Phân tích đáp án**:

- **A. Object Lock.** (Ngăn xóa, không giúp tự động xóa).
- **B. S3 Versioning.**
  - _Tại sao đúng?_ Để bảo vệ backup khỏi overwrite/delete ngẫu nhiên, versioning là best practice cho backup bucket. Lifecycle rule cũng hoạt động tốt trên versions. (Tuy nhiên nếu không bắt buộc, step này optional. Xem các option khác).
- **C. Default retention period?** (Object Lock feature? Not standard S3 expiry).
- **D. Lifecycle policy protect 30 days.** (Non-current version transition? or Object Lock retention? Confusing phrasing).
- **E. Lifecycle policy to expire objects after 30 days.**
  - _Tại sao đúng?_ Cơ chế xóa tự động chuẩn của S3 (Expiration Action).
- **F. Backup solution tag objects with 30-day retention period?** (Requires Custom logic/Lifecycle filter).
- _Re-evaluating Options for "Combination"_:
  - Backup solution export to S3.
  - Need: Retain 30d (Don't delete before), Auto Delete after 30d.
  - Possibility 1: **Object Lock** (A) with **Retention Period 30 days** (C or F implied config) -> Ensures retention. + Lifecycle Expiry (E) to delete.
  - Possibility 2: **Versioning** (B) + Lifecycle.
  - Let's look for standard patterns:
  - Use **Object Lock** (A) to enforce "Retained for 30 days" (Immutable).
  - Set **Default Retention** on bucket to 30 days (Seems like C describes this: "Default retention period" is a setting of Object Lock).
  - Set **Lifecycle Policy** to expire after 30 days (E).
  - Logic: Lock giữ file 30 ngày (không ai xóa được). Hết 30 ngày Lock release. Lifecycle rule chạy xóa file.
  - Đây là combo an toàn nhất cho Backup Compliance.

**Đáp án đúng**: **A, C, E**

---

## Câu 680

**Đề bài**: Copy files **S3 -> EFS** and **S3 -> another S3**. Continuously. Overwrite only if changed. **Least operational overhead**.

**Phân tích đáp án**:

- **A. DataSync.**
  - _Tại sao đúng?_
    - AWS DataSync hỗ trợ source S3, dest EFS và S3.
    - Hỗ trợ "Transfer only data that has changed" (Incremental).
    - Có thể schedule (liên tục 1 giờ/lần) hoặc trigger. Managed service, ít overhead hơn viết script/Lambda.
- **B. Lambda + Mount EFS.** (Phức tạp config VPC, mount, timeout cho file to).
- **C. DataSync Transfer All.** (Tốn băng thông/thời gian, không tối ưu bằng Only Changed).
- **D. EC2 Script.** (Manual management).

**Đáp án đúng**: **A**

---

## Câu 681

**Đề bài**: EBS Encryption. **Control rotation**. **Least operational overhead**.

**Phân tích đáp án**:

- **A. Customer Managed Key (CMK).**
  - _Tại sao đúng?_
    - Cho phép bật/tắt **Key Rotation** (mỗi năm).
    - Fully control policy.
- **B. AWS Managed Key.**
  - _Tại sao sai?_ Rotation là tự động (3 năm/lần bởi AWS), User **không control** được việc này (không tắt được, không đổi lịch được).
- **C. External Key.** (Imported key material).
  - _Tại sao sai?_ Imported Key **không hỗ trợ Automatic Rotation**. Phải rotate thủ công -> High overhead.
- **D. AWS Owned Key.** (Không control được gì, dùng chung).

**Đáp án đúng**: **A**

---

## Câu 682

**Đề bài**: Enforce EBS Encryption. **Identify noncompliant**. **Enforce compliance** (Remediate). **Least administrative overhead**.

**Phân tích đáp án**:

- **A. IAM Policy... AWS Config + SSM.**
  - _Tại sao đúng?_
    - **IAM Policy**: Phòng bệnh (Chặn create unencrypted volume).
    - **AWS Config**: "Identify noncompliant" (Rule `encrypted-volumes`).
    - **SSM Remediation**: Config Rule trigger SSM Automation để encrypt volume detect được.
    - Combo Config + SSM là chuẩn bài "Detect & Remediate".
- **B. KMS... Lambda...** (Custom code automation -> Overhead).
- **C. Macie...** (Macie scan S3 data sensitive, không scan EBS encryption config).
- **D. Inspector...** (Inspector scan OS vulnerability/Network reachability, EBS encryption check là việc của Config).

**Đáp án đúng**: **A**

---

## Câu 683

**Đề bài**: Migrate Multi-tier App (Single Node MySQL + Multi-node Web). **Minimize changes**. **Improve Resiliency**. (Choose two).

**Phân tích đáp án**:

- **A. Web Tier -> EC2 ASG + ALB.**
  - _Tại sao đúng?_ Standard Web Tier migration. ASG + ALB mang lại High Availability/Resiliency. Web app thường stateless nên dễ migrate vào ASG.
- **B. Database -> EC2 ASG...**
  - _Tại sao sai?_ Single Node DB đưa vào ASG rất khó quản lý data persistence/replication thủ công.
- **C. Database -> RDS Multi-AZ.**
  - _Tại sao đúng?_
    - RDS Managed Service.
    - Multi-AZ mang lại Resiliency (HA) vượt trội so với Single Node on-prem.
    - Compatible MySQL -> Minimize application logic changes.
- **D. Lambda.** (Structural change -> High change).
- **E. DynamoDB.** (Schema change -> High change).

**Đáp án đúng**: **A, C**

---

## Câu 684

**Đề bài**: App close to `eu-central-1`. Regulations force **cannot launch in eu-central-1**. Want **single-digit millisecond latency**.

**Phân tích**:

- Không được deploy ở Region chính (`eu-central-1`) do regulation (ví dụ Data Residency yêu cầu data ở nước lân cận không phải nước chứa Region đó, hoặc ngược lại?). Nhưng muốn latency thấp tới user ở gần `eu-central-1`.
- Actually, maybe user is _near_ `eu-central-1` (Germany), but cannot use it? Or user is in a country _near_ `eu-central-1` but has no Region there?
- "Company is located close to eu-central-1... cannot launch some apps in eu-central-1".
- Cần chạy ở location _gần_ công ty (để có latency thấp) nhưng _không phải_ `eu-central-1`.
- **AWS Local Zones**: Extension của Region, đặt compute/storage ở các thành phố lớn (khác location của Region cha). Ví dụ Region ở Frankfurt, Local Zone ở Hamburg hoặc Warsaw.
- Nếu regulation cấm Frankfurt nhưng cho phép Warsaw -> Local Zone ở Warsaw solve latency & compliance.

**Phân tích đáp án**:

- **A. CloudFront Edge.** (Chỉ cache static hoặc Edge Lambda limited. Không chạy full "Web Applications" EC2/RDS stack dễ dàng).
- **B. AWS Local Zones.**
  - _Tại sao đúng?_ Đưa compute/storage đến gần user (latency thấp) tại vị trí địa lý cụ thể (khác Region chính). Extend VPC từ Region cha.
- **C. Regional Edge Cache.** (Content Delivery Component).
- **D. Wavelength Zones.** (Dành cho 5G network latency mobile edge).

**Đáp án đúng**: **B**

---
