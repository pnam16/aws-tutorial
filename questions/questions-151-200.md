# AWS Certification Exam Questions 151-200

Tài liệu được biên soạn chi tiết với giải thích bằng tiếng Việt, giúp bạn hiểu sâu về các dịch vụ AWS.

---

## Câu 151

**Đề bài**:  A company wants to migrate its on-premises data center to AWS. According to the company's compliance requirements, the company can use only the ap-northeast-3 Region. Company administrators are not permitted to connect VPCs to the internet. Which solutions will meet these requirements? (Choose two.)

**Các đáp án**:

- A. Use AWS Control Tower to implement data residency guardrails to deny internet access and deny access to all AWS Regions except ap-northeast-3.
- B. Use rules in AWS WAF to prevent internet access. Deny access to all AWS Regions except ap-northeast-3 in the AWS account settings.
- C. Use AWS Organizations to configure service control policies (SCPs) that prevent VPCs from gaining internet access. Deny access to all AWS Regions except ap-northeast-3.
- D. Create an outbound rule for the network ACL in each VPC to deny all traffic from 0.0.0.0/0. Create an IAM policy for each user to prevent the use of any AWS Region other than ap-northeast-3.
- E. Use AWS Config to activate managed rules to detect and alert for internet gateways and to detect and alert for new resources deployed outside of ap-northeast-3.

**Đáp án đúng**: **A, C**

**Giải thích chi tiết**:

- **A - ĐÚNG**: **AWS Control Tower** cung cấp tính năng **Data Residency Guardrails** (Preventive & Detective) giúp ngăn chặn việc triển khai resources ngoài Region cho phép và có thể setup structure để policy cấm Internet Gateway.
- **C - ĐÚNG**: **Service Control Policies (SCPs)** trong AWS Organizations là công cụ mạnh nhất để thực thi compliance ở cấp độ Account.
  - Bạn có thể viết SCP để `Deny` action `ec2:CreateInternetGateway`, `ec2:AttachInternetGateway`.
  - Bạn có thể viết SCP để `Deny` mọi action nếu `aws:RequestedRegion` không phải là `ap-northeast-3`.
  - Đây là giải pháp triệt để nhất để "Admins not permitted" (SCP chặn cả Root user của member account).
- **Lưu ý**: Thực tế A và C thường đi cùng nhau (Control Tower dùng SCP). Nếu bắt buộc chọn 2 giải pháp "Solution", A và C là hợp lý nhất vì chúng là cơ chế Governance.

---

## Câu 152

**Đề bài**:  A company uses a three-tier web application to provide training to new employees. The application is accessed for only 12 hours every day. The company is using an Amazon RDS for MySQL DB instance to store information and wants to minimize costs. What should a solutions architect do to meet these requirements?

**Các đáp án**:

- A. Configure an IAM policy for AWS Systems Manager Session Manager...
- B. Create an Amazon ElastiCache for Redis cache cluster...
- C. Launch an Amazon EC2 instance... Configure a cron job to start and stop the EC2 instance...
- D. Create AWS Lambda functions to start and stop the DB instance. Create Amazon EventBridge (Amazon CloudWatch Events) scheduled rules to invoke the Lambda functions. Configure the Lambda functions as event targets for the rules.

**Đáp án đúng**: **D**

**Giải thích chi tiết**:

- **D - ĐÚNG**: **RDS** tính tiền theo giờ chạy. Nếu chỉ dùng 12 tiếng/ngày, bạn có thể **Stop** instance trong 12 tiếng còn lại để tiết kiệm ~50% chi phí.
  - Giải pháp serverless chuẩn là dùng **EventBridge Scheduler** (hoặc Rule) để trigger **Lambda** function gọi API `StopDBInstance` và `StartDBInstance` vào giờ quy định.
- **C - SAI**: Restart EC2 không liên quan đến việc stop RDS. Cron job trên EC2 cũng tốn tiền chạy EC2 đó.

---

## Câu 153

**Đề bài**:  A company sells ringtones created from clips of popular songs. The files containing the ringtones are stored in Amazon S3 Standard and are at least 128 KB in size. The company has millions of files, but downloads are infrequent for ringtones older than 90 days. The company needs to save money on storage while keeping the most accessed files readily available for its users. Which action should the company take to meet these requirements MOST cost-effectively?

**Các đáp án**:

- A. Configure S3 Standard-Infrequent Access (S3 Standard-IA) storage for the initial storage tier...
- B. Move the files to S3 Intelligent-Tiering and configure it to move objects to a less expensive storage tier after 90 days.
- C. Configure S3 inventory...
- D. Implement an S3 Lifecycle policy that moves the objects from S3 Standard to S3 Standard-Infrequent Access (S3 Standard-IA) after 90 days.

**Đáp án đúng**: **D**

**Giải thích chi tiết**:

- **D - ĐÚNG**: Pattern truy cập rõ ràng ("older than 90 days" -> "infrequent").
  - **S3 Lifecycle Policy** chuyển sang **Standard-IA** sau 90 ngày là rẻ nhất và đúng mục đích.
  - File > 128KB phù hợp với minimum storage duration/size của IA.
- **B - SAI**: **Intelligent-Tiering** dành cho access pattern **không đoán trước được**. Nó có phí monitoring ($0.0025/1000 objects). Với "millions of files" và pattern đã biết rõ (90 days), dùng Lifecycle Policy (Free config) chuyển thẳng sang IA sẽ tiết kiệm hơn là trả phí monitoring cho Intelligent-Tiering.

---

## Câu 154

**Đề bài**:  A company needs to save the results from a medical trial to an Amazon S3 repository. The repository must allow a few scientists to add new files and must restrict all other users to read-only access. No users can have the ability to modify or delete any files in the repository. The company must keep every file in the repository for a minimum of 1 year after its creation date. Which solution will meet these requirements?

**Các đáp án**:

- A. Use S3 Object Lock in governance mode with a legal hold of 1 year.
- B. Use S3 Object Lock in compliance mode with a retention period of 365 days.
- C. Use an IAM role to restrict all users from deleting or changing objects...
- D. Configure the S3 bucket to invoke an AWS Lambda function...

**Đáp án đúng**: **B**

**Giải thích chi tiết**:

- **B - ĐÚNG**: **S3 Object Lock Compliance Mode**:
  - Chế độ chặt chẽ nhất của WORM (Write Once Read Many).
  - **Không ai** (kể cả account root user) có thể xóa hoặc ghi đè object trong thời gian retention (365 days).
  - Đáp ứng yêu cầu "No users can have the ability to modify or delete".
- **A - SAI**: **Governance Mode** cho phép users có quyền IAM đặc biệt (`s3:BypassGovernanceRetention`) thực hiện xóa/ghi đè. Không strict bằng Compliance Mode.
- **C - SAI**: IAM/Bucket Policy có thể bị thay đổi bởi Admin, không đảm bảo tính bất biến (Immutability) về mặt pháp lý/compliance như Object Lock.

