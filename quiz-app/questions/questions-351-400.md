# AWS Certification Exam Questions 351-400

Tài liệu được biên soạn chi tiết với giải thích bằng tiếng Việt, giúp bạn hiểu sâu về các dịch vụ AWS.

---

## Câu 351

**Đề bài**:  A company is moving its data management application to AWS. The company wants to transition to an event-driven architecture. The architecture needs to be more distributed and to use serverless concepts while performing the different aspects of the workflow. The company also wants to minimize operational overhead. Which solution will meet these requirements?

**Các đáp án**:

- A. Glue (ETL focus, not general app workflow).
- B. Step Functions + EC2 (EC2 is not serverless).
- C. EventBridge + Lambda (Good for event routing, but complex workflow coordination usually needs Step Functions).
- D. Build out the workflow in **AWS Step Functions**. Use Step Functions to create a state machine. Use the state machine to invoke **AWS Lambda** functions to process the workflow steps.

**Đáp án đúng**: **D**

**Giải thích chi tiết**:

- **D - ĐÚNG**: **Step Functions + Lambda**.
  - **Distributed/Event-driven Workflow**: Step Functions là orchestrator chuẩn cho serverless workflows.
  - **Serverless**: Step Functions và Lambda đều là Serverless.
  - **Minimize operational overhead**: Fully managed, không cần quản lý server.
  - So với C (EventBridge), Step Functions quản lý state machine (trạng thái, thứ tự, retry) tốt hơn cho một "data management workflow" phức tạp.

---

## Câu 352

**Đề bài**:  A company is designing the network for an online multi-player game. The game uses the UDP networking protocol and will be deployed in eight AWS Regions. The network architecture needs to minimize latency and packet loss to give end users a high-quality gaming experience. Which solution will meet these requirements?

**Các đáp án**:

- A. Transit Gateway (Inter-region peering is for VPC-to-VPC, not for end-user latency).
- B. Set up **AWS Global Accelerator** with UDP listeners and endpoint groups in each Region.
- C. CloudFront (CloudFront does not support UDP, only HTTP/HTTPS/TCP/WebSocket. Note: Recent updates allow some non-HTTP via Field Level but GA is standard for UDP gaming).
- D. VPC peering mesh (Operational nightmare, no latency optimization for public users).

**Đáp án đúng**: **B**

**Giải thích chi tiết**:

- **B - ĐÚNG**: **AWS Global Accelerator**.
  - **UDP Support**: GA support cả TCP và UDP.
  - **Gaming Use Case**: Rất phổ biến cho gaming để giảm lag/jitter. Routing traffic qua mạng AWS Global Network thay vì Public Internet.
  - **Multi-region**: Tự động route user đến Region gần nhất/tốt nhất.

---

## Câu 353

**Đề bài**:  A company hosts a three-tier web application on Amazon EC2 instances in a single Availability Zone. The web application uses a self-managed MySQL database that is hosted on an EC2 instance to store data in an Amazon Elastic Block Store (Amazon EBS) volume. The MySQL database currently uses a 1 TB Provisioned IOPS SSD (io2) EBS volume. The company expects traffic of 1,000 IOPS for both reads and writes at peak traffic. The company wants to minimize any disruptions, stabilize performance, and reduce costs while retaining the capacity for double the IOPS. The company wants to move the database tier to a fully managed solution that is highly available and fault tolerant. Which solution will meet these requirements MOST cost-effectively?

**Các đáp án**:

- A. RDS Multi-AZ ... **io2 Block Express**. (io2 is expensive, usually for > 64,000 IOPS or mission critical sub-millisecond latency. 1000-2000 IOPS is low).
- B. Use a **Multi-AZ deployment** of an Amazon RDS for MySQL DB instance with a **General Purpose SSD (gp2) EBS volume**. (Wait, gp2 gives 3 IOPS/GB. 1TB = 1024 GB. Base IOPS = 3 \* 1024 = 3072 IOPS. Burst to 3000. So baseline > 2000 IOPS mandated target).
- C. S3 Intelligent-Tiering (Not for DB).
- D. EC2 active-passive (Not fully managed).

**Giải thích**:

- Requirement: "Reduce costs" và "Retain capacity for double IOPS (2000 IOPS)".
- Hiện tại dùng **io2** (Provisioned IOPS) là rất đắt.
- 1TB **gp2** volume cung cấp baseline 3072 IOPS (miễn phí kèm dung lượng).
- 3072 IOPS > 2000 IOPS cần thiết.
- Vậy chuyển sang RDS Multi-AZ với gp2 (hoặc gp3) là giải pháp tiết kiệm nhất (Most Cost-Effective) mà vẫn đáp ứng performance.
- Đáp án A (io2) sẽ đắt hơn đáng kể.

**Đáp án đúng**: **B**

---

## Câu 354

**Đề bài**:  A company hosts a serverless application on AWS. The application uses Amazon API Gateway, AWS Lambda, and an Amazon RDS for PostgreSQL database. The company notices an increase in application errors that result from database connection timeouts during times of peak traffic or unpredictable traffic. The company needs a solution that reduces the application failures with the least amount of change to the code. What should a solutions architect do to meet these requirements?

**Các đáp án**:

- A. Reduce Lambda concurrency (Will drop requests, not solve DB bottleneck efficiently).
- B. **Enable RDS Proxy** on the RDS DB instance.
- C. Resize RDS (Costly, requires downtime potentially).
- D. Migrate to DynamoDB (Huge code change).

**Đáp án đúng**: **B**

**Giải thích chi tiết**:

- **B - ĐÚNG**: **RDS Proxy**.
  - Vấn đề kinh điển của Lambda + RDS: Lambda scale up quá nhanh tạo hàng nghìn connection làm quá tải DB.
  - RDS Proxy ngồi giữa, **connection pooling** (dùng chung connection) giúp giảm tải cho DB.
  - **Least code change**: Chỉ cần trỏ lại endpoint của app vào Proxy (không cần sửa logic xử lý connection phức tạp).

---

## Câu 355

**Đề bài**:  A company is migrating an old application to AWS. The application runs a batch job every hour and is CPU intensive. The batch job takes 15 minutes on average with an on-premises server. The server has 64 virtual CPU (vCPU) and 512 GiB of memory. Which solution will run the batch job within 15 minutes with the LEAST operational overhead?

**Các đáp án**:

- A. Lambda (Max runtime 15 mins, Max memory 10GB -> Not enough 512GB RAM/64 vCPU power for equivalent performance).
- B. **Amazon ECS with AWS Fargate**.
- C. Lightsail (Not for heavy batch).
- D. AWS Batch on Amazon EC2.

**Giải thích**:

- Job này cần resource LỚN (64 vCPU, 512GB RAM).
- **Fargate** (Option B) hiện tại (tính đến knowledge cutoff nhưng thực tế đã tăng) support max 16 vCPU, 120GB RAM (gần đây tăng lên nhưng có thể chưa bằng 64/512).
- **AWS Batch on EC2** (Option D) cho phép dùng các instance type khủng (ví dụ: m5.16xlarge, c5.18xlarge...) để match cấu hình on-prem.
- Tuy nhiên, câu hỏi thường update technology. Fargate đơn giản hơn (Least overhead) nhưng Resource Limit là vấn đề.
- Nếu job thực sự cần 64vCPU thì Fargate không chạy nổi (trừ khi chia nhỏ task, nhưng đề bài nói "The batch job" singular).
- Vậy **AWS Batch on EC2** là khả thi nhất về performance và vẫn là Managed Service (Batch quản lý queue/instance provisioning).
- Tuy nhiên, nhiều đề cũ coi **Fargate** là đáp án cho "Serverless Batch" với overhead thấp nhất NẾU workload fit. Nhưng 512GB RAM thì Fargate v4 (max 120GB) không đủ. Cần check lại limit Fargate mới nhất (16 vCPU / 120 GB RAM).
- Vì vậy **Option D** (AWS Batch on EC2) là an toàn nhất về technical feasibility.

**Đáp án đúng**: **D**

---

## Câu 356

