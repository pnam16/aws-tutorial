# AWS Certification Exam Questions 451-500

Tài liệu được biên soạn chi tiết với giải thích bằng tiếng Việt, giúp bạn hiểu sâu về các dịch vụ AWS.

---

## Câu 451

**Đề bài**:  A company is migrating its applications and databases to the AWS Cloud. The company will use Amazon Elastic Container Service (Amazon ECS), AWS Direct Connect, and Amazon RDS. Which activities will be managed by the company's operational team? (Choose three.)

**Các đáp án**:

- A. RDS infrastructure layer... (AWS managed).
- B. **Creation of an Amazon RDS DB instance** and configuring the scheduled maintenance window. (User responsibility).
- C. **Configuration of additional software components on Amazon ECS** for monitoring... (User responsibility - ECS is shared responsibility, you manage tasks/containers/agents).
- D. Installation of patches for RDS (AWS managed - you just select window).
- E. Physical security (AWS managed).
- F. **Encryption of the data that moves in transit through Direct Connect**. (User responsibility - DX is unencrypted by default, need VPN or App-level encryption).

**Đáp án đúng**: **B, C, F**

**Giải thích chi tiết**:

- **B - ĐÚNG**: Với RDS, bạn chịu trách nhiệm tạo instance, config security group, parameter group, maintenance window. AWS lo phần OS/Patching/Hardware.
- **C - ĐÚNG**: Với ECS (trừ khi dùng Fargate hoàn toàn và không cần custom agent), việc cài thêm software/agents trong container hoặc trên EC2 host là việc của bạn.
- **F - ĐÚNG**: Direct Connect là đường dây vật lý riêng, **không mặc định mã hóa**. Nếu muốn bảo mật data in transit, customer phải tự config VPN over DX hoặc dùng MACsec (nếu support) hoặc encrypt tại level ứng dụng (TLS).

---

## Câu 452

**Đề bài**:  A company runs a Java-based job on an Amazon EC2 instance. The job runs every hour and takes 10 seconds to run. The job runs on a scheduled interval and consumes 1 GB of memory. The CPU utilization of the instance is low except for short surges during which the job uses the maximum CPU available. The company wants to optimize the costs to run the job. Which solution will meet these requirements?

**Các đáp án**:

- A. App2Container -> ECS Fargate (0.5 vCPU, 1 GB). (ECS Tasks have startup overhead, but Fargate billing is per second with 1 min minimum. 10s job pays for 60s. Still cheaper than running EC2 24/7).
- B. **Copy code to AWS Lambda** (1 GB memory). **EventBridge schedule**. (Lambda pays per millisecond. 10s run is perfect. No OS overhead).
- C. ...
- D. Stop/Start EC2 (EC2 billing minimum 60s. Boot time takes minutes -> unreliable for 10s job every hour).

**Đáp án đúng**: **B**

**Giải thích chi tiết**:

- **B - ĐÚNG**: **Lambda** là giải pháp rẻ nhất cho "Cron job" ngắn hạn (10s/giờ).
  - Chỉ tốn tiền cho 10s chạy. Không tốn tiền duy trì server.
  - 1GB Memory là cấu hình support tốt bởi Lambda.

---

## Câu 453

**Đề bài**:  A company wants to implement a backup strategy for Amazon EC2 data and multiple Amazon S3 buckets. Because of regulatory requirements, the company must retain backup files for a specific time period. The company must not alter the files for the duration of the retention period. Which solution will meet these requirements?

**Các đáp án**:

- A. AWS Backup Vault Lock in **Governance** mode (Can be deleted by privileged users).
- B. DLM (Snapshot only, no Lock).
- C. ...
- D. **AWS Backup Vault Lock** in **COMPLIANCE** mode.

**Đáp án đúng**: **D**

**Giải thích chi tiết**:

- **D - ĐÚNG**: **Compliance Mode**.
  - **Vault Lock** trong AWS Backup giúp chống xóa/sửa backup (WORM - Write Once Read Many).
  - **Compliance Mode**: Không ai có thể tắt hoặc xóa lock (kể cả Root user) cho đến khi hết retention period. Đáp ứng yêu cầu Regulatory nghiêm ngặt nhất.

---

## Câu 454

**Đề bài**:  A company has resources across multiple AWS Regions and accounts. A newly hired solutions architect discovers a previous employee did not provide details about the resources inventory. The solutions architect needs to build and map the relationship details of the various workloads across all accounts. Which solution will meet these requirements in the MOST operationally efficient way?

**Các đáp án**:

- A. Systems Manager Inventory (Instance level details, not workload relationship map).
- B. ...
- C. **Use Workload Discovery on AWS** to generate architecture diagrams.
- D. X-Ray (Trace level, requires instrumentation code, not for general inventory mapping).

**Đáp án đúng**: **C**

**Giải thích chi tiết**:

- **C - ĐÚNG**: **Workload Discovery on AWS** (trước đây là AWS Perspective).
  - Là một giải pháp (AWS Solution Implementation) giúp visualize và build Architecture Diagrams tự động từ resources thực tế trong account.
  - Nó map được relationships giữa các resource (VPC -> Subnet -> EC2 -> ELB...).

---

## Câu 455

**Đề bài**:  A company uses AWS Organizations. The company wants to operate some of its AWS accounts with different budgets. The company wants to receive alerts and automatically prevent provisioning of additional resources on AWS accounts when the allocated budget threshold is met during a specific period. Which combination of solutions will meet these requirements? (Choose three.)

**Các đáp án**:

- A/B. **Use AWS Budgets to create a budget**. (A/B similar, usually just "Create a Budget"). Let's pick A or B based on console location (Billing Dashboard is standard).
- C/D. **Create an IAM role** ...? Actually, AWS Budgets Actions needs a role/permissions to execute the action (apply SCP or IAM policy).
- E/F. **Add a budget action**... select IAM identity... apply **Service Control Policy (SCP)** or Config Rule?
  - Để **Prevent** provisioning trên **Toàn bộ Account**, cách hiệu quả nhất là apply một **SCP** (Deny All or Deny Creation) vào account đó.
  - Config Rule mang tính chất Detective/Remediation (chậm), còn SCP là Preventive (chặn ngay từ API call).

**Tổ hợp đúng**:

1. Create Budget (B).
2. Create IAM Role for Budget Action (D).
3. Config Budget Action to apply SCP (F).

**Đáp án đúng**: **B, D, F** (Lưu ý: AWS Budgets Action có thể tự động apply SCP hoặc IAM Policy để chặn việc tạo resource mới khi vượt ngân sách).

