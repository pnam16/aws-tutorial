# AWS Certification Exam Questions 001-050

Tài liệu được biên soạn chi tiết với giải thích bằng tiếng Việt, bao gồm phân tích vì sao các đáp án sai, giúp bạn hiểu sâu về các dịch vụ AWS.

---

## Câu 1

**Đề bài**: A company collects data for temperature, humidity, and atmospheric pressure in cities across multiple continents. The average volume of data that the company collects from each site daily is 500 GB. Each site has a high-speed Internet connection. The company wants to aggregate the data from all these global sites as quickly as possible in a single Amazon S3 bucket. The solution must minimize operational complexity. Which solution meets these requirements?

**Các đáp án**:

- A. Turn on S3 Transfer Acceleration on the destination S3 bucket. Use multipart uploads to directly upload site data to the destination S3 bucket.
- B. Upload the data from each site to an S3 bucket in the closest Region. Use S3 Cross-Region Replication to copy objects to the destination S3 bucket. Then remove the data from the origin S3 bucket.
- C. Schedule AWS Snowball Edge Storage Optimized device jobs daily to transfer data from each site to the closest Region. Use S3 Cross-Region Replication to copy objects to the destination S3 bucket.
- D. Upload the data from each site to an Amazon EC2 instance in the closest Region. Store the data in an Amazon Elastic Block Store (Amazon EBS) volume. At regular intervals, take an EBS snapshot and copy it to the Region that contains the destination S3 bucket. Restore the EBS volume in that Region.

**Đáp án đúng**: **A**

**Giải thích chi tiết**:

- **A - ĐÚNG**: **S3 Transfer Acceleration** sử dụng mạng lưới Edge Locations của CloudFront để tăng tốc upload dữ liệu lên S3 từ khoảng cách xa địa lý. Dữ liệu đi vào Edge Location gần nhất rồi đi qua mạng AWS Backbone (nhanh hơn internet công cộng) tới Bucket đích. Kết hợp với **Multipart Upload** là cách nhanh nhất và đơn giản nhất (minimize operational complexity) để upload file lớn toàn cầu.
- **B - SAI**: Upload lên bucket ở Region gần nhất rồi đợi Replication sang bucket đích sẽ tốn thêm thời gian latency cho 2 hop (Upload + Replicate), phức tạp quản lý nhiều bucket ở nhiều region, và phải xóa data thủ công sau đó.
- **C - SAI**: **Snowball Edge** là thiết bị vật lý, phải ship mỗi ngày -> Quá phức tạp về vận hành (Operational Complexity cực cao), không realtime.
- **D - SAI**: EC2 + EBS snapshot copy quá phức tạp, thủ công và chậm hơn nhiều so với upload trực tiếp S3.

---

## Câu 2

**Đề bài**: A company needs the ability to analyze the log files of its proprietary application. The logs are stored in JSON format in an Amazon S3 bucket. Queries will be simple and will run on-demand. A solutions architect needs to perform the analysis with minimal changes to the existing architecture. What should the solutions architect do to meet these requirements with the LEAST amount of operational overhead?

**Các đáp án**:

- A. Use Amazon Redshift to load all the content into one place and run the SQL queries as needed.
- B. Use Amazon CloudWatch Logs to store the logs. Run SQL queries as needed from the Amazon CloudWatch console.
- C. Use Amazon Athena directly with Amazon S3 to run the queries as needed.
- D. Use AWS Glue to catalog the logs. Use a transient Apache Spark cluster on Amazon EMR to run the SQL queries as needed.

**Đáp án đúng**: **C**

**Giải thích chi tiết**:

- **A - SAI**: **Redshift** là Data Warehouse, cần load data từ S3 vào cluster (ETL), tốn chi phí chạy cluster liên tục hoặc provision serverless, thay đổi architecture nhiều hơn Athena.
- **B - SAI**: Logs đang ở S3 JSON format. Chuyển sang **CloudWatch Logs** đòi hỏi thay đổi architecture (Log agent đẩy về CW Logs thay vì S3) và tốn kém hơn S3.
- **C - ĐÚNG**: **Amazon Athena** là dịch vụ truy vấn serverless cho phép chạy SQL trực tiếp trên dữ liệu nằm trong S3 (JSON, CSV, Parquet...). "Minimal changes" vì không cần di chuyển hay load dữ liệu đi đâu cả. "Least operational overhead".
- **D - SAI**: **EMR** (Spark Cluster) quá phức tạp và tốn kém (overhead cao) cho nhu cầu "simple queries on-demand".

---

## Câu 3

**Đề bài**: A company uses AWS Organizations to manage multiple AWS accounts for different departments. The management account has an Amazon S3 bucket that contains project reports. The company wants to limit access to this S3 bucket to only users of accounts within the organization in AWS Organizations. Which solution meets these requirements with the LEAST amount of operational overhead?

**Các đáp án**:

- A. Add the aws PrincipalOrgID global condition key with a reference to the organization ID to the S3 bucket policy.
- B. Create an organizational unit (OU) for each department. Add the aws:PrincipalOrgPaths global condition key to the S3 bucket policy.
- C. Use AWS CloudTrail to monitor the CreateAccount, InviteAccountToOrganization, LeaveOrganization, and RemoveAccountFromOrganization events. Update the S3 bucket policy accordingly.
- D. Tag each user that needs access to the S3 bucket. Add the aws:PrincipalTag global condition key to the S3 bucket policy.

**Đáp án đúng**: **A**

**Giải thích chi tiết**:

- **A - ĐÚNG**: **aws:PrincipalOrgID** là Global Condition Key dùng trong IAM Policy/Bucket Policy để chỉ định điều kiện: "Chỉ chấp nhận request từ principal thuộc Organization này". Đây là cách chuẩn nhất để limit access cho toàn bộ Organization mà không cần liệt kê từng Account ID.
- **B - SAI**: `aws:PrincipalOrgPaths` dùng cho OU path, phức tạp hơn và dễ sai sót nếu cấu trúc OU thay đổi. `PrincipalOrgID` bao quát hơn.
- **C - SAI**: Giám sát CloudTrail rồi update policy thủ công/tự động là giải pháp phản ứng (reactive), phức tạp và có độ trễ (overhead cao).
- **D - SAI**: Tagging user và dùng ABAC (Attribute-Based Access Control) phức tạp hơn nhiều so với dùng OrgID condition.

---

## Câu 4

**Đề bài**: An application runs on an Amazon EC2 instance in a VPC. The application processes logs that are stored in an Amazon S3 bucket. The EC2 instance needs to access the S3 bucket without connectivity to the internet. Which solution will provide private network connectivity to Amazon S3?

**Các đáp án**:

- A. Create a gateway VPC endpoint to the S3 bucket.
- B. Stream the logs to Amazon CloudWatch Logs. Export the logs to the S3 bucket.
- C. Create an instance profile on Amazon EC2 to allow S3 access.
- D. Create an Amazon API Gateway API with a private link to access the S3 endpoint.

**Đáp án đúng**: **A**

**Giải thích chi tiết**:

- **A - ĐÚNG**: **Gateway VPC Endpoint** cho S3 cho phép EC2 trong Private Subnet truy cập S3 qua mạng nội bộ AWS mà không cần Internet Gateway hay NAT Gateway. Đây là giải pháp chuẩn cho "access S3 without internet".
- **B - SAI**: CloudWatch Logs export vẫn cần mechanism để đẩy log.
- **C - SAI**: Instance Profile chỉ cấp quyền (Authorization), không giải quyết vấn đề đường truyền mạng (Network Connectivity).
- **D - SAI**: API Gateway Private Link quá phức tạp (Proxy S3 qua API Gateway) so với Gateway Endpoint direct access.

---

## Câu 5

**Đề bài**: A company is hosting a web application on AWS using a single Amazon EC2 instance that stores user-uploaded documents in an Amazon EBS volume. For better scalability and availability, the company duplicated the architecture and created a second EC2 instance and EBS volume in another Availability Zone, placing both behind an Application Load Balancer. After completing this change, users reported that, each time they refreshed the website, they could see one subset of their documents or the other, but never all of the documents at the same time. What should a solutions architect propose to ensure users see all of their documents at once?

**Các đáp án**:

- A. Copy the data so both EBS volumes contain all the documents
- B. Configure the Application Load Balancer to direct a user to the server with the documents
- C. Copy the data from both EBS volumes to Amazon EFS. Modify the application to save new documents to Amazon EFS
- D. Configure the Application Load Balancer to send the request to both servers. Return each document from the correct server

**Đáp án đúng**: **C**

**Giải thích chi tiết**:

- **A - SAI**: Copy data giữa 2 EBS volumes thủ công (sync) rất khó để realtime và consistency. EBS là block storage gắn vào 1 instance (trừ multi-attach io1/io2 nhưng limited).
- **B - SAI**: Sticky session (Session Affinity) có thể giúp user thấy đúng server cũ, nhưng nếu server đó chết -> mất access file. Và user cũng không thấy file upload lên server kia.
- **C - ĐÚNG**: Vấn đề là **Local EBS Storage** không được chia sẻ. Giải pháp là dùng **Amazon EFS** (Shared File System) mount vào cả 2 instances. Dữ liệu upload lên EFS sẽ được nhìn thấy bởi tất cả instances ngay lập tức.
- **D - SAI**: ALB không có tính năng gửi request tới cả 2 servers để merge response content.

---

## Câu 6

**Đề bài**: A company uses NFS to store large video files in on-premises network attached storage. Each video file ranges in size from 1 MB to 500 GB. The total storage is 70 TB and is no longer growing. The company decides to migrate the video files to Amazon S3. The company must migrate the video files as soon as possible while using the least possible network bandwidth. Which solution will meet these requirements?

**Các đáp án**:

- A. Use AWS CLI to copy all files locally to the S3 bucket.
- B. Create an AWS Snowball Edge job. Receive a Snowball Edge device. Transfer data. Return device.
- C. Deploy an S3 File Gateway. Transfer data.
- D. Setup AWS Direct Connect. Deploy S3 File Gateway.

**Đáp án đúng**: **B**

**Giải thích chi tiết**:

- **A - SAI**: Copy 70 TB qua mạng (CLI) sẽ tốn rất nhiều bandwidth và thời gian.
- **B - ĐÚNG**: **AWS Snowball Edge** là thiết bị chuyển dữ liệu offline (Physical transport). Phù hợp cho dung lượng lớn (70 TB) khi muốn tiết kiệm băng thông mạng ("least possible network bandwidth").
- **C, D - SAI**: S3 File Gateway hay Direct Connect đều truyền dữ liệu qua đường mạng (Internet hoặc Dedicated Line), vi phạm tiêu chí "least network bandwidth" so với offline transfer.

---

## Câu 7