---

## Câu 155

**Đề bài**:  A large media company hosts a web application on AWS. The company wants to start caching confidential media files so that users around the world will have reliable access to the files. The content is stored in Amazon S3 buckets. The company must deliver the content quickly, regardless of where the requests originate geographically. Which solution will meet these requirements?

**Các đáp án**:

- A. Use AWS DataSync...
- B. Deploy AWS Global Accelerator...
- C. Deploy Amazon CloudFront to connect the S3 buckets to CloudFront edge servers.
- D. Use Amazon Simple Queue Service (Amazon SQS)...

**Đáp án đúng**: **C**

**Giải thích chi tiết**:

- **C - ĐÚNG**: **Amazon CloudFront** là CDN (Content Delivery Network) của AWS, chuyên dụng để cache nội dung tĩnh (Media files, Images, Video) tại các Edge Location trên toàn cầu -> "Deliver content quickly regardless of geography".
  - Hỗ trợ "confidential media files" thông qua tính năng **Signed URLs / Signed Cookies**.

---

## Câu 156

**Đề bài**:  A company produces batch data that comes from different databases. The company also produces live stream data from network sensors and application APIs. The company needs to consolidate all the data into one place for business analytics. The company needs to process the incoming data and then stage the data in different Amazon S3 buckets. Teams will later run one-time queries and import the data into a business intelligence tool to show key performance indicators (KPIs). Which combination of steps will meet these requirements with the LEAST operational overhead? (Choose two.)

**Các đáp án**:

- A. Use Amazon Athena for one-time queries. Use Amazon QuickSight to create dashboards for KPIs.
- B. Use Amazon Kinesis Data Analytics...
- C. Create custom AWS Lambda functions...
- D. Use AWS Glue ETL job... Load to OpenSearch...
- E. Use blueprints in AWS Lake Formation to identify the data that can be ingested into a data lake. Use AWS Glue to crawl the source, extract the data, and load the data into Amazon S3 in Apache Parquet format.

**Đáp án đúng**: **A, E**

**Giải thích chi tiết**:

- **E - ĐÚNG**: **AWS Lake Formation** (Build on top of Glue) giúp đơn giản hóa việc Ingestion (Blueprints) từ Database và quản lý Data Lake trên S3. Glue Crawler/ETL giúp chuẩn hóa data về Parquet (tối ưu cho Analytics). Đây là phần "Process and Stage in S3".
- **A - ĐÚNG**: **Amazon Athena** (Serverless SQL) tuyệt vời cho "One-time queries" trực tiếp trên S3. **Amazon QuickSight** là BI Tool serverless để vẽ Dashboard/KPIs. Đây là phần "Business Analytics".
- Cả 2 đều là Managed/Serverless -> Least operational overhead.

---

## Câu 157

**Đề bài**:  A company stores data in an Amazon Aurora PostgreSQL DB cluster. The company must store all the data for 5 years and must delete all the data after 5 years. The company also must indefinitely keep audit logs of actions that are performed within the database. Currently, the company has automated backups configured for Aurora. Which combination of steps should a solutions architect take to meet these requirements? (Choose two.)

**Các đáp án**:

- A. Take a manual snapshot...
- B. Create a lifecycle policy...
- C. Configure automated backup retention...
- D. Configure an Amazon CloudWatch Logs export for the DB cluster.
- E. Use AWS Backup to take the backups and to keep the backups for 5 years.

**Đáp án đúng**: **D, E**

**Giải thích chi tiết**:

- **E - ĐÚNG**: **AWS Backup** là dịch vụ tập trung để quản lý backup cho nhiều service (gồm Aurora). Nó hỗ trợ **Lifecycle rule** (Retention period > 35 days, ví dụ 5 năm) và tự động xóa expired backups. (Automated backup mặc định của Aurora chỉ giữ tối đa 35 ngày).
- **D - ĐÚNG**: **CloudWatch Logs Export**. PostgreSQL Audit Logs (như `pgAudit`) có thể được publish sang CloudWatch Logs. Từ đó có thể set retention là **Never Expire** (Indefinitely) tách biệt với vòng đời của Database.

---

## Câu 158

**Đề bài**:  A solutions architect is optimizing a website for an upcoming musical event. Videos of the performances will be streamed in real time and then will be available on demand. The event is expected to attract a global online audience. Which service will improve the performance of both the real-time and on-demand streaming?

**Các đáp án**:

- A. Amazon CloudFront
- B. AWS Global Accelerator
- C. Amazon Route 53
- D. Amazon S3 Transfer Acceleration

**Đáp án đúng**: **A**

**Giải thích chi tiết**:

- **A - ĐÚNG**: **CloudFront** hỗ trợ cả Live Streaming (thông qua protocol như HLS/DASH over HTTP) và On-Demand Video. Nó cache video segments tại Edge, giảm tải cho origin và giảm latency cho người xem toàn cầu.

---

## Câu 159

**Đề bài**:  A company is running a publicly accessible serverless application that uses Amazon API Gateway and AWS Lambda. The application’s traffic recently spiked due to fraudulent requests from botnets. Which steps should a solutions architect take to block requests from unauthorized users? (Choose two.)

**Các đáp án**:

- A. Create a usage plan with an API key that is shared with genuine users only.
- B. Integrate logic within the Lambda function...
- C. Implement an AWS WAF rule to target malicious requests and trigger actions to filter them out.
- D. Convert the existing public API to a private API...
- E. Create an IAM role for each user...

**Đáp án đúng**: **A, C**

**Giải thích chi tiết**:

- **C - ĐÚNG**: **AWS WAF** (Web Application Firewall) gắn vào API Gateway. Dùng rule `AWSManagedRulesBotControlRuleSet` hoặc IP lists để chặn botnets/malicious traffic ngay từ cửa ngõ, trước khi hit vào Backend.
- **A - ĐÚNG**: **API Keys + Usage Plan**. Cấp API Key cho "genuine users" (nếu mô hình cho phép). Request không có API Key hoặc sai Key sẽ bị reject (403 Forbidden) ngay tại API Gateway (Throttling layer), giúp block unauthorized/anonymous bot traffic.

---

## Câu 160

**Đề bài**:  An ecommerce company hosts its analytics application in the AWS Cloud. The application generates about 300 MB of data each month. The data is stored in JSON format. The company is evaluating a disaster recovery solution to back up the data. The data must be accessible in milliseconds if it is needed, and the data must be kept for 30 days. Which solution meets these requirements MOST cost-effectively?

**Các đáp án**:

- A. Amazon OpenSearch Service...
- B. Amazon S3 Glacier
- C. Amazon S3 Standard
- D. Amazon RDS for PostgreSQL

**Đáp án đúng**: **C**

**Giải thích chi tiết**:

