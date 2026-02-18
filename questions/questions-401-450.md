# AWS Certification Exam Questions 401-450

Tài liệu được biên soạn chi tiết với giải thích bằng tiếng Việt, giúp bạn hiểu sâu về các dịch vụ AWS.

---

## Câu 401

**Đề bài**:  A company wants to use the AWS Cloud to make an existing application highly available and resilient. The current version of the application resides in the company's data center. The application recently experienced data loss after a database server crashed because of an unexpected power outage. The company needs a solution that avoids any single points of failure. The solution must give the application the ability to scale to meet user demand. Which solution will meet these requirements?

**Các đáp án**:

- A. **Deploy App Servers in ASG across Multi-AZ**. **Use RDS Multi-AZ**.
- B. Single AZ (SPOF).
- C. Read Replica promoted manually (Slower failover than Multi-AZ, still good but A is standard for "Avoid SPOF" architecture initially).
- D. Multi-Attach EBS (Complex, niche use case).

**Đáp án đúng**: **A**

**Giải thích chi tiết**:

- **A - ĐÚNG**:
  - **App Layer**: Auto Scaling Group trải dài **Multi-AZ** đảm bảo nếu 1 AZ chết, App vẫn chạy ở AZ kia. Scaling theo demand.
  - **DB Layer**: **RDS Multi-AZ** tự động failover sang Standby instance ở AZ khác nếu Primary chết. Đảm bảo High Availability và Durability (tránh data loss).
  - Đây là kiến trúc HA chuẩn mực trên AWS.

---

## Câu 402

**Đề bài**:  A company needs to ingest and handle large amounts of streaming data that its application generates. The application runs on Amazon EC2 instances and sends data to Amazon Kinesis Data Streams, which is configured with default settings. Every other day, the application consumes the data and writes the data to an Amazon S3 bucket for business intelligence (BI) processing. The company observes that Amazon S3 is not receiving all the data that the application sends to Kinesis Data Streams. What should a solutions architect do to resolve this issue?

**Các đáp án**:

- A. **Update the Kinesis Data Streams default settings by modifying the data retention period**.
- B. KPL (Producer optimization).
- C. Shards (Throughput optimization).
- D. S3 Versioning (Data storage optimization).

**Đáp án đúng**: **A**

**Giải thích chi tiết**:

- **A - ĐÚNG**:
  - **Default Retention Period** của Kinesis Data Streams là **24 giờ**.
  - Consumer chạy "Every other day" (tức là 48 giờ/lần).
  - Dữ liệu cũ hơn 24 giờ sẽ bị Kinesis xóa trước khi Consumer kịp đọc.
  - Cần tăng Retention Period lên (max 365 days) để đảm bảo dữ liệu tồn tại đủ lâu (ví dụ 7 ngày).

---

## Câu 403

**Đề bài**:  A developer has an application that uses an AWS Lambda function to upload files to Amazon S3 and needs the required permissions to perform the task. The developer already has an IAM user with valid IAM credentials required for Amazon S3. What should a solutions architect do to grant the permissions?

**Các đáp án**:

- A. Resource policy (Lambda resource policy controls who can invoke Lambda, not what Lambda can do).
- B. Hardcode credentials (Never).
- C. New User (Management overhead).
- D. **Create an IAM execution role** with the required permissions and **attach the IAM role to the Lambda function**.

**Đáp án đúng**: **D**

**Giải thích chi tiết**:

- **D - ĐÚNG**: **IAM Execution Role**.
  - Đây là cách chuẩn để cấp quyền cho Lambda. Role sẽ được Lambda assume khi chạy. Không cần quản lý Access Key/Secret Key trong code.

---

## Câu 404

**Đề bài**:  A company has deployed a serverless application that invokes an AWS Lambda function when new documents are uploaded to an Amazon S3 bucket. The application uses the Lambda function to process the documents. After a recent marketing campaign, the company noticed that the application did not process many of the documents. What should a solutions architect do to improve the architecture of this application?

**Các đáp án**:

- A. Timeout (Processing time issue? Maybe, but usually concurrency limit is hit first).
- B. Replication...
- C. Load balance (Lambda automatically scales, adding another function doesn't help if concurrency limit of account is hit or downstream issue).
- D. **Create an Amazon SQS queue**. Send requests to queue. **Configure queue as event source for Lambda**.

**Đáp án đúng**: **D**

**Giải thích chi tiết**:

- **D - ĐÚNG**: **Decoupling with SQS**.
  - Khi traffic tăng đột biến (Marketing campaign), số lượng file upload lớn có thể gây trượt event (nếu dùng Direct Trigger S3->Lambda trong trường hợp lỗi/throttle mà không có DLQ).
  - Hoặc quan trọng hơn: SQS giúp **Buffer** requests. Lambda xử lý từ từ theo khả năng (Controlled concurrency). Nếu Lambda fail, message vẫn nằm trong Queue để retry. Đảm bảo "No data loss".
  - Pattern S3 -> EventBridge -> SQS -> Lambda là robust nhất.
  - Với đề bài này, việc đưa SQS vào làm buffer là giải pháp chuẩn để xử lý burst traffic.

---

## Câu 405

**Đề bài**:  A solutions architect is designing the architecture for a software demonstration environment. The environment will run on Amazon EC2 instances in an Auto Scaling group behind an Application Load Balancer (ALB). The system will experience significant increases in traffic during working hours but is not required to operate on weekends. Which combination of actions should the solutions architect take to ensure that the system can scale to meet demand? (Choose two.)

**Các đáp án**:

- A. Scale ALB capacity (ALB scales automatically).
- B. Internet Gateway (Scales automatically).
- C. Multi-Region (Overkill for demo).
- D. **Use a target tracking scaling policy** (Scale based on CPU).
- E. **Use scheduled scaling** to change ASG capacity to zero for weekends.

**Đáp án đúng**: **D, E**

**Giải thích chi tiết**:

- **D - ĐÚNG**: **Target Tracking** giúp hệ thống tự động scale out khi traffic tăng (Working hours) và scale in khi giảm. Đảm bảo performance.
- **E - ĐÚNG**: **Scheduled Scaling**. Tắt hẳn hệ thống (Capacity = 0) vào cuối tuần (theo đề bài "not required to operate on weekends") để tiết kiệm 100% chi phí trong 2 ngày đó.

---

## Câu 406

**Đề bài**:  A solutions architect is designing a two-tiered architecture that includes a public subnet and a database subnet. The web servers in the public subnet must be open to the internet on port 443. The Amazon RDS for MySQL DB instance in the database subnet must be accessible only to the web servers on port 3306. Which combination of steps should the solutions architect take to meet these requirements? (Choose two.)

**Các đáp án**:

- A. Web Subnet NACL Deny outbound... (Complex).
- B. DB SG add rule allow from Public Subnet CIDR (Less secure than SG reference).
- C. **Create SG for Web Servers**. Allow 443 from 0.0.0.0/0.
- D. **Create SG for DB Instance**. Add rule to allow traffic from **Web Servers' Security Group** on port 3306.
- E. Deny all... (Implicit deny exist).

**Đáp án đúng**: **C, D**

**Giải thích chi tiết**:

- **C - ĐÚNG**: Cấu hình SG cho Web mở port HTTPS cho Internet.
- **D - ĐÚNG**: Cấu hình SG cho DB chỉ mở port 3306 cho nguồn là **Security Group ID** của Web Server. Đây là best practice (referencing security groups) thay vì dùng IPRange/CIDR (Option B).

---

## Câu 407

**Đề bài**:  A company is implementing a shared storage solution for a gaming application that is hosted in the AWS Cloud. The company needs the ability to use Lustre clients to access data. The solution must be fully managed. Which solution meets these requirements?

**Các đáp án**:

- A. DataSync (Migration tool).
- B. File Gateway (NFS/SMB).
- C. EFS (NFS).
- D. **Amazon FSx for Lustre**.

**Đáp án đúng**: **D**

**Giải thích chi tiết**:

- **D - ĐÚNG**: **FSx for Lustre**.
  - Fully managed service cung cấp High-performance file system optimized cho compute workloads (Gaming, HPC).
  - Support **Lustre** protocol native.

---

## Câu 408

**Đề bài**:  A company runs an application that receives data from thousands of geographically dispersed remote devices that use UDP. The application processes the data immediately and sends a message back to the device if necessary. No data is stored. The company needs a solution that minimizes latency for the data transmission from the devices. The solution also must provide rapid failover to another AWS Region. Which solution will meet these requirements?

**Các đáp án**:

- A. Route 53 Failover + NLB + Lambda (Lambda doesn't listen on UDP ports behind NLB directly for long running processing usually - wait, Lambda doesn't support UDP triggers from NLB directly traditionally, also caching DNS of Route 53 delays failover).
- B. **AWS Global Accelerator**. NLB endpoints. **ECS Fargate**.
- C. Global Accelerator. ALB (No UDP).
- D. Route 53 (DNS Caching issue -> Failover not "Rapid" enough 10-30s vs GA seconds).

**Đáp án đúng**: **B**

**Giải thích chi tiết**:

- **B - ĐÚNG**: **Global Accelerator (GA)**.
  - **Latency**: Dùng AWS Global Network.
  - **Protocol**: Support UDP (Gaming/IoT).
  - **Rapid Failover**: GA reroute traffic trong vài giây (không phụ thuộc DNS propagation).
  - **Backend**: Update: NLB trỏ tới ECS Fargate (Network Load Balanced Fargate Service) là kiến trúc valid.

---

## Câu 409

**Đề bài**:  A solutions architect must migrate a Windows Internet Information Services (IIS) web application to AWS. The application currently relies on a file share hosted in the user's on-premises network-attached storage (NAS). The solutions architect has proposed migrating the IIS web servers to Amazon EC2 instances in multiple Availability Zones that are connected to the storage solution, and configuring an Elastic Load Balancer attached to the instances. Which replacement to the on-premises file share is MOST resilient and durable?

**Các đáp án**:

- A. RDS (Not file share).
- B. Storage Gateway (Hybrid, not cloud-native replacement).
- C. **Amazon FSx for Windows File Server**.
- D. EFS (Linux focus, Windows via NFS is possible but FSx is Native SMB/Windows integrated).

**Đáp án đúng**: **C**

**Giải thích chi tiết**:

- **C - ĐÚNG**: **FSx for Windows File Server**.
  - Native SMB Shared Storage cho Windows.
  - Support **Multi-AZ** deployment (Resilient & Durable).
  - Tương thích hoàn toàn với IIS Shared Config.

---

## Câu 410

**Đề bài**:  A company is deploying a new application on Amazon EC2 instances. The application writes data to Amazon Elastic Block Store (Amazon EBS) volumes. The company needs to ensure that all data that is written to the EBS volumes is encrypted at rest. Which solution will meet this requirement?

**Các đáp án**:

- A. IAM Role (Encryption is volume property).
- B. Create EBS as encrypted... (Manual).
- C. Tagging...
- D. **Create an AWS KMS key policy**? No.
- E. **Enable Encryption by Default** for the account (Not listed).

Xem lại Option D: "Create a KMS key policy that enforces EBS encryption". Key policy control access to key.
Option A: IAM Role cannot force encryption on disk write.
Option B: "Create the EBS volumes as encrypted volumes".
Nếu tạo volume encrypted ngay từ đầu và attach vào instance -> Data written will be encrypted. Đây là solution trực tiếp.
Tuy nhiên, có một option policy-based automation: **Enable EBS Encryption by Default** region-wide.
Trong 4 đáp án:

- B là hành động cụ thể: Tạo volume thì chọn Encrypt.
- D có vẻ như muốn nói đến IAM Policy/SCP `ec2:Encrypted` condition? Nhưng nó nói "KMS Key Policy". KMS Key Policy không enforce việc tạo EBS phải encrypt. Nó control ai được dùng Key.
  Vậy **B** là đáp án đúng về mặt thao tác căn bản. (Muốn encrypt -> Thì tạo volume encrypted).

**Đáp án đúng**: **B**

---

## Câu 411

**Đề bài**:  A company has a web application with sporadic usage patterns. There is heavy usage at the beginning of each month, moderate usage at the start of each week, and unpredictable usage during the week. The application consists of a web server and a MySQL database server running inside the data center. The company would like to move the application to the AWS Cloud, and needs to select a cost-effective database platform that will not require database modifications. Which solution will meet these requirements?

**Các đáp án**:

- A. DynamoDB (Not MySQL compatible).
- B. RDS MySQL (Provisioned capacity -> Pay for peak/idle -> Not cost-effective for sporadic).
- C. **MySQL-compatible Amazon Aurora Serverless**.
- D. MySQL on EC2 (Overhead).

**Đáp án đúng**: **C**

**Giải thích chi tiết**:

- **C - ĐÚNG**: **Aurora Serverless**.
  - **Serverless**: Tự động scale up/down Capacity Units (ACUs) theo demand. Tự động tắt (Pause) nếu config.
  - Phù hợp hoàn hảo cho "Sporadic/Unpredictable usage". Pay-per-second.
  - **MySQL-compatible**: Không cần sửa code (No database modifications).

---

## Câu 412

**Đề bài**:  An image-hosting company stores its objects in Amazon S3 buckets. The company wants to avoid accidental exposure of the objects in the S3 buckets to the public. All S3 objects in the entire AWS account need to remain private. Which solution will meet these requirements?

**Các đáp án**:

- A. GuardDuty + Lambda (Reactive).
- B. Trusted Advisor (Reactive/Manual).
- C. RAM...
- D. **Use the S3 Block Public Access feature on the account level**. Use AWS Organizations **SCP** to prevent IAM users from changing the setting.

**Đáp án đúng**: **D**

**Giải thích chi tiết**:

- **D - ĐÚNG**:
  - **S3 Block Public Access (Account Level)**: Chặn toàn bộ public access cho mọi bucket trong account (hiện tại và tương lai). Prevent accidental exposure hiệu quả nhất.
  - **SCP**: Đảm bảo admin/users trong account không thể tắt tính năng này (Governance).

---

## Câu 413

**Đề bài**:  An ecommerce company is experiencing an increase in user traffic. The company’s store is deployed on Amazon EC2 instances as a two-tier web application consisting of a web tier and a separate database tier. As traffic increases, the company notices that the architecture is causing significant delays in sending timely marketing and order confirmation email to users. The company wants to reduce the time it spends resolving complex email delivery issues and minimize operational overhead. What should a solutions architect do to meet these requirements?

**Các đáp án**:

- A. Dedicated email EC2 (Old school, manage reputation hard).
- B. **Configure ... send email through Amazon SES**.
- C. SNS (SNS is for notification/pub-sub, not rich email marketing/order confirmation delivery service with high deliverability like SES).
- D. ...

**Đáp án đúng**: **B**

**Giải thích chi tiết**:

- **B - ĐÚNG**: **Amazon SES (Simple Email Service)**.
  - Managed Service chuyên dụng cho gửi email (Transactional & Marketing).
  - Handle deliverability, IP reputation, scale.
  - Giảm tải cho EC2 Web Server (offload email sending). Minimal overhead.

---

## Câu 414

**Đề bài**:  A company has a business system that generates hundreds of reports each day. The business system saves the reports to a network share in CSV format. The company needs to store this data in the AWS Cloud in near-real time for analysis. Which solution will meet these requirements with the LEAST administrative overhead?

**Các đáp án**:

- A. DataSync Scheduled (Scheduled is not near-real time).
- B. **Create an Amazon S3 File Gateway**. Update business system to use new share.
- C. DataSync API (Custom code overhead).
- D. Transfer SFTP (Custom script checks file -> Overhead).

**Đáp án đúng**: **B**

**Giải thích chi tiết**:

- **B - ĐÚNG**: **S3 File Gateway**.
  - Map S3 Bucket thành Network Share (SMB/NFS).
  - App ghi file vào Share -> Gateway tự động upload lên S3 ngay lập tức (Near-real time).
  - Least administrative overhead (Không cần viết script, không cần schedule).

---

## Câu 415

**Đề bài**:  A company is storing petabytes of data in Amazon S3 Standard. The data is stored in multiple S3 buckets and is accessed with varying frequency. The company does not know access patterns for all the data. The company needs to implement a solution for each S3 bucket to optimize the cost of S3 usage. Which solution will meet these requirements with the MOST operational efficiency?

**Các đáp án**:

- A. **S3 Intelligent-Tiering**.
- B. S3 Analytics (Analysis takes time 24-48h, manual move or setup lifecycle per bucket based on analysis -> Operational effort).
- C. Glacier Instant Retrieval (Risky if accessed frequently).
- D. One Zone-IA (Risky durability).

**Đáp án đúng**: **A**

**Giải thích chi tiết**:

- **A - ĐÚNG**: **S3 Intelligent-Tiering**.
  - "Unknown access patterns" -> Intelligent-Tiering là đáp án mặc định.
  - Tự động move data giữa Frequent/Infrequent/Archive tiers dựa trên access thực tế.
  - Operational Efficiency: Set policy 1 lần, tự động optimize từng object. Không cần analyze.

---

## Câu 416

**Đề bài**:  A rapidly growing global ecommerce company is hosting its web application on AWS. The web application includes static content and dynamic content. The website stores online transaction processing (OLTP) data in an Amazon RDS database The website’s users are experiencing slow page loads. Which combination of actions should a solutions architect take to resolve this issue? (Choose two.)

**Các đáp án**:

- A. Redshift (Analytics, not for OLTP speed).
- B. **Set up an Amazon CloudFront distribution**.
- C. Host dynamic content in S3 (S3 cannot host dynamic content).
- D. **Create a read replica for the RDS DB instance**.
- E. Multi-AZ (HA only).

**Đáp án đúng**: **B, D**

**Giải thích chi tiết**:

- **B - ĐÚNG**: **CloudFront**. Cache static content (Images/CSS/JS) tại Edge -> Giảm page load time đáng kể cho user.
- **D - ĐÚNG**: **Read Replica**. Nếu chậm do Database overload (High read traffic), Read Replica giúp offload read, tăng performance cho DB layer.
- Combo CloudFront (Static) + Read Replica (Dynamic/DB) là công thức chuẩn optimize web performance.

---

## Câu 417

**Đề bài**:  A company uses Amazon EC2 instances and AWS Lambda functions to run its application. The company has VPCs with public subnets and private subnets in its AWS account. The EC2 instances run in a private subnet in one of the VPCs. The Lambda functions need direct network access to the EC2 instances for the application to work. The application will run for at least 1 year. The company expects the number of Lambda functions that the application uses to increase during that time. The company wants to maximize its savings on all application resources and to keep network latency between the services low. Which solution will meet these requirements?

**Các đáp án**:

- A. EC2 Instance Savings Plan + Connect Lambda to **Private Subnet**.
- B. ... Connect Lambda to Public Subnet (Lambda in Public Subnet cannot access Private EC2 directly via VPC networking easily without NAT/IGW loopback, and it's insecure).
- C. **Compute Savings Plan** + Connect Lambda to **Private Subnet**.
- D. ... Keep Lambda in Service VPC (Cannot access Private EC2 directly).

**Giải thích**:

- **Savings Plans**:
  - **EC2 Instance Savings Plan**: Chỉ apply cho EC2 (tiết kiệm cao nhất ~72%).
  - **Compute Savings Plan**: Apply cho **EC2, Lambda, Fargate** (tiết kiệm ~66%).
  - Do đề bài yêu cầu "Maximize savings on **ALL application resources**" (bao gồm Lambda usage increases), nên **Compute Savings Plan** là lựa chọn bao quát hơn (cover cả Lambda growth).
- **Networking**:
  - Để Lambda gọi EC2 Private IP trực tiếp -> Lambda phải được cấu hình chạy trong cùng **VPC Private Subnet**.

**Đáp án đúng**: **C**

---

## Câu 418

**Đề bài**:  A solutions architect needs to allow team members to access Amazon S3 buckets in two different AWS accounts: a development account and a production account. The team currently has access to S3 buckets in the development account by using unique IAM users that are assigned to an IAM group that has appropriate permissions in the account. The solutions architect has created an IAM role in the production account. The role has a policy that grants access to an S3 bucket in the production account. Which solution will meet these requirements while complying with the principle of least privilege?

**Các đáp án**:

- A. AdminAccess (Violation of Least Privilege).
- B. **Add the development account as a principal in the trust policy of the role in the production account**.
- C. Block Public Access (Irrelevant).
- D. Create User in Prod (Overhead).

**Đáp án đúng**: **B**

**Giải thích chi tiết**:

- **B - ĐÚNG**: **Cross-Account Role Access**.
  - Để User ở Account A assume Role ở Account B, Trust Policy của Role (ở B) phải allow Principal là Account A (`arn:aws:iam::AccountA-ID:root` hoặc user arn cụ thể).
  - Sau đó Admin Account A cấp quyền `sts:AssumeRole` cho User Dev.
  - Đây là cách chuẩn và secure.

---

## Câu 419

**Đề bài**:  A company uses AWS Organizations with all features enabled and runs multiple Amazon EC2 workloads in the ap-southeast-2 Region. The company has a service control policy (SCP) that prevents any resources from being created in any other Region. A security policy requires the company to encrypt all data at rest. An audit discovers that employees have created Amazon Elastic Block Store (Amazon EBS) volumes for EC2 instances without encrypting the volumes. The company wants any new EC2 instances that any IAM user or root user launches in ap-southeast-2 to use encrypted EBS volumes. The company wants a solution that will have minimal effect on employees who create EBS volumes. Which combination of steps will meet these requirements? (Choose two.)

**Các đáp án**:

- A. ...
- B. Permission Boundary (Complex).
- C. SCP Deny unencrypted (This will cause "Permission Denied" errors for employees who forget to check "Encrypt". Not "Minimal effect").
- D. ...
- E. **In the Organizations management account, specify the Default EBS volume encryption setting**? (Actually, this setting is per Region per Account usually. But maybe AWS Org setting exists? No, usually Account-level).
  Let's check A: **In the EC2 console, select the EBS encryption account attribute and define a default encryption key**. -> This is "Enable Encryption by Default" region-wide.
  Khi bật cái này, employee tạo volume (thậm chí không chọn encrypt), AWS sẽ TỰ ĐỘNG encrypt nó. -> **Minimal effect on employees** (Họ không cần thay đổi workflow, không bị lỗi Deny).
  Tuy nhiên đề bài nói "AWS Organizations". Có cách nào apply cho mọi account?
  Hiện tại, Default Encryption là setting theo Region/Account. Admin phải config trên từng account hoặc dùng automation script.
  Nhưng câu hỏi Choose two.
  A (Enable Default Encryption) là cần thiết cho 1 account.
  Làm sao enforce cho New EC2 instances?
  Nếu dùng SCP (C) -> User bị chặn nếu quên -> Fail requirement "Minimal effect".
  Option nào tự động?
  Thực tế, đề bài AWS thường coi việc setup **A** (Default Encryption) là giải pháp.
  Nhưng nếu phải chọn 2?
  Có thể đề bài muốn kết hợp **IAM Policy/SCP (C/D)** để enforce? Nhưng enforce sẽ gây lỗi.
  Re-read: "Minimal effect on employees **who create EBS volumes**".
  Nếu bật Default Encryption (A), user tạo volume Unencrypted -> Hệ thống tự lái sang Encrypted -> User thành công. Đây là minimal effect.
  Còn ý nào nữa?
  Có thể đề bài muốn nói về việc config IAM policy?
  Nếu chọn A, nó chỉ affect 1 account.
  Nếu chọn C (SCP), nó affect toàn bộ Organization -> Hard enforcement.
  Nếu đề bài ưu tiên "Security violation prevention" hơn là "Convenience", thì SCP là đáp án. Nhưng "Minimal effect" suggests automation (A).
  Tuy nhiên, A là hành động trên Console của 1 account.
  E là hành động trên Org Management Account? (AWS chưa có feature "One click enable EBS encryption for all org").
  Nhưng nếu đề đang nói đến giải pháp cho 1 account cụ thể (Audit discovers employees ... company wants new EC2 ... in ap-southeast-2).
  Có thể đề bài muốn chọn action A (Enable Default) và ...?
  Thực ra, nếu bật **Default Encryption** (A), thì mọi volume mới đều được encrypt.
  Có thể câu trả lời là **A** và **E**? (Giả sử E là cách nói về việc config Policy ở level Org?? No).
  Hay là **C** và **A**? (Vừa enable default để auto, vừa có SCP làm chốt chặn cuối cùng).
  Nhưng A giải quyết vấn đề rồi.
  Có một đáp án thường đi kèm là: **Create a Customer Managed Key (CMK)**?
  Trong list không thấy.
  Review các option:
- A: Enable account attribute (Default Encryption).
- B/C/D: Deny policy (Restrictive).
  Nếu chỉ chọn 2, và muốn "Minimal effect" (User không phải sửa đổi thói quen):
  -> Chỉ có **Enabling Encryption by Default** làm được điều này. User cứ launch bình thường, AWS lo việc encrypt.
  Vấn đề là chọn 2 steps cho việc này?
  Step 1: Create KMS Key (Default key exists).
  Step 2: Enable Attribute.
  Ở đây chỉ có A là Enable Attribute.
  C là SCP.
  Nếu đề buộc chọn 2, có thể là **A** và **C** (Best practice: Enable Auto để user sướng, Enable SCP để chặn user cố tình tắt/hack). Nếu đã bật A thì user tạo unencrypted vẫn thành công (ra encrypted result) nên không bị SCP chặn. Vậy C không gây phiền.

**Đáp án đúng**: **A, C** (Lưu ý: SCP phải viết khéo, nhưng logic là A giúp tuân thủ C một cách tự động).

---

## Câu 420

**Đề bài**:  A company wants to use an Amazon RDS for PostgreSQL DB cluster to simplify time-consuming database administrative tasks for production database workloads. The company wants to ensure that its database is highly available and will provide automatic failover support in most scenarios in less than 40 seconds. The company wants to offload reads off of the primary instance and keep costs as low as possible. Which solution will meet these requirements?

**Các đáp án**:

- A. RDS Multi-AZ Instance + Read Replica (Failover thường 60-120s DNS propagation. Multi-AZ Instance Standby cannot serve reads. Read Replica is Async).
- B. ...
- C. ...
- D. **Use an Amazon RDS Multi-AZ DB cluster deployment**. Point read workload to reader endpoint.

**Đáp án đúng**: **D**

**Giải thích chi tiết**:

- **D - ĐÚNG**: **RDS Multi-AZ DB Cluster** (New feature).
  - Khác với Multi-AZ DB Instance (1 Primary + 1 Standby), Cluster gồm **1 Writer + 2 Readable Standbys**.
  - **Failover siêu nhanh**: Thường < 35s (vì Standby đã mount volume và running page cache, không cần crash recovery full).
  - **Offload reads**: Standby nodes có thể phục vụ Read traffic (Reader endpoint).
  - Cost-effective hơn việc chạy Multi-AZ Instance + Separate Read Replica (về mặt management và license đôi khi).

---

## Câu 421

**Đề bài**:  A company runs a highly available SFTP service. The SFTP service uses two Amazon EC2 Linux instances that run with elastic IP addresses to accept traffic from trusted IP sources on the internet. The SFTP service is backed by shared storage that is attached to the instances. User accounts are created and managed as Linux users in the SFTP servers. The company wants a serverless option that provides high IOPS performance and highly configurable security. The company also wants to maintain control over user permissions. Which solution will meet these requirements?

**Các đáp án**:

- A. EBS (Not serverless SFTP storage native).
- B. **EFS** + **AWS Transfer Family**.
- C. S3 + Transfer Family (S3 IOPS limit per prefix might be concern? No, usually S3 is scalable. But "High IOPS performance" often hints Block/File storage).
- D. ...

**So sánh B (EFS) và C (S3)**:

- AWS Transfer Family support cả S3 và EFS.
- **S3**: Object storage. Permission qua IAM/S3 Policy.
- **EFS**: File storage (High IOPS mode available). Support **POSIX permissions** (chown/chmod) -> "Maintain control over user permissions" (Linux style users as requested "Linux users in old SFTP").
- context: "User accounts are created and managed as Linux users". EFS giữ được owners/groups permission model tốt hơn S3 (flat).
- **High IOPS**: EFS Max I/O mode performance rất cao.

**Đáp án đúng**: **B**

---

## Câu 422

**Đề bài**:  A company is developing a new machine learning (ML) model solution on AWS. The models are developed as independent microservices that fetch approximately 1 GB of model data from Amazon S3 at startup and load the data into memory. Users access the models through an asynchronous API. Users can send a request or a batch of requests and specify where the results should be sent. The company provides models to hundreds of users. The usage patterns for the models are irregular. Some models could be unused for days or weeks. Other models could receive batches of thousands of requests at a time. Which design should a solutions architect recommend to meet these requirements?

**Các đáp án**:

- A. NLB + Lambda (1GB startup load is heavy/slow for Lambda cold start. Lambda max memory limits ok, but startup time/cost bad).
- B. ... ECS ... App Mesh ... SQS size (App Mesh complex).
- C. SQS -> Lambda (Cold start issue again).
- D. **SQS** -> **ECS (EC2/Fargate)** + **Auto Scaling** based on Queue Size.

**Giải thích**:

- Với Model nặng (1GB startup), Lambda không tối ưu (mỗi lần invoke cold start tốn thời gian load model, tốn tiền chờ).
- Cần **Long-running Service** (ECS).
- Scale dựa trên **SQS Queue Depth** (ApproximateNumberOfMessagesVisible).
- Khi có request (Thousands), ECS scale out. Khi idle (Weeks), scale in to 0 (Fargate) hoặc min 1.
- **Option D** mô tả kiến trúc Worker Pattern standard cho Async processing resource-heavy tasks.

**Đáp án đúng**: **D**

---

## Câu 423

**Đề bài**:  A solutions architect wants to use the following JSON text as an identity-based policy to grant specific permissions: Which IAM principals can the solutions architect attach this policy to? (Choose two.)

**Các đáp án**:

- A. **Role**.
- B. **Group**.
- C. Organization (No).
- D. ECS Resource (Resource Policies are different).
- E. EC2 Resource (No).

**Giải thích**:

- Identity-based policies có thể attach vào: **Users**, **Groups** (Option B), và **Roles** (Option A).

**Đáp án đúng**: **A, B**

---

## Câu 424

**Đề bài**:  A company is running a custom application on Amazon EC2 On-Demand Instances. The application has frontend nodes that need to run 24 hours a day, 7 days a week and backend nodes that need to run only for a short time based on workload. The number of backend nodes varies during the day. The company needs to scale out and scale in more instances based on workload. Which solution will meet these requirements MOST cost-effectively?

**Các đáp án**:

- A. RI (Frontend) + Fargate (Backend? App is on EC2 custom. Moving to Fargate might be change. Also Fargate usually more expensive than Spot).
- B. **RI (Frontend)** + **Spot Instances (Backend)**.
- C. Spot (Frontend - risky for 24/7 fixed).
- D. ...

**Đáp án đúng**: **B**

**Giải thích chi tiết**:

- **B - ĐÚNG**:
  - **Frontend (24/7)**: Predictable -> **Reserved Instances** (tiết kiệm ~40-72%).
  - **Backend (Short time, variable)**: Flexible -> **Spot Instances** (tiết kiệm tới 90%). Phù hợp workload ngắn, chịu được interruption (hoặc dùng Spot Fleet mixed).

---

## Câu 425

**Đề bài**:  A company uses high block storage capacity to runs its workloads on premises. The company's daily peak input and output transactions per second are not more than 15,000 IOPS. The company wants to migrate the workloads to Amazon EC2 and to provision disk performance independent of storage capacity. Which Amazon Elastic Block Store (Amazon EBS) volume type will meet these requirements MOST cost-effectively?

**Các đáp án**:

- A. gp2 (Performance linked to capacity. 3 IOPS/GB).
- B. io2 (Expensive).
- C. **gp3 volume type**.
- D. io1 (Expensive).

**Đáp án đúng**: **C**

**Giải thích chi tiết**:

- **C - ĐÚNG**: **gp3**.
  - Feature chính: **Decouple** IOPS/Throughput khỏi Storage Capacity. (Provision performance independent).
  - Baseline 3,000 IOPS. Có thể mua thêm lên tới 16,000 IOPS (đủ cover 15,000 IOPS của đề bài).
  - Rẻ hơn io1/io2 rất nhiều (General Purpose vs Provisioned IOPS).

---

## Câu 426

**Đề bài**:  A company needs to store data from its healthcare application. The application’s data frequently changes. A new regulation requires audit access at all levels of the stored data. The company hosts the application on an on-premises infrastructure that is running out of storage capacity. A solutions architect must securely migrate the existing data to AWS while satisfying the new regulation. Which solution will meet these requirements?

**Các đáp án**:

- A. DataSync... (Migration only).
- B. Snowcone... (Migration only).
- C. Transfer Acceleration...
- D. **Use AWS Storage Gateway** to move existing data... CloudTrail log...

**Phân tích**:

- Vấn đề chính: "Running out of storage capacity" on-prem VÀ cần "Migrate existing data to AWS" (nhưng có thể giữ hybrid access?).
- Nếu dùng **Storage Gateway (File Gateway)**:
  - Mở rộng capacity on-prem bằng S3 (Unlimited).
  - Move data lên Cloud.
  - CloudTrail log management events.
- Tuy nhiên câu hỏi "Securely migrate existing data" - DataSync (A) là tool chuyên dụng migrate.
- Nhưng yêu cầu "Audit access at all levels of stored data".
- S3 Object Level Logging (Data Events) đáp ứng audit.
- Câu hỏi có vẻ chọn giải pháp nào vừa migrate vừa đáp ứng Compliance?
- **Option D**: Storage Gateway giúp giải quyết bài toán "Space constrained on-prem" immediately (Cache local, data tiering to S3).
- DataSync (A) chỉ move data 1 lần (hoặc schedule). Nếu App vẫn chạy on-prem và sinh data mới "frequently changes", DataSync phải sync liên tục?
- Storage Gateway mount trực tiếp vào App Server on-prem -> App ghi data vào Gateway -> Đẩy lên S3. Giải quyết vấn đề hết chỗ ngay lập tức và migrate dần.

**Đáp án đúng**: **D**

---

## Câu 427

**Đề bài**:  A solutions architect is implementing a complex Java application with a MySQL database. The Java application must be deployed on Apache Tomcat and must be highly available. What should the solutions architect do to meet these requirements?

**Các đáp án**:

- A. Lambda (Not Tomcat container directly without effort).
- B. **AWS Elastic Beanstalk**.
- C. ElastiCache...
- D. EC2 + AMI + ASG + Launch Template (Manual setup).

**Đáp án đúng**: **B**

**Giải thích chi tiết**:

- **B - ĐÚNG**: **Elastic Beanstalk**.
  - Platform-as-a-Service (PaaS) hỗ trợ **Java/Tomcat** native.
  - Tự động setup Load Balancer, Auto Scaling (Highly Available), Health Check.
  - Đơn giản hơn tự build EC2/ASG (Option D).

---

## Câu 428

**Đề bài**:  A serverless application uses Amazon API Gateway, AWS Lambda, and Amazon DynamoDB. The Lambda function needs permissions to read and write to the DynamoDB table. Which solution will give the Lambda function access to the DynamoDB table MOST securely?

**Các đáp án**:

- A. IAM User + Keys in Env Vars (Insecure).
- B. **IAM Role** attached to Lambda.
- C. IAM User + Parameter Store (Still managing Long-term keys -> Less secure than Roles).
- D. IAM Role... Update code... (Role attached via Config, not inside Code).

**Đáp án đúng**: **B**

**Giải thích chi tiết**:

- **B - ĐÚNG**: **IAM Execution Role**.
  - Cấp quyền cho Lambda qua Role. AWS tự động rotate temporary creds. Không hardcode keys.

---

## Câu 429

**Đề bài**:  The following IAM policy is attached to an IAM group. This is the only policy applied to the group. What are the effective IAM permissions of this policy for group members?

**Các đáp án**:

- A. EC2 Spot (Compute - not asked for storage lifecycle).
- B. **Lambda function** converts CSV to images. (Serverless compute, event-driven upload, cheapest for sporadic sensor uploads).
- C. ...
- D. ...
- E. **S3 Lifecycle rules**. Transition **CSV to S3 Standard-IA** (after 1 day). Expire **Images after 30 days**. (Option E says RRS? RRS is deprecated. Option D says One Zone-IA? Option C says Glacier.
- Re-evaluate Storage:
  - CSV kept for "ML training twice a year". Access frequency: Very Low. Can wait retrieval? "Planned weeks in advance". -> **Glacier** (Option C) or **Glacier Deep Archive** is best.
  - Images: "Irrelevant after 1 month" -> **Expire** after 30 days.
  - **Option C**: CSV -> Glacier after 1 day. Images -> Expire 30 days.
  - This fits perfectly. (CSV to Glacier immediately saves most cost. Retrieval time is acceptable).

**Đáp án đúng**: **B, C**

---

## Câu 431

**Đề bài**:  A company has developed a new video game as a web application. The application is in a three-tier architecture in a VPC with Amazon RDS for MySQL in the database layer. Several players will compete concurrently online. The game’s developers want to display a top-10 scoreboard in nearreal time and offer the ability to stop and restore the game while preserving the current scores. What should a solutions architect do to meet these requirements?

**Các đáp án**:

- A. Memcached (Simple cache, not sorted).
- B. **ElastiCache for Redis** (Sorted Sets).
- C. CloudFront (Static caching, can't compute top 10).
- D. Read Replica (SQL query for top 10 is slow at scale).

**Đáp án đúng**: **B**

**Giải thích chi tiết**:

- **B - ĐÚNG**: **Redis Sorted Sets (ZSET)**.
  - Data structure chuyên dụng để làm **Leaderboard/Scoreboard**.
  - Update score và lấy Top 10 với độ phức tạp O(logN) -> Near real-time.
  - Redis có persistence (Restore game state).

---

## Câu 432

**Đề bài**:  An ecommerce company wants to use machine learning (ML) algorithms to build and train models. The company will use the models to visualize complex scenarios and to detect trends in customer data. The architecture team wants to integrate its ML models with a reporting platform to analyze the augmented data and use the data directly in its business intelligence dashboards. Which solution will meet these requirements with the LEAST operational overhead?

**Các đáp án**:

- A. Glue + OpenSearch...
- B. SageMaker + QuickSight...
- C. ...
- D. **Amazon QuickSight** with **ML Insights** (Calculated fields / Autograph).
  Wait, "Use ML algorithms to build and train models... integrate...".
  Option B: SageMaker (Build/Train) + QuickSight (Visualize). QuickSight có integration trực tiếp với SageMaker models để visualize inference results.
  Option D: QuickSight ML Insights (Anomaly detection, forecasting) là built-in, nhưng nếu company muốn "build and train **custom** models" (complex scenarios) thì SageMaker mạnh hơn.
  Tuy nhiên, câu hỏi "integrate its ML models... analyze augmented data... in BI".
  QuickSight có tính năng **ML-powered analysis** (Using SageMaker models).
  Câu D nói "Use QuickSight to build and train...". QuickSight không dùng để build complex ML models từ scratch (ngoài mấy cái built-in).
  Câu B mô tả workflow chuẩn: Build ở SageMaker, Visualize ở QuickSight.

**Đáp án đúng**: **B**

---

## Câu 433

**Đề bài**:  A company is running its production and nonproduction environment workloads in multiple AWS accounts. The accounts are in an organization in AWS Organizations. The company needs to design a solution that will prevent the modification of cost usage tags. Which solution will meet these requirements?

**Các đáp án**:

- A. Config Rule (Detective).
- B. CloudTrail (Logging).
- C. **Service Control Policy (SCP)**.
- D. CloudWatch...

**Đáp án đúng**: **C**

**Giải thích chi tiết**:

- **C - ĐÚNG**: **SCP**.
  - Policy cấp Organization. Deny action `tag:UntagResources`, `tag:TagResources` đối với các "Cost Usage Tags" specific.
  - Prevent modification hiệu quả trên mọi accounts.

---

## Câu 434

**Đề bài**:  A company hosts its application in the AWS Cloud. The application runs on Amazon EC2 instances behind an Elastic Load Balancer in an Auto Scaling group and with an Amazon DynamoDB table. The company wants to ensure the application can be made available in anotherAWS Region with minimal downtime. What should a solutions architect do to meet these requirements with the LEAST amount of downtime?

**Các đáp án**:

- A. **Global Table** + **DNS Failover**.
- B. CloudFormation (Launch when needed -> Slow RTO).
- C. ...
- D. ...

**Đáp án đúng**: **A**

**Giải thích chi tiết**:

- **A - ĐÚNG**: **Active-Active (or Warm Standby) Strategy**.
  - **DynamoDB Global Table**: Replicate data đa vùng active-active (RPO ~0).
  - **ASG/LB in DR Region**: Sẵn sàng nhận traffic.
  - **DNS Failover (Route 53)**: Chỉ cần switch routing -> Downtime gần như bằng 0 (chỉ phụ thuộc DNS TTL).

---

## Câu 435

**Đề bài**:  A company needs to migrate a MySQL database from its on-premises data center to AWS within 2 weeks. The database is 20 TB in size. The company wants to complete the migration with minimal downtime. Which solution will migrate the database MOST cost-effectively?

**Các đáp án**:

- A. **Snowball Edge Storage Optimized** + **DMS/SCT**.
- B. Snowmobile (Too big, >10PB).
- C. Snowball Edge Compute (GPU not needed).
- D. Direct Connect 1GB (Expensive setup, lead time > 2 weeks likely).

**Đáp án đúng**: **A**

**Giải thích chi tiết**:

- **A - ĐÚNG**:
  - **Snowball**: Transfer 20TB bulk data nhanh chóng (vài ngày shipping).
  - **DMS**: Sync "Ongoing changes" (CDC) trong quá trình ship Snowball để bắt kịp data mới. Đảm bảo "Minimal downtime" khi cutover.
  - Cost-effective hơn Direct Connect ngắn hạn.

---

## Câu 436

**Đề bài**:  A company moved its on-premises PostgreSQL database to an Amazon RDS for PostgreSQL DB instance. The company successfully launched a new product. The workload on the database has increased. The company wants to accommodate the larger workload without adding infrastructure. Which solution will meet these requirements MOST cost-effectively?

**Các đáp án**:

- A. Buy Reserved DB Instances? (Doesn't solve capacity/performance issue, only cost). Make instance larger? (Vertical scaling adds infrastructure cost?).
- B. Multi-AZ (HA only).
- C. ...
- D. ... Make instance On-Demand (More expensive).

**Phân tích**:

- "Without adding infrastructure" có thể hiểu là không thêm Server mới (như Read Replica).
- Cách duy nhất tăng performance trên 1 node là **Scale Up (Vertical Scaling)** -> Change Instance Type (lớn hơn).
- Cost-effective: Combine **Scale Up** + **Reserved Instance** (để giảm giá cho instance lớn đó).
- Option A: "Buy reserved... Make RDS instance larger". Hợp lý.

**Đáp án đúng**: **A**

---

## Câu 437

**Đề bài**:  A company operates an ecommerce website on Amazon EC2 instances behind an Application Load Balancer (ALB) in an Auto Scaling group. The site is experiencing performance issues related to a high request rate from illegitimate external systems with changing IP addresses. The security team is worried about potential DDoS attacks against the website. The company must block the illegitimate incoming requests in a way that has a minimal impact on legitimate users. What should a solutions architect recommend?

**Các đáp án**:

- A. Inspector (Vuln scan).
- B. **AWS WAF** with **rate-limiting rule**.
- C. NACL (Cannot block changing IPs effectively, limit rules).
- D. GuardDuty (Detection only).

**Đáp án đúng**: **B**

**Giải thích chi tiết**:

- **B - ĐÚNG**: **WAF Rate-based Rule**.
  - Tự động track request rate từ từng Source IP.
  - Nếu 1 IP nào đó gửi quá nhiều request (DDoS behavior) -> Block IP đó tạm thời.
  - Vì IP thay đổi liên tục, rule rate-limit động này hiệu quả hơn static blacklist. Legitimate users (rate thấp) không bị ảnh hưởng.

---

## Câu 438

**Đề bài**:  A company wants to share accounting data with an external auditor. The data is stored in an Amazon RDS DB instance that resides in a private subnet. The auditor has its own AWS account and requires its own copy of the database. What is the MOST secure way for the company to share the database with the auditor?

**Các đáp án**:

- A. Read Replica (Cross-account RR possible but complex networking/VPC peering needed for direct access).
- B. Export to text files (Ops heavy).
- C. ...
- D. **Create an encrypted snapshot**. **Share** snapshot with auditor. Allow access to **KMS key**.

**Đáp án đúng**: **D**

**Giải thích chi tiết**:

- **D - ĐÚNG**: Shared Encrypted Snapshot.
  - Secure: Data encrypted at rest.
  - Isolated: Auditor restore snapshot ra DB riêng của họ để audit, không đụng vào Prod DB.
  - Quy trình: Share Snapshot + Share KMS Key Policy.

---

## Câu 439

**Đề bài**:  A solutions architect configured a VPC that has a small range of IP addresses. The number of Amazon EC2 instances that are in the VPC is increasing, and there is an insufficient number of IP addresses for future workloads. Which solution resolves this issue with the LEAST operational overhead?

**Các đáp án**:

- A. **Add an additional IPv4 CIDR block** to the VPC. Create new subnets.
- B. Second VPC + Peering (Complex management).
- C. Transit Gateway...
- D. VPN...

**Đáp án đúng**: **A**

**Giải thích chi tiết**:

- **A - ĐÚNG**: AWS VPC cho phép add thêm **Secondary CIDR Block** (ví dụ VPC tạo ban đầu /24 bé quá, giờ add thêm 1 dải /16 nữa). Đơn giản, không cần migrate resources hay setup peering.

---

## Câu 440

**Đề bài**:  A company used an Amazon RDS for MySQL DB instance during application testing. Before terminating the DB instance at the end of the test cycle, a solutions architect created two backups. The solutions architect created the first backup by using the mysqldump utility to create a database dump. The solutions architect created the second backup by enabling the final DB snapshot option on RDS termination. The company is now planning for a new test cycle and wants to create a new DB instance from the most recent backup. The company has chosen a MySQL-compatible edition ofAmazon Aurora to host the DB instance. Which solutions will create the new DB instance? (Choose two.)

**Các đáp án**:

- A. Import RDS snapshot directly (Not supported cross-engine directly via Console easily? Wait. Aurora MySQL IS compatible. Usually "Migrate Snapshot" option exists).
- B. **Upload RDS snapshot to S3**... (Export to S3 is Parquet usually, not restore-able to Aurora directly as instance).
- C. **Upload database dump to S3**. Import database dump into Aurora (using `source` command or `LOAD DATA FROM S3`). Valid.
- D. **Use AWS DMS** to import RDS snapshot?? (DMS keeps data sync, doesn't import snapshot file).
- E. Upload dump to S3. Use DMS?

**Correction**:

- Aurora cho phép **Create Aurora Read Replica from RDS MySQL** rồi promote.
- Aurora cho phép **Restore from RDS MySQL Snapshot** (Console option "Migrate Snapshot"). -> Option A valid? "Import" word used.
- Option C: `mysqldump` -> S3 -> Aurora Import (Load Data). Valid manual path.
- Tuy nhiên, cách hay dùng để migrate snapshot RDS MySQL sang Aurora:
  - **Option A**: Console support "Migrate Snapshot" -> Tạo Aurora Cluster từ RDS Snapshot.
  - Còn cách dùng `mysqldump` (Backup 1): Restore dump vào Aurora manually (Option C).

**Đáp án đúng**: **A, C** (Hai cách sử dụng 2 loại backup đang có).

---

## Câu 441

**Đề bài**:  A company hosts a multi-tier web application on Amazon Linux Amazon EC2 instances behind an Application Load Balancer. The instances run in an Auto Scaling group across multiple Availability Zones. The company observes that the Auto Scaling group launches more On-Demand Instances when the application's end users access high volumes of static web content. The company wants to optimize cost. What should a solutions architect do to redesign the application MOST cost-effectively?

**Các đáp án**:

- A. Reserved Instances (Commitment).
- B. Spot (Risky).
- C. **Create Amazon CloudFront distribution** to host static contents from **S3**.
- D. ...

**Đáp án đúng**: **C**

**Giải thích chi tiết**:

- **C - ĐÚNG**: **Offload to CloudFront + S3**.
  - Static content (Images/CSS) chiếm băng thông và CPU của EC2.
  - Chuyển sang S3 + CloudFront rẻ hơn nhiều và giảm load cho EC2 -> ASG không cần scale out -> **Most cost-effective**.

---

## Câu 442

**Đề bài**:  A company stores several petabytes of data across multiple AWS accounts. The company uses AWS Lake Formation to manage its data lake. The company's data science team wants to securely share selective data from its accounts with the company's engineering team for analytical purposes. Which solution will meet these requirements with the LEAST operational overhead?

**Các đáp án**:

- A. Copy data (Duplication, high overhead).
- B. Use Lake Formation permissions Grant command... (Need LF peering setup).
- C. ...
- D. **Use Lake Formation tag-based access control (TBAC)** to authorize and grant cross-account permissions.

**Đáp án đúng**: **D**

**Giải thích chi tiết**:

- **D - ĐÚNG**: **TBAC (Tag-based Access Control)**.
  - Gán LF Tags cho Database/Table/Column.
  - Cấp quyền cho Engineering Account dựa trên Tag (ví dụ: `Department=Engineering`).
  - Khi có data mới gán tag đó, quyền tự động apply.
  - Cross-account sharing qua LF Tags rất efficient.

---

## Câu 443

**Đề bài**:  A company wants to host a scalable web application on AWS. The application will be accessed by users from different geographic regions of the world. Application users will be able to download and upload unique data up to gigabytes in size. The development team wants a cost-effective solution to minimize upload and download latency and maximize performance. What should a solutions architect do to accomplish this?

**Các đáp án**:

- A. **S3 Transfer Acceleration**.
- B. CacheControl (Browser caching, doesn't speed up upload).
- C. CloudFront (Good for download, but S3 TA is improved for long distance Upload to S3 bucket directly). CloudFront also supports upload but S3 TA is specifically for "S3 bucket access acceleration".
- D. ...

**Đáp án đúng**: **A**

**Giải thích chi tiết**:

- **A - ĐÚNG**: **S3 Transfer Acceleration**.
  - Dùng mạng Edge Network của AWS để route traffic upload/download về S3 Bucket nhanh nhất (tăng tốc 50-500% cho long distance).
  - Phù hợp file lớn (Gigabytes).

---

## Câu 444

**Đề bài**:  A company has hired a solutions architect to design a reliable architecture for its application. The application consists of one Amazon RDS DB instance and two manually provisioned Amazon EC2 instances that run web servers. The EC2 instances are located in a single Availability Zone. An employee recently deleted the DB instance, and the application was unavailable for 24 hours as a result. The company is concerned with the overall reliability of its environment. What should the solutions architect do to maximize reliability of the application's infrastructure?

**Các đáp án**:

- A. ...
- B. **Update DB to Multi-AZ**, enable deletion protection. **Place EC2 behind ALB** and run in **ASG across multiple AZs**.
- C. ...
- D. Spot Instances (Reliability risk?).

**Đáp án đúng**: **B**

**Giải thích chi tiết**:

- **B - ĐÚNG**: Transform Single AZ static architecture thành **Multi-AZ**, **Auto Scaling**, **Load Balanced** architecture. Bật **Deletion Protection** cho DB để tránh accidental delete. Maximize reliability.

---

## Câu 445

**Đề bài**:  A company is storing 700 terabytes of data on a large network-attached storage (NAS) system in its corporate data center. The company has a hybrid environment with a 10 Gbps AWS Direct Connect connection. After an audit from a regulator, the company has 90 days to move the data to the cloud. The company needs to move the data efficiently and without disruption. The company still needs to be able to access and update the data during the transfer window. Which solution will meet these requirements?

**Các đáp án**:

- A. **AWS DataSync**.
- B. Snowball (Offline -> Cannot access/update live data easily during weeks of shipping).
- C. Rsync (Slow, single thread).
- D. Tapes...

**Đáp án đúng**: **A**

**Giải thích chi tiết**:

- **A - ĐÚNG**: **AWS DataSync**.
  - Online transfer qua DX 10Gbps.
  - 700TB qua 10Gbps: ~8-10 ngày full speed. Kịp deadline 90 ngày thoải mái.
  - **Keep systems live**: DataSync chạy background, sync changes (incremental). Không gây disruption.

---

## Câu 446

**Đề bài**:  A company stores data in PDF format in an Amazon S3 bucket. The company must follow a legal requirement to retain all new and existing data in Amazon S3 for 7 years. Which solution will meet these requirements with the LEAST operational overhead?

**Các đáp án**:

- A. Versioning + Lifecycle (Delete capable by user? Not immutable).
- B. Governance mode (User with specific extension can delete).
- C. **S3 Object Lock with COMPLIANCE retention mode**. Set retention 7 years.
- D. ...

**Đáp án đúng**: **C** (Hoặc D nếu cần xử lý existing objects).
Đề nói "retain all new and **existing** data".

- Nếu bật Object Lock trên bucket mới -> Easy.
- Với bucket CÓ SẴN (Existing data), S3 Object Lock trước đây yêu cầu support ticket/copy. Hiện tại có thể enable, nhưng để apply retention cho existing objects, phải dùng **S3 Batch Operations** để apply retention settings bulk.
- **Option C** nói "Recopy all existing objects". (Copy object đè lên chính nó để apply lock setting của bucket default? Valid workaround cũ).
- **Option D** nói "Use S3 Batch Operations". Đây là feature native mới để apply Lock cho existing objects. -> "Least operational overhead" hơn Recopy thủ công.

**Đáp án đúng**: **D**

---

## Câu 447

**Đề bài**:  A company has a stateless web application that runs on AWS Lambda functions that are invoked by Amazon API Gateway. The company wants to deploy the application across multiple AWS Regions to provide Regional failover capabilities. What should a solutions architect do to route traffic to multiple Regions?

**Các đáp án**:

- A. **Create Amazon Route 53 health checks**. Use **active-active failover configuration** (Latency or Geolocation usually, but Failover policy is active-passive. Active-Active uses Multivalue/Latency). Question asks "Regional failover capabilities".
- B. CloudFront (Failover origin group is for Origins, valid. But simpler global routing usually Route 53).
- C. Transit Gateway...
- D. ALB ...

**Giải thích**:

- Để route traffic tới API Gateway ở nhiều Region: **Route 53**.
- Dùng **Failover Routing Policy** (Active-Passive) hoặc **Latency Routing** (Active-Active).

**Đáp án đúng**: **A** (Route 53 là Global DNS Router).

---

## Câu 448

**Đề bài**:  A company has two VPCs named Management and Production. The Management VPC uses VPNs through a customer gateway to connect to a single device in the data center. The Production VPC uses a virtual private gateway with two attached AWS Direct Connect connections. The Management and Production VPCs both use a single VPC peering connection to allow communication between the applications. What should a solutions architect do to mitigate any single point of failure in this architecture?

**Các đáp án**:

- A. ...
- B. ...
- C. **Add a second set of VPNs to the Management VPC from a second customer gateway device**.
- D. ...

**Đáp án đúng**: **C**

**Giải thích chi tiết**:

- **C - ĐÚNG**: VPN connection đang dùng "Single customer gateway device" -> SPOF. Cần thêm Customer Gateway thứ 2 vả tạo VPN connection thứ 2 để redundancy.

---

## Câu 449

**Đề bài**:  A company runs its application on an Oracle database. The company plans to quickly migrate to AWS because of limited resources for the database, backup administration, and data center maintenance. The application uses third-party database features that require privileged access. Which solution will help the company migrate the database to AWS MOST cost-effectively?

**Các đáp án**:

- A. RDS Oracle (Managed, restricted access, might not support special 3rd party extension).
- B. **Amazon RDS Custom for Oracle**. Customize database settings...
- C. EC2 Oracle (Self managed - High administration effort/cost).
- D. PostgreSQL (Rewrite code - expensive).

**Đáp án đúng**: **B**

**Giải thích chi tiết**:

- **B - ĐÚNG**: **RDS Custom**.
  - Managed Service (Cost-effective operations) nhưng lại cho phép **OS Access** và customize DB environment.
  - Phù hợp với requirement "requires privileged access" cho legacy apps/features mà RDS Standard không hỗ trợ.

---

## Câu 450

**Đề bài**:  A company has a three-tier web application that is in a single server. The company wants to migrate the application to the AWS Cloud. The company also wants the application to align with the AWS Well-Architected Framework and to be consistent with AWS recommended best practices for security, scalability, and resiliency. Which combination of solutions will meet these requirements? (Choose three.)

**Các đáp án**:

- A. VPC 2 AZs. App on EC2 Private Subnet Auto Scaling. Secure with SG/NACL. (**App Tier**).
- B. Single RDS Private Subnet (Not Resilient - Single AZ).
- C. **Create VPC across two AZs. Refactor app to host web, app, db tiers**. (**Subnet structure**). Wait, C implies refactoring architecture.
- D. ...
- E. **Use ELB** in front of web tier. Control access using **security groups referencing**. (**Access/Load Balancing**).
- F. **RDS Multi-AZ**. Allow access from App SG. (**Data Tier**).

**Selection**:

- Architecture: 3-tier tách biệt (Refactor from single server).
- **Web/App**: ASG Multi-AZ (Covered by C or A? C is more comprehensive "Refactor... Host each tier").
- **Load Balancing**: ELB (E).
- **Database**: RDS Multi-AZ (F - Resiliency).
- So: **C, E, F**.

**Đáp án đúng**: **C, E, F**

---