**Đề bài**: A company has an application that ingests incoming messages. Dozens of other applications and microservices then quickly consume these messages. The number of messages varies drastically and sometimes increases suddenly to 100,000 each second. The company wants to decouple the solution and increase scalability. Which solution meets these requirements?

**Các đáp án**:

- A. Persist the messages to Amazon Kinesis Data Analytics.
- B. Deploy the ingestion application on Amazon EC2 instances in an Auto Scaling group.
- C. Write the messages to Amazon Kinesis Data Streams with a single shard.
- D. Publish the messages to an Amazon Simple Notification Service (Amazon SNS) topic with multiple Amazon Simple Queue Service (Amazon SQS) subscriptions.

**Đáp án đúng**: **D**

**Giải thích chi tiết**:

- **A - SAI**: Kinesis Analytics dùng để phân tích data stream (SQL), không phải message broker để decouple consumer apps.
- **B - SAI**: Scale Ingestion App chỉ giải quyết đầu vào, consumer vẫn bị coupled và overwhelmed nếu gọi trực tiếp.
- **C - SAI**: Single shard Kinesis chỉ chịu được 1MB/s hoặc 1000 records/s. 100,000/s sẽ throttling ngay lập tức.
- **D - ĐÚNG**: **SNS Fanout to SQS Pattern**.
  - **SNS**: Pub/Sub model. Cho phép nhiều consumer subscribe.
  - **SQS**: Hàng đợi giúp decouple và buffer messages. Mỗi consumer app có hàng đợi riêng (Queue Subscription), xử lý theo tốc độ riêng (Scalability). Handle spike tốt.

---

## Câu 8

**Đề bài**: A company is migrating a distributed application to AWS. The application serves variable workloads. The legacy platform consists of a primary server that coordinates jobs across multiple compute nodes. The company wants to modernize the application with a solution that maximizes resiliency and scalability. How should a solutions architect design the architecture to meet these requirements?

**Các đáp án**:

- A. SQS queue as destination. Compute nodes in ASG. Auto Scaling scheduled.
- B. SQS queue as destination. Compute nodes in ASG. Auto Scaling based on the size of the queue.
- C. Primary server and compute nodes in ASG. CloudTrail destination.
- D. Primary server and compute nodes in ASG. EventBridge destination.

**Đáp án đúng**: **B**

**Giải thích chi tiết**:

- **A - SAI**: Scheduled scaling không linh hoạt với "variable workloads".
- **B - ĐÚNG**:
  - **SQS**: Decoupling jobs from compute nodes. Resiliency (message stored until processed).
  - **ASG based on Queue Size (ApproximateNumberOfMessagesVisible)**: Scaling động dựa trên khối lượng công việc thực tế (BacklogPerInstance). Đây là pattern chuẩn cho Worker Fleet scaling.
- **C, D - SAI**: CloudTrail và EventBridge không phải nơi chứa job queue cho distributed processing resiliency như SQS.

---

## Câu 9

**Đề bài**: A company is running an SMB file server in its data center. The file server stores large files that are accessed frequently for the first few days after the files are created. After 7 days the files are rarely accessed. The total data size is increasing and is close to the company's total storage capacity. A solutions architect must increase the company's available storage space without losing low-latency access to the most recently accessed files. The solutions architect must also provide file lifecycle management to avoid future storage issues. Which solution will meet these requirements?

**Các đáp án**:

- A. Use AWS DataSync to copy older data.
- B. Create an Amazon S3 File Gateway. Create S3 Lifecycle to Glacier Deep Archive after 7 days.
- C. Create an Amazon FSx for Windows File Server.
- D. Install utility to access S3 directly.

**Đáp án đúng**: **C**

**Giải thích chi tiết**:

- **A - SAI**: DataSync copy xong phải xóa tay ở source? Khó quản lý transparent access cho user.
- **C - SAI**: FSx for Windows File Server là giải pháp thay thế hoàn toàn SMB server on-prem (cloud native), nhưng đề bài muốn "extend storage" và giữ low latency on-prem.
- **B - ĐÚNG** (hoặc **D**? Chờ chút).
  - Xem lại đề bài: "running an SMB file server... storage capacity... increase... without losing low-latency".
  - **S3 File Gateway (File Gateway)**: Cung cấp giao thức SMB, cache dữ liệu frequently accessed ở local (Low latency), dữ liệu cũ đẩy lên S3 (Unlimited storage).
  - Tuy nhiên B đề cập "Transition to Glacier Deep Archive after 7 days". Nếu data vào Deep Archive, việc truy cập lại sẽ mất 12h -> Mất tính năng "access rarely" nhưng vẫn access được ngay. Nếu "rarely" nghĩa là không cần ngay thì OK. Nhưng File Gateway thường giữ recent ở cache, warm ở S3 Standard/IA.
  - Thực tế **FSx File Gateway** (cho FSx Windows) mới là giải pháp tối ưu nhất cho SMB native hiện nay, nhưng S3 File Gateway cũng hỗ trợ SMB.
  - Đáp án C nói "Create FSx for Windows File Server" (Cloud Only) -> Nếu không có VPN/DX tốt latency sẽ cao.
  - Tuy nhiên, trong ngữ cảnh đề thi AWS cũ, **S3 File Gateway** thường là đáp án cho "Extend on-prem storage seamless".
  - Nhưng Lifecycle policy sang Deep Archive sau 7 ngày có vẻ hơi aggressive nếu user cần đọc lại file cũ ngay lập tức (sẽ lỗi IO data retrieval). Có thể đề bài implied "rarely accessed" = Archive.
  - Kiểm tra lại bank questions: Đáp án thường chọn là **C (FSx for Windows File Server)** nếu muốn native Windows compatibility hoàn toàn, hoặc **B (S3 File Gateway)** nếu muốn tiering rẻ tiền. S3 File Gateway hỗ trợ SMB.
  - Theo official docs: **Data lifecycle management** của FSxWFS (Data Deduplication) hoặc S3 Gateway.
  - Với keyword "SMB file server", "Extend storage", AWS thường hướng tới **Storage Gateway (Volume or File)**.
  - Tuy nhiên, S3 File Gateway cache policy: Local disk chứa most recently accessed. Đúng ý "low-latency access to most recently accessed files".
  - Vấn đề duy nhất là Deep Archive.
  - Hãy xem xét kỹ lại. Câu hỏi AWS Certified Solutions Architect Associate thường chọn **S3 File Gateway** cho kịch bản "On-prem storage extension + Cache".

**Đáp án đúng**: **B** (Chấp nhận giả định rằng Rarely Accessed = Archive). _Lưu ý: Nếu có đáp án FSx File Gateway (tên mới là Amazon FSx File Gateway), đó mới là chuẩn nhất cho SMB. Nhưng ở đây S3 File Gateway (File Gateway) cũng support SMB._

---

## Câu 10

**Đề bài**: A company is building an ecommerce web application on AWS. The application sends information about new orders to an Amazon API Gateway REST API to process. The company wants to ensure that orders are processed in the order that they are received. Which solution will meet these requirements?

**Các đáp án**:

- A. API Gateway -> SNS -> Lambda.
- B. API Gateway -> SQS FIFO -> Lambda.
- C. API Gateway authorizer block requests.
- D. API Gateway -> SQS standard -> Lambda.

**Đáp án đúng**: **B**

**Giải thích chi tiết**:

- **A - SAI**: SNS không đảm bảo thứ tự (Ordering).
- **B - ĐÚNG**: **SQS FIFO Queue** (First-In-First-Out) đảm bảo thứ tự tin nhắn được xử lý đúng theo trình tự gửi vào. Phù hợp yêu cầu "process in order".
- **C - SAI**: Block request là nonsence.
- **D - SAI**: SQS Standard Queue chỉ đảm bảo "Best-effort ordering", có thể deliver lộn xộn hoặc duplicate.

---

## Câu 11

**Đề bài**: A company has an application that runs on Amazon EC2 instances and uses an Amazon Aurora database. The EC2 instances connect to the database by using user names and passwords that are stored locally in a file. The company wants to minimize the operational overhead of credential management. What should a solutions architect do to accomplish this goal?

**Các đáp án**:

- A. Use AWS Secrets Manager. Turn on automatic rotation.
- B. Use AWS Systems Manager Parameter Store. Turn on automatic rotation.
- C. Create S3 bucket encrypted KMS.
- D. Encrypt EBS volume.

**Đáp án đúng**: **A**

**Giải thích chi tiết**:

- **A - ĐÚNG**: **AWS Secrets Manager** được thiết kế chuyên biệt để quản lý DB Credentials. Tính năng **Automatic Rotation** (tự động đổi mật khẩu DB định kỳ mà không cần sửa code app) giúp giảm thiểu tối đa "operational overhead".
- **B - SAI**: Parameter Store (Advanced) cũng có rotation nhưng configuration phức tạp hơn Secrets Manager đối với RDS (cần setup Lambda rotator thủ công hơn, trong khi Secrets Manager có built-in integration tốt hơn/Native rotation templates). Secrets Manager là đáp án ưu tiên cho DB Credential Rotation.
- **C, D - SAI**: Vẫn phải quản lý file thủ công, không có rotation tự động.

---

## Câu 12

**Đề bài**: A global company hosts its web application on Amazon EC2 instances behind an Application Load Balancer (ALB). The web application has static data and dynamic data. The company stores its static data in an Amazon S3 bucket. The company wants to improve performance and reduce latency for the static data and dynamic data. The company is using its own domain name registered with Amazon Route 53. What should a solutions architect do to meet these requirements?

**Các đáp án**:

- A. CloudFront distribution: Origins S3 + ALB. Route 53 routes to CloudFront.
- B. CloudFront for ALB. Global Accelerator for S3.
- C. CloudFront for S3. Global Accelerator for ALB (via custom domain).
- D. CloudFront for ALB. Global Accelerator for S3.

**Đáp án đúng**: **A**

**Giải thích chi tiết**:

- **A - ĐÚNG**: **Amazon CloudFront** là giải pháp tốt nhất để cache **Static Content** (từ S3) và tăng tốc **Dynamic Content** (từ ALB) thông qua cùng 1 Distribution (với nhiều Behaviors). Route 53 trỏ domain chính về CloudFront. Đây là kiến trúc chuẩn.
- **B - SAI**: Global Accelerator cho S3 (trừ khi sau ALB) là không cần thiết vì CloudFront đã tối ưu cho S3 static content tốt hơn (Caching). Global Accelerator chủ yếu cho non-HTTP traffic hoặc dynamic IP failover, nhưng CloudFront performance cho Web App (HTTP/S) usually better due to caching + edge termination.
- **C, D - SAI**: Phức tạp hóa vấn đề. 1 CloudFront Distribution xử lý được cả 2 origins.

---

## Câu 13

**Đề bài**: A company performs monthly maintenance on its AWS infrastructure. During these maintenance activities, the company needs to rotate the credentials for its Amazon RDS for MySQL databases across multiple AWS Regions. Which solution will meet these requirements with the LEAST operational overhead?