- **C - ĐÚNG**: **S3 Standard**.
  - Dung lượng 300 MB rất nhỏ -> Chi phí S3 gần như không đáng kể ($0.023/GB -> $0.007/tháng).
  - "Access in milliseconds": S3 Standard đáp ứng instant retrieval. (Glacier (B) mất phút/giờ).
  - "Keep 30 days": S3 Lifecycle xóa sau 30 ngày.
  - So với RDS/OpenSearch (tốn tiền chạy instance/cluster), S3 rẻ hơn hàng nghìn lần cho usecase backup nhỏ này.

---

## Câu 161

**Đề bài**:  A company has a small Python application that processes JSON documents and outputs the results to an on-premises SQL database. The application runs thousands of times each day. The company wants to move the application to the AWS Cloud. The company needs a highly available solution that maximizes scalability and minimizes operational overhead. Which solution will meet these requirements?

**Các đáp án**:

- A. Place JSON in S3. Run Python on multiple EC2 instances...
- B. Place JSON in S3. Create an AWS Lambda function that runs the Python code... Store in Aurora DB cluster.
- C. Place JSON in EBS...
- D. Place JSON in SQS... ECS cluster with EC2 launch type...

**Đáp án đúng**: **B**

**Giải thích chi tiết**:

- **B - ĐÚNG**: Kiến trúc **S3 Event Trigger -> Lambda** là chuẩn mực cho xử lý file (JSON) serverless.
  - Maximize Scalability: Lambda tự scale theo số lượng file upload (thousands/day).
  - Minimize Operational Overhead: Không cần quản lý Server (EC2/ECS). Code Python chạy trực tiếp.
  - Aurora Serverless (hoặc Aurora Provisioned) là DB đích phù hợp.

---

## Câu 162

**Đề bài**:  A company wants to use high performance computing (HPC) infrastructure on AWS for financial risk modeling. The company’s HPC workloads run on Linux. Each HPC workflow runs on hundreds of Amazon EC2 Spot Instances, is short-lived, and generates thousands of output files that are ultimately stored in persistent storage for analytics and long-term future use. The company seeks a cloud storage solution that permits the copying of on-premises data to long-term persistent storage to make data available for processing by all EC2 instances. The solution should also be a high performance file system that is integrated with persistent storage to read and write datasets and output files. Which combination of AWS services meets these requirements?

**Các đáp án**:

- A. Amazon FSx for Lustre integrated with Amazon S3
- B. Amazon FSx for Windows File Server integrated with Amazon S3
- C. Amazon S3 Glacier integrated with Amazon EBS
- D. Amazon S3 bucket with a VPC endpoint integrated with EBS...

**Đáp án đúng**: **A**

**Giải thích chi tiết**:

- **A - ĐÚNG**: **Amazon FSx for Lustre**:
  - Là file system hiệu năng cực cao (High Performance Compuitng - HPC) cho Linux.
  - Tính năng nổi bật: **Linked to S3 bucket**. Có thể load data từ S3 vào FSx siêu nhanh, xử lý xong ghi ngược lại S3.
  - Phù hợp hoàn hảo cho "EC2 Spot Workloads" cần shared high-speed storage.

---

## Câu 163

**Đề bài**:  A company is building a containerized application on premises and decides to move the application to AWS. The application will have thousands of users soon after it is deployed. The company is unsure how to manage the deployment of containers at scale. The company needs to deploy the containerized application in a highly available architecture that minimizes operational overhead. Which solution will meet these requirements?

**Các đáp án**:

- A. Store container images in ECR. Use ECS with Fargate launch type... Use target tracking to scale.
- B. Store container images in ECR. Use ECS with EC2 launch type...
- C. Store container images in a repository that runs on EC2...
- D. Create EC2 AMI...

**Đáp án đúng**: **A**

**Giải thích chi tiết**:

- **A - ĐÚNG**: **AWS Fargate** là "Serverless for Containers". Bạn không cần quản lý Cluster hay Node EC2. Chỉ cần define Task (CPU/RAM).
  - Kết hợp **Target Tracking Scaling** (Service Auto Scaling) giúp tự động scale theo demand (users).
  - Minimize operational overhead nhất trong các lựa chọn.

---

## Câu 164

**Đề bài**:  A company has two applications: a sender application that sends messages with payloads to be processed and a processing application intended to receive the messages with payloads. The company wants to implement an AWS service to handle messages between the two applications. The sender application can send about 1,000 messages each hour. The messages may take up to 2 days to be processed: If the messages fail to process, they must be retained so that they do not impact the processing of any remaining messages. Which solution meets these requirements and is the MOST operationally efficient?

**Các đáp án**:

- A. Application on EC2 running Redis...
- B. Kinesis Data Stream...
- C. Integrate with SQS. Configure a dead-letter queue (DLQ).
- D. SNS topic...

**Đáp án đúng**: **C** (Với lưu ý về Visibility Timeout).

**Giải thích chi tiết**:

- **C - ĐÚNG**: **SQS + DLQ**.
  - SQS decouple Sender/Processor.
  - **Dead-letter Queue (DLQ)**: Đảm bảo "If messages fail to process, they must be retained". Message lỗi sẽ chui vào DLQ để inspect sau, không block hệ thống.
  - _Lưu ý_: SQS Visibility Timeout tối đa là 12 giờ. Nếu process task mất "2 ngày", SQS native không giữ message invisible lâu thế được. Tuy nhiên, trong context bài thi, pattern "Queue for decoupling + DLQ for failure buffer" là đáp án standard cho loại kiến trúc này so với Redis (thủ công) hay Kinesis (Stream). Có thể "Process logic" được quản lý bởi Step Functions trigger từ SQS.

---

## Câu 165

**Đề bài**:  A solutions architect must design a solution that uses Amazon CloudFront with an Amazon S3 origin to store a static website. The company’s security policy requires that all website traffic be inspected by AWS WAF. How should the solutions architect comply with these requirements?

**Các đáp án**:

- A. S3 bucket policy accept WAF ARN...
- B. CloudFront forward requests to WAF...
- C. Security Group...
- D. Configure CloudFront and S3 to use an origin access identity (OAI) to restrict access to the S3 bucket. Enable AWS WAF on the distribution.

**Đáp án đúng**: **D**

**Giải thích chi tiết**:

- **D - ĐÚNG**: Để đảm bảo **tất cả** traffic đều qua WAF, ta phải bắt buộc traffic đi theo flow: User -> WAF -> CloudFront -> S3.
  - Gắn WAF vào CloudFront Distribution.
  - Dùng **OAI (Origin Access Identity)** (hoặc OAC) để config S3 Bucket Policy chỉ cho phép CloudFront OAI đọc data. S3 sẽ từ chối truy cập trực tiếp từ Internet.
  - Như vậy user không thể bypass WAF để access S3 directly.

---

## Câu 166

