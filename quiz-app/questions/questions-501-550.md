# AWS Certification Exam Questions 501-550

Tài liệu được biên soạn chi tiết với giải thích bằng tiếng Việt, giúp bạn hiểu sâu về các dịch vụ AWS.

---

## Câu 501

**Đề bài**:  A company wants to ingest customer payment data into the company's data lake in Amazon S3. The company receives payment data every minute on average. The company wants to analyze the payment data in real time. Then the company wants to ingest the data into the data lake. Which solution will meet these requirements with the MOST operational efficiency?

**Các đáp án**:

- A. Kinesis Data Streams -> Lambda (Real-time analyze) -> ... (Need to ingest to S3).
- B. Glue (Batch ETL, not real-time analysis typically, though Streaming Glue exists, Kinesis Analytics is more specialized for real-time analysis).
- C. **Kinesis Data Firehose** to ingest data. Use **Kinesis Data Analytics** to analyze data in real time.
- D. API Gateway -> Lambda (Good for ingestion, but Firehose is managed service aimed at S3 delivery).

**Phân tích**:

- **Ingest to S3**: **Kinesis Data Firehose** là service chuyên dụng để load streaming data vào S3 (Zero administration).
- **Real-time Analysis**: **Kinesis Data Analytics** tích hợp trực tiếp với Firehose/Stream để chạy SQL/Flink analyze data realtime.
- Combo Firehose + Analytics là giải pháp serverless, managed, operationally efficient nhất cho requirement này.

**Đáp án đúng**: **C**

---

## Câu 502

**Đề bài**:  A company runs a website that uses a content management system (CMS) on Amazon EC2. The CMS runs on a single EC2 instance and uses an Amazon Aurora MySQL Multi-AZ DB instance for the data tier. Website images are stored on an Amazon Elastic Block Store (Amazon EBS) volume that is mounted inside the EC2 instance. Which combination of actions should a solutions architect take to improve the performance and resilience of the website? (Choose two.)

**Các đáp án**:

- A. Move images to S3 (Good for stateless, but question asks for "Combination" for resilience).
- B. NFS share (SPOF).
- C. **Move website images onto EFS** mounted on every EC2 instance.
  - _Note_: S3 is also good, but usually CMS requires file system mount (like WordPress wp-content). EFS is standard for CMS scalability.
- D. AMI -> **Auto Scaling Group** (Min 2) + **Global Accelerator**.
- E. AMI -> **Auto Scaling Group** (Min 2) + **Application Load Balancer** + **CloudFront**.

**Phân tích**:

1. **Storage Resilience**: Chuyển Images từ EBS (Local/Single Instance) sang **EFS** (Shared File System, Multi-AZ). (Option C). Hoặc S3 (Option A). Tuy nhiên CMS thường cần file system -> EFS (C) là lựa chọn tự nhiên hơn cho việc "Lift & Shift" CMS scaling.
2. **App Resilience**: Dùng **Auto Scaling Group (ASG)** + **ALB** + **CloudFront** (Content Delivery) để improve performance (caching) và resilience (scaling). Option E đầy đủ hơn D (vì CloudFront tốt cho performance CMS hơn Global Accelerator trong case này - caching images).

**Đáp án đúng**: **C, E** (EFS cho shared storage, ASG+ALB+CloudFront cho App scaling & delivery).

---

## Câu 503

**Đề bài**:  A company runs an infrastructure monitoring service. The company is building a new feature that will enable the service to monitor data in customer AWS accounts. The new feature will call AWS APIs in customer accounts to describe Amazon EC2 instances and read Amazon CloudWatch metrics. What should the company do to obtain access to customer accounts in the MOST secure way?

**Các đáp án**:

- A. **Customer creates IAM Role** ... **Trust policy to company's account**.
- B. Token vending machine (Complex, old pattern).
- C. IAM User (Long-term credentials -> Not secure).
- D. Cognito User (Not for cross-account API backend access).

**Đáp án đúng**: **A**

**Giải thích chi tiết**:

- **A - ĐÚNG**: **Cross-Account IAM Role**.
  - Đây là standard best practice. Customer tạo Role, trong Trust Policy cho phép Account ID của công ty (Monitoring Service) `sts:AssumeRole`.
  - Không chia sẻ Key/Password. Credentials là temporary.

---

## Câu 504

**Đề bài**:  A company needs to connect several VPCs in the us-east-1 Region that span hundreds of AWS accounts. The company's networking team has its own AWS account to manage the cloud network. What is the MOST operationally efficient solution to connect the VPCs?

**Các đáp án**:

- A. VPC Peering (Full mesh -> Not scalable for hundreds).
- B. NAT Gateway (Internet connection, not VPC-to-VPC).
- C. **Create AWS Transit Gateway** in network account. **Share** and attach to VPCs.
- D. VPN (Slow, complex management).

**Đáp án đúng**: **C**

**Giải thích chi tiết**:

- **C - ĐÚNG**: **Transit Gateway (TGW)**.
  - Hub-and-spoke solution. Connect hàng trăm VPCs dễ dàng.
  - Quản lý tập trung tại Networking Account (dùng Resource Access Manager để share TGW).

---

## Câu 505

**Đề bài**:  A company has Amazon EC2 instances that run nightly batch jobs to process data. The EC2 instances run in an Auto Scaling group that uses OnDemand billing. If a job fails on one instance, another instance will reprocess the job. The batch jobs run between 12:00 AM and 06:00 AM local time every day. Which solution will provide EC2 instances to meet these requirements MOST cost-effectively?

**Các đáp án**:

- A. Savings Plan (Commitment 1-3 year hourly. Job runs only 6 hours -> Wasted 18 hours).
- B. Reserved Instances (Same as SP, wasted non-usage time).
- C. **Spot Instances**.
- D. Spot Instances? (Option D says "Increase instance size").

**Phân tích**:

- Job có thể retry ("If job fails... reprocess"). -> Fault tolerant.
- Chạy vào khung giờ cụ thể, muốn rẻ nhất -> **Spot Instances** (Giảm tới 90% giá).
- Vì job retry được, nên Spot interruption không phải vấn đề lớn.

**Đáp án đúng**: **C**

---

## Câu 506

**Đề bài**:  A social media company is building a feature for its website. The feature will give users the ability to upload photos. The company expects significant increases in demand during large events and must ensure that the website can handle the upload traffic from users. Which solution meets these requirements with the MOST scalability?

**Các đáp án**:

- A. Upload to App Server -> Transfer to S3 (Bottleneck at App Server).
- B. Storage Gateway (Bottleneck at Gateway VM).
- C. **Generate Amazon S3 presigned URLs**. Upload **directly from user's browser**.
- D. EFS (Throughput scaling mode? Still bottleneck at simple file system upload compared to S3 distributed nature).

**Đáp án đúng**: **C**

**Giải thích chi tiết**:

- **C - ĐÚNG**: **Presigned URLs**.
  - Client upload trực tiếp lên S3.
  - **Scalability**: S3 handle virtually unlimited concurrent connections.
  - App server chỉ làm nhiệm vụ generate URL nhẹ nhàng, không phải chịu tải data transfer.

---

## Câu 507

**Đề bài**:  A company has a web application for travel ticketing. The application is based on a database that runs in a single data center in North America. The company wants to expand the application to serve a global user base. The company needs to deploy the application to multiple AWS Regions. Average latency must be less than 1 second on updates to the reservation database. The company wants to have separate deployments of its web platform across multiple Regions. However, the company must maintain a single primary reservation database that is globally consistent. Which solution should a solutions architect recommend to meet these requirements?

**Các đáp án**:

- A. DynamoDB Global Table (Multi-master).
  - Câu hỏi yêu cầu "Single primary reservation database". DynamoDB Global Table là Multi-master (Active-Active). Có thể phù hợp requirement "globally consistent" (eventually consistent across regions unless strong consistency requested).
  - Nhưng "Single Primary" thường ám chỉ Relational DB model (Writer-Reader).
  - Tuy nhiên, hãy xem các option khác.
- B/C. Aurora/RDS Read Replicas (Writes must go to Primary in User's region? No, writes go to Primary in NA. Latency > 1s for global users updating NA DB).
  - Cross-region write latency từ Asia/Europe về NA sẽ cao (>200ms). Requirement "latency < 1 second on updates". 200ms < 1s. Vậy RDS/Aurora Global Database có thể đáp ứng?
- D. Aurora Serverless... Lambda sync (Custom sync -> Bad consistency).

**Phân tích lại**:

- Requirement: "Average latency must be **less than 1 second** on updates". (Latency Internet từ Global -> NA thường ~100-300ms, vẫn < 1s).
- Requirement: "**Separated deployments**... but **Single primary reservation database**".
- Option A (DynamoDB Global Table) là **Multi-Master**, không phải "Single Primary" theo nghĩa cổ điển (dù có thể coi là unified DB). Và Global Tables replicate cực nhanh.
- Option B (Aurora Global Database). Write forward? Có tính năng **Write Forwarding** trong Aurora Global Database cho phép Replica ở region khác nhận Write và forward về Primary. Giúp App ở region xa không cần tự connect về Primary. Latency vẫn phụ thuộc physic nhưng user experience tốt hơn.
- Tuy nhiên đề bài hỏi "Single primary reservation database" (Cơ sở dữ liệu đặt chỗ chính duy nhất).
- Nếu dùng DynamoDB Global Table, ta có multiple primaries (mỗi region đều ghi được).
- Nếu dùng Aurora Global DB, ta có 1 Primary Writer ở NA.
- "Updates < 1 second". Aurora Global DB replication latency < 1s (thường < 1 sec). Write latency = RTT to Primary.
- Câu này hơi tricky giữa A và B.
- Keyword "Single primary reservation database" -> Nghiêng về **Aurora Global Database** (1 Primary).
- Keyword "Globally consistent" -> Aurora Global DB đảm bảo consistency tốt hơn DynamoDB (Eventual).
- Tuy nhiên, DynamoDB cũng hay được dùng cho cases này. Nhưng với từ khóa "Single Primary", **Aurora** (Option B) có vẻ hợp lý hơn với cấu trúc câu hỏi.
- **Aurora Global Database**: 1 Primary Region (R/W), các Region khác Read-Only (nhưng có thể Write Forwarding). Rất phù hợp mô tả.

**Đáp án đúng**: **B** (Aurora Global Database - dù đề ghi Aurora MySQL DB instance simple, nhưng concept Global Database fit best). Or simple "Read Replicas" manually? - "Deploy Aurora Read Replicas in each Region". (Aurora Global Database _uses_ storage-based replication to Read Replicas).

---

## Câu 508

**Đề bài**:  A company has migrated multiple Microsoft Windows Server workloads to Amazon EC2 instances that run in the us-west-1 Region. The company manually backs up the workloads to create an image as needed. In the event of a natural disaster in the us-west-1 Region, the company wants to recover workloads quickly in the us-west-2 Region. The company wants no more than 24 hours of data loss on the EC2 instances. The company also wants to automate any backups of the EC2 instances. Which solutions will meet these requirements with the LEAST administrative effort? (Choose two.)

**Các đáp án**:

- A/B. AMI Lifecycle Policy (Data Lifecycle Manager).
- C/D/E. **AWS Backup**.

**Phân tích**:

- Để automate backup và copy sang region khác (DR), **AWS Backup** là giải pháp centralized và powerful nhất hiện nay.
- Option D: Create Backup Vault, Backup Plan based on tags. **Copy to us-west-2**. Schedule twice daily (đáp ứng RPO < 24h).
- Option B: DLM (Data Lifecycle Manager) cũng làm được việc này (Policy create AMI & Copy to Region).
- Tuy nhiên AWS Backup (D) support nhiều resource hơn và quản lý centralized chặc chẽ hơn DLM (chỉ cho EBS/EC2).
- Đề bài: "Manage centrally... Least effort". AWS Backup (D) là câu trả lời modern standard.
- Nhưng đề hỏi Choose two.
  - Có thể ý là: "Setup Backup Plan in Source Region" VÀ "Setup Copy config"?
  - Hoặc so sánh giữa DLM (A/B) và Backup (C/D/E).
- Thực tế DLM (Lifecycle Manager) là tính năng native của EC2 console, rất "Least effort" cho EC2 specifically.
- AWS Backup là service riêng.
- Nếu chọn 2 giải pháp khác nhau hoàn toàn thì lạ.
- Hãy xem kỹ Option B và D.
  - B: DLM Policy -> Create Image -> Copy to us-west-2.
  - D: AWS Backup -> Backup Plan -> Copy to us-west-2.
- Câu hỏi "Which solutions... Choose two??" -> Có thể là "Bước 1 và Bước 2 của một giải pháp"?
- Không, các option A, B, C, D, E đều mô tả trọn vẹn 1 quy trình.
- Có thể câu hỏi muốn chọn **2 thành phần** để cấu hình?
- _Re-reading_: "A company has migrated... Windows Server workloads...".
- _Option CHECK_:
  - A: DLM create backup. Copy on demand (Manual copy -> Fail requirement "Recover quickly" / "Automate").
  - B: DLM create backup. **Configure copy to us-west-2**. (This works fully Automated).
  - C: Custom Lambda (High effort).
  - D: AWS Backup. Define destination us-west-2. (Works fully).
  - E: Copy on demand (Manual).
- Vậy B và D đều đúng về mặt kỹ thuật. Nhưng D (AWS Backup) xịn hơn B (DLM).
- _Wait_, "Choose two". Maybe "Setup Vault/Plan in Region 1" AND "Setup Vault in Region 2"?
  - C: "Create backup vaults in us-west-1 and us-west-2". (True, AWS Backup needs vaults in both). But then using Lambda is wrong.
- Let's look at **D**: "Create a backup vault... create a backup plan... define destination...". This sounds complete.
- Let's look at **B**: "Create AMI lifecycle policy... Configure the copy".
- Nếu phải chọn 2 đáp án ĐÚNG, có thể là 2 cách làm đều chấp nhận được? Hoặc 2 steps?
- Nhưng A,B,C,D,E có vẻ là các alternatives.
- _Có khả năng câu hỏi này là dạng Multiple Choice Single Answer nhưng bị format nhầm thành "Choose two" trong dump?_
- Hoặc đáp án là B và D?
- Tuy nhiên, một format thường thấy khác:
  - Step 1: Create Backup Plan/Policy.
  - Step 2: Configure Copy Cross-Region.
- Trong context AWS, **AWS Backup** (D) được ưu tiên hơn DLM (B) cho Enterprise DR strategy.
- Nếu bắt buộc chọn 2, tôi sẽ chọn **D** (AWS Backup solution) và có thể **B** (DLM solution) nếu coi là 2 giải pháp khả thi.
- _Correction_: Đọc kỹ Option C: "Create backup vaults in us-west-1 and in us-west-2... Create Lambda". Lambda sai.
- Nếu câu hỏi thực sự là "Choose two", có thể 1 ý về Backup và 1 ý về Restore? Không thấy option Restore.
- Giả sử format đúng, và cần 2 step cho AWS Backup: "Create Vault in Dest" & "Create Plan in Source with Copy". Option D only mentions "Create vault" (singular).
- Tuy nhiên, hãy xem xét **B** và **D**.
  - B: Legacy style (DLM).
  - D: Modern style (AWS Backup).
- _Decision_: Dựa trên các đề thi patterns, câu này thường là **Option D** nếu là Single Choice. Nếu buộc chọn 2, có thể là **B và D** (2 cách đều làm được). Hoặc có thể đề bị lỗi type. Tôi sẽ giải thích theo hướng **AWS Backup (D)** là best practice, nhưng mention **DLM (B)** cũng work.

_(Self-correction: Có thể câu hỏi gốc là "Choose one" nhưng bank ghi "Choose two". Hoặc đáp án là B và ...? No, D is better. I will assume Single Choice usually, but provide logic for both. Let's pick D as primary)._
_Update_: Nhiều dump source chọn **D**. Có thể "Choose two" là typo. Hoặc chọn "Create Vault in both regions" (nhưng C có Lambda sai).
_Let's check Option A again_: "Copy image on demand" -> Không automate DR.
_Verdict_: Best is **D**. (AWS Backup handles everything including copy).

---

## Câu 509

**Đề bài**:  A company operates a two-tier application for image processing. The application uses two Availability Zones, each with one public subnet and one private subnet. An Application Load Balancer (ALB) for the web tier uses the public subnets. Amazon EC2 instances for the application tier use the private subnets. Users report that the application is running more slowly than expected. A security audit of the web server log files shows that the application is receiving millions of illegitimate requests from a small number of IP addresses. A solutions architect needs to resolve the immediate performance problem while the company investigates a more permanent solution. What should the solutions architect recommend to meet this requirement?

**Các đáp án**:

- A. Security Group (Cannot Deny. SG is Allow Only).
- B. **Network ACL** (Simulaing "Block IP"). **Inbound Deny Rule**.
- C. SG App Tier (Traffic goes through ALB -> Web -> App. Blocking at App tier is too late/wrong source IP if ALB preserves it? No, ALB changes Source IP usually unless preserved. But blocking at Web Tier is better).
- D. NACL App Tier (Same logic).

**Phân tích**:

- Security Group **KHÔNG CÓ DENY RULE**. Chỉ có Allow.
- **Network ACL (NACL)** có Allow và **DENY**.
- Để chặn ngay lập tức 1 số IP cụ thể: Add **Deny Rule** vào **NACL** của subnet (Public Subnet/Web Tier).

**Đáp án đúng**: **B**

---

## Câu 510

**Đề bài**:  A global marketing company has applications that run in the ap-southeast-2 Region and the eu-west-1 Region. Applications that run in a VPC in euwest-1 need to communicate securely with databases that run in a VPC in ap-southeast-2. Which network design will meet these requirements?

**Các đáp án**:

- A. VPC Peering. SG rule allow IP... (Inter-region VPC peering works. Security Groups reference "IP addresses" works).
- B/C. VPC Peering... Update route tables. SG rule reference **Security Group ID** of remote region?
  - **Quan trọng**: Security Group Reference (Rule `source: sg-xxxxxxxx`) **KHÔNG hoạt động Cross-Region** (Inter-Region VPC Peering).
  - Với Inter-Region Peering, bạn phải allow **CIDR Block (IP Range)** của VPC đối tác, không thể reference SG ID.
- D. TGW... reference SG ID. (Same limitation. SG ref does not work across regions).

**Phân tích**:

- Chỉ có option A hoặc C là dùng IP addresses.
- Option A: "Create inbound rule in eu-west-1 application SG allows traffic from DB IP?". Sai hướng. App gọi DB -> DB cần Allow Inbound from App.
- Option C: "Create inbound rule in ap-southeast-2 database security group that allows traffic from the eu-west-1 application server **IP addresses**". -> ĐÚNG.

**Đáp án đúng**: **C**

---

## Câu 511

**Đề bài**:  A company is developing software that uses a PostgreSQL database schema. The company needs to configure multiple development environments and databases for the company's developers. On average, each development environment is used for half of the 8-hour workday. Which solution will meet these requirements MOST cost-effectively?

**Các đáp án**:

- A. Aurora (Always on or manual stop/start).
- B. RDS Single-AZ (Manual stop/start feasible, but paying for storage).
- C. **Aurora Serverless** (Auto-pause feature? Or "On-Demand" usually refers to API? Option says "Aurora On-Demand").
  - _Correction_: Likely refers to **Aurora Serverless v1** which can **Pause compute capacity** to zero when no activity.
  - Or Aurora Serverless v2 (scales down to 0.5 ACU but not zero?).
  - Option C text: "Amazon Aurora On-Demand PostgreSQL-Compatible database". Wait, "On-Demand" is pricing model for standard instances. Maybe text meant "Aurora Serverless"?
  - If "Aurora Serverless", it pauses after inactivity. Perfect for "used half of workday".
- D. S3 (Not a database).

**Phân tích context**:

- "Used for half of 8-hour workday" -> Idle 20 hours/day.
- Standard RDS/Aurora trả tiền 24/7 (trừ khi stop script).
- **Aurora Serverless v1** có tính năng **Auto-pause**. Khi dev nghỉ, DB tự tắt (tiền compute = 0). Sáng hôm sau kết nối, DB tự start. Rất tiết kiệm.
- Giả sử Option C ý nói "Aurora Serverless".

**Đáp án đúng**: **C** (assuming it implies Aurora Serverless).

---

## Câu 512

**Đề bài**:  A company uses AWS Organizations with resources tagged by account. The company also uses AWS Backup to back up its AWS infrastructure resources. The company needs to back up all AWS resources. Which solution will meet these requirements with the LEAST operational overhead?

**Các đáp án**:

- A. **AWS Config to identify untagged ... Tag programmatically**. Use tags in backup plan.
- B. ...
- C. Manual review.
- D. Inspector.

**Phân tích**:

- AWS Backup hỗ trợ "Tags" để select resource.
- Để đảm bảo "All AWS resources" được backup, cần gán Tag cho chúng.
- Dùng **AWS Config** (compliance rule `required-tags`) kết hợp **Remediation** (Systems Manager Automation) để tự động gắn Tag cho các resource chưa có Tag. Sau đó AWS Backup plan sẽ tự pick-up dựa trên Tag này. Automation is key.

**Đáp án đúng**: **A** (Or closest automation logic).

---

## Câu 513

**Đề bài**:  A social media company wants to allow its users to upload images in an application that is hosted in the AWS Cloud. The company needs a solution that automatically resizes the images so that the images can be displayed on multiple device types. The application experiences unpredictable traffic patterns throughout the day. The company is seeking a highly available solution that maximizes scalability. What should a solutions architect do to meet these requirements?

**Các đáp án**:

- A. **S3 static website** invokes **Lambda** to resize.
- B. CloudFront -> Step Functions (CloudFront invokes Lambda@Edge or standard Lambda via API GW, not Step Functions directly usually. Also storing in RDS? Images in S3 is better).
- C. EC2 (Not max scalability).
- D. ECS -> SQS -> EC2 (Good decoupling but complex to manage compared to Lambda).

**Đáp án đúng**: **A**

**Giải thích chi tiết**:

- **A - ĐÚNG**: **Lambda** là giải pháp tốt nhất cho image resizing (Event-driven S3 trigger).
  - User upload S3 -> S3 Event trigger Lambda -> Lambda resize & save to S3.
  - Scalability tuyệt đối (Lambda scales automatically). S3 static web hosting serve frontend.

---

## Câu 514

**Đề bài**:  A company is running a microservices application on Amazon EC2 instances. The company wants to migrate the application to an Amazon Elastic Kubernetes Service (Amazon EKS) cluster for scalability. The company must configure the Amazon EKS control plane with endpoint private access set to true and endpoint public access set to false to maintain security compliance. The company must also put the data plane in private subnets. However, the company has received error notifications because the node cannot join the cluster. Which solution will allow the node to join the cluster?

**Các đáp án**:

- A. IAM permissions (Nodes use role, correct, but usually connectivity is the issue with private endpoint).
- B. **Create interface VPC endpoints**...
- C. Nodes in public subnet (Violates requirement).
- D. SG Outbound...

**Giải thích**:

- Khi **Public Access = False**, Control Plane không thể truy cập qua Internet.
- Worker Nodes (trong Private Subnet) cần giao tiếp với Control Plane (managed by AWS).
- Nếu tắt Public Access, Nodes phải giao tiếp qua **Private Endpoint** (Elastic Network Interfaces trong VPC).
- Thông thường EKS tự quản lý ENI cho Cluster Endpoint.
- Tuy nhiên, nếu Nodes không join được, nguyên nhân phổ biến là DNS resolution hoặc routing.
- Nhưng Option B đề cập "Interface VPC Endpoints" (PrivateLink). EKS Private Cluster thường cần Endpoint cho các AWS Service khác (ECR, STS, S3) để Node có thể pull image/authen nếu không có NAT Gateway.
- Nhưng để "Access Control Plane", EKS Private Endpoint có sẵn trong VPC.
- _Re-evaluate_: Có thể vấn đề là Node không ra được Internet (Private Subnet, no NAT?) và cũng không access được AWS Services cần thiết để bootstrap (như STS, ECR). EKS Nodes cần access endpoint của EKS service.
- **Official AWS EKS Private Cluster Guide**: Cần VPC Endpoints cho: `ecr.api`, `ecr.dkr`, `ec2`, `sts`, `s3` (can use Gateway), `logs` (optional).
- Option B "Create interface VPC endpoints **to allow nodes to access the control plane**". (Actually control plane endpoint is injected into VPC DNS).
- Tuy nhiên, câu hỏi cụ thể "allow node to join". Node cần gọi API server. Nếu Private Access True, DNS resolve API Server về Private IP trong VPC.
- Vấn đề có thể là thiếu route/connectivity tới Service endpoint khác?
- Hoặc đơn giản: Nếu Cluster dùng Private endpoint only, request từ Node (kubelet) ok. Nhưng nếu thiếu VPC Endpoint cho STS/EC2 (để xác thực), nó cũng fail.
- Trong các option, **B** là hành động cấu hình architecture hợp lý nhất cho Private Cluster (enable PrivateLink endpoints).

**Đáp án đúng**: **B**

---

## Câu 515

**Đề bài**:  A company is migrating an on-premises application to AWS. The company wants to use Amazon Redshift as a solution. Which use cases are suitable for Amazon Redshift in this scenario? (Choose three.)

**Các đáp án**:

- A. Data APIs (Redshift Data API exists).
- B. Client/Server encryption (Supported).
- C. **Analytics workloads**... (Core use case: Data Warehousing/Analytics).
- D. Caching... (Not Redshift job).
- E. Scaling globally... (Redshift is regional, though Sharing data exists, "Global scaling tens of millions requests" sounds like DynamoDB).
- F. Secondary replica... (Cross-region snapshot/RA3 features exist).

**Wait**, "Tens of millions of requests per minute" (Option E) -> Definitely NOT Redshift (OLAP). That's DynamoDB (OLTP/KV).
"Caching" (Option D) -> ElastiCache/DAX.
So eliminate D & E.
Candidate: **A, B, C, F**.

- **C** is obvious (Analytics).
- **A** (Data API) simplify access from Lambda/AppSync. Good fit.
- **B** (Encryption) Standard security.
- **F** (Secondary replica)? Redshift support Cross-region snapshot copy, or Data Sharing. "Secondary replica by console" is typical RDS feature, but Redshift RA3 has Cross-region datasharing.
- However, A, B, C seems strongest for generic capabilities.

**Đáp án đúng**: **A, B, C**

---

## Câu 516

**Đề bài**:  A company provides an API interface to customers so the customers can retrieve their financial information. Еhe company expects a larger number of requests during peak usage times of the year. The company requires the API to respond consistently with low latency to ensure customer satisfaction. The company needs to provide a compute host for the API. Which solution will meet these requirements with the LEAST operational overhead?

**Các đáp án**:

- A. ECS (Manage capacity/scaling policies).
- B. **API Gateway + Lambda with Provisioned Concurrency**.
- C. EKS (High overhead).
- D. API Gateway + Lambda with Reserved Concurrency.

**Phân tích**:

- **Operational Efficiency**: Serverless (API GW + Lambda) > ECS/EKS.
- **Consistent Low Latency** (avoid Cold Starts): Use **Provisioned Concurrency**.
- Reserved Concurrency (Option D) chỉ là limit max instances, không giải quyết cold start (latency guarantee). **Provisioned** mới là giữ ấm instances.

**Đáp án đúng**: **B**

---

## Câu 517

**Đề bài**:  A company wants to send all AWS Systems Manager Session Manager logs to an Amazon S3 bucket for archival purposes. Which solution will meet this requirement with the MOST operational efficiency?

**Các đáp án**:

- A. **Enable S3 logging in Systems Manager console**. Choose bucket.
- B. CW Agent -> CW Logs -> Export (Multiple steps).
- C. EventBridge custom doc (Complex).
- D. CW Agent... (Complex).

**Đáp án đúng**: **A**

**Giải thích chi tiết**:

- **A - ĐÚNG**: **Session Manager** Preference settings cho phép chọn trực tiếp S3 Bucket (hoặc CloudWatch Logs) để stream session log vào. Chỉ cần tích chọn trong Console.

---

## Câu 518

**Đề bài**:  An application uses an Amazon RDS MySQL DB instance. The RDS database is becoming low on disk space. A solutions architect wants to increase the disk space without downtime. Which solution meets these requirements with the LEAST amount of effort?

**Các đáp án**:

- A. **Enable storage autoscaling in RDS**.
- B. Increase instance size (Downtime).
- C. Provisioned IOPS (Storage type, not size).
- D. Backup/Restore (Downtime).

**Giải thích**:

- RDS support **Storage Autoscaling**. Tự động tăng size khi đầy. Zero downtime. Zero admin effort after config.
- Hoặc có thể "Modify DB Instance" tăng storage manually (cũng Zero downtime với EBS volume modification support), nhưng Autoscaling (A) là "Least effort" longterm.

**Đáp án đúng**: **A**

---

## Câu 519

**Đề bài**:  A consulting company provides professional services to customers worldwide. The company provides solutions and tools for customers to expedite gathering and analyzing data on AWS. The company needs to centrally manage and deploy a common set of solutions and tools for customers to use for self-service purposes. Which solution will meet these requirements?

**Các đáp án**:

- A. CloudFormation templates (Manual share, no governance layer).
- B. **Create AWS Service Catalog products**.
- C. SSM templates...
- D. Config items...

**Đáp án đúng**: **B**

**Giải thích chi tiết**:

- **B - ĐÚNG**: **Service Catalog**.
  - Cho phép tổ chức tạo "Portfolio" các sản phẩm (CloudFormation stacks) được approve.
  - User (Customers/Internal teams) có thể **Self-service** launch các sản phẩm này mà không cần quyền sâu vào underlying services.

---

## Câu 520

**Đề bài**:  A company is designing a new web application that will run on Amazon EC2 Instances. The application will use Amazon DynamoDB for backend data storage. The application traffic will be unpredictable. The company expects that the application read and write throughput to the database will be moderate to high. The company needs to scale in response to application traffic. Which DynamoDB table configuration will meet these requirements MOST cost-effectively?

**Các đáp án**:

- A. Provisioned + Auto Scaling.
- B. On-demand.
- C. **Provisioned (Standard-IA)**... (IA for accessing data infrequently. Here throughput is "moderate to high" -> Frequent access implies Standard Class).
- D. On-demand (Standard-IA).

**Phân tích**:

- "Traffic unpredictable" + "Scale in response".
- **On-demand** mode (B/D) là tốt nhất cho unpredictable traffic (pay per request, accommodate peaks immediately).
- Tuy nhiên, **Provisioned + Auto Scaling** (A) thường **RẺ HƠN** On-demand nếu traffic có pattern nhất định hoặc throughput cao liên tục ("moderate to high"). On-demand đắt hơn Provisioned khoảng 5-7 lần/request units.
- Auto Scaling giúp Provisioned mode scale theo traffic.
- Nhưng On-Demand phù hợp với "completely unpredictable spikes" that Auto Scaling can't catch up to.
- Câu này keyword: "Moderate to high throughput". Khi volume lớn, On-demand rất đắt. Provisioned + Auto Scaling là "Most Cost-Effective".
- "Standard" vs "Standard-IA": App access backend data -> Thường là hot data -> **Standard** (A/B). IA dùng cho data lưu lâu ít đọc (log, chat history cũ).
- Vậy chọn **A** (Provisioned + Auto Scaling).

**Đáp án đúng**: **A**

---

## Câu 521

**Đề bài**:  A retail company has several businesses. The IT team for each business manages its own AWS account. Each team account is part of an organization in AWS Organizations. Each team monitors its product inventory levels in an Amazon DynamoDB table in the team's own AWS account. The company is deploying a central inventory reporting application into a shared AWS account. The application must be able to read items from all the teams' DynamoDB tables. Which authentication option will meet these requirements MOST securely?

**Các đáp án**:

- A. Secrets Manager... (DynamoDB uses IAM, not secrets/passwords usually).
- B. IAM User (Long-term creds -> Check Security -> Bad).
- C. **IAM Role (Cross-Account)**. Inventory App Role assumes BU_ROLE in member accounts.
- D. ACM Certificates (Not used for DynamoDB auth).

**Đáp án đúng**: **C**

**Giải thích chi tiết**:

- **C - ĐÚNG**: Use **IAM Roles** and **sts:AssumeRole**. (Cross-account pattern). No secrets management needed. Temporary credentials.

---

## Câu 522

**Đề bài**:  A company runs container applications by using Amazon Elastic Kubernetes Service (Amazon EKS). The company's workload is not consistent throughout the day. The company wants Amazon EKS to scale in and out according to the workload. Which combination of steps will meet these requirements with the LEAST operational overhead? (Choose two.)

**Các đáp án**:

- A. Lambda resizing (Custom, high overhead).
- B. **Kubernetes Metrics Server** + **HPA** (Horizontal Pod Autoscaler).
- C. **Kubernetes Cluster Autoscaler**.
- D. API Gateway...
- E. App Mesh...

**Giải thích**:

- Scaling EKS có 2 levels:
  1. **Pod Scaling**: Dùng **HPA** (cần Metrics Server) để tăng giảm số lượng Pods dựa trên CPU/RAM. (Option B).
  2. **Node Scaling**: Dùng **Cluster Autoscaler** (hoặc Karpenter) để tăng giảm số lượng Nodes khi Pods pending/idle. (Option C).

**Đáp án đúng**: **B, C**

---

## Câu 523

**Đề bài**:  A company runs a microservice-based serverless web application. The application must be able to retrieve data from multiple Amazon DynamoDB tables A solutions architect needs to give the application the ability to retrieve the data with no impact on the baseline performance of the application. Which solution will meet these requirements in the MOST operationally efficient way?

**Các đáp án**:

- A. Glue + Scripts (Custom).
- B. Batch + Scripts (Custom).
- C. **Athena queries**.
- D. QuickSight (Needs SPICE data prep, dashboarding focus).

**Đáp án đúng**: **C**

**Giải thích chi tiết**:

- **C - ĐÚNG**: **Amazon Athena** có thể query trực tiếp JSON logs của CloudTrail trong S3 bằng SQL. Rất nhanh và standard để investigate logs.

---

## Câu 525

**Đề bài**:  A company wants to add its existing AWS usage cost to its operation cost dashboard. A solutions architect needs to recommend a solution that will give the company access to its usage cost programmatically. The company must be able to access cost data for the current year and forecast costs for the next 12 months. Which solution will meet these requirements with the LEAST operational overhead?

**Các đáp án**:

- A. **AWS Cost Explorer API**.
- B. CSV Download (Not programmatic).
- C. Budgets Action (Alerting, not raw data api).
- D. Budgets Reports (SMTP/Email).

**Đáp án đúng**: **A**

**Giải thích chi tiết**:

- **A - ĐÚNG**: **Cost Explorer API** cung cấp endpoints (`GetCostAndUsage`, `GetCostForecast`...) để lấy dữ liệu cost và forecast programmatically.

---

## Câu 526

**Đề bài**:  A solutions architect is reviewing the resilience of an application. The solutions architect notices that a database administrator recently failed over the application's Amazon Aurora PostgreSQL database writer instance as part of a scaling exercise. The failover resulted in 3 minutes of downtime for the application. Which solution will reduce the downtime for scaling exercises with the LEAST operational overhead?

**Các đáp án**:

- A. More read replicas (Doesn't help failover time much).
- B. Secondary Cluster (Global DB failover also takes time).
- C. ElastiCache (Caching, doesn't solve DB writer failover).
- D. **RDS Proxy**.

**Đáp án đúng**: **D**

**Giải thích chi tiết**:

- **D - ĐÚNG**: **Amazon RDS Proxy**.
  - Giúp giảm thời gian failover lên tới **66%**.
  - Proxy giữ connection từ App không bị đứt khi DB instance đang reboot/failover. Khi DB mới lên, Proxy resume connection. (Bypass DNS caching issues).

---

## Câu 527

**Đề bài**:  A company has a regional subscription-based streaming service that runs in a single AWS Region. The architecture consists of web servers and application servers on Amazon EC2 instances. The EC2 instances are in Auto Scaling groups behind Elastic Load Balancers. The architecture includes an Amazon Aurora global database cluster that extends across multiple Availability Zones. The company wants to expand globally and to ensure that its application has minimal downtime. Which solution will provide the MOST fault tolerance?

**Các đáp án**:

- A. **Extend ASG**. **Aurora Global DB**. **Route 53 Failover**.
- B. Cross-region Replica (Manual promotion script?). Global DB is better managed.
- C. DMS (Manual).
- D. Similar to A? "Deploy web tier... Use Aurora global database... Promote secondary".
  - Difference A vs D: A says "Extend ASG... deploy in AZ in 2nd Region". D says "Deploy web tier... to a second Region".
  - Technically, ASG is regional. You cannot "Extend" an ASG to another Region. You must create a _new_ ASG in the 2nd Region.
  - Option **D** is correct phrasing: "Deploy... into a second Region" (implied new stack). Aurora Global DB manages data. Route 53 manages traffic.

**Đáp án đúng**: **D**

---

## Câu 528

**Đề bài**:  A data analytics company wants to migrate its batch processing system to AWS. The company receives thousands of small data files periodically during the day through FTP. An on-premises batch job processes the data files overnight. However, the batch job takes hours to finish running. The company wants the AWS solution to process incoming data files as soon as possible with minimal changes to the FTP clients that send the files. The solution must delete the incoming data files after the files have been processed successfully. Processing for each file needs to take 3-8 minutes. Which solution will meet these requirements in the MOST operationally efficient way?

**Các đáp án**:

- A/B. FTP Server on EC2 (Manage server).
- C/D. **AWS Transfer Family**. (Managed FTP).
  - **C**: Store on EBS? Transfer Family usually backs to S3 (Standard). S3 Event -> Batch.
  - **D**: Transfer Family -> **S3 Standard**. **S3 Event -> Lambda**. Lambda process & delete.
- Process time "3-8 minutes". Lambda max timeout 15 mins. OK.
- "Delete after processed". Lambda can do `s3.delete_object`.
- Operational efficient: Serverless (Transfer + S3 + Lambda) > Batch/EC2.

**Đáp án đúng**: **D**

---

## Câu 529

**Đề bài**:  A company is migrating its workloads to AWS. The company has transactional and sensitive data in its databases. The company wants to use AWS Cloud solutions to increase security and reduce operational overhead for the databases. Which solution will meet these requirements?

**Các đáp án**:

- A. EC2 (High overhead).
- B. **Migrate to RDS**. **Configure encryption at rest**. (Managed, Secure).
- C. Macie (For S3, not Databases).
- D. CloudWatch Logs (Not for DB protection).

**Đáp án đúng**: **B**

---

## Câu 530

**Đề bài**:  A company has an online gaming application that has TCP and UDP multiplayer gaming capabilities. The company uses Amazon Route 53 to point the application traffic to multiple Network Load Balancers (NLBs) in different AWS Regions. The company needs to improve application performance and decrease latency for the online game in preparation for user growth. Which solution will meet these requirements?

**Các đáp án**:

- A. CloudFront (No UDP).
- B. ALB (No UDP).
- C. **AWS Global Accelerator**.
- D. API Gateway (HTTP/WebSocket only).

**Đáp án đúng**: **C**

**Giải thích chi tiết**:

- **C - ĐÚNG**: **Global Accelerator** support TCP/UDP. Route traffic qua AWS global backbone, giảm latency và jitter cho Gaming.

---

## Câu 531

**Đề bài**:  A company needs to integrate with a third-party data feed. The data feed sends a webhook to notify an external service when new data is ready for consumption. A developer wrote an AWS Lambda function to retrieve data when the company receives a webhook callback. The developer must make the Lambda function available for the third party to call. Which solution will meet these requirements with the MOST operational efficiency?

**Các đáp án**:

- A. **Lambda Function URL**.
- B. ALB (Extra resource).
- C. SNS (Async push? Webhook sender expects HTTP endpoint. SNS HTTPS endpoint possible but complex flow).
- D. SQS (Not HTTP endpoint directly exposed).

**Đáp án đúng**: **A**

**Giải thích chi tiết**:

- **A - ĐÚNG**: **Lambda Function URLs**. Tính năng mới (2022) cho phép tạo HTTP(S) Endpoint trực tiếp cho Lambda mà không cần API Gateway hay ALB. Rất đơn giản (Simple Tick box).

---

## Câu 532

**Đề bài**:  A company has a workload in an AWS Region. Customers connect to and access the workload by using an Amazon API Gateway REST API. The company uses Amazon Route 53 as its DNS provider. The company wants to provide individual and secure URLs for all customers. Which combination of steps will meet these requirements with the MOST operational efficiency? (Choose three.)

**Các đáp án**:

- A. Register... Wildcard custom domain in Route 53 (Alias to API GW).
- B/D. Request **Wildcard Certificate** in ACM. (Must be in same Region). -> **D**.
- F. Create **Custom Domain Name** in API Gateway. Import ACM cert.
- C. Create hosted zones... (Too manual).
- E. Multiple API endpoints (Too manual).

**Quy trình đúng**:

1. **D**: Request Wildcard Cert (`*.api.com`) in ACM (Region matches API GW).
2. **F**: Create "Custom Domain Name" in API Gateway (`*.api.com` or specific).
3. **A**: Route 53 Wildcard Record (`*.api.com`) point to API GW Domain. (Map customer ID via path or logic).
    - Wait, requirement "Individual URLs". `cust1.domain.com`.
    - API Gateway support **Wildcard Custom Domain Names**.
    - Config: `*.example.com` -> API Gateway. App logic parse Host header.
    - Steps: A (Route 53), D (ACM in same region), F (API GW Custom Domain).

**Đáp án đúng**: **A, D, F**

---

## Câu 533

**Đề bài**:  A company stores data in Amazon S3. According to regulations, the data must not contain personally identifiable information (PII). The company recently discovered that S3 buckets have some objects that contain PII. The company needs to automatically detect PII in S3 buckets and to notify the company’s security team. Which solution will meet these requirements?

**Các đáp án**:

- A. **Macie** -> EventBridge -> **SNS**.
- B. GuardDuty (Threat detection, not PII scan).
- C. Macie -> SQS (Queue, not direct notification usually requested? SNS is for "Notify").
- D. GuardDuty...

**Đáp án đúng**: **A**

---

## Câu 534

**Đề bài**:  A company wants to build a logging solution for its multiple AWS accounts. The company currently stores the logs from all accounts in a centralized account. The company has created an Amazon S3 bucket in the centralized account to store the VPC flow logs and AWS CloudTrail logs. All logs must be highly available for 30 days for frequent analysis, retained for an additional 60 days for backup purposes, and deleted 90 days after creation. Which solution will meet these requirements MOST cost-effectively?

**Các đáp án**:

- A. S3 Standard 30 days -> Delete 90 days. (Keeps Standard for 90 days? Expensive).
- B. **Standard-IA after 30 days**? (Min duration 30 days. OK). **Glacier after 90 days**? (Question says "Delete 90 days after creation").
  - Wait. "Retained for an additional 60 days... deleted 90 days after creation".
  - Timeline:
    - 0-30 days: Standard (Frequent analysis).
    - 30-90 days: Backup purpose (Infrequent). Move to IA or Glacier?
    - 90 days: Delete.
  - Option B attempts to move to Glacier "after 90 days". And Delete "after 90 days". Redundant/Conflict.
- C. Move to Glacier Flexible after 30 days. Delete after 90.
  - Glacier is cheaper than IA. "Backup purposes" usually implies Glacier.
  - Is "Standard-IA" allowed? Option D suggests One Zone-IA.
  - Let's check Option AB again.
  - A: Keep Standard entire time. Expensive.
  - C: Move to **Glacier** (Flexible Retrieval) after 30 days. Cheap. Good for "Backup".
  - Logs (Flow Logs/CloudTrail) are small objects? Transitions might have cost.
  - But generally, Standard -> Glacier is standard pattern for cost.

**Đáp án đúng**: **C** (Standard 30 days -> Glacier 60 days -> Expire).

---

## Câu 535

**Đề bài**:  A company is building an Amazon Elastic Kubernetes Service (Amazon EKS) cluster for its workloads. All secrets that are stored in Amazon EKS must be encrypted in the Kubernetes etcd key-value store. Which solution will meet these requirements?

**Các đáp án**:

- A. Secrets Manager (External).
- B. **Enable Amazon EKS KMS secrets encryption**.
- C. EBS Encryption (Disk level, not etcd application level).
- D. ...

**Đáp án đúng**: **B**

**Giải thích chi tiết**:

- **B - ĐÚNG**: EKS có tính năng **Envelope Encryption of Kubernetes Secrets**. Bạn cung cấp KMS Key, EKS sẽ dùng nó để mã hóa các Secret khi lưu vào etcd.

---

## Câu 536

**Đề bài**:  A company wants to provide data scientists with near real-time read-only access to the company's production Amazon RDS for PostgreSQL database. The database is currently configured as a Single-AZ database. The data scientists use complex queries that will not affect the production database. The company needs a solution that is highly available. Which solution will meet these requirements MOST cost-effectively?

**Các đáp án**:

- A. Scale up (Vertical scaling. Downtime? Still Single AZ? Not HA).
- B. **Single-AZ to Multi-AZ**. Use standby instance? (Standby is NOT readable in RDS, only in Aurora).
- C. **Single-AZ to Multi-AZ**. Create **Read Replicas**. (Replicas are for Read offload. Multi-AZ is for HA). This meets all requirements. Cost?
- D. Single-AZ to Multi-AZ Cluster (likely implies Aurora). "Two readable standby instances". Expensive.

**Phân tích**:

- Requirement 1: Read-only access for heavy queries -> Cần **Read Replica** để offload.
- Requirement 2: Highly Available -> Cần **Multi-AZ**.
- Solution: Convert Primary to Multi-AZ. Add a Read Replica.
- Option C: "Single-AZ to Multi-AZ... Two additional read replicas". (Maybe 1 is enough, but process is correct).
- Is there a better option?
  - Nếu dùng **Aurora** (Option D hints at cluster), Reader is also Failover target. Highly Available & Readable. Aurora might be more cost effective than RDS Multi-AZ + Extra Replica?
  - RDS Multi-AZ Standby is idle (cannot read). So you pay for 2 instances (Primary + Standby) + 1 instance (Replica) = 3 instances.
  - Aurora: 1 Writer + 1 Reader. Reader _is_ the redundancy. So pay for 2 instances.
  - **Aurora** efficient hơn cho case "HA + Read Scaling".
  - Option D: "Change to Multi-AZ cluster... two readable standby". (3 nodes total).
  - Option B: "Multi-AZ... with larger secondary standby". RDS Standby cannot be read.
  - Option C: "Multi-AZ... two read replicas".
  - Wait, can we use **Read Replica** as DR target? Yes, but auto-failover is manual promotion unless Aurora.
  - However, standard answers favor explicit service features.
  - Nếu đề bài bắt buộc "RDS for PostgreSQL" (không nói migrate sang Aurora), thì **C** là valid (Multi-AZ for HA, Replica for Read).
  - Nếu được đổi sang Aurora, D ngon hơn. Nhưng đề bài: "The company's production Amazon RDS for PostgreSQL database". Switch to Aurora is a migration. Usually "Change setup" implies within RDS options unless specified.
  - So sticking with RDS: **C**. (Multi-AZ ensures HA. Replicas ensure Read/Performance isolation).

**Đáp án đúng**: **C**

---

## Câu 537

**Đề bài**:  A company runs a three-tier web application in the AWS Cloud that operates across three Availability Zones. The application architecture has an Application Load Balancer, an Amazon EC2 web server that hosts user session states, and a MySQL database that runs on an EC2 instance. The company expects sudden increases in application traffic. The company wants to be able to scale to meet future application capacity demands and to ensure high availability across all three Availability Zones. Which solution will meet these requirements?

**Các đáp án**:

- A. RDS MySQL Multi-AZ. Redis HA. **Web Server ASG in 3 AZs**. (Phủ đủ 3 AZ).
- B. Memcached (No Replication/HA natively like Redis Cluster/Replica Group. Redis is better for "High Availability").
- C. DynamoDB (Re-architect).
- D. RDS Single-AZ (No HA).

**Đáp án đúng**: **A**

**Giải thích chi tiết**:

- **A - ĐÚNG**:
  - **RDS Multi-AZ**: DB HA.
  - **Redis HA** (Cluster Mode / Replication Group): Session HA.
  - **ASG 3 AZs**: Web HA.

---

## Câu 538

**Đề bài**:  A global video streaming company uses Amazon CloudFront as a content distribution network (CDN). The company wants to roll out content in a phased manner across multiple countries. The company needs to ensure that viewers who are outside the countries to which the company rolls out content are not able to view the content. Which solution will meet these requirements?

**Các đáp án**:

- A. **Geographic restrictions (Geo Blocking) in CloudFront** using **Waitlist** or **Allow List**.
- B. Signed URLs (For authorization, not Geo specifically).
- C. ...
- D. ...

**Đáp án đúng**: **A**

**Giải thích chi tiết**:

- **A - ĐÚNG**: CloudFront **Geo Restriction** (Allow List). Chỉ cho phép request từ các nước trong Allow List (những nước đã rollout). Các nước khác sẽ bị block (Custom error message).

---

## Câu 539

**Đề bài**:  A company wants to use the AWS Cloud to improve its on-premises disaster recovery (DR) configuration. The company's core production business application uses Microsoft SQL Server Standard, which runs on a virtual machine (VM). The application has a recovery point objective (RPO) of 30 seconds or fewer and a recovery time objective (RTO) of 60 minutes. The DR solution needs to minimize costs wherever possible. Which solution will meet these requirements?

**Các đáp án**:

- A. Enterprise Always On (Expensive License).
- B. Warm Standby (Paying for instance 24/7. Not minimize cost).
- C. **AWS Elastic Disaster Recovery (AWS DRS)**. Pilot Light.
- D. Backup (Can RPO be 30 secs with nightly backup? No).

**Đáp án đúng**: **C**

**Giải thích chi tiết**:

- **C - ĐÚNG**: **AWS DRS** (block-level replication).
  - Continuous Data Replication -> RPO seconds.
  - "Pilot Light": Chỉ chạy Replication Instanes siêu nhỏ. Khi Disaster xảy ra mới launch Full instance -> **Minimize Costs**.

---

## Câu 540

**Đề bài**:  A company has an on-premises server that uses an Oracle database to process and store customer information. The company wants to use an AWS database service to achieve higher availability and to improve application performance. The company also wants to offload reporting from its primary database system. Which solution will meet these requirements in the MOST operationally efficient way?

**Các đáp án**:

- A. DMS... (Complex sync).
- B. RDS Single-AZ (Not HA).
- C. **RDS Multi-AZ**. **Use reader instance**? (RDS Multi-AZ Standby cannot be read! Only Aurora can read Standby/Reader).
- D. **Migrate to Aurora**. Use **Multi-AZ**. Direct reporting to **Reader Instances**.

**Phân tích**:

- Như đã phân tích ở câu 536: RDS Oracle Multi-AZ Standby không cho read.
- Phải dùng **Read Replica** với RDS Oracle. Or Migrate to **Aurora**.
- Option C nói "RDS Multi-AZ... use reader instance in cluster". Valid phrasing for **Aurora** (Aurora is part of RDS family loosely, but distinct). Strictly speaking, only Option D mentions "Aurora".
- Option B mentions "Read Replica" but "Single-AZ primary". (Not HA).
- Vậy **D** (Migrate to Aurora) là phương án thỏa mãn cả HA và Offload Read tốt nhất (Aurora Replicas turn into Primary instantly on failover).

**Đáp án đúng**: **D** (Note: Aurora PostgreSQL/MySQL exists. Aurora _does not_ support Oracle engine compatibility directly. Assuming "Oracle to Aurora Migration" is acceptable strategy implies schema conversion. If "Oracle engine" must be kept, then we need RDS Oracle with **Read Replica** (not listed combined with Multi-AZ correctly).
_Wait_, Aurora does NOT support Oracle.
Let's re-read **C**: "Use Amazon RDS in a **Multi-AZ cluster deployment**".
_New Feature Alert_: **Amazon RDS Multi-AZ with Two Readable Standbys**. (Launched late 2020/2021).
Feature này available cho PostgreSQL và MySQL. KHÔNG available cho Oracle. (Oracle dùng Legacy Multi-AZ Mirroring).
Vậy C sai cho Oracle.
Vậy làm sao đáp ứng Oracle?
Option **B**? Single-AZ + Read Replica. -> Offload OK. But HA? Read Replica can be promoted, but auto-failover?
Maybe the question implies migrating Engine? "Company wants to use an AWS database service". Doesn't say "Keep Oracle engine".
If migration allowed -> **D** (Aurora) is best.
If keep Oracle -> RDS Oracle Multi-AZ + Read Replica (Not listed).
However, "Operationally efficient" -> Managed migration to Aurora is often the intended answer in exams for "Modernization".

**Đáp án đúng**: **D** (Assuming modernization to Aurora).

---

## Câu 541

**Đề bài**:  A company wants to build a web application on AWS. Client access requests to the website are not predictable and can be idle for a long time. Only customers who have paid a subscription fee can have the ability to sign in and use the web application. Which combination of steps will meet these requirements MOST cost-effectively? (Choose three.)

**Các đáp án**:

- A. Lambda & API Gateway.
- B. ECS & ALB (Fixed costs).
- C. **Cognito User Pool**. (Authentication).
- D. ...
- E. **Amplify**... **CloudFront** (Frontend hosting).
- F. S3 + CloudFront (Frontend).

**Tổ hợp đúng**:

1. **Serverless Backend**: A (Lambda/API GW).
2. **Authentication**: C (Cognito User Pool handles sign-up/sign-in/groups).
3. **Frontend**: F (S3 Static Hosting + CloudFront). (Amplify E is also good, but S3+CF is classic fundamental block).
    - Let's check "Choose three".
    - A: Backend logic.
    - C: Auth.
    - F: Frontend.
    - This creates a full Serverless Web App architecture.

**Đáp án đúng**: **A, C, F** (or E if preferred by exam generation, usually S3+CF is explicitly separated).

---

## Câu 542

**Đề bài**:  A media company uses an Amazon CloudFront distribution to deliver content over the internet. The company wants only premium customers to have access to the media streams and file content. The company stores all content in an Amazon S3 bucket. The company also delivers content on demand to customers for a specific purpose, such as movie rentals or music downloads. Which solution will meet these requirements?

**Các đáp án**:

- A/B. Signed Cookies / Signed URLs.
  - **Signed URLs**: Tốt cho từng file lẻ (Download movie).
  - **Signed Cookies**: Tốt cho access nhiều file (HLS Streaming segments).
  - Đề bài: "Media streams and file content". Streaming -> Nhiều file .ts -> **Signed Cookies** tiện hơn. "Movie rentals" -> Often implies accessing a folder/path.
  - B is also valid. But Cookies allow cleaner URL capability for streaming players.
  - **C**. OAC (Origin Access Control) restricts S3 to CloudFront only. Does not distinguish Premium vs Non-Premium _User_.
  - **D**. Field level encryption (Sensitive data fields).

**Đáp án đúng**: **A** (Signed Cookies preferred for streaming/multiple files access). **B** also acceptable if single file. _Cookie_ is generally better for "Streaming" use case.

---

## Câu 543

**Đề bài**:  A company runs Amazon EC2 instances in multiple AWS accounts that are individually bled. The company recently purchased a Savings Pian. Because of changes in the company’s business requirements, the company has decommissioned a large number of EC2 instances. The company wants to use its Savings Plan discounts on its other AWS accounts. Which combination of steps will meet these requirements? (Choose two.)

**Các đáp án**:

- A. **Turn on discount sharing** in **Management Account**.
- B. ...
- E. **Join Organization**. The account with SP must be in the Org. "Create an organization... Invite other accounts".

**Quy trình**:

1. Đưa các account vào cùng 1 Organization (Option E: Account có SP tạo Org hoặc join Org).
2. Bật "Discount Sharing" ở Management Account (Option A).

**Đáp án đúng**: **A, E**

---

## Câu 544

**Đề bài**:  A retail company uses a regional Amazon API Gateway API for its public REST APIs. The API Gateway endpoint is a custom domain name that points to an Amazon Route 53 alias record. A solutions architect needs to create a solution that has minimal effects on customers and minimal data loss to release the new version of APIs. Which solution will meet these requirements?

**Các đáp án**:

- A. **Create a canary release deployment stage**. Point percentage of traffic. Promote.
- B. Import YAML... (Metadata update).
- C. ...
- D. New Endpoint... Update Route 53 (Blue/GreenDNS flippping. Potential caching issues key "Minimal data loss" "Minimal effects").

**Phân tích**:

- API Gateway support native **Canary Deployment** trên Stage. Cho phép route X% traffic sang version mới. Test OK -> Promote.
- Đây là cách an toàn và ít impact nhất.

**Đáp án đúng**: **A**

---

## Câu 545

**Đề bài**:  A company wants to direct its users to a backup static error page if the company's primary website is unavailable. The primary website's DNS records are hosted in Amazon Route 53. The domain is pointing to an Application Load Balancer (ALB). The company needs a solution that minimizes changes and infrastructure overhead. Which solution will meet these requirements?

**Các đáp án**:

- A. Latency routing (No).
- B. **Active-passive failover**. Health check ALB. Fallback to S3 static page.
- C. Active-active (No).
- D. Multivalue answer (No).

**Đáp án đúng**: **B**

**Giải thích chi tiết**:

- **B - ĐÚNG**: **Route 53 Failover Routing Policy**.
  - Primary: ALB (Health Check associated).
  - Secondary: S3 Bucket (Static Website).
  - Khi ALB chết, R53 lái traffic sang S3.

---

## Câu 546

**Đề bài**:  A recent analysis of a company's IT expenses highlights the need to reduce backup costs. The company's chief information officer wants to simplify the on-premises backup infrastructure and reduce costs by eliminating the use of physical backup tapes. The company must preserve the existing investment in the on-premises backup applications and workflows. What should a solutions architect recommend?

**Các đáp án**:

- A. NFS (File Gateway).
- B. EFS (No).
- C. EFS iSCSI (No).
- D. **AWS Storage Gateway - Tape Gateway (VTL)**.

**Đáp án đúng**: **D**

**Giải thích chi tiết**:

- **D - ĐÚNG**: **Tape Gateway** (VTL Interface).
  - giả lập thư viện băng từ (Tape Library). App backup cũ (Veritas, Veeam...) nhìn thấy nó như Tape thật. -> **No workflow change**.

---

## Câu 547

**Đề bài**:  A company has data collection sensors at different locations. The data collection sensors stream a high volume of data to the company. The company wants to design a platform on AWS to ingest and process high-volume streaming data. The solution must be scalable and support data collection in near real time. The company must store the data in Amazon S3 for future reporting. Which solution will meet these requirements with the LEAST operational overhead?

**Các đáp án**:

- A. **Kinesis Data Firehose**.
- B. Glide...
- C. Lambda...
- D. DMS...

**Đáp án đúng**: **A** (Firehose is easiest way to dump stream to S3).

---

## Câu 548

**Đề bài**:  A company has separate AWS accounts for its finance, data analytics, and development departments. Because of costs and security concerns, the company wants to control which services each AWS account can use. Which solution will meet these requirements with the LEAST operational overhead?

**Các đáp án**:

- A. SSM templates (No).
- B. **OU + SCPs**. (Standard Org governance).
- C. CloudFormation (Provisioning, not restricting service usage).
- D. Service Catalog (Provisioning).

**Đáp án đúng**: **B**

---

## Câu 549

**Đề bài**:  A company has created a multi-tier application for its ecommerce website. The website uses an Application Load Balancer that resides in the public subnets, a web tier in the public subnets, and a MySQL cluster hosted on Amazon EC2 instances in the private subnets. The MySQL database needs to retrieve product catalog and pricing information that is hosted on the internet by a third-party provider. A solutions architect must devise a strategy that maximizes security without increasing operational overhead. What should the solutions architect do to meet these requirements?

**Các đáp án**:

- A. NAT Instance (High overhead).
- B. **NAT Gateway** in **Public Subnet**. Route Table Private -> NAT GW.
- C. IGW (Public subnet).
- D. VGW (VPN).

**Đáp án đúng**: **B**

---

## Câu 550

**Đề bài**:  A company is using AWS Key Management Service (AWS KMS) keys to encrypt AWS Lambda environment variables. A solutions architect needs to ensure that the required permissions are in place to decrypt and use the environment variables. Which steps must the solutions architect take to implement the correct permissions? (Choose two.)

**Các đáp án**:

- A. Lambda Resource Policy (For who calls Lambda).
- B. **Lambda Execution Role** (Must have `kms:Decrypt`).
- C. ...
- D. **KMS Key Policy** (Must allow Lambda Role to use Key).
- E. ...

**Đáp án đúng**: **B, D** (IAM Role needs permission + Key Policy needs to allow Role).

---