**Các đáp án**:

- A. AWS Secrets Manager. Multi-Region secret replication. Rotate on schedule.
- B. Systems Manager Parameter Store. Multi-Region replication.
- C. S3 + Lambda.
- D. KMS + DynamoDB + Lambda.

**Đáp án đúng**: **A**

**Giải thích chi tiết**:

- **A - ĐÚNG**: **AWS Secrets Manager** hỗ trợ **Multi-Region Replication**. Bạn update secret ở Primary Region, nó tự replicate sang Replica Regions. Auto-rotation hoạt động native. Đây là giải pháp ít overhead nhất.
- **B - SAI**: Parameter Store chưa strong bằng Secrets Manager về tính năng DB Rotation native integrations và Multi-Region replication management cho secrets specific.
- **C, D - SAI**: Custom solution dùng Lambda/DynamoDB quá phức tạp để maintain (High overhead).

---

## Câu 14

**Đề bài**: A company runs an ecommerce application on Amazon EC2 instances behind an Application Load Balancer. The instances run in an Amazon EC2 Auto Scaling group across multiple Availability Zones. The Auto Scaling group scales based on CPU utilization metrics. The ecommerce application stores the transaction data in a MySQL 8.0 database that is hosted on a large EC2 instance. The database's performance degrades quickly as application load increases. The application handles more read requests than write transactions. The company wants a solution that will automatically scale the database to meet the demand of unpredictable read workloads while maintaining high availability. Which solution will meet these requirements?

**Các đáp án**:

- A. Redshift.
- B. RDS Single-AZ. Add reader instances in different AZ.
- C. Amazon Aurora Multi-AZ. Configure Aurora Auto Scaling with Aurora Replicas.
- D. ElastiCache Memcached.

**Đáp án đúng**: **C**

**Giải thích chi tiết**:

- **A - SAI**: Redshift là OLAP (Analytics), không phải OLTP cho Ecommerce.
- **B - SAI**: RDS MySQL có Read Replica, nhưng việc tự động scale (Auto Scaling) Read Replicas không native và mượt như Aurora.
- **C - ĐÚNG**: **Amazon Aurora** hỗ trợ **Auto Scaling Read Replicas**. Khi CPU load tăng, Aurora tự động thêm Replica mới để handle read traffic. Database Endpoint (Reader Endpoint) tự động load balance giữa các replicas. Rất phù hợp cho "unpredictable read workloads".
- **D - SAI**: ElastiCache giúp giảm tải DB, nhưng không phải giải pháp "Automatically scale database" trực tiếp.

---

## Câu 15

**Đề bài**: A company recently migrated to AWS and wants to implement a solution to protect the traffic that flows in and out of the production VPC. The company had an inspection server in its on-premises data center. The inspection server performed specific operations such as traffic flow inspection and traffic filtering. The company wants to have the same functionalities in the AWS Cloud. Which solution will meet these requirements?

**Các đáp án**:

- A. GuardDuty.
- B. Traffic Mirroring.
- C. AWS Network Firewall.
- D. Firewall Manager.

**Đáp án đúng**: **C**

**Giải thích chi tiết**:

- **A - SAI**: GuardDuty là Detection (IDS), không phải Prevention/Inspection & Filtering inline (IPS).
- **B - SAI**: Traffic Mirroring chỉ copy traffic ra để phân tích out-of-band, không chặn lọc traffic in-line.
- **C - ĐÚNG**: **AWS Network Firewall** là dịch vụ firewall managed, cung cấp khả năng **Deep Packet Inspection (DPI)**, filtering domain, IPS signature... cho traffic đi vào/ra VPC. Thay thế cho inspection appliance truyền thống.
- **D - SAI**: Firewall Manager là công cụ quản lý rule tập trung cho WAF/Network Firewall/Security Groups, bản thân nó không phải là cái firewall engine thực hiện inspection.

---

## Câu 16

**Đề bài**: A company hosts a data lake on AWS. The data lake consists of data in Amazon S3 and Amazon RDS for PostgreSQL. The company needs a reporting solution that provides data visualization and includes all the data sources within the data lake. Only the company's management team should have full access to all the visualizations. The rest of the company should have only limited access. Which solution will meet these requirements?

**Các đáp án**:

- A. Amazon QuickSight. Connect all data sources. Publish dashboards. Share with IAM roles.
- B. Amazon QuickSight. Connect various sources. Share with users/groups.
- C. Glue + Athena.
- D. Glue + Athena Federated Query + QuickSight (Implicit?).

**Đáp án đúng**: **B** (Hoặc A tùy context QuickSight User management).
_Vấn đề: RDS PostgreSQL nằm trong VPC, S3 public. QuickSight connect được cả 2._

**Giải thích chi tiết**:

- **A/B**: **Amazon QuickSight** là công cụ Data Visualization. Nó connect được S3 và RDS.
- Sự khác biệt A và B: QuickSight dùng **User/Group** (Native QuickSight users hoặc AD/IAM Identity Center users) để phân quyền access Dashboards, không phải share trực tiếp với "IAM Roles" theo cách thông thường của AWS Services (Assume Role). Cơ chế permission của QuickSight là User/Group based. -> **B** chính xác hơn về mặt QuickSight terminology.
- **C, D - SAI**: Chỉ nói về ETL/Query (Glue/Athena), chưa đề cập đến Visualize tool (như QuickSight) một cách rõ ràng để "provide data visualization".

**Đáp án đúng**: **B**

---

## Câu 17

**Đề bài**: A company is implementing a new business application. The application runs on two Amazon EC2 instances and uses an Amazon S3 bucket for document storage. A solutions architect needs to ensure that the EC2 instances can access the S3 bucket. What should the solutions architect do to meet this requirement?

**Các đáp án**:

- A. Create an IAM role. Attach to EC2.
- B. IAM policy.
- C. IAM group.
- D. IAM user.

**Đáp án đúng**: **A**

**Giải thích chi tiết**:

- **A - ĐÚNG**: **IAM Role** là cách an toàn nhất để ủy quyền cho EC2 instance. Instance Profile sẽ apply Role này cho EC2, giúp code trên EC2 có temporary credentials truy cập S3 mà không cần lưu hardcode access key.
- **B - SAI**: Policy là object chứa quyền, phải gắn vào User/Group/Role. Không gắn trực tiếp Policy vào EC2 được (phải qua Role).
- **C, D - SAI**: Gắn User/Group vào EC2 không phải là concept đúng. (Dùng Access Key của User thì bad practice).

---

## Câu 18

**Đề bài**: An application development team is designing a microservice that will convert large images to smaller, compressed images. When a user uploads an image through the web interface, the microservice should store the image in an Amazon S3 bucket, process and compress the image with an AWS Lambda function, and store the image in its compressed form in a different S3 bucket. A solutions architect needs to design a solution that uses durable, stateless components to process the images automatically. Which combination of actions will meet these requirements? (Choose two.)

**Các đáp án**:

- A. SQS queue. S3 notification to SQS.
- B. Lambda use SQS as invocation source. Delete message after processing.
- C. Lambda monitor S3.
- D. EC2 monitor SQS.

**Đáp án đúng**: **A, B**

**Giải thích chi tiết**:

- **A - ĐÚNG**: S3 Event Notification -> **SQS**. SQS đảm bảo tính bền vững (Durable) của event, tránh mất mát nếu Lambda quá tải.
- **B - ĐÚNG**: Lambda trigger từ SQS. Sau khi xử lý thành công, Lambda (hoặc service integration) xóa message khỏi queue. Đây là mô hình chuẩn "buffer-based processing".
- **C - SAI**: S3 trigger Lambda trực tiếp (Async) cũng được, nhưng nếu burst traffic lớn, Lambda có thể bị throttling và setup Dead Letter Queue phức tạp hơn. SQS bền vững hơn (Durable).
- **D - SAI**: Dùng EC2 vi phạm ý tưởng "serverless/microservice" hiện đại và tốn kém quản lý hơn.

---

## Câu 19

**Đề bài**: A company has a three-tier web application that is deployed on AWS. The web servers are deployed in a public subnet in a VPC. The application servers and database servers are deployed in private subnets in the same VPC. The company has deployed a third-party virtual firewall appliance from AWS Marketplace in an inspection VPC. The appliance is configured with an IP interface that can accept IP packets. A solutions architect needs to integrate the web application with the appliance to inspect all traffic to the application before the traffic reaches the web server. Which solution will meet these requirements with the LEAST operational overhead?

**Các đáp án**:

- A. NLB.
- B. ALB.
- C. Transit Gateway.
- D. Gateway Load Balancer.

**Đáp án đúng**: **D**

**Giải thích chi tiết**:

- **A, B - SAI**: NLB/ALB không thiết kế để route traffic qua Inspection Appliance một cách transparent ("Bump-in-the-wire") dễ dàng mà không thay đổi route table/NAT phức tạp.
- **C - SAI**: Transit Gateway Appliance Mode có hỗ trợ, nhưng cấu hình phức tạp (Route Tables quản lý).
- **D - ĐÚNG**: **Gateway Load Balancer (GWLB)** sinh ra chính xác cho use case này.
  - Deploy GWLB ở Inspection VPC (chứa Firewall Appliances).
  - Tạo **GWLB Endpoint (GWLBe)** ở Application VPC.
  - Route Table ở App VPC trỏ traffic qua GWLBe.
  - Traffic được inspect transparently. Cực kỳ ít overhead cấu hình so với TGW hay giải pháp cũ.

---

## Câu 20

**Đề bài**: A company wants to improve its ability to clone large amounts of production data into a test environment in the same AWS Region. The data is stored in Amazon EC2 instances on Amazon Elastic Block Store (Amazon EBS) volumes. Modifications to the cloned data must not affect the production environment. The software that accesses this data requires consistently high I/O performance. A solutions architect needs to minimize the time that is required to clone the production data into the test environment. Which solution will meet these requirements?

**Các đáp án**:

- A. Snapshot -> Instance store. (Instance store mất data khi stop -> bad choice for persistent data needs? Tuy nhiên đề bài nói Clone data để test. Nhưng restore snapshot vào Instance Store không trực tiếp được, phải copy thủ công -> Chậm).
- B. EBS Multi-Attach. (Chỉ attach được 1 volume vào nhiều instance, ghi đè data lẫn nhau -> Hỏng production data -> Sai).
- C. Snapshot -> New Volume -> Attach. (Standard process, nhưng phải chờ snapshot restore (lazy loading) -> I/O chậm lúc đầu. "Minimize time" + "High I/O" cần giải pháp nhanh hơn).
- D. Snapshot -> **EBS fast snapshot restore** -> New Volume.

**Đáp án đúng**: **D**

**Giải thích chi tiết**:

- **D - ĐÚNG**: **EBS Fast Snapshot Restore (FSR)** là tính năng cho phép tạo volume từ snapshot mà **không bị latency do lazy loading**. Volume đạt full performance ngay lập tức. Đây là cách "Minimize time" và đảm bảo "Consistently high I/O" cho test environment ngay từ giây đầu tiên.
- **C - SAI**: Nếu không bật FSR, volume mới restore từ snapshot sẽ bị chậm do dữ liệu được kéo từ S3 về dần dần khi truy cập.

---

## Câu 21

**Đề bài**: An ecommerce company wants to launch a one-deal-a-day website on AWS. Each day will feature exactly one product on sale for a period of 24 hours. The company wants to be able to handle millions of requests each hour with millisecond latency during peak hours. Which solution will meet these requirements with the LEAST operational overhead?

**Các đáp án**:

- A. S3 (Static) + CloudFront. Order data S3.
- B. EC2 ASG + ALB + RDS.
- C. EKS Containers.
- D. S3 (Static) + CloudFront. API Gateway + Lambda (Backend). DynamoDB (Data).

**Đáp án đúng**: **D**

**Giải thích chi tiết**:

- **A - SAI**: S3 không xử lý được logic đặt hàng (Order data) dynamic một cách bảo mật và transactional.
- **B, C - SAI**: EC2/EKS/RDS cần quản lý Server/Container, Scaling policy, DB connections... Overhead cao hơn Serverless.
- **D - ĐÚNG**: **Serverless Architecture**:
  - **S3 + CloudFront**: Host static web cực nhanh, chịu tải vô tận.
  - **API Gateway + Lambda**: Xử lý logic đặt hàng (Backend API), scale automatically với hàng triệu request.
  - **DynamoDB**: Key-Value DB, mili-second latency, handle traffic burst cực tốt (On-Demand capacity).
  - Đây là kiến trúc tối ưu nhất cho "One-deal-a-day" (Spike traffic lớn trong thời gian ngắn).

---

## Câu 22

**Đề bài**: A solutions architect is using Amazon S3 to design the storage architecture of a new digital media application. The media files must be resilient to the loss of an Availability Zone. Some files are accessed frequently while other files are rarely accessed in an unpredictable pattern. The solutions architect must minimize the costs of storing and retrieving the media files. Which storage option meets these requirements?

**Các đáp án**:

- A. S3 Standard.
- B. S3 Intelligent-Tiering.
- C. S3 Standard-IA.
- D. S3 One Zone-IA.

**Đáp án đúng**: **B**

**Giải thích chi tiết**:

- **A - SAI**: Đắt nếu có file rarely accessed.
- **B - ĐÚNG**: **S3 Intelligent-Tiering** tự động di chuyển object giữa 2 tiers: Frequent và Infrequent Access dựa trên access pattern thực tế. Với pattern "Unpredictable", đây là cách duy nhất tối ưu chi phí mà không lo phí retrieval fee.
- **C - SAI**: Nếu file accessed frequently mà để ở IA sẽ bị tính phí Retrieval rất đắt.
- **D - SAI**: One Zone không resilient to loss of AZ.

---

## Câu 23

**Đề bài**: A company is storing backup files by using Amazon S3 Standard storage. The files are accessed frequently for 1 month. However, the files are not accessed after 1 month. The company must keep the files indefinitely. Which storage solution will meet these requirements MOST cost-effectively?

**Các đáp án**:

- A. Intelligent-Tiering.
- B. Lifecycle to Glacier Deep Archive after 1 month.
- C. Lifecycle to Standard-IA after 1 month.
- D. Lifecycle to One Zone-IA after 1 month.

**Đáp án đúng**: **B**

**Giải thích chi tiết**:

- **A - SAI**: Intelligent-Tiering có phí management, và chỉ move xuống Archive tier sau 90 ngày (hoặc config custom). Nhưng Deep Archive rẻ hơn nhiều.
- **B - ĐÚNG**: Sau 1 tháng không truy cập nữa -> Chuyển thẳng xuống **Glacier Deep Archive** (rẻ nhất trong các loại storage). Vì "Keep indefinitely" (giữ mãi mãi) và "Not accessed", Deep Archive là lựa chọn tiết kiệm tiền nhất.
- **C, D - SAI**: Standard-IA/One Zone-IA vẫn đắt hơn Glacier Deep Archive rất nhiều.

---

## Câu 24

**Đề bài**: A company observes an increase in Amazon EC2 costs in its most recent bill. The billing team notices unwanted vertical scaling of instance types for a couple of EC2 instances. A solutions architect needs to create a graph comparing the last 2 months of EC2 costs and perform an in-depth analysis to identify the root cause of the vertical scaling. How should the solutions architect generate the information with the LEAST operational overhead?

**Các đáp án**:

- A. AWS Budgets. (Báo động budget, không phải tool analysis deep dive graph).
- B. Cost Explorer.
- C. Billing Dashboard graphs.
- D. Cost and Usage Reports (CUR) + QuickSight.

**Đáp án đúng**: **B**

**Giải thích chi tiết**:

- **B - ĐÚNG**: **AWS Cost Explorer** có sẵn tính năng vẽ biểu đồ (Graphing), lọc (Filter) theo Instance Type, hay Tag, Time range. Nó có sẵn trong console, không cần setup gì thêm -> Least operational overhead.
- **C - SAI**: Dashboard Billing cũ ít tính năng filter granular như Cost Explorer.
- **D - SAI**: Setup CUR, S3, Glue/Athena, QuickSight quá phức tạp (High overhead) chỉ để xem biểu đồ so sánh đơn giản.

---

## Câu 25

**Đề bài**: A company is designing an application. The application uses an AWS Lambda function to receive information through Amazon API Gateway and to store the information in an Amazon Aurora PostgreSQL database. During the proof-of-concept stage, the company has to increase the Lambda quotas significantly to handle the high volumes of data that the company needs to load into the database. A solutions architect must recommend a new design to improve scalability and minimize the configuration effort. Which solution will meet these requirements?

**Các đáp án**:

- A. Refactor to EC2 + Tomcat.
- B. Change Aurora to DynamoDB + DAX.
- C. Two Lambdas + SNS.
- D. Two Lambdas + SQS.

**Đáp án đúng**: **D**

**Giải thích chi tiết**:

- **A - SAI**: From Serverless to Server-based -> High effort configuration/management.
- **B - SAI**: Đổi Database engine từ SQL sang NoSQL là thay đổi cực lớn về Data Model/Code -> High effort.
- **C - SAI**: SNS push model. Nếu DB chậm, Lambda 2 vẫn phải scale up để hứng event từ SNS, vẫn bị bottleneck ở DB connection.
- **D - ĐÚNG**: **SQS Queue** ở giữa (Decoupling).
  - Lambda 1 (Receive) -> SQS -> Lambda 2 (Insert DB).
  - **Traffic Smoothing**: Nếu traffic spike, SQS buffer lại. Lambda 2 có thể xử lý từ từ với tốc độ DB chịu được (Throttling Lambda 2 concurrency).
  - Không cần tăng Quota Lambda quá mức. Đảm bảo Scalability và Resilience.

---

---

## Câu 26

**Đề bài**: A company needs to review its AWS Cloud deployment to ensure that its Amazon S3 buckets do not have unauthorized configuration changes. What should a solutions architect do to accomplish this goal?

**Các đáp án**:

- A. Turn on AWS Config with the appropriate rules.
- B. Turn on AWS Trusted Advisor with the appropriate checks.
- C. Turn on Amazon Inspector with the appropriate assessment template.
- D. Turn on Amazon S3 server access logging. Configure Amazon EventBridge (Amazon Cloud Watch Events).

**Đáp án đúng**: **A**

**Giải thích chi tiết**:

- **A - ĐÚNG**: **AWS Config** là dịch vụ cho phép đánh giá, kiểm toán và đánh giá cấu hình của tài nguyên AWS (Configuration Compliance). Với các Managed Rules (như `s3-bucket-public-read-prohibited`, `s3-bucket-ssl-requests-only`), nó tự động phát hiện mọi thay đổi cấu hình trái phép trên S3 buckets.
- **B - SAI**: **Trusted Advisor** cung cấp các khuyến nghị (recommendations) về Cost, Security, Performance... nhưng nó hoạt động theo cơ chế quét định kỳ (periodic check), không phải giám sát liên tục (continuous monitoring) mọi thay đổi cấu hình theo thời gian thực như Config.
- **C - SAI**: **Amazon Inspector** dùng để đánh giá lỗ hổng bảo mật (vulnerabilities) trên EC2 instance, ECR images, hoặc Lambda functions. Nó không dùng để audit cấu hình S3.
- **D - SAI**: **S3 Server Access Logging** ghi lại các request truy cập vào bucket (ai đã GET/PUT object), không ghi lại việc "thay đổi cấu hình" bucket (như ai đã tắt encryption, ai đã bật public access).

---

## Câu 27

**Đề bài**: A company is launching a new application and will display application metrics on an Amazon CloudWatch dashboard. The company's product manager needs to access this dashboard periodically. The product manager does not have an AWS account. A solutions architect must provide access to the product manager by following the principle of least privilege. Which solution will meet these requirements?

**Các đáp án**:

- A. Share the dashboard from the CloudWatch console. Enter the product manager's email address, and complete the sharing steps. Provide a shareable link for the dashboard to the product manager.
- B. Create an IAM user specifically for the product manager. Attach the CloudWatchReadOnlyAccess AWS managed policy to the user. Share the new login credentials with the product manager. Share the browser URL of the correct dashboard with the product manager.
- C. Create an IAM user for the company's employees. Attach the ViewOnlyAccess AWS managed policy to the IAM user. Share the new login credentials with the product manager. Ask the product manager to navigate to the CloudWatch console and locate the dashboard by name in the Dashboards section.
- D. Deploy a bastion server in a public subnet. When the product manager requires access to the dashboard, start the server and share the RDP credentials. On the bastion server, ensure that the browser is configured to open the dashboard URL with cached AWS credentials that have appropriate permissions to view the dashboard.

**Đáp án đúng**: **A**

**Giải thích chi tiết**:

- **A - ĐÚNG**: CloudWatch hỗ trợ tính năng **Share Dashboard** (publicly or with email authentication) mà không cần người nhận phải có AWS Account hay IAM User. Đây là cách tuân thủ nguyên tắc đặc quyền tối thiểu (least privilege) tốt nhất vì Product Manager chỉ xem được đúng 1 dashboard đó, không truy cập được bất kỳ thứ gì khác trong AWS Console.
- **B, C - SAI**: Việc tạo **IAM User** (dù quyền hạn chế) vẫn cho phép user đăng nhập vào AWS Console và có thể tò mò xem các thông tin khác. Nó cũng tạo thêm gánh nặng quản lý user/password (operational overhead).
- **D - SAI**: Giải pháp dùng **Bastion Server** để xem dashboard là cực kỳ phức tạp, tốn kém (chạy EC2) và rủi ro bảo mật (chia sẻ credential RDP).