**Đề bài**:  Organizers for a global event want to put daily reports online as static HTML pages. The pages are expected to generate millions of views from users around the world. The files are stored in an Amazon S3 bucket. A solutions architect has been asked to design an efficient and effective solution. Which action should the solutions architect take to accomplish this?

**Các đáp án**:

- A. Presigned URLs
- B. Cross-Region Replication
- C. Route 53 Geoproximity
- D. Use Amazon CloudFront with the S3 bucket as its origin.

**Đáp án đúng**: **D**

**Giải thích chi tiết**:

- **D - ĐÚNG**: **Amazon CloudFront** + S3 là giải pháp standard cho static website hosting với high traffic global. CloudFront cache HTML tại Edge, chịu tải thay cho S3 và giảm chi phí data transfer.

---

## Câu 167

**Đề bài**:  A company runs a production application on a fleet of Amazon EC2 instances. The application reads the data from an Amazon SQS queue and processes the messages in parallel. The message volume is unpredictable and often has intermittent traffic. This application should continually process messages without any downtime. Which solution meets these requirements MOST cost-effectively?

**Các đáp án**:

- A. Spot Instances exclusively...
- B. Reserved Instances exclusively...
- C. Use Reserved Instances for the baseline capacity and use Spot Instances to handle additional capacity.
- D. Use Reserved Instances for the baseline capacity and use On-Demand Instances to handle additional capacity.

**Đáp án đúng**: **C**

**Giải thích chi tiết**:

- **C - ĐÚNG**: Chiến lược **Mixed Instances**:
  - **Reserved Instances (RI)**: Dành cho "Baseline capacity" (phần tải nền luôn chạy 24/7) -> Đảm bảo availability và rẻ nhất cho long-running.
  - **Spot Instances**: Dành cho "Additional capacity" (phần spike, unpredictable) -> Rẻ nhất cho short-term/burst load. Vì app đọc từ SQS (stateless/creates parallel processing), nếu Spot bị cắt (reclaimed), message trả về Queue và xử lý lại bởi instance khác, không gây lỗi hệ thống nghiêm trọng.

---

## Câu 168

**Đề bài**:  A security team wants to limit access to specific services or actions in all of the team’s AWS accounts. All accounts belong to a large organization in AWS Organizations. The solution must be scalable and there must be a single point where permissions can be maintained. What should a solutions architect do to accomplish this?

**Các đáp án**:

- A. ACL...
- B. Security Group...
- C. Cross-account roles...
- D. Create a service control policy (SCP) in the root organizational unit to deny access to the services or actions.

**Đáp án đúng**: **D**

**Giải thích chi tiết**:

- **D - ĐÚNG**: **Service Control Policy (SCP)**:
  - Áp dụng tại Level Organization/OU (Root OU -> apply cho all accounts).
  - "Deny" policy tại Root sẽ override mọi Allow policy tại Account con.
  - "Single point of maintenance" (Quản lý tại Master Account).

---

## Câu 169

**Đề bài**:  A company is concerned about the security of its public web application due to recent web attacks. The application uses an Application Load Balancer (ALB). A solutions architect must reduce the risk of DDoS attacks against the application. What should the solutions architect do to meet this requirement?

**Các đáp án**:

- A. Amazon Inspector
- B. Amazon Macie
- C. Enable AWS Shield Advanced to prevent attacks.
- D. Amazon GuardDuty

**Đáp án đúng**: **C**

**Giải thích chi tiết**:

- **C - ĐÚNG**: **AWS Shield Advanced** là dịch vụ chuyên dụng chống DDoS (Distributed Denial of Service) lớp 3, 4 và 7. Nó cung cấp các biện pháp giảm thiểu tấn công nâng cao, cost protection, và hỗ trợ từ đội ngũ DRT.

---

## Câu 170

**Đề bài**:  A company’s web application is running on Amazon EC2 instances behind an Application Load Balancer. The company recently changed its policy, which now requires the application to be accessed from one specific country only. Which configuration will meet this requirement?

**Các đáp án**:

- A. Security Group EC2
- B. Security Group ALB
- C. Configure AWS WAF on the Application Load Balancer in a VPC.
- D. Network ACL

**Đáp án đúng**: **C**

**Giải thích chi tiết**:

- **C - ĐÚNG**: **AWS WAF** hỗ trợ **Geo Match Statement** (filter request theo Country Code). Gắn WAF vào ALB để chặn traffic từ các quốc gia không mong muốn (hoặc whitelist 1 country). SG và NACL hoạt động dựa trên IP (CIDR), không nhận diện được Country một cách dynamic và chính xác như WAF.

---

## Câu 171

**Đề bài**:  A company provides an API to its users that automates inquiries for tax computations based on item prices. The company experiences a larger number of inquiries during the holiday season only that cause slower response times. A solutions architect needs to design a solution that is scalable and elastic. What should the solutions architect do to accomplish this?

**Các đáp án**:

- A. API on EC2...
- B. Design a REST API using Amazon API Gateway... passes item names to AWS Lambda for tax computations.
- C. ALB + 2 EC2...
- D. API Gateway + API on EC2...

**Đáp án đúng**: **B**

**Giải thích chi tiết**:

- **B - ĐÚNG**: **API Gateway + Lambda**.
  - **Elastic**: Lambda tự động scale (chạy hàng nghìn concurrent executions) khi có spike traffic (Holiday) và scale về 0 khi không dùng.
  - Không cần provision capacity trước (như EC2).

---

## Câu 172

**Đề bài**:  A solutions architect is creating a new Amazon CloudFront distribution for an application. Some of the information submitted by users is sensitive. The application uses HTTPS but needs another layer of security. The sensitive information should.be protected throughout the entire application stack, and access to the information should be restricted to certain applications. Which action should the solutions architect take?

**Các đáp án**:

- A. CloudFront signed URL
- B. CloudFront signed cookie
- C. Configure a CloudFront field-level encryption profile.
- D. Origin Protocol Policy HTTPS Only...

**Đáp án đúng**: **C**

**Giải thích chi tiết**:

- **C - ĐÚNG**: **Field-level Encryption**.
  - CloudFront mã hóa dữ liệu nhạy cảm (ví dụ thẻ tín dụng) ngay tại Edge bằng Public Key.
  - Dữ liệu duy trì trạng thái mã hóa qua toàn bộ network (qua Internet, qua ALB, vào Web Server) và chỉ được giải mã bởi Application backend nắm giữ Private Key.
  - Đảm bảo an toàn ngay cả khi TLS bị terminate tại ALB.

---

## Câu 173

**Đề bài**:  A gaming company hosts a browser-based application on AWS. The users of the application consume a large number of videos and images that are stored in Amazon S3. This content is the same for all users. The application has increased in popularity, and millions of users worldwide accessing these media files. The company wants to provide the files to the users while reducing the load on the origin. Which solution meets these requirements MOST cost-effectively?