**Đề bài**:  A company stores its data objects in Amazon S3 Standard storage. A solutions architect has found that 75% of the data is rarely accessed after 30 days. The company needs all the data to remain immediately accessible with the same high availability and resiliency, but the company wants to minimize storage costs. Which storage solution will meet these requirements?

**Các đáp án**:

- A. Glacier Deep Archive (Retrieval time 12h-48h -> Not immediate).
- B. **S3 Standard-Infrequent Access (S3 Standard-IA)** after 30 days.
- C. S3 One Zone-IA (Risky: data loss if AZ fails. Requirement: "same high availability and resiliency").
- D. ...

**Đáp án đúng**: **B**

**Giải thích chi tiết**:

- **B - ĐÚNG**: **S3 Standard-IA**.
  - Thiết kế cho dữ liệu ít truy cập nhưng cần truy cập ngay lập tức (milliseconds).
  - Rẻ hơn Standard (~50%).
  - Đảm bảo High Availability (Multi-AZ) giống Standard (One Zone IA rẻ hơn nữa nhưng hy sinh HA).

---

## Câu 357

**Đề bài**:  A gaming company is moving its public scoreboard from a data center to the AWS Cloud. The company uses Amazon EC2 Windows Server instances behind an Application Load Balancer to host its dynamic application. The company needs a highly available storage solution for the application. The application consists of static files and dynamic server-side code. Which combination of steps should a solutions architect take to meet these requirements? (Choose two.)

**Các đáp án**:

- A. **Store static files on Amazon S3. Use Amazon CloudFront**.
- B. ElastiCache (Caching, not storage for files).
- C. EFS (EFS is Linux native, Windows support limited/complex in passing exams usually favor FSx).
- D. **Store server-side code on Amazon FSx for Windows File Server**. Mount... on each EC2.
- E. EBS (Block storage cannot be shared Multi-AZ easily/concurrently in this context typically without Multi-Attach which is niche).

**Đáp án đúng**: **A, D**

**Giải thích chi tiết**:

- **A - ĐÚNG**: Web App best practice: Offload Static content (Images/CSS/JS) lên **S3 + CloudFront** -> Performance tốt, HA, giảm tải cho Server.
- **D - ĐÚNG**: Web App dynamic server-side code chạy trên Windows IIS thường cần Shared File System. **FSx for Windows** là giải pháp Shared Storage Native (SMB) cho Windows Instances, Highly Available (Multi-AZ supported).

---

## Câu 358

**Đề bài**:  A social media company runs its application on Amazon EC2 instances behind an Application Load Balancer (ALB). The ALB is the origin for an Amazon CloudFront distribution. The application has more than a billion images stored in an Amazon S3 bucket and processes thousands of images each second. The company wants to resize the images dynamically and serve appropriate formats to clients. Which solution will meet these requirements with the LEAST operational overhead?

**Các đáp án**:

- A. EC2 library (Manage servers, scaling hard).
- B. **CloudFront origin request policy...** (CloudFront itself cannot resize images. It can just pass headers).
- C. **Lambda@Edge** with external library... Associate with CloudFront behaviours.
- D. Response headers policy (Cannot resize).

**Đáp án đúng**: **C** (Thường là kết hợp **Option B và C** trong thực tế, nhưng C là core logic).
Tuy nhiên, có một pattern mới: **CloudFront Functions** hoặc Lambda@Edge.
Để resize image, ta cần compute power. CloudFront (Native) không làm được. Phải dùng Lambda@Edge (hoặc giải pháp Serverless Image Handler).
Option C miêu tả việc dùng **Lambda@Edge** để resize. Đây là giải pháp tiêu chuẩn "Serverless Image Handler/Resizing on the fly".
Option B nói "Use CloudFront origin request policy to automatically resize" -> Sai, Policy chỉ control những gì gửi về Origin (Headers/Cookies), ko thực hiện action resize.

**Đáp án đúng**: **C**

---

## Câu 359

**Đề bài**:  A hospital needs to store patient records in an Amazon S3 bucket. The hospital’s compliance team must ensure that all protected health information (PHI) is encrypted in transit and at rest. The compliance team must administer the encryption key for data at rest. Which solution will meet these requirements?

**Các đáp án**:

- A. Public SSL... SSE-KMS... (Public SSL certificate in ACM is for Load Balancer/CloudFront, S3 uses AWS wildcard cert generally. And Compliance team needs to manage the key).
- B. aws:SecureTransport... SSE-S3 (Managed by AWS, not Compliance team).
- C. Use the **aws:SecureTransport** condition on S3 bucket policies... Configure default encryption **SSE-KMS**. Assign the compliance team to manage the KMS keys.
- D. Macie (Scanning tool).

**Đáp án đúng**: **C**

**Giải thích chi tiết**:

- **C - ĐÚNG**:
  - **In transit**: Bucket Policy `aws:SecureTransport = false` -> Deny (Bắt buộc HTTPS).
  - **At rest**: Dùng **SSE-KMS** (Customer Managed Key).
  - **Key Control**: "Assign compliance team to manage" -> Vì là Customer Managed Key nên có thể phân quyền quản trị Key này cho IAM User/Role của team Compliance (Full control). SSE-S3 Key do AWS quản lý hoàn toàn.

---

## Câu 360

**Đề bài**:  A company uses Amazon API Gateway to run a private gateway with two REST APIs in the same VPC. The BuyStock RESTful web service calls the CheckFunds RESTful web service to ensure that enough funds are available before a stock can be purchased. The company has noticed in the VPC flow logs that the BuyStock RESTful web service calls the CheckFunds RESTful web service over the internet instead of through the VPC. A solutions architect must implement a solution so that the APIs communicate through the VPC. Which solution will meet these requirements with the FEWEST changes to the code?

**Các đáp án**:

- A. API Key (Auth only).
- B. **Interface Endpoint** (PrivateLink).
- C. Gateway Endpoint (S3/DynamoDB only).
- D. SQS (Architectural change).

**Đáp án đúng**: **B**

**Giải thích chi tiết**:

- **B - ĐÚNG**: **Interface Endpoint (VPC Endpoint for API Gateway)**.
  - Để gọi Private API Gateway (hoặc Public API Gateway nhưng muốn routing private) từ trong VPC mà không ra Internet, cần tạo Interface VPC Endpoint (`execute-api`).
  - Traffic sẽ đi qua PrivateLink nội bộ của AWS.

---

## Câu 361

**Đề bài**:  A company hosts a multiplayer gaming application on AWS. The company wants the application to read data with sub-millisecond latency and run one-time queries on historical data. Which solution will meet these requirements with the LEAST operational overhead?

**Các đáp án**:

- A. RDS (Latency millisecond, not sub-millisecond).
- B. S3 (Latency high).
- C. Use **Amazon DynamoDB with DAX**... Export to S3... Athena.
- D. Kinesis...

**Đáp án đúng**: **C**

**Giải thích chi tiết**:

- **C - ĐÚNG**:
  - **Sub-millisecond latency**: **DynamoDB Accelerator (DAX)** là In-memory cache cho DynamoDB, cung cấp response time microseconds.
  - **Historical Analytics**: Export to S3 (Feature: "Export to S3" native của DynamoDB) rồi dùng **Athena** query serverless -> Least overhead, tách biệt workload.

---

## Câu 362

**Đề bài**:  A company uses a payment processing system that requires messages for a particular payment ID to be received in the same order that they were sent. Otherwise, the payments might be processed incorrectly. Which actions should a solutions architect take to meet this requirement? (Choose two.)

**Các đáp án**:

- A. DynamoDB (Not a queue).
- B. Kinesis Data Streams (Ordered per shard key). Valid but stream focus.
- C. ElastiCache.
- D. SQS Standard (No ordering guarantee).
- E. **SQS FIFO queue**. Set the **message group** to use the payment ID.