---

## Câu 28

**Đề bài**: A company is migrating applications to AWS. The applications are deployed in different accounts. The company manages the accounts centrally by using AWS Organizations. The company's security team needs a single sign-on (SSO) solution across all the company's accounts. The company must continue managing the users and groups in its on-premises self-managed Microsoft Active Directory. Which solution will meet these requirements?

**Các đáp án**:

- A. Enable AWS Single Sign-On (AWS SSO) from the AWS SSO console. Create a one-way forest trust or a one-way domain trust to connect the company's self-managed Microsoft Active Directory with AWS SSO by using AWS Directory Service for Microsoft Active Directory.
- B. Enable AWS Single Sign-On (AWS SSO) from the AWS SSO console. Create a two-way forest trust to connect the company's self-managed Microsoft Active Directory with AWS SSO by using AWS Directory Service for Microsoft Active Directory.
- C. Use AWS Directory Service. Create a two-way trust relationship with the company's self-managed Microsoft Active Directory.
- D. Deploy an identity provider (IdP) on premises. Enable AWS Single Sign-On (AWS SSO) from the AWS SSO console.

**Đáp án đúng**: **B**

**Giải thích chi tiết**:

- **A - SAI**: Để AWS Managed Microsoft AD hoạt động trơn tru với On-premises AD trong kịch bản SSO phức tạp, AWS thường khuyến nghị **Two-way trust**. One-way trust (AWS trust On-prem) về lý thuyết có thể xác thực, nhưng Two-way trust đảm bảo tương thích tốt nhất cho các tính năng tìm kiếm user/group.
- **B - ĐÚNG**: **AWS SSO** (nay là AWS IAM Identity Center) tích hợp với **AWS Directory Service for Microsoft Active Directory** (AWS Managed AD). Bằng cách thiết lập **Two-way Forest Trust** giữa AWS Managed AD và On-premises AD, người dùng có thể đăng nhập vào AWS bằng chính tài khoản AD doanh nghiệp hiện có (SSO).
- **C - SAI**: Đáp án này quá chung chung ("Use AWS Directory Service"), không đề cập đến việc enable và cấu hình **AWS SSO**.
- **D - SAI**: Việc triển khai thêm một IdP on-premise là dư thừa nếu mục tiêu chỉ là kết nối AD có sẵn với AWS SSO.

---

## Câu 29

**Đề bài**: A company provides a Voice over Internet Protocol (VoIP) service that uses UDP connections. The service consists of Amazon EC2 instances that run in an Auto Scaling group. The company has deployments across multiple AWS Regions. The company needs to route users to the Region with the lowest latency. The company also needs automated failover between Regions. Which solution will meet these requirements?

**Các đáp án**:

- A. Deploy a Network Load Balancer (NLB) and an associated target group. Associate the target group with the Auto Scaling group. Use the NLB as an AWS Global Accelerator endpoint in each Region.
- B. Deploy an Application Load Balancer (ALB) and an associated target group. Associate the target group with the Auto Scaling group. Use the ALB as an AWS Global Accelerator endpoint in each Region.
- C. Deploy a Network Load Balancer (NLB) and an associated target group. Associate the target group with the Auto Scaling group. Create an Amazon Route 53 latency record that points to aliases for each NLB. Create an Amazon CloudFront distribution that uses the latency record as an origin.
- D. Deploy an Application Load Balancer (ALB) and an associated target group. Associate the target group with the Auto Scaling group. Create an Amazon Route 53 weighted record that points to aliases for each ALB. Deploy an Amazon CloudFront distribution that uses the weighted record as an origin.

**Đáp án đúng**: **A**

**Giải thích chi tiết**:

- **A - ĐÚNG**:
  - VoIP dùng giao thức **UDP** -> Phải dùng **Network Load Balancer (NLB)** (ALB chỉ hỗ trợ HTTP/HTTPS/gRPC, không hỗ trợ UDP).
  - Yêu cầu "lowest latency routing" và "automated failover" giữa các Regions -> **AWS Global Accelerator** là giải pháp tốt nhất (dùng mạng backbone của AWS, anycast IP). Global Accelerator hỗ trợ NLB endpoints.
- **B, D - SAI**: **Application Load Balancer (ALB)** không hỗ trợ giao thức UDP.
- **C - SAI**: **CloudFront** (CDN) chủ yếu hỗ trợ HTTP/HTTPS. Nó không proxiez UDP traffic cho VoIP tốt như Global Accelerator.

---

## Câu 30

**Đề bài**: A development team runs monthly resource-intensive tests on its general purpose Amazon RDS for MySQL DB instance with Performance Insights enabled. The testing lasts for 48 hours once a month and is the only process that uses the database. The team wants to reduce the cost of running the tests without reducing the compute and memory attributes of the DB instance. Which solution meets these requirements MOST cost-effectively?

**Các đáp án**:

- A. Stop the DB instance when tests are completed. Restart the DB instance when required.
- B. Use an Auto Scaling policy with the DB instance to automatically scale when tests are completed.
- C. Create a snapshot when tests are completed. Terminate the DB instance and restore the snapshot when required.
- D. Modify the DB instance to a low-capacity instance when tests are completed. Modify the DB instance again when required.

**Đáp án đúng**: **C**

**Giải thích chi tiết**:

- **A - SAI**: RDS chỉ cho phép dừng (Stop) tối đa **7 ngày**. Sau 7 ngày nó sẽ tự động chạy lại (autostart). Nếu test chỉ diễn ra "once a month", giải pháp Stop sẽ khiến DB chạy lãng phí trong 3 tuần còn lại.
- **B - SAI**: RDS Storage Auto Scaling chỉ tăng dung lượng, không giảm (scale down). RDS không có "Compute Auto Scaling" theo nghĩa Stop/Start instance về 0.
- **C - ĐÚNG**: Đây là cách tiết kiệm chi phí tuyệt đối (most cost-effective). Bạn chỉ trả tiền lưu trữ cho **Snapshot** (rất rẻ trên S3) trong suốt tháng. Khi nào cần test, restore snapshot ra DB mới (chỉ tốn tiền DB trong 48h chạy test).
- **D - SAI**: Dù scale down xuống instance nhỏ nhất (vd: db.t3.micro) thì vẫn phải trả tiền chạy instance liên tục 24/7 trong cả tháng, đắt hơn nhiều so với lưu snapshot.

---

## Câu 31

**Đề bài**: A company that hosts its web application on AWS wants to ensure all Amazon EC2 instances. Amazon RDS DB instances. and Amazon Redshift clusters are configured with tags. The company wants to minimize the effort of configuring and operating this check. What should a solutions architect do to accomplish this?

**Các đáp án**:

- A. Use AWS Config rules to define and detect resources that are not properly tagged.
- B. Use Cost Explorer to display resources that are not properly tagged. Tag those resources manually.
- C. Write API calls to check all resources for proper tag allocation. Periodically run the code on an EC2 instance.
- D. Write API calls to check all resources for proper tag allocation. Schedule an AWS Lambda function through Amazon CloudWatch to periodically run the code.

**Đáp án đúng**: **A**

**Giải thích chi tiết**:

- **A - ĐÚNG**: **AWS Config** cung cấp sẵn Managed Rule tên là `required-tags`. Chỉ cần bật rule này lên, nhập key mong muốn (vd: `CostCenter`), nó sẽ tự động quét và báo cáo (non-compliant) tất cả resources thiếu tag đó. Đây là giải pháp "minimize effort" nhất.
- **B - SAI**: **Cost Explorer** dùng để xem chi phí, việc tìm resource không tag ở đây rất thủ công và không bao quát hết các loại resource state (ví dụ resource mới tạo chưa phát sinh cost).
- **C, D - SAI**: Việc tự viết code (API calls) chạy trên EC2 hoặc Lambda đòi hỏi công sức phát triển, bảo trì code (maintenance overhead), vi phạm nguyên tắc "minimize effort".

---

## Câu 32

**Đề bài**: A development team needs to host a website that will be accessed by other teams. The website contents consist of HTML, CSS, client-side JavaScript, and images. Which method is the MOST cost-effective for hosting the website?

**Các đáp án**:

- A. Containerize the website and host it in AWS Fargate.
- B. Create an Amazon S3 bucket and host the website there.
- C. Deploy a web server on an Amazon EC2 instance to host the website.
- D. Configure an Application Load Balancer with an AWS Lambda target that uses the Express.js framework.

**Đáp án đúng**: **B**

**Giải thích chi tiết**:

- **A - SAI**: **AWS Fargate** (Serverless Containers) tốn chi phí chạy task liên tục, quá mức cần thiết (overkill) cho website tĩnh.
- **B - ĐÚNG**: Với nội dung tĩnh (HTML, CSS, JS, Images), **Amazon S3 Static Website Hosting** là giải pháp chuẩn mực, rẻ nhất (most cost-effective) và dễ cấu hình nhất. Không cần quản lý server.
- **C - SAI**: **EC2** tốn tiền instance 24/7 và công sức quản trị OS/Web Server.
- **D - SAI**: **ALB + Lambda** phức tạp và đắt đỏ hơn nhiều so với S3 hosting.

---

## Câu 33

**Đề bài**: A company runs an online marketplace web application on AWS. The application serves hundreds of thousands of users during peak hours. The company needs a scalable, near-real-time solution to share the details of millions of financial transactions with several other internal applications. Transactions also need to be processed to remove sensitive data before being stored in a document database for low-latency retrieval. What should a solutions architect recommend to meet these requirements?

**Các đáp án**:

- A. Store the transactions data into Amazon DynamoDB. Set up a rule in DynamoDB to remove sensitive data from every transaction upon write. Use DynamoDB Streams to share the transactions data with other applications.
- B. Stream the transactions data into Amazon Kinesis Data Firehose to store data in Amazon DynamoDB and Amazon S3. Use AWS Lambda integration with Kinesis Data Firehose to remove sensitive data.
- C. Stream the transactions data into Amazon Kinesis Data Streams. Use AWS Lambda integration to remove sensitive data from every transaction and then store the transactions data in Amazon DynamoDB. Other applications can consume the transactions data off the Kinesis data stream.
- D. Store the batched transactions data in Amazon S3 as files. Use AWS Lambda to process every file and remove sensitive data before updating the files in Amazon S3. The Lambda function then stores the data in Amazon DynamoDB. Other applications can consume transaction files stored in Amazon S3.

**Đáp án đúng**: **C**

**Giải thích chi tiết**:

- **A - SAI**: DynamoDB không có tính năng "rule to remove data upon write". Logic này phải nằm ở application layer hoặc stream consumer. Hơn nữa, DynamoDB Streams hạn chế số lượng consumer (max 2 processes reading same shard concurrently).
- **B - SAI**: **Kinesis Firehose** chuyên dùng để load data vào destinations (S3, Redshift, Splunk), nó không tối ưu cho việc "share with several other internal applications" theo kiểu real-time stream processing như Kinesis Data Streams. Firehose thường có độ trễ (buffer time 60s+).
- **C - ĐÚNG**:
  - **Kinesis Data Streams** hỗ trợ hàng nghìn consumer đọc dữ liệu song song (Fan-out).
  - **AWS Lambda** có thể trigger từ Kinesis record để xử lý (remove sensitive data) trước khi ghi vào **DynamoDB** (Document DB low-latency).
  - Các internal apps khác có thể subscribe vào Stream để lấy data gốc (hoặc data đã xử lý nếu architecture khác).
- **D - SAI**: Mô hình Batch qua S3 làm mất tính năng "Near-real-time".

---

## Câu 34

**Đề bài**: A company hosts its multi-tier applications on AWS. For compliance, governance, auditing, and security, the company must track configuration changes on its AWS resources and record a history of API calls made to these resources. What should a solutions architect do to meet these requirements?

**Các đáp án**:

- A. Use AWS CloudTrail to track configuration changes and AWS Config to record API calls.
- B. Use AWS Config to track configuration changes and AWS CloudTrail to record API calls.
- C. Use AWS Config to track configuration changes and Amazon CloudWatch to record API calls.
- D. Use AWS CloudTrail to track configuration changes and Amazon CloudWatch to record API calls.

**Đáp án đúng**: **B**

**Giải thích chi tiết**:

- **A - SAI**: Bị ngược. CloudTrail track API calls, Config track Configuration.
- **B - ĐÚNG**: Đây là định nghĩa sách giáo khoa:
  - **AWS Config**: "Config" = Configuration. Theo dõi trạng thái resource (VD: Security Group mở port nào, thay đổi lúc nào).
  - **AWS CloudTrail**: "Trail" = Dấu vết. Ghi lại ai (User), làm gì (API Call), ở đâu (Source IP), khi nào (Time).
- **C, D - SAI**: CloudWatch dùng để monitoring (Metrics, Logs, Dashboards), không phải công cụ chính để audit API calls (dù CloudTrail có thể đẩy log sang CloudWatch Logs, nhưng gốc vẫn là CloudTrail).

---

## Câu 35

**Đề bài**: A company is preparing to launch a public-facing web application in the AWS Cloud. The architecture consists of Amazon EC2 instances within a VPC behind an Elastic Load Balancer (ELB). A third-party service is used for the DNS. The company's solutions architect must recommend a solution to detect and protect against large-scale DDoS attacks. Which solution meets these requirements?

**Các đáp án**:

- A. Enable Amazon GuardDuty on the account.
- B. Enable Amazon Inspector on the EC2 instances.
- C. Enable AWS Shield and assign Amazon Route 53 to it.
- D. Enable AWS Shield Advanced and assign the ELB to it.

**Đáp án đúng**: **D**

**Giải thích chi tiết**:

- **A - SAI**: **GuardDuty** phát hiện mối đe dọa (Threat Detection), không mitigated DDoS attack trực tiếp.
- **B - SAI**: **Inspector** quét lỗ hổng phần mềm.
- **C - SAI**: Route 53 được bảo vệ bởi Shield Standard mặc định. Tuy nhiên đề bài nói dùng "Third-party DNS", nên không thể assign Shield cho Route 53 trong context này được mà cần bảo vệ Endpoint chính là ELB.
- **D - ĐÚNG**: **AWS Shield Advanced** cung cấp khả năng bảo vệ DDoS nâng cao cho **Elastic Load Balancer (ELB)**, CloudFront và Global Accelerator. Nó bao gồm hỗ trợ từ đội phản ứng nhanh (DRT) và bảo hiểm chi phí (cost protection) khi bị tấn công DDoS large-scale.

---

## Câu 36

**Đề bài**: A company is building an application in the AWS Cloud. The application will store data in Amazon S3 buckets in two AWS Regions. The company must use an AWS Key Management Service (AWS KMS) customer managed key to encrypt all data that is stored in the S3 buckets. The data in both S3 buckets must be encrypted and decrypted with the same KMS key. The data and the key must be stored in each of the two Regions. Which solution will meet these requirements with the LEAST operational overhead?

**Các đáp án**:

- A. Create an S3 bucket in each Region. Configure the S3 buckets to use server-side encryption with Amazon S3 managed encryption keys (SSE-S3). Configure replication between the S3 buckets.
- B. Create a customer managed multi-Region KMS key. Create an S3 bucket in each Region. Configure replication between the S3 buckets. Configure the application to use the KMS key with client-side encryption.
- C. Create a customer managed KMS key and an S3 bucket in each Region. Configure the S3 buckets to use server-side encryption with Amazon S3 managed encryption keys (SSE-S3). Configure replication between the S3 buckets.
- D. Create a customer managed KMS key and an S3 bucket in each Region. Configure the S3 buckets to use server-side encryption with AWS KMS keys (SSE-KMS). Configure replication between the S3 buckets.

**Đáp án đúng**: **B**

**Giải thích chi tiết**:

- **A, C - SAI**: SSE-S3 sử dụng keys do Amazon quản lý, không phải "customer managed key".
- **B - ĐÚNG**: **Multi-Region KMS Key** (Replica Keys) cho phép tạo 1 key có cùng Key ID và key material ở nhiều Regions khác nhau. Điều này cho phép ứng dụng mã hóa data ở Region A và giải mã ở Region B mà không cần phải re-encrypt dữ liệu (vì key giống hệt nhau). Yêu cầu "Application use KMS key with client-side encryption" phù hợp với pattern kiểm soát encryption chặt chẽ. (Lưu ý: SSE-KMS với Multi-Region key cũng là 1 giải pháp, nhưng đề B nói rõ cấu hình chi tiết hơn về việc replication key).
- **D - SAI**: Nếu tạo 2 Customer Managed Key riêng biệt ở 2 Region (không phải Multi-Region Key), data replicate sang Region kia sẽ không giải mã được trừ khi có cơ chế re-encrypt phức tạp, và Key ID sẽ khác nhau.

---

## Câu 37

**Đề bài**: A company recently launched a variety of new workloads on Amazon EC2 instances in its AWS account. The company needs to create a strategy to access and administer the instances remotely and securely. The company needs to implement a repeatable process that works with native AWS services and follows the AWS Well-Architected Framework. Which solution will meet these requirements with the LEAST operational overhead?

**Các đáp án**:

- A. Use the EC2 serial console to directly access the terminal interface of each instance for administration.
- B. Attach the appropriate IAM role to each existing instance and new instance. Use AWS Systems Manager Session Manager to establish a remote SSH session.
- C. Create an administrative SSH key pair. Load the public key into each EC2 instance. Deploy a bastion host in a public subnet to provide a tunnel for administration of each instance.
- D. Establish an AWS Site-to-Site VPN connection. Instruct administrators to use their local on-premises machines to connect directly to the instances by using SSH keys across the VPN tunnel.

**Đáp án đúng**: **B**

**Giải thích chi tiết**:

- **A - SAI**: **EC2 Serial Console** chủ yếu dùng để troubleshoot khi instance không boot được hoặc mất kết nối mạng, không phải công cụ quản trị (administer) hàng ngày cho toàn bộ fleet.
- **B - ĐÚNG**: **Systems Manager Session Manager** là giải pháp native hiện đại thay thế SSH. Không cần mở port 22, không cần quản lý SSH keys, xác thực qua IAM, và có audit logs đầy đủ. Đây là Best Practice trong Well-Architected Framework.
- **C, D - SAI**: Dùng Bastion Host hoặc VPN + SSH Keys làm tăng gánh nặng quản lý keys và security groups (operational overhead), rủi ro lộ key.

---

## Câu 38

**Đề bài**: A company is hosting a static website on Amazon S3 and is using Amazon Route 53 for DNS. The website is experiencing increased demand from around the world. The company must decrease latency for users who access the website. Which solution meets these requirements MOST cost-effectively?

**Các đáp án**:

- A. Replicate the S3 bucket that contains the website to all AWS Regions. Add Route 53 geolocation routing entries.
- B. Provision accelerators in AWS Global Accelerator. Associate the supplied IP addresses with the S3 bucket. Edit the Route 53 entries to point to the IP addresses of the accelerators.
- C. Add an Amazon CloudFront distribution in front of the S3 bucket. Edit the Route 53 entries to point to the CloudFront distribution.
- D. Enable S3 Transfer Acceleration on the bucket. Edit the Route 53 entries to point to the new endpoint.

**Đáp án đúng**: **C**

**Giải thích chi tiết**:

- **A - SAI**: Replicate data sang tất cả regions quá phức tạp và tốn kém chi phí lưu trữ.
- **B - SAI**: **Global Accelerator** không hỗ trợ S3 Bucket làm endpoint (trừ khi S3 đứng sau ALB/EC2 - mô hình static web hosting trực tiếp S3 không gán được vào GA).
- **C - ĐÚNG**: **Amazon CloudFront** là CDN (Content Delivery Network) cache nội dung tại hàng trăm Edge Locations trên toàn cầu. User sẽ truy cập vào Edge Location gần nhất -> Giảm latency tối đa cho static website.
- **D - SAI**: **S3 Transfer Acceleration** dùng để tăng tốc upload (PUT) data vào S3, không phải để tăng tốc việc truy cập/xem website (GET) cho end-users.

---

## Câu 39

**Đề bài**: A company maintains a searchable repository of items on its website. The data is stored in an Amazon RDS for MySQL database table that contains more than 10 million rows. The database has 2 TB of General Purpose SSD storage. There are millions of updates against this data every day through the company's website. The company has noticed that some insert operations are taking 10 seconds or longer. The company has determined that the database storage performance is the problem. Which solution addresses this performance issue?

**Các đáp án**:

- A. Change the storage type to Provisioned IOPS SSD.
- B. Change the DB instance to a memory optimized instance class.
- C. Change the DB instance to a burstable performance instance class.
- D. Enable Multi-AZ RDS read replicas with MySQL native asynchronous replication.

**Đáp án đúng**: **A**

**Giải thích chi tiết**:

- **A - ĐÚNG**: Vấn đề là "storage performance" chậm trong các thao tác ghi (Insert/Update). **Provisioned IOPS SSD (io1/io2)** cung cấp hiệu năng I/O ổn định và cao hơn nhiều so với General Purpose (gp2/gp3), chuyên dụng cho write-intensive workloads.
- **B - SAI**: Memory optimized giúp cache data tốt hơn cho Read, nhưng nếu bottleneck là Disk I/O latency khi Write thì RAM không giải quyết triệt để.
- **C - SAI**: Burstable (T-class) performance còn thấp hơn dòng M/R hiện tại.
- **D - SAI**: Read Replicas dùng để scale **Read**, không giúp tăng tốc độ **Write** (Insert). Thậm chí Multi-AZ có thể làm write chậm đi đôi chút (do synchronous replication), dù nó cần thiết cho HA.