**Các đáp án**:

- A. AWS Global Accelerator
- B. Deploy an Amazon CloudFront web distribution in front of the S3 bucket.
- C. ElastiCache Redis
- D. ElastiCache Memcached

**Đáp án đúng**: **B**

**Giải thích chi tiết**:

- **B - ĐÚNG**: **CloudFront** (CDN) cache content (Video/Image) tại Edge POPs.
  - Giảm tải (request) trực tiếp vào S3 origin.
  - Chi phí Data Transfer Out của CloudFront thường rẻ hơn S3 direct.

---

## Câu 174

**Đề bài**:  A company has a multi-tier application that runs six front-end web servers in an Amazon EC2 Auto Scaling group in a single Availability Zone behind an Application Load Balancer (ALB). A solutions architect needs to modify the infrastructure to be highly available without modifying the application. Which architecture should the solutions architect choose that provides high availability?

**Các đáp án**:

- A. ASG 3 instances across 2 Regions (Too complex/latency).
- B. Modify the Auto Scaling group to use three instances across each of two Availability Zones.
- C. ASG template... Region...
- D. Round-robin ALB (Not fixing Single AZ SPoF).

**Đáp án đúng**: **B**

**Giải thích chi tiết**:

- **B - ĐÚNG**: Move từ **Single AZ** -> **Multi-AZ**.
  - Cấu hình ASG để launch instances vào ít nhất 2 Subnet thuộc 2 AZ khác nhau.
  - Chia đều 6 instances -> 3 instance/AZ.
  - Nếu 1 AZ sập, vẫn còn 3 instance ở AZ kia chạy -> **High Availability**.

---

## Câu 175

**Đề bài**:  An ecommerce company has an order-processing application that uses Amazon API Gateway and an AWS Lambda function. The application stores data in an Amazon Aurora PostgreSQL database. During a recent sales event, a sudden surge in customer orders occurred. Some customers experienced timeouts, and the application did not process the orders of those customers. A solutions architect determined that the CPU utilization and memory utilization were high on the database because of a large number of open connections. The solutions architect needs to prevent the timeout errors while making the least possible changes to the application. Which solution will meet these requirements?

**Các đáp án**:

- A. Provisioned concurrency...
- B. Use Amazon RDS Proxy to create a proxy for the database. Modify the Lambda function to use the RDS Proxy endpoint...
- C. Read replica...
- D. Migrate to DynamoDB...

**Đáp án đúng**: **B**

**Giải thích chi tiết**:

- **B - ĐÚNG**: Vấn đề điển hình của "Lambda + Relational DB". Lambda scale quá nhanh tạo ra hàng nghìn connection làm quá tải DB (`max_connections` limit).
  - **RDS Proxy** nằm giữa Lambda và RDS, quản lý Connection Pooling, tái sử dụng connection hiệu quả.
  - Chỉ cần đổi endpoint trong code Lambda từ RDS Endpoint sang RDS Proxy Endpoint ("Least changes").

---

## Câu 176

**Đề bài**:  An application runs on Amazon EC2 instances in private subnets. The application needs to access an Amazon DynamoDB table. What is the MOST secure way to access the table while ensuring that the traffic does not leave the AWS network?

**Các đáp án**:

- A. Use a VPC endpoint for DynamoDB.
- B. NAT Gateway public (Traffic đi ra public IP của NAT, dù vẫn trong AWS network logical boundary nhưng đi qua IGW path).
- C. NAT Instance.
- D. Internet Gateway.

**Đáp án đúng**: **A**

**Giải thích chi tiết**:

- **A - ĐÚNG**: **VPC Gateway Endpoint for DynamoDB**. Tạo đường routing riêng biệt trong Route Table (`pl-xxxx` -> `vpce-xxxx`). Traffic đi trực tiếp từ Private Subnet tới DynamoDB Service qua mạng AWS Backbone, không cần Internet Gateway hay NAT. Secure nhất.

---

## Câu 177

**Đề bài**:  An entertainment company is using Amazon DynamoDB to store media metadata. The application is read intensive and experiencing delays. The company does not have staff to handle additional operational overhead and needs to improve the performance efficiency of DynamoDB without reconfiguring the application. What should a solutions architect recommend to meet this requirement?

**Các đáp án**:

- A. ElastiCache Redis (Cần code change).
- B. Use Amazon DynamoDB Accelerator (DAX).
- C. Global Tables (Replication, not caching).
- D. ElastiCache Memcached.

**Đáp án đúng**: **B**

**Giải thích chi tiết**:

- **B - ĐÚNG**: **DAX** là bộ nhớ đệm in-memory được quản lý hoàn toàn cho DynamoDB.
  - Nó tương thích với DynamoDB API. Bạn chỉ cần trỏ Application driver tới DAX Endpoint thay vì DynamoDB Endpoint -> "No reconfiguring app logic" (chỉ đổi config endpoint).
  - Giảm response time từ miliseconds xuống microseconds.

---

## Câu 178

**Đề bài**:  A company’s infrastructure consists of Amazon EC2 instances and an Amazon RDS DB instance in a single AWS Region. The company wants to back up its data in a separate Region. Which solution will meet these requirements with the LEAST operational overhead?

**Các đáp án**:

- A. Use AWS Backup to copy EC2 backups and RDS backups to the separate Region.
- B. DLM (Chủ yếu cho EBS).
- C. Manual AMI/Replica...
- D. Manual Snapshot/Export...

**Đáp án đúng**: **A**

**Giải thích chi tiết**:

- **A - ĐÚNG**: **AWS Backup** hỗ trợ Cross-Region Copy backup plans cho cả EC2 và RDS. Mọi thứ được automate hoàn toàn trong Backup Plan.

---

## Câu 179

**Đề bài**:  A solutions architect needs to securely store a database user name and password that an application uses to access an Amazon RDS DB instance. The application that accesses the database runs on an Amazon EC2 instance. The solutions architect wants to create a secure parameter in AWS Systems Manager Parameter Store. What should the solutions architect do to meet this requirement?

**Các đáp án**:

- A. Create an IAM role that has read access to the Parameter Store parameter. Allow Decrypt access to an AWS KMS key... Assign this IAM role to the EC2 instance.
- B. IAM Policy... Assign to EC2 (Sai thuật ngữ, Policy assign vào User/Group/Role).
- C. IAM Trust... (Trust relationship là để assume role).
- D. Trust...

**Đáp án đúng**: **A**

**Giải thích chi tiết**:

- **A - ĐÚNG**:
  - Để App trên EC2 lấy được parameter, EC2 cần **IAM Role** attached.
  - Role cần permission `ssm:GetParameter` (để đọc) và `kms:Decrypt` (để giải mã SecureString).

---

## Câu 180