---

## Câu 456

**Đề bài**:  A company runs applications on Amazon EC2 instances in one AWS Region. The company wants to back up the EC2 instances to a second Region. The company also wants to provision EC2 resources in the second Region and manage the EC2 instances centrally from one AWS account. Which solution will meet these requirements MOST cost-effectively?

**Các đáp án**:

- A. DR Plan with similar number of EC2 (Active-Passive/Active-Active -> Expensive to keep EC2 running).
- B. Copy Snapshots (Manual/Scripted -> Operational cost. Managing centrally? Possible but tedious).
- C. **Create a backup plan by using AWS Backup**. Configure **cross-Region backup**.
- D. DataSync...

**Đáp án đúng**: **C**

**Giải thích chi tiết**:

- **C - ĐÚNG**: **AWS Backup**.
  - Centralized Backup Management.
  - Hỗ trợ **Cross-Region Backup** (Copy snapshot sang Region khác tự động).
  - Support managing EC2 centrally.
  - Cost-effective: Chỉ tốn tiền storage snapshot, không tốn tiền chạy EC2 (như Option A).

---

## Câu 457

**Đề bài**:  A company that uses AWS is building an application to transfer data to a product manufacturer. The company has its own identity provider (IdP). The company wants the IdP to authenticate application users while the users use the application to transfer data. The company must use Applicability Statement 2 (AS2) protocol. Which solution will meet these requirements?

**Các đáp án**:

- A. DataSync (No AS2).
- B. AppFlow (SaaS integration, no AS2).
- C. **Use AWS Transfer Family**. Create **Lambda function for IdP authentication**. (Transfer Family supports SFTP, FTPS, FTP and AS2).
- D. Storage Gateway (No AS2).

**Đáp án đúng**: **C**

**Giải thích chi tiết**:

- **C - ĐÚNG**:
  - **AWS Transfer Family** hỗ trợ giao thức **AS2** (thường dùng trong supply chain/Healthcare/B2B data exchange).
  - Transfer Family cho phép dùng **Custom Identity Provider** (thông qua API Gateway + Lambda) để tích hợp với IdP của công ty.

---

## Câu 458

**Đề bài**:  A solutions architect is designing a RESTAPI in Amazon API Gateway for a cash payback service. The application requires 1 GB of memory and 2 GB of storage for its computation resources. The application will require that the data is in a relational format. Which additional combination ofAWS services will meet these requirements with the LEAST administrative effort? (Choose two.)

**Các đáp án**:

- A. EC2 (Not serverless/least admin).
- B. **AWS Lambda** (Compute).
- C. Amazon RDS (Relational, but heavy admin compared to Aurora Serverless? or Question means generic service selection).
- D. DynamoDB (No Relational).
- E. EKS (High admin).

**Phân tích**:

- Backend compute cho API Gateway ít admin nhất: **Lambda** (B). Lambda support 10GB ephemeral storage (đủ 2GB required) và 10GB Memory.
- Database: Relational -> Cần SQL. Option C (RDS) là đúng. (Dù Aurora Serverless v2 tốt hơn, nhưng nó nằm trong nhóm RDS).

**Đáp án đúng**: **B, C**

---

## Câu 459

**Đề bài**:  A company uses AWS Organizations to run workloads within multiple AWS accounts. A tagging policy adds department tags to AWS resources when the company creates tags. An accounting team needs to determine spending on Amazon EC2 consumption. The accounting team must determine which departments are responsible for the costs regardless ofAWS account. The accounting team has access to AWS Cost Explorer for all AWS accounts within the organization and needs to access all reports from Cost Explorer. Which solution meets these requirements in the MOST operationally efficient way?

**Các đáp án**:

- A. User-defined tag... Management account...
- B. **Activate an AWS-defined cost allocation tag**? (No, Department tag is usually User-Defined). -> **Activate User-defined cost allocation tag**.
- C. Member account... (Cannot see all accounts).
- D. ...

**Giải thích**:

- Tag do người dùng tạo (Department) là **User-Defined Cost Allocation Tag**. Cần phải **Activate** trong Billing Console của **Management Account** (Payer Account) thì mới hiện trong Cost Explorer của tổ chức.
- Kế toán viên login vào **Management Account** để xem Cost Explorer tổng hợp cho toàn bộ Organization.

**Đáp án đúng**: **A**

---

## Câu 460

**Đề bài**:  A company wants to securely exchange data between its software as a service (SaaS) application Salesforce account and Amazon S3. The company must encrypt the data at rest by using AWS Key Management Service (AWS KMS) customer managed keys (CMKs). The company must also encrypt the data in transit. The company has enabled API access for the Salesforce account.

**Các đáp án**:

- A. Lambda (Custom code).
- B. Step Functions...
- C. **Create Amazon AppFlow flows**.
- D. Custom connector...

**Đáp án đúng**: **C**

**Giải thích chi tiết**:

- **C - ĐÚNG**: **Amazon AppFlow**.
  - Dịch vụ chuyên dụng để integrate SaaS (Salesforce, ServiceNow...) với AWS Services (S3, Redshift...).
  - **Secure**: Data encrypted in transit & at rest (Support KMS CMK).
  - Fully managed, no code.

---

## Câu 461

**Đề bài**:  A company is developing a mobile gaming app in a single AWS Region. The app runs on multiple Amazon EC2 instances in an Auto Scaling group. The company stores the app data in Amazon DynamoDB. The app communicates by using TCP traffic and UDP traffic between the users and the servers. The application will be used globally. The company wants to ensure the lowest possible latency for all users. Which solution will meet these requirements?

**Các đáp án**:

- A. Global Accelerator + ALB (ALB không support UDP).
- B. **Use AWS Global Accelerator**... Create **NLB**...
- C. CloudFront + NLB... (CloudFront support HTTP/HTTPS/TCP/TLS but usually not raw UDP for gaming efficiently/natively like GA). Also GA is better for non-HTTP gaming traffic.
- D. ...

**Đáp án đúng**: **B**

**Giải thích chi tiết**:

- **B - ĐÚNG**: **Global Accelerator (GA)** + **NLB**.
  - GA tối ưu đường truyền global (dùng AWS Backbone), giảm latency/jitter cho Game. Support cả **TCP & UDP**.
  - NLB support TCP & UDP listener. Application định nghĩa là TCP/UDP traffic nên NLB là bắt buộc (ALB chỉ HTTP).

---

## Câu 462