---

## Câu 40

**Đề bài**: A company has thousands of edge devices that collectively generate 1 TB of status alerts each day. Each alert is approximately 2 KB in size. A solutions architect needs to implement a solution to ingest and store the alerts for future analysis. The company wants a highly available solution. However, the company needs to minimize costs and does not want to manage additional infrastructure. Additionally, the company wants to keep 14 days of data available for immediate analysis and archive any data older than 14 days. What is the MOST operationally efficient solution that meets these requirements?

**Các đáp án**:

- A. Create an Amazon Kinesis Data Firehose delivery stream to ingest the alerts. Configure the Kinesis Data Firehose stream to deliver the alerts to an Amazon S3 bucket. Set up an S3 Lifecycle configuration to transition data to Amazon S3 Glacier after 14 days.
- B. Launch Amazon EC2 instances across two Availability Zones and place them behind an Elastic Load Balancer to ingest the alerts. Create a script on the EC2 instances that will store the alerts in an Amazon S3 bucket.
- C. Create an Amazon Kinesis Data Firehose delivery stream to ingest the alerts. Configure the Kinesis Data Firehose stream to deliver the alerts to an Amazon OpenSearch Service cluster.
- D. Create an Amazon Simple Queue Service (Amazon SQS) standard queue to ingest the alerts, and set the message retention period to 14 days.

**Đáp án đúng**: **A**

**Giải thích chi tiết**:

- **A - ĐÚNG**:
  - **Kinesis Data Firehose**: Serverless, managed ingestion, scale tự động, buffer và đẩy data vào S3.
  - **S3**: Storage rẻ, highly available.
  - **Lifecycle Policy**: Tự động chuyển sang Glacier (Archive) sau 14 ngày -> "Minimize costs".
- **B - SAI**: Quản lý EC2/ELB vi phạm yêu cầu "does not want to manage additional infrastructure".
- **C - SAI**: **OpenSearch** (Elasticsearch) đắt đỏ hơn S3 rất nhiều, không phải giải pháp "minimize costs" cho việc lưu trữ raw data.
- **D - SAI**: SQS có giới hạn retention tối đa 14 ngày, nhưng sau đó tin nhắn bị xóa vĩnh viễn (deleted), không thể archive. SQS cũng không phải là nơi lưu trữ để "analysis".

---

## Câu 41

**Đề bài**: A company's application integrates with multiple software-as-a-service (SaaS) sources for data collection. The company runs Amazon EC2 instances to receive the data and to upload the data to an Amazon S3 bucket for analysis. The same EC2 instance that receives and uploads the data also sends a notification to the user when an upload is complete. The company has noticed slow application performance and wants to improve the performance as much as possible. Which solution will meet these requirements with the LEAST operational overhead?

**Các đáp án**:

- A. Create an Auto Scaling group so that EC2 instances can scale out. Configure an S3 event notification to send events to an Amazon Simple Notification Service (Amazon SNS) topic when the upload to the S3 bucket is complete.
- B. Create an Amazon AppFlow flow to transfer data between each SaaS source and the S3 bucket. Configure an S3 event notification to send events to an Amazon Simple Notification Service (Amazon SNS) topic when the upload to the S3 bucket is complete.
- C. Create an Amazon EventBridge (Amazon CloudWatch Events) rule for each SaaS source to send output data. Configure the S3 bucket as the rule's target. Create a second EventBridge (Cloud Watch Events) rule to send events when the upload to the S3 bucket is complete. Configure an Amazon Simple Notification Service (Amazon SNS) topic as the second rule's target.
- D. Create a Docker container to use instead of an EC2 instance. Host the containerized application on Amazon Elastic Container Service (Amazon ECS). Configure Amazon CloudWatch Container Insights to send events to an Amazon Simple Notification Service (Amazon SNS) topic when the upload to the S3 bucket is complete.

**Đáp án đúng**: **B**

**Giải thích chi tiết**:

- **A - SAI**: Vẫn dùng EC2 để nhận data -> vẫn phải quản lý compute, vẫn có thể nghẽn mạng/CPU.
- **B - ĐÚNG**: **Amazon AppFlow** là dịch vụ fully managed chuyên biệt để tích hợp data từ các nguồn SaaS (Salesforce, ServiceNow, Slack...) vào AWS (S3, Redshift). Nó loại bỏ hoàn toàn gánh nặng xử lý trên EC2. Kết hợp với **S3 Event Notifications** trigger SNS topic để báo cáo -> Giải pháp tối ưu hiệu năng và vận hành nhất (Least operational overhead).
- **C - SAI**: EventBridge rules chủ yếu nhận event từ AWS services hoặc partner event bus, việc cấu hình trực tiếp "data transfer" từ SaaS vào S3 thông qua EventBridge Rule không phải là use case chính của nó (đó là việc của AppFlow).
- **D - SAI**: Chuyển sang Container/ECS chỉ thay đổi cách đóng gói, vẫn tốn tài nguyên compute để chạy application logic nhận data.

---

## Câu 42

**Đề bài**: A company runs a highly available image-processing application on Amazon EC2 instances in a single VPC. The EC2 instances run inside several subnets across multiple Availability Zones. The EC2 instances do not communicate with each other. However, the EC2 instances download images from Amazon S3 and upload images to Amazon S3 through a single NAT gateway. The company is concerned about data transfer charges. What is the MOST cost-effective way for the company to avoid Regional data transfer charges?

**Các đáp án**:

- A. Launch the NAT gateway in each Availability Zone.
- B. Replace the NAT gateway with a NAT instance.
- C. Deploy a gateway VPC endpoint for Amazon S3.
- D. Provision an EC2 Dedicated Host to run the EC2 instances.

**Đáp án đúng**: **C**

**Giải thích chi tiết**:

- **A - SAI**: Thêm nhiều NAT Gateway chỉ tăng chi phí hạ tầng (Processing fee) và không loại bỏ được Data Transfer fee khi đi qua NAT.
- **B - SAI**: NAT Instance rẻ hơn NAT Gateway một chút nhưng vẫn tốn tiền, hiệu năng kém và phải quản lý.
- **C - ĐÚNG**: **Gateway VPC Endpoint** cho S3 là **Miễn phí** (không tốn hourly fee, không tốn data processing fee). Traffic đi từ EC2 -> VPC Endpoint -> S3 nằm hoàn toàn trong mạng AWS, tránh được phí Data Transfer qua NAT Gateway.
- **D - SAI**: Dedicated Host rất đắt, không liên quan gì đến networking cost.

---

## Câu 43

**Đề bài**: A company has an on-premises application that generates a large amount of time-sensitive data that is backed up to Amazon S3. The application has grown and there are user complaints about internet bandwidth limitations. A solutions architect needs to design a long-term solution that allows for both timely backups to Amazon S3 and with minimal impact on internet connectivity for internal users. Which solution meets these requirements?

**Các đáp án**:

- A. Establish AWS VPN connections and proxy all traffic through a VPC gateway endpoint.
- B. Establish a new AWS Direct Connect connection and direct backup traffic through this new connection.
- C. Order daily AWS Snowball devices. Load the data onto the Snowball devices and return the devices to AWS each day.
- D. Submit a support ticket through the AWS Management Console. Request the removal of S3 service limits from the account.

**Đáp án đúng**: **B**

**Giải thích chi tiết**:

- **A - SAI**: VPN vẫn chạy trên đường truyền Internet công cộng (Internet connection). Nó mã hóa dữ liệu nhưng vẫn chiếm dụng băng thông chung (bandwidth limitations).
- **B - ĐÚNG**: **AWS Direct Connect** cung cấp đường truyền vật lý riêng biệt (dedicated network connection) nối từ on-premise tới AWS. Backup traffic chạy trên đường này sẽ không ảnh hưởng gì đến Internet bandwidth của user.
- **C - SAI**: Snowball là giải pháp offline, không đáp ứng được yêu cầu "time-sensitive data" (cần backup kịp thời) và vận hành hàng ngày quá cực.
- **D - SAI**: S3 Service Limits không liên quan đến Internet Bandwidth của khách hàng.

---

## Câu 44

**Đề bài**: A company has an Amazon S3 bucket that contains critical data. The company must protect the data from accidental deletion. Which combination of steps should a solutions architect take to meet these requirements? (Choose two.)

**Các đáp án**:

- A. Enable versioning on the S3 bucket.
- B. Enable MFA Delete on the S3 bucket.
- C. Create a bucket policy on the S3 bucket.
- D. Enable default encryption on the S3 bucket.
- E. Create a lifecycle policy for the objects in the S3 bucket.

**Đáp án đúng**: **A, B**

**Giải thích chi tiết**:

- **A - ĐÚNG**: **Versioning** giúp lưu giữ mọi phiên bản cũ của file. Nếu user xóa file, S3 chỉ chèn một "Delete Marker", file gốc vẫn còn và có thể khôi phục (undelete).
- **B - ĐÚNG**: **MFA Delete** yêu cầu xác thực đa yếu tố (Multi-factor Authentication) mới được phép xóa vĩnh viễn một object version hoặc tắt tính năng versioning. Đây là lớp bảo vệ mạnh nhất chống lại việc xóa nhầm hoặc admin bị lộ key.
- **C - SAI**: Bucket policy kiểm soát quyền truy cập, có thể deny delete action, nhưng nó là cơ chế phân quyền (AuthZ) chung, không chuyên biệt cho "accidental deletion" protection như Versioning/MFA.
- **D - SAI**: Encryption bảo vệ data confidentiality, không chống xóa.
- **E - SAI**: Lifecycle policy thường dùng để tự động xóa/archive file, nó có thể _gây ra_ việc data bị xóa nếu cấu hình sai, chứ không bảo vệ.

---

## Câu 45

**Đề bài**: A company has a data ingestion workflow that consists of the following: • An Amazon Simple Notification Service (Amazon SNS) topic for notifications about new data deliveries • An AWS Lambda function to process the data and record metadata The company observes that the ingestion workflow fails occasionally because of network connectivity issues. When such a failure occurs, the Lambda function does not ingest the corresponding data unless the company manually reruns the job. Which combination of actions should a solutions architect take to ensure that the Lambda function ingests all data in the future? (Choose two.)

**Các đáp án**:

- A. Deploy the Lambda function in multiple Availability Zones.
- B. Create an Amazon Simple Queue Service (Amazon SQS) queue, and subscribe it to the SNS topic.
- C. Increase the CPU and memory that are allocated to the Lambda function.
- D. Increase provisioned throughput for the Lambda function.
- E. Modify the Lambda function to read from an Amazon Simple Queue Service (Amazon SQS) queue.

**Đáp án đúng**: **B, E**