**Đề bài**:  A company is designing a cloud communications platform that is driven by APIs. The application is hosted on Amazon EC2 instances behind a Network Load Balancer (NLB). The company uses Amazon API Gateway to provide external users with access to the application through APIs. The company wants to protect the platform against web exploits like SQL injection and also wants to detect and mitigate large, sophisticated DDoS attacks. Which combination of solutions provides the MOST protection? (Choose two.)

**Các đáp án**:

- A. AWS WAF protect NLB (Sai, NLB ko support WAF).
- B. Use AWS Shield Advanced with the NLB.
- C. Use AWS WAF to protect Amazon API Gateway.
- D. GuardDuty...
- E. Shield Standard...

**Đáp án đúng**: **B, C**

**Giải thích chi tiết**:

- **C - ĐÚNG**: **WAF on API Gateway**. Bảo vệ Layer 7 (SQL Injection, XSS).
- **B - ĐÚNG**: **AWS Shield Advanced on NLB** (hoặc Elastic IP của NLB). Bảo vệ Layer 3/4 DDoS nâng cao (Volumetric attacks). Vì NLB chịu tải traffic mạng, bật Shield Advanced ở đây giúp mitigation tốt nhất cho hạ tầng mạng. (Shield Adv cũng có thể bật trên CloudFront/Route53/Global Accelerator, nhưng trong diagram này NLB là thành phần network chính phía sau APIGW).

---

## Câu 181

**Đề bài**:  A company has a legacy data processing application that runs on Amazon EC2 instances. Data is processed sequentially, but the order of results does not matter. The application uses a monolithic architecture. The only way that the company can scale the application to meet increased demand is to increase the size of the instances. The company’s developers have decided to rewrite the application to use a microservices architecture on Amazon Elastic Container Service (Amazon ECS). What should a solutions architect recommend for communication between the microservices?

**Các đáp án**:

- A. Amazon SQS queue...
- B. SNS topic...
- C. Lambda...
- D. DynamoDB Streams...

**Đáp án đúng**: **A**

**Giải thích chi tiết**:

- **A - ĐÚNG**: **SQS** là mẫu thiết kế kinh điển để decouple Microservices. Producer đẩy job vào queue, Consumer (Microservice) pull về xử lý. Đảm bảo reliability, buffering, scalability. "Order does not matter" -> Standard Queue là đủ.

---

## Câu 182

**Đề bài**:  A company wants to migrate its MySQL database from on premises to AWS. The company recently experienced a database outage that significantly impacted the business. To ensure this does not happen again, the company wants a reliable database solution on AWS that minimizes data loss and stores every transaction on at least two nodes. Which solution meets these requirements?

**Các đáp án**:

- A. RDS Sync 3 nodes (Sai).
- B. Create an Amazon RDS MySQL DB instance with Multi-AZ functionality enabled to synchronously replicate the data.
- C. Read Replica (Async).
- D. EC2 + Lambda (Custom).

**Đáp án đúng**: **B**

**Giải thích chi tiết**:

- **B - ĐÚNG**: **RDS Multi-AZ**.
  - Sử dụng **Synchronous Replication** (Sao chép đồng bộ) giữa Primary DB và Standby DB (ở AZ khác).
  - Transaction chỉ commit khi đã ghi thành công ở cả 2 nơi -> "Store every transaction on at least two nodes".
  - Minimize data loss (RPO ~ 0 cho failover).

---

## Câu 183

**Đề bài**:  A company is building a new dynamic ordering website. The company wants to minimize server maintenance and patching. The website must be highly available and must scale read and write capacity as quickly as possible to meet changes in user demand. Which solution will meet these requirements?

**Các đáp án**:

- A. Static S3. API Gateway + Lambda. DynamoDB On-demand. CloudFront.
- B. ... Aurora Auto Scaling.
- C. EC2 ASG ... DynamoDB.
- D. EC2 ASG ... Aurora.

**Đáp án đúng**: **A**

**Giải thích chi tiết**:

- **A - ĐÚNG**: **Full Serverless Stack**.
  - S3 + CloudFront (Static FE).
  - APIGW + Lambda (Backend Logic) -> No patching, no server maintenance.
  - **DynamoDB On-demand**: Scale capacity instantly (tính bằng milli-seconds) để đáp ứng traffic spike. (Aurora Auto Scaling mất thời gian hơn để add replica).

---

## Câu 184

**Đề bài**:  A company has an AWS account used for software engineering. The AWS account has access to the company’s on-premises data center through a pair of AWS Direct Connect connections. All non-VPC traffic routes to the virtual private gateway. A development team recently created an AWS Lambda function through the console. The development team needs to allow the function to access a database that runs in a private subnet in the company’s data center. Which solution will meet these requirements?

**Các đáp án**:

- A. Configure the Lambda function to run in the VPC with the appropriate security group.
- B. VPN...
- C. Route tables...
- D. Elastic IP...

**Đáp án đúng**: **A**

**Giải thích chi tiết**:

- **A - ĐÚNG**: Để Lambda truy cập resource qua Direct Connect (kết nối tới VPC), Lambda **bắt buộc phải chạy trong VPC** (VPC config with Subnets/SGs). Khi đó Lambda có ENI trong VPC và route traffic qua VGW/DX tới on-prem.

---

## Câu 185

**Đề bài**:  A company runs an application using Amazon ECS. The application creates resized versions of an original image and then makes Amazon S3 API calls to store the resized images in Amazon S3. How can a solutions architect ensure that the application has permission to access Amazon S3?

**Các đáp án**:

- A. Update S3 role...
- B. Create an IAM role with S3 permissions, and then specify that role as the taskRoleArn in the task definition.
- C. Security Group...
- D. IAM User...

**Đáp án đúng**: **B**

**Giải thích chi tiết**:

- **B - ĐÚNG**: **ECS Task Role**. Đây là cách IAM permission được cấp cho Container (Task). Khai báo `taskRoleArn` trong Task Definition. Code trong container sẽ tự động lấy được credentials của role này.

---

## Câu 186

**Đề bài**:  A company has a Windows-based application that must be migrated to AWS. The application requires the use of a shared Windows file system attached to multiple Amazon EC2 Windows instances that are deployed across multiple Availability Zone: What should a solutions architect do to meet this requirement?

**Các đáp án**:

- A. Storage Gateway...
- B. Configure Amazon FSx for Windows File Server.
- C. Amazon EFS (Linux).
- D. EBS (Single AZ/Block).

**Đáp án đúng**: **B**

**Giải thích chi tiết**:

- **B - ĐÚNG**: **Amazon FSx for Windows File Server**.
  - Fully managed native Windows File System (SMB).
  - Hỗ trợ **Multi-AZ deployment**. Shared access từ nhiều EC2 Windows.

---

## Câu 187

**Đề bài**:  A company is developing an ecommerce application that will consist of a load-balanced front end, a container-based application, and a relational database. A solutions architect needs to create a highly available solution that operates with as little manual intervention as possible. Which solutions meet these requirements? (Choose two.)

