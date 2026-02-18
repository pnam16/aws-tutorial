# AWS Certification Exam Questions 201-250

Tài liệu được biên soạn chi tiết với giải thích bằng tiếng Việt, giúp bạn hiểu sâu về các dịch vụ AWS.

---

## Câu 201

**Đề bài**:  A company is developing a marketing communications service that targets mobile app users. The company needs to send confirmation messages with Short Message Service (SMS) to its users. The users must be able to reply to the SMS messages. The company must store the responses for a year for analysis. What should a solutions architect do to meet these requirements?

**Các đáp án**:

- A. Amazon Connect contact flow...
- B. Amazon Pinpoint journey...
- C. Use Amazon Simple Queue Service (Amazon SQS) to distribute the SMS messages. Use AWS Lambda to process the responses.
- D. Create an Amazon Simple Notification Service (Amazon SNS) FIFO topic...

**Đáp án đúng**: **B**

**Giải thích chi tiết**:

- **B - ĐÚNG**: **Amazon Pinpoint** là dịch vụ marketing communication chuyên dụng cho SMS, Email, Push Notification.
  - Điểm mấu chốt: **Two-way SMS** (SMS 2 chiều). Pinpoint hỗ trợ nhận Reply từ người dùng.
  - Pinpoint có thể stream event (bao gồm sms reply) tới **Kinesis** (hoặc S3/Firehose) để archive/analyze ("Store responses for a year").
- **A - SAI**: Amazon Connect là Contact Center (Call center), dù có SMS support nhưng usecase "Marketing campaign" là đất diễn của Pinpoint.
- **C/D - SAI**: SNS/SQS chủ yếu là gửi đi (Outbound). SNS không native support nhận SMS Reply để process logic phức tạp như Pinpoint Journey.

---

## Câu 202

**Đề bài**:  A company is planning to move its data to an Amazon S3 bucket. The data must be encrypted when it is stored in the S3 bucket. Additionally, the encryption key must be automatically rotated every year. Which solution will meet these requirements with the LEAST operational overhead?

**Các đáp án**:

- A. SSE-S3...
- B. CMK + Auto rotation + Default encryption...
- C. Manual rotation...
- D. Import key material...

**Đáp án đúng**: **B**

**Giải thích chi tiết**:

- **B - ĐÚNG**:
  - **SSE-KMS Customer Managed Key (CMK)** hỗ trợ tính năng **Automatic Key Rotation** (chu kỳ 1 năm).
  - Set Default Encryption cho Bucket -> Đảm bảo mọi object mới đều được encrypt.
- **A - SAI**: SSE-S3 key do AWS quản lý rotation (thường là đều đặn nhưng người dùng không control "every year" policy rõ ràng như KMS Rotation checked box, và KMS audit tốt hơn). Tuy nhiên, nếu đề bài chỉ cần "rotated" chung chung thì SSE-S3 cũng ok, nhưng KMS CMK là Explicit "Every Year" rotation feature. Các đề thi AWS thường định nghĩa KMS CMK là giải pháp cho requirement "Rotation every year".
- **D - SAI**: Import key material **KHÔNG** hỗ trợ Automatic Key Rotation (phải rotate thủ công).

---

## Câu 203

**Đề bài**:  The customers of a finance company request appointments with financial advisors by sending text messages. A web application that runs on Amazon EC2 instances accepts the appointment requests. The text messages are published to an Amazon Simple Queue Service (Amazon SQS) queue through the web application. Another application that runs on EC2 instances then sends meeting invitations and meeting confirmation email messages to the customers. After successful scheduling, this application stores the meeting information in an Amazon DynamoDB database. As the company expands, customers report that their meeting invitations are taking longer to arrive. What should a solutions architect recommend to resolve this issue?

**Các đáp án**:

- A. DAX...
- B. API Gateway...
- C. CloudFront...
- D. Add an Auto Scaling group for the application that sends meeting invitations. Configure the Auto Scaling group to scale based on the depth of the SQS queue.

**Đáp án đúng**: **D**

**Giải thích chi tiết**:

- **D - ĐÚNG**: Vấn đề là "Invitations taking longer", tức là backlog trong SQS đang tăng lên (Queue Depth cao) và Worker xử lý không kịp.
  - Giải pháp: **Auto Scaling** cho Worker Tier (Application send invitation).
  - Metric: **Scale based on SQS Queue Depth** (ApproximateNumberOfMessagesVisible).

---

## Câu 204

**Đề bài**:  An online retail company has more than 50 million active customers and receives more than 25,000 orders each day. The company collects purchase data for customers and stores this data in Amazon S3. Additional customer data is stored in Amazon RDS. The company wants to make all the data available to various teams so that the teams can perform analytics. The solution must provide the ability to manage fine-grained permissions for the data and must minimize operational overhead. Which solution will meet these requirements?

**Các đáp án**:

- A. Migrate to RDS... (RDS không scale tốt cho analytics dữ liệu lớn kiểu S3).
- B. Lambda copy RDS to S3. Glue Crawler. Athena to query. S3 policies limits access. (S3 Policies không phải Fine-grained column/row level tốt).
- C. Create a data lake by using AWS Lake Formation. Create an AWS Glue JDBC connection to Amazon RDS. Register the S3 bucket in Lake Formation. Use Lake Formation access controls to limit access.
- D. Redshift... (Tốn chi phí cluster và maintenance).

**Đáp án đúng**: **C**

**Giải thích chi tiết**:

- **C - ĐÚNG**: **AWS Lake Formation**.
  - Là lớp quản lý bảo mật tập trung cho Data Lake.
  - Hỗ trợ **Fine-grained access control** (Column-level, Row-level, Cell-level) cho cả data trong S3 và data catalog từ RDS (qua Glue).
  - Minimize overhead so với tự quản lý permissions bằng IAM/S3 Bucket Policies phức tạp.

---

## Câu 205

**Đề bài**:  A company hosts a marketing website in an on-premises data center. The website consists of static documents and runs on a single server. An administrator updates the website content infrequently and uses an SFTP client to upload new documents. The company decides to host its website on AWS and to use Amazon CloudFront. The company’s solutions architect creates a CloudFront distribution. The solutions architect must design the most cost-effective and resilient architecture for website hosting to serve as the CloudFront origin. Which solution will meet these requirements?

**Các đáp án**:

- A. Lightsail...
- B. ASG EC2...
- C. Private S3 + OAI + AWS CLI (Đề bài nói user dùng SFTP client).
- D. Create a public Amazon S3 bucket. Configure AWS Transfer for SFTP. Configure the S3 bucket for website hosting. Upload website content by using the SFTP client.

**Đáp án đúng**: **C** (Thực tế là không có đáp án perfect, nhưng D sai vì Public Bucket S3 là bad practice security, A/B tốn kém running server).
Tuy nhiên, đề bài nói "Administrator... uses an SFTP client".