**Giải thích chi tiết**:

- **B, E - ĐÚNG**: Vấn đề là mất dữ liệu khi Lambda fail (do network). SNS retry policy có giới hạn, nếu fail hết là mất message. Giải pháp là chèn **SQS Queue** vào giữa SNS và Lambda.
  - SNS push message vào SQS (Reliable delivery, persistence).
  - Lambda đọc từ SQS. Nếu Lambda xử lý lỗi (do network), message vẫn nằm trong Queue (hoặc về lại queue sau Visibility Timeout) để thử lại (retry) sau đó. Đảm bảo "ingests all data", không bị mất.
- **A - SAI**: Lambda bản chất là Regional Service, nó tự động chạy trên nhiều AZs. Deploy "in multiple AZs" thường ám chỉ cấu hình VPC subnet, nhưng không giải quyết việc message bị drop khi code chạy lỗi.
- **C, D - SAI**: Tăng tài nguyên không giải quyết được lỗi kết nối mạng ngẫu nhiên (connectivity issues).

---

## Câu 46

**Đề bài**: A company has an application that provides marketing services to stores. The services are based on previous purchases by store customers. The stores upload transaction data to the company through SFTP, and the data is processed and analyzed to generate new marketing offers. Some of the files can exceed 200 GB in size. Recently, the company discovered that some of the stores have uploaded files that contain personally identifiable information (PII) that should not have been included. The company wants administrators to be alerted if PII is shared again. The company also wants to automate remediation. What should a solutions architect do to meet these requirements with the LEAST development effort?

**Các đáp án**:

- A. Use an Amazon S3 bucket as a secure transfer point. Use Amazon Inspector to scan the objects in the bucket. If objects contain PII, trigger an S3 Lifecycle policy to remove the objects that contain PII.
- B. Use an Amazon S3 bucket as a secure transfer point. Use Amazon Macie to scan the objects in the bucket. If objects contain PII, use Amazon Simple Notification Service (Amazon SNS) to trigger a notification to the administrators to remove the objects that contain PII.
- C. Implement custom scanning algorithms in an AWS Lambda function. Trigger the function when objects are loaded into the bucket.
- D. Implement custom scanning algorithms in an AWS Lambda function. Trigger the function when objects are loaded into the bucket. If objects contain PII, use Amazon Simple Email Service to trigger a notification.

**Đáp án đúng**: **B**

**Giải thích chi tiết**:

- **A - SAI**: **Amazon Inspector** không quét object trong S3, nó quét EC2/ECR.
- **B - ĐÚNG**: **Amazon Macie** là dịch vụ bảo mật dữ liệu sử dụng Machine Learning để tự động phát hiện dữ liệu nhạy cảm (Sensitive Data/PII) trong Amazon S3. Nó là giải pháp native cho yêu cầu này ("least development effort"). Khi phát hiện PII, Macie gửi event tới CloudWatch Events/EventBridge -> trigger **SNS** để thông báo cho admin.
- **C, D - SAI**: Việc tự viết thuật toán scan PII cho file 200GB trên Lambda là cực kỳ khó khăn (Lambda giới hạn thời gian chạy 15 phút, bộ nhớ 10GB). "Least development effort" yêu cầu dùng managed service như Macie.

---

## Câu 47

**Đề bài**: A company needs guaranteed Amazon EC2 capacity in three specific Availability Zones in a specific AWS Region for an upcoming event that will last 1 week. What should the company do to guarantee the EC2 capacity?

**Các đáp án**:

- A. Purchase Reserved Instances that specify the Region needed.
- B. Create an On-Demand Capacity Reservation that specifies the Region needed.
- C. Purchase Reserved Instances that specify the Region and three Availability Zones needed.
- D. Create an On-Demand Capacity Reservation that specifies the Region and three Availability Zones needed.

**Đáp án đúng**: **D**

**Giải thích chi tiết**:

- **A, C - SAI**: **Reserved Instances (RIs)** yêu cầu cam kết tối thiểu **1 năm**. Sự kiện chỉ kéo dài **1 tuần**, mua RIs sẽ lãng phí tiền của 51 tuần còn lại. Hơn nữa, Regional RIs (A) không guarantee capacity, chỉ billing discount. Zonal RIs (C) guarantee capacity nhưng lãng phí.
- **B - SAI**: Capacity Reservation bắt buộc phải chỉ định **Availability Zone** cụ thể, không thể chỉ định cấp Region.
- **D - ĐÚNG**: **On-Demand Capacity Reservation (ODCR)** cho phép reserve capacity trong 1 AZ cụ thể trong khoảng thời gian tùy ý (bất kỳ lúc nào). Bạn có thể tạo ODCR, dùng trong 1 tuần, rồi hủy -> chỉ trả tiền cho thời gian reserve. Đây là cách duy nhất đảm bảo capacity cho short-term event.

---

## Câu 48

**Đề bài**: A company's website uses an Amazon EC2 instance store for its catalog of items. The company wants to make sure that the catalog is highly available and that the catalog is stored in a durable location. What should a solutions architect do to meet these requirements?

**Các đáp án**:

- A. Move the catalog to Amazon ElastiCache for Redis.
- B. Deploy a larger EC2 instance with a larger instance store.
- C. Move the catalog from the instance store to Amazon S3 Glacier Deep Archive.
- D. Move the catalog to an Amazon Elastic File System (Amazon EFS) file system.

**Đáp án đúng**: **D**

**Giải thích chi tiết**:

- **A - SAI**: **ElastiCache (Redis)** là in-memory data store. Mặc dù Redis có persistence, nó chủ yếu được dùng làm Cache. Nếu cả cluster sập, data có thể mất hoặc cần thời gian reload. Nó chưa phải là nơi lưu trữ catalog "durable" chính thống nhất so với file system.
- **B - SAI**: **Instance Store** là ổ cứng gắn liền với host vật lý. Nếu EC2 instance stop/terminate hoặc host hỏng, dữ liệu mất vĩnh viễn (Not durable).
- **C - SAI**: **Glacier Deep Archive** là kho lưu trữ lạnh, thời gian lấy dữ liệu (retrieval time) lên tới 12-48 tiếng. Website catalog cần truy cập realtime.
- **D - ĐÚNG**: **Amazon EFS** lưu trữ dữ liệu trên nhiều AZs (Highly Available & Durable). Nó có thể mount vào nhiều EC2 instances, phù hợp để chứa catalog items (file ảnh, text) phục vụ cho website với độ tin cậy cao.

---

## Câu 49

**Đề bài**: A company stores call transcript files on a monthly basis. Users access the files randomly within 1 year of the call, but users access the files infrequently after 1 year. The company wants to optimize its solution by giving users the ability to query and retrieve files that are less than 1-yearold as quickly as possible. A delay in retrieving older files is acceptable. Which solution will meet these requirements MOST cost-effectively?

**Các đáp án**:

- A. Store individual files with tags in Amazon S3 Glacier Instant Retrieval. Query the tags to retrieve the files from S3 Glacier Instant Retrieval.
- B. Store individual files in Amazon S3 Intelligent-Tiering. Use S3 Lifecycle policies to move the files to S3 Glacier Flexible Retrieval after 1 year. Query and retrieve the files that are in Amazon S3 by using Amazon Athena. Query and retrieve the files that are in S3 Glacier by using S3 Glacier Select.
- C. Store individual files with tags in Amazon S3 Standard storage. Store search metadata for each archive in Amazon S3 Standard storage. Use S3 Lifecycle policies to move the files to S3 Glacier Instant Retrieval after 1 year. Query and retrieve the files by searching for metadata from Amazon S3.
- D. Store individual files in Amazon S3 Standard storage. Use S3 Lifecycle policies to move the files to S3 Glacier Deep Archive after 1 year. Store search metadata in Amazon RDS. Query the files from Amazon RDS. Retrieve the files from S3 Glacier Deep Archive.

**Đáp án đúng**: **C**

**Giải thích chi tiết**:

- **A - SAI**: Glacier Instant Retrieval dùng cho dữ liệu ít truy cập (save cost) nhưng cần lấy ngay. Dữ liệu <1 năm được truy cập "randomly" (thường xuyên/ngẫu nhiên), dùng GIR sẽ hứng chịu chi phí truy cập (Retrieval fees) rất cao. Nên dùng S3 Standard cho < 1 năm.
- **C - ĐÚNG**:
  - **S3 Standard** cho < 1 năm: truy cập nhanh, không phí retrieval (đúng ý "retrieve quickly").
  - **Metadata tags** giúp tìm kiếm file nhanh.
  - **Move to Glacier Instant Retrieval** after 1 year: Lưu trữ rẻ hơn Standard, retrieval time mili-seconds (vẫn nhanh) hoặc có thể chấp nhận delay. (Lưu ý: Đề bài nói "delay acceptable", thực ra phương án tối ưu tiền nhất là Deep Archive như D, nhưng D lại dùng RDS tốn kém). Trong các phương án đưa ra, C cân bằng nhất vì dùng S3 metadata search (rẻ hơn RDS) và GIR (storage rẻ hơn Standard).

---

## Câu 50

**Đề bài**: A company has a production workload that runs on 1,000 Amazon EC2 Linux instances. The workload is powered by third-party software. The company needs to patch the third-party software on all EC2 instances as quickly as possible to remediate a critical security vulnerability. What should a solutions architect do to meet these requirements?

**Các đáp án**:

- A. Create an AWS Lambda function to apply the patch to all EC2 instances.
- B. Configure AWS Systems Manager Patch Manager to apply the patch to all EC2 instances.
- C. Schedule an AWS Systems Manager maintenance window to apply the patch to all EC2 instances.
- D. Use AWS Systems Manager Run Command to run a custom command that applies the patch to all EC2 instances.

**Đáp án đúng**: **D**

**Giải thích chi tiết**:

- **A - SAI**: Dùng Lambda để SSH vào 1000 instances và chạy lệnh patch là giải pháp thủ công, khó scale, timeout (Lambda max 15p) và rủi ro bảo mật (quản lý key).
- **B - SAI**: **Patch Manager** chủ yếu dùng để quản lý vá lỗi Hệ điều hành (OS updates) dựa trên Patch Baesline. Vá lỗi ứng dụng "third-party software" đặc thù thường đòi hỏi chạy script update riêng. Hơn nữa Patch Manager thường chạy theo lịch.
- **C - SAI**: **Maintenance Window** cần lên lịch (schedule). Yêu cầu là "as quickly as possible" (ngay lập tức), việc chờ đến lịch bảo trì là không phù hợp với lỗ hổng critical.
- **D - ĐÚNG**: **AWS Systems Manager Run Command** cho phép chạy một câu lệnh (shell script update software) trên hàng nghìn EC2 instances cùng một lúc (parallel) ngay lập tức mà không cần SSH. Đây là cách nhanh nhất để deploy emergency fix.