**Các đáp án**:

- A. Create an Amazon RDS DB instance in Multi-AZ mode.
- B. RDS Replica...
- C. EC2 Docker cluster...
- D. Create an Amazon Elastic Container Service (Amazon ECS) cluster with a Fargate launch type...
- E. ECS EC2 launch type...

**Đáp án đúng**: **A, D**

**Giải thích chi tiết**:

- **A - ĐÚNG**: RDS Multi-AZ cho Database HA + Managed maintenance.
- **D - ĐÚNG**: ECS Fargate cho App. Serverless container (Little manual intervention, no patching OS).

---

## Câu 188

**Đề bài**:  A company uses Amazon S3 as its data lake. The company has a new partner that must use SFTP to upload data files. A solutions architect needs to implement a highly available SFTP solution that minimizes operational overhead. Which solution will meet these requirements?

**Các đáp án**:

- A. Use AWS Transfer Family...
- B. S3 File Gateway...
- C/D. EC2...

**Đáp án đúng**: **A**

**Giải thích chi tiết**:

- **A - ĐÚNG**: **AWS Transfer Family** (AWS Transfer for SFTP).
  - Fully managed SFTP service.
  - Lưu trữ trực tiếp vào S3.
  - Highly Available, Elastic. Không cần quản lý server.

---

## Câu 189

**Đề bài**:  A company needs to store contract documents. A contract lasts for 5 years. During the 5-year period, the company must ensure that the documents cannot be overwritten or deleted. The company needs to encrypt the documents at rest and rotate the encryption keys automatically every year. Which combination of steps should a solutions architect take to meet these requirements with the LEAST operational overhead? (Choose two.)

**Các đáp án**:

- A. S3 Object Lock Governance...
- B. Store the documents in Amazon S3. Use S3 Object Lock in compliance mode.
- C. SSE-S3...
- D. Use server-side encryption with AWS KMS customer managed keys. Configure key rotation.
- E. SSE-KMS Imported keys.

**Đáp án đúng**: **B, D**

**Giải thích chi tiết**:

- **B - ĐÚNG**: **Compliance Mode** đảm bảo không ai xóa được file trong 5 năm.
- **D - ĐÚNG**: **SSE-KMS Customer Managed Key** (CMK).
  - Chỉ CMK mới hỗ trợ tính năng **Automatic Key Rotation** (thời hạn 1 năm - "every year" khớp với đề bài).
  - SSE-S3 Rotation do AWS quản lý, user không "Configure" được.
  - Imported Keys (E) không hỗ trợ Automatic Rotation (phải rotate thủ công).

---

## Câu 190

**Đề bài**:  A company has a web application that is based on Java and PHP. The company plans to move the application from on premises to AWS. The company needs the ability to test new site features frequently. The company also needs a highly available and managed solution that requires minimum operational overhead. Which solution will meet these requirements?

**Các đáp án**:

- A. S3 Static Hosting... (Không chạy được PHP/Java).
- B. Deploy the web application to an AWS Elastic Beanstalk environment. Use URL swapping to switch between multiple Elastic Beanstalk environments for feature testing.
- C. EC2 + ASG + ALB...
- D. Containerize...

**Đáp án đúng**: **B**

**Giải thích chi tiết**:

- **B - ĐÚNG**: **Elastic Beanstalk**.
  - PaaS (Platform as a Service) hỗ trợ Java/PHP. Managed environment.
  - Tính năng **CNAME Swap** (URL Swapping) cho phép deploy version mới lên môi trường mới (Green), test xong swap URL với Production (Blue) -> Zero downtime deployment/testing.

---

## Câu 191

**Đề bài**:  A company has an ordering application that stores customer information in Amazon RDS for MySQL. During regular business hours, employees run one-time queries for reporting purposes. Timeouts are occurring during order processing because the reporting queries are taking a long time to run. The company needs to eliminate the timeouts without preventing employees from performing queries. What should a solutions architect do to meet these requirements?

**Các đáp án**:

- A. Create a read replica. Move reporting queries to the read replica.
- B. Read replica... Distribute ordering app...
- C. DynamoDB...
- D. Schedule non-peak (Prevent queries during day).

**Đáp án đúng**: **A**

**Giải thích chi tiết**:

- **A - ĐÚNG**: Tách biệt workload. **Read Replica** dùng để phục vụ Reporting (Read-only/Heavy queries). Primary Instance dành riêng cho Ordering App (Write/OLTP). Không còn resource contention.

---

## Câu 192

**Đề bài**:  A hospital wants to create digital copies for its large collection of historical written records. The hospital will continue to add hundreds of new documents each day. The hospital’s data team will scan the documents and will upload the documents to the AWS Cloud. A solutions architect must implement a solution to analyze the documents, extract the medical information, and store the documents so that an application can run SQL queries on the data. The solution must maximize scalability and operational efficiency. Which combination of steps should the solutions architect take to meet these requirements? (Choose two.)

**Các đáp án**:

- A. MySQL...
- B. Write to S3. Use Amazon Athena to query the data.
- C. EC2...
- D. Rekognition... Transcribe Medical...
- E. Create an AWS Lambda function that runs when new documents are uploaded. Use Amazon Textract to convert the documents to raw text. Use Amazon Comprehend Medical to detect and extract relevant medical information from the text.

**Đáp án đúng**: **B, E**

**Giải thích chi tiết**:

- **E - ĐÚNG**: Xử lý AI/ML cho y tế. **Textract** (OCR văn bản từ ảnh scan) + **Comprehend Medical** (Hiểu ngữ cảnh y khoa, thuốc, bệnh lý). Serverless pipeline trigger bằng Lambda.
- **B - ĐÚNG**: Lưu kết quả (JSON/Parquet) vào S3 và dùng **Athena** Query.

---

## Câu 193

**Đề bài**:  A company is running a batch application on Amazon EC2 instances. The application consists of a backend with multiple Amazon RDS databases. The application is causing a high number of reads on the databases. A solutions architect must reduce the number of database reads while ensuring high availability. What should the solutions architect do to meet this requirement?

**Các đáp án**:

- A. Add Amazon RDS read replicas.
- B. ElastiCache Redis.
- C. Route 53 caching.
- D. ElastiCache Memcached.

**Đáp án đúng**: **A**

**Giải thích chi tiết**:

- **A - ĐÚNG**: **Read Replicas**. Batch jobs thường quét lượng data lớn. Read Replica giúp scale out read capacity cho RDS. (Có thể dùng ElastiCache, nhưng Read Replica là native scaling của DB, và HA thì Multi-AZ lo, Read Replica có thể promote thành Standalone nếu cần). Trong các bài thi AWS, "High number of reads on database" -> First choice là Read Replica.

---

## Câu 194

