# AWS Certification Exam Questions 251-300

Tài liệu được biên soạn chi tiết với giải thích bằng tiếng Việt, giúp bạn hiểu sâu về các dịch vụ AWS.

---

## Câu 251

**Đề bài**:  An Amazon EC2 instance is located in a private subnet in a new VPC. This subnet does not have outbound internet access, but the EC2 instance needs the ability to download monthly security updates from an outside vendor. What should a solutions architect do to meet these requirements?

**Các đáp án**:

- A. IGW...
- B. NAT Gateway in Public Subnet. Configure private subnet route table to use NAT gateway.
- C. NAT Instance in same subnet (NAT Instance phải ở Public Subnet mới ra net được).
- D. ...

**Đáp án đúng**: **B**

**Giải thích chi tiết**:

- **B - ĐÚNG**: **NAT Gateway** là giải pháp chuẩn để cho phép instances trong Private Subnet truy cập internet (outbound only) để tải updates/patches, mà không cho phép internet truy cập ngược lại instance.
  - NAT Gateway bắt buộc phải đặt ở **Public Subnet**.
  - Route table của Private Subnet trỏ `0.0.0.0/0` -> NAT Gateway ID.

---

## Câu 252

**Đề bài**:  A solutions architect needs to design a system to store client case files. The files are core company assets and are important. The number of files will grow over time. The files must be simultaneously accessible from multiple application servers that run on Amazon EC2 instances. The solution must have built-in redundancy. Which solution meets these requirements?

**Các đáp án**:

- A. Amazon Elastic File System (Amazon EFS)
- B. EBS (Single instance attach - Multi-attach only for Io2/SR and limited).
- C. Glacier Deep Archive (Archive only).
- D. AWS Backup (Backup service, not storage file system).

**Đáp án đúng**: **A**

**Giải thích chi tiết**:

- **A - ĐÚNG**: **Amazon EFS**.
  - **Simultaneously accessible**: Hỗ trợ hàng nghìn EC2 instance mount cùng lúc (NFS).
  - **Built-in Redundancy**: Data được replicate qua nhiều AZs (Standard Class).
  - Phù hợp lưu trữ file assets cho ứng dụng.

---

## Câu 253

**Đề bài**:  A solutions architect has created two IAM policies: Policy1 and Policy2. Both policies are attached to an IAM group. A cloud engineer is added as an IAM user to the IAM group. Which action will the cloud engineer be able to perform?

**Các đáp án**:

- A. Instance ID source...
- B. Create security group rules using the **security group ID** as the source or destination.
- C. VPC CIDR... (Too open).
- D. Subnet CIDR... (Too open if multiple apps in subnet).

**Đáp án đúng**: **B**

**Giải thích chi tiết**:

- **B - ĐÚNG**: **Security Group Reference**.
  - Thay vì whitelist IP cụ thể (giới hạn mobility) hay CIDR (quá rộng), ta cấu hình SG của App Tier chỉ cho phép inbound từ **SG của Web Tier** (Source: sg-xxxx).
  - Đây là best practice cho "Least Privilege" giữa các application tiers.

---

## Câu 255

**Đề bài**:  A company has an ecommerce checkout workflow that writes an order to a database and calls a service to process the payment. Users are experiencing timeouts during the checkout process. When users resubmit the checkout form, multiple unique orders are created for the same desired transaction. How should a solutions architect refactor this workflow to prevent the creation of multiple orders?

**Các đáp án**:

- A. Firehose... (Stream ingestion, not workflow).
- B. CloudTrail... (Audit logging, not app workflow).
- C. SNS... (Pub/Sub - maybe).
- D. Store the order in the database. Send a message that includes the order number to an Amazon Simple Queue Service (Amazon SQS) FIFO queue. Set the payment service to retrieve the message and process the order. Delete the message from the queue.

**Đáp án đúng**: **D**

**Giải thích chi tiết**:

- **D - ĐÚNG**: Dùng **SQS FIFO Queue**.
  - **Prevent multiple orders**: FIFO Queue hỗ trợ **Deduplication ID**. Nếu user resubmit (gửi cùng Deduplication ID), SQS sẽ loại bỏ message trùng lặp. Payment service chỉ nhận được 1 message duy nhất để xử lý.
  - Decoupling giúp tránh timeout frontend.

---

## Câu 256

**Đề bài**:  A solutions architect is implementing a document review application using an Amazon S3 bucket for storage. The solution must prevent accidental deletion of the documents and ensure that all versions of the documents are available. Users must be able to download, modify, and upload documents. Which combination of actions should be taken to meet these requirements? (Choose two.)

**Các đáp án**:

- A. Read-only ACL (User cần upload/modify -> Sai).
- B. Enable versioning on the bucket.
- C. IAM policy (Để manage permission, ko phải prevent accidental delete cho _authorized_ user tốt bằng MFA).
- D. Enable MFA Delete on the bucket.
- E. KMS...

**Đáp án đúng**: **B, D**

**Giải thích chi tiết**:

- **B - ĐÚNG**: **Versioning**. Khi user ghi đè (modify/upload), S3 tạo version mới, giữ lại version cũ -> "All versions available". Nếu xóa, chỉ tạo Delete Marker, khôi phục được.
- **D - ĐÚNG**: **MFA Delete**. Yêu cầu xác thực MFA token khi thực hiện thao tác xóa vĩnh viễn (Permanently delete) 1 version hoặc thay đổi config versioning. -> "Prevent accidental deletion" mức cao nhất.

---

## Câu 257

**Đề bài**:  A company is building a solution that will report Amazon EC2 Auto Scaling events across all the applications in an AWS account. The company needs to use a serverless solution to store the EC2 Auto Scaling status data in Amazon S3. The company then will use the data in Amazon S3 to provide near-real-time updates in a dashboard. The solution must not affect the speed of EC2 instance launches. How should the company move the data to Amazon S3 to meet these requirements?

**Các đáp án**:

- A. CloudWatch metric stream -> Firehose -> S3.
- B. EMR (Not serverless/heavy).
- C. EventBridge rule -> Lambda -> S3. (Tốt, nhưng Metric Stream + Firehose chuyên dụng cho data flow/analytics dashboard hơn).
- D. Bootstrap script Kinesis Agent (Affect launch speed).

**Đáp án đúng**: **A** (Hoặc C cũng possible, nhưng A là modern approach cho metrics/events streaming to S3/Analytics).
Tuy nhiên, Auto Scaling Events là **Events**, không phải Metrics thuần. EventBridge (C) bắt event tốt hơn.
Nhưng **CloudWatch Metric Stream** cũng stream được metrics liên quan ASG.
Đọc kỹ: "Auto Scaling **status data**". Status thường là Event (Launch/Terminate successes).
CloudWatch Event (EventBridge) bắt "EC2 Instance-launch Lifecycle Action".
Đáp án **A** "Metric stream" có thể convert event thành metric? Không hẳn.
Nhưng nếu dùng **EventBridge (C)**: Lambda invoke per event -> S3.
Có 1 option khác thường gặp trong đề này: **Amazon EventBridge -> Amazon Kinesis Data Firehose -> S3**. (Không cần Lambda).
Trong các option:

- A: Metric stream (Monitor metrics).
- C: Lambda (Compute).
  Giữa A và C: C chính xác hơn về việc capture "Events" (Scaling activities). A capture "Metrics" (GroupSize, CPU...). Đề bài bảo "Auto Scaling events".
  Tuy nhiên, một số nguồn đáp án chọn **A** vì Metric Stream support Firehose direct.
  Nhưng A nói "Metric stream" chứ không phải "Event stream".
  Nếu đề bài là "Auto Scaling Events" -> EventBridge là nguồn. Solution chuẩn là EventBridge -> Firehose -> S3.
  Ở đây không có option đó. Có C: EventBridge -> Lambda -> S3. Lambda serverless, near-real-time. OK.
  Đáp án **D** (Kinesis Agent) chạy trên EC2 -> Setup chậm (Affect launch speed).
  Vậy **C** là hợp lý nhất cho "Events".

---

## Câu 258

**Đề bài**:  A company has an application that places hundreds of .csv files into an Amazon S3 bucket every hour. The files are 1 GB in size. Each time a file is uploaded, the company needs to convert the file to Apache Parquet format and place the output file into an S3 bucket. Which solution will meet these requirements with the LEAST operational overhead?

**Các đáp án**:

- A. Lambda download convert... (Lambda limit 15 mins, memory limit. 1GB CSV process could be heavy/timeout. High risk).
- B. Spark on EMR... (Manage cluster overhead).
- C. Glue Crawler + Lambda query Athena CTAS... (Complex architecture).
- D. Create an AWS Glue extract, transform, and load (ETL) job to convert the .csv files to Parquet format and place the output files into an S3 bucket. Create an AWS Lambda function for each S3 PUT event to invoke the ETL job.

**Đáp án đúng**: **D**

**Giải thích chi tiết**:

- **D - ĐÚNG**: **Glue ETL Job** chuyên trị Heavy Transformation (1GB CSV -> Parquet). Serverless, Scaling tốt hơn Lambda cho long-running/heavy Jobs.
  - Trigger bằng **S3 Event -> Lambda -> StartGlueJob** là pattern chuẩn để automate qui trình này (Event-driven ETL).

---

## Câu 259

**Đề bài**:  A company is implementing new data retention policies for all databases that run on Amazon RDS DB instances. The company must retain daily backups for a minimum period of 2 years. The backups must be consistent and restorable. Which solution should a solutions architect recommend to meet these requirements?

**Các đáp án**:

- A. AWS Backup plan daily, expire 2 years...
- B. Backup window... (RDS automated backup retention maximum is 35 days). So B is impossible natively. DLM is for EBS mostly (RDS support added later but AWS Backup is superior).
- C. Transaction logs... (Logs alone not enough).
- D. DMS...

**Đáp án đúng**: **A**

**Giải thích chi tiết**:

- **A - ĐÚNG**: **AWS Backup**.
  - Centralized backup management.
  - Hỗ trợ backup RDS với retention period dài hạn (tính bằng năm).
  - RDS Automated Backup native chỉ max 35 ngày. Muốn giữ 2 năm bắt buộc dùng Manual Snapshot hoặc AWS Backup. AWS Backup tự động hóa việc tạo snapshot và quản lý lifecycle (expire after 2 years).

---

## Câu 260

**Đề bài**:  A company’s compliance team needs to move its file shares to AWS. The shares run on a Windows Server SMB file share. A self-managed onpremises Active Directory controls access to the files and folders. The company wants to use Amazon FSx for Windows File Server as part of the solution. The company must ensure that the on-premises Active Directory groups restrict access to the FSx for Windows File Server SMB compliance shares, folders, and files after the move to AWS. The company has created an FSx for Windows File Server file system. Which solution will meet these requirements?

**Các đáp án**:

- A. AD Connector...
- B. Tags...
- C. IAM...
- D. Join the file system to the Active Directory to restrict access.

**Đáp án đúng**: **D**

**Giải thích chi tiết**:

- **D - ĐÚNG**: **FSx for Windows File Server** hỗ trợ integration trực tiếp với **Microsoft Active Directory** (Managed AD hoặc Self-managed AD).
  - Khi **Join** FSx vào Domain, bạn có thể dùng **Standard Windows ACLs (NTFS permissions)** để phân quyền folder/file cho các AD Users/Groups y hệt như file server truyền thống. Không cần mapping sang IAM.

---

## Câu 261

**Đề bài**:  A company recently announced the deployment of its retail website to a global audience. The website runs on multiple Amazon EC2 instances behind an Elastic Load Balancer. The instances run in an Auto Scaling group across multiple Availability Zones. The company wants to provide its customers with different versions of content based on the devices that the customers use to access the website. Which combination of actions should a solutions architect take to meet these requirements? (Choose two.)

**Các đáp án**:

- A. CloudFront cache multiple versions...
- B. ...
- C. Configure a Lambda@Edge function to send specific objects to users based on the User-Agent header.
- D. ...
- E. ...

**Đáp án đúng**: **A, C**

**Giải thích chi tiết**:

- **C - ĐÚNG**: **Lambda@Edge** (Viewer Request/Origin Request) có thể inspect **User-Agent Header** để xác định device type, sau đó rewrite URL hoặc modify request để fetch đúng version (mobile/desktop).
- **A - ĐÚNG**: **CloudFront** cần được cấu hình để cache các version khác nhau dựa trên Header (Whitelist User-Agent hoặc custom header do Lambda thêm vào). Nếu không CloudFront sẽ cache 1 version cho mọi device.

---

## Câu 262

**Đề bài**:  A company plans to use Amazon ElastiCache for its multi-tier web application. A solutions architect creates a Cache VPC for the ElastiCache cluster and an App VPC for the application’s Amazon EC2 instances. Both VPCs are in the us-east-1 Region. The solutions architect must implement a solution to provide the application’s EC2 instances with access to the ElastiCache cluster. Which solution will meet these requirements MOST cost-effectively?

**Các đáp án**:

- A. Peering connection... Security Group allow inbound from application SG.
- B. Transit VPC (Expensive/Complex).
- C. Peering... Allow inbound from peering SG (Cant reference SG across peering easily in all scenarios historically, but modern Reference SG over peering is supported).
- D. ...

**Đáp án đúng**: **A**

**Giải thích chi tiết**:

- **A - ĐÚNG**: **VPC Peering** là giải pháp kết nối 2 VPC rẻ nhất và performance cao nhất (intra-region data transfer).
  - Config Route table.
  - Config Security Group: ElastiCache SG allow Inbound from **App Instances SG**. (Feature "Security Group Referencing" qua Peering đã được hỗ trợ).

---

## Câu 263

**Đề bài**:  A company is building an application that consists of several microservices. The company has decided to use container technologies to deploy its software on AWS. The company needs a solution that minimizes the amount of ongoing effort for maintenance and scaling. The company cannot manage additional infrastructure. Which combination of actions should a solutions architect take to meet these requirements? (Choose two.)

**Các đáp án**:

- A. ECS Cluster... (Cần chọn launch type).
- B. Kubernetes Control Plane on EC2 (Self-managed -> High maintenance).
- C. ECS with EC2 launch type (Manage EC2 -> Maintenance).
- D. Deploy an Amazon Elastic Container Service (Amazon ECS) service with a Fargate launch type. Specify a desired task number level of greater than or equal to 2.
- E. Kubernetes worker nodes EC2... (High maintenance).

