# AWS Certification Exam Questions 551-600

Tài liệu được biên soạn chi tiết với giải thích bằng tiếng Việt, giúp bạn hiểu sâu về các dịch vụ AWS.

---

## Câu 551

**Đề bài**:  A company has a financial application that produces reports. The reports average 50 KB in size and are stored in Amazon S3. The reports are frequently accessed during the first week after production and must be stored for several years. The reports must be retrievable within 6 hours. Which solution meets these requirements MOST cost-effectively?

**Các đáp án**:

- A. Standard -> **Glacier** after 7 days (Retrieval < 6 hours).
- B. Standard -> Standard-IA after 7 days (IA min object size 128KB. Reports are 50KB -> Billed at 128KB -> Expensive).
- C. Intelligent-Tiering (Also has min size 128KB for auto-tiering advantage, though <128KB stays in Frequent Tier. But no transition to Deep Archive automatically for very long term in standard IT unless configured. Efficient but maybe not _most_ cost effective compared to Glacier).
- D. Standard -> Glacier Deep Archive (Retrieval time for Deep Archive is 12-48 hours. Requirement "within 6 hours").

**Phân tích**:

- File size 50KB: Dùng Standard-IA hay Intelligent-Tiering sẽ bị charge minimum 128KB -> Lãng phí gấp đôi storage cost.
- **Glacier (Flexible Retrieval)**:
  - Min storage duration: 90 days.
  - Min object size: 40KB (phù hợp với reporting 50KB).
  - Retrieval time: Standard (3-5 hours) or Bulk (5-12 hours). Standard retrieval < 6 hours -> OK.
- Vậy chuyển sang Glacier sau 7 ngày là kinh tế nhất cho "Stored for several years" + "Small files".

**Đáp án đúng**: **A**

---

## Câu 552

**Đề bài**:  A company needs to optimize the cost of its Amazon EC2 instances. The company also needs to change the type and family of its EC2 instances every 2-3 months. What should the company do to meet these requirements?

**Các đáp án**:

- A. Reserved Instances (Convertible RIs allow change, but Standard RIs do not. "Partial Upfront" doesn't define flexibility).
- B. **Compute Savings Plan (1 year)**.
- C/D. Instances Savings Plan (Locked to Family).

**Giải thích**:

- **Compute Savings Plan**: Flexible nhất. Apply cho mọi Instance Type, Family, Region, Fargate, Lambda. Cho phép đổi family thoải mái (ví dụ C5 sang M5).
- **EC2 Instance Savings Plan**: Chỉ flexible trong cùng Family (ví dụ M5.large sang M5.xlarge), không đổi được Family (M5 sang C5).
- RI Convertible: Cho phép đổi nhưng process manual hơn. Compute SP là tự động và flexible nhất.

**Đáp án đúng**: **B**

---

## Câu 553

**Đề bài**:  A solutions architect needs to review a company's Amazon S3 buckets to discover personally identifiable information (PII). The company stores the PII data in the us-east-1 Region and us-west-2 Region. Which solution will meet these requirements with the LEAST operational overhead?

**Các đáp án**:

- A. **Configure Macie in each Region**. Create job.
- B. Security Hub + Config (Config doesn't scan PII).
- C. Inspector (EC2/ECR scanning, not S3 data content scanning usually, though Inspector added S3 scanning recently? Macie is _the_ service for PII).
- D. GuardDuty (Threat detection).

**Phân tích**:

- **Macie** là dịch vụ chuyên dụng để discover PII trong S3.
- Macie là Regional Service. Cần bật ở cả 2 Region.

**Đáp án đúng**: **A**

---

## Câu 554

**Đề bài**:  A company's SAP application has a backend SQL Server database in an on-premises environment. The company wants to migrate its on-premises application and database server to AWS. The company needs an instance type that meets the high demands of its SAP database. On-premises performance data shows that both the SAP application and the database have high memory utilization. Which solution will meet these requirements?

**Các đáp án**:

- A. Compute Optimized...
- B. Storage Optimized...
- C. **Memory optimized instance family for both**.
- D. HPC...

**Giải thích**:

- Keyword: "High memory utilization".
- Chọn **Memory Optimized** (dòng R, X) cho cả App và DB là phù hợp nhất.

**Đáp án đúng**: **C**

---

## Câu 555

**Đề bài**:  A company runs an application in a VPC with public and private subnets. The VPC extends across multiple Availability Zones. The application runs on Amazon EC2 instances in private subnets. The application uses an Amazon Simple Queue Service (Amazon SQS) queue. A solutions architect needs to design a secure solution to establish a connection between the EC2 instances and the SQS queue. Which solution will meet these requirements?

**Các đáp án**:

- A. **Interface VPC Endpoint** for SQS. Configure endpoint in **Private Subnets**. SG Allow inbound from EC2.
- B. ... Endpoint in Public Subnets (Why? Endpoint should be reachable from Private).
- C. ...
- D. Gateway Endpoint (SQS does NOT support Gateway Endpoint. Only S3 and DynamoDB do).

**Giải thích**:

- SQS dùng **Interface VPC Endpoint** (PrivateLink).
- Endpoint ENI nên được đặt trong subnet mà EC2 có thể với tới (Private Subnet).
- Security Group của Endpoint cần allow traffic port 443 từ EC2.

**Đáp án đúng**: **A**

---

## Câu 556

**Đề bài**:  A solutions architect is using an AWS CloudFormation template to deploy a three-tier web application. The web application consists of a web tier and an application tier that stores and retrieves user data in Amazon DynamoDB tables. The web and application tiers are hosted on Amazon EC2 instances, and the database tier is not publicly accessible. The application EC2 instances need to access the DynamoDB tables without exposing API credentials in the template. What should the solutions architect do to meet these requirements?

**Các đáp án**:

- A. **Create IAM Role**... Associate with **Instance Profile**.
- B. Create IAM Role... (Same as A, more detailed "Add role to instance profile").
- C. Parameter input keys (Exposes keys).
- D. Create IAM User (Exposes keys).

**Giải thích**:

- Best practice cho EC2 access AWS Services là dùng **IAM Role** gắn vào **Instance Profile**. Không bao giờ hardcode keys hay pass keys qua UserData nếu có thể dùng Role.

**Đáp án đúng**: **A** (Or B depends on phrasing depth, usually they are same. A is concise). _Correction_: Option A says "referencing an instance profile". Option B says "Create role... Add role to profile... associate profile". B describes the full mechanism in CloudFormation (`AWS::IAM::InstanceProfile`). A implies it. Let's look closer. "Create an IAM role... Associate the role with the application instances by referencing an instance profile". This is correct.

**Đáp án đúng**: **A**

---

## Câu 557

**Đề bài**:  A solutions architect manages an analytics application. The application stores large amounts of semistructured data in an Amazon S3 bucket. The solutions architect wants to use parallel data processing to process the data more quickly. The solutions architect also wants to use information that is stored in an Amazon Redshift database to enrich the data. Which solution will meet these requirements?

**Các đáp án**:

- A. Athena... (Not typically for "processing" large ETL jobs, more for query).
- B. EMR... (Big data processing). Enrich with Redshift? EMR can connector to Redshift.
- C. **EMR to process S3**. Use **Kinesis** to move to Redshift? (Complex).
- D. **AWS Glue** to process S3. Use **Glue** with Redshift data to enrich.

**Phân tích**:

- **AWS Glue**: Serverless ETL. Typical use case: Read S3, Read Redshift (via JDBC Connection), Join/Transform, Write output.
- Glue support "Parallel data processing" (Spark based).
- Managed solution > EMR (requires cluster management) for "Solutions Architect" efficiency usually.

**Đáp án đúng**: **D**

---

## Câu 558

**Đề bài**:  A company has two VPCs that are located in the us-west-2 Region within the same AWS account. The company needs to allow network traffic between these VPCs. Approximately 500 GB of data transfer will occur between the VPCs each month. What is the MOST cost-effective solution to connect these VPCs?

**Các đáp án**:

- A. Transit Gateway (Hourly charge + Data processing fee).
- B. VPN (Data processing fee? No, but Internet/VGW throughput limitation, overhead).
- C. **VPC Peering**. (Data transfer cost: Intra-region. **No hourly fee**).
- D. Direct Connect (Overkill, expensive).

**Giải thích**:

- **VPC Peering**:
  - Free setup. Không tốn phí theo giờ (như TGW hay VPN/NAT).
  - Chỉ tốn phí Data Transfer (intra-region) nếu qua AZ mới tốn.
  - Với setup "Same AWS Account", Peering là rẻ nhất và performant nhất.

**Đáp án đúng**: **C**

---

## Câu 559

**Đề bài**:  A company hosts multiple applications on AWS for different product lines. The applications use different compute resources, including Amazon EC2 instances and Application Load Balancers. The applications run in different AWS accounts under the same organization in AWS Organizations across multiple AWS Regions. Teams for each product line have tagged each compute resource in the individual accounts. The company wants more details about the cost for each product line from the consolidated billing feature in Organizations. Which combination of steps will meet these requirements? (Choose two.)

**Các đáp án**:

- A. ...
- B. **Select a specific user-defined tag in the AWS Billing console**. (Cost Allocation Tags).
- C. ...
- E. **Activate the selected tag from the Organizations management account**.

**Quy trình**:

1.  Vào Management Account (Payer Account).
2.  Vào Billing Dashboard -> Cost Allocation Tags.
3.  **Activate** các "User-Defined Tags" mà member accounts đã dùng (Option E).
4.  Sau khi activate, tag sẽ hiện trong Cost Explorer/Billing Reports để filter (Option B concept).

**Đáp án đúng**: **B, E** (Logic: Activate tag in Management Account -> Use tag in Billing Console report).

---

## Câu 560

**Đề bài**:  A company's solutions architect is designing an AWS multi-account solution that uses AWS Organizations. The solutions architect has organized the company's accounts into organizational units (OUs). The solutions architect needs a solution that will identify any changes to the OU hierarchy. The solution also needs to notify the company's operations team of any changes. Which solution will meet these requirements with the LEAST operational overhead?

**Các đáp án**:

- A. **Control Tower**. Use **account drift notifications**? (Control Tower detects drift in Guardrails, logical setup).
- B. Control Tower... Config rules?
- C. Service Catalog...
- D. CloudFormation stack drift...

**Phân tích**:

- **AWS Control Tower** là giải pháp quản lý Multi-account best practice hiện nay. Nó quản lý Landing Zone, OUs, Accounts.
- Khi có thay đổi không mong muốn (Drift) so với cấu hình Control Tower, nó có báo cáo Drift.
- Tuy nhiên Control Tower drift detection tập trung vào Governance rules (Guardrails).
- Câu hỏi về "Changes to OU hierarchy".
- Check Option A: Control Tower natively manages OUs. If someone changes OU structure outside Control Tower, it creates a "Drift".
- Control Tower dashboard shows drift. Notifications can be set up via SNS integrated with Control Tower Lifecycle events or Config.
- Least overhead: Control Tower (Managed service).

**Đáp án đúng**: **A**

---

## Câu 561

**Đề bài**:  A company's website handles millions of requests each day, and the number of requests continues to increase. A solutions architect needs to improve the response time of the web application. The solutions architect determines that the application needs to decrease latency when retrieving product details from the Amazon DynamoDB table. Which solution will meet these requirements with the LEAST amount of operational overhead?

**Các đáp án**:

- A. **DynamoDB Accelerator (DAX)**.
- B. Redis (Manual application code changes to cache/invalidate).
- C. Memcached (Manual).
- D. Streams + Lambda...

**Giải thích**:

- **DAX**: Fully managed in-memory cache for DynamoDB.
- **Client-compatible**: Không cần sửa code query database nhiều (chỉ đổi endpoint). "Transparent caching".
- Least overhead so với việc tự quản lý Redis side-cache.

**Đáp án đúng**: **A**

---

## Câu 562

**Đề bài**:  A solutions architect needs to ensure that API calls to Amazon DynamoDB from Amazon EC2 instances in a VPC do not travel across the internet. Which combination of steps should the solutions architect take to meet this requirement? (Choose two.)

**Các đáp án**:

- A. **Create a route table entry for the endpoint**.
- B. **Create a gateway endpoint for DynamoDB**.
- C. Interface endpoint (DynamoDB support Interface endpoint too, but Gateway is classic/free).
- D. ENI...
- E. ...

**Phân tích**:

- Giải pháp tiêu chuẩn cho DynamoDB Private Access là **Gateway Endpoint**.
- Steps:
  1.  Tạo **Gateway Endpoint** (Option B).
  2.  Add **Route** to Route Table (Target: `vpce-xxxxxx`) (Option A). Gateway Endpoint yêu cầu Route table modification (thường làm tự động khi tạo Endpoint nếu chọn Route Table).

**Đáp án đúng**: **A, B**

---

## Câu 563

**Đề bài**:  A company runs its applications on both Amazon Elastic Kubernetes Service (Amazon EKS) clusters and on-premises Kubernetes clusters. The company wants to view all clusters and workloads from a central location. Which solution will meet these requirements with the LEAST operational overhead?

**Các đáp án**:

- A. Container Insights (Metrics, not cluster management view).
- B. **Amazon EKS Connector**.
- C. Systems Manager...
- D. EKS Anywhere...

**Giải thích**:

- **EKS Connector**: Cho phép kết nối bất kỳ Kubernetes cluster nào (On-prem, other cloud) vào **EKS Console**.
- Giúp visualize và view workloads tập trung tại AWS EKS Console.

**Đáp án đúng**: **B**

---

## Câu 564

**Đề bài**:  A company is building an ecommerce application and needs to store sensitive customer information. The company needs to give customers the ability to complete purchase transactions on the website. The company also needs to ensure that sensitive customer data is protected, even from database administrators. Which solution meets these requirements?

**Các đáp án**:

- A. EBS Encryption (DBA can access OS -> access data).
- B. **RDS MySQL** with **Client-side encryption**.
- C. S3 Server-side encryption (Admins with S3 permissions can read).
- D. ...

**Giải thích**:

- **Client-side encryption**: Dữ liệu được mã hóa **tại ứng dụng** (Application) trước khi gửi xuống Database.
- 0DBA (Admin Database) chỉ nhìn thấy dữ liệu mã hóa (blob). Họ không có khóa giải mã (KMS Key) mà khóa này chỉ App Server giữ hoặc user giữ.

**Đáp án đúng**: **B**

---

## Câu 565

**Đề bài**:  A company has an on-premises MySQL database that handles transactional data. The company is migrating the database to the AWS Cloud. The migrated database must maintain compatibility with the company's applications that use the database. The migrated database also must scale automatically during periods of increased demand. Which migration solution will meet these requirements?

**Các đáp án**:

- A. RDS MySQL + Storage Scaling (Storage scales, but compute auto-scaling? RDS doesn't auto-scale compute vertically easily without downtime/proxy).
- B. Redshift (Not compatible MySQL transactional).
- C. **DMS to Amazon Aurora**. Turn on **Aurora Auto Scaling**.
- D. DynamoDB (Not compatible MySQL).

**Phân tích**:

- **Amazon Aurora**: MySQL compatible.
- **Aurora Auto Scaling**: Automatically add Read Replicas to handle Read Traffic. (Or Aurora Serverless for Compute scaling).
- Câu hỏi "Migrate... maintain compatibility... scale automatically".
- Aurora là đích đến tốt nhất cho MySQL migration với requirement scaling.

**Đáp án đúng**: **C**

---

## Câu 566

**Đề bài**:  A company runs multiple Amazon EC2 Linux instances in a VPC across two Availability Zones. The instances host applications that use a hierarchical directory structure. The applications need to read and write rapidly and concurrently to shared storage. What should a solutions architect do to meet these requirements?

**Các đáp án**:

- A. S3 (Not hierarchical directory usage pattern for concurrent RW like a filesytem).
- B. **Amazon EFS**.
- C. EBS Multi-Attach (`io2`). (Supported, but requires clustered file system like GFS2/OCFS2 managed by user. EFS is managed).
- D. ...

**Giải thích**:

- Keyword: "Hierarchical directory", "Shared storage", "Concurrent Read/Write", "Linux".
- **Amazon EFS** (NFS) là giải pháp Managed Shared Internet File System chuẩn nhất.
- EBS Multi-Attach (C) phức tạp hơn và thường dùng cho specific use cases (Cluster databases).

**Đáp án đúng**: **B**

---

## Câu 567

**Đề bài**:  A solutions architect is designing a workload that will store hourly energy consumption by business tenants in a building. The sensors will feed a database through HTTP requests that will add up usage for each tenant. The solutions architect must use managed services when possible. The workload will receive more features in the future as the solutions architect adds independent components. Which solution will meet these requirements with the LEAST operational overhead?

**Các đáp án**:

- A. **API Gateway + Lambda + DynamoDB**.
- B. ELB + EC2 + S3. (S3 not good for transactional updates "Add up usage").
- C. ... SQL Server on EC2 (High overhead).
- D. EF... (High overhead).

**Phân tích**:

- "Managed Services when possible".
- API Gateway (Managed Ingestion HTTP).
- Lambda (Managed Compute/Processing).
- DynamoDB (Managed DB). Rất hợp lý cho Time-series/Sensor data accumulation (hoặc Timestream, nhưng DynamoDB cũng ok).

**Đáp án đúng**: **A**

---

## Câu 568

**Đề bài**:  A solutions architect is designing the storage architecture for a new web application used for storing and viewing engineering drawings. All application components will be deployed on the AWS infrastructure. The application design must support caching to minimize the amount of time that users wait for the engineering drawings to load. The application must be able to store petabytes of data. Which combination of storage and caching should the solutions architect use?

**Các đáp án**:

- A. **Amazon S3 + CloudFront**.
- B. Glacier + ElastiCache (Glacier slow retrieval. ElastiCache limits).
- C. EBS + CloudFront (EBS expensive for PB).
- D. Storage Gateway...

**Giải thích**:

- **Petabytes + Viewing**: **Amazon S3** là kho lưu trữ lý tưởng (Scalable, Durable, Cheaper than EBS).
- **Caching**: **CloudFront** caches static content (drawings) edge locations -> Fast loading.

**Đáp án đúng**: **A**

---

## Câu 569

**Đề bài**:  An Amazon EventBridge rule targets a third-party API. The third-party API has not received any incoming traffic. A solutions architect needs to determine whether the rule conditions are being met and if the rule's target is being invoked. Which solution will meet these requirements?

**Các đáp án**:

- A. **CloudWatch Metrics** namespace `AWS/Events`.
  - Metrics `TriggeredRules`, `Invocations`, `FailedInvocations` giúp biết rule có match và target có được invoke thành công không.
- B. DLQ (Only if configured).
- C. CloudWatch Logs (Events don't auto log unless CloudTrail or specific logging target).
- D. CloudTrail (Only API calls to create rules/put events. Not rule triggering execution).

**Đáp án đúng**: **A**

---

## Câu 570

**Đề bài**:  A company has a large workload that runs every Friday evening. The workload runs on Amazon EC2 instances that are in two Availability Zones in the us-east-1 Region. Normally, the company must run no more than two instances at all times. However, the company wants to scale up to six instances each Friday to handle a regularly repeating increased workload. Which solution will meet these requirements with the LEAST operational overhead?

**Các đáp án**:

- A. EventBridge reminder (Manual).
- B. **Auto Scaling group scheduled action**.
- C/D. ...

**Giải thích**:

- **Scheduled Scaling**: Tính năng của ASG cho phép định nghĩa lịch (Cron job style). "Every Friday at 18:00 set Min=6". Rất phù hợp cho "Regularly repeating increased workload".

**Đáp án đúng**: **B**

---

## Câu 571

**Đề bài**:  A company is creating a REST API. The company has strict requirements for the use of TLS. The company requires TLSv1.3 on the API endpoints. The company also requires a specific public third-party certificate authority (CA) to sign the TLS certificate. Which solution will meet these requirements?

**Các đáp án**:

- A. HTTP API... (TLS 1.3 supported?).
- B. **ACM Import Certificate**? -> Option B says "Create a certificate in ACM that is signed by..." (ACM Public Certs are signed by Amazon CA. Cannot create 3rd party CA cert _in_ ACM natively/directly signed by others. Must **Import**).
- C. **Use ACM to create... Import... Create Lambda**... (Why Lambda URL? API Gateway is standard).
- Let's check TLS 1.3 support.
  - **API Gateway (REST API & HTTP API)** support TLS 1.2 by default. TLS 1.3 support on API Gateway custom domains? (Available for Regional/Edge).
  - **Import Certificate**: Để dùng Third-party CA, bắt buộc phải Import vào ACM.
  - Option B: "Create a certificate in ACM that is signed by the third-party CA". Phrasing sai. ACM issue cert signed by Amazon. Or Private CA.
  - Option A: "Use local machine to create... Import to ACM. HTTP API...". Plausible.
  - Option D: "Lambda function URL".
- **Focus on TLS 1.3**:
  - **API Gateway** supports TLS 1.2 can be enforced. TLS 1.3 is supported on CloudFront (Edge Optimized API Gateway). Regional API Gateway updated to support TLS 1.3? Yes.
  - **Key constraint**: "Specific Public Third-party CA". -> **Must Import**.
  - Option A: Create locally (CSR), Sign by CA, Import to ACM. Configure HTTP API Custom Domain. Correct flow.
  - Option B: "Create in ACM signed by 3rd party" -> Impossible.
  - Option C: "Use ACM to create... Import..." (Confusing. You create CSR usually). Lambda URL supports TLS? Lambda URL endpoint is AWS managed, uses AWS Cert. Cannot attach custom domain/cert _directly_ to Lambda URL without CloudFront.
  - Vậy **option A** là khả thi nhất theo quy trình Import Cert.

**Đáp án đúng**: **A**

---

## Câu 572

**Đề bài**:  A company runs an application on AWS. The application receives inconsistent amounts of usage. The application uses AWS Direct Connect to connect to an on-premises MySQL-compatible database. The on-premises database consistently uses a minimum of 2 GiB of memory. The company wants to migrate the on-premises database to a managed AWS service. The company wants to use auto scaling capabilities to manage unexpected workload increases. Which solution will meet these requirements with the LEAST administrative overhead?

**Các đáp án**:

- A. DynamoDB (Not compatible MySQL).
- B. Aurora (1 ACU min ~ 2GB).
- C. **Aurora Serverless v2** (Min 1 ACU).
- D. RDS MySQL (Vertical scaling needs downtime, not instant auto-scaling).

**Phân tích**:

- **Aurora Serverless v2**: Designed for "Inconsistent usage", "Unexpected workload", "Auto Scaling" (instantly up and down).
- MySQL compatible.
- Least admin overhead (Serverless).

**Đáp án đúng**: **C**

---

## Câu 573

**Đề bài**:  A company wants to use an event-driven programming model with AWS Lambda. The company wants to reduce startup latency for Lambda functions that run on Java 11. The company does not have strict latency requirements for the applications. The company wants to reduce cold starts and outlier latencies when a function scales up. Which solution will meet these requirements MOST cost-effectively?

**Các đáp án**:

- A. Provisioned Concurrency (Expensive $$ - keeps instances warm 24/7 or scheduled).
- B. Timeout (Irrelevant).
- C. Increase Memory (Helps CPU/Startup implicitly, but costs more per invocation).
- D. **Configure Lambda SnapStart**.

**Giải thích**:

- **Lambda SnapStart** (Available for Java 11/17).
- Cải thiện cold start performance lên tới 10x bằng cách snapshot memory state sau khi init.
- **Free of charge** (Không tốn thêm tiền như Provisioned Concurrency).
- Rất phù hợp cho Java application cold start reduction cost-effectively.

**Đáp án đúng**: **D**

---

## Câu 574

**Đề bài**:  A financial services company launched a new application that uses an Amazon RDS for MySQL database. The company uses the application to track stock market trends. The company needs to operate the application for only 2 hours at the end of each week. The company needs to optimize the cost of running the database. Which solution will meet these requirements MOST cost-effectively?

**Các đáp án**:

- A. **Aurora Serverless v2**. (Scales to min 0.5 ACU, but does it stop? If it doesn't pause to 0, you pay 24/7).
  - _Note_: Aurora Serverless v2 NO auto-pause to 0. (Min 0.5 ACU).
  - Aurora Serverless v1 HAS auto-pause.
- B. Aurora Cluster (Expensive).
- C. EC2 (Admin overhead, but can stop/start manually).
- D. ECS (Containers).

**Phân tích**:

- RDS có thể **Stop** instance (tối đa 7 ngày). Script start/stop RDS is common pattern.
- Option A: Aurora Serverless v2 (No pause). Cost > RDS stopped.
- Option C: EC2 MySQL.
- Is there an option for **Aurora Serverless v1**? (Sometimes questions refer to v1 features generically).
- Nếu không có Aurora Serverless v1 (Pause), thì cách rẻ nhất là **Snapshot & Terminate** hoặc **Stop RDS** (nhưng RDS auto start after 7 days).
- Đề bài: "Runs... only 2 hours at the end of each week". (Idle 166 hours).
- **Automation**?
- Option A is "Serverless". People often mistake v2 for v1 regarding Pause. If context assumes v1 (often happens in older/mixed dumps), A is best.
- But if strictly v2 (no pause), paying 0.5 ACU \* 166 hours might be more than needed.
- Let's check **Option C**: Migrate to EC2. Stop/Start EC2 is easiest manually? No.
- Option D: ECS Task. Launch container, run 2h, stop. Very cheap. But migration effort "RDS to MySql Container". Backup management?
- NẾU câu hỏi cũ: Aurora Serverless (v1) -> A.
- NẾU câu hỏi mới (v2 spec): V2 is not for "Intermittent 2h/week" cost saving unless v1 supported.
- Tuy nhiên, trong exam context, **Aurora Serverless** (generic or implication of scaling to 0) thường là đáp án cho "Infrequent/Intermittent use".
- Let's assume **A** aims at Serverless capability.

**Đáp án đúng**: **A** (With caveat about v1 vs v2).

---

## Câu 575

**Đề bài**:  A company deploys its applications on Amazon Elastic Kubernetes Service (Amazon EKS) behind an Application Load Balancer in an AWS Region. The application needs to store data in a PostgreSQL database engine. The company wants the data in the database to be highly available. The company also needs increased capacity for read workloads. Which solution will meet these requirements with the MOST operational efficiency?

**Các đáp án**:

- A. DynamoDB (Wrong DB).
- B. RDS Multi-AZ (HA yes, but Read Capacity? Standby can't read).
- C. **RDS Multi-AZ DB Cluster** deployment.
- D. Cross-Region Replica (Wrong region context).

**Giải thích**:

- **RDS Multi-AZ DB Cluster** (New feature for MySQL/Postgres). Khác với Multi-AZ Instance (1 Primary + 1 Standby).
- Multi-AZ DB Cluster: 1 Primary + 2 **Readable** Standby instances.
- Cung cấp: HA (Failover nhanh) VÀ **Read Capacity** (Load balance read traffic to standbys).

**Đáp án đúng**: **C**

---

## Câu 576

**Đề bài**:  A company is building a RESTful serverless web application on AWS by using Amazon API Gateway and AWS Lambda. The users of this web application will be geographically distributed, and the company wants to reduce the latency of API requests to these users. Which type of endpoint should a solutions architect use to meet these requirements?

**Các đáp án**:

- A. Private endpoint.
- B. Regional endpoint.
- C. Interface endpoint.
- D. **Edge-optimized endpoint**.

**Giải thích**:

- **Edge-optimized Endpoint**: Sử dụng AWS CloudFront Edge Network để route traffic từ user đến API Gateway gần nhất -> Giảm latency cho global users.

**Đáp án đúng**: **D**

---

## Câu 577

**Đề bài**:  A company uses an Amazon CloudFront distribution to serve content pages for its website. The company needs to ensure that clients use a TLS certificate when accessing the company's website. The company wants to automate the creation and renewal of the TLS certificates. Which solution will meet these requirements with the MOST operational efficiency?

**Các đáp án**:

- A. ...
- B. ...
- C. **Use ACM**. **Use DNS validation**.
- D. Use ACM. Use email validation.

**Giải thích**:

- **ACM** Public Certificate tự động renew.
- **DNS Validation** là phương pháp được khuyến nghị để support **Automatic Renewal**. (Email validation yêu cầu click link -> manual/script).
- CloudFront yêu cầu Cert ở us-east-1.

**Đáp án đúng**: **C**

---

## Câu 578

**Đề bài**:  A company deployed a serverless application that uses Amazon DynamoDB as a database layer. The application has experienced a large increase in users. The company wants to improve database response time from milliseconds to microseconds and to cache requests to the database. Which solution will meet these requirements with the LEAST operational overhead?

**Các đáp án**:

- A. **DynamoDB Accelerator (DAX)**.
- B/C. Migrate...
- D. Redis (Manage cluster, code change).

**Giải thích**:

- **DAX** chuyên trị bài toán "DynamoDB cache microseconds latency" với "Least overhead".

**Đáp án đúng**: **A**

---

## Câu 579

**Đề bài**:  A company runs an application that uses Amazon RDS for PostgreSQL. The application receives traffic only on weekdays during business hours. The company wants to optimize costs and reduce operational overhead based on this usage. Which solution will meet these requirements?

**Các đáp án**:

- A. **Instance Scheduler on AWS**.
- B. ...
- C. Custom Lambda (Effort).
- D. ...

**Giải thích**:

- **Instance Scheduler on AWS**: Là một Solution implementation sẵn có của AWS (CloudFormation stack + DynamoDB config + Lambda) để tự động Start/Stop EC2/RDS theo lịch. Tiện hơn tự viết (Option C).

**Đáp án đúng**: **A**

---

## Câu 580

**Đề bài**:  A company uses locally attached storage to run a latency-sensitive application on premises. The company is using a lift and shift method to move the application to the AWS Cloud. The company does not want to change the application architecture. Which solution will meet these requirements MOST cost-effectively?

**Các đáp án**:

- A. FSx Lustre (HPC/Parallel, costly).
- B. **EC2 + EBS GP2**.
- C. FSx OpenZFS.
- D. **EC2 + EBS GP3**.

**Phân tích**:

- Lift and shift app dùng "Locally attached storage" -> **EBS** là tương đương nhất (Block storage attached EC2).
- **GP3** rẻ hơn GP2 và performance tốt hơn (tách biệt IOPS vs Size). Cost-effective nhất.

**Đáp án đúng**: **D**

---

## Câu 581

**Đề bài**:  A company runs a stateful production application on Amazon EC2 instances. The application requires at least two EC2 instances to always be running. A solutions architect needs to design a highly available and fault-tolerant architecture for the application. The solutions architect creates an Auto Scaling group of EC2 instances. Which set of additional steps should the solutions architect take to meet these requirements?

**Các đáp án**:

- A. Min=2. 1 in AZ1, 1 in AZ2. (If AZ1 fails, we have 1 instance. Requirement says "At least 2 instances **always** running" - implies even during failure? Or N+1 redundancy?).
  - If requirement means "Total capacity must strictly be >= 2 even after 1 AZ failure": We need 2 in AZ1 and 2 in AZ2. (Total 4). So if AZ1 down, AZ2 has 2 running.
  - If requirement means "Normal operation needs 2": Option A is risky during failover (ASG needs time to launch replacement in AZ2).
- B. **Min=4. 2 in AZ1, 2 in AZ2**.
  - If AZ1 fails, AZ2 still has 2 instances. Meets "Always running" immediately without downtime gap.
- C/D. Spot Instances (Risk of termination -> Not good for "Always running" requirement without careful handling).

**Đáp án đúng**: **B** (Safety N+N redundancy).

---

## Câu 582

**Đề bài**:  An ecommerce company uses Amazon Route 53 as its DNS provider. The company hosts its website on premises and in the AWS Cloud. The company's on-premises data center is near the us-west-1 Region. The company uses the eu-central-1 Region to host the website. The company wants to minimize load time for the website as much as possible. Which solution will meet these requirements?

**Các đáp án**:

- A. Geolocation (Based on location, not latency usually. But close proxy).
- B. Simple (No logic).
- C. **Latency Routing Policy**.
- D. Weighted (Traffic split).

**Giải thích**:

- **Latency Routing Policy**: Route 53 đo network latency từ user tới các endpoint (Region/Context) và trả về IP có lowest latency. Đây là cách chuẩn để "minimize load time". (Associate policy with region).

**Đáp án đúng**: **C**

---

## Câu 583

**Đề bài**:  A company has 5 PB of archived data on physical tapes. The company needs to preserve the data on the tapes for another 10 years for compliance purposes. The company wants to migrate to AWS in the next 6 months. The data center that stores the tapes has a 1 Gbps uplink internet connectivity. Which solution will meet these requirements MOST cost-effectively?

**Các đáp án**:

- A. DataSync (Online transfer 5 PB over 1 Gbps takes ~1.5 years. Too slow for 6 months deadline).
- B. Backup App direct upload (Same network limit).
- C. **Order multiple AWS Snowball devices with Tape Gateway**.
- D. On-prem Tape Gateway (Network limit).

**Giải thích**:

- **Snowball Edge**: Offline data transfer. Chuyển 5PB cần nhiều device nhưng nhanh hơn mạng 1Gbps.
- Snowball support **Tape Gateway** migration (copy tape physical sang virtual tape trên snowball -> import S3 Glacier Deep Archive).

**Đáp án đúng**: **C**

---

## Câu 584

**Đề bài**:  A company is deploying an application that processes large quantities of data in parallel. The company plans to use Amazon EC2 instances for the workload. The network architecture must be configurable to prevent groups of nodes from sharing the same underlying hardware. Which networking solution meets these requirements?

**Các đáp án**:

- A. **Spread Placement Group**.
- B. Separate Accounts (Sharing hardware possible).
- C. Dedicated Tenancy (Ensures single tenant, but doesn't necessarily "spread" across racks specifically like Spread Group designed for correlation failure avoidance).
- D. Shared Tenancy.

**Phân tích**:

- **Spread Placement Group**: Đặt các instances trên các Rack khác nhau (hardware failure domain distinct). Phù hợp "Prevent sharing same underlying hardware" để tránh correlated failures (Power/Network).
- **Dedicated Hosts/Tenancy**: Đảm bảo hardware là của riêng bạn, nhưng nếu tất cả nằm trên 1 Dedicated Host to đùng thì vẫn fail cùng lúc. Spread group phân tán rủi ro.

**Đáp án đúng**: **A**

---

## Câu 585

**Đề bài**:  A solutions architect is designing a disaster recovery (DR) strategy to provide Amazon EC2 capacity in a failover AWS Region. Business requirements state that the DR strategy must meet capacity in the failover Region. Which solution will meet these requirements?

**Các đáp án**:

- A. On-Demand (No capacity guarantee).
- B. Savings Plan (Billing benefit, no capacity guarantee).
- C. Regional Reserved Instances (Billing benefit, NO capacity guarantee. Only _Zonal_ RIs guarantee capacity).
- D. **Capacity Reservation** (ODCR).

**Giải thích**:

- **On-Demand Capacity Reservation**: Chỉ tính năng này mới cam kết 100% có hardware capacity dành riêng cho bạn tại Region/AZ đích.

**Đáp án đúng**: **D**

---

## Câu 586

**Đề bài**:  A company has five organizational units (OUs) as part of its organization in AWS Organizations. Each OU correlates to the five businesses that the company owns. The company's research and development (R&D) business is separating from the company and will need its own organization. A solutions architect creates a separate new management account for this purpose. What should the solutions architect do next in the new management account?

**Các đáp án**:

- A. ...
- B. **Invite the R&D AWS account** to be part of the new organization **after the R&D AWS account has left the prior organization**.
- C. Create new account... Migrate (Hard).
- D. ...

**Giải thích**:

- 1 Account chỉ thuộc về 1 Organization tại 1 thời điểm.
- Quy trình: Remove R&D Account khỏi Org cũ -> Invite R&D Account vào Org mới (New Management Account gửi invite).

**Đáp án đúng**: **B**

---

## Câu 587

**Đề bài**:  A company is designing a solution to capture customer activity in different web applications to process analytics and make predictions. Customer activity in the web applications is unpredictable and can increase suddenly. The company requires a solution that integrates with other web applications. The solution must include an authorization step for security purposes. Which solution will meet these requirements?

**Các đáp án**:

- A. GWLB... (Complex).
- B. API Gateway -> Kinesis Stream -> Lambda Authorizer? (Lambda resolves auth in API Gateawy).
- C. **API Gateway** -> **Kinesis Data Firehose**. Use **API Gateway Lambda Authorizer**.
- D. ...

**Phân tích**:

- Requirement "Authorization". **API Gateway Lambda Authorizer** (Custom Authorizer) kiểm tra token/header trước khi request đi tiếp.
- Requirement "Process analytics... store S3" (implied by Firehose/Stream destination options).
- **Firehose**: Direct ingest to S3.
- **Kinesis Stream**: Cần consumer.
- Option C: API Gateway -> Firewall/Proxy -> Firehose? API Gateway can proxy to AWS services directly.
- Mô hình: Client -> API Gateway (AuthZ) -> Kinesis Firehose -> S3. Efficient.

**Đáp án đúng**: **C**

---

## Câu 588

**Đề bài**:  An ecommerce company wants a disaster recovery solution for its Amazon RDS DB instances that run Microsoft SQL Server Enterprise Edition. The company's current recovery point objective (RPO) and recovery time objective (RTO) are 24 hours. Which solution will meet these requirements MOST cost-effectively?

**Các đáp án**:

- A. Cross-Region Read Replica (Enterprise License on Replica -> Expensive. RTO/RPO 24h is loose, Replica is overkill (Seconds)).
- B. DMS (Complex).
- C. **Cross-Region Replication of Native Backups to S3**.
- D. Copy automatic snapshots (Option D usually "Copy snapshot to another region").
  - RDS SQL Server supports **Automated Cross-Region Automated Backups** (Replicates snapshots and logs).
  - Or "Copy Snapshot" manually/scheduled.
  - Option C "Copy native backups to S3". SQL Server Native Backup (.bak) to S3. This is a feature. But Automated Snapshots are managed easier.
  - **Cost**: Snapshot copy rẻ hơn chạy Replica instance 24/7 (Option A).
  - Giữa C (.bak S3) và D (Snapshot).
  - AWS Backup or RDS Automated Backup Cross-Region is standard. Option D "Copy automatic snapshots" seems to describe this.

**Đáp án đúng**: **D**

---

## Câu 589

**Đề bài**:  A company runs a web application on Amazon EC2 instances in an Auto Scaling group behind an Application Load Balancer that has sticky sessions enabled. The web server currently hosts the user session state. The company wants to ensure high availability and avoid user session state loss in the event of a web server outage. Which solution will meet these requirements?

**Các đáp án**:

- A. Memcached (No Replication High Availability typical mode presented as simply as Redis).
- B. **ElastiCache for Redis**. (Support High Availability/Replication). Update App to store session there.
- C. Storage Gateway (No).
- D. RDS (Too slow for session usually, Redis preferred).

**Đáp án đúng**: **B**

---

## Câu 590

**Đề bài**:  A company migrated a MySQL database from the company's on-premises data center to an Amazon RDS for MySQL DB instance. The company sized the RDS DB instance to meet the company's average daily workload. Once a month, the database performs slowly when the company runs queries for a report. The company wants to have the ability to run reports and maintain the performance of the daily workloads. Which solution will meet these requirements?

**Các đáp án**:

- A. **Create Read Replica**. Direct report queries there.
- B. Restore backup... (Stale data for report?).
- C. Athena (Complexity export).
- D. Resize (Overprovision for whole month just for 1 day report -> Costly).

**Đáp án đúng**: **A**

---

## Câu 591

**Đề bài**:  A company runs a container application by using Amazon Elastic Kubernetes Service (Amazon EKS). The application includes microservices that manage customers and place orders. The company needs to route incoming requests to the appropriate microservices. Which solution will meet this requirement MOST cost-effectively?

**Các đáp án**:

- A. NLB (Layer 4, no path routing).
- B. **AWS Load Balancer Controller** to provision **ALB**. (Layer 7 Ingress -> Path based routing to services).
- C. Lambda (Overhead).
- D. API Gateway (Cost > ALB usually for high volume intra-app).

**Đáp án đúng**: **B**

---

## Câu 592

**Đề bài**:  A company uses AWS and sells access to copyrighted images. The company’s global customer base needs to be able to access these images quickly. The company must deny access to users from specific countries. The company wants to minimize costs as much as possible. Which solution will meet these requirements?

**Các đáp án**:

- A. S3 Bucket Policy? (No Geo condition easily maintained).
- B. IAM User (Too many users).
- C. EC2 (Expensive).
- D. **CloudFront with Geographic Restrictions**. (Geo Blocking).

**Đáp án đúng**: **D**

---

## Câu 593

**Đề bài**:  A solutions architect is designing a highly available Amazon ElastiCache for Redis based solution. The solutions architect needs to ensure that failures do not result in performance degradation or loss of data locally and within an AWS Region. The solution needs to provide high availability at the node level and at the Region level. Which solution will meet these requirements?

**Các đáp án**:

- A. **Multi-AZ Redis replication groups**. (Auto failover primary->replica).
- B. ...
- C. ...

**Đáp án đúng**: **A**

---

## Câu 594

**Đề bài**:  A company plans to migrate to AWS and use Amazon EC2 On-Demand Instances for its application. During the migration testing phase, a technical team observes that the application takes a long time to launch and load memory to become fully productive. Which solution will reduce the launch time of the application during the next testing phase?

**Các đáp án**:

- A. ...
- B. ...
- C. **Launch On-Demand with Hibernation enabled**. Use **Warm Pools**? Or just Hibernate.
  - **Hibernation**: Pre-warm app, save memory state to disk. Stop instance. Start > Resume from memory state (Fast).
  - Phù hợp yêu cầu "fully productive" quickly after launch (thực tế là resume).
- D. ...

**Đáp án đúng**: **C** (Hibernation).

---

## Câu 595

**Đề bài**:  A company's applications run on Amazon EC2 instances in Auto Scaling groups. The company notices that its applications experience sudden traffic increases on random days of the week. The company wants to maintain application performance during sudden traffic increases. Which solution will meet these requirements MOST cost-effectively?

**Các đáp án**:

- A. Manual (Too slow).
- B. Predictive (Needs patterns).
- C. **Dynamic Scaling** (Target Tracking). Reacts to load.
- D. Scheduled (Random days -> No schedule).

**Đáp án đúng**: **C**

---

## Câu 596

**Đề bài**:  An ecommerce application uses a PostgreSQL database that runs on an Amazon EC2 instance. During a monthly sales event, database usage increases and causes database connection issues for the application. The traffic is unpredictable for subsequent monthly sales events, which impacts the sales forecast. The company needs to maintain performance when there is an unpredictable increase in traffic. Which solution resolves this issue in the MOST cost-effective way?

**Các đáp án**:

- A. **Aurora Serverless v2**. (Auto-scale capacity instantly to handle load without connection limits issue of static instance size).
- B. Auto Scaling PostgreSQL on EC2? (Hard to implement vertically).
- C. RDS (Still connection limit per instance size).
- D. Redshift (OLAP).

**Đáp án đúng**: **A** (Or RDS Proxy to handle connections? But Auto Scaling capacity also needed. Serverless v2 solves both capacity and connection scaling typically).

---

## Câu 597

**Đề bài**:  A company hosts an internal serverless application on AWS by using Amazon API Gateway and AWS Lambda. The company’s employees report issues with high latency when they begin using the application each day. The company wants to reduce latency. Which solution will meet these requirements?

**Các đáp án**:

- A. Throttling (No).
- B. **Scheduled scaling to increase Lambda Provisioned Concurrency**. (Warm up before employees start work).
- C. ...
- D. ...

**Đáp án đúng**: **B**

---

## Câu 598

**Đề bài**:  A research company uses on-premises devices to generate data for analysis. The company wants to use the AWS Cloud to analyze the data. The devices generate .csv files and support writing the data to an SMB file share. Company analysts must be able to use SQL commands to query the data. The analysts will run queries periodically throughout the day. Which combination of steps will meet these requirements MOST cost-effectively? (Choose three.)

**Các đáp án**:

- A. **File Gateway (S3 File Gateway)**. (Expose SMB, store in S3).
- B. FSx File Gateway (More expensive).
- C. Glue Crawler... (To build catalog). -> Need S3 data first.
- F. **Athena**. (Query S3).
- Step: 1. Ingest (File Gateway A). 2. Catalog (Glue C). 3. Query (Athena F).

**Đáp án đúng**: **A, C, F** (Assuming option list allows choosing 3).

---

## Câu 599

**Đề bài**:  A company wants to use Amazon Elastic Container Service (Amazon ECS) clusters and Amazon RDS DB instances to build and run a payment processing application. The company will run the application in its on-premises data center for compliance purposes. A solutions architect wants to use AWS Outposts as part of the solution. The solutions architect is working with the company's operational team to build the application. Which activities are the responsibility of the company's operational team? (Choose three.)

**Các đáp án**:

- A. **Power and Network**. (Customer responsibility).
- B. Hypervisor (AWS managed).
- C. **Physical security**. (Customer responsibility).
- D. Hardware availability (AWS managed? AWS provides hardware, but Customer ensures environment/power stability).
- E. **Physical maintenance**? (No, AWS replaces broken hardware. But Customer must allow access/swap?). Wait.
  - AWS Shared Responsibility Model for Outposts:
  - **AWS**: Outpost equipment, Rack, Analytics, Upgrades, Region connectivity.
  - **Customer**: Power, Network, Space, Environmental (Cooling), Physical Security.
  - Option A (Power/Net): **YES**.
  - Option C (Physical Security): **YES**.
  - Option E (Physical Maintenance): "AWS is responsible for maintenance of the equipment". Customer just grants access.
  - What is the 3rd one? "Availability of Outposts infrastructure including... networking equipment...". This is AWS side?
  - Let's re-read A, B, C, D, E, F.
  - F. **Providing extra capacity for ECS**? (Capacity management on Outposts is Customer responsibility - you bought the rack. If it's full, you need to order more. AWS manages the _service_ availability, but _capacity_ planning is yours).
  - Let's check "Physical maintenance". AWS sends technician.
  - So: **A**, **C**, and **F**? Or **D**?
  - "Availability of Outposts infrastructure... within the racks". AWS responsibility.
  - So **A, C** are certain.
  - Between E and F. E is AWS. F is Customer (Resource management).

**Đáp án đúng**: **A, C, F**

---

## Câu 600

**Đề bài**:  A company is planning to migrate a TCP-based application into the company's VPC. The application is publicly accessible on a nonstandard TCP port through a hardware appliance in the company's data center. This public endpoint can process up to 3 million requests per second with low latency. The company requires the same level of performance for the new public endpoint in AWS. What should a solutions architect recommend to meet this requirement?

**Các đáp án**:

- A. **Network Load Balancer (NLB)**.
- B. ALB (HTTP/HTTPS only - fails TCP requirement).
- C. CloudFront (TCP support limited, mostly HTTP or specified ports. High throughput non-standard TCP -> NLB is best).
- D. API Gateway (HTTP).

**Giải thích**:

- **NLB**:
  - Support **TCP/UDP/TLS**.
  - **Millions of requests per second**.
  - **Low latency**.
  - Support **Non-standard ports**.
  - Perfect replacement cho Hardware Load Balancer.

**Đáp án đúng**: **A**

---