**Đáp án đúng**: **E** (Chỉ chọn 1 đáp án đúng nhất về Queueing/Ordering pattern. Đề bài (Choose two) có thể là lỗi in của bank text, hoặc cần 2 actions để setup FIFO).
Thực tế Option E bao gồm 2 việc: Dùng FIFO Queue VÀ Set Message Group ID.
Nếu phải chọn 2 đáp án (A, B, C, D, E riêng biệt) thì câu này kỳ lạ.
Nhưng nếu xét giải pháp tốt nhất: **SQS FIFO** (E).
Kinesis (B) cũng order theo Partition Key (Payment ID).
Tuy nhiên SQS FIFO chuyên cho "Message processing" (Processing system), Kinesis chuyên "Data Streaming" (Real-time analytics). SQS FIFO dễ dùng hơn (ack từng message).
Ở đây có thể User hiểu nhầm đề "Choose two" hoặc ý là:

1. Use SQS FIFO.
2. Set Message Group ID. (Cả 2 đều nằm trong option E??).
   Nếu đề bài tách "Use SQS FIFO" và "Set Message Group ID" ra 2 câu:

- Option X: Use SQS FIFO.
- Option Y: Use Message Group ID = Payment ID.
  Trong list trên, **E** là đầy đủ nhất. **B** cũng đúng về technical.
  Nhưng thường SQS FIFO là đáp án standard cho "Ordered Payment Processing".

**Đáp án đúng**: **E** (Và có thể là 1 option khác liên quan FIFO nếu đề đầy đủ hơn, hoặc B nếu coi Stream là messaging). Tuy nhiên **SQS FIFO** là keyword mạnh nhất cho Ordered Message.

---

## Câu 363

**Đề bài**:  A company is building a game system that needs to send unique events to separate leaderboard, matchmaking, and authentication services concurrently. The company needs an AWS event-driven system that guarantees the order of the events. Which solution will meet these requirements?

**Các đáp án**:

- A. EventBridge (Rule matching, ordering not guaranteed strongly across targets).
- B. **SNS FIFO topics**.
- C. SNS Standard (No ordering).
- D. SQS FIFO queues (Point-to-point, not fanout "concurrently" to 3 services unless 3 queues).

**Giải thích**:

- Requirement: "Send to multiple services concurrently" -> **Fanout**.
- Requirement: "Guarantee order" -> **FIFO**.
- Solution: **SNS FIFO Topic** (Fanout + Ordering) subscribed bởi **SQS FIFO Queues** (tại mỗi service). Pattern SNS FIFO + SQS FIFO mới ra mắt hỗ trợ đúng usecase này.

**Đáp án đúng**: **B**

---

## Câu 364

**Đề bài**:  A hospital is designing a new application that gathers symptoms from patients. The hospital has decided to use Amazon Simple Queue Service (Amazon SQS) and Amazon Simple Notification Service (Amazon SNS) in the architecture. A solutions architect is reviewing the infrastructure design. Data must be encrypted at rest and in transit. Only authorized personnel of the hospital should be able to access the data. Which combination of steps should the solutions architect take to meet these requirements? (Choose two.)

**Các đáp án**:

- A. ...
- B. **Turn on server-side encryption on the SNS** components by using AWS KMS CMK... Apply key policy...
- C. ... (SNS topic policy condition tls).
- D. **Turn on server-side encryption on the SQS** components by using AWS KMS CMK... Apply key policy... Set condition in queue policy to allow only encrypted connections over TLS.
- E. IAM policy restrict key usage... (Key policy is better for "Strict trust boundary" on the Key itself).

**Đáp án đúng**: **B, D**

**Giải thích chi tiết**:

- **B - ĐÚNG**: Config cho SNS (Encryption CMK + Key Policy).
- **D - ĐÚNG**: Config cho SQS (Encryption CMK + Key Policy + Enforce TLS in Queue Policy).
- Combo B+D cover cả 2 services và requirements (Encryption At Rest via KMS CMK, Encryption In Transit via TLS Policy enforcement, Access Control via Key Policy).

---

## Câu 365

**Đề bài**:  A company runs a web application that is backed by Amazon RDS. A new database administrator caused data loss by accidentally editing information in a database table. To help recover from this type of incident, the company wants the ability to restore the database to its state from 5 minutes before any change within the last 30 days. Which feature should the solutions architect include in the design to meet this requirement?

**Các đáp án**:

- A. Read Replicas.
- B. Manual Snapshots (Not frequent enough for 5 mins precision).
- C. **Automated backups** (Point-In-Time Recovery).
- D. Multi-AZ.

**Đáp án đúng**: **C**

**Giải thích chi tiết**:

- **C - ĐÚNG**: **Automated Backups** enable tính năng **Point-In-Time Recovery (PITR)**. Cho phép restore DB về bất kỳ giây nào trong retention period (up to 35 days). Đây là giải pháp cho "Accidental data loss/corruption".

---

## Câu 366

**Đề bài**:  A company’s web application consists of an Amazon API Gateway API in front of an AWS Lambda function and an Amazon DynamoDB database. The Lambda function handles the business logic, and the DynamoDB table hosts the data. The application uses Amazon Cognito user pools to identify the individual users of the application. A solutions architect needs to update the application so that only users who have a subscription can access premium content. Which solution will meet this requirement with the LEAST operational overhead?

**Các đáp án**:

- A. API Caching (Performance).
- B. WAF (Security blocking, hard to manage subscription logic).
- C. Fine-grained IAM (DynamoDB level - too deep, app logic manages premium).
- D. Implement **API usage plans and API keys** to limit the access... (Usage plans thường dùng cho throttling/quota).
- **Correct approach in modern App**: Authentication/Authorization logic.
  Tuy nhiên, trong context API Gateway features:
  **Usage Plans & API Keys** thường được dùng để phân chia gói (Basic/Premium) và kiểm soát ai được gọi API nào. User Premium được cấp API Key của Usage Plan Premium.
  Nhưng đề bài dùng **Cognito User Pools**.
  Cách "Least Code/Overhead" với Cognito: **Cognito Groups** (Premium Users) và dùng `Cognito Authorizer` trên API Gateway kiểm tra Group claim.
  Nhưng trong các options:
- **D** là feature native của API Gateway để quản lý "Subscription tiers" (Usage Plans). Có thể bán API Key cho user trả tiền.

**Đáp án đúng**: **D** (Dựa trên context các options được đưa ra, D là gần nhất với concept "Management features regarding access/tiers" mà không phải code custom logic quá nhiều).

---

## Câu 367

**Đề bài**:  A company is using Amazon Route 53 latency-based routing to route requests to its UDP-based application for users around the world. The application is hosted on redundant servers in the company's on-premises data centers in the United States, Asia, and Europe. The company’s compliance requirements state that the application must be hosted on premises. The company wants to improve the performance and availability of the application. What should a solutions architect do to meet these requirements?

**Các đáp án**:

- A. NLB + Global Accelerator (Standard Accelerator).
- B. ALB (ALB does not support UDP).
- C. NLB + Route 53 + CloudFront (CloudFront does not support UDP origin protocol broadly for general apps - mainly HTTP/HTTPS).
- D. ...

**Đáp án đúng**: **A**

**Giải thích chi tiết**:

- **A - ĐÚNG**: **AWS Global Accelerator**.
  - Đặc trị cho non-HTTP protocols (UDP/TCP gaming, IoT...).
  - **Performance**: Dùng AWS Network backbone giảm latency, jitter.
  - **Availability**: Fast failover (10-30s) so với DNS caching của Route 53 (TTL issues).
  - Cấu hình: **Custom Routing Accelerator** hoặc Standard, trỏ về **NLB** (support UDP) hoặc Elastic IP ở các region (hoặc endpoint on-prem nếu qua VPN/DX? GA support EC2/ALB/NLB/EIP endpoints). Ở đây GA trỏ về NLB (proxy về on-prem) là hợp lý.

---

## Câu 368

**Đề bài**:  A solutions architect wants all new users to have specific complexity requirements and mandatory rotation periods for IAM user passwords. What should the solutions architect do to accomplish this?

**Các đáp án**:

- A. **Set an overall password policy for the entire AWS account**.
- B. Each user (Manual, not automated).
- C. 3rd party...
- D. CloudWatch rule...

**Đáp án đúng**: **A**