- **A**: Lightsail là VPS đơn giản, cài SFTP dễ.
- **B**: EC2 ASG hơi overkill cho static web update "infrequently".
- **C**: S3 là "Most cost-effective and resilient". Nhưng upload bằng "AWS CLI" thay đổi thói quen user (SFTP).
- **D**: AWS Transfer for SFTP rất đắt ($0.30/hour ~ $200/month). Không "cost-effective" cho website nhỏ.
- **Tuy nhiên**, trong các bài thi AWS, **S3 + CloudFront** luôn là đáp án chuẩn cho "Static Website Hosting" về mặt Cost/Resilience. Việc đổi công cụ upload (SFTP -> CLI/Console) thường được chấp nhận để đạt architecture tối ưu.
- Nếu bắt buộc giữ SFTP: Option A (Lightsail) rẻ hơn Transfer Family.
- Nhưng câu hỏi hướng tới "Architecture for website hosting to serve as CloudFront origin". S3 là origin tốt nhất.
- Chọn **C** (Chấp nhận đổi client tool) hoặc **D** (Nếu công ty giàu).
- Xét tiêu chí "Cost-effective" là quan trọng nhất: **C** (S3 hosting rẻ bèo, rẻ hơn Lightsail/Transfer Family nhiều). User nên đổi sang upload qua Console/CLI. Hoặc dùng S3 Transfer acceleration.

(Lưu ý: Có thể đề bài D là "S3 bucket... AWS Transfer...". Cách viết này có thể trick. Nhưng Transfer Family tốn $200+/tháng. Host cái web static mà tốn thế là sai. S3 standard rẻ hơn. C là đáp án hợp lý nhất về kiến trúc AWS).

---

## Câu 206

**Đề bài**:  A company wants to manage Amazon Machine Images (AMIs). The company currently copies AMIs to the same AWS Region where the AMIs were created. The company needs to design an application that captures AWS API calls and sends alerts whenever the Amazon EC2 CreateImage API operation is called within the company’s account. Which solution will meet these requirements with the LEAST operational overhead?

**Các đáp án**:

- A. Lambda query CloudTrail... (Ko realtime, phải poll).
- B. CloudTrail to S3... SNS... Athena... (Quá phức tạp).
- C. Create an Amazon EventBridge (Amazon CloudWatch Events) rule for the CreateImage API call. Configure the target as an Amazon Simple Notification Service (Amazon SNS)...
- D. SQS... Lambda...

**Đáp án đúng**: **C**

**Giải thích chi tiết**:

- **C - ĐÚNG**: **EventBridge** (CloudWatch Events) tự động bắt các API Call events (qua CloudTrail integration).
  - Tạo Rule matching `eventName: ["CreateImage"]`.
  - Target: **SNS Topic** (gửi email/SMS alert).
  - Serverless, realtime, zero code -> Least overhead.

---

## Câu 207

**Đề bài**:  A company owns an asynchronous API that is used to ingest user requests and, based on the request type, dispatch requests to the appropriate microservice for processing. The company is using Amazon API Gateway to deploy the API front end, and an AWS Lambda function that invokes Amazon DynamoDB to store user requests before dispatching them to the processing microservices. The company provisioned as much DynamoDB throughput as its budget allows, but the company is still experiencing availability issues and is losing user requests. What should a solutions architect do to address this issue without impacting existing users?

**Các đáp án**:

- A. Throttling API Gateway (Làm users bị lỗi 429 -> Impact users).
- B. DAX... (Buffer reads primarily, write-through caching doesn't solve write throughput limit drastically for massive spikes like Queuing).
- C. Secondary Index (Thêm gánh nặng write).
- D. Use the Amazon Simple Queue Service (Amazon SQS) queue and Lambda to buffer writes to DynamoDB.

**Đáp án đúng**: **D**

**Giải thích chi tiết**:

- **D - ĐÚNG**: Pattern **Database Buffering**.
  - Thay vì Lambda ghi thẳng vào DynamoDB (Sync), Lambda đẩy message vào **SQS** (Async).
  - Một Lambda worker khác (hoặc chính Lambda đó trigger từ SQS) sẽ đọc từ Queue và ghi vào DB với tốc độ được kiểm soát (Controlled concurrency).
  - User request được nhận ngay (ack), không bị timeout/fail do DB overload. DB được bảo vệ khỏi spike.

---

## Câu 208

**Đề bài**:  A company needs to move data from an Amazon EC2 instance to an Amazon S3 bucket. The company must ensure that no API calls and no data are routed through public internet routes. Only the EC2 instance can have access to upload data to the S3 bucket. Which solution will meet these requirements?

**Các đáp án**:

- A. Interface VPC Endpoint...
- B. Gateway VPC Endpoint...
- C. nslookup...
- D. ip-ranges.json...

**Đáp án đúng**: **B**

**Giải thích chi tiết**:

- **B - ĐÚNG**: **Gateway VPC Endpoint** là giải pháp chuẩn cho S3 truy cập private từ VPC.
  - Không tốn phí xử lý data (Interface Endpoint tốn tiền).
  - Đi qua mạng AWS backbone.
  - **Resource Policy (Bucket Policy)**: Gán vào Bucket, chỉ cho phép `aws:SourceVpce` hoặc Role của EC2 access. (Đề bài nói "Attach resource policy... allow EC2 IAM Role").
- (A cũng đúng về mặt kỹ thuật (Interface Endpoint/PrivateLink) nhưng Gateway Endpoint thường được ưu tiên cho S3 vì performance/cost free. Tuy nhiên Interface Endpoint hỗ trợ access from on-premise. Đề bài chỉ nói EC2 to S3 -> Gateway Endpoint là default choice).

---

## Câu 209

**Đề bài**:  A solutions architect is designing the architecture of a new application being deployed to the AWS Cloud. The application will run on Amazon EC2 On-Demand Instances and will automatically scale across multiple Availability Zones. The EC2 instances will scale up and down frequently throughout the day. An Application Load Balancer (ALB) will handle the load distribution. The architecture needs to support distributed session data management. The company is willing to make changes to code if needed. What should the solutions architect do to ensure that the architecture supports distributed session data management?

**Các đáp án**:

- A. Use Amazon ElastiCache to manage and store session data.
- B. Sticky sessions (ALB) (Không tốt cho scaling down, mất session if instance terminates).
- C. Session Manager (Là tool remote access, không phải web session).
- D. STS (Auth token, not app session data).

**Đáp án đúng**: **A**

**Giải thích chi tiết**:

- **A - ĐÚNG**: **ElastiCache (Redis/Memcached)** là external session store.
  - Stateless Application architecture.
  - EC2 nào cũng đọc/ghi session từ ElastiCache. Instance chết/scale in không mất session của user.

---

## Câu 210

**Đề bài**:  A company offers a food delivery service that is growing rapidly. Because of the growth, the company’s order processing system is experiencing scaling problems during peak traffic hours. The current architecture includes the following: • A group of Amazon EC2 instances that run in an Amazon EC2 Auto Scaling group to collect orders from the application • Another group of EC2 instances that run in an Amazon EC2 Auto Scaling group to fulfill orders The order collection process occurs quickly, but the order fulfillment process can take longer. Data must not be lost because of a scaling event. A solutions architect must ensure that the order collection process and the order fulfillment process can both scale properly during peak traffic hours. The solution must optimize utilization of the company’s AWS resources. Which solution meets these requirements?

**Các đáp án**:

- A. CloudWatch CPU metrics...
- B. SNS...
- C. Provision two SQS queues... Scale based on notifications (Notifications?).
- D. Provision two Amazon Simple Queue Service (Amazon SQS) queues: one for order collection and another for order fulfillment. Configure the EC2 instances to poll their respective queue. Create a metric based on a backlog per instance calculation. Scale the Auto Scaling groups based on this metric.

**Đáp án đúng**: **D**

**Giải thích chi tiết**:

- **D - ĐÚNG**: Decoupling bằng SQS là chuẩn cho Fast Producer - Slow Consumer.
  - **Backlog per instance** metric: Là cách scale chuẩn nhất cho SQS consumers (Số msg visible / số instance). Đảm bảo mỗi instance gánh đúng lượng job, scale out khi backlog tăng.

---

## Câu 211

**Đề bài**:  A company hosts multiple production applications. One of the applications consists of resources from Amazon EC2, AWS Lambda, Amazon RDS, Amazon Simple Notification Service (Amazon SNS), and Amazon Simple Queue Service (Amazon SQS) across multiple AWS Regions. All company resources are tagged with a tag name of “application” and a value that corresponds to each application. A solutions architect must provide the quickest solution for identifying all of the tagged components. Which solution meets these requirements?

**Các đáp án**:

- A. CloudTrail...
- B. AWS CLI query each service... (Slow).
- C. CloudWatch Logs Insights...
- D. Run a query with the AWS Resource Groups Tag Editor to report on the resources globally with the application tag.

**Đáp án đúng**: **D**

**Giải thích chi tiết**:

- **D - ĐÚNG**: **Resource Groups & Tag Editor** là công cụ global (hoặc multi-region view) giúp tìm kiếm resource dựa trên Tag trên toàn bộ account và các region được hỗ trợ một cách nhanh nhất qua Console/API.

---

## Câu 212

**Đề bài**:  A company needs to export its database once a day to Amazon S3 for other teams to access. The exported object size varies between 2 GB and 5 GB. The S3 access pattern for the data is variable and changes rapidly. The data must be immediately available and must remain accessible for up to 3 months. The company needs the most cost-effective solution that will not increase retrieval time. Which S3 storage class should the company use to meet these requirements?

**Các đáp án**:

- A. S3 Intelligent-Tiering
- B. S3 Glacier Instant Retrieval
- C. S3 Standard
- D. S3 Standard-IA

**Đáp án đúng**: **A**

**Giải thích chi tiết**:

- **A - ĐÚNG**: **Intelligent-Tiering** tự động di chuyển data giữa Frequent và Infrequent Access tiers.
  - Phù hợp với "Variable and changes rapidly access pattern".
  - Không có phí retrieval (Retrieval fee).
  - Immediately available.
- **D (Standard-IA)**: Có phí retrieval fee. Nếu access pattern thay đổi (truy cập nhiều), phí này sẽ cao.
- **B (Glacier Instant)**: Phí retrieval cao hơn cả IA.
- **C (Standard)**: Storage cost cao nhất.

---

## Câu 213

**Đề bài**:  A company is developing a new mobile app. The company must implement proper traffic filtering to protect its Application Load Balancer (ALB) against common application-level attacks, such as cross-site scripting or SQL injection. The company has minimal infrastructure and operational staff. The company needs to reduce its share of the responsibility in managing, updating, and securing servers for its AWS environment. What should a solutions architect recommend to meet these requirements?

**Các đáp án**:

- A. Configure AWS WAF rules and associate them with the ALB.
- B. S3 public...
- C. Shield Advanced (DDoS focus).
- D. EC2 firewall...

**Đáp án đúng**: **A**

**Giải thích chi tiết**:

- **A - ĐÚNG**: **AWS WAF** (Web Application Firewall).
  - Chuyên trị Layer 7 attacks: **XSS** (Cross-site Scripting), **SQL Injection**.
  - Managed Rule Groups (AWS Managed Rules) giúp "Minimal infrastructure/staff" - chỉ cần bật lên là chạy.

---

## Câu 214

**Đề bài**:  A company’s reporting system delivers hundreds of .csv files to an Amazon S3 bucket each day. The company must convert these files to Apache Parquet format and must store the files in a transformed data bucket. Which solution will meet these requirements with the LEAST development effort?

**Các đáp án**:

- A. EMR Spark (Spark code complex).
- B. Create an AWS Glue crawler to discover the data. Create an AWS Glue extract, transform, and load (ETL) job to transform the data...
- C. Batch Bash...
- D. Lambda... (Phải viết code convert CSV->Parquet).

**Đáp án đúng**: **B**

**Giải thích chi tiết**:

- **B - ĐÚNG**: **AWS Glue** là Fully Managed ETL.
  - Glue generate code auto (Visual ETL or script gen).
  - Hỗ trợ native CSV -> Parquet conversion chỉ bằng vài click config trong Glue Studio -> "Least development effort".

---

## Câu 215

**Đề bài**:  A company has 700 TB of backup data stored in network attached storage (NAS) in its data center. This backup data need to be accessible for infrequent regulatory requests and must be retained 7 years. The company has decided to migrate this backup data from its data center to AWS. The migration must be complete within 1 month. The company has 500 Mbps of dedicated bandwidth on its public internet connection available for data transfer. What should a solutions architect do to migrate and store the data at the LOWEST cost?

**Các đáp án**:

- A. Order AWS Snowball devices to transfer the data. Use a lifecycle policy to transition the files to Amazon S3 Glacier Deep Archive.
- B. VPN...
- C. Direct Connect...
- D. DataSync...

**Đáp án đúng**: **A**

**Giải thích chi tiết**:

- **Tính toán băng thông**: 500 Mbps lý thuyết.
  - 700 TB = 700 _ 1024 _ 1024 MB ~= 734,000,000 MB.
  - 500 Mbps = 62.5 MB/s.
  - Thời gian = 734,000,000 / 62.5 = 11,744,000 giây ~= 135 ngày. -> **Không kịp deadline 1 tháng**.
  - Do đó B, C, D (Transfer qua mạng 500Mbps) đều Fail.
- **A - ĐÚNG**: **Snowball**. Thiết bị chuyển dữ liệu vật lý (80TB/device). Dùng khoảng 10 thiết bị là xong trong vài tuần.
  - Storage: **Glacier Deep Archive** là rẻ nhất cho "Retain 7 years, Infrequent".

---

## Câu 216

**Đề bài**:  A company has a serverless website with millions of objects in an Amazon S3 bucket. The company uses the S3 bucket as the origin for an Amazon CloudFront distribution. The company did not set encryption on the S3 bucket before the objects were loaded. A solutions architect needs to enable encryption for all existing objects and for all objects that are added to the S3 bucket in the future. Which solution will meet these requirements with the LEAST amount of effort?

**Các đáp án**:

- A. New Bucket...
- B. Turn on the default encryption settings for the S3 bucket. Use the S3 Inventory feature to create a .csv file that lists the unencrypted objects. Run an S3 Batch Operations job that uses the copy command to encrypt those objects.
- C. KMS... Versioning...
- D. Modify manual... (Millions objects -> Impossible).

**Đáp án đúng**: **B**

**Giải thích chi tiết**:

- **B - ĐÚNG**:
  - **Future objects**: Bật Default Encryption.
  - **Existing objects**: S3 không tự động encrypt lại object cũ. Cần dùng **S3 Inventory** (liệt kê object) + **S3 Batch Operations** (thực hiện lệnh Copy object tại chỗ - Copy in place - để trigger encryption). Đây là cách automated và scalable duy nhất ít effort nhất cho hàng triệu object.

---

## Câu 217

**Đề bài**:  A company runs a global web application on Amazon EC2 instances behind an Application Load Balancer. The application stores data in Amazon Aurora. The company needs to create a disaster recovery solution and can tolerate up to 30 minutes of downtime and potential data loss. The solution does not need to handle the load when the primary infrastructure is healthy. What should a solutions architect do to meet these requirements?

**Các đáp án**:

- A. Active-Passive Failover (Route 53). Create an Aurora Replica in a second AWS Region.
- B. Pilot Light (Active-Active is wrong).
- C. Active-Active...
- D. Backup & Restore (RTO > 30 mins for infrastructure).

**Đáp án đúng**: **A**

**Giải thích chi tiết**:

- **A - ĐÚNG**: **Pilot Light / Warm Standby** approach.
  - **Aurora Cross-Region Replica**: Replication lag thấp (< 1s). Khi disaster xảy ra, promote Replica thành Primary rất nhanh (< vài phút). Đáp ứng RTO 30 mins tốt.
  - Route 53 Active-Passive: Switch DNS khi failover.
  - Hạ tầng App ở Region 2 có thể chạy scale nhỏ (Pilot Light) hoặc auto-scaling group min=0/1.

---

## Câu 218

**Đề bài**:  A company has a web server running on an Amazon EC2 instance in a public subnet with an Elastic IP address. The default security group is assigned to the EC2 instance. The default network ACL has been modified to block all traffic. A solutions architect needs to make the web server accessible from everywhere on port 443. Which combination of steps will accomplish this task? (Choose two.)

**Các đáp án**: (Choose two).

- A. Security Group Allow Inbound 443 from 0.0.0.0/0.
- B. Security Group Outbound (Stateful - SG tự động allow return traffic).
- C. Update NACL Allow Inbound 443.
- D. Update NACL Inbound/Outbound 443 (Gần đúng nhưng chưa đủ Ephemeral ports).
- E. Update the network ACL to allow inbound TCP port 443 from source 0.0.0.0/0 and outbound TCP port 32768-65535 to destination 0.0.0.0/0.

**Đáp án đúng**: **A, E**

**Giải thích chi tiết**:

- **A - ĐÚNG**: Security Group là **Stateful**. Chỉ cần mở Inbound 443. Outbound return traffic tự động được allow.
- **E - ĐÚNG**: Network ACL là **Stateless**.
  - Cần mở Inbound 443 (Client -> Server).
  - Cần mở **Outbound Ephemeral Ports** (32768-65535 cho Linux/Windows modern) để server trả lời lại Client. (Nếu chọn D chỉ mở outbound 443 là sai, vì traffic trả về đi ra từ cổng ngẫu nhiên cao).

---

## Câu 219

**Đề bài**:  A company’s application is having performance issues. The application is stateful and needs to complete in-memory tasks on Amazon EC2 instances. The company used AWS CloudFormation to deploy infrastructure and used the M5 EC2 instance family. As traffic increased, the application performance degraded. Users are reporting delays when the users attempt to access the application. Which solution will resolve these issues in the MOST operationally efficient way?

**Các đáp án**:

- A. Replace with T3 (Burstable - not for consistently high memory task).
- B. ASG...
- C. Replace with **R5 EC2 instances**. Use CloudWatch built-in EC2 memory metrics (CloudWatch không có built-in memory metrics).
- D. Modify the CloudFormation templates. Replace the EC2 instances with R5 EC2 instances. Deploy the Amazon CloudWatch agent on the EC2 instances to generate custom application latency metrics for future capacity planning.

**Đáp án đúng**: **D** (Và C nếu chấp nhận giả định "Built-in" là sai sót đề bài, nhưng D chính xác hơn about agent).
Tuy nhiên, key điểm là **R5 instance** (Memory Optimized) phù hợp cho "In-memory tasks".
Và CloudWatch Memory Metric yêu cầu **CloudWatch Agent** (Custom metric). Standard metric chỉ có CPU, Disk, Network.
=> **D** là đáp án kỹ thuật chính xác nhất.

---

## Câu 220

**Đề bài**:  A solutions architect is designing a new API using Amazon API Gateway that will receive requests from users. The volume of requests is highly variable; several hours can pass without receiving a single request. The data processing will take place asynchronously, but should be completed within a few seconds after a request is made. Which compute service should the solutions architect have the API invoke to deliver the requirements at the lowest cost?

**Các đáp án**:

- A. Glue (Batch/ETL - slow startup).
- B. An AWS Lambda function
- C. EKS...
- D. ECS...

**Đáp án đúng**: **B**

**Giải thích chi tiết**:

- **B - ĐÚNG**: **Lambda**.
  - Serverless, pay-per-use (Lowest Cost cho variable traffic).
  - Startup time nhanh (milli-seconds) -> "Completed within a few seconds".
  - Không tốn tiền idle khi "several hours pass without request". (Container/EC2 vẫn tốn tiền duy trì).

---

## Câu 221

**Đề bài**:  A company runs an application on a group of Amazon Linux EC2 instances. For compliance reasons, the company must retain all application log files for 7 years. The log files will be analyzed by a reporting tool that must be able to access all the files concurrently. Which storage solution meets these requirements MOST cost-effectively?

**Các đáp án**:

- A. EBS (Đắt, chỉ attach 1 instance - Multi-attach limited).
- B. EFS (Đắt).
- C. Instance Store (Mất data khi stop/start - không retain được).
- D. Amazon S3.

**Đáp án đúng**: **D**

**Giải thích chi tiết**:

- **D - ĐÚNG**: **S3**.
  - Storage rẻ nhất.
  - Hỗ trợ lưu trữ lâu dài (7 năm - Glacier).
  - Reporting tool (như Athena, EMR) có thể access concurrent thoải mái.
  - Log files từ EC2 có thể đẩy lên S3 qua Kinesis/CloudWatch Logs/S3 API.

---

## Câu 222

**Đề bài**:  A company has hired an external vendor to perform work in the company’s AWS account. The vendor uses an automated tool that is hosted in an AWS account that the vendor owns. The vendor does not have IAM access to the company’s AWS account. How should a solutions architect grant this access to the vendor?

**Các đáp án**:

- A. Create an IAM role in the company’s account to delegate access to the vendor’s IAM role. Attach the appropriate IAM policies to the role for the permissions that the vendor requires.
- B. IAM User (Shared credential - Bad practice).
- C. IAM Group (Same as User).
- D. Identity Provider (SAML/OIDC - không phải AWS account cross-access standard).

**Đáp án đúng**: **A**

**Giải thích chi tiết**:

- **A - ĐÚNG**: **Cross-Account Access using IAM Roles**.
  - Tạo Role ở Account Company.
  - Trust Policy: Allow Vendor's Account ID (Principal).
  - Vendor log in vào account của họ, **Switch Role** (AssumeRole) sang Account Company để làm việc. Không cần exchange password/access key. Secure.

---

## Câu 223

**Đề bài**:  A company has deployed a Java Spring Boot application as a pod that runs on Amazon Elastic Kubernetes Service (Amazon EKS) in private subnets. The application needs to write data to an Amazon DynamoDB table. A solutions architect must ensure that the application can interact with the DynamoDB table without exposing traffic to the internet. Which combination of steps should the solutions architect take to accomplish this goal? (Choose two.)

**Các đáp án**:

- A. Attach an IAM role that has sufficient privileges to the EKS pod.
- B. IAM user (Bad).
- C. Network ACL (Không liên quan routing).
- D. Create a VPC endpoint for DynamoDB.
- E. Access keys (Bad).

**Đáp án đúng**: **A, D**

**Giải thích chi tiết**:

- **A - ĐÚNG**: **IRSA (IAM Roles for Service Accounts)**. Cấp quyền cho Pod access DynamoDB an toàn.
- **D - ĐÚNG**: **VPC Endpoint for DynamoDB**. Route traffic qua mạng AWS Private network, không đi ra Internet Gateway.

---

## Câu 224

**Đề bài**:  A company recently migrated its web application to AWS by rehosting the application on Amazon EC2 instances in a single AWS Region. The company wants to redesign its application architecture to be highly available and fault tolerant. Traffic must reach all running EC2 instances randomly. Which combination of steps should the company take to meet these requirements? (Choose two.)

**Các đáp án**:

- A. Failover routing (Active-Passive - not "all instances randomly").
- B. Weighted routing (Manual split % - not "all instances").
- C. Create an Amazon Route 53 multivalue answer routing policy.
- D. Launch 3 instances...
- E. Launch four EC2 instances: two instances in one Availability Zone and two instances in another Availability Zone.

**Đáp án đúng**: **C, E**

**Giải thích chi tiết**:

- **E - ĐÚNG**: **Multi-AZ Deployment** (2 AZ x 2 instances = 4). Đảm bảo High Availability và Fault Tolerance (nếu 1 AZ chết, còn 2 instance ở AZ kia).
- **C - ĐÚNG**: **Multivalue Answer Routing**. Route 53 trả về nhiều IP (lên tới 8) cho client. Client tự chọn ngẫu nhiên để connect (Client-side load balancing basic). Health check được tích hợp để loại bỏ IP lỗi.

---

## Câu 225

**Đề bài**:  A media company collects and analyzes user activity data on premises. The company wants to migrate this capability to AWS. The user activity data store will continue to grow and will be petabytes in size. The company needs to build a highly available data ingestion solution that facilitates on-demand analytics of existing data and new data with SQL. Which solution will meet these requirements with the LEAST operational overhead?

**Các đáp án**:

- A. Kinesis -> S3.
- B. Kinesis Firehose -> Redshift (Redshift expensive/complex ops for ingestion only layer).
- C. S3 -> Lambda (Code maintenance).
- D. EC2 -> RDS (Not suitable for Petabytes analytics).

**Đáp án đúng**: **A** (Kết hợp Athena which is implied by "SQL" analytics on S3).

**Giải thích chi tiết**:

- **A - ĐÚNG**: **Kinesis Data Streams** (Ingest) -> **Firehose** -> **S3** (Data Lake).
  - Data nằm trên S3 (Petabytes scale, cheap).
  - "On-demand analytics with SQL" -> Dùng **Amazon Athena** query trực tiếp S3 data. Đây là mô hình Serverless Data Lake analytics standard. (Question implied the ingestion part leading to STORAGE for analytics).

---

## Câu 226

**Đề bài**:  A company collects data from thousands of remote devices by using a RESTful web services application that runs on an Amazon EC2 instance. The EC2 instance receives the raw data, transforms the raw data, and stores all the data in an Amazon S3 bucket. The number of remote devices will increase into the millions soon. The company needs a highly scalable solution that minimizes operational overhead. Which combination of steps should a solutions architect take to meet these requirements? (Choose two.)

**Các đáp án**:

- A. Glue (Processing later).
- B. Route 53 (Routing only).
- C. More EC2 (Ops overhead).
- D. SQS...
- E. Use Amazon API Gateway to send the raw data to an Amazon Kinesis data stream. Configure Amazon Kinesis Data Firehose to use the data stream as a source to deliver the data to Amazon S3.

**Đáp án đúng**: **E** (Chọn 1 solution E bao gồm 2 steps, hoặc đề bài cấu trúc lạ). Thực ra E là một đáp án hoàn chỉnh thay thế EC2.
Nếu phải chọn 2: Chắc chắn **E** là phần core.
Có thể câu hỏi muốn chọn **API Gateway** và **Kinesis Proxy**.
Trong list:

- A: Glue process data (Ok operation).
- E: Ingestion Pipeline (API GW -> Kinesis -> Firehose -> S3).
  Pattern E là chuẩn mực cho "Serverless Ingestion" thay thế EC2. Nó bao gồm cả API Gateway và Kinesis.
  Nếu E counted as 1 answer. Thì answer còn lại là gì?
  A (Glue) để process sau khi S3? Đề bài nói "EC2 receives, transforms, stores".
  Nếu thay EC2:
- API Gateway (Receive).
- Kinesis (Buffer).
- Firehose (Transform & Store).
  Vậy E cover hết rồi. Có thể đáp án là tách E làm 2 ý? Trong bộ dump này E là 1 dòng dài.
  Khả năng khác: Dùng **API Gateway** front-end Kinesis (Service Proxy).
  Đáp án tham khảo thường là **E**. (Vì nó cover full pipeline replacement cho EC2, highly scalable, zero ops).

---

## Câu 227

**Đề bài**:  A company needs to retain its AWS CloudTrail logs for 3 years. The company is enforcing CloudTrail across a set of AWS accounts by using AWS Organizations from the parent account. The CloudTrail target S3 bucket is configured with S3 Versioning enabled. An S3 Lifecycle policy is in place to delete current objects after 3 years. After the fourth year of use of the S3 bucket, the S3 bucket metrics show that the number of objects has continued to rise. However, the number of new CloudTrail logs that are delivered to the S3 bucket has remained consistent. Which solution will delete objects that are older than 3 years in the MOST cost-effective manner?

**Các đáp án**:

- A. CloudTrail settings (Ko control S3 storage).
- B. Configure the S3 Lifecycle policy to delete previous versions as well as current versions.
- C. Lambda...
- D. Ownership...

**Đáp án đúng**: **B**

**Giải thích chi tiết**:

- **B - ĐÚNG**: Khi S3 Versioning enable, nếu bạn xóa object (hoặc Lifecycle expire current version), S3 tạo ra **Delete Marker** và giữ lại **Nonconflicting (Previous) Version**. Dung lượng vẫn bị tính.
  - Cần config Lifecycle Policy expire **Noncurrent versions** (Previous versions) thì mới thực sự xóa data và giải phóng dung lượng.

---

## Câu 228

**Đề bài**:  A company has an API that receives real-time data from a fleet of monitoring devices. The API stores this data in an Amazon RDS DB instance for later analysis. The amount of data that the monitoring devices send to the API fluctuates. During periods of heavy traffic, the API often returns timeout errors. After an inspection of the logs, the company determines that the database is not capable of processing the volume of write traffic that comes from the API. A solutions architect must minimize the number of connections to the database and must ensure that data is not lost during periods of heavy traffic. Which solution will meet these requirements?

**Các đáp án**:

- A. Increase size (Scaling vertical - ko giải quyết connection storm tốt bằng decoupling).
- B. Multi-AZ (HA only).
- C. Modify the API to write incoming data to an Amazon Simple Queue Service (Amazon SQS) queue. Use an AWS Lambda function that Amazon SQS invokes to write data from the queue to the database.
- D. SNS...

**Đáp án đúng**: **C**

**Giải thích chi tiết**:

- **C - ĐÚNG**: **SQS Buffering**.
  - API ghi vào SQS cực nhanh (vài ms), trả response OK cho devices -> Hết timeout.
  - Lambda worker đọc từ SQS và ghi từ từ vào RDS. Lambda quản lý số lượng concurrent connection tới DB, tránh làm sập DB.
  - SQS đảm bảo "No data lost" (Durable storage).

---

## Câu 229

**Đề bài**:  A company manages its own Amazon EC2 instances that run MySQL databases. The company is manually managing replication and scaling as demand increases or decreases. The company needs a new solution that simplifies the process of adding or removing compute capacity to or from its database tier as needed. The solution also must offer improved performance, scaling, and durability with minimal effort from operations. Which solution meets these requirements?

**Các đáp án**:

- A. Migrate the databases to Amazon Aurora Serverless for Aurora MySQL.
- B. PostgreSQL (Sai engine).
- C. Larger EC2 (Manual).
- D. EC2 ASG (Vẫn phải quản lý replication thủ công/script).

**Đáp án đúng**: **A**

**Giải thích chi tiết**:

- **A - ĐÚNG**: **Aurora Serverless**.
  - **Scaling**: Tự động scale compute capacity (ACUs) dựa trên demand -> Simplify scaling.
  - **Performance/Durability**: Architect của Aurora (6 copies, storage detach) ưu việt hơn MySQL thường.
  - **Min Ops**: Serverless, không cần quản lý instance.

---

## Câu 230

**Đề bài**:  A company is concerned that two NAT instances in use will no longer be able to support the traffic needed for the company’s application. A solutions architect wants to implement a solution that is highly available, fault tolerant, and automatically scalable. What should the solutions architect recommend?

**Các đáp án**:

- A. Replace with NAT Gateways in same AZ (Not Fault Tolerant if AZ fail).
- B. ASG with NLB... (Phức tạp, NAT Instance legacy).
- C. Remove the two NAT instances and replace them with two NAT gateways in different Availability Zones.
- D. Spot Instances...

**Đáp án đúng**: **C**

**Giải thích chi tiết**:

- **C - ĐÚNG**: **NAT Gateway** là Managed Service, performance cực cao (up to 45-100 Gbps), tự động scale.
  - Deploy 2 NAT Gateway ở 2 AZ khác nhau -> **HA & Fault Tolerant**.

---

## Câu 231

**Đề bài**:  An application runs on an Amazon EC2 instance that has an Elastic IP address in VPC A. The application requires access to a database in VPC B. Both VPCs are in the same AWS account. Which solution will provide the required access MOST securely?

**Các đáp án**:

- A. Security Group Allow Public IP (Traffic đi qua Internet -> Kém secure).
- B. Configure a VPC peering connection between VPC A and VPC B.
- C. Public DB... (Bad).
- D. Proxy EC2... (Overhead).

**Đáp án đúng**: **B**

**Giải thích chi tiết**:

- **B - ĐÚNG**: **VPC Peering**. Kết nối 2 VPC qua mạng nội bộ AWS. Traffic private, secure, high speed. EC2 VPC A dùng Private IP của DB VPC B để connect.

---

## Câu 232

**Đề bài**:  A company runs demonstration environments for its customers on Amazon EC2 instances. Each environment is isolated in its own VPC. The company’s operations team needs to be notified when RDP or SSH access to an environment has been established.

**Các đáp án**:

- A. App Insights...
- B. SSM...
- C. Publish VPC flow logs to Amazon CloudWatch Logs. Create required metric filters. Create an Amazon CloudWatch metric alarm with a notification action for when the alarm is in the ALARM state.
- D. EventBridge...

**Đáp án đúng**: **C**

**Giải thích chi tiết**:

- **C - ĐÚNG**: **VPC Flow Logs** ghi lại traffic IP.
  - "Access established" = Flow Log record có Port 22 (SSH) hoặc 3389 (RDP) với status ACCEPT.
  - Tạo **Metric Filter** trong CloudWatch Logs để đếm mẫu (Pattern match: `DST_PORT=22 OR DST_PORT=3389`).
  - Tạo Alarm trên metric đó -> Notify SNS.

---

## Câu 233

**Đề bài**:  A solutions architect has created a new AWS account and must secure AWS account root user access. Which combination of actions will accomplish this? (Choose two.)

**Các đáp án**:

- A. Use strong password.
- B. Enable multi-factor authentication (MFA).
- C. Access key (Root NÊN xóa Access Key, không tạo thêm).
- D. Group (Root ko add vào group dc/ko cần).
- E. Permissions (Root full quyền mặc định).

**Đáp án đúng**: **A, B** (Hoặc chính xác hơn là "Delete Access Keys" và "Enable MFA"). Trong list này chọn A và B.

---

## Câu 234

**Đề bài**:  A company is building a new web-based customer relationship management application. The application will use several Amazon EC2 instances that are backed by Amazon Elastic Block Store (Amazon EBS) volumes behind an Application Load Balancer (ALB). The application will also use an Amazon Aurora database. All data for the application must be encrypted at rest and in transit. Which solution will meet these requirements?

**Các đáp án**:

- A. KMS on ALB (Sai, ALB dùng ACM Certificate).
- B. Root account (Sai).
- C. Use AWS Key Management Service (AWS KMS) to encrypt the EBS volumes and Aurora database storage at rest. Attach an AWS Certificate Manager (ACM) certificate to the ALB to encrypt data in transit.
- D. BitLocker...

**Đáp án đúng**: **C**

**Giải thích chi tiết**:

- **Encryption At Rest**: Dùng **KMS** key để encrypt EBS volume và Aurora Cluster.
- **Encryption In Transit**: Dùng **ACM Certificate** (SSL/TLS) cài đặt trên ALB Listener (HTTPS).

---

## Câu 235

**Đề bài**:  A company is moving its on-premises Oracle database to Amazon Aurora PostgreSQL. The database has several applications that write to the same tables. The applications need to be migrated one by one with a month in between each migration. Management has expressed concerns that the database has a high number of reads and writes. The data must be kept in sync across both databases throughout the migration. What should a solutions architect recommend?

**Các đáp án**:

- A. DataSync...
- B. DMS Full load + CDC...
- C. Use the AWS Schema Conversion Tool (SCT) ... Use AWS DMS ... Create a full load plus change data capture (CDC) replication task ...
- D. ...

**Đáp án đúng**: **C**

**Giải thích chi tiết**:

- **SCT**: Cần thiết để convert Schema từ Oracle -> PostgreSQL (khác engine).
- **DMS CDC**: Replication liên tục (Change Data Capture) giúp 2 DB sync trong suốt quá trình migrate dài hơi (1 tháng/app).
- **Memory Optimized**: DMS Replicatiion Instance dùng Memory Optimized instance type thường tốt cho workload heavy transactions/CDC.

---

## Câu 236

**Đề bài**:  A company has a three-tier application for image sharing. The application uses an Amazon EC2 instance for the front-end layer, another EC2 instance for the application layer, and a third EC2 instance for a MySQL database. A solutions architect must design a scalable and highly available solution that requires the least amount of change to the application. Which solution meets these requirements?

**Các đáp án**:

- A. S3 frontend... (Cần rewrite frontend code).
- B. Beanstalk Multi-AZ... RDS Read Replica (Read replica alone is not HA, need Multi-AZ standby).
- C. ... Memory optimized instance (Single DB instance -> Not HA).
- D. Use load-balanced Multi-AZ AWS Elastic Beanstalk environments for the front-end layer and the application layer. Move the database to an Amazon RDS Multi-AZ DB instance. Use Amazon S3 to store and serve users’ images.

**Đáp án đúng**: **D**

**Giải thích chi tiết**:

- **D - ĐÚNG**:
  - **Beanstalk** (Or ASG) Multi-AZ: Giải quyết HA cho Web/App tier. Beanstalk support platform cũ, ít changes.
  - **RDS Multi-AZ**: Giải quyết HA cho Database.
  - **S3 for Images**: Offload static content -> Scalable storage.

---

## Câu 237

**Đề bài**:  An application running on an Amazon EC2 instance in VPC-A needs to access files in another EC2 instance in VPC-B. Both VPCs are in separate AWS accounts. The network administrator needs to design a solution to configure secure access to EC2 instance in VPC-B from VPC-A. The connectivity should not have a single point of failure or bandwidth concerns. Which solution will meet these requirements?

**Các đáp án**:

- A. Set up a VPC peering connection between VPC-A and VPC-B.
- B. VPC Gateway Endpoint (Chỉ cho S3/DynamoDB).
- C. VGW...
- D. Private VIF (Cho Direct Connect).

**Đáp án đúng**: **A**

**Giải thích chi tiết**:

- **A - ĐÚNG**: **VPC Peering** support Cross-account.
  - Sử dụng hạ tầng AWS backbone => High bandwidth, no bottleneck.
  - Highly Available by design (No single point of failure like VPN connection).

---

## Câu 238

**Đề bài**:  A company wants to experiment with individual AWS accounts for its engineer team. The company wants to be notified as soon as the Amazon EC2 instance usage for a given month exceeds a specific threshold for each account. What should a solutions architect do to meet this requirement MOST cost-effectively?

**Các đáp án**:

- A. Cost Explorer Report (Not realtime alert).
- B. Cost Explorer...
- C. Use AWS Budgets to create a cost budget for each account. Set the period to monthly. Set the scope to EC2 instances. Set an alert threshold...
- D. CUR + Athena (Complex, expensive).

**Đáp án đúng**: **C**

**Giải thích chi tiết**:

- **C - ĐÚNG**: **AWS Budgets**.
  - Cho phép set budget cụ thể cho Service (EC2).
  - Email/SNS notification khi forecast hoặc actual cost vượt ngưỡng.
  - Free tier usage OK. Cost-effective.

---

## Câu 239

**Đề bài**:  A solutions architect needs to design a new microservice for a company’s application. Clients must be able to call an HTTPS endpoint to reach the microservice. The microservice also must use AWS Identity and Access Management (IAM) to authenticate calls. The solutions architect will write the logic for this microservice by using a single AWS Lambda function that is written in Go 1.x. Which solution will deploy the function in the MOST operationally efficient way?

**Các đáp án**:

- A. API Gateway... (Expensive, more config).
- B. Create a Lambda function URL for the function. Specify AWS_IAM as the authentication type.
- C. Lambda@Edge...
- D. CloudFront Functions (No Go support, minimal logic).

**Đáp án đúng**: **B**

**Giải thích chi tiết**:

- **B - ĐÚNG**: **Lambda Function URL**.
  - Tính năng mới (từ 2022). Cung cấp direct HTTPS endpoint cho Lambda `https://...lambda-url...`.
  - Hỗ trợ built-in **AWS_IAM** Auth type.
  - Đơn giản hơn nhiều so với setup API Gateway -> "Most operationally efficient".

---

## Câu 240

**Đề bài**:  A company previously migrated its data warehouse solution to AWS. The company also has an AWS Direct Connect connection. Corporate office users query the data warehouse using a visualization tool. The average size of a query returned by the data warehouse is 50 MB and each webpage sent by the visualization tool is approximately 500 KB. Result sets returned by the data warehouse are not cached. Which solution provides the LOWEST data transfer egress cost for the company?

**Các đáp án**:

- A. On-prem (Egress 50MB/query over internet -> Expensive).
- B. Tool In-Region (AWS). Access over internet (Egress 500KB/page over internet).
- C. On-prem + Direct Connect (Reduced rate, but still paying for 50MB egress).
- D. Tool In-Region. Access over DX (Egress 500KB over DX).

**Đáp án đúng**: **B** (Hoặc D tùy giá DX vs Internet, nhưng logic là Move Computation to Data).

**Giải thích chi tiết**:

- Nếu để Visualization Tool ở On-prem: Phải kéo 50MB raw data về cho mỗi query -> Egress cực lớn.
- Nếu để Visualization Tool ở **Same Region** với Data Warehouse: Traffic 50MB là nội bộ (Free/Cheap). Chỉ phải gửi kết quả hiển thị (Webpage 500KB) về cho user -> Egress cực nhỏ.
- => Chọn B hoặc D. Access over Internet (B) cho 500KB là rất rẻ, có thể rẻ hơn chi phí port DX (D). Tuy nhiên D "lowest egress cost" per GB thì DX rẻ hơn Internet. Nhưng tổng thể B là architecture hợp lý nhất. Nếu câu hỏi nhấn mạnh "Data transfer egress COST", DX rates < Internet rates. Nhưng 500KB là quá nhỏ.
- So sánh B và D: B (Internet) free inbound, egress standard. D (DX) egress thấp hơn standard.
- Tuy nhiên quan trọng nhất là **Tool phải ở AWS**. -> Loại A, C.
- Giữa B và D: Access 500KB qua Internet vs DX. DX rẻ hơn. Chọn D?
- Nhưng B "Low ops" hơn.
- Thường đáp án dạng này là **B**. (Dùng Workspaces hoặc EC2 host tool, access qua Internet/VPN).

---

## Câu 241

**Đề bài**:  An online learning company is migrating to the AWS Cloud. The company maintains its student records in a PostgreSQL database. The company needs a solution in which its data is available and online across multiple AWS Regions at all times. Which solution will meet these requirements with the LEAST amount of operational overhead?

**Các đáp án**:

- A. EC2 Cluster...
- B. RDS Multi-AZ (Single Region HA only).
- C. Amazon RDS for PostgreSQL DB instance. Create a read replica in another Region. (Read Replica can be promoted, but default is Async Read-only. "Available and online" for Write? Maybe Aurora Global Database is better but not in options).
- D. Snapshots copy (Slow DR).

**Đáp án đúng**: **C** (Trong ngữ cảnh các đáp án này).
Cross-Region Read Replica giúp data "online" (cho read) ở region 2. Nếu region 1 chết, promote region 2. Đây là giải pháp managed (Least overhead) tốt nhất được liệt kê.

---

## Câu 242

**Đề bài**:  A company hosts its web application on AWS using seven Amazon EC2 instances. The company requires that the IP addresses of all healthy EC2 instances be returned in response to DNS queries. Which policy should be used to meet this requirement?

**Các đáp án**:

- A. Simple routing...
- B. Latency...
- C. Multivalue routing policy
- D. Geolocation...

**Đáp án đúng**: **C**

**Giải thích chi tiết**:

- **C - ĐÚNG**: **Multivalue Answer Routing**. Cho phép trả về nhiều IP address cho 1 hostname (lên tới 8). Có hỗ trợ Health Check (chỉ trả về Healthy IP). Simple Routing cũng trả về nhiều IP nhưng KHÔNG hỗ trợ Health Check.

---

## Câu 243

**Đề bài**:  A medical research lab produces data that is related to a new study. The lab wants to make the data available with minimum latency to clinics across the country for their on-premises, file-based applications. The data files are stored in an Amazon S3 bucket that has read-only permissions for each clinic. What should a solutions architect recommend to meet these requirements?

**Các đáp án**:

- A. AWS Storage Gateway file gateway...
- B. DataSync...
- C. Volume Gateway...
- D. EFS...

**Đáp án đúng**: **A**

**Giải thích chi tiết**:

- **A - ĐÚNG**: **File Gateway (S3 File Gateway)**.
  - Deploy VM tại on-premise.
  - Map S3 Bucket thành NFS/SMB share (File-based Application access ok).
  - **Local Cache**: Cache những file hay dùng tại local disk của Gateway -> "Minimum latency".

---

## Câu 244

**Đề bài**:  A company is using a content management system that runs on a single Amazon EC2 instance. The EC2 instance contains both the web server and the database software. The company must make its website platform highly available and must enable the website to scale to meet user demand. What should a solutions architect recommend to meet these requirements?

**Các đáp án**:

- A. RDS... Manually launch... (Manual scaling -> Bad).
- B. Aurora... Manually launch... (Bad).
- C. Move the database to Amazon Aurora with a read replica in another Availability Zone. Create an Amazon Machine Image (AMI) from the EC2 instance. Configure an Application Load Balancer in two Availability Zones. Attach an Auto Scaling group that uses the AMI across two Availability Zones.
- D. Separate EC2 DB... (Tự quản lý DB trên EC2 < Aurora).

**Đáp án đúng**: **C**

**Giải thích chi tiết**:

- **C - ĐÚNG**: Tách DB ra **Aurora** (Managed, HA logic as Read Replica/Multi-AZ). Tạo **AMI** cho Web App. Dùng **ASG + ALB** Multi-AZ để auto scale web tier. Architecture chuẩn.

---

## Câu 245

**Đề bài**:  A company is launching an application on AWS. The application uses an Application Load Balancer (ALB) to direct traffic to at least two Amazon EC2 instances in a single target group. The instances are in an Auto Scaling group for each environment. The company requires a development environment and a production environment. The production environment will have periods of high traffic. Which solution will configure the development environment MOST cost-effectively?

**Các đáp án**:

- A. Reconfigure Target Group...
- B. ...
- C. ...
- D. Reduce the maximum number of EC2 instances in the development environment’s Auto Scaling group.

**Đáp án đúng**: **D** (Hoặc kết hợp giảm instance size).

**Giải thích chi tiết**:

- **D - ĐÚNG**: Ở môi trường Dev, traffic ít, không cần High Availability. Set Application Scaling **Min=1, Max=1** (hoặc thấp). Giảm số lượng instance là cách tiết kiệm tiền trực tiếp nhất.

---

## Câu 246

**Đề bài**:  A company runs a web application on Amazon EC2 instances in multiple Availability Zones. The EC2 instances are in private subnets. A solutions architect implements an internet-facing Application Load Balancer (ALB) and specifies the EC2 instances as the target group. However, the internet traffic is not reaching the EC2 instances. How should the solutions architect reconfigure the architecture to resolve this issue?

**Các đáp án**:

- A. NLB...
- B. Move EC2 to public... (Security risk).
- C. Update route tables... (Private subnet ko nên có route to IGW).
- D. Create public subnets in each Availability Zone. Associate the public subnets with the ALB. Update the route tables for the public subnets with a route to the private subnets.

**Đáp án đúng**: **D** (Về logic ALB placement).

**Giải thích chi tiết**:

- Vấn đề: **Internet-facing ALB** bắt buộc phải nằm trong **Public Subnet** (có route ra IGW). Nếu deploy ALB vào Private Subnet, Client từ internet không connect được.
- EC2 nằm Private là đúng.
- Giải pháp: Tạo Public Subnets, move ALB (Associate subnets) vào đó. Traffic flow: Internet -> IGW -> ALB (Public) -> EC2 (Private).

---

## Câu 247

**Đề bài**:  A company has deployed a database in Amazon RDS for MySQL. Due to increased transactions, the database support team is reporting slow reads against the DB instance and recommends adding a read replica. Which combination of actions should a solutions architect take before implementing this change? (Choose two.)

**Các đáp án**:

- A. Enable binlog replication... (RDS automates this via automated backups requirement).
- B. ...
- C. ...
- D. ...
- E. Enable automatic backups on the source instance by setting the backup retention period to a value other than 0.

**Đáp án đúng**: **E** (Và có thể cần transaction stop nếu manual, nhưng với RDS managed process thì E là điều kiện tiên quyết).

**Giải thích chi tiết**:

- **E - ĐÚNG**: Để tạo Read Replica, RDS cần **Automated Backups** phải được bật (Retention > 0). RDS dùng snapshot này để seed replica.
- **C** (Long running transactions) cũng ảnh hưởng thời gian tạo, nhưng E là **Pre-requisite configuration**.

---

## Câu 248

**Đề bài**:  A company runs analytics software on Amazon EC2 instances. The software accepts job requests from users to process data that has been uploaded to Amazon S3. Users report that some submitted data is not being processed Amazon CloudWatch reveals that the EC2 instances have a consistent CPU utilization at or near 100%. The company wants to improve system performance and scale the system based on user load. What should a solutions architect do to meet these requirements?

**Các đáp án**:

- A. Copy instance...
- B. ...
- C. Resize instance... (Stop/Start causes downtime, not auto scaling).
- D. Route incoming requests to Amazon Simple Queue Service (Amazon SQS). Configure an EC2 Auto Scaling group based on queue size. Update the software to read from the queue.

**Đáp án đúng**: **D**

**Giải thích chi tiết**:

- **D - ĐÚNG**: Kiến trúc **Decoupled SQS + ASG**.
  - Buffer requests vào SQS -> Không bị mất job ("data not processed").
  - ASG scale theo SQS Backlog (Queue Size) -> Giải quyết vấn đề CPU 100% bằng cách thêm worker khi việc nhiều.

---

## Câu 249

**Đề bài**:  A company is implementing a shared storage solution for a media application that is hosted in the AWS Cloud. The company needs the ability to use SMB clients to access data. The solution must be fully managed. Which AWS solution meets these requirements?

**Các đáp án**:

- A. Volume Gateway (Hybrid, not fully managed cloud native storage).
- B. Tape...
- C. EC2 Windows File Share (Self-managed).
- D. Create an Amazon FSx for Windows File Server file system...

**Đáp án đúng**: **D**

**Giải thích chi tiết**:

- **D - ĐÚNG**: **FSx for Windows File Server**.
  - Native Windows File System.
  - Hỗ trợ giao thức **SMB**.
  - **Fully Managed** service on AWS.

---

## Câu 250

**Đề bài**:  A company’s security team requests that network traffic be captured in VPC Flow Logs. The logs will be frequently accessed for 90 days and then accessed intermittently. What should a solutions architect do to meet these requirements when configuring the logs?

**Các đáp án**:

- A. CloudWatch Logs expire 90 days (Mất log sau 90 ngày -> Sai, đề bài cần giữ intermittently).
- B. Kinesis...
- C. CloudTrail...
- D. Use Amazon S3 as the target. Enable an S3 Lifecycle policy to transition the logs to S3 Standard-Infrequent Access (S3 Standard-IA) after 90 days.

**Đáp án đúng**: **D**

**Giải thích chi tiết**:

- **D - ĐÚNG**: Publish Flow Logs to **S3**.
  - Rẻ hơn CloudWatch Logs.
  - Lifecycle policy: Move to **Standard-IA** sau 90 ngày (phù hợp access intermittent).

---
