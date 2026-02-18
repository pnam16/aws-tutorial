# AWS Certification Exam Questions 301-350

Tài liệu được biên soạn chi tiết với giải thích bằng tiếng Việt, giúp bạn hiểu sâu về các dịch vụ AWS.

---

## Câu 301

**Đề bài**:  A university research laboratory needs to migrate 30 TB of data from an on-premises Windows file server to Amazon FSx for Windows File Server. The laboratory has a 1 Gbps network link that many other departments in the university share. The laboratory wants to implement a data migration service that will maximize the performance of the data transfer. However, the laboratory needs to be able to control the amount of bandwidth that the service uses to minimize the impact on other departments. The data migration must take place within the next 5 days. Which AWS solution will meet these requirements?

**Các đáp án**:

- A. Snowcone (Capacity 8TB/14TB -> Not enough 30TB within 5 days round trip).
- B. FSx File Gateway (Cache, not migration tool).
- C. AWS DataSync.
- D. Transfer Family (FTP/SFTP).

**Đáp án đúng**: **C**

**Giải thích chi tiết**:

- **C - ĐÚNG**: **AWS DataSync**.
  - Chuyên dụng cho online data migration.
  - Hỗ trợ SMB -> FSx for Windows.
  - Hỗ trợ **Bandwidth Throttling** (Giới hạn băng thông sử dụng) -> Đáp ứng requirement "Control bandwidth usage".
  - 30TB qua 1Gbps (lý thuyết ~3 ngày max speed, nếu throttle 50% vẫn kịp 5-6 ngày, hoặc throttle 70% OK). DataSync protocol tối ưu hóa performance rất tốt.

---

## Câu 302

**Đề bài**:  A company wants to create a mobile app that allows users to stream slow-motion video clips on their mobile devices. Currently, the app captures video clips and uploads the video clips in raw format into an Amazon S3 bucket. The app retrieves these video clips directly from the S3 bucket. However, the videos are large in their raw format. Users are experiencing issues with buffering and playback on mobile devices. The company wants to implement solutions to maximize the performance and scalability of the app while minimizing operational overhead. Which combination of solutions will meet these requirements? (Choose two.)

**Các đáp án**:

- A. Deploy Amazon CloudFront for content delivery and caching.
- B. DataSync replicate... (Replication doesn't solve file size/format issue).
- C. Use Amazon Elastic Transcoder to convert the video files to more appropriate formats. (Elastic Transcoder is older service, MediaConvert is newer, but logic applies. Transcoding reduces size).
- D. Local Zones... (Complex).
- E. ASG EC2 convert... (Operational overhead high).

**Đáp án đúng**: **A, C**

**Giải thích chi tiết**:

- **C - ĐÚNG**: **Elastic Transcoder** (hoặc MediaConvert). Convert file Raw (lớn) sang format optimized cho mobile (HLS/DASH, size nhỏ hơn) -> Giải quyết vấn đề Buffering do file quá nặng. Fully managed (Min overhead).
- **A - ĐÚNG**: **CloudFront**. Caching và delivery nội dung tải video từ Edge location gần user nhất -> Maximize Performance & Scalability.

---

## Câu 303

**Đề bài**:  A company is launching a new application deployed on an Amazon Elastic Container Service (Amazon ECS) cluster and is using the Fargate launch type for ECS tasks. The company is monitoring CPU and memory usage because it is expecting high traffic to the application upon its launch. However, the company wants to reduce costs when utilization decreases. What should a solutions architect recommend?

**Các đáp án**:

- A. EC2 Auto Scaling (Fargate doesn't use EC2 Auto Scaling directly for tasks).
- B. Lambda... (Manual).
- C. EC2 Auto Scaling...
- D. Use AWS Application Auto Scaling with target tracking policies to scale when ECS metric breaches trigger an Amazon CloudWatch alarm.

**Đáp án đúng**: **D**

**Giải thích chi tiết**:

- **D - ĐÚNG**: **Application Auto Scaling**.
  - ECS Service (Fargate) dùng Application Auto Scaling.
  - **Target Tracking Policy** (ví dụ: Maintain Avg CPU 50%) tự động Scale Out khi traffic tăng và Scale In khi traffic giảm (Reduce costs). Automate hoàn toàn.

---

## Câu 304

**Đề bài**:  A company recently created a disaster recovery site in a different AWS Region. The company needs to transfer large amounts of data back and forth between NFS file systems in the two Regions on a periodic basis. Which solution will meet these requirements with the LEAST operational overhead?

**Các đáp án**:

- A. Use AWS DataSync.
- B. Snowball (Offline/Slow).
- C. SFTP (Manual setup).
- D. DMS (Database only).

**Đáp án đúng**: **A**

**Giải thích chi tiết**:

- **A - ĐÚNG**: **AWS DataSync**.
  - Hỗ trợ chuyển dữ liệu giữa các **NFS Server** (hoặc EFS-to-EFS cross-region).
  - Fully managed, automated, periodic schedules.
  - Operational overhead gần như bằng 0 so với setup EC2/SFTP.

---

## Câu 305

**Đề bài**:  A company is designing a shared storage solution for a gaming application that is hosted in the AWS Cloud. The company needs the ability to use SMB clients to access data. The solution must be fully managed. Which AWS solution meets these requirements?

**Các đáp án**:

- A. DataSync (Migration tool).
- B. EC2 Windows (Self-managed).
- C. Create an Amazon FSx for Windows File Server file system. Attach the file system to the origin server. Connect the application server to the file system.
- D. S3 (Object storage, not native SMB).

**Đáp án đúng**: **C**

**Giải thích chi tiết**:

- **C - ĐÚNG**: **FSx for Windows File Server**.
  - Native SMB protocol support.
  - Fully managed service.
  - Đáp ứng hoàn hảo requirement.

---

## Câu 306

**Đề bài**:  A company wants to run an in-memory database for a latency-sensitive application that runs on Amazon EC2 instances. The application processes more than 100,000 transactions each minute and requires high network throughput. A solutions architect needs to provide a costeffective network design that minimizes data transfer charges. Which solution meets these requirements?

**Các đáp án**:

- A. Launch all EC2 instances in the same Availability Zone within the same AWS Region. Specify a placement group with cluster strategy when launching EC2 instances.
- B. Different AZs... (Data transfer charges apply across AZs).
- C. ...
- D. ...

**Đáp án đúng**: **A**

**Giải thích chi tiết**:

- **A - ĐÚNG**:
  - **Same Availability Zone**: Data transfer trong cùng AZ là Free (Private IP). (Khác AZ tính phí).
  - **Cluster Placement Group**: Tối ưu hóa network latency thấp nhất và throughput cao nhất giữa các instances (Low-latency/High-throughput requirement).

---

## Câu 307

**Đề bài**:  A company that primarily runs its application servers on premises has decided to migrate to AWS. The company wants to minimize its need to scale its Internet Small Computer Systems Interface (iSCSI) storage on premises. The company wants only its recently accessed data to remain stored locally. Which AWS solution should the company use to meet these requirements?

**Các đáp án**:

- A. S3 File Gateway (File interface: NFS/SMB - Đề bài hỏi iSCSI).
- B. Tape Gateway (VTL - Backup).
- C. Volume Gateway Stored Volumes (All data local).
- D. AWS Storage Gateway Volume Gateway cached volumes.

**Đáp án đúng**: **D**

**Giải thích chi tiết**:

- **D - ĐÚNG**: **Cached Volume Gateway**.
  - Interface: **iSCSI**.
  - Cơ chế: Lưu toàn bộ data trên S3, chỉ cache **"Recently accessed data"** ở local disk.
  - Giúp "Minimize need to scale on-prem storage" vì data chính nằm trên Cloud, local chỉ cần disk cho cache.

---

## Câu 308

**Đề bài**:  A company has multiple AWS accounts that use consolidated billing. The company runs several active high performance Amazon RDS for Oracle On-Demand DB instances for 90 days. The company’s finance team has access to AWS Trusted Advisor in the consolidated billing account and all other AWS accounts. The finance team needs to use the appropriate AWS account to access the Trusted Advisor check recommendations for RDS. The finance team must review the appropriate Trusted Advisor check to reduce RDS costs. Which combination of steps should the finance team take to meet these requirements? (Choose two.)

**Các đáp án**:

- A. ...
- B. Use the Trusted Advisor recommendations from the **consolidated billing account** (Management Account) to see all RDS instance checks at the same time. (Trusted Advisor in Management Account with Business Support can view aggregated data? Feature "Organizational View" exists).
- C. Review the Trusted Advisor check for Amazon RDS Reserved Instance Optimization.
- D. Idle DB Instances. (Running active -> not idle).
- E. Redshift...

**Đáp án đúng**: **B, C**

**Giải thích chi tiết**:

- **B - ĐÚNG**: Với AWS Organizations (Consolidated Billing), account quản lý (Payer Account) có thể xem được Trusted Advisor recommendations (đặc biệt là RI recommendations) tổng hợp cho các linked accounts.
- **C - ĐÚNG**: Check **"Amazon RDS Reserved Instance Optimization"** sẽ recommend mua RI dựa trên lịch sử usage (90 days running On-Demand -> Recommendation mua RI sẽ xuất hiện).

---

## Câu 309

**Đề bài**:  A solutions architect needs to optimize storage costs. The solutions architect must identify any Amazon S3 buckets that are no longer being accessed or are rarely accessed. Which solution will accomplish this goal with the LEAST operational overhead?

**Các đáp án**:

- A. Analyze bucket access patterns by using the **S3 Storage Lens** dashboard for advanced activity metrics.
- B. S3 Dashboard (Basic info only).
- C. CloudWatch BucketSizeBytes (Only size, not access pattern).
- D. CloudTrail... (Analyze logs manual overhead).

**Đáp án đúng**: **A**

**Giải thích chi tiết**:

- **A - ĐÚNG**: **S3 Storage Lens**.
  - Công cụ analytics mạnh mẽ tích hợp sẵn trong Console.
  - Cung cấp **"Free Metrics"** bao gồm summary usage.
  - Advanced Metrics (Paid) cung cấp **"Activity Metrics"** (GetRequests count, last access...) cho từng bucket, giúp identify "Cold" buckets dễ dàng qua Dashboard trực quan. Least overhead.

---

## Câu 310

**Đề bài**:  A company sells datasets to customers who do research in artificial intelligence and machine learning (AI/ML). The datasets are large, formatted files that are stored in an Amazon S3 bucket in the us-east-1 Region. The company hosts a web application that the customers use to purchase access to a given dataset. The web application is deployed on multiple Amazon EC2 instances behind an Application Load Balancer. After a purchase is made, customers receive an S3 signed URL that allows access to the files. The customers are distributed across North America and Europe. The company wants to reduce the cost that is associated with data transfers and wants to maintain or improve performance. What should a solutions architect do to meet these requirements?

**Các đáp án**:

- A. S3 Transfer Acceleration (Faster upload, but download potentially faster. Cost higher: Data Transfer + Acceleration fee. Not reduce cost).
- B. Deploy an Amazon CloudFront distribution with the existing S3 bucket as the origin. Direct customer requests to the CloudFront URL. Switch to CloudFront signed URLs for access control.
- C. Cross-Region Replication to eu-central-1... (Cost: Storage x2, Replication transfer. Reduce inter-region transfer for EU users, but CloudFront is usually cheaper/better for global delivery).
- D. Streaming... (Complex).

**Đáp án đúng**: **B**

**Giải thích chi tiết**:

- **B - ĐÚNG**: **CloudFront**.
  - **Performace**: Cache content tại Edge (Europe/NA). Large file download nhanh hơn S3 direct cross-region.
  - **Cost**: Data Transfer Out từ CloudFront rẻ hơn (hoặc tương đương) S3 direct Internet. Quan trọng là **Data Transfer from S3 to CloudFront** là Free. User download từ CF nếu hit cache thì tiết kiệm S3 request cost.
  - **Access Control**: Chuyển sang **CloudFront Signed URLs** thay vì S3 Signed URLs là best practice khi dùng CDN.

---

## Câu 311

**Đề bài**:  A company is using AWS to design a web application that will process insurance quotes. Users will request quotes from the application. Quotes must be separated by quote type, must be responded to within 24 hours, and must not get lost. The solution must maximize operational efficiency and must minimize maintenance. Which solution meets these requirements?

**Các đáp án**:

- A. Kinesis Data Streams (Requires KCL/Sharding management, heavy for simple quote request).
- B. Lambda per type + SNS...
- C. Create a single Amazon Simple Notification Service (Amazon SNS) topic. Subscribe Amazon Simple Queue Service (Amazon SQS) queues to the SNS topic. Configure SNS message filtering to publish messages to the proper SQS queue based on the quote type. Configure each backend application server to use its own SQS queue.
- D. Firehose... (Archive/Analytics focus).

**Đáp án đúng**: **C**

**Giải thích chi tiết**:

- **C - ĐÚNG**: **Fanout Pattern (SNS + SQS)**.
  - **Single Entpoint (SNS)** nhận mọi request.
  - **Message Filtering**: SNS filter dựa trên attribute `quote_type` để đẩy vào đúng **SQS Queue** riêng biệt (Auto/Home/Life...).
  - **Processing**: Worker server lấy từ SQS xử lý.
  - Đảm bảo "No lost" (SQS durable), "Separated by type", Decoupled. Highly scalable & Maintainable.

---

## Câu 312

**Đề bài**:  A company has an application that runs on several Amazon EC2 instances. Each EC2 instance has multiple Amazon Elastic Block Store (Amazon EBS) data volumes attached to it. The application’s EC2 instance configuration and data need to be backed up nightly. The application also needs to be recoverable in a different AWS Region. Which solution will meet these requirements in the MOST operationally efficient way?

**Các đáp án**:

- A. Lambda snapshot copy... (Manual maintenance of scripts).
- B. Create a backup plan by using AWS Backup to perform nightly backups. Copy the backups to another Region. Add the application’s EC2 instances as resources.
- C. AWS Backup... EBS volumes... (Backing up EC2 instance creates full AMI including parameters, better for recovery than just EBS).
- D. Lambda... (Availability Zone copy is not Region copy).

**Đáp án đúng**: **B**

**Giải thích chi tiết**:

- **B - ĐÚNG**: **AWS Backup**.
  - Managed service. Policy-based.
  - Hỗ trợ **Cross-Region Copy** tự động.
  - Backup resource type **EC2 Instance** sẽ tạo AMI, giúp recovery cả instance config + volumes -> Efficient hơn chỉ backup EBS (Option C).

---

## Câu 313

**Đề bài**:  A company is building a mobile app on AWS. The company wants to expand its reach to millions of users. The company needs to build a platform so that authorized users can watch the company’s content on their mobile devices. What should a solutions architect recommend to meet these requirements?

**Các đáp án**:

- A. S3 Public + KMS... (Public S3 is risky, scaling KMS decrypt for millions is expensive/throttled).
- B. IPsec VPN (Impossible for millions of users).
- C. Use Amazon CloudFront. Provide signed URLs to stream content.
- D. Client VPN (Limits, Costly).

**Đáp án đúng**: **C**

**Giải thích chi tiết**:

- **C - ĐÚNG**: **CloudFront Signed URLs**.
  - Giải pháp chuẩn để phân phối nội dung media (Stream) cho người dùng toàn cầu.
  - **Signed URLs**: Kiểm soát quyền truy cập ("Authorized users only"). Application server generate URL cho user đã login.
  - Scalable lên millions users dễ dàng.

---

## Câu 314

**Đề bài**:  A company has an on-premises MySQL database used by the global sales team with infrequent access patterns. The sales team requires the database to have minimal downtime. A database administrator wants to migrate this database to AWS without selecting a particular instance type in anticipation of more users in the future. Which service should a solutions architect recommend?

**Các đáp án**:

- A. Aurora MySQL (Provisioned).
- B. Amazon Aurora Serverless for MySQL.
- C. Redshift... (Analytics).
- D. RDS MySQL (Provisioned).

**Đáp án đúng**: **B**

**Giải thích chi tiết**:

- **B - ĐÚNG**: **Aurora Serverless**.
  - **Infrequent access**: Tự động scale down (pause) khi không dùng -> Tiết kiệm tiền.
  - **"Without selecting instance type"**: Serverless không cần chọn instance class (tự add ACUs). Tự động scale up khi "more users in future".
  - Minimal downtime migration bằng DMS/Backup restore.

---

## Câu 315

**Đề bài**:  A company experienced a breach that affected several applications in its on-premises data center. The attacker took advantage of vulnerabilities in the custom applications that were running on the servers. The company is now migrating its applications to run on Amazon EC2 instances. The company wants to implement a solution that actively scans for vulnerabilities on the EC2 instances and sends a report that details the findings. Which solution will meet these requirements?

**Các đáp án**:

- A. Shield (DDoS).
- B. Macie (S3 data sensitivity).
- C. GuardDuty (Threat detection - Network flow/Logs, not vuln scan OS).
- D. Turn on Amazon Inspector. Deploy the Amazon Inspector agent (old version) / Systems Manager Agent (new version). Configure an AWS Lambda function to automate the generation and distribution of reports that detail the findings.

**Đáp án đúng**: **D**

**Giải thích chi tiết**:

- **D - ĐÚNG**: **Amazon Inspector**.
  - Service chuyên dụng để "Automated security assessment" và **Scan vulnerabilities (CVE)** trên EC2 instances.
  - Automation report qua Lambda (Generate PDF report hoặc notify).

---

## Câu 316

**Đề bài**:  A company uses an Amazon EC2 instance to run a script to poll for and process messages in an Amazon Simple Queue Service (Amazon SQS) queue. The company wants to reduce operational costs while maintaining its ability to process a growing number of messages that are added to the queue. What should a solutions architect recommend to meet these requirements?

**Các đáp án**:

- A. Increase size (Cost increase).
- B. EventBridge turn off... (Complex logic).
- C. Migrate the script on the EC2 instance to an AWS Lambda function with the appropriate runtime.
- D. SSM Run Command...

**Đáp án đúng**: **C**

**Giải thích chi tiết**:

- **C - ĐÚNG**: **Lambda with SQS Trigger**.
  - **Serverless**: Không tốn tiền EC2 chạy idle khi queue rỗng -> Reduce operational costs.
  - **Scalable**: Lambda tự động scale up concurrent instances để xử lý "growing number of messages".
  - Không cần quản lý polling script thủ công.

---

## Câu 317

**Đề bài**:  A company uses a legacy application to produce data in CSV format. The legacy application stores the output data in Amazon S3. The company is deploying a new commercial off-the-shelf (COTS) application that can perform complex SQL queries to analyze data that is stored in Amazon Redshift and Amazon S3 only. However, the COTS application cannot process the .csv files that the legacy application produces. The company cannot update the legacy application to produce data in another format. The company needs to implement a solution so that the COTS application can use the data that the legacy application produces. Which solution will meet these requirements with the LEAST operational overhead?

**Các đáp án**:

- A. Create an AWS Glue extract, transform, and load (ETL) job that runs on a schedule. Configure the ETL job to process the .csv files and store the processed data in Amazon Redshift.
- B. Python script EC2 (Manage server).
- C. Lambda ETL... DynamoDB (App needs Redshift/S3 SQL, not DynamoDB).
- D. EMR... (Overhead).

**Đáp án đúng**: **A** (Hoặc dùng Glue Crawler + Athena view nếu App support Athena, nhưng đề bài nói "Analyze data stored in Redshift and S3 only"). App cần data ở Redshift/Format khác.
Glue ETL Job convert CSV -> Parquet/Redshift table là giải pháp chuẩn managed.
Option A convert CSV -> Redshift load là đúng nhu cầu COTS app.

---

## Câu 318

**Đề bài**:  A company recently migrated its entire IT environment to the AWS Cloud. The company discovers that users are provisioning oversized Amazon EC2 instances and modifying security group rules without using the appropriate change control process. A solutions architect must devise a strategy to track and audit these inventory and configuration changes. Which actions should the solutions architect take to meet these requirements? (Choose two.)

**Các đáp án**:

- A. Enable AWS CloudTrail and use it for auditing.
- B. ...
- C. ...
- D. Enable AWS Config and create rules for auditing and compliance purposes.
- E. ...

**Đáp án đúng**: **A, D**

**Giải thích chi tiết**:

- **A - ĐÚNG**: **CloudTrail**. Track **"Who made the change"** (API calls: RunInstances, AuthorizeSecurityGroupIngress...). Audit user activity.
- **D - ĐÚNG**: **AWS Config**. Track **"Configuration History"** (Snapshot cấu hình tài nguyên theo thời gian) và **Compliance Rules** (Ví dụ: SG không được mở port 22, EC2 type phải là allowed types).

---

## Câu 319

**Đề bài**:  A company has hundreds of Amazon EC2 Linux-based instances in the AWS Cloud. Systems administrators have used shared SSH keys to manage the instances. After a recent audit, the company’s security team is mandating the removal of all shared keys. A solutions architect must design a solution that provides secure access to the EC2 instances. Which solution will meet this requirement with the LEAST amount of administrative overhead?

**Các đáp án**:

- A. Use AWS Systems Manager Session Manager to connect to the EC2 instances.
- B. AWS STS SSH keys (EC2 Instance Connect idea? But SSM is less overhead/more secure logging).
- C. Bastion (Manage extra instance/keys).
- D. Cognito... (Custom).

**Đáp án đúng**: **A**

**Giải thích chi tiết**:

- **A - ĐÚNG**: **Session Manager**.
  - Không cần SSH Key (loại bỏ shared keys).
  - Không cần mở port 22 (Security).
  - Authentication qua IAM Role/User.
  - Audit log đầy đủ session activity.
  - Least administrative overhead (Managed service agent default on Amazon Linux 2).

---

## Câu 320

**Đề bài**:  A company is using a fleet of Amazon EC2 instances to ingest data from on-premises data sources. The data is in JSON format and ingestion rates can be as high as 1 MB/s. When an EC2 instance is rebooted, the data in-flight is lost. The company’s data science team wants to query ingested data in near-real time. Which solution provides near-real-time data querying that is scalable with minimal data loss?

**Các đáp án**:

- A. Publish data to Amazon Kinesis Data Streams, Use Kinesis Data Analytics to query the data.
- B. Firehose -> Redshift (Redshift latency copy, usually 1-5 mins, not ideal for "near-real time" querying like Analytics/Athena might be faster? No, Firehose buffer size/interval. Kinesis Analytics is true near-real-time).
- C. EC2 instance store... (Lossy).
- D. EBS... Redis... (Complexity).

**Đáp án đúng**: **A**

**Giải thích chi tiết**:

- **A - ĐÚNG**: **Kinesis Data Streams + Kinesis Data Analytics**.
  - **Scalable**: Data Streams handle high ingestion.
  - **Minimal Data Loss**: Data replicate across 3 AZs ngay khi ingest. Decouple khỏi EC2 (nếu EC2 reboot, data đã nằm an toàn trong Stream).
  - **Near-real-time**: Kinesis Analytics query stream window ngay lập tức (sub-second/seconds latency). Firehose to Redshift thường trễ vài phút (Buffer buffering).

---

## Câu 321

**Đề bài**:  What should a solutions architect do to ensure that all objects uploaded to an Amazon S3 bucket are encrypted?

**Các đáp án**:

- A. Deny if not s3:x-amz-acl...
- B. ...
- C. Deny if not aws:SecureTransport (This enforces SSL/HTTPS).
- D. Update the bucket policy to deny if the PutObject does not have an **x-amz-server-side-encryption** header set.

**Đáp án đúng**: **D**

**Giải thích chi tiết**:

- **D - ĐÚNG**: Policy kiểm tra header `x-amz-server-side-encryption` (AES256 hoặc aws:kms). Nếu request PutObject không có header này -> Deny. Buộc client phải request encryption.
- _Note_: Hiện nay S3 đã bật **Default Encryption** (SSE-S3) cho mọi bucket mới và cũ tự động. Tuy nhiên câu hỏi này refer kỹ thuật Bucket Policy Enforce truyền thống.

---

## Câu 322

**Đề bài**:  A solutions architect is designing a multi-tier application for a company. The application's users upload images from a mobile device. The application generates a thumbnail of each image and returns a message to the user to confirm that the image was uploaded successfully. The thumbnail generation can take up to 60 seconds, but the company wants to provide a faster response time to its users to notify them that the original image was received. The solutions architect must design the application to asynchronously dispatch requests to the different application tiers. What should the solutions architect do to meet these requirements?

**Các đáp án**:

- A. Lambda trigger S3... (Tốt, nhưng alert user kiểu gì nếu user đã thoát? Notification?).
- B. Step Functions... (Orchestrator).
- C. Create an Amazon Simple Queue Service (Amazon SQS) message queue. As images are uploaded, place a message on the SQS queue for thumbnail generation. Alert the user through an application message that the image was received.
- D. SNS...

**Đáp án đúng**: **C**

**Giải thích chi tiết**:

- **C - ĐÚNG**: **SQS Decoupling**.
  - Quy trình:
    1. User upload image -> App server nhận.
    2. App server đẩy message vào SQS "Generate Thumbnail job".
    3. App server trả về ngay cho user "Upload received". (Fast response).
    4. Worker Server (hoặc Lambda) đọc SQS và xử lý thumbnail sau (Async).

---

## Câu 323

**Đề bài**:  A company’s facility has badge readers at every entrance throughout the building. When badges are scanned, the readers send a message over HTTPS to indicate who attempted to access that particular entrance. A solutions architect must design a system to process these messages from the sensors. The solution must be highly available, and the results must be made available for the company’s security team to analyze. Which system architecture should the solutions architect recommend?

**Các đáp án**:

- A. EC2... (Manage servers, scaling issues).
- B. Create an HTTPS endpoint in Amazon API Gateway. Configure the API Gateway endpoint to invoke an AWS Lambda function to process the messages and save the results to an Amazon DynamoDB table.
- C. Route 53 cannot invoke Lambda directly for HTTPS payload processing (Requires API Gateway or ALB).
- D. VPCE... VPN... (Overkill for simple HTTPS ingestion).

**Đáp án đúng**: **B**

**Giải thích chi tiết**:

- **B - ĐÚNG**: **Serverless Ingestion**.
  - **API Gateway**: HA HTTPS endpoint, scale automatically.
  - **Lambda**: Process message logic.
  - **DynamoDB**: Store results highly available.
  - Architecture clean, scalable, no server management.

---

## Câu 324

**Đề bài**:  A company wants to implement a disaster recovery plan for its primary on-premises file storage volume. The file storage volume is mounted from an Internet Small Computer Systems Interface (iSCSI) device on a local storage server. The file storage volume holds hundreds of terabytes (TB) of data. The company wants to ensure that end users retain immediate access to all file types from the on-premises systems without experiencing latency. Which solution will meet these requirements with the LEAST amount of change to the company's existing infrastructure?

**Các đáp án**:

- A. S3 File Gateway (NFS/SMB change).
- B. Tape Gateway (Backup only).
- C. Provision an AWS Storage Gateway Volume Gateway cached volume...
- D. Provision an AWS Storage Gateway Volume Gateway stored volume with the same amount of disk space as the existing file storage volume. Mount the Volume Gateway stored volume to the existing file server by using iSCSI, and copy all files to the storage volume. Configure scheduled snapshots of the storage volume. To recover from a disaster, restore a snapshot...

**Đáp án đúng**: **D**

**Giải thích chi tiết**:

- **D - ĐÚNG**: **Stored Volume Gateway**.
  - Requirement: "Immediate access to **all file types** from on-prem **without latency**". -> Dữ liệu phải nằm Local (Stored Volume).
  - Cached Volume (C) chỉ cache data hay dùng, data nguội phải fetch từ S3 -> Latency.
  - iSCSI interface -> Mount as local disk -> Least change to applications.
  - Snapshots backup to AWS for DR.

---

## Câu 325

**Đề bài**:  A company is hosting a web application from an Amazon S3 bucket. The application uses Amazon Cognito as an identity provider to authenticate users and return a JSON Web Token (JWT) that provides access to protected resources that are stored in another S3 bucket. Upon deployment of the application, users report errors and are unable to access the protected content. A solutions architect must resolve this issue by providing proper permissions so that users can access the protected content. Which solution meets these requirements?

**Các đáp án**:

- A. Update the Amazon Cognito identity pool to assume the proper IAM role for access to the protected content.
- B. S3 ACL...
- C. ...
- D. Update Cognito pool internal mapping...

**Đáp án đúng**: **A**

**Giải thích chi tiết**:

- **A - ĐÚNG**: **Cognito Identity Pool**.
  - User Pool handle Authentication (JWT).
  - **Identity Pool** exchange JWT lấy **AWS Temporary Credentials** (IAM Role).
  - Role này phải có Policy allow access S3 Bucket kia. Nếu Role thiếu quyền -> User không access được. Cần update Role in Identity Pool.

---

## Câu 326

**Đề bài**:  An image hosting company uploads its large assets to Amazon S3 Standard buckets. The company uses multipart upload in parallel by using S3 APIs and overwrites if the same object is uploaded again. For the first 30 days after upload, the objects will be accessed frequently. The objects will be used less frequently after 30 days, but the access patterns for each object will be inconsistent. The company must optimize its S3 storage costs while maintaining high availability and resiliency of stored assets. Which combination of actions should a solutions architect recommend to meet these requirements? (Choose two.)

**Các đáp án**:

- A. Move assets to S3 Intelligent-Tiering after 30 days.
- B. Configure an S3 Lifecycle policy to clean up incomplete multipart uploads.
- C. ...
- D. Standard-IA (Inconsistent access -> risk accessing frequently -> High retrieval fee).
- E. ...

**Đáp án đúng**: **A, B**

**Giải thích chi tiết**:

- **A - ĐÚNG**: **S3 Intelligent-Tiering**. Phù hợp perfect cho data "inconsistent access patterns" hoặc "unknown". Nó tự động move data giữa Frequent và Infrequent tier. Không có retrieval fee (chỉ tốn monitoring fee nhỏ). An toàn hơn Standard-IA nếu lỡ truy cập lại nhiều.
- **B - ĐÚNG**: **Cleanup incomplete multipart uploads**. Các phần upload dở dang (do lỗi mạng) chiếm dung lượng lưu trữ nhưng không hiện trong object list. Cần Lifecycle policy xóa chúng (ví dụ after 7 days) để tiết kiệm storage cost vô ích. Đây là best practice bắt buộc cho Multipart upload bucket.

---

## Câu 327

**Đề bài**:  A solutions architect must secure a VPC network that hosts Amazon EC2 instances. The EC2 instances contain highly sensitive data and run in a private subnet. According to company policy, the EC2 instances that run in the VPC can access only approved third-party software repositories on the internet for software product updates that use the third party’s URL. Other internet traffic must be blocked. Which solution meets these requirements?

**Các đáp án**:

- A. Network Firewall with domain list rule groups.
- B. WAF (WAF protects Inbound Web App, not Outbound from EC2).
- C. Security Group (Cannot filter by URL, only IP).
- D. Proxy via ALB? (ALB is Inbound usually. Proxy server on EC2/Squid is old way).

**Giải thích chọn**: **AWS Network Firewall** (A) là giải pháp hiện đại native support outbound URL/Domain filtering.
Tuy nhiên, có một giải pháp cũ thường gặp trong đề thi là **NAT Gateway** (không filter URL) + **Squid Proxy**.
Nhưng **Option A** "AWS Network Firewall... Configure **domain list rule groups**" (Stateful domain list) là feature chính xác cho requirement này.

**Đáp án đúng**: **A**

---

## Câu 328

**Đề bài**:  A company is hosting a three-tier ecommerce application in the AWS Cloud. The company hosts the website on Amazon S3 and integrates the website with an API that handles sales requests. The company hosts the API on three Amazon EC2 instances behind an Application Load Balancer (ALB). The API consists of static and dynamic front-end content along with backend workers that process sales requests asynchronously. The company is expecting a significant and sudden increase in the number of sales requests during events for the launch of new products. What should a solutions architect recommend to ensure that all the requests are processed successfully?

**Các đáp án**:

- A. CloudFront for dynamic content...
- B. CloudFront for static content... EC2 Auto Scaling.
- C. CloudFront for dynamic... ElastiCache... (Cache dynamic responses? Maybe, but scaling compute is more critical for writes/logic).
- D. CloudFront static... SQS to receive requests...

**Đáp án đúng**: **D**

**Giải thích chi tiết**:

- **D - ĐÚNG**: **Decoupling with SQS**.
  - Sudden increase -> EC2 có thể bị overwhelm dù có Auto Scaling (ASG cần thời gian khởi động).
  - **SQS Queue** đóng vai trò buffer. Website đẩy request (sales orders) vào SQS. EC2 Worker process từ từ theo khả năng. Đảm bảo "All requests processed successfully" (không bị drop do overload).
  - CloudFront Static Content giảm tải cho S3/Web hosting.

---

## Câu 329

**Đề bài**:  A security audit reveals that Amazon EC2 instances are not being patched regularly. A solutions architect needs to provide a solution that will run regular security scans across a large fleet of EC2 instances. The solution should also patch the EC2 instances on a regular schedule and provide a report of each instance’s patch status. Which solution will meet these requirements?

**Các đáp án**:

- A. Macie...
- B. GuardDuty...
- C. Detective...
- D. Turn on **Amazon Inspector** in the account. Configure Amazon Inspector to scan the EC2 instances for software vulnerabilities. Set up **AWS Systems Manager Patch Manager** to patch the EC2 instances on a regular schedule.

**Đáp án đúng**: **D**

**Giải thích chi tiết**:

- **D - ĐÚNG**:
  - **Amazon Inspector**: Scan vulnerabilities (Security Scan).
  - **SSM Patch Manager**: Automate patching (Windows/Linux) và reporting compliance status.
  - Combo chuẩn cho Patch & Vuln Management.

---

## Câu 330

**Đề bài**:  A company is planning to store data on Amazon RDS DB instances. The company must encrypt the data at rest. What should a solutions architect do to meet this requirement?

**Các đáp án**:

- A. Create a key in AWS Key Management Service (AWS KMS). Enable encryption for the DB instances.
- B. Secrets Manager (For storing credentials, not data encryption keys).
- C. SSL/TLS (Encryption in transit).
- D. ...

**Đáp án đúng**: **A**

**Giải thích chi tiết**:

- **A - ĐÚNG**: RDS support encryption at rest bằng **AWS KMS** key (Managed hoặc Customer Managed). Chọn option Enable Encryption khi tạo DB.

---

## Câu 331

**Đề bài**:  A company must migrate 20 TB of data from a data center to the AWS Cloud within 30 days. The company’s network bandwidth is limited to 15 Mbps and cannot exceed 70% utilization. What should a solutions architect do to meet these requirements?

**Các đáp án**:

- A. Use **AWS Snowball**.
- B. DataSync (Network based -> Too slow).
- C. VPN (Network based).
- D. ...

**Đáp án đúng**: **A**

**Giải thích chi tiết**:

- **A - ĐÚNG**: **AWS Snowball**. Offline migration device. Copy data Local, ship về AWS. 20TB fit trong 1 Snowball Edge (80TB). Thời gian vận chuyển + copy < 1 tuần. Đáp ứng deadline 30 ngày.

---

## Câu 332

**Đề bài**:  A company needs to provide its employees with secure access to confidential and sensitive files. The company wants to ensure that the files can be accessed only by authorized users. The files must be downloaded securely to the employees’ devices. The files are stored in an on-premises Windows file server. However, due to an increase in remote usage, the file server is running out of capacity. . Which solution will meet these requirements?

**Các đáp án**:

- A. Migrate to EC2 Public (Security risk).
- B. Migrate the files to an **Amazon FSx for Windows File Server** file system. Integrate the Amazon FSx file system with the on-premises Active Directory. Configure **AWS Client VPN**.
- C. S3 Private Endpoint... (VPN/Direct Connect needed first).
- D. ...

**Đáp án đúng**: **B**

**Giải thích chi tiết**:

- **B - ĐÚNG**:
  - **FSx for Windows File Server**: Thay thế file server cũ (Full features). Integrate AD để quản lý quyền authorized users.
  - **AWS Client VPN**: Cho phép employees truy cập file system secure từ remote devices (download securely) vào private VPC network.

---

## Câu 333

**Đề bài**:  A company’s application runs on Amazon EC2 instances behind an Application Load Balancer (ALB). The instances run in an Amazon EC2 Auto Scaling group across multiple Availability Zones. On the first day of every month at midnight, the application becomes much slower when the month-end financial calculation batch runs. This causes the CPU utilization of the EC2 instances to immediately peak to 100%, which disrupts the application. What should a solutions architect recommend to ensure the application is able to handle the workload and avoid downtime?

**Các đáp án**:

- A. CloudFront (Batch job is backend logic usually, CDN won't help CPU spike).
- B. Simple scaling (Too reactive, lag exists).
- C. Configure an EC2 Auto Scaling **scheduled scaling policy** based on the monthly schedule.
- D. ElastiCache...

**Đáp án đúng**: **C**

**Giải thích chi tiết**:

- **C - ĐÚNG**: **Scheduled Scaling**.
  - Sự kiện biết trước (First day of month).
  - Cấu hình Scale Out trước thời điểm đó (ví dụ 23:50). Hệ thống có đủ Capacity ngay khi Job bắt đầu -> Avoid downtime/disruption.

---

## Câu 334

**Đề bài**:  A company wants to give a customer the ability to use on-premises Microsoft Active Directory to download files that are stored in Amazon S3. The customer’s application uses an SFTP client to download the files. Which solution will meet these requirements with the LEAST operational overhead and no changes to the customer’s application?

**Các đáp án**:

- A. Set up **AWS Transfer Family with SFTP for Amazon S3**. Configure integrated Active Directory authentication.
- B. DMS...
- C. DataSync (Sync tool, not client access).
- D. EC2 SFTP (Manage server).

**Đáp án đúng**: **A**

**Giải thích chi tiết**:

- **A - ĐÚNG**: **AWS Transfer Family**.
  - Managed SFTP service backed by S3.
  - Hỗ trợ **Custom Identity Provider** (Active Directory).
  - Customer dùng SFTP Client chuẩn -> No changes to app.

---

## Câu 335

**Đề bài**:  A company is experiencing sudden increases in demand. The company needs to provision large Amazon EC2 instances from an Amazon Machine Image (AMI). The instances will run in an Auto Scaling group. The company needs a solution that provides minimum initialization latency to meet the demand. Which solution meets these requirements?

**Các đáp án**:

- A. ...
- B. Enable Amazon Elastic Block Store (Amazon EBS) **fast snapshot restore** on a snapshot. Provision an AMI by using the snapshot. Replace the AMI in the Auto Scaling group with the new AMI.
- C. ...
- D. ...

**Đáp án đúng**: **B**

**Giải thích chi tiết**:

- **B - ĐÚNG**: **EBS Fast Snapshot Restore (FSR)**.
  - Bình thường, EBS tạo từ Snapshot bị "lazy loading" (download data từ S3 khi cần), gây latency cao lúc đầu (initialization performance hit).
  - FSR pre-warms blocks, giúp volume đạt full performance ngay lập tức khi khởi tạo -> Minimum boot/init latency cho Large Instances.

---

## Câu 336

**Đề bài**:  A company hosts a multi-tier web application that uses an Amazon Aurora MySQL DB cluster for storage. The application tier is hosted on Amazon EC2 instances. The company’s IT security guidelines mandate that the database credentials be encrypted and rotated every 14 days. What should a solutions architect do to meet this requirement with the LEAST operational effort?

**Các đáp án**:

- A. Use AWS Secrets Manager to create a new secret... Configure a custom rotation period of 14 days.
- B. SSM Parameter Store + Custom Lambda (More effort).
- C. Encrypted EFS file... (Complex).
- D. S3... (Complex).

**Đáp án đúng**: **A**

**Giải thích chi tiết**:

- **A - ĐÚNG**: **AWS Secrets Manager**.
  - Tính năng chính: Store & **Auto-rotate** credentials.
  - Native support rotation cho RDS/Aurora. Chỉ cần config "Rotate every 14 days". Nó tự động gọi Lambda function (AWS provided) để đổi password trong DB và update Secret.
  - App gọi API lấy secret mới nhất.

---

## Câu 337

**Đề bài**:  A company has deployed a web application on AWS. The company hosts the backend database on Amazon RDS for MySQL with a primary DB instance and five read replicas to support scaling needs. The read replicas must lag no more than 1 second behind the primary DB instance. The database routinely runs scheduled stored procedures. As traffic on the website increases, the replicas experience additional lag during periods of peak load. A solutions architect must reduce the replication lag as much as possible. The solutions architect must minimize changes to the application code and must minimize ongoing operational overhead. Which solution will meet these requirements?

**Các đáp án**:

- A. Migrate the database to **Amazon Aurora MySQL**. Replace the read replicas with Aurora Replicas, and configure Aurora Auto Scaling. Replace the stored procedures with Aurora MySQL native functions.
- B. ElastiCache (Code changes required for cache logic).
- C. EC2 MySQL (Management overhead).
- D. DynamoDB (Re-architect).

**Đáp án đúng**: **A**

**Giải thích chi tiết**:

- **A - ĐÚNG**: **Aurora MySQL**.
  - Aurora Architecture dùng shared storage layer, replication lag thường **< 100ms** (gần như tức thì) bất kể số lượng Replica (lên tới 15). Khắc phục hoàn toàn vấn đề binlog replication lag của RDS MySQL.
  - Fully compatible with MySQL -> Min changes to code (chỉ đổi connection string).
  - _Note_: Đáp án đề cập "Replace stored procedures with Aurora native functions" - thực ra Aurora support hầu hết SP của MySQL, có thể không cần replace nhiều, nhưng về mặt architecture Aurora là chuẩn nhất để fix Lag.

---

## Câu 338

**Đề bài**:  A solutions architect must create a disaster recovery (DR) plan for a high-volume software as a service (SaaS) platform. All data for the platform is stored in an Amazon Aurora MySQL DB cluster. The DR plan must replicate data to a secondary AWS Region. Which solution will meet these requirements MOST cost-effectively?

**Các đáp án**:

- A. Binlog replication (Slow, manual).
- B. Set up an Aurora global database for the DB cluster. When setup is complete, remove the DB instance from the secondary Region (Headless cluster?).
- C. DMS...
- D. Set up an **Aurora global database** for the DB cluster. Specify a minimum of one DB instance in the secondary Region. (Requires compute running).

**Note**: Aurora Global Database cho phép "Headless" (Storage replication only, no compute in secondary region) để tiết kiệm chi phí không?
_Update_: Aurora Global Database support "Headless" secondary region (Chỉ có storage replication). Khi cần DR thì mới add instance vào. Điều này Rất Cost-Effective.
Đáp án **B** mô tả việc này: "Remove the DB instance from the secondary Region". Data vẫn replicate ở Storage layer.
Đáp án D bắt chạy 1 instance -> Tốn tiền compute 24/7.
Vậy **B** là Most Cost-Effective.

**Đáp án đúng**: **B**

---

## Câu 339

**Đề bài**:  A company has a custom application with embedded credentials that retrieves information from an Amazon RDS MySQL DB instance. Management says the application must be made more secure with the least amount of programming effort. What should a solutions architect do to meet these requirements?

**Các đáp án**:

- A. KMS (App phải decrypt -> Code change).
- B. Secrets Manager + Lambda rotation (Good, but "Least programming effort"?).
- C. ...
- D. ...

Tuy nhiên, câu hỏi thường nhắm đến việc **AWS Secrets Manager** integration.
"Least programming effort" ở đây là thay vì hardcode, ta sửa code để call SDK `getSecretValue`.
So sánh A và B:

- A: KMS encrypt string. Sửa code decrypt. Rotation phải tự làm logic đổi pass DB -> Rất cực.
- B: **Secrets Manager**. Handle rotation tự động. Code chỉ cần gọi API lấy pass. Đây là giải pháp Secure chuẩn.
  Nhiều đề coi việc integrate SDK là chấp nhận được.

**Đáp án đúng**: **B** (Hoặc C nếu C mô tả đúng hơn về native rotation configuration, thực tế B mô tả việc tạo Lambda rotation function - which AWS provide template).

---

## Câu 340

**Đề bài**:  A media company hosts its website on AWS. The website application’s architecture includes a fleet of Amazon EC2 instances behind an Application Load Balancer (ALB) and a database that is hosted on Amazon Aurora. The company’s cybersecurity team reports that the application is vulnerable to SQL injection. How should the company resolve this issue?

**Các đáp án**:

- A. Use **AWS WAF** in front of the ALB. Associate the appropriate web ACLs with AWS WAF.
- B. ALB Listener Rule (Cannot inspect body/SQLi payload deeply).
- C. Shield Advanced (DDoS).
- D. Amazon Inspector (Vuln scan, not protection blocker).

**Đáp án đúng**: **A**

**Giải thích chi tiết**:

- **A - ĐÚNG**: **AWS WAF**.
  - Có sẵn **SQL Injection Protection Rule** (Managed Rules).
  - Block requests chứa mã độc SQLi ngay tại lớp biên (ALB/CloudFront) trước khi chạm vào App/DB.

---

## Câu 341

**Đề bài**:  A company has an Amazon S3 data lake that is governed by AWS Lake Formation. The company wants to create a visualization in Amazon QuickSight by joining the data in the data lake with operational data that is stored in an Amazon Aurora MySQL database. The company wants to enforce column-level authorization so that the company’s marketing team can access only a subset of columns in the database. Which solution will meet these requirements with the LEAST operational overhead?

**Các đáp án**:

- A. EMR...
- B. Glue Studio...
- C. ...
- D. Use a **Lake Formation blueprint** to ingest the data from the database to the S3 data lake. Use Lake Formation to enforce **column-level access control** for the QuickSight users. Use Amazon Athena as the data source in QuickSight.

**Đáp án đúng**: **D**

**Giải thích chi tiết**:

- **D - ĐÚNG**: **Lake Formation**.
  - Feature chính: Fine-grained access control (Row-level/Column-level).
  - Ingest data từ Aurora vào Data Lake dễ dàng bằng Blueprint.
  - QuickSight kết nối qua Athena (integrate Lake Formation permission). User query chỉ thấy cột được phép.

---

## Câu 342

**Đề bài**:  A transaction processing company has weekly scripted batch jobs that run on Amazon EC2 instances. The EC2 instances are in an Auto Scaling group. The number of transactions can vary, but the baseline CPU utilization that is noted on each run is at least 60%. The company needs to provision the capacity 30 minutes before the jobs run. Currently, engineers complete this task by manually modifying the Auto Scaling group parameters. The company does not have the resources to analyze the required capacity trends for the Auto Scaling group counts. The company needs an automated way to modify the Auto Scaling group’s desired capacity. Which solution will meet these requirements with the LEAST operational overhead?

**Các đáp án**:

- A. Dynamic Scaling (Reactive, might be late).
- B. Create a **scheduled scaling policy** for the Auto Scaling group. Set the appropriate desired capacity... recurrence weekly... start time 30 mins before.
- C. Predictive Scaling (Good for daily patterns, but Scheduled is simpler for exact weekly jobs).
- D. EventBridge Lambda (Custom code overhead).

**Đáp án đúng**: **B**

**Giải thích chi tiết**:

- **B - ĐÚNG**: **Scheduled Scaling**.
  - Rất phù hợp cho "Weekly batch jobs" với thời gian cố định.
  - Set schedule "Every Monday 8:30" (30 mins before 9:00).
  - Simple config, no AI/ML learning time needed like Predictive.

---

## Câu 343

**Đề bài**:  A solutions architect is designing a company’s disaster recovery (DR) architecture. The company has a MySQL database that runs on an Amazon EC2 instance in a private subnet with scheduled backup. The DR design needs to include multiple AWS Regions. Which solution will meet these requirements with the LEAST operational overhead?

**Các đáp án**:

- A. Active-Standby EC2 + Replication (Manage instances).
- B. Migrate to RDS Multi-AZ + Read Replication (To DR Region? Cross-region RR is easy).
- C. Migrate to **Amazon Aurora global database**.
- D. S3 CRR backup restore.

Câu hỏi: "Least operational overhead".

- **C** (Aurora Global DB) là solution mạnh nhất, RPO/RTO thấp nhất, replication fully managed.
- **B** (RDS Cross-region Read Replica) cũng tốt.
- **D** (Backup S3 CRR) là rẻ nhất nhưng RTO cao (Restore mất thời gian).
  Thường xu hướng câu hỏi hiện đại ưu tiên **Aurora Global Database** cho DR strategy database vì tính năng Global managed của nó.
  Tuy nhiên, "Data runs on EC2" -> Migration to Aurora (C) effort cao hơn Backup Restore (D)?
  Nhưng đề bài hỏi về DR Design. Nếu tính cả Migration effort thì D ít nhất. Nếu tính "Operating DR" thì C/B ít nhất.
  Xem lại context: "Solution will meet these requirements [DR include multiple regions] with LEAST operational overhead".
  Nếu App critical -> C. Nếu App backup only -> D.
  Nhưng Aurora Global Database (C) thường là đáp án cho "Best/Easiest DR for Database".
  Tuy nhiên, option **D** (S3 Cross Region Replication of Backups) là giải pháp classic và very low overhead (set & forget policy). Nếu RTO không strict thì D valid.
  Do không mention RTO/RPO strict, **D** là valid choice cho "Backup Restoration Strategy" cost effective & simple.
  Nhưng nếu muốn "Database continues running in DR region fast" -> Aurora Global.
  Đa phần các đề thi chọn **D** cho trường hợp "EC2 MySQL" ban đầu và chỉ yêu cầu "Backup DR".

**Đáp án đúng**: **D** (Dựa trên context EC2 MySQL backup).

---

## Câu 344

**Đề bài**:  A company has a Java application that uses Amazon Simple Queue Service (Amazon SQS) to parse messages. The application cannot parse messages that are larger than 256 KB in size. The company wants to implement a solution to give the application the ability to parse messages as large as 50 MB. Which solution will meet these requirements with the FEWEST changes to the code?

**Các đáp án**:

- A. Use the **Amazon SQS Extended Client Library for Java** to host messages that are larger than 256 KB in Amazon S3.
- B. EventBridge...
- C. Change limit (SQS limit is 256KB hard limit).
- D. EFS...

**Đáp án đúng**: **A**

**Giải thích chi tiết**:

- **A - ĐÚNG**: **SQS Extended Client Library**.
  - Thư viện Java này tự động offload payload lớn (>256KB) lên S3 và gửi reference message vào SQS.
  - Khi Application consume, thư viện tự động fetch từ S3. App code xử lý object message như bình thường (trong suốt). -> **Fewest changes to code** (chỉ cần đổi library/config).

---

## Câu 345

**Đề bài**:  A company wants to restrict access to the content of one of its main web applications and to protect the content by using authorization techniques available on AWS. The company wants to implement a serverless architecture and an authentication solution for fewer than 100 users. The solution needs to integrate with the main web application and serve web content globally. The solution must also scale as the company's user base grows while providing the lowest login latency possible. Which solution will meet these requirements MOST cost-effectively?

**Các đáp án**:

- A. Use Amazon Cognito for authentication. Use Lambda@Edge for authorization. Use Amazon CloudFront to serve the web application globally.
- B. AD + Lambda + ALB (AD expensive).
- C. S3 Transfer Acceleration (Not website delivery).
- D. ...

**Đáp án đúng**: **A**

**Giải thích chi tiết**:

- **A - ĐÚNG**:
  - **Cognito**: Authentication (User Pool) serverless, cheapest (50k MAU free).
  - **CloudFront**: Global delivery (Low latency access).
  - **Lambda@Edge**: Authorization logic tại Edge (kiểm tra JWT từ Cognito trước khi serve content).
  - **Lowest Latency**: User login Cognito (gần nhất) và access content qua CloudFront Edge.

---

## Câu 346

**Đề bài**:  A company has an aging network-attached storage (NAS) array in its data center. The NAS array presents SMB shares and NFS shares to client workstations. The company does not want to purchase a new NAS array. The company also does not want to incur the cost of renewing the NAS array’s support contract. Some of the data is accessed frequently, but much of the data is inactive. A solutions architect needs to implement a solution that migrates the data to Amazon S3, uses S3 Lifecycle policies, and maintains the same look and feel for the client workstations. The solutions architect has identified AWS Storage Gateway as part of the solution. Which type of storage gateway should the solutions architect provision to meet these requirements?

**Các đáp án**:

- A. Volume Gateway (Block based).
- B. Tape Gateway (Backup).
- C. Amazon FSx File Gateway (Dùng cho FSx, không phải S3 back-end).
- D. **Amazon S3 File Gateway**.

**Đáp án đúng**: **D**

**Giải thích chi tiết**:

- **D - ĐÚNG**: **S3 File Gateway**.
  - Cung cấp giao thức **SMB/NFS** cho client on-prem. (Maintain look and feel).
  - Cache local (cho Frequently accessed data). Data gốc đẩy lên **S3** (cho Inactive/Archive).
  - Dùng **S3 Lifecycle policies** để transition inactive data sang Glacier -> Tiết kiệm tiền.

---

## Câu 347

**Đề bài**:  A company has an application that is running on Amazon EC2 instances. A solutions architect has standardized the company on a particular instance family and various instance sizes based on the current needs of the company. The company wants to maximize cost savings for the application over the next 3 years. The company needs to be able to change the instance family and sizes in the next 6 months based on application popularity and usage. Which solution will meet these requirements MOST cost-effectively?

**Các đáp án**:

- A. **Compute Savings Plan**.
- B. EC2 Instance Savings Plan (Lock family).
- C. Zonal RI (Lock family/size/AZ).
- D. Standard RI (Lock family).

**Đáp án đúng**: **A**

**Giải thích chi tiết**:

- **A - ĐÚNG**: **Compute Savings Plans**.
  - Flexible nhất: Cho phép đổi **Instance Family**, Region, OS, Tenancy.
  - Cam kết tiền ($/hour) chứ không cam kết cấu hình cứng.
  - Đáp ứng requirement "change instance family".
  - Tiết kiệm tới 66% (3 years).

---

## Câu 348

**Đề bài**:  A company collects data from a large number of participants who use wearable devices. The company stores the data in an Amazon DynamoDB table and uses applications to analyze the data. The data workload is constant and predictable. The company wants to stay at or below its forecasted budget for DynamoDB. Which solution will meet these requirements MOST cost-effectively?

**Các đáp án**:

- A. Provisioned + IA + Reserved Capacity.
- B. Use provisioned mode. Specify RCUs/WCUs. (Add Reserved Capacity to be cheaper).
- C. On-demand (Expensive for predictable).
- D. On-demand... (Cannot reserve).

Re-eval **A**: Standard-IA cost effective for large storage (>64KB/item) but depends on access pattern. If constant/predictable, **Provisioned Capacity + Reserved Capacity** (buy for 1-3 years) is the cheapest way standard.
List:

- A: Provisioned + Standard-IA + Reserved.
- B: Provisioned (Manual setting).
  Note: Standard-IA is storage class.
  Câu hỏi không nói về data size hay access frequency mà nói workload "constant".
  Tùy chọn **Reserved Capacity** (Mua gói dung lượng RC/WC) chỉ áp dụng cho **Provisioned Mode**.
  Đáp án **A** nhắc đến "Reserve capacity". Đáp án **B** chỉ nói set RCU/WCU.
  Vậy **A** (hoặc option nào có Reserved Capacity) là rẻ nhất. (Standard-IA là bonus giảm storage cost nếu store lâu).

**Đáp án đúng**: **A** (Reserved Capacity là keyword cho predictable workload).

---

## Câu 349

**Đề bài**:  A company stores confidential data in an Amazon Aurora PostgreSQL database in the ap-southeast-3 Region. The database is encrypted with an AWS Key Management Service (AWS KMS) customer managed key. The company was recently acquired and must securely share a backup of the database with the acquiring company’s AWS account in ap-southeast-3. What should a solutions architect do to meet these requirements?

**Các đáp án**:

- A. Create Snapshot -> Copy to Unencrypted -> Share. (Insecure - data unencrypted).
- B. Create Snapshot -> **Add acquiring account to KMS key policy** -> Share snapshot.
- C. ...
- D. ...

**Đáp án đúng**: **B**

**Giải thích chi tiết**:

- **B - ĐÚNG**: Quy trình share Encrypted Snapshot:
  1. Update **KMS Key Policy** của CMK để cho phép Account B sử dụng (Decrypt/CreateGrant).
  2. Share Snapshot permission cho Account B.
  3. Account B copy snapshot đó và re-encrypt bằng key của họ để restore.

---

## Câu 350

**Đề bài**:  A company uses a 100 GB Amazon RDS for Microsoft SQL Server Single-AZ DB instance in the us-east-1 Region to store customer transactions. The company needs high availability and automatic recovery for the DB instance. The company must also run reports on the RDS database several times a year. The report process causes transactions to take longer than usual to post to the customers’ accounts. The company needs a solution that will improve the performance of the report process. Which combination of steps will meet these requirements? (Choose two.)

**Các đáp án**:

- A. Modify the DB instance from a Single-AZ DB instance to a **Multi-AZ deployment**.
- B. ...
- C. Create a **read replica** of the DB instance in a different Availability Zone. Point all requests for reports to the read replica.
- D. ...
- E. ...

**Đáp án đúng**: **A, C**

**Giải thích chi tiết**:

- **A - ĐÚNG**: **Enable Multi-AZ**. Giải quyết yêu cầu "High Availability and automatic recovery".
- **C - ĐÚNG**: **Read Replica**. Offload traffic report (read-only) sang Replica để không ảnh hưởng performance của Primary DB (Transaction processing). SQL Server Enterprise edition support Read Replicas (hoặc dùng Multi-AZ Read Replica nếu version support).

---