**Giải thích chi tiết**:

- **A - ĐÚNG**: **IAM Password Policy** là setting global cho Account (IAM -> Account Settings). Áp dụng cho mọi IAM Users (new & old). Simple & Correct.

---

## Câu 369

**Đề bài**:  A company has migrated an application to Amazon EC2 Linux instances. One of these EC2 instances runs several 1-hour tasks on a schedule. These tasks were written by different teams and have no common programming language. The company is concerned about performance and scalability while these tasks run on a single instance. A solutions architect needs to implement a solution to resolve these concerns. Which solution will meet these requirements with the LEAST operational overhead?

**Các đáp án**:

- A. **Use AWS Batch** to run the tasks as jobs. Schedule...
- B. App Runner (Web App focus).
- C. Lambda (Max 15 mins. Task is 1-hour -> Fails).
- D. ASG (Heavy management).

**Đáp án đúng**: **A**

**Giải thích chi tiết**:

- **A - ĐÚNG**: **AWS Batch**.
  - Phù hợp với "Batch jobs" (Scheduled tasks).
  - Support **Docker Containers**: Giải quyết vấn đề "Different teams/languages" (mỗi team đóng gói container riêng).
  - Managed env, tự scale EC2 theo nhu cầu Job -> Solve Scalability & Performance.

---

## Câu 370

**Đề bài**:  A company runs a public three-tier web application in a VPC. The application runs on Amazon EC2 instances across multiple Availability Zones. The EC2 instances that run in private subnets need to communicate with a license server over the internet. The company needs a managed solution that minimizes operational maintenance. Which solution meets these requirements?

**Các đáp án**:

- A. NAT Instance (Self-managed -> High maintenance).
- B. NAT Instance...
- C. **Provision a NAT gateway in a public subnet**. Modify private route table default route to NAT Gateway.
- D. NAT gateway in private subnet (Won't work, NAT GW needs Public IP/Public Subnet to route out).

**Đáp án đúng**: **C**

**Giải thích chi tiết**:

- **C - ĐÚNG**: **NAT Gateway**.
  - Managed service (Low maintenance).
  - Phải đặt ở **Public Subnet**.
  - Route Table của Private Subnet trỏ `0.0.0.0/0` -> NAT Gateway ID.

---

## Câu 371

**Đề bài**:  A company needs to create an Amazon Elastic Kubernetes Service (Amazon EKS) cluster to host a digital media streaming application. The EKS cluster will use a managed node group that is backed by Amazon Elastic Block Store (Amazon EBS) volumes for storage. The company must encrypt all data at rest by using a customer managed key that is stored in AWS Key Management Service (AWS KMS). Which combination of actions will meet this requirement with the LEAST operational overhead? (Choose two.)

**Các đáp án**:

- A. K8s plugin...
- B. After creation... (Too late, encrypt existing vol is hard).
- C. **Enable EBS encryption by default** in the AWS Region... Select CMK.
- D. ...
- E. **Store the customer managed key as a Kubernetes secret**? (No, EBS encryption happens at Infrastructure layer, not inside K8s secrets).

**Re-reading options**:
Encryption of EBS volumes for EKS Nodes (Launch Template/Auto Scaling).
Option C: "Enable EBS encryption by default" (Account-level setting). Setting này rất mạnh: Mọi EBS volume mới tạo trong Region sẽ tự động encrypt bằng Key chỉ định. -> Rất "Least overhead". EKS khi tạo node (qua ASG) sẽ tự động tạo encrypted volume.
Option nào nữa?
Thông thường để EKS Node dùng được CMK, Instance role cần quyền Decrypt/CreateGrant cái key đó.
Option D: Create IAM Role grant permission to CMK. Associate with EKS Cluster (Cluster Role or Node Role?). Node Role cần quyền này.
Tuy nhiên, Option C rất powerful.
Nếu chỉ chọn 1 combo?
Thực tế, cách đơn giản nhất để Encrypt EKS Nodes volumes là qua Launch Template hoặc enable Default Encryption (C).
Nhưng K8s Secrets Encryption (Envelope encryption) là một feature khác. Đề bài chỉ nói "Encrypt all data at rest" của "EBS volumes".
Vậy **C** là bước chính.
Cần thêm bước nào?
Nếu enable default encryption (C), ta không cần làm gì thêm ở Cluster config (trừ việc IAM Role của Node cần quyền dùng Key - Option D đề cập "Associate role with EKS Cluster" -> Cluster Role hay Node Role? Thường là Node Role (Instance Profile)).
Tuy nhiên, nếu không chọn D, thì EKS Cluster có thể failed to launch node group nếu Service Linked Role của Auto Scaling không được quyền dùng Key?
Option A (CSI plugin) phức tạp.
Option B (Manual) cực.
Vậy **C** chắc chắn đúng.
Option còn lại hợp lý nhất là **D** (cấp quyền).

**Đáp án đúng**: **C, D** (Giải thiết D ám chỉ cấp quyền cần thiết cho EKS/Node/ASG dùng Key).

---

## Câu 372

**Đề bài**:  A company wants to migrate an Oracle database to AWS. The database consists of a single table that contains millions of geographic information systems (GIS) images that are high resolution and are identified by a geographic code. When a natural disaster occurs, tens of thousands of images get updated every few minutes. Each geographic code has a single image or row that is associated with it. The company wants a solution that is highly available and scalable during such events. Which solution meets these requirements MOST cost-effectively?

**Các đáp án**:

- A. RDS Oracle Multi-AZ (Expensive, Scaling write for "tens of thousands updates/min" on Oracle might be bottleneck or costly).
- B. **Store images in Amazon S3**. **DynamoDB** for metadata (GeoCode -> S3 URL).
- C. DynamoDB (Store images binary in DynamoDB is bad practice/expensive).
- D. S3 + RDS Oracle. (Oracle license + RDS cost > DynamoDB for this simple Key-Value use case).

**Đáp án đúng**: **B**

**Giải thích chi tiết**:

- **B - ĐÚNG**: **S3 + DynamoDB**.
  - **S3**: Lưu high resolution images (Object storage rẻ, durable, scalable).
  - **DynamoDB**: Lưu metadata (GeoCode là Partition Key -> S3 URL). Xử lý hàng chục nghìn update/phút cực tốt (Scalable).
  - Cost-effective hơn nhiều so với chạy Oracle instance lớn để chịu tải write cao.

---

## Câu 373

**Đề bài**:  A company has an application that collects data from IoT sensors on automobiles. The data is streamed and stored in Amazon S3 through Amazon Kinesis Data Firehose. The data produces trillions of S3 objects each year. Each morning, the company uses the data from the previous 30 days to retrain a suite of machine learning (ML) models. Four times each year, the company uses the data from the previous 12 months to perform analysis and train other ML models. The data must be available with minimal delay for up to 1 year. After 1 year, the data must be retained for archival purposes. Which storage solution meets these requirements MOST cost-effectively?

**Các đáp án**:

- A. Intelligent-Tiering to Deep Archive (High monitoring cost for trillions of small objects? Need check object size. But "S3 Intelligent-Tiering" is safe choice).
- B. ...
- C. Standard-IA to Deep Archive (Data accessed daily for 30 days -> IA retrieval fee will kill cost).
- D. **S3 Standard** (First 30 days heavy access) -> **Standard-IA** (After 30 days, accessed quarterly) -> **Glacier Deep Archive** (After 1 year).

**Phân tích**:

- Access patterns:
  - 0-30 days: Daily access heavy (Retrain). -> **Standard**.
  - 30 days - 1 year: Quarterly access (4 times/year). -> Infrequent enough? -> **Standard-IA**.
  - > 1 year: Archive. -> **Deep Archive**.
- **Option D**: Lifecycle: Standard -> IA (after 30 days) -> Deep Archive (after 1 year). Logic này perfect.
- Intelligent-Tiering (A/B) cũng tốt nhưng với "trillions objects", monitoring fee ($0.0025/1000 objects) có thể rất đắt nếu object nhỏ. Đề bài IoT data thường nhỏ? Và pattern đã rõ ràng (rõ 30 ngày cut-off), dùng Lifecycle cố định (Standard -> IA) thường tối ưu hơn IT.

**Đáp án đúng**: **D**

---

## Câu 374

**Đề bài**:  A company is running several business applications in three separate VPCs within the us-east-1 Region. The applications must be able to communicate between VPCs. The applications also must be able to consistently send hundreds of gigabytes of data each day to a latencysensitive application that runs in a single on-premises data center. A solutions architect needs to design a network connectivity solution that maximizes cost-effectiveness. Which solution meets these requirements?

**Các đáp án**:

- A. 3 VPNs (Internet unpredictable latency).
- B. VPN appliance...
- C. 3 Direct Connect connections (Too expensive).
- D. **One Direct Connect connection** + **Transit Gateway**. Attach VPCs to TGW.

**Đáp án đúng**: **D**

**Giải thích chi tiết**:

- **D - ĐÚNG**: **Direct Connect + Transit Gateway**.
  - **Direct Connect (DX)**: Đáp ứng "Latency sensitive" và "High throughput" (100s GB).
  - **Transit Gateway**: Cho phép share 1 DX connection cho nhiều VPC (3 VPCs).
  - Đây là architecture chuẩn (Hub-and-spoke) tiết kiệm hơn là kéo 3 đường dây riêng (Option C) hay dùng VPN internet (Option A).

---

## Câu 375

**Đề bài**:  An ecommerce company is building a distributed application that involves several serverless functions and AWS services to complete orderprocessing tasks. These tasks require manual approvals as part of the workflow. A solutions architect needs to design an architecture for the order-processing application. The solution must be able to combine multiple AWS Lambda functions into responsive serverless applications. The solution also must orchestrate data and services that run on Amazon EC2 instances, containers, or on-premises servers. Which solution will meet these requirements with the LEAST operational overhead?

**Các đáp án**:

- A. **Use AWS Step Functions**.
- B. Glue...
- C. SQS...
- D. EventBridge...

**Đáp án đúng**: **A**

**Giải thích chi tiết**:

- **A - ĐÚNG**: **Step Functions**.
  - Support **Standard Workflows** với tính năng **Manual Approval** (Callback pattern: wait for human approval token).
  - Orchestrator mạnh mẽ: Integrate Lambda, EC2 (via Systems Manager), Containers (ECS), On-prem (via Activity Workers).
  - Least operational overhead (Visual workflow, managed state).

---

## Câu 376

**Đề bài**:  A company has launched an Amazon RDS for MySQL DB instance. Most of the connections to the database come from serverless applications. Application traffic to the database changes significantly at random intervals. At times of high demand, users report that their applications experience database connection rejection errors. Which solution will resolve this issue with the LEAST operational overhead?

**Các đáp án**:

- A. **Create a proxy in RDS Proxy**.
- B. ElastiCache (Caching helps reads, but connection pooling is direct fix for connection storm).
- C. Migrate instance class (Vertical scaling - costly, downtime).
- D. Multi-AZ (HA feature, not connection capacity feature).

**Đáp án đúng**: **A**

**Giải thích chi tiết**:

- **A - ĐÚNG**: **RDS Proxy**.
  - Giải quyết vấn đề "Connection Storm" và "Connection Exhaustion" (Rejection errors) bằng cách multiplexing connections.
  - Managed service, dễ deploy.

---

## Câu 377

**Đề bài**:  A company recently deployed a new auditing system to centralize information about operating system versions, patching, and installed software for Amazon EC2 instances. A solutions architect must ensure all instances provisioned through EC2 Auto Scaling groups successfully send reports to the auditing system as soon as they are launched and terminated. Which solution achieves these goals MOST efficiently?

**Các đáp án**:

- A. Scheduled Lambda (Scanning - latency, might miss short lived instances).
- B. **Use EC2 Auto Scaling lifecycle hooks** to run a custom script...
- C. User Data (Only runs on Launch, not Terminate).
- D. Custom script OS shutdown script (Unreliable on termination especially forced ones).

**Đáp án đúng**: **B**

**Giải thích chi tiết**:

- **B - ĐÚNG**: **Lifecycle Hooks**.
  - Hỗ trợ cả **InstanceLaunching** và **InstanceTerminating** events.
  - Pause instance, chạy script (gửi report), rồi mới cho proceed (Launch/Terminate). Đảm bảo 100% capture được event.

---

## Câu 378

**Đề bài**:  A company is developing a real-time multiplayer game that uses UDP for communications between the client and servers in an Auto Scaling group. Spikes in demand are anticipated during the day, so the game server platform must adapt accordingly. Developers want to store gamer scores and other non-relational data in a database solution that will scale without intervention. Which solution should a solutions architect recommend?

**Các đáp án**:

- A. Route 53 (UDP ok) + Aurora Serverless (Relational).
- B. **NLB** (UDP support) + **DynamoDB On-Demand** (Non-relational, Scale without intervention).
- C. NLB + Aurora Global (Relational).
- D. ALB (No UDP) + DynamoDB Global.

**Đáp án đúng**: **B**

**Giải thích chi tiết**:

- **B - ĐÚNG**:
  - **Traffic Distribution**: **NLB** support UDP (Gaming).
  - **Database**: **DynamoDB On-Demand** đáp ứng "Non-relational data", "Spikes" và "Scale without intervention" (serverless scaling).

---

## Câu 379

**Đề bài**:  A company hosts a frontend application that uses an Amazon API Gateway API backend that is integrated with AWS Lambda. When the API receives requests, the Lambda function loads many libraries. Then the Lambda function connects to an Amazon RDS database, processes the data, and returns the data to the frontend application. The company wants to ensure that response latency is as low as possible for all its users with the fewest number of changes to the company's operations. Which solution will meet these requirements?

**Các đáp án**:

- A. Bypass API (Architecture change).
- B. **Configure provisioned concurrency** for the Lambda function.
- C. Cache S3...
- D. Increase DB size...

**Đáp án đúng**: **B**

**Giải thích chi tiết**:

- **B - ĐÚNG**: **Provisioned Concurrency**.
  - Giữ Lambda functions ở trạng thái "Initialized" (Warm), sẵn sàng xử lý request ngay lập tức -> Loại bỏ Cold Start latency (Load libraries).
  - Đáp ứng "Low latency" requirement.

---

## Câu 380

**Đề bài**:  A company is migrating its on-premises workload to the AWS Cloud. The company already uses several Amazon EC2 instances and Amazon RDS DB instances. The company wants a solution that automatically starts and stops the EC2 instances and DB instances outside of business hours. The solution must minimize cost and infrastructure maintenance. Which solution will meet these requirements?

**Các đáp án**:

- A. Elastic resize (Still running).
- B. **AWS Marketplace** partner solutions... (Usually paid/complex).
- C. Crontab script (Manage server).
- D. **Lambda + EventBridge**.

**Đáp án đúng**: **D** (Hoặc dùng AWS Instance Scheduler - Solution based on Lambda/DynamoDB).
Trong các option Basic, **D** là cách serverless standard nhất (Schedule Event -> Trigger Lambda call API Start/Stop).
Tuy nhiên, có một solution tên là "AWS Instance Scheduler" thường được nhắc tới. Nếu không có, option D tự build Lambda đơn giản hơn manage 1 EC2 chạy Cron (C).

**Đáp án đúng**: **D**

---

## Câu 381

**Đề bài**:  A company hosts a three-tier web application that includes a PostgreSQL database. The database stores the metadata from documents. The company searches the metadata for key terms to retrieve documents that the company reviews in a report each month. The documents are stored in Amazon S3. The documents are usually written only once, but they are updated frequently. The reporting process takes a few hours with the use of relational queries. The reporting process must not prevent any document modifications or the addition of new documents. A solutions architect needs to implement a solution to speed up the reporting process. Which solution will meet these requirements with the LEAST amount of change to the application code?

**Các đáp án**:

- A. DocumentDB (Non-relational, code change massive).
- B. Migrate to Aurora...
- C. **Read Replica** for RDS PostgreSQL. Configure reporting module to query secondary...
- D. DynamoDB...

**Giải thích**:

- App đang dùng "RDS for PostgreSQL".
- Migrate sang Aurora (B) là đổi platform (nhỏ), code change ít.
- Tạo **Read Replica** cho RDS (C) là feature có sẵn, code change chỉ là đổi connection string của Reporting Module. Effort ít hơn migration data sang Aurora cluster (dù Aurora có tool import snapshot).
- Quan trọng: Đề bài nói "Reporting process must not prevent modifications". Chạy report trên Read Replica tách biệt tải khỏi Primary -> Write (Modifications) không bị ảnh hưởng.
- Option C trực tiếp giải quyết vấn đề trên nền tảng hiện tại.

**Đáp án đúng**: **C** (hoặc B cũng valid nhưng C direct operation hơn trên RDS đang chạy).

---

## Câu 382

**Đề bài**:  A company has a three-tier application on AWS that ingests sensor data from its users’ devices. The traffic flows through a Network Load Balancer (NLB), then to Amazon EC2 instances for the web tier, and finally to EC2 instances for the application tier. The application tier makes calls to a database. What should a solutions architect do to improve the security of the data in transit?

**Các đáp án**:

- A. **Configure a TLS listener. Deploy the server certificate on the NLB**.
- B. Shield (DDoS).
- C. Move to ALB (Valid option for Layer 7, but NLB TLS is also valid).
- D. Encrypt EBS (At Rest).

**Giải thích**:

- NLB support **TLS Termination** (TLS Listener). Client -> NLB (Encrypted).
- Đây là cách standard để secure data in transit cho NLB.

**Đáp án đúng**: **A**

---

## Câu 383

**Đề bài**:  A company is planning to migrate a commercial off-the-shelf application from its on-premises data center to AWS. The software has a software licensing model using sockets and cores with predictable capacity and uptime requirements. The company wants to use its existing licenses, which were purchased earlier this year. Which Amazon EC2 pricing option is the MOST cost-effective?

**Các đáp án**:

- A. **Dedicated Reserved Hosts**.
- B. Dedicated On-Demand Hosts.
- C. Dedicated Reserved Instances (Dedicated Instance is different from Dedicated Host. Host cho phép visibility vào Socket/Core - cần cho BYOL license).
- D. ...

**Giải thích**:

- "Existing licenses with Sockets/Cores visibility" -> Bắt buộc dùng **Dedicated Hosts**.
- "Predictable capacity" -> Dùng **Reserved** (tiết kiệm hơn On-Demand).
- Kết luận: **Dedicated Reserved Hosts**.

**Đáp án đúng**: **A**

---

## Câu 384

**Đề bài**:  A company runs an application on Amazon EC2 Linux instances across multiple Availability Zones. The application needs a storage layer that is highly available and Portable Operating System Interface (POSIX)-compliant. The storage layer must provide maximum data durability and must be shareable across the EC2 instances. The data in the storage layer will be accessed frequently for the first 30 days and will be accessed infrequently after that time. Which solution will meet these requirements MOST cost-effectively?

**Các đáp án**:

- A. S3 (Not POSIX compliant shared file system mountable easily as native Linux FS).
- B. ...
- C. **Amazon EFS Standard**. Lifecycle move to **EFS Standard-IA**.
- D. EFS One Zone (Risk durability compared to Standard Multi-AZ? Đề bài đòi "Maximum data durability"). EFS Standard durable hơn One Zone (vì replicate 3 AZs).

**Đáp án đúng**: **C**

**Giải thích chi tiết**:

- **C - ĐÚNG**: **EFS**.
  - **POSIX-compliant shared storage**: EFS là giải pháp chuẩn cho Linux EC2.
  - **Lifecycle Management**: Tự động chuyển file ít dùng (sau 30 ngày) sang class **IA (Infrequent Access)** rẻ hơn (tiết kiệm tới 92%).
  - **Maximum Durability**: EFS Standard (Multi-AZ) durable hơn One Zone.

---

## Câu 385

**Đề bài**:  A solutions architect is creating a new VPC design. There are two public subnets for the load balancer, two private subnets for web servers, and two private subnets for MySQL. The web servers use only HTTPS. The solutions architect has already created a security group for the load balancer allowing port 443 from 0.0.0.0/0. Company policy requires that each resource has the least access required to still be able to perform its tasks. Which additional configuration strategy should the solutions architect use to meet these requirements?

**Các đáp án**:

- A. Web SG Allow 0.0.0.0/0 (Too open).
- B. NACL (Stateless, complex management).
- C. **Web SG allow 443 from Load Balancer SG**. **MySQL SG allow 3306 from Web Server SG**.
- D. NACL...

**Đáp án đúng**: **C**

**Giải thích chi tiết**:

- **C - ĐÚNG**: **Security Group Chaining**.
  - Web Server chỉ nhận traffic từ Load Balancer (Source: LB Security Group ID).
  - Database chỉ nhận traffic từ Web Server (Source: Web SG ID).
  - Đây là mô hình security chuẩn (Service-to-Service reference).

---

## Câu 386

**Đề bài**:  An ecommerce company is running a multi-tier application on AWS. The front-end and backend tiers both run on Amazon EC2, and the database runs on Amazon RDS for MySQL. The backend tier communicates with the RDS instance. There are frequent calls to return identical datasets from the database that are causing performance slowdowns. Which action should be taken to improve the performance of the backend?

**Các đáp án**:

- A. SNS...
- B. **Implement Amazon ElastiCache to cache the large datasets**.
- C. Read Replica (Helps reads, but "Identical datasets" -> Cache is better fit/faster).
- D. Kinesis...

**Đáp án đúng**: **B**

**Giải thích chi tiết**:

- **B - ĐÚNG**: **ElastiCache**.
  - Keyword: "Identical datasets" (Dữ liệu giống hệt nhau được query nhiều lần).
  - Caching là giải pháp tối ưu nhất: Lưu kết quả query vào RAM (Redis/Memcached). Backend trả về ngay lập tức không cần hit DB -> Giảm tải DB, tăng tốc Backend incredible.

---

## Câu 387

**Đề bài**:  A new employee has joined a company as a deployment engineer. The deployment engineer will be using AWS CloudFormation templates to create multiple AWS resources. A solutions architect wants the deployment engineer to perform job activities while following the principle of least privilege. Which combination of actions should the solutions architect take to accomplish this goal? (Choose two.)

**Các đáp án**:

- A. Root (Never).
- B. PowerUsers (Too permissive).
- C. AdministratorAccess (Too permissive).
- D. ... IAM Policy allow CloudFormation actions only (Cannot create resources defined in template).
- E. **Create an IAM role** for the deployment engineer to explicitly define the permissions **specific to the AWS CloudFormation stack** and launch stacks using that IAM role. (Service Role).
- AND?
  Logic: User cần quyền chạy CloudFormation (`cloudformation:*`) VÀ quyền `PassRole`. Role service kia (Option E) sẽ nắm quyền tạo resource (S3, EC2...).
  Engineer assume role? Or Engineer use Service Role?
  Option D hạn chế User chỉ chạy CFN. Option E tạo Service Role có quyền tạo Resources. User pass role E cho CFN khi create stack.
  Kết hợp D + E?
  Tuy nhiên đề bài hỏi "Combination of actions".
  Nhiều đề án chọn B/C vì deploy engineer cần quyền rộng. Nhưng "Least Privilege" -> Service Role concept.
  Cách làm chuẩn:

1. Tạo IAM Role (Service Role) có quyền tạo resources (EC2, S3...). (E)
2. Tạo IAM User cho Engineer có quyền `cloudformation:*` và `iam:PassRole` (để pass role E).
   Option B "PowerUsers" là gần đúng nhưng hơi rộng.
   Tuy nhiên option E mô tả đúng "IAM permissions specific to the CFN stack".
   Chúng ta cần cấp quyền cho Engineer User.
   Cho Engineer User quyền gì?
   Nếu chọn D (chỉ CFN rights), Engineer không thể tạo resource NẾU không dùng Service Role.
   Vậy **Option D + Option E** (Engineer dùng Role chuyên dụng). User (D) invoke CFN và assign Role (E) để thực thi.
   Có thể logic đề là Engineer (User) tự dùng Role? Cần đọc kỹ.
   Action: "Create IAM Role... specific permissions... launch stacks using that IAM role". -> Ý là dùng Service Role.
   Action 2: User phải được tạo và cấp quyền CloudFormation.
   Nếu phải chọn từ list này.
   Mình nghiêng về phương án dùng **Service Role (E)** kết hợp với User quyền hạn hẹp (gần giống D nhưng phải có PassRole).

**Đáp án đúng**: **D, E** (_Note_: User cần quyền PassRole, giả sử D implies sufficient permission to operate CFN with Role).

---

## Câu 388

**Đề bài**:  A company is deploying a two-tier web application in a VPC. The web tier is using an Amazon EC2 Auto Scaling group with public subnets that span multiple Availability Zones. The database tier consists of an Amazon RDS for MySQL DB instance in separate private subnets. The web tier requires access to the database to retrieve product information. The web application is not working as intended. The web application reports that it cannot connect to the database. The database is confirmed to be up and running. All configurations for the network ACLs, security groups, and route tables are still in their default states. What should a solutions architect recommend to fix the application?

**Các đáp án**:

- A. NACL (Default allows all).
- B. Route Table (VPC Local route always exists).
- C. Peering (Same VPC).
- D. **Add an inbound rule to the security group of the database tier’s RDS instance to allow traffic from the web tiers security group**.

**Đáp án đúng**: **D**

**Giải thích chi tiết**:

- **D - ĐÚNG**: Default Security Group không allow inbound traffic từ sources khác (trừ chính nó).
  - Cần explicit rule: Allow port 3306 on RDS SG from Source = Web SG.

---

## Câu 389

**Đề bài**:  A company has a large dataset for its online advertising business stored in an Amazon RDS for MySQL DB instance in a single Availability Zone. The company wants business reporting queries to run without impacting the write operations to the production DB instance. Which solution meets these requirements?

**Các đáp án**:

- A. **Deploy RDS read replicas**...
- B. ELB (Cannot LB a single DB instance effectively for R/W split natively without Proxy/Middleware).
- C. Scale up (Vertical - expensive, limit hit eventually).
- D. Multi-AZ (Sync replication - standby cannot be read).

**Đáp án đúng**: **A**

**Giải thích chi tiết**:

- **A - ĐÚNG**: **Read Replica**.
  - Route reporting queries vào Read Replica.
  - Master DB chỉ lo Write traffc.
  - Giải quyết vấn đề performance impact.

---

## Câu 390

**Đề bài**:  A company hosts a three-tier ecommerce application on a fleet of Amazon EC2 instances. The instances run in an Auto Scaling group behind an Application Load Balancer (ALB). All ecommerce data is stored in an Amazon RDS for MariaDB Multi-AZ DB instance. The company wants to optimize customer session management during transactions. The application must store session data durably. Which solutions will meet these requirements? (Choose two.)

**Các đáp án**:

- A. Sticky sessions (Store on client/local instance -> Not durable if instance terminates).
- B. **DynamoDB table**. (High speed, Durable, Serverless).
- C. Cognito... (Auth management, not generic session store).
- D. **ElastiCache for Redis**. (In-memory, fast, can be persistent enough/durable for sessions. Industry standard).
- E. Systems Manager...

**Phân tích**:

- Cả DynamoDB và ElastiCache (Redis) đều là nơi lưu Session data phổ biến.
- **DynamoDB**: Durable by default (Disk).
- **ElastiCache Redis**: Fast, support replication/AOF persistence.
- Đề bài chọn 2 solutions?
  Thường câu hỏi dạng này chọn 1 trong 2. Nhưng nếu bắt chọn 2 thì B và D đều Valid for "Session Store".
  Tuy nhiên, có thể ý đề bài là: "Optimize management" -> A (Sticky) + B/D? Không, sticky không durable.
  Nếu phải chọn 2 giải pháp "Store session data durably": **B (DynamoDB)** và **D (ElastiCache Redis)**.
  (Systems Manager Session Manager không phải user session store).
  Cognito manage User Identity (Token), không hẳn là "arbitrary customer session data" (cart info...).
  Vậy B và D.

**Đáp án đúng**: **B, D**

---

## Câu 391

**Đề bài**:  A company needs a backup strategy for its three-tier stateless web application. The web application runs on Amazon EC2 instances in an Auto Scaling group with a dynamic scaling policy that is configured to respond to scaling events. The database tier runs on Amazon RDS for PostgreSQL. The web application does not require temporary local storage on the EC2 instances. The company’s recovery point objective (RPO) is 2 hours. The backup strategy must maximize scalability and optimize resource utilization for this environment. Which solution will meet these requirements?

**Các đáp án**:

- A. EBS Snapshot EC2 + Database (Stateless app -> No need to snapshot EC2 constantly, just allow ASG to launch from AMI. Database needs snapshot).
- B. Snapshot Policy EBS. Enable RDS Automated Backups (Good).
- C. **Retain latest AMIs** (Web/App). **Enable RDS automated backups** + PITR.
- D. ...

**Giải thích**:

- App là **Stateless** và dùng **Auto Scaling** -> Không cần backup EC2 instances đang chạy (lãng phí resource). Chỉ cần giữ **AMI** (Golden Image) để ASG launch mới khi cần.
- Database chứa state -> Cần **Automated Backups** (cho phép PITR < RPO 2 hours).
- Option C tối ưu nhất: "Retain latest AMIs" (cho ASG) và "RDS Automated Backups".

**Đáp án đúng**: **C**

---

## Câu 392

**Đề bài**:  A company wants to deploy a new public web application on AWS. The application includes a web server tier that uses Amazon EC2 instances. The application also includes a database tier that uses an Amazon RDS for MySQL DB instance. The application must be secure and accessible for global customers that have dynamic IP addresses. How should a solutions architect configure the security groups to meet these requirements?

**Các đáp án**:

- A. **Web SG Allow 443 0.0.0.0/0**. **DB SG Allow 3306 from Web SG**.
- B. ... Allow from customer IPs (Dynamic IPs -> Impossible to whitelist).
- C. ...
- D. ... DB allow 0.0.0.0/0 (Security risk).

**Đáp án đúng**: **A**

**Giải thích chi tiết**:

- **A - ĐÚNG**:
  - Web Server cần public access -> Allow `0.0.0.0/0` (The World).
  - Database Server cần private restricted access -> Chỉ allow traffic từ `Web Server Security Group`.
  - Đây là mô hình chuẩn.

---

## Câu 393

**Đề bài**:  A payment processing company records all voice communication with its customers and stores the audio files in an Amazon S3 bucket. The company needs to capture the text from the audio files. The company must remove from the text any personally identifiable information (PII) that belongs to customers. What should a solutions architect do to meet these requirements?

**Các đáp án**:

- A. Kinesis Video + Lambda (Complex).
- B. Lambda -> Textract (Textract is for Documents/OCR/PDF, not Audio).
- C. **Amazon Transcribe** transcription job with **PII redaction** turned on.
- D. Amazon Connect...

**Đáp án đúng**: **C**

**Giải thích chi tiết**:

- **C - ĐÚNG**: **Amazon Transcribe**.
  - Service speech-to-text.
  - Có tính năng built-in **PII Redaction** (Tự động nhận diện và che giấu thông tin nhạy cảm trong text output). Đáp ứng trọn vẹn yêu cầu.

---

## Câu 394

**Đề bài**:  A company is running a multi-tier ecommerce web application in the AWS Cloud. The application runs on Amazon EC2 instances with an Amazon RDS for MySQL Multi-AZ DB instance. Amazon RDS is configured with the latest generation DB instance with 2,000 GB of storage in a General Purpose SSD (gp3) Amazon Elastic Block Store (Amazon EBS) volume. The database performance affects the application during periods of high demand. A database administrator analyzes the logs in Amazon CloudWatch Logs and discovers that the application performance always degrades when the number of read and write IOPS is higher than 20,000. What should a solutions architect do to improve the application performance?

**Các đáp án**:

- A. Magnetic (Slow).
- B. **Increase the number of IOPS on the gp3 volume**.
- C. io2 (Expensive).
- D. Split volumes (Complex).

**Giải thích**:

- Volume **gp3** cho phép cấu hình IOPS độc lập với dung lượng.
- Baseline miễn phí là 3,000 IOPS. Max là 16,000 IOPS (đối với một số config cũ) hoặc cao hơn tùy size.
- Tuy nhiên, 2000GB gp3 mặc định thường chỉ set 3000 IOPS. Với nhu cầu > 20,000 IOPS (cao hơn baseline gp3 max throughput một chút ở một số instance/volume limits cũ, nhưng gp3 hiện support lên tới 16k IOPS natively, muốn hơn phải mua thêm).
- Thực tế gp3 max IOPS là 16,000? Không, gp3 support lên tới 16,000 IOPS.
- Nếu cần > 20,000 IOPS, có thể phải chuyển sang **io2** (Target C).
- Nhưng hãy xem lại đề: "degrades when ... higher than 20,000". Nghĩa là workload chạm ngưỡng 20,000.
- gp3 Max IOPS = 16,000 (cho volume size này?). Cần check limit.
- Specs: gp3 max IOPS = 16,000.
- io2 max IOPS = 64,000 (Block Express lên tới 256,000).
- Vì gp3 bị cap ở 16,000 (thường là vậy), nên nếu workload cần > 20,000 thì gp3 không đáp ứng được (dù có increase setting). Phải chuyển sang **io2** hoặc **io2 Block Express**.
- Tuy nhiên, nếu đề bài giả định gp3 có thể scale hơn (do kiến thức cũ hoặc nhầm lẫn), thì B (increase IOPS) là logic "Scale".
- Nhưng về mặt kỹ thuật chính xác: gp3 max 16k IOPS. Workload > 20k -> Phải dùng **io2** (Option C).

**Đáp án đúng**: **C**

---

## Câu 395

**Đề bài**:  An IAM user made several configuration changes to AWS resources in their company's account during a production deployment last week. A solutions architect learned that a couple of security group rules are not configured as desired. The solutions architect wants to confirm which IAM user was responsible for making changes. Which service should the solutions architect use to find the desired information?

**Các đáp án**:

- A. GuardDuty (Threats).
- B. Inspector (Vulns).
- C. **AWS CloudTrail**.
- D. Config (Resource history, but CloudTrail has identity details best).

**Đáp án đúng**: **C**

**Giải thích chi tiết**:

- **C - ĐÚNG**: **CloudTrail**.
  - Ghi lại mọi API calls (bao gồm `AuthorizeSecurityGroupIngress`).
  - Log chứa thông tin: **Identity (User ARN)**, Time, Source IP, Request Parameters. Dễ dàng tìm ra "Who did it".

---

## Câu 396

**Đề bài**:  A company has implemented a self-managed DNS service on AWS. The solution consists of the following: • Amazon EC2 instances in different AWS Regions • Endpoints of a standard accelerator in AWS Global Accelerator The company wants to protect the solution against DDoS attacks. What should a solutions architect do to meet this requirement?

**Các đáp án**:

- A. **Subscribe to AWS Shield Advanced. Add the accelerator as a resource to protect**.
- B. Shield Advanced on EC2 (Traffic comes via Accelerator).
- C. AWS WAF (Web ACL không bảo vệ UDP services generic, chỉ HTTP/HTTPS).
- D. ...

**Đáp án đúng**: **A**

**Giải thích chi tiết**:

- **A - ĐÚNG**:
  - Kiến trúc dùng **Global Accelerator** làm entry point.
  - **AWS Shield Advanced** hỗ trợ bảo vệ Global Accelerator standard accelerators. Bảo vệ chống DDoS layer 3/4 cho UDP protocol hiệu quả.

---

## Câu 397

**Đề bài**:  An ecommerce company needs to run a scheduled daily job to aggregate and filter sales records for analytics. The company stores the sales records in an Amazon S3 bucket. Each object can be up to 10 GB in size. Based on the number of sales events, the job can take up to an hour to complete. The CPU and memory usage of the job are constant and are known in advance. A solutions architect needs to minimize the amount of operational effort that is needed for the job to run. Which solution meets these requirements?

**Các đáp án**:

- A. Lambda (Max 15 mins -> Fail).
- B. API Gateway... (Complex).
- C. **ECS Fargate** + EventBridge scheduled task.
- D. ECS EC2 (Manage instances).

**Đáp án đúng**: **C**

**Giải thích chi tiết**:

- **C - ĐÚNG**: **Fargate Scheduled Task**.
  - Serverless container (No OS management -> Minimize effort).
  - Run task dài 1 tiếng thoải mái (không bị limit 15p như Lambda).
  - Trigger bằng EventBridge Schedule.

---

## Câu 398

**Đề bài**:  A company needs to transfer 600 TB of data from its on-premises network-attached storage (NAS) system to the AWS Cloud. The data transfer must be complete within 2 weeks. The data is sensitive and must be encrypted in transit. The company’s internet connection can support an upload speed of 100 Mbps. Which solution meets these requirements MOST cost-effectively?

**Các đáp án**:

- A. S3 Multipart (Internet -> Too slow).
- B. VPN (Internet -> Too slow).
- C. **AWS Snowball Edge**.
- D. Direct Connect (Lead time to setup DX usually > 2 weeks. Expensive).

**Đáp án đúng**: **C**

**Giải thích chi tiết**:

- **C - ĐÚNG**: **Snowball Edge**. Order vài thiết bị (80TB/device -> cần khoảng 8 devices). Copy data parallel. Ship về AWS. Tổng thời gian khả thi trong 2 tuần. Data encrypted.

---

## Câu 399

**Đề bài**:  A financial company hosts a web application on AWS. The application uses an Amazon API Gateway Regional API endpoint to give users the ability to retrieve current stock prices. The company’s security team has noticed an increase in the number of API requests. The security team is concerned that HTTP flood attacks might take the application offline. A solutions architect must design a solution to protect the application from this type of attack. Which solution meets these requirements with the LEAST operational overhead?

**Các đáp án**:

- A. CloudFront TTL (Caching helps, but flood might bypass cache with random query strings).
- B. **Regional AWS WAF web ACL with a rate-based rule**.
- C. CloudWatch Alert (Detective, not preventive).
- D. CloudFront + Lambda@Edge (Custom code -> High overhead).

**Đáp án đúng**: **B**

**Giải thích chi tiết**:

- **B - ĐÚNG**: **AWS WAF Rate-based Rule**.
  - Support Regional API Gateway directly.
  - Tự động block IP nếu request rate vượt ngưỡng (ví dụ > 2000 requests/5 mins).
  - Giải pháp native chống HTTP Flood hiệu quả nhất & ít effort nhất.

---

## Câu 400

**Đề bài**:  A meteorological startup company has a custom web application to sell weather data to its users online. The company uses Amazon DynamoDB to store its data and wants to build a new service that sends an alert to the managers of four internal teams every time a new weather event is recorded. The company does not want this new service to affect the performance of the current application. What should a solutions architect do to meet these requirements with the LEAST amount of operational overhead?

**Các đáp án**:

- A. Transactions (Performance impact, synchronous).
- B. App publish SNS (Code change in App -> impact).
- C. **Enable Amazon DynamoDB Streams**. Trigger Lambda (implicit) or Pipe to **SNS**. (Option C says "Use triggers to write to a single SNS topic").
- D. Cron job scan table (Performance impact scan table).

**Đáp án đúng**: **C**

**Giải thích chi tiết**:

- **C - ĐÚNG**: **DynamoDB Streams**.
  - Cơ chế **Asynchronous** (bất đồng bộ). App ghi vào DB xong là xong (nhanh). Stream xử lý việc capture change và trigger downstream (Lambda/Alert) sau đó.
  - Không ảnh hưởng performance của main app write.
  - Least overhead integration.

---