**Đáp án đúng**: **A, D** (Thực tế A là tạo cluster, D là deploy service Fargate. Câu hỏi chọn 2 step).
Hoặc ý của đề bài là chọn giải pháp: **ECS** và **Fargate**.
Chỉ có D nhắc đến Fargate (Serverless - Min maintenance).
Trong list:

- A: Deploy ECS Cluster (Logical).
- D: Deploy Service w/ Fargate Launch Type.
  Kết hợp A và D là chuẩn. Fargate giúp "Cannot manage additional infrastructure" (No EC2 instances to manage).

---

## Câu 264

**Đề bài**:  A company has a web application hosted over 10 Amazon EC2 instances with traffic directed by Amazon Route 53. The company occasionally experiences a timeout error when attempting to browse the application. The networking team finds that some DNS queries return IP addresses of unhealthy instances, resulting in the timeout error. What should a solutions architect implement to overcome these timeout errors?

**Các đáp án**:

- A. Simple routing + health check (Simple routing không support health check).
- B. Failover routing (Active-Passive).
- C. CloudFront...
- D. Create an Application Load Balancer (ALB) with a health check in front of the EC2 instances. Route to the ALB from Route 53.

**Đáp án đúng**: **D**

**Giải thích chi tiết**:

- **D - ĐÚNG**: Route 53 Health Check với EC2 trực tiếp có hạn chế (IP thay đổi, propagation delay).
  - Giải pháp chuẩn: Đặt **ALB** phía trước. ALB Health Check hoạt động liên tục và tức thì (Local). ALB chỉ route traffic vào Healthy Instances.
  - Route 53 trỏ CNAME/Alias A record vào ALB.

---

## Câu 265

**Đề bài**:  A solutions architect needs to design a highly available application consisting of web, application, and database tiers. HTTPS content delivery should be as close to the edge as possible, with the least delivery time. Which solution meets these requirements and is MOST secure?

**Các đáp án**:

- A. Public ALB + EC2 Public. (EC2 Public -> Less secure).
- B. Public ALB + EC2 Private... Origin EC2 (CloudFront to EC2 Private directly? Impossible unless allow public access).
- C. Configure a public Application Load Balancer (ALB) with multiple redundant Amazon EC2 instances in private subnets. Configure Amazon CloudFront to deliver HTTPS content using the public ALB as the origin.
- D. ...

**Đáp án đúng**: **C**

**Giải thích chi tiết**:

- **C - ĐÚNG**:
  - **CloudFront** (Edge) -> **Public ALB** -> **EC2 Private**.
  - EC2 trong Private Subnet -> **Most Secure** (Không public IP).
  - CloudFront delivery -> **Least time** (Edge).
  - HTTPS end-to-end support.

---

## Câu 266

**Đề bài**:  A company has a popular gaming platform running on AWS. The application is sensitive to latency because latency can impact the user experience and introduce unfair advantages to some players. The application is deployed in every AWS Region. It runs on Amazon EC2 instances that are part of Auto Scaling groups configured behind Application Load Balancers (ALBs). A solutions architect needs to implement a mechanism to monitor the health of the application and redirect traffic to healthy endpoints. Which solution meets these requirements?

**Các đáp án**:

- A. Configure an accelerator in AWS Global Accelerator. Add a listener... Add the ALB as the endpoint.
- B. CloudFront...
- C. CloudFront...
- D. DAX...

**Đáp án đúng**: **A**

**Giải thích chi tiết**:

- **A - ĐÚNG**: **AWS Global Accelerator**.
  - Sử dụng mạng backbone AWS toàn cầu để giảm latency, jitter (tốt cho Gaming UDP/TCP).
  - **Health Check & Failover**: Global Accelerator tự động check health các Endpoint (ALB các region) và redirect traffic sang Region khỏe mạnh ngay lập tức (dưới 1 phút), nhanh hơn DNS failover của Route 53.

---

## Câu 267

**Đề bài**:  A company has one million users that use its mobile app. The company must analyze the data usage in near-real time. The company also must encrypt the data in near-real time and must store the data in a centralized location in Apache Parquet format for further processing. Which solution will meet these requirements with the LEAST operational overhead?

**Các đáp án**:

- A. Kinesis Data Stream -> Kinesis Analytics -> Lambda. (More components).
- B. Kinesis -> EMR (EMR overhead).
- C. Kinesis Firehose -> EMR.
- D. Create an Amazon Kinesis Data Firehose delivery stream to store the data in Amazon S3. Create an Amazon Kinesis Data Analytics application to analyze the data.

**Đáp án đúng**: **D**

**Giải thích chi tiết**:

- **D - ĐÚNG**:
  - **Kinesis Data Firehose**: Ingest data, hỗ trợ **Convert to Parquet** (Format Conversion) và **Encryption** on the fly trước khi lưu store S3. "Least overhead" vì là fully managed configuration.
  - **Kinesis Data Analytics**: Analyze streaming data in "near-real time".
  - Solution này đáp ứng đủ requirements và Serverless hoàn toàn.

---

## Câu 268

**Đề bài**:  A gaming company has a web application that displays scores. The application runs on Amazon EC2 instances behind an Application Load Balancer. The application stores data in an Amazon RDS for MySQL database. Users are starting to experience long delays and interruptions that are caused by database read performance. The company wants to improve the user experience while minimizing changes to the application’s architecture. What should a solutions architect do to meet these requirements?

**Các đáp án**:

- A. ElastiCache (Cần code change).
- B. Use RDS Proxy between the application and the database.
- C. Migrate to Lambda...
- D. Migrate to DynamoDB...

**Đáp án đúng**: **B** (Hoặc Read Replica nếu có option).
Trong list này: **RDS Proxy** giúp quản lý connection pooling, giảm tải cho DB connection overhead, nhưng không hẳn tăng "Read performance" throughput data như Read Replica/ElastiCache.
Tuy nhiên, nếu ứng dụng bị delay do "Connection storms" (gaming user đông) thì Proxy giúp.
Nhưng nếu vấn đề là "Read Performance" thuần túy (Query chậm), thường ElastiCache (A) hoặc Read Replica là đáp án.
Đề bài yêu cầu "Minimize changes".

- A (ElastiCache): Sửa code nhiều (Logic cache/check cache).
- B (RDS Proxy): Sửa ít (chỉ đổi endpoint).
  Tuy nhiên RDS Proxy chủ yếu fix Connection issue.
  Có thể option A là tốt nhất cho "Read Performance" dù code change.
  Nhưng hãy xem lại đáp án C/D đều big change.
  Nếu so sánh A và B: ElastiCache giải quyết Read Cache hiệu quả. Có thể đề coi việc thêm caching layer là standard solution.
  **Tuy nhiên**, đáp án chính xác thường gặp cho câu hỏi "Read Performance" + "Min Changes" là **Read Replica**. Nếu không có Read Replica, **ElastiCache** là lựa chọn thứ 2 (dù phải sửa code).
  Nhưng đợi đã, **RDS Proxy** có tính năng **Read Replicas Load Balancing**? Không, nó chỉ route traffic.
  Có thể câu hỏi này thiếu option "Add Read Replica".
  Nếu bắt buộc chọn trong A, B, C, D:
- **A**: Hiệu quả nhất cho Read performance.
- **B**: Hiệu quả cho Connection efficiency.
  Thông thường Gaming App đọc điểm số (Score) -> Caching (A) là cực kỳ hợp lý.
  Chọn **A**.