**Đề bài**:  A company has an application that processes customer orders. The company hosts the application on an Amazon EC2 instance that saves the orders to an Amazon Aurora database. Occasionally when traffic is high the workload does not process orders fast enough. What should a solutions architect do to write the orders reliably to the database as quickly as possible?

**Các đáp án**:

- A. EC2 size... SNS (SNS is pub/sub, not queuing for order processing).
- B. **Write orders to SQS**. Use **EC2 ASG** behind **ALB**? (Architecture seems mixed: App -> SQS. Then Worker EC2s read from SQS. Not ALB reading from SQS).
  Wait, "Use EC2 instances in an ASG... to read from SQS". This is the Worker Pattern. Correct.
  The "Behind an ALB" part might be confusing if referring to the Workers. Usually Workers don't need ALB. But maybe "Behind ALB" refers to the receiving tier?
  Let's check option D.
- C. SNS... (Not reliable buffering like SQS).
- D. Write to SQS **when CPU threshold limits**? (Complex logic). Use scheduled scaling... (Reactive is better).

**Phân tích Option B**:

- "Write orders to SQS" -> App nhận order và đẩy ngay vào Queue (Rất nhanh, Reliable).
- "Use EC2... to read from SQS and process into DB". -> Async processing. Đảm bảo DB không bị overload, đơn hàng không bị mất.
- Dù mô tả "Behind ALB" hơi thừa cho Worker tier, nhưng pattern SQS là core solution cho vấn đề này.

**Đáp án đúng**: **B**

---

## Câu 463

**Đề bài**:  An IoT company is releasing a mattress that has sensors to collect data about a user’s sleep. The sensors will send data to an Amazon S3 bucket. The sensors collect approximately 2 MB of data every night for each mattress. The company must process and summarize the data for each mattress. The results need to be available as soon as possible. Data processing will require 1 GB of memory and will finish within 30 seconds. Which solution will meet these requirements MOST cost-effectively?

**Các đáp án**:

- A. Glue (Start-up slow, min billing overhead).
- B. EMR (Overkill, expensive for 30s job).
- C. **Use AWS Lambda with a Python script**.
- D. ...

**Đáp án đúng**: **C**

**Giải thích chi tiết**:

- **C - ĐÚNG**: **Lambda**.
  - Job nhỏ (2MB inputs), thời gian ngắn (30s).
  - Event-driven: Sensor upload S3 -> Trigger Lambda. Xử lý ngay lập tức (ASAP).
  - Cost: Rẻ nhất (chỉ trả tiền 30s compute). Glue/EMR có warm-up time và min billing cao hơn.

---

## Câu 464

**Đề bài**:  A company hosts an online shopping application that stores all orders in an Amazon RDS for PostgreSQL Single-AZ DB instance. Management wants to eliminate single points of failure and has asked a solutions architect to recommend an approach to minimize database downtime without requiring any changes to the application code. Which solution meets these requirements?

**Các đáp án**:

- A. **Convert existing database instance to Multi-AZ** by modifying...
- B. Create new Multi-AZ... Restore... (Change endpoint -> Code change required?).
- C. Read Replica... (Code change to split read/write).
- D. ASG... (Cannot put RDS in ASG).

**Đáp án đúng**: **A**

**Giải thích chi tiết**:

- **A - ĐÚNG**:
  - AWS cho phép "Modify DB Instance" -> Chuyển từ Single-AZ sang **Multi-AZ** chỉ với 1 click (Zero downtime or minimal impact depending on maintenance window, but endpoint remains same).
  - **No code change**: Endpoint URL giữ nguyên.

---

## Câu 465

**Đề bài**:  A company is developing an application to support customer demands. The company wants to deploy the application on multiple Amazon EC2 Nitro-based instances within the same Availability Zone. The company also wants to give the application the ability to write to multiple block storage volumes in multiple EC2 Nitro-based instances simultaneously to achieve higher application availability. Which solution will meet these requirements?

**Các đáp án**:

- A. gp3 ...
- B. st1 ... (Multi-Attach not supported on HDD).
- C. **Provisioned IOPS SSD (io2) EBS volumes with EBS Multi-Attach**.
- D. gp2 ...

**Giải thích**:

- **EBS Multi-Attach**: Cho phép attach 1 volume vào nhiều EC2 instance (nitro-based) cùng lúc.
- Chỉ support trên dòng volume **Provisioned IOPS SSD (io1, io2)**. Không support gp2, gp3, st1, sc1.

**Đáp án đúng**: **C**

---

## Câu 466

**Đề bài**:  A company designed a stateless two-tier application that uses Amazon EC2 in a single Availability Zone and an Amazon RDS Multi-AZ DB instance. New company management wants to ensure the application is highly available. What should a solutions architect do to meet this requirement?

**Các đáp án**:

- A. **Configure App to use Multi-AZ EC2 Auto Scaling** and create an **ALB**.
- B. Snapshots... (DR, not HA).
- C. Route 53 latency... (Needs multi-region).
- D. Route 53 ... Multi-AZ ALB (ALB is inherently Multi-AZ, but need ASG backend).

**Đáp án đúng**: **A**

**Giải thích chi tiết**:

- **A - ĐÚNG**: Chuyển EC2 từ Single AZ sang **Auto Scaling Group Multi-AZ** + **Load Balancer** là cách tiêu chuẩn để đạt High Availability cho App tier.

---

## Câu 467

**Đề bài**:  A company uses AWS Organizations. A member account has purchased a Compute Savings Plan. Because of changes in the workloads inside the member account, the account no longer receives the full benefit of the Compute Savings Plan commitment. The company uses less than 50% of its purchased compute power.

**Các đáp án**:

- A. **Turn on discount sharing**... member account... (Setting is in Management Account usually).
- B. **Turn on discount sharing**... **Organizations management account**.
- C. ...
- D. Sell... (Savings Plans cannot be sold in Marketplace meant for RIs? Actually, RIs can be sold. SPs generally cannot be sold on the marketplace currently).

**Giải thích**:

- Để tận dụng Savings Plan thừa của 1 member account cho các account khác trong Organization, cần bật tính năng **Discount Sharing**.
- Setting này nằm ở **Management Account** (Payer Account).

**Đáp án đúng**: **B**

---

## Câu 468

**Đề bài**:  A company is developing a microservices application that will provide a search catalog for customers. The company must use REST APIs to present the frontend of the application to users. The REST APIs must access the backend services that the company hosts in containers in private VPC subnets. Which solution will meet these requirements?

**Các đáp án**:

- A. ... (WebSocket is not REST).
- B. **Design REST API** (API Gateway). Host app in ECS (Private). Create a **private VPC link**.
- C. ...
- D. ... Create a security group... (API Gateway public cannot access Private Subnet via SG rules alone unless using VPC Link or Private Endpoint).

**Đáp án đúng**: **B**

**Giải thích chi tiết**:

- **B - ĐÚNG**: **API Gateway VPC Link**.
  - Để API Gateway (Public Service) gọi tới Backend nằm trong Private VPC (ECS/NLB), cần dùng **VPC Link** (connect tới NLB của backend).
  - Đây là cách secure integration mà không cần public backend ra Internet.

---

## Câu 469

**Đề bài**:  A company stores raw collected data in an Amazon S3 bucket. The data is used for several types of analytics on behalf of the company's customers. The type of analytics requested determines the access pattern on the S3 objects. The company cannot predict or control the access pattern. The company wants to reduce its S3 costs. Which solution will meet these requirements?

**Các đáp án**:

- A. Replication to S3 Standard-IA (Still need access pattern logic).
- B. Lifecycle Standard to IA (Risk of high retrieval cost if accessed frequently unexpectedly).
- C. **Use S3 Lifecycle rules to transition objects from S3 Standard to S3 Intelligent-Tiering**.
- D. Inventory...

**Đáp án đúng**: **C**

**Giải thích chi tiết**:

- **C - ĐÚNG**: **Intelligent-Tiering**.
  - Designed for "Unknown/Unpredictable access patterns".
  - Tự động tối ưu chi phí (move sang IA tier nếu không dùng 30 ngày, move về Frequent nếu dùng lại). Không có retrieval fee.

---

## Câu 470

**Đề bài**:  A company has applications hosted on Amazon EC2 instances with IPv6 addresses. The applications must initiate communications with other external applications using the internet. However the company’s security policy states that any external service cannot initiate a connection to the EC2 instances. What should a solutions architect recommend to resolve this issue?

**Các đáp án**:

- A. NAT Gateway (IPv4 primarily, though NAT64 exists but Egress-Only IGW is native IPv6 solution).
- B. Internet Gateway (Allows Ingress & Egress).
- C. User VGW (VPN).
- D. **Create an egress-only internet gateway**...

**Đáp án đúng**: **D**

**Giải thích chi tiết**:

- **D - ĐÚNG**: **Egress-Only Internet Gateway (EIGW)**.
  - Dành riêng cho **IPv6**.
  - Cho phép EC2 IPv6 đi ra Internet.
  - Chặn Internet initiate connection vào EC2 (Stateful).

---

## Câu 471

**Đề bài**:  A company is creating an application that runs on containers in a VPC. The application stores and accesses data in an Amazon S3 bucket. During the development phase, the application will store and access 1 TB of data in Amazon S3 each day. The company wants to minimize costs and wants to prevent traffic from traversing the internet whenever possible. Which solution will meet these requirements?

**Các đáp án**:

- A. ...
- B. ...
- C. **Create a gateway VPC endpoint**... Associate with route tables. (Free, Private).
- D. Interface endpoint (Paid hourly + data processing).

**Đáp án đúng**: **C**

**Giải thích chi tiết**:

- **C - ĐÚNG**: **Gateway Endpoint**.
  - Miễn phí (Minimize costs).
  - Private connectivity tới S3 (No Internet traversal).
  - Option D (Interface Endpoint / PrivateLink) tốn tiền, thường dùng nếu truy cập từ On-prem hoặc cross-region. Với access "within VPC", Gateway Endpoint là best choice cho S3/DynamoDB.

---

## Câu 472

**Đề bài**:  A company has a mobile chat application with a data store based in Amazon DynamoDB. Users would like new messages to be read with as little latency as possible. A solutions architect needs to design an optimal solution that requires minimal application changes. Which method should the solutions architect select?

**Các đáp án**:

- A. **Configure DynamoDB Accelerator (DAX)**... Update code to use DAX endpoint.
- B. Read Replicas (Changes consistency model, latency still ms).
- C. ...
- D. Redis (Requires app logic rewrite to manage cache/DB sync).

**Đáp án đúng**: **A**

**Giải thích chi tiết**:

- **A - ĐÚNG**: **DAX**.
  - In-memory cache for DynamoDB. Microsecond latency.
  - **API-compatible**: Chỉ cần đổi Endpoint trong code SDK, không cần sửa logic query (Minimal app changes).

---

## Câu 473

**Đề bài**:  A company hosts a website on Amazon EC2 instances behind an Application Load Balancer (ALB). The website serves static content. Website traffic is increasing, and the company is concerned about a potential increase in cost.

**Các đáp án**:

- A. **Create Amazon CloudFront distribution to cache static files**.
- B. ElastiCache (For DB/Session cache, not ideal for static file serving via ALB).
- C. WAF (Security).
- D. ...

**Đáp án đúng**: **A** (CloudFront offload static content is standar pattern for cost/perf).

---

## Câu 474

**Đề bài**:  A company has multiple VPCs across AWS Regions to support and run workloads that are isolated from workloads in other Regions. Because of a recent application launch requirement, the company’s VPCs must communicate with all other VPCs across all Regions. Which solution will meet these requirements with the LEAST amount of administrative effort?

**Các đáp án**:

- A. VPC Peering (N\*(N-1)/2 connections -> Administrative nightmare).
- B. DX Gateways (For Hybrid).
- C. **Use AWS Transit Gateway** in single Region and **Transit Gateway peering across Regions**.
- D. PrivateLink (Service exposure, not full network routing).

**Đáp án đúng**: **C**

**Giải thích chi tiết**:

- **C - ĐÚNG**: **Transit Gateway (TGW)**.
  - Hub-and-spoke topology. Simplifies management.
  - **Inter-Region Peering**: Kết nối các TGW ở các Region lại với nhau -> Global Network.
  - Scale tốt và dễ quản lý hơn Mesh Peering.

---

## Câu 475

**Đề bài**:  A company is designing a containerized application that will use Amazon Elastic Container Service (Amazon ECS). The application needs to access a shared file system that is highly durable and can recover data to another AWS Region with a recovery point objective (RPO) of 8 hours. The file system needs to provide a mount target m each Availability Zone within a Region. A solutions architect wants to use AWS Backup to manage the replication to another Region. Which solution will meet these requirements?

**Các đáp án**:

- A. FSx Windows... (App Container usually Linux? Wait, "containerized application" - typically implies Linux, but could be Windows. However, EFS is the native shared FS for ECS Linux. FSx Windows is for Windows).
- B. FSx ONTAP...
- C. **Amazon EFS** with Standard storage class.
- D. FSx OpenZFS.

**Phân tích**:

- AWS Backup hỗ trợ Cross-Region Backup cho **EFS**.
- EFS Standard là highly durable Multi-AZ.
- EFS support Mount Target per AZ.
- EFS integrate native với ECS.
- Nếu không nói rõ OS là Windows, EFS là default choice cho ECS Shared Storage.

**Đáp án đúng**: **C**

---

## Câu 476

**Đề bài**:  A company is expecting rapid growth in the near future. A solutions architect needs to configure existing users and grant permissions to new users on AWS. The solutions architect has decided to create IAM groups. The solutions architect will add the new users to IAM groups based on department. Which additional action is the MOST secure way to grant permissions to the new users?

**Các đáp án**:

- A. SCP (For accounts, not Users/Groups).
- B. Create Roles... (Users assume roles? Possible, but Groups usually have Policies attached).
- C. **Create an IAM policy that grants least privilege permission. Attach the policy to the IAM groups**.
- D. ...

**Giải thích**:

- Best practice cho User management: Attach **Least Privilege Policy** vào **IAM Group**. Add User vào Group. User kế thừa quyền.
- Option B (Roles) thường dùng cho Service hoặc Cross-account. User nội bộ thường dùng Policy on Group. (Hoặc Identity Center Permission Sets, nhưng trong context IAM thuần túy thì là Policy attached to Group).

**Đáp án đúng**: **C**

---

## Câu 477

**Đề bài**:  A group requires permissions to list an Amazon S3 bucket and delete objects from that bucket. An administrator has created the following IAM policy to provide access to the bucket and applied that policy to the group. The group is not able to delete objects in the bucket. The company follows least-privilege access rules. Which statement should a solutions architect add to the policy to correct bucket access?

**Các đáp án**:

- A. Read-only permissions (Doesn't prevent Admin/Root from deleting? Object Lock is better).
- B. **Create new S3 bucket with Versioning enabled**. Use **S3 Object Lock** with **retention period**...
- C. Lambda trigger (Reactive).
- D. Static website... Folder lock... (Object Lock applies to objects, but B describes the setup process more cleanly: New bucket -> Enable Versioning (Pre-req) -> Enable Object Lock).

**Đáp án đúng**: **B**

**Giải thích chi tiết**:

- **B - ĐÚNG**: **S3 Object Lock** (Retention Mode) chặn xóa/sửa object cho đến khi hết hạn. Đây là giải pháp "WORM" enforce bằng hệ thống, secure nhất. Yêu cầu Versioning. cấu hình Public Read cho file.

---

## Câu 479

**Đề bài**:  A company is making a prototype of the infrastructure for its new website by manually provisioning the necessary infrastructure. This infrastructure includes an Auto Scaling group, an Application Load Balancer and an Amazon RDS database. After the configuration has been thoroughly validated, the company wants the capability to immediately deploy the infrastructure for development and production use in two Availability Zones in an automated fashion. What should a solutions architect recommend to meet these requirements?

**Các đáp án**:

- A. Systems Manager (Ops tasks, not Infra provisioning template usually).
- B. **Define infrastructure as a template** ... **Deploy with AWS CloudFormation**.
- C. Config (Audit).
- D. Elastic Beanstalk (PaaS, good but creating template from "manual prototype" is typically done via **CloudForamtion IaC** approach. Beanstalk is environment management. "Use prototype as guide -> CloudFormation" is standard IaC adoption).

**Đáp án đúng**: **B**

**Giải thích chi tiết**:

- **B - ĐÚNG**: **CloudFormation** (IaC). Viết template mô tả infra (dựa trên prototype). Deploy stack lặp lại cho Dev, Prod, Test... Automatated và Consistent.

---

## Câu 480

**Đề bài**:  A business application is hosted on Amazon EC2 and uses Amazon S3 for encrypted object storage. The chief information security officer has directed that no application traffic between the two services should traverse the public internet. Which capability should the solutions architect use to meet the compliance requirements?

**Các đáp án**:

- A. KMS (Encryption key).
- B. **VPC endpoint**.
- C. Private Subnet (Need endpoint to reach S3 privately).
- D. VGW (VPN).

**Đáp án đúng**: **B**

**Giải thích chi tiết**:

- **B - ĐÚNG**: **VPC Endpoint** (Gateway Endpoint cho S3). Giữ traffic giữa VPC và S3 hoàn toàn trong mạng nội bộ AWS, không đi qua Internet Gateway.

---

## Câu 481

**Đề bài**:  A company hosts a three-tier web application in the AWS Cloud. A Multi-AZAmazon RDS for MySQL server forms the database layer Amazon ElastiCache forms the cache layer. The company wants a caching strategy that adds or updates data in the cache when a customer adds an item to the database. The data in the cache must always match the data in the database. Which solution will meet these requirements?

**Các đáp án**:

- A. Lazy loading (Load only on Read miss. Data can be stale).
- B. **Implement the write-through caching strategy**.
- C. TTL (Helps stale, but doesn't "update when add").
- D. ...

**Đáp án đúng**: **B**

**Giải thích chi tiết**:

- **B - ĐÚNG**: **Write-Through**.
  - App ghi dữ liệu vào DB VÀ Cache cùng lúc (hoặc ngay sau nhau).
  - Đảm bảo "Data in cache always match DB" và sẵn sàng ngay lập tức.
  - Nhược điểm: Write latency cao hơn chút (do phải ghi 2 nơi).

---

## Câu 482

**Đề bài**:  A company wants to migrate 100 GB of historical data from an on-premises location to an Amazon S3 bucket. The company has a 100 megabits per second (Mbps) internet connection on premises. The company needs to encrypt the data in transit to the S3 bucket. The company will store new data directly in Amazon S3. Which solution will meet these requirements with the LEAST operational overhead?

**Các đáp án**:

- A. **Use s3 sync command in AWS CLI**. (SSL enabled by default).
- B. DataSync (Setting up Agent for 100GB is overkill?).
- C. Snowball (For TB/PB scale. 100GB via 100Mbps takes ~2.5 hours only. Shipping Snowball takes days).
- D. VPN + s3 cp (Overhead setup VPN).

**Đáp án đúng**: **A**

**Giải thích chi tiết**:

- **A - ĐÚNG**: 100GB là lượng dữ liệu nhỏ. Mạng 100Mbps upload chỉ mất vài giờ.
  - `aws s3 sync`: Command line đơn giản, tự resume, đa luồng.
  - **Encryption**: CLI dùng HTTPS mặc định -> Encrypted in transit.
  - Setup nhanh nhất (Least overhead).

---

## Câu 483

**Đề bài**:  A company containerized a Windows job that runs on .NET 6 Framework under a Windows container. The company wants to run this job in the AWS Cloud. The job runs every 10 minutes. The job’s runtime varies between 1 minute and 3 minutes. Which solution will meet these requirements MOST cost-effectively?

**Các đáp án**:

- A. Lambda? (Lambda supports .NET 6, container image. Perfect for short sporadic jobs. However, "Windows container"? Lambda runs on Linux microVMs usually, but supports .NET Core/.NET 6 cross-platform. If the job strictly requires "Windows Container" Runtime (e.g. legacy DLLs), Lambda might not work if it's not .NET Core compatible. But .NET 6 is cross platform. Assuming it works: Lambda is cheapest).
  - _Correction_: Lambda Container Image support... but the base image must be compatible with Lambda Runtime Interface (Linux based usually). AWS Lambda NO support for "Windows Containers" strictly speaking. It supports .NET on Linux.
  - If job "Requires Windows Container" specifically (e.g. Windows Registry, GDI+): Lambda NO. Fargate Windows YES.
- B. Batch + Fargate (Overhead framework, but good).
- C. **ECS Fargate** ... **Scheduled Task** ...
- D. ... Windows task scheduler (Bad design on cloud).

**So sánh Fargate vs Lambda**:

- Đề bài: "Containerized a Windows job... under a Windows container".
- Lambda không chạy Windows Container (chỉ Linux).
- Vậy phải dùng **ECS Fargate for Windows Containers**. (Fargate đã support Windows Containers).
- **Option C**: ECS Fargate Scheduled Task. No server to manage. Pay for 1-3 mins.

**Đáp án đúng**: **C**

---

## Câu 484

**Đề bài**:  A company wants to move from many standalone AWS accounts to a consolidated, multi-account architecture. The company plans to create many new AWS accounts for different business units. The company needs to authenticate access to these AWS accounts by using a centralized corporate directory service. Which combination of actions should a solutions architect recommend to meet these requirements? (Choose two.)

**Các đáp án**:

- A. Create Organization... (Required fundamental step).
- B. ...
- C. ...
- D. ... Config auth to use Directory Service directly (Complex for multi-account).
- E. **Set up AWS IAM Identity Center (Single Sign-On)**. **Integrate with corporate directory service**.

**Giải thích**:

- Move to multi-account -> Cần **AWS Organizations** (Option A).
- Centralized Auth -> **IAM Identity Center** (Option E). Đây là giải pháp Modern thay thế IAM Users, tích hợp Active Directory/External IdP.

**Đáp án đúng**: **A, E**

---

## Câu 485

**Đề bài**:  A company is looking for a solution that can store video archives in AWS from old news footage. The company needs to minimize costs and will rarely need to restore these files. When the files are needed, they must be available in a maximum of five minutes. What is the MOST cost-effective solution?

**Các đáp án**:

- A. **S3 Glacier with Expedited retrievals**. (Expedited: 1-5 minutes).
- B. Glacier Standard (3-5 hours).
- C. S3 Standard-IA (Instant, but storage more expensive than Glacier).
- D. One Zone-IA (Instant, cheaper than Std-IA, but still expensive compared to Glacier if access is "Rarely").

**So sánh**:

- "Minimize costs" + "Rarely access" -> **Glacier** rẻ nhất về storage.
- Requirement "Max 5 minutes" -> **Expedited Retrieval** đáp ứng.
- (Lưu ý: Expedited tốn tiền retrieve hơn, nhưng vì "Rarely need", tổng cost vẫn thấp tối ưu).

**Đáp án đúng**: **A**

---

## Câu 486

**Đề bài**:  A company is building a three-tier application on AWS. The presentation tier will serve a static website The logic tier is a containerized application. This application will store data in a relational database. The company wants to simplify deployment and to reduce operational costs. Which solution will meet these requirements?

**Các đáp án**:

- A. **S3 (Static)** + **ECS Fargate (Logic)** + **Managed RDS (DB)**.
- B. CloudFront... ECS EC2... (EC2 management overhead).
- C. ... EKS Fargate (K8s complex management compared to ECS for simple "Simplify deployment").
- D. ...

**Đáp án đúng**: **A**

**Giải thích chi tiết**:

- **A - ĐÚNG**:
  - Static web -> S3 (Serverless, cheapest, simplest).
  - Container Logic -> ECS Fargate (Serverless compute, no EC2 manage).
  - DB -> Managed RDS.
  - Đây là kiến trúc tối giản Operations nhất.

---

## Câu 487

**Đề bài**:  A company seeks a storage solution for its application. The solution must be highly available and scalable. The solution also must function as a file system be mountable by multiple Linux instances in AWS and on premises through native protocols, and have no minimum size requirements. The company has set up a Site-to-Site VPN for access from its on-premises network to its VPC. Which storage solution meets these requirements?

**Các đáp án**:

- A. FSx Multi-AZ (Could be Windows or Lustre. But EFS is more "Linux native" generic).
- B. EBS Multi-Attach (Single AZ usually, Block storage not File system).
- C. **Amazon EFS** with multiple mount targets.
- D. ...

**Giải thích**:

- **EFS**: Linux Native (NFS). Mount được từ On-prem qua VPN/DX. Scalable. No minimum size (Pay per use).
- FSx (như OpenZFS/NetApp) cũng được, nhưng EFS là native classic answer cho "Linux shared file system".

**Đáp án đúng**: **C**

---

## Câu 488

**Đề bài**:  A 4-year-old media company is using the AWS Organizations all features feature set to organize its AWS accounts. According to the company's finance team, the billing information on the member accounts must not be accessible to anyone, including the root user of the member accounts. Which solution will meet these requirements?

**Các đáp án**:

- A. IAM Group... (Root user bypasses IAM groups/policies in account unless SCP).
- B. Identity-based policy... (Root user not affected by identity policies fully or can remove them).
- C. **Create a Service Control Policy (SCP) to deny access to billing information**. Attach to Root OU.
- D. ...

**Đáp án đúng**: **C**

**Giải thích chi tiết**:

- **C - ĐÚNG**: **SCP**.
  - Chỉ có SCP (cấp Organization) mới có quyền hạn chế **Root User** của Member Account.
  - Deny action `aws-portal:*` (old) or `billing:*` via SCP sẽ chặn member account xem Billing.

---

## Câu 489

**Đề bài**:  An ecommerce company runs an application in the AWS Cloud that is integrated with an on-premises warehouse solution. The company uses Amazon Simple Notification Service (Amazon SNS) to send order messages to an on-premises HTTPS endpoint so the warehouse application can process the orders. The local data center team has detected that some of the order messages were not received. A solutions architect needs to retain messages that are not delivered and analyze the messages for up to 14 days. Which solution will meet these requirements with the LEAST development effort?

**Các đáp án**:

- A. **SNS Dead Letter Queue (DLQ)** with **Kinesis Data Stream**? (SNS DLQ supports SQS target usually).
- B. Add SQS between App and SNS (Architecture change).
- C. **Configure an SNS dead letter queue** that has an **Amazon SQS** target with a **retention period of 14 days**.
- D. DynamoDB... (Kodierung effort).

**Đáp án đúng**: **C**

**Giải thích chi tiết**:

- **C - ĐÚNG**: **SNS DLQ**.
  - Config DLQ cho SNS subscription. Khi delivery failed (HTTPS endpoint down/error), message được đẩy vào DLQ (SQS queue).
  - SQS giữ message được tối đa **14 ngày**.
  - "Least development effort" (Config only).

---

## Câu 490

**Đề bài**:  A gaming company uses Amazon DynamoDB to store user information such as geographic location, player data, and leaderboards. The company needs to configure continuous backups to an Amazon S3 bucket with a minimal amount of coding. The backups must not affect availability of the application and must not affect the read capacity units (RCUs) that are defined for the table. Which solution meets these requirements?

**Các đáp án**:

- A. EMR Hive (Coding).
- B. **Export the data directly from DynamoDB to Amazon S3** ... Turn on **PITR**.
- C. Streams + Lambda (Coding, consumes RCUs usually unless new Streams Kinesis adapter).
- D. Lambda Scan (Consumes RCUs!!).

**Đáp án đúng**: **B**

**Giải thích chi tiết**:

- **B - ĐÚNG**: **DynamoDB Export to S3** (Native feature).
  - Không ảnh hưởng performance table (sử dụng snapshot PITR internal).
  - Không tốn RCUs.
  - Requires enabling **Point-in-time Recovery (PITR)**.
  - Minimal coding (Click console/API call).

---

## Câu 491

**Đề bài**:  A solutions architect is designing an asynchronous application to process credit card data validation requests for a bank. The application must be secure and be able to process each request at least once. Which solution will meet these requirements MOST cost-effectively?

**Các đáp án**:

- A. **Lambda** + **SQS Standard Queue**.
- B. SQS FIFO (More expensive than Standard. "At least once" is guaranteed by Standard. FIFO guarantees "Exactly once").
- C. FIFO...
- D. ...

**Giải thích**:

- **Standard Queue**: Guarantee delivery **At least once** (có thể duplicate). Rẻ hơn FIFO.
- **FIFO Queue**: Exactly once. Đắt hơn.
- Đề bài chỉ yêu cầu "At least once". -> Chọn Standard Queue để tiết kiệm chi phí (**Most Cost-Effective**).

**Đáp án đúng**: **A**

---

## Câu 492

**Đề bài**:  A company has multiple AWS accounts for development work. Some staff consistently use oversized Amazon EC2 instances, which causes the company to exceed the yearly budget for the development accounts. The company wants to centrally restrict the creation of AWS resources in these accounts. Which solution will meet these requirements with the LEAST development effort?

**Các đáp án**:

- A. Systems Manager templates... (Staff can still use Console to launch if not restricted).
- B. **Use AWS Organizations**... **SCP to control usage of EC2 instance types**.
- C. EventBridge + Lambda (Reactive, instances already launched -> Billed min 60s).
- D. Service Catalog (Good control, but setup effort is higher than simple SCP).

**Đáp án đúng**: **B**

**Giải thích chi tiết**:

- **B - ĐÚNG**: **SCP**.
  - Viết 1 policy: Deny `ec2:RunInstances` if `ec2:InstanceType` is NOT in list (t2.micro, t3.small...).
  - Apply cho Dev OU.
  - Centralized, Preventive, Low effort.

---

## Câu 493

**Đề bài**:  A company wants to use artificial intelligence (AI) to determine the quality of its customer service calls. The company currently manages calls in four different languages, including English. The company will offer new languages in the future. The company does not have the resources to regularly maintain machine learning (ML) models. The company needs to create written sentiment analysis reports from the customer service call recordings. The customer service call recording text must be translated into English. Which combination of steps will meet these requirements? (Choose three.)

**Các đáp án**:

- A. Comprehend to translate (False. Comprehend is NLP).
- B. Lex (Chatbot).
- C. Polly (Text-to-Speech).
- D. **Amazon Transcribe** (Audio to Text).
- E. **Amazon Translate** (Text to English).
- F. **Amazon Comprehend** (Sentiment Analysis).

**Đáp án đúng**: **D, E, F** (Luồng chuẩn: Audio -> Transcribe -> Translate -> Comprehend).

---

## Câu 494

**Đề bài**:  A company uses Amazon EC2 instances to host its internal systems. As part of a deployment operation, an administrator tries to use the AWS CLI to terminate an EC2 instance. However, the administrator receives a 403 (Access Denied) error message. The administrator is using an IAM role that has the following IAM policy attached: What is the cause of the unsuccessful request?

**Các đáp án**:

- A. ...
- B. ...
- C. ...
- D. **The request... does not originate from the CIDR blocks...**

**Giải thích**:

- Policy có Condition `aws:SourceIp`. Nếu Admin đang ngồi ở IP khác (ví dụ quán cafe, hoặc mạng nhà) không nằm trong dải IP cho phép -> Request bị Deny.

**Đáp án đúng**: **D**

---

## Câu 495

**Đề bài**:  A company is conducting an internal audit. The company wants to ensure that the data in an Amazon S3 bucket that is associated with the company’s AWS Lake Formation data lake does not contain sensitive customer or employee data. The company wants to discover personally identifiable information (PII) or financial information, including passport numbers and credit card numbers. Which solution will meet these requirements?

**Các đáp án**:

- A. Audit Manager (Framework compliance).
- B. S3 Inventory (List files, not content scan).
- C. **Configure Amazon Macie**.
- D. S3 Select (Manual query).

**Đáp án đúng**: **C**

**Giải thích chi tiết**:

- **C - ĐÚNG**: **Amazon Macie**.
  - Machine Learning service chuyên dùng để scan S3 bucket, **discover** và **classify** sensitive data (PII, Financial data).

---

## Câu 496

**Đề bài**:  A company uses on-premises servers to host its applications. The company is running out of storage capacity. The applications use both block storage and NFS storage. The company needs a high-performing solution that supports local caching without re-architecting its existing applications. Which combination of actions should a solutions architect take to meet these requirements? (Choose two.)

**Các đáp án**:

- A. ...
- B. **Deploy AWS Storage Gateway file gateway to replace NFS storage**.
- C. Snowball...
- D. **Deploy AWS Storage Gateway volume gateway to replace the block storage**.
- E. EFS (Cloud only mount usually, high latency via VPN without caching appliance).

**Giải thích**:

- **Storage Gateway**:
  - **File Gateway**: Interface NFS/SMB -> S3 backend. Local cache for frequent files. Replace NFS. (Option B).
  - **Volume Gateway (Stored/Cached)**: Interface iSCSI Block -> EBS/S3 backend. Local cache. Replace Block Storage. (Option D).

**Đáp án đúng**: **B, D**

---

## Câu 497

**Đề bài**:  A company has a service that reads and writes large amounts of data from an Amazon S3 bucket in the same AWS Region. The service is deployed on Amazon EC2 instances within the private subnet of a VPC. The service communicates with Amazon S3 over a NAT gateway in the public subnet. However, the company wants a solution that will reduce the data output costs. Which solution will meet these requirements MOST cost-effectively?

**Các đáp án**:

- A/B. NAT Instance (Admin overhead, performance bottleneck).
- C. **Provision a VPC gateway endpoint**.
- D. Second NAT...

**Đáp án đúng**: **C**

**Giải thích chi tiết**:

- **C - ĐÚNG**: **S3 Gateway Endpoint**.
  - Free of charge.
  - Truy cập trực tiếp từ Private Subnet tới S3 không qua NAT Gateway -> Tiết kiệm chi phí Data Processing của NAT.

---

## Câu 498

**Đề bài**:  A company uses Amazon S3 to store high-resolution pictures in an S3 bucket. To minimize application changes, the company stores the pictures as the latest version of an S3 object. The company needs to retain only the two most recent versions of the pictures. The company wants to reduce costs. The company has identified the S3 bucket as a large expense. Which solution will reduce the S3 costs with the LEAST operational overhead?

**Các đáp án**:

- A. Use **S3 Lifecycle**... (Lifecycle can expire non-current versions, e.g., "NoncurrentVersionExpiration: Days=X" or "NewerNoncurrentVersions: Y").
  - Feature **Retain Newest Noncurrent Versions** mới được update trong Lifecycle Rule. Cho phép giữ lại "Number of newer versions" (ví dụ: Keep 2 newest). Các version cũ hơn sẽ bị xóa.
- B. Lambda (Overhead).
- C. Batch Operations (Manual trigger).
- D. Deactivate versioning (Losing rollback capability, doesn't clean old versions automatically).

**Đáp án đúng**: **A** (Configure S3 Lifecycle: `NewerNoncurrentVersions: 2`).

---

## Câu 499

**Đề bài**:  A company needs to minimize the cost of its 1 Gbps AWS Direct Connect connection. The company's average connection utilization is less than 10%. A solutions architect must recommend a solution that will reduce the cost without compromising security. Which solution will meet these requirements?

**Các đáp án**:

- A. Share...
- B. **Set up a new 200 Mbps Direct Connect connection** (Hosted Connection?).
- C. ...
- D. **Contact AWS Direct Connect Partner to order a 200 Mbps hosted connection**...

**Giải thích**:

- Dedicated Connection min speed là 1Gbps.
- Muốn tốc độ thấp hơn (50Mbps - 500Mbps) để rẻ hơn -> Phải dùng **Hosted Connection** thông qua **Direct Connect Partner**.
- Utilization < 10% của 1Gbps ~ 100Mbps. Mua gói 200Mbps là hợp lý và rẻ hơn nhiều.

**Đáp án đúng**: **D**

---

## Câu 500

**Đề bài**:  A company has multiple Windows file servers on premises. The company wants to migrate and consolidate its files into an Amazon FSx for Windows File Server file system. File permissions must be preserved to ensure that access rights do not change. Which solutions will meet these requirements? (Choose two.)

**Các đáp án**:

- A. **DataSync agent on premises**.
- B. Copy to S3... (Lose permissions metadata often).
- C. Ship drives...
- D. **Snowcone device... Launch DataSync agent on device**.
- E. Snowball Edge... (If offline transfer, might preserve permissions if tools used right, but DataSync Online implies Scenario A or D).

**Phân tích**:

- **Option A**: Standard DataSync online migration. DataSync preserve NTFS permissions.
- **Option D**: Nếu mạng chậm hoặc muốn dùng thiết bị chuyển data, **Snowcone** có tích hợp **DataSync Agent** cài sẵn. Nó hoạt động như 1 local DataSync agent -> Transfer online về AWS FSx. (Vẫn là online transfer nhưng dùng thiết bị edge compute).
- Đề bài không nói mạng chậm. Nhưng A và D là 2 phương án dùng DataSync (Preserve Permissions tốt nhất).
- Tuy nhiên option D "Schedule DataSync tasks to transfer...". Snowcone DataSync agent gửi data online.
- Option E: Snowball Edge -> Import to S3 -> DataSync to FSx. (Two hopp migration. S3 intermediate might complicate NTFS ACL preservation compared to direct DataSync Agent -> FSx).
- **Đáp án an toàn nhất**: **A** (Standard) và **D** (Hardware agent option). Hoặc có thể là **A** và **E**? (Snowball cho bulk data). Nhưng S3 làm trung gian thường risky cho ACLs. DataSync support transfer S3->FSx preserving ACLs (stored in S3 metadata).
- Tuy nhiên, câu hỏi thường tìm kiếm giải pháp Online (A) và Offline (E/D) kết hợp? Hoặc 2 cách làm được việc.
- A là chắc chắn đúng.
- Giữa D và E: Snowcone (D) có DataSync Agent pre-installed. Nó tối ưu cho việc đẩy data online từ edge. Snowball (E) copy vào device -> Ship -> Import S3.
- FSx best practice migration: DataSync.
- Vậy chọn **A** và **D** (Đều dùng DataSync agent trực tiếp).

**Đáp án đúng**: **A, D**

---