**Đề bài**:  A company needs to run a critical application on AWS. The company needs to use Amazon EC2 for the application’s database. The database must be highly available and must fail over automatically if a disruptive event occurs. Which solution will meet these requirements?

**Các đáp án**:

- A. Launch two EC2 instances, each in a different Availability Zone in the same AWS Region. Install the database on both EC2 instances. Configure the EC2 instances as a cluster. Set up database replication.
- B. CloudFormation...
- C. Multi-Region...
- D. EC2 auto recovery...

**Đáp án đúng**: **A**

**Giải thích chi tiết**:

- **A - ĐÚNG**: Đây là mô hình **Active-Passive Cluster** (hoặc Active-Active) tự dựng trên EC2. Cần 2 node ở 2 AZ, config Database Replication (ví dụ SQL AlwaysOn AG, Oracle Data Guard) và Clustering Software (Pacemaker/Corosync or Enterprise features) để handle Auto Failover.

---

## Câu 195

**Đề bài**:  A company’s order system sends requests from clients to Amazon EC2 instances. The EC2 instances process the orders and then store the orders in a database on Amazon RDS. Users report that they must reprocess orders when the system fails. The company wants a resilient solution that can process orders automatically if a system outage occurs. What should a solutions architect do to meet these requirements?

**Các đáp án**:

- A. EventBridge...
- B. ALB...
- C. Move the EC2 instances into an Auto Scaling group. Configure the order system to send messages to an Amazon Simple Queue Service (Amazon SQS) queue. Configure the EC2 instances to consume messages from the queue.
- D. SNS...

**Đáp án đúng**: **C**

**Giải thích chi tiết**:

- **C - ĐÚNG**: **Decoupling with SQS**.
  - Orders được lưu vào SQS (Persistent Buffer).
  - Nếu EC2 crash (System failure), order message không bị mất (trở lại queue sau visibility timeout).
  - ASG launch EC2 mới, EC2 mới pull message xử lý tiếp. Resilience achieved.

---

## Câu 196

**Đề bài**:  A company runs an application on a large fleet of Amazon EC2 instances. The application reads and writes entries into an Amazon DynamoDB table. The size of the DynamoDB table continuously grows, but the application needs only data from the last 30 days. The company needs a solution that minimizes cost and development effort. Which solution meets these requirements?

**Các đáp án**:

- A. CloudFormation redeploy...
- B. Scripts...
- C. DynamoDB Streams + Lambda...
- D. Extend the application to add an attribute that has a value of the current timestamp plus 30 days... Configure DynamoDB to use the attribute as the TTL attribute.

**Đáp án đúng**: **D**

**Giải thích chi tiết**:

- **D - ĐÚNG**: **DynamoDB Time to Live (TTL)**.
  - Tính năng miễn phí, xóa background.
  - Chỉ cần thêm attribute (ví dụ `ExpiredAt`) và bật TTL setting. Minimize dev effort.

---

## Câu 197

**Đề bài**:  A company has a Microsoft .NET application that runs on an on-premises Windows Server. The application stores data by using an Oracle Database Standard Edition server. The company is planning a migration to AWS and wants to minimize development changes while moving the application. The AWS application environment should be highly available. Which combination of actions should the company take to meet these requirements? (Choose two.)

**Các đáp án**:

- A. Refactor Lambda...
- B. Rehost the application in AWS Elastic Beanstalk with the .NET platform in a Multi-AZ deployment.
- C. Replatform EC2...
- D. DMS to DynamoDB...
- E. Use AWS Database Migration Service (AWS DMS) to migrate from the Oracle database to Oracle on Amazon RDS in a Multi-AZ deployment.

**Đáp án đúng**: **B, E**

**Giải thích chi tiết**:

- **B - ĐÚNG**: Beanstalk support .NET -> Lift & shift code dễ dàng, Managed HA.
- **E - ĐÚNG**: Migrate Oracle -> Oracle (RDS) -> Không phải sửa Schema/SQL code (Min dev changes). DMS hỗ trợ migrate data. RDS Multi-AZ hỗ trợ HA.

---

## Câu 198

**Đề bài**:  A company runs a containerized application on a Kubernetes cluster in an on-premises data center. The company is using a MongoDB database for data storage. The company wants to migrate some of these environments to AWS, but no code changes or deployment method changes are possible at this time. The company needs a solution that minimizes operational overhead. Which solution meets these requirements?

**Các đáp án**:

- A. ECS...
- B. ECS...
- C. EKS with EC2 worker nodes + DynamoDB (DynamoDB not MongoDB compatible).
- D. Use Amazon Elastic Kubernetes Service (Amazon EKS) with AWS Fargate for compute and Amazon DocumentDB (with MongoDB compatibility) for data storage.

**Đáp án đúng**: **D**

**Giải thích chi tiết**:

- **EKS**: Giữ nguyên "Deployment method" (Kubernetes manifests/Helm charts).
- **Fargate**: Min Ops (Serverless Compute for K8s).
- **DocumentDB**: Managed DB tương thích MongoDB 3.6/4.0/5.0 -> No code changes (dùng driver MongoDB cũ).

---

## Câu 199

**Đề bài**:  A telemarketing company is designing its customer call center functionality on AWS. The company needs a solution that provides multiple speaker recognition and generates transcript files. The company wants to query the transcript files to analyze the business patterns. The transcript files must be stored for 7 years for auditing purposes. Which solution will meet these requirements?

**Các đáp án**:

- A. Rekognition...
- B. Use Amazon Transcribe for multiple speaker recognition. Use Amazon Athena for transcript file analysis.
- C. Translate...
- D. Rekognition...

**Đáp án đúng**: **B**

**Giải thích chi tiết**:

- **Amazon Transcribe**: Service Speech-to-Text, có feature **Speaker Identification** (Phân biệt Speaker A, Speaker B...).
- **Amazon Athena**: Query text files (JSON Transcribe output) trên S3.

---

## Câu 200

**Đề bài**:  A company hosts its application on AWS. The company uses Amazon Cognito to manage users. When users log in to the application, the application fetches required data from Amazon DynamoDB by using a REST API that is hosted in Amazon API Gateway. The company wants an AWS managed solution that will control access to the REST API to reduce development efforts. Which solution will meet these requirements with the LEAST operational overhead?

**Các đáp án**:

- A. Lambda authorizer...
- B. API Key...
- C. Email header...
- D. Configure an Amazon Cognito user pool authorizer in API Gateway to allow Amazon Cognito to validate each request.

**Đáp án đúng**: **D**

**Giải thích chi tiết**:

- **D - ĐÚNG**: **Cognito Authorizer**.
  - API Gateway có sẵn type Authorizer này. Chỉ cần chọn User Pool.
  - App gửi ID Token/Access Token trong header. API Gateway tự động xác thực token với Cognito mà không cần viết 1 dòng code logic nào -> "Managed solution", "Control access", "Least overhead".

---