---

## Câu 269

**Đề bài**:  An ecommerce company has noticed performance degradation of its Amazon RDS based web application. The performance degradation is attributed to an increase in the number of read-only SQL queries triggered by business analysts. A solutions architect needs to solve the problem with minimal changes to the existing web application. What should the solutions architect recommend?

**Các đáp án**:

- A. Export to DynamoDB...
- B. ElastiCache...
- C. Create a read replica of the primary database and have the business analysts run their queries.
- D. Redshift...

**Đáp án đúng**: **C**

**Giải thích chi tiết**:

- **C - ĐÚNG**: **Read Replica**.
  - Tách traffic của Analysts sang Read Replica endpoint.
  - "Minimal changes to **existing web app**": App vẫn trỏ vào Primary DB như cũ. Analysts dùng endpoint mới. Không ảnh hưởng code app.

---

## Câu 270

**Đề bài**:  A company is using a centralized AWS account to store log data in various Amazon S3 buckets. A solutions architect needs to ensure that the data is encrypted at rest before the data is uploaded to the S3 buckets. The data also must be encrypted in transit. Which solution meets these requirements?

**Các đáp án**:

- A. Use client-side encryption to encrypt the data that is being uploaded to the S3 buckets.
- B. Server-side encryption (Encrypt SAU khi upload lên server).
- C. SSE-S3 policy (Server-side).
- D. Default KMS (Server-side).

**Đáp án đúng**: **A**

**Giải thích chi tiết**:

- **A - ĐÚNG**: **Client-side encryption**. Dữ liệu được mã hóa ngay tại nguồn (Client/App) trước khi gửi qua đường truyền tới S3. Đảm bảo "Encrypted at rest **before** upload". Và dĩ nhiên Data encrypted thì đi qua đường truyền (In transit) cũng là encrypted (double security nếu dùng HTTPS).

---

## Câu 271

**Đề bài**:  A solutions architect observes that a nightly batch processing job is automatically scaled up for 1 hour before the desired Amazon EC2 capacity is reached. The peak capacity is the ‘same every night and the batch jobs always start at 1 AM. The solutions architect needs to find a cost-effective solution that will allow for the desired EC2 capacity to be reached quickly and allow the Auto Scaling group to scale down after the batch jobs are complete. What should the solutions architect do to meet these requirements?

**Các đáp án**:

- A. Increase min capacity (Tốn tiền chạy 24/7).
- B. Increase max...
- C. Configure scheduled scaling to scale up to the desired compute level.
- D. Step scaling...

**Đáp án đúng**: **C**

**Giải thích chi tiết**:

- **C - ĐÚNG**: **Scheduled Scaling**.
  - Vì "Peak capacity is same every night" và "Starts at 1 AM" -> Logically predictable.
  - Config Scheduled Action: Lúc 0:50 AM set Desired Capacity = Peak. ASG sẽ pre-warm instances sẵn sàng cho 1 AM.
  - Config Action khác để scale down khi job xong (hoặc để Dynamic scaling handle down).

---

## Câu 272

**Đề bài**:  A company serves a dynamic website from a fleet of Amazon EC2 instances behind an Application Load Balancer (ALB). The website needs to support multiple languages to serve customers around the world. The website’s architecture is running in the us-west-1 Region and is exhibiting high request latency for users that are located in other parts of the world. The website needs to serve requests quickly and efficiently regardless of a user’s location. However, the company does not want to recreate the existing architecture across multiple Regions. What should a solutions architect do to meet these requirements?

**Các đáp án**:

- A. S3 (Website dynamic -> Sai).
- B. Configure an Amazon CloudFront distribution with the ALB as the origin. Set the cache behavior settings to cache based on the Accept-Language request header.
- C. API Gateway (Cache static content? Not full dynamic site optimization).
- D. EC2 NGINX in each region (Creating Architecture in multiple regions -> Vi phạm requirement).

**Đáp án đúng**: **B**

**Giải thích chi tiết**:

- **B - ĐÚNG**: **CloudFront**.
  - CloudFront tăng tốc độ truy cập cho cả Dynamic Content (nhờ mạng Global AWS, connection reuse to origin).
  - Caching based on **Accept-Language**: Store các phiên bản ngôn ngữ khác nhau tại Edge, phục vụ đúng content cho user từng vùng.

---

## Câu 273

**Đề bài**:  A rapidly growing ecommerce company is running its workloads in a single AWS Region. A solutions architect must create a disaster recovery (DR) strategy that includes a different AWS Region. The company wants its database to be up to date in the DR Region with the least possible latency. The remaining infrastructure in the DR Region needs to run at reduced capacity and must be able to scale up if necessary. Which solution will meet these requirements with the LOWEST recovery time objective (RTO)?

**Các đáp án**:

- A. Aurora Global Database with pilot light.
- B. Aurora Global Database with warm standby.
- C. RDS Multi-AZ pilot light.
- D. RDS Multi-AZ warm standby.

**Đáp án đúng**: **B**

**Giải thích chi tiết**:

- **Aurora Global Database**: Replication latency < 1s (nhanh hơn Cross-region Read Replica của RDS thường). -> "Least possible latency".
- **Warm Standby**: Infra luôn chạy (scaled down) nhưng ready to serve traffic ngay lập tức. RTO thấp hơn Pilot Light (Pilot light cần bật máy lên).
- => **B** là sự kết hợp tốt nhất cho "Lowest RTO".

---

## Câu 274

**Đề bài**:  A company runs an application on Amazon EC2 instances. The company needs to implement a disaster recovery (DR) solution for the application. The DR solution needs to have a recovery time objective (RTO) of less than 4 hours. The DR solution also needs to use the fewest possible AWS resources during normal operations. Which solution will meet these requirements in the MOST operationally efficient way?

**Các đáp án**:

- A. AMI backup + Lambda automation.
- B. Create Amazon Machine Images (AMIs) to back up the EC2 instances. Copy the AMIs to a secondary AWS Region. Automate infrastructure deployment in the secondary Region by using **AWS CloudFormation**.
- C. Active instances (Expensive).
- D. Secondary AZ (Not DR Region).

**Đáp án đúng**: **B**

**Giải thích chi tiết**:

- **B - ĐÚNG**: **Backup & Restore** Strategy.
  - RTO < 4 hours là mục tiêu khá thoải mái, Backup & Restore đáp ứng được.
  - "Fewest AWS resources": Chỉ lưu AMI (Storage cost), không chạy EC2 compute nào ở Region kia.
  - **CloudFormation**: Automate việc dựng lại stack (VPC, SG, Launch Instances from AMI) nhanh chóng và chuẩn xác -> "Operationally efficient".

---

## Câu 275

**Đề bài**:  A company runs an internal browser-based application. The application runs on Amazon EC2 instances behind an Application Load Balancer. The instances run in an Amazon EC2 Auto Scaling group across multiple Availability Zones. The Auto Scaling group scales up to 20 instances during work hours, but scales down to 2 instances overnight. Staff are complaining that the application is very slow when the day begins, although it runs well by mid-morning. How should the scaling be changed to address the staff complaints and keep costs to a minimum?

**Các đáp án**:

- A. Implement a scheduled action that sets the desired capacity to 20 shortly before the office opens.
- B. Step scaling...
- C. Target tracking...
- D. ... Min and Max to 20...

**Đáp án đúng**: **A**

**Giải thích chi tiết**:

- **A - ĐÚNG**: **Scheduled Scaling**.
  - Biết trước giờ cao điểm (Office opens). Set Desired Capacity = 20 trước đó 30p.
  - Hệ thống sẵn sàng ngay khi nhân viên vào làm -> Hết chậm.
  - Sau đó có thể để Dynamic Scaling hoạt động hoặc Schedule giảm xuống vào cuối ngày.

---

## Câu 276

**Đề bài**:  A company has a multi-tier application deployed on several Amazon EC2 instances in an Auto Scaling group. An Amazon RDS for Oracle instance is the application’ s data layer that uses Oracle-specific PL/SQL functions. Traffic to the application has been steadily increasing. This is causing the EC2 instances to become overloaded and the RDS instance to run out of storage. The Auto Scaling group does not have any scaling metrics and defines the minimum healthy instance count only. The company predicts that traffic will continue to increase at a steady but unpredictable rate before leveling off. What should a solutions architect do to ensure the system can automatically scale for the increased traffic? (Choose two.)

**Các đáp án**:

- A. Configure storage Auto Scaling on the RDS for Oracle instance.
- B. Migrate to Aurora (Too much effort/change).
- C. Alarm low storage (Monitoring only).
- D. Configure the Auto Scaling group to use the average CPU as the scaling metric.
- E. Free memory...

**Đáp án đúng**: **A, D**

**Giải thích chi tiết**:

- **A - ĐÚNG**: **RDS Storage Auto Scaling**. Tính năng cho phép RDS tự động tăng dung lượng disk khi đầy, không downtime. Giải quyết "RDS instance to run out of storage".
- **D - ĐÚNG**: **Target Tracking Scaling Policy (Average CPU Utilization)**. Giải quyết "EC2 instances become overloaded". CPU là metric cơ bản và hiệu quả cho compute scaling.

---

## Câu 277

**Đề bài**:  A company provides an online service for posting video content and transcoding it for use by any mobile platform. The application architecture uses Amazon Elastic File System (Amazon EFS) Standard to collect and store the videos so that multiple Amazon EC2 Linux instances can access the video content for processing. As the popularity of the service has grown over time, the storage costs have become too expensive. Which storage solution is MOST cost-effective?

**Các đáp án**:

- A. Storage Gateway...
- B. ...
- C. Use Amazon EFS for storing the video content. Once processing is complete, transfer the files to Amazon Elastic Block Store (Amazon EBS) (EBS per GB đắt hơn EFS Infrequent Access? Không, EBS gp3 rẻ hơn EFS Standard. Nhưng EFS IA rẻ hơn EBS).
- D. Use Amazon S3 for storing the video content. Move the files temporarily over to an Amazon Elastic Block Store (Amazon EBS) volume attached to the server for processing.

**Đáp án đúng**: **D**

**Giải thích chi tiết**:

- **D - ĐÚNG**: **S3 + EBS Scratch**.
  - S3: Lưu trữ Video gốc và Video đã transcode ($0.023/GB - Rẻ hơn nhiều so với EFS $0.30/GB).
  - Quy trình: Download S3 -> EBS (Temp processing) -> Transcode -> Upload S3 -> Delete EBS temp.
  - EFS Standard rất đắt tiền cho throughput cao. S3 throughput cao và rẻ.

---

## Câu 278

**Đề bài**:  A company wants to create an application to store employee data in a hierarchical structured relationship. The company needs a minimum-latency response to high-traffic queries for the employee data and must protect any sensitive data. The company also needs to receive monthly email messages if any financial information is present in the employee data. Which combination of steps should a solutions architect take to meet these requirements? (Choose two.)

**Các đáp án**:

- A. Redshift...
- B. DynamoDB store... S3 export (DynamoDB tốt cho Hierarchical data? Document model OK).
- C. ...
- D. ...
- E. Configure Amazon Macie for the AWS account. Integrate Macie with Amazon EventBridge to send monthly notifications through an Amazon Simple Notification Service (Amazon SNS) subscription.

**Đáp án đúng**: **B, E** (Hoặc A/E, nhưng DynamoDB low latency high traffic tốt hơn Redshift cho operational DB).

**Giải thích chi tiết**:

- **B - ĐÚNG**: **DynamoDB** (NoSQL) đáp ứng High-traffic, Low-latency queries cực tốt.
- **E - ĐÚNG**: **Amazon Macie**.
  - Scan S3 buckets để phát hiện Sensitive Data (PII, Financial Info).
  - Pattern: DynamoDB export to S3 -> Macie scan S3 -> Notify via EventBridge/SNS. (Macie chỉ scan S3, không scan DynamoDB trực tiếp, nên cần bước Export).

---

## Câu 279

**Đề bài**:  A company has an application that is backed by an Amazon DynamoDB table. The company’s compliance requirements specify that database backups must be taken every month, must be available for 6 months, and must be retained for 7 years. Which solution will meet these requirements?

**Các đáp án**:

- A. AWS Backup plan...
- B. On-demand backup... Transition to Glacier Flexible Retrieval... (DynamoDB backup transition to Glacier is AWS Backup feature or S3 export?).
- C. Script...
- D. ...

**Đáp án đúng**: **A**

**Giải thích chi tiết**:

- **A - ĐÚNG**: **AWS Backup**.
  - Fully managed policy.
  - Hỗ trợ **Lifecycle to Cold Storage (Glacier)** cho DynamoDB backups (Tiering).
  - Config retention 7 years dễ dàng.

---

## Câu 280

**Đề bài**:  A company is using Amazon CloudFront with its website. The company has enabled logging on the CloudFront distribution, and logs are saved in one of the company’s Amazon S3 buckets. The company needs to perform advanced analyses on the logs and build visualizations. What should a solutions architect do to meet these requirements?

**Các đáp án**:

- A. Athena + AWS Glue (Glue Visualization kém).
- B. Use standard SQL queries in Amazon Athena to analyze the CloudFront logs in the S3 bucket. Visualize the results with Amazon QuickSight.
- C. DynamoDB...
- D. ...

**Đáp án đúng**: **B**

**Giải thích chi tiết**:

- **B - ĐÚNG**: **Athena + QuickSight**.
  - Athena: Query file log S3 bằng SQL.
  - QuickSight: BI Tool vẽ chart/dashboard từ kết quả Athena. Combo chuẩn mực.

---

## Câu 281

**Đề bài**:  A company runs a fleet of web servers using an Amazon RDS for PostgreSQL DB instance. After a routine compliance check, the company sets a standard that requires a recovery point objective (RPO) of less than 1 second for all its production databases. Which solution meets these requirements?

**Các đáp án**:

- A. Enable a Multi-AZ deployment for the DB instance.
- B. Auto Scaling (Capacity, not RPO).
- C. Read Replicas (Async - RPO can be > 0).
- D. DMS...

**Đáp án đúng**: **A**

**Giải thích chi tiết**:

- **A - ĐÚNG**: **Multi-AZ Deployment**.
  - Sử dụng **Synchronous Replication** (Sao chép đồng bộ). Data commit ở Primary cũng được commit ở Standby.
  - Do đó **RPO = 0** (hoặc rất gần 0, chắc chắn < 1 second) cho failover case.
  - Read Replica (Async) có lag, RPO có thể là vài giây hoặc phút.

---

## Câu 282

**Đề bài**:  A company runs a web application that is deployed on Amazon EC2 instances in the private subnet of a VPC. An Application Load Balancer (ALB) that extends across the public subnets directs web traffic to the EC2 instances. The company wants to implement new security measures to restrict inbound traffic from the ALB to the EC2 instances while preventing access from any other source inside or outside the private subnet of the EC2 instances. Which solution will meet these requirements?

**Các đáp án**:

- A. Route table...
- B. Configure the security group for the EC2 instances to only allow traffic that comes from the security group for the ALB.
- C. Public subnet...
- D. ...

**Đáp án đúng**: **B**

**Giải thích chi tiết**:

- **B - ĐÚNG**: **Security Group Reference**.
  - SG EC2 Inbound Rule: Type HTTP, Source = **sg-id-of-ALB**.
  - Đảm bảo chỉ traffic đi qua ALB mới vào được EC2. Chặn mọi source khác.

---

## Câu 283

**Đề bài**:  A research company runs experiments that are powered by a simulation application and a visualization application. The simulation application runs on Linux and outputs intermediate data to an NFS share every 5 minutes. The visualization application is a Windows desktop application that displays the simulation output and requires an SMB file system. The company maintains two synchronized file systems. This strategy is causing data duplication and inefficient resource usage. The company needs to migrate the applications to AWS without making code changes to either application. Which solution will meet these requirements?

**Các đáp án**:

- A. Lambda... (Code changes).
- B. ECS...
- C. SQS...
- D. Migrate the simulation application to Linux Amazon EC2 instances. Migrate the visualization application to Windows EC2 instances. Configure Amazon FSx for NetApp ONTAP for storage.

**Đáp án đúng**: **D**

**Giải thích chi tiết**:

- **D - ĐÚNG**: **Amazon FSx for NetApp ONTAP**.
  - Điểm đặc biệt: Hỗ trợ **Multi-protocol access** (cả NFS và SMB) trên cùng một volume dữ liệu.
  - Simulation (Linux) dùng NFS mount, Visualization (Windows) dùng SMB mount cùng 1 bộ data. Không cần sync, không duplication. No code changes.

---

## Câu 284

**Đề bài**:  As part of budget planning, management wants a report of AWS billed items listed by user. The data will be used to create department budgets. A solutions architect needs to determine the most efficient way to obtain this report information. Which solution meets these requirements?

**Các đáp án**:

- A. Athena query (Cost & Usage Report). (Powerful but complex).
- B. Create a report in Cost Explorer and download the report.
- C. ...
- D. ...

**Đáp án đúng**: **B** (Hoặc Cost & Usage Report tag by user).
Tuy nhiên **Cost Explorer** là công cụ trực quan và dễ dùng nhất ("Efficient way") để filter cost theo **Tag** (ví dụ Tag: `User` hoặc `Department`) và group by tag đó để report.
Yêu cầu: "Billed items listed by user". Cần gắng Tag `CreatedBy` (hoặc tương tự) cho resource và activate Cost Allocation Tag. Sau đó Cost Explorer hiện ngay.

---

## Câu 285

**Đề bài**:  A company hosts its static website by using Amazon S3. The company wants to add a contact form to its webpage. The contact form will have dynamic server-side components for users to input their name, email address, phone number, and user message. The company anticipates that there will be fewer than 100 site visits each month. Which solution will meet these requirements MOST cost-effectively?

**Các đáp án**:

- A. ECS (Server base - expensive).
- B. Create an Amazon API Gateway endpoint with an AWS Lambda backend that makes a call to Amazon Simple Email Service (Amazon SES).
- C. Lightsail (Monthly fee).
- D. EC2 LAMP (Monthly fee, manage server).

**Đáp án đúng**: **B**

**Giải thích chi tiết**:

- **B - ĐÚNG**: **Serverless Architecture**.
  - API Gateway (Free Tier / Pay per request).
  - Lambda (Free Tier / Pay per request).
  - SES (Pay per email).
  - Với 100 visits/month -> Chi phí gần như **0 đồng**. Rẻ hơn bất kỳ giải pháp server/container nào.

---

## Câu 286

**Đề bài**:  A company has a static website that is hosted on Amazon CloudFront in front of Amazon S3. The static website uses a database backend. The company notices that the website does not reflect updates that have been made in the website’s Git repository. The company checks the continuous integration and continuous delivery (CI/CD) pipeline between the Git repository and Amazon S3. The company verifies that the webhooks are configured properly and that the CI/CD pipeline is sending messages that indicate successful deployments. A solutions architect needs to implement a solution that displays the updates on the website. Which solution will meet these requirements?

**Các đáp án**:

- A. ALB...
- B. ElastiCache...
- C. Invalidate the CloudFront cache.
- D. ACM...

**Đáp án đúng**: **C**

**Giải thích chi tiết**:

- **C - ĐÚNG**: **CloudFront Caching**. CloudFront cache file (ví dụ `index.html`) theo TTL (mặc định 24h). Khi S3 update file mới, CloudFront vẫn serve file cũ từ cache.
  - Cần **Invalidate Cache** (`/*` hoặc path cụ thể) trong quy trình CI/CD sau khi upload S3 xong để user thấy nội dung mới ngay lập tức.

---

## Câu 287

**Đề bài**:  A company wants to migrate a Windows-based application from on premises to the AWS Cloud. The application has three tiers: an application tier, a business tier, and a database tier with Microsoft SQL Server. The company wants to use specific features of SQL Server such as native backups and Data Quality Services. The company also needs to share files for processing between the tiers. How should a solutions architect design the architecture to meet these requirements?

**Các đáp án**:

- A. File Gateway (Hybrid).
- B. Use Amazon FSx for Windows File Server for file sharing between the tiers.
- C. RDS (RDS SQL Server ko support Data Quality Services DQS đầy đủ hoặc truy cập OS-level file system dễ dàng cho shared file scenario như EC2 self-managed). EFS for Linux.
- D. ...

**Đáp án đúng**: **B**

**Giải thích chi tiết**:

- **Architecture**: Windows App -> chạy tốt trên EC2.
- **File Sharing**: **FSx for Windows File Server** (Native SMB share cho 3 tiers Windows).
- **Database**: EC2 SQL Server (Self-managed) thường được chọn nếu cần features đặc thù OS access hoặc Native Backup file path control (dù RDS support native backup to S3, nhưng DQS có thể yêu cầu full access). Tuy nhiên đề bài hỏi thiết kế tổng thể. **Option B** "Host all three tiers on EC2" + FSx là an toàn nhất để support mọi "Specific features" của SQL Server mà RDS có thể hạn chế, đồng thời giải quyết bài toán Shared File.

---

## Câu 288

**Đề bài**:  A company is migrating a Linux-based web server group to AWS. The web servers must access files in a shared file store for some content. The company must not make any changes to the application. What should a solutions architect do to meet these requirements?

**Các đáp án**:

- A. S3 (Application phải dùng S3 API/SDK -> Code change).
- B. CloudFront (CDN, not file store).
- C. Create an Amazon Elastic File System (Amazon EFS) file system. Mount the EFS file system on all web servers.
- D. EBS (Single attach normally).

**Đáp án đúng**: **C**

**Giải thích chi tiết**:

- **C - ĐÚNG**: **EFS**.
  - Shared File System (NFS Standard).
  - Mount vào Linux OS như thư mục local -> Application đọc ghi file bình thường -> **No changes to application**.

---

## Câu 289

**Đề bài**:  A company has an AWS Lambda function that needs read access to an Amazon S3 bucket that is located in the same AWS account. Which solution will meet these requirements in the MOST secure manner?

**Các đáp án**:

- A. S3 Bucket Policy (Lambda is Principal? Function Role is Principal).
- B. Apply an IAM role to the Lambda function. Apply an IAM policy to the role to grant read access to the S3 bucket.
- C. Access Key (Hardcoded - Insecure).
- D. Role access ALL buckets (Least privilege violation).

**Đáp án đúng**: **B**

**Giải thích chi tiết**:

- **B - ĐÚNG**: **IAM Execution Role**.
  - Tạo Role cho Lambda.
  - Attach Policy chỉ allow `s3:GetObject` trên specific Bucket ARN.
  - Đây là standard secure way.

---

## Câu 290

**Đề bài**:  A company hosts a web application on multiple Amazon EC2 instances. The EC2 instances are in an Auto Scaling group that scales in response to user demand. The company wants to optimize cost savings without making a long-term commitment. Which EC2 instance purchasing option should a solutions architect recommend to meet these requirements?

**Các đáp án**:

- A. Dedicated (Expensive).
- B. On-Demand (Expensive).
- C. A mix of On-Demand Instances and Spot Instances.
- D. Reserved Instances (Long-term commitment).

**Đáp án đúng**: **C**

**Giải thích chi tiết**:

- **C - ĐÚNG**:
  - **Spot Instances**: Tiết kiệm tới 90%, không cam kết dài hạn. Phù hợp cho phần stateless/scalable của ASG.
  - **On-Demand**: Cho baseline stability.
  - Mixed Instances Policy trong ASG cho phép kết hợp cả 2 để tối ưu chi phí mà không cần ký hợp đồng 1-3 năm như RI/Savings Plans.

---

## Câu 291

**Đề bài**:  A media company uses Amazon CloudFront for its publicly available streaming video content. The company wants to secure the video content that is hosted in Amazon S3 by controlling who has access. Some of the company’s users are using a custom HTTP client that does not support cookies. Some of the company’s users are unable to change the hardcoded URLs that they are using for access. Which services or methods will meet these requirements with the LEAST impact to the users? (Choose two.)

**Các đáp án**:

- A. Signed cookies (Client not support -> Loại).
- B. Signed URLs (Hardcoded URLs -> Client ko update dynamic URL được -> Loại).
- _Wait_. Đề bài rất khoai: "No cookies" AND "Hardcoded URLs".
  - Signed URL: URL thay đổi (`?Signature=...`). Nếu hardcoded, làm sao app chạy link mới? Trừ khi App có cơ chế fetch master playlist dynamic?
  - Signed Cookie: Client không support cookie.
  - Vậy dùng gì?
  - List đáp án: C. AppSync, D. JWT, E. Secrets Manager. Không cái nào trực tiếp bảo vệ CloudFront content delivery standard (Signed URL/Cookie).
  - Có lẽ đề bài đang nói về 2 groups user riêng biệt? "Some users... no cookies", "Some users... hardcoded URLs".
  - Với "No cookies" user: Phải dùng **Signed URLs**.
  - Với "Hardcoded URL" user: Phải dùng **Signed Cookies**. (Nhưng nếu họ hardcoded thì cũng khó send cookie dynamic? Trừ khi cookie set 1 lần).
  - Tuy nhiên, trong context AWS, chỉ có A và B là mechanism của CloudFront.
  - Các option C, D, E không phải Native CloudFront Private Content feature.
  - Có thể đề bài trick: Custom Client (No cookies) -> Dùng Signed URL. Users hardcoded URLs -> Dùng Signed Cookies (Header `Cookie`).
  - Nhưng 2 cái này mâu thuẫn với constraints.
  - _Re-read_: "Some users unable to change hardcoded URLs" - có thể họ access qua 1 portal nào đó handle auth?
  - Thực tế, nếu bắt buộc chọn 2 solution cho "CloudFront Private Content", chỉ có **A** và **B**. Bất chấp constraints đề bài vẻ như mâu thuẫn, đây là cặp bài trùng duy nhất. Có thể ý đề là "Use combination of both to cover all user cases".
  - Chọn **A, B**.

---

## Câu 292

**Đề bài**:  A company is preparing a new data platform that will ingest real-time streaming data from multiple sources. The company needs to transform the data before writing the data to Amazon S3. The company needs the ability to use SQL to query the transformed data. Which solutions will meet these requirements? (Choose two.)

**Các đáp án**:

- A. Kinesis Stream -> Kinesis Analytics -> Firehose -> S3 -> Athena.
- B. ...
- C. ...
- D. ...
- E. Kinesis Stream -> Glue (Transformation) -> Firehose -> S3...

**Đáp án đúng**: **A, B** (Dựa trên khả năng transform và query).
Tuy nhiên **A** là flow Kinesis native hoàn chỉnh nhất:

1. Ingest: **Kinesis Data Streams**.
2. Transform: **Kinesis Data Analytics** (SQL/Flink app realtime).
3. Load: **Firehose** delivery to S3.
4. Query: **Athena** (SQL on S3).
   Option **E**: Kinesis Data Firehose có feature "Data Transformation with AWS Glue" (thực chất là gọi Lambda blueprint).
   Option **B**: MSK (Kafka) -> Glue (Streaming ETL job) -> S3 -> Athena. Cũng Valid.
   Đề bài bảo chọn 2 "Solutions"? Tức là A và B đều đúng (Different stacks).
   Hoặc A và E?
   Thường câu hỏi dạng này yêu cầu ghép các service lại.
   **A** là Best practice cho Kinesis stack.
   **B** là Best practice cho Kafka stack (MSK).
   Cả 2 đều đáp ứng requirements.

---

## Câu 293

**Đề bài**:  A company has an on-premises volume backup solution that has reached its end of life. The company wants to use AWS as part of a new backup solution and wants to maintain local access to all the data while it is backed up on AWS. The company wants to ensure that the data backed up on AWS is automatically and securely transferred. Which solution meets these requirements?

**Các đáp án**:

- A. Snowball (Manual transfer, not continuous/automatic).
- B. Snowball Edge...
- C. Use AWS Storage Gateway and configure a cached volume gateway... configure a percentage of data to cache locally. (Cached = Only hot data local).
- D. Use AWS Storage Gateway and configure a stored volume gateway. Run the Storage Gateway software appliance on premises and map the gateway storage volumes to on-premises storage. Mount the gateway storage volumes to provide local access to the data.

**Đáp án đúng**: **D**

**Giải thích chi tiết**:

- **D - ĐÚNG**: **Stored Volume Gateway**.
  - Dữ liệu nằm **toàn bộ tại on-prem** (Local Access to ALL data).
  - Gateway async backup point-in-time snapshot lên AWS S3 (Automatic & Secure transfer).
  - **Cached Volume Gateway** (C) chỉ giữ data hay dùng ở local -> Sai requirement "Access all data locally".

---

## Câu 294

**Đề bài**:  An application that is hosted on Amazon EC2 instances needs to access an Amazon S3 bucket. Traffic must not traverse the internet. How should a solutions architect configure access to meet these requirements?

**Các đáp án**:

- A. Route 53 private zone...
- B. Set up a gateway VPC endpoint for Amazon S3 in the VPC.
- C. NAT Gateway...
- D. VPN...

**Đáp án đúng**: **B**

**Giải thích chi tiết**:

- **B - ĐÚNG**: **Gateway VPC Endpoint**. Traffic đi qua private AWS network. Free. Secure.

---

## Câu 295

**Đề bài**:  An ecommerce company stores terabytes of customer data in the AWS Cloud. The data contains personally identifiable information (PII). The company wants to use the data in three applications. Only one of the applications needs to process the PII. The PII must be removed before the other two applications process the data. Which solution will meet these requirements with the LEAST operational overhead?

**Các đáp án**:

- A. Proxy App... (Code overhead).
- B. Store the data in an Amazon S3 bucket. Process and transform the data by using **S3 Object Lambda** before returning the data to the requesting application.
- C. 3 Buckets... (Duplicate storage/process).
- D. DynamoDB...

**Đáp án đúng**: **B**

**Giải thích chi tiết**:

- **B - ĐÚNG**: **S3 Object Lambda**.
  - Cho phép chạy Lambda code để modify data khi có request GET.
  - App 1 (Cần PII): Query S3 Access Point thường.
  - App 2, 3 (Không PII): Query S3 Object Lambda Access Point -> Lambda function redact PII on-the-fly -> Trả về data sạch.
  - Không cần lưu trữ nhiều bản copy -> Least overhead.

---

## Câu 296

**Đề bài**:  A development team has launched a new application that is hosted on Amazon EC2 instances inside a development VPC. A solutions architect needs to create a new VPC in the same account. The new VPC will be peered with the development VPC. The VPC CIDR block for the development VPC is 192.168.0.0/24. The solutions architect needs to create a CIDR block for the new VPC. The CIDR block must be valid for a VPC peering connection to the development VPC. What is the SMALLEST CIDR block that meets these requirements?

**Các đáp án**:

- A. 10.0.1.0/32 (Too small, VPC min mask is /28).
- B. 192.168.0.0/24 (Overlapping CIDR -> Cannot peer).
- C. 192.168.1.0/32 (Invalid mask).
- D. 10.0.1.0/24

**Đáp án đúng**: **D** (Hoặc mask nhỏ hơn nếu có, nhưng trong list chỉ D hợp lệ).
Wait, VPC CIDR block size allowed is between /16 and /28.

- A (/32): Invalid.
- C (/32): Invalid.
- B (/24): Overlap logic (năm trong range 192.168.0.0/16 class C? No 192.168.0.0/24 vs 192.168.0.0/24 is identical overlap).
- D (/24): Valid CIDR, non-overlapping.

---

## Câu 297

**Đề bài**:  A company deploys an application on five Amazon EC2 instances. An Application Load Balancer (ALB) distributes traffic to the instances by using a target group. The average CPU usage on each of the instances is below 10% most of the time, with occasional surges to 65%. A solutions architect needs to implement a solution to automate the scalability of the application. The solution must optimize the cost of the architecture and must ensure that the application has enough CPU resources when surges occur. Which solution will meet these requirements?

**Các đáp án**:

- A. CloudWatch Alarm < 20% terminate... (Manual logic, risky).
- B. Target Tracking Policy... Target 50%.
- C. ...
- D. ...

**Đáp án đúng**: **B**

**Giải thích chi tiết**:

- **B - ĐÚNG**: **Target Tracking Scaling**.
  - Set Target CPU = 50% (ví dụ).
  - Khi Surge (65%) -> Metric > Target -> ASG scale out (thêm instance).
  - Khi Idle (<10%) -> Metric < Target -> ASG scale in (giảm instance) -> Optimize cost.
  - Automate hoàn toàn.

---

## Câu 298

**Đề bài**:  A company is running a critical business application on Amazon EC2 instances behind an Application Load Balancer. The EC2 instances run in an Auto Scaling group and access an Amazon RDS DB instance. The design did not pass an operational review because the EC2 instances and the DB instance are all located in a single Availability Zone. A solutions architect must update the design to use a second Availability Zone. Which solution will make the application highly available?

**Các đáp án**:

- A. Provision subnet... Configure DB connections... (DB still single?).
- B. ...
- C. Provision a subnet in each Availability Zone. Configure the Auto Scaling group to distribute the EC2 instances across both Availability Zones. Configure the DB instance for Multi-AZ deployment.
- D. ...

**Đáp án đúng**: **C**

**Giải thích chi tiết**:

- **C - ĐÚNG**:
  - **Web Tier**: ASG trải rộng 2 AZs (cần Subnet ở mỗi AZ).
  - **Database Tier**: Bật tính năng **Multi-AZ Deployment** cho RDS.
  - Full stack HA.

---

## Câu 299

**Đề bài**:  A research laboratory needs to process approximately 8 TB of data. The laboratory requires sub-millisecond latencies and a minimum throughput of 6 GBps for the storage subsystem. Hundreds of Amazon EC2 instances that run Amazon Linux will distribute and process the data. Which solution will meet the performance requirements?

**Các đáp án**:

- A. FSx ONTAP...
- B. Create an Amazon S3 bucket to store the raw data. Create an Amazon FSx for Lustre file system that uses persistent SSD storage. Select the option to import data from and export data to Amazon S3. Mount the file system on the EC2 instances.
- C. FSx Lustre HDD... (HDD throughput lower).
- D. ...

**Đáp án đúng**: **B**

**Giải thích chi tiết**:

- **B - ĐÚNG**: **FSx for Lustre**.
  - Designed for HPC, "Sub-millisecond latencies", "High throughput" (Hundreds GBps possible).
  - **Persistent SSD**: Đảm bảo performance cao nhất (HDD chậm hơn).
  - Integration S3: Load 8TB data từ S3 vào Lustre xử lý, xong đẩy lại.

---

## Câu 300

**Đề bài**:  A company needs to migrate a legacy application from an on-premises data center to the AWS Cloud because of hardware capacity constraints. The application runs 24 hours a day, 7 days a week. The application’s database storage continues to grow over time. What should a solutions architect do to meet these requirements MOST cost-effectively?

**Các đáp án**:

- A. Spot... (Legacy app 24/7 maybe not stateless/fault tolerant -> Risky).
- B. Reserved Instances (App) + RDS On-Demand... (RDS storage grows -> On-demand ok, but RI for DB is cheaper).
- C. Migrate the application layer to Amazon EC2 Reserved Instances. Migrate the data storage layer to Amazon Aurora Reserved Instances.
- D. ...

**Đáp án đúng**: **C**

**Giải thích chi tiết**:

- **Running 24/7**: Workload ổn định -> **Reserved Instances (RI)** hoặc Savings Plans tiết kiệm ~72% so với On-Demand.
- **Database**: Aurora/RDS Reserved Instances cũng tiết kiệm tương tự. Storage "grows over time" -> Aurora tự động expand storage (trả tiền theo usage), còn RI tính trên Compute Node.
- Combo **EC2 RI + DB RI** là rẻ nhất cho 24/7 stable workload.

---
