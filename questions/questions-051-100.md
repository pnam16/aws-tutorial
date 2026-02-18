# AWS SAA-C03 - Câu hỏi 51-100

## Câu 51

**Đề bài**:  A company is developing an application that provides order shipping statistics for retrieval by a REST API. The company wants to extract the shipping statistics, organize the data into an easy-to-read HTML format, and send the report to several email addresses at the same time every morning. Which combination of steps should a solutions architect take to meet these requirements? (Choose two.)

**Các đáp án**:

- A. Configure the application to send the data to Amazon Kinesis Data Firehose.
- B. Use Amazon Simple Email Service (Amazon SES) to format the data and to send the report by email.
- C. Create an Amazon EventBridge (Amazon CloudWatch Events) scheduled event that invokes an AWS Glue job to query the application's API for the data.
- D. Create an Amazon EventBridge (Amazon CloudWatch Events) scheduled event that invokes an AWS Lambda function to query the application's API for the data.
- E. Store the application data in Amazon S3. Create an Amazon Simple Notification Service (Amazon SNS) topic as an S3 event destination to send the report by email.

**Đáp án đúng**: **B, D**

**Giải thích chi tiết**:

- **D - ĐÚNG**: Vấn đề yêu cầu chạy "every morning" -> **EventBridge Scheduled Event** (Cron) là cơ chế chuẩn để trigger. **AWS Lambda** là môi trường compute serverless lý tưởng để thực hiện logic: trigger bởi EventBridge -> gọi REST API lấy data -> xử lý (organize) -> tạo HTML.
- **B - ĐÚNG**: Sau khi Lambda tạo nội dung HTML, nó cần gửi email. **Amazon SES** (Simple Email Service) là dịch vụ email chuyên dụng, hỗ trợ gửi email số lượng lớn, định dạng HTML phong phú. Lambda có thể gọi SES API để gửi báo cáo.
- **A - SAI**: Kinesis Data Firehose dùng để stream data vào kho lưu trữ (S3/Redshift), không phải để gửi email báo cáo format HTML.
- **C - SAI**: AWS Glue là ETL service dùng cho "big data transformation". Dùng Glue chỉ để query API và gửi email là quá cồng kềnh (overkill) và tốn thời gian khởi động (start-up time) hơn Lambda.
- **E - SAI**: SNS gửi email dạng raw text hoặc JSON object khi trigger từ S3, khó custom thành "easy-to-read HTML". Hơn nữa quy trình này thiếu bước "every morning" trigger và bước "extract statistics/organize".

---

## Câu 52

**Đề bài**:  A company wants to migrate its on-premises application to AWS. The application produces output files that vary in size from tens of gigabytes to hundreds of terabytes. The application data must be stored in a standard file system structure. The company wants a solution that scales automatically. is highly available, and requires minimum operational overhead. Which solution will meet these requirements?

**Các đáp án**:

- A. Migrate the application to run as containers on Amazon Elastic Container Service (Amazon ECS). Use Amazon S3 for storage.
- B. Migrate the application to run as containers on Amazon Elastic Kubernetes Service (Amazon EKS). Use Amazon Elastic Block Store (Amazon EBS) for storage.
- C. Migrate the application to Amazon EC2 instances in a Multi-AZ Auto Scaling group. Use Amazon Elastic File System (Amazon EFS) for storage.
- D. Migrate the application to Amazon EC2 instances in a Multi-AZ Auto Scaling group. Use Amazon Elastic Block Store (Amazon EBS) for storage.

**Đáp án đúng**: **C**

**Giải thích chi tiết**:

- **A - SAI**: **Amazon S3** là Object Storage, không phải "standard file system structure" (như NFS/SMB với thư mục, file locks, partial overwrites). Dù có thể mount, nhưng behavior không giống hệ thống file tiêu chuẩn cho application cũ.
- **B - SAI**: **EBS** là Block Storage, chỉ attach được vào 1 instance (trong 1 AZ) tại một thời điểm (trừ io2 Multi-Attach nhưng vẫn hạn chế). Nó không hỗ trợ shared file system truy cập đồng thời từ nhiều AZs 1 cách tự nhiên như EFS. EKS cũng đòi hỏi operational overhead cao.
- **C - ĐÚNG**:
  - **Amazon EFS** (Elastic File System) là hệ thống file chuẩn NFS, **fully managed**, tự động scale PB data, và hỗ trợ truy cập đồng thời từ hàng nghìn EC2 instances trên nhiều AZs (Highly Available). Đáp ứng mọi yêu cầu.
  - **EC2 Auto Scaling Group** Multi-AZ đảm bảo tính sẵn sàng cho ứng dụng compute.
- **D - SAI**: EBS Multi-Attach rất hạn chế và không phải là giải pháp file system chia sẻ chuẩn (standard shared FS) cho scaling application thông thường.

---

## Câu 53

**Đề bài**:  A company needs to store its accounting records in Amazon S3. The records must be immediately accessible for 1 year and then must be archived for an additional 9 years. No one at the company, including administrative users and root users, can be able to delete the records during the entire 10-year period. The records must be stored with maximum resiliency. Which solution will meet these requirements?

**Các đáp án**:

- A. Store the records in S3 Glacier for the entire 10-year period. Use an access control policy to deny deletion of the records for a period of 10 years.
- B. Store the records by using S3 Intelligent-Tiering. Use an IAM policy to deny deletion of the records. After 10 years, change the IAM policy to allow deletion.
- C. Use an S3 Lifecycle policy to transition the records from S3 Standard to S3 Glacier Deep Archive after 1 year. Use S3 Object Lock in compliance mode for a period of 10 years.
- D. Use an S3 Lifecycle policy to transition the records from S3 Standard to S3 One Zone-Infrequent Access (S3 One Zone-IA) after 1 year. Use S3 Object Lock in governance mode for a period of 10 years.

**Đáp án đúng**: **C**

**Giải thích chi tiết**:

- **A - SAI**: S3 Glacier không "immediately accessible" (cần minutes/hours để retrieve). Access Control Policy không ngăn được Root User xóa (Root luôn có thể sửa Policy).
- **B - SAI**: IAM Policy có thể bị sửa bởi Admin/Root. Không đảm bảo tính bất biến tuyệt đối (Immutability).
- **C - ĐÚNG**:
  - **S3 Standard** (access < 1 year) -> **Glacier Deep Archive** (archive cho 9 năm sau, rẻ nhất).
  - **S3 Object Lock** chế độ **Compliance Mode**: Đây là chìa khóa. Trong Compliance Mode, **không ai** (kể cả Root User AWS) có thể xóa hoặc ghi đè object trong thời gian retention period (10 năm). Đáp ứng yêu cầu "No one... can delete".
  - **Maximum Resiliency**: S3 Standard và Deep Archive đều lưu trên >=3 AZs (11 số 9 durability).
- **D - SAI**: **One Zone-IA** chỉ lưu trên 1 AZ (thấp hơn về resiliency). **Governance Mode** cho phép user có quyền đặc biệt (như root) có thể bypass và xóa khóa -> không đáp ứng "No one".

---

## Câu 54

**Đề bài**:  A company runs multiple Windows workloads on AWS. The company's employees use Windows file shares that are hosted on two Amazon EC2 instances. The file shares synchronize data between themselves and maintain duplicate copies. The company wants a highly available and durable storage solution that preserves how users currently access the files. What should a solutions architect do to meet these requirements?

**Các đáp án**:

- A. Migrate all the data to Amazon S3. Set up IAM authentication for users to access files.
- B. Set up an Amazon S3 File Gateway. Mount the S3 File Gateway on the existing EC2 instances.
- C. Extend the file share environment to Amazon FSx for Windows File Server with a Multi-AZ configuration. Migrate all the data to FSx for Windows File Server.
- D. Extend the file share environment to Amazon Elastic File System (Amazon EFS) with a Multi-AZ configuration. Migrate all the data to Amazon EFS.

**Đáp án đúng**: **C**

**Giải thích chi tiết**:

- **A - SAI**: S3 không hỗ trợ giao thức SMB (Windows File Share). Việc đổi sang S3 API/Console thay đổi hoàn toàn cách người dùng truy cập file.
- **B - SAI**: S3 File Gateway hỗ trợ SMB, nhưng backend là S3. Nó phù hợp cho Hybrid hoặc Backup hơn là thay thế hoàn toàn một Windows File Server workload hiệu năng cao với đầy đủ tính năng NTFS/Active Directory native.
- **C - ĐÚNG**: **Amazon FSx for Windows File Server** cung cấp Native Windows File System (SMB protocol, AD integration, NTFS permissions). **Multi-AZ** configuration cung cấp High Availability và Durability (replicate data giữa các AZs). Đây là giải pháp thay thế hoàn hảo (lift-and-shift) cho Windows File Server trên EC2.
- **D - SAI**: **EFS** hỗ trợ giao thức **NFS** (Linux), không hỗ trợ native Windows SMB.

---

## Câu 55

**Đề bài**:  A solutions architect is developing a VPC architecture that includes multiple subnets. The architecture will host applications that use Amazon EC2 instances and Amazon RDS DB instances. The architecture consists of six subnets in two Availability Zones. Each Availability Zone includes a public subnet, a private subnet, and a dedicated subnet for databases. Only EC2 instances that run in the private subnets can have access to the RDS databases. Which solution will meet these requirements?

**Các đáp án**:

- A. Create a new route table that excludes the route to the public subnets' CIDR blocks. Associate the route table with the database subnets.
- B. Create a security group that denies inbound traffic from the security group that is assigned to instances in the public subnets. Attach the security group to the DB instances.
- C. Create a security group that allows inbound traffic from the security group that is assigned to instances in the private subnets. Attach the security group to the DB instances.
- D. Create a new peering connection between the public subnets and the private subnets. Create a different peering connection between the private subnets and the database subnets.
-

**Đáp án đúng**: **C**

**Giải thích chi tiết**:

- **A - SAI**: Route table controlling đường đi (routing), không dùng để chặn/cho phép traffic giữa các subnet trong cùng VPC (vì mặc định có route "Local" cho phép tất cả các subnet thông nhau).
- **B - SAI**: Security Group (SG) là **Stateful firewall** và hoạt động dựa trên cơ chế **Allow list** (chỉ cho phép). Bạn không thể tạo rule **Deny** trong Security Group. (NACL mới có Deny, nhưng NACL quản lý theo Subnet/IP, không tham chiếu theo Security Group ID).
- **C - ĐÚNG**: Đây là mô hình "Security Group Chaining" chuẩn. Tạo SG cho DB (DB-SG) và chỉ thêm Inbound Rule cho phép traffic từ SG của App Private (App-SG). Mặc định mọi traffic khác sẽ bị chặn. Điều này đảm bảo chỉ EC2 trong Private Subnet (gán App-SG) mới vào được DB.
- **D - SAI**: Trong cùng 1 VPC, các subnet giao tiếp với nhau qua Route Local, không dùng **VPC Peering** (Peering dùng kết nối 2 VPC khác nhau).

---

## Câu 56

**Đề bài**:  A company has registered its domain name with Amazon Route 53. The company uses Amazon API Gateway in the ca-central-1 Region as a public interface for its backend microservice APIs. Third-party services consume the APIs securely. The company wants to design its API Gateway URL with the company's domain name and corresponding certificate so that the third-party services can use HTTPS. Which solution will meet these requirements?

**Các đáp án**:

- A. Create stage variables in API Gateway with Name="Endpoint-URL" and Value="Company Domain Name" to overwrite the default URL. Import the public certificate associated with the company's domain name into AWS Certificate Manager (ACM).
- B. Create Route 53 DNS records with the company's domain name. Point the alias record to the Regional API Gateway stage endpoint. Import the public certificate associated with the company's domain name into AWS Certificate Manager (ACM) in the us-east-1 Region.
- C. Create a Regional API Gateway endpoint. Associate the API Gateway endpoint with the company's domain name. Import the public certificate associated with the company's domain name into AWS Certificate Manager (ACM) in the same Region. Attach the certificate to the API Gateway endpoint. Configure Route 53 to route traffic to the API Gateway endpoint.
- D. Create a Regional API Gateway endpoint. Associate the API Gateway endpoint with the company's domain name. Import the public certificate associated with the company's domain name into AWS Certificate Manager (ACM) in the us-east-1 Region. Attach the certificate to the API Gateway APIs. Create Route 53 DNS records with the company's domain name. Point an A record to the company's domain name.

**Đáp án đúng**: **C**

**Giải thích chi tiết**:

- **A - SAI**: Stage variables dùng để truyền giá trị động vào runtime của API, không đổi được Base URL/Domain của API Gateway.
- **B, D - SAI**: Đối với **Regional API Gateway**, chứng chỉ SSL/TLS (ACM Certificate) BẮT BUỘC phải nằm ở **cùng Region** với API Gateway (ca-central-1). Chỉ khi dùng **Edge-Optimized API Gateway** thì certificate mới cần nằm ở **us-east-1** (CloudFront region). Đề bài nói rõ dùng API Gateway ở ca-central-1 và ám chỉ Regional endpoint.
- **C - ĐÚNG**: Quy trình chuẩn cho Custom Domain Name cho Regional API:
  1. Import/Request Cert ở ACM cùng region (ca-central-1).
  2. Trong API Gateway console, setup Custom Domain Name trỏ tới Cert đó.
  3. Tạo API Mapping.
  4. Trong Route 53, tạo Alias Record trỏ về API Gateway Domain Name.

---

## Câu 57

**Đề bài**:  A company is running a popular social media website. The website gives users the ability to upload images to share with other users. The company wants to make sure that the images do not contain inappropriate content. The company needs a solution that minimizes development effort. What should a solutions architect do to meet these requirements?

**Các đáp án**:

- A. Use Amazon Comprehend to detect inappropriate content. Use human review for low-confidence predictions.
- B. Use Amazon Rekognition to detect inappropriate content. Use human review for low-confidence predictions.
- C. Use Amazon SageMaker to detect inappropriate content. Use ground truth to label low-confidence predictions.
- D. Use AWS Fargate to deploy a custom machine learning model to detect inappropriate content. Use ground truth to label low-confidence predictions.

**Đáp án đúng**: **B**

**Giải thích chi tiết**:

- **A - SAI**: **Amazon Comprehend** dùng để xử lý **văn bản** (NLP), không xử lý hình ảnh.
- **B - ĐÚNG**: **Amazon Rekognition** là dịch vụ AI Managed cho hình ảnh/video. Tính năng **Content Moderation** (phát hiện nội dung nhạy cảm/không phù hợp) được tích hợp sẵn (Pre-trained). Kết hợp với **Amazon Augmented AI (A2I)** cho human review giúp đạt độ chính xác cao mà "minimize development effort" (không cần training model).
- **C, D - SAI**: Dùng SageMaker hay Custom Model yêu cầu thu thập dữ liệu, training, tuning, deploy -> Tốn rất nhiều development effort.

---

## Câu 58

**Đề bài**:  A company wants to run its critical applications in containers to meet requirements for scalability and availability. The company prefers to focus on maintenance of the critical applications. The company does not want to be responsible for provisioning and managing the underlying infrastructure that runs the containerized workload. What should a solutions architect do to meet these requirements?

**Các đáp án**:

- A. Use Amazon EC2 instances, and install Docker on the instances.
- B. Use Amazon Elastic Container Service (Amazon ECS) on Amazon EC2 worker nodes.
- C. Use Amazon Elastic Container Service (Amazon ECS) on AWS Fargate.
- D. Use Amazon EC2 instances from an Amazon Elastic Container Service (Amazon ECS)-optimized Amazon Machine Image (AMI).

**Đáp án đúng**: **C**

**Giải thích chi tiết**:

- **A, B, D - SAI**: Tất cả phương án liên quan đến **EC2** đều yêu cầu người dùng phải quản lý hạ tầng (Manage OS, Patching, Scaling instances, Cluster management). Vi phạm yêu cầu "does not want to be responsible for... managing infrastructure".
- **C - ĐÚNG**: **AWS Fargate** là **Serverless compute engine** cho containers. Bạn chỉ cần định nghĩa Task (CPU, RAM, Image), Fargate lo toàn bộ việc provision, scaling, patching hạ tầng bên dưới. Bạn focus hoàn toàn vào application.

---

## Câu 59

**Đề bài**:  A company hosts more than 300 global websites and applications. The company requires a platform to analyze more than 30 TB of clickstream data each day. What should a solutions architect do to transmit and process the clickstream data?

**Các đáp án**:

- A. Design an AWS Data Pipeline to archive the data to an Amazon S3 bucket and run an Amazon EMR cluster with the data to generate analytics.
- B. Create an Auto Scaling group of Amazon EC2 instances to process the data and send it to an Amazon S3 data lake for Amazon Redshift to use for analysis.
- C. Cache the data to Amazon CloudFront. Store the data in an Amazon S3 bucket. When an object is added to the S3 bucket. run an AWS Lambda function to process the data for analysis.
- D. Collect the data from Amazon Kinesis Data Streams. Use Amazon Kinesis Data Firehose to transmit the data to an Amazon S3 data lake. Load the data in Amazon Redshift for analysis.

**Đáp án đúng**: **D**

**Giải thích chi tiết**:

- **A - SAI**: AWS Data Pipeline là dịch vụ cũ, ít được khuyến nghị cho real-time data ingestion scale lớn (30TB/day).
- **B - SAI**: Dùng EC2 để tự hứng và process 30TB clickstream cần một lượng lớn instances và công sức quản lý scaling rất vất vả (undifferentiated heavy lifting).
- **C - SAI**: Lambda trigger S3 cho 30TB data (hàng tỷ files nhỏ) sẽ gây ra cost khủng khiếp và throttles. CloudFront logs có delay, không phải real-time stream processing.
- **D - ĐÚNG**: Đây là kiến trúc **Big Data Analytics** chuẩn mực trên AWS:
  - **Kinesis Data Streams**: Ingest data realtime với throughput lớn.
  - **Kinesis Data Firehose**: Buffer, compress, format và load data vào S3/Redshift tự động.
  - **Redshift**: Data Warehouse để analyze petabytes data.

---

## Câu 60

**Đề bài**:  A company has a website hosted on AWS. The website is behind an Application Load Balancer (ALB) that is configured to handle HTTP and HTTPS separately. The company wants to forward all requests to the website so that the requests will use HTTPS. What should a solutions architect do to meet this requirement?

**Các đáp án**:

- A. Update the ALB's network ACL to accept only HTTPS traffic.
- B. Create a rule that replaces the HTTP in the URL with HTTPS.
- C. Create a listener rule on the ALB to redirect HTTP traffic to HTTPS.
- D. Replace the ALB with a Network Load Balancer configured to use Server Name Indication (SNI).

**Đáp án đúng**: **C**

**Giải thích chi tiết**:

- **A - SAI**: Network ACL deny HTTP (port 80) sẽ làm user gõ `http://...` bị lỗi connection refused, thay vì được chuyển hướng sang trang an toàn.
- **B - SAI**: Không có loại rule "replace text in URL" đơn giản như vậy.
- **C - ĐÚNG**: ALB Listener Rule hỗ trợ action **Redirect**. Bạn cấu hình Listener port 80 (HTTP) với Default Action là "Redirect to HTTPS (port 443)". Đây là cách chuẩn để enforce HTTPS.
- **D - SAI**: NLB hoạt động ở Layer 4, không hiểu concept HTTP Redirect (Layer 7).

---

## Câu 61

**Đề bài**:  A company is developing a two-tier web application on AWS. The company's developers have deployed the application on an Amazon EC2 instance that connects directly to a backend Amazon RDS database. The company must not hardcode database credentials in the application. The company must also implement a solution to automatically rotate the database credentials on a regular basis. Which solution will meet these requirements with the LEAST operational overhead?

**Các đáp án**:

- A. Store the database credentials in the instance metadata. Use Amazon EventBridge (Amazon CloudWatch Events) rules to run a scheduled AWS Lambda function that updates the RDS credentials and instance metadata at the same time.
- B. Store the database credentials in a configuration file in an encrypted Amazon S3 bucket. Use Amazon EventBridge (Amazon CloudWatch Events) rules to run a scheduled AWS Lambda function that updates the RDS credentials and the credentials in the configuration file at the same time. Use S3 Versioning to ensure the ability to fall back to previous values.
- C. Store the database credentials as a secret in AWS Secrets Manager. Turn on automatic rotation for the secret. Attach the required permission to the EC2 role to grant access to the secret.
- D. Store the database credentials as encrypted parameters in AWS Systems Manager Parameter Store. Turn on automatic rotation for the encrypted parameters. Attach the required permission to the EC2 role to grant access to the encrypted parameters.

**Đáp án đúng**: **C**

**Giải thích chi tiết**:

- **A, B - SAI**: Lưu trong Metadata hay S3 config file đều là các giải pháp thủ công (custom solutions). Logic rotation rất phức tạp (phải update DB password, update config, đảm bảo atomic...). "Instance Metadata" không phải chỗ để lưu custom secrets.
- **D - SAI**: **Systems Manager Parameter Store** có thể lưu secure string, NHƯNG nó không có tính năng **Turn on automatic rotation** native cho RDS (muốn làm phải tự viết Lambda function custom).
- **C - ĐÚNG**: **AWS Secrets Manager** sinh ra để giải quyết đúng bài toán này. Nó lưu credentials mã hóa và có tính năng **Automatic Rotation** tích hợp sẵn cho RDS (dùng Lambda template có sẵn của AWS). "Least operational overhead".

---

## Câu 62

**Đề bài**:  A company is deploying a new public web application to AWS. The application will run behind an Application Load Balancer (ALB). The application needs to be encrypted at the edge with an SSL/TLS certificate that is issued by an external certificate authority (CA). The certificate must be rotated each year before the certificate expires. What should a solutions architect do to meet these requirements?

**Các đáp án**:

- A. Use AWS Certificate Manager (ACM) to issue an SSL/TLS certificate. Apply the certificate to the ALB. Use the managed renewal feature to automatically rotate the certificate.
- B. Use AWS Certificate Manager (ACM) to issue an SSL/TLS certificate. Import the key material from the certificate. Apply the certificate to the ALUse the managed renewal feature to automatically rotate the certificate.
- C. Use AWS Certificate Manager (ACM) Private Certificate Authority to issue an SSL/TLS certificate from the root CA. Apply the certificate to the ALB. Use the managed renewal feature to automatically rotate the certificate.
- D. Use AWS Certificate Manager (ACM) to import an SSL/TLS certificate. Apply the certificate to the ALB. Use Amazon EventBridge (Amazon CloudWatch Events) to send a notification when the certificate is nearing expiration. Rotate the certificate manually.

**Đáp án đúng**: **D**

**Giải thích chi tiết**:

- **A, B, C - SAI**: Đề bài yêu cầu chứng chỉ "issued by an **external certificate authority (CA)**" (ví dụ DigiCert, GoDaddy...). ACM không thể tự động renew (managed renewal) chứng chỉ do bên thứ 3 cấp. ACM chỉ auto-renew chứng chỉ do Amazon (Amazon Trust Services) cấp hoặc Private CA của AWS.
- **D - ĐÚNG**: Bạn có thể Import chứng chỉ bên ngoài vào ACM để dùng với ALB. Tuy nhiên, vì là hàng "xách tay" (Imported), ACM không thể tự đi renew giùm bạn. Bạn phải set up monitoring (qua EventBridge nhận event expiration) để thông báo admin import chứng chỉ mới (Manual Rotation).

---

## Câu 63

**Đề bài**:  A company runs its infrastructure on AWS and has a registered base of 700,000 users for its document management application. The company intends to create a product that converts large .pdf files to .jpg image files. The .pdf files average 5 MB in size. The company needs to store the original files and the converted files. A solutions architect must design a scalable solution to accommodate demand that will grow rapidly over time. Which solution meets these requirements MOST cost-effectively?

**Các đáp án**:

- A. Save the .pdf files to Amazon S3. Configure an S3 PUT event to invoke an AWS Lambda function to convert the files to .jpg format and store them back in Amazon S3.
- B. Save the .pdf files to Amazon DynamoDUse the DynamoDB Streams feature to invoke an AWS Lambda function to convert the files to .jpg format and store them back in DynamoDB.
- C. Upload the .pdf files to an AWS Elastic Beanstalk application that includes Amazon EC2 instances, Amazon Elastic Block Store (Amazon EBS) storage, and an Auto Scaling group. Use a program in the EC2 instances to convert the files to .jpg format. Save the .pdf files and the .jpg files in the EBS store.
- D. Upload the .pdf files to an AWS Elastic Beanstalk application that includes Amazon EC2 instances, Amazon Elastic File System (Amazon EFS) storage, and an Auto Scaling group. Use a program in the EC2 instances to convert the file to .jpg format. Save the .pdf files and the .jpg files in the EBS store.

**Đáp án đúng**: **A**

**Giải thích chi tiết**:

- **A - ĐÚNG**:
  - **S3** lưu file 5MB là chuẩn (Object Storage).
  - **Lambda** xử lý event-driven (khi có file upload -> convert) scale cực tốt với traffic burst ("demand grow rapidly"), không tốn tiền idle.
  - Đây là kiến trúc serverless phổ biến cho Image Processing.
- **B - SAI**: **DynamoDB** giới hạn item size **400 KB**. Không thể lưu file PDF 5MB trực tiếp trong DynamoDB.
- **C, D - SAI**: Dùng EC2 (managed bởi Beanstalk) tốn chi phí chạy thường trực, khả năng scale chậm hơn Lambda và operational overhead cao hơn. Lưu file vào EBS (C) thì các instance khác không thấy file (nếu scale in thì mất data).

---

## Câu 64

**Đề bài**:  A company has more than 5 TB of file data on Windows file servers that run on premises. Users and applications interact with the data each day. The company is moving its Windows workloads to AWS. As the company continues this process, the company requires access to AWS and onpremises file storage with minimum latency. The company needs a solution that minimizes operational overhead and requires no significant changes to the existing file access patterns. The company uses an AWS Site-to-Site VPN connection for connectivity to AWS. What should a solutions architect do to meet these requirements?

**Các đáp án**:

- A. Deploy and configure Amazon FSx for Windows File Server on AWS. Move the on-premises file data to FSx for Windows File Server. Reconfigure the workloads to use FSx for Windows File Server on AWS.
- B. Deploy and configure an Amazon S3 File Gateway on premises. Move the on-premises file data to the S3 File Gateway. Reconfigure the on-premises workloads and the cloud workloads to use the S3 File Gateway.
- C. Deploy and configure an Amazon S3 File Gateway on premises. Move the on-premises file data to Amazon S3. Reconfigure the workloads to use either Amazon S3 directly or the S3 File Gateway. depending on each workload's location.
- D. Deploy and configure Amazon FSx for Windows File Server on AWS. Deploy and configure an Amazon FSx File Gateway on premises. Move the on-premises file data to the FSx File Gateway. Configure the cloud workloads to use FSx for Windows File Server on AWS. Configure the on-premises workloads to use the FSx File Gateway.

**Đáp án đúng**: **D**

**Giải thích chi tiết**:

- **A - SAI**: Nếu chỉ deploy FSx trên AWS, user ở on-prem truy cập qua VPN sẽ bị độ trễ (latency).
- **B, C - SAI**: **S3 File Gateway** hỗ trợ SMB nhưng backend là S3 Object. Một số tính năng native của Windows File System (tương thích app cũ) có thể không hoàn toàn 100% như FSx.
- **D - ĐÚNG**: **Amazon FSx File Gateway** là giải pháp mở rộng của FSx.
  - Cloud: Dùng **FSx for Windows File Server** (Native Windows FS).
  - On-Prem: Dùng **FSx File Gateway** để cache dữ liệu từ Cloud về local -> Đảm bảo **minimum latency** cho on-prem users.
  - Mọi thứ đồng bộ trong suốt. User vẫn dùng SMB share như cũ ("no significant changes").

---

## Câu 65

**Đề bài**:  A hospital recently deployed a RESTful API with Amazon API Gateway and AWS Lambda. The hospital uses API Gateway and Lambda to upload reports that are in PDF format and JPEG format. The hospital needs to modify the Lambda code to identify protected health information (PHI) in the reports. Which solution will meet these requirements with the LEAST operational overhead?

**Các đáp án**:

- A. Use existing Python libraries to extract the text from the reports and to identify the PHI from the extracted text.
- B. Use Amazon Textract to extract the text from the reports. Use Amazon SageMaker to identify the PHI from the extracted text.
- C. Use Amazon Textract to extract the text from the reports. Use Amazon Comprehend Medical to identify the PHI from the extracted text.
- D. Use Amazon Rekognition to extract the text from the reports. Use Amazon Comprehend Medical to identify the PHI from the extracted text.

**Đáp án đúng**: **C**

**Giải thích chi tiết**:

- **A - SAI**: Tự xây dựng logic extract text (OCR) từ PDF/JPEG và logic NLP để nhận diện PHI (tên, bệnh án...) bằng thư viện Python là cực khó và độ chính xác thấp, tốn nhiều công sức dev.
- **B - SAI**: SageMaker cần train model custom, tốn effort.
- **C - ĐÚNG**: Kết hợp 2 Managed Services AI cực mạnh:
  - **Amazon Textract**: Chuyên extract text từ văn bản, form, table trong PDF/Image (OCR chuẩn).
  - **Amazon Comprehend Medical**: Chuyên xử lý văn bản y tế, tự động detect PHI/Medical entitites (thuốc, bệnh, tên bệnh nhân...).
  - Giải pháp "LEAST operational overhead".
- **D - SAI**: **Rekognition** chủ yếu detect object/face trong ảnh. Dù có tính năng detect text in image, nhưng khả năng xử lý document (PDF, form structure) kém xa Textract.

---

## Câu 66

**Đề bài**:  A company has an application that generates a large number of files, each approximately 5 MB in size. The files are stored in Amazon S3. Company policy requires the files to be stored for 4 years before they can be deleted. Immediate accessibility is always required as the files contain critical business data that is not easy to reproduce. The files are frequently accessed in the first 30 days of the object creation but are rarely accessed after the first 30 days. Which storage solution is MOST cost-effective?

**Các đáp án**:

- A. Create an S3 bucket lifecycle policy to move files from S3 Standard to S3 Glacier 30 days from object creation. Delete the files 4 years after object creation.
- B. Create an S3 bucket lifecycle policy to move files from S3 Standard to S3 One Zone-Infrequent Access (S3 One Zone-IA) 30 days from object creation. Delete the files 4 years after object creation.
- C. Create an S3 bucket lifecycle policy to move files from S3 Standard to S3 Standard-Infrequent Access (S3 Standard-IA) 30 days from object creation. Delete the files 4 years after object creation.
- D. Create an S3 bucket lifecycle policy to move files from S3 Standard to S3 Standard-Infrequent Access (S3 Standard-IA) 30 days from object creation. Move the files to S3 Glacier 4 years after object creation.

**Đáp án đúng**: **C**

**Giải thích chi tiết**:

- **A - SAI**: Glacier (Flexible Retrieval) không đáp ứng yêu cầu **"Immediate accessibility"**.
- **B - SAI**: **One Zone-IA** lưu trên 1 AZ. Với "critical business data not easy to reproduce", rủi ro mất dữ liệu khi AZ sập là không chấp nhận được.
- **C - ĐÚNG**: **S3 Standard-IA** (Infrequent Access) rẻ hơn Standard, dành cho data ít truy cập (rarely accessed after 30 days) nhưng vẫn đảm bảo lấy ngay lập tức (mili-giây) và độ bền cao (Multi-AZ). Xóa sau 4 năm theo policy.
- **D - SAI**: Di chuyển sang Glacier sau 4 năm thay vì Delete là thừa (vi phạm policy "delete after 4 years" hoặc tốn chi phí thừa).

---

## Câu 67

**Đề bài**:  A company hosts an application on multiple Amazon EC2 instances. The application processes messages from an Amazon SQS queue, writes to an Amazon RDS table, and deletes the message from the queue. Occasional duplicate records are found in the RDS table. The SQS queue does not contain any duplicate messages. What should a solutions architect do to ensure messages are being processed once only?

**Các đáp án**:

- A. Use the CreateQueue API call to create a new queue.
- B. Use the AddPermission API call to add appropriate permissions.
- C. Use the ReceiveMessage API call to set an appropriate wait time.
- D. Use the ChangeMessageVisibility API call to increase the visibility timeout.

**Đáp án đúng**: **D**

**Giải thích chi tiết**:

- **Vấn đề**: Duplicate records trong RDS do message bị xử lý 2 lần. SQS Standard đảm bảo "At-least-once delivery". Tuy nhiên, nguyên nhân phổ biến là do EC2 xử lý lâu hơn **Visibility Timeout**. Khi timeout hết, message chưa kịp delete, nó hiện lại trong Queue -> EC2 khác lôi về xử lý lần 2 -> Duplicate.
- **D - ĐÚNG**: **Increase Visibility Timeout** cho đủ lớn để EC2 xử lý xong và delete message thì message sẽ không bao giờ hiện lại cho consumer khác -> Tránh duplicate processing.

---

## Câu 68

**Đề bài**:  A solutions architect is designing a new hybrid architecture to extend a company's on-premises infrastructure to AWS. The company requires a highly available connection with consistent low latency to an AWS Region. The company needs to minimize costs and is willing to accept slower traffic if the primary connection fails. What should the solutions architect do to meet these requirements?

**Các đáp án**:

- A. Provision an AWS Direct Connect connection to a Region. Provision a VPN connection as a backup if the primary Direct Connect connection fails.
- B. Provision a VPN tunnel connection to a Region for private connectivity. Provision a second VPN tunnel for private connectivity and as a backup if the primary VPN connection fails.
- C. Provision an AWS Direct Connect connection to a Region. Provision a second Direct Connect connection to the same Region as a backup if the primary Direct Connect connection fails.
- D. Provision an AWS Direct Connect connection to a Region. Use the Direct Connect failover attribute from the AWS CLI to automatically create a backup connection if the primary Direct Connect connection fails.

**Đáp án đúng**: **A**

**Giải thích chi tiết**:

- **A - ĐÚNG**:
  - **Direct Connect**: Đảm bảo "consistent low latency".
  - **VPN Backup**: Đảm bảo "High Availability".
  - **Minimize Costs**: VPN rẻ hơn nhiều so với đường Direct Connect thứ 2.
  - **Accept slower traffic**: VPN đi qua internet nên chậm hơn DC, chấp nhận được trong kịch bản failover.
- **B - SAI**: VPN không đảm bảo optimal consistent latency như DC.
- **C - SAI**: 2 đường Direct Connect (Redundancy) rất đắt tiền, không tối ưu cost.
- **D - SAI**: Không có cái gọi là "failover attribute automatically create backup connection". Kết nối physical cần kéo cáp, setup provider...

---

## Câu 69

**Đề bài**:  A company is running a business-critical web application on Amazon EC2 instances behind an Application Load Balancer. The EC2 instances are in an Auto Scaling group. The application uses an Amazon Aurora PostgreSQL database that is deployed in a single Availability Zone. The company wants the application to be highly available with minimum downtime and minimum loss of data. Which solution will meet these requirements with the LEAST operational effort?

**Các đáp án**:

- A. Place the EC2 instances in different AWS Regions. Use Amazon Route 53 health checks to redirect traffic. Use Aurora PostgreSQL CrossRegion Replication.
- B. Configure the Auto Scaling group to use multiple Availability Zones. Configure the database as Multi-AZ. Configure an Amazon RDS Proxy instance for the database.
- C. Configure the Auto Scaling group to use one Availability Zone. Generate hourly snapshots of the database. Recover the database from the snapshots in the event of a failure.
- D. Configure the Auto Scaling group to use multiple AWS Regions. Write the data from the application to Amazon S3. Use S3 Event Notifications to launch an AWS Lambda function to write the data to the database.

**Đáp án đúng**: **B**

**Giải thích chi tiết**:

- **A - SAI**: Scale sang Region khác là giải pháp DR đắt tiền và phức tạp (latency, data sync), thường dùng cho Disaster Recovery hơn là High Availability (trong Region).
- **B - ĐÚNG**:
  - **ASG Multi-AZ**: Đảm bảo App không chết khi 1 AZ sập.
  - **Database Multi-AZ**: Aurora store data 6 copies in 3 AZs. Nếu Writer chết, nó tự failover sang Reader hoặc instance mới trong < 30s. Đảm bảo High Availability và Min Data Loss. (RDS Proxy giúp failover smooth hơn nhưng Multi-AZ mới là core).
- **C - SAI**: Single AZ + Snapshot restore = Downtime lớn và Data Loss (dữ liệu trong 1 giờ chưa snapshot sẽ mất).

---

## Câu 70

**Đề bài**:  A company's HTTP application is behind a Network Load Balancer (NLB). The NLB's target group is configured to use an Amazon EC2 Auto Scaling group with multiple EC2 instances that run the web service. The company notices that the NLB is not detecting HTTP errors for the application. These errors require a manual restart of the EC2 instances that run the web service. The company needs to improve the application's availability without writing custom scripts or code. What should a solutions architect do to meet these requirements?

**Các đáp án**:

- A. Enable HTTP health checks on the NLB, supplying the URL of the company's application.
- B. Add a cron job to the EC2 instances to check the local application's logs once each minute. If HTTP errors are detected. the application will restart.
- C. Replace the NLB with an Application Load Balancer. Enable HTTP health checks by supplying the URL of the company's application. Configure an Auto Scaling action to replace unhealthy instances.
- D. Create an Amazon Cloud Watch alarm that monitors the UnhealthyHostCount metric for the NLB. Configure an Auto Scaling action to replace unhealthy instances when the alarm is in the ALARM state.

**Đáp án đúng**: **A**

**Giải thích chi tiết**:

- **Vấn đề**: NLB mặc định health check TCP. Nếu App treo trả về HTTP 500 nhưng port 80 vẫn mở (TCP connect success), NLB tưởng app sống -> vẫn gửi traffic -> lỗi.
- **A - ĐÚNG**: NLB hỗ trợ **HTTP/HTTPS Health Check**. Chỉ cần cấu hình lại Health Check Protocol sang HTTP và cung cấp path. Nếu App trả về khác 200 OK (ví dụ 500), NLB đánh dấu Unhealthy -> Stop sending traffic. Auto Scaling Group (nếu bật ELB Health Check) sẽ terminate và replace instance đó.
- **B - SAI**: Dùng cron job là "custom script".
- **C - SAI**: Thay NLB bằng Application Load Balancer là thay đổi kiến trúc lớn, không cần thiết nếu chỉ để fix lỗi health check.

---

## Câu 71

**Đề bài**:  A company runs a shopping application that uses Amazon DynamoDB to store customer information. In case of data corruption, a solutions architect needs to design a solution that meets a recovery point objective (RPO) of 15 minutes and a recovery time objective (RTO) of 1 hour. What should the solutions architect recommend to meet these requirements?

**Các đáp án**:

- A. Configure DynamoDB global tables. For RPO recovery, point the application to a different AWS Region.
- B. Configure DynamoDB point-in-time recovery. For RPO recovery, restore to the desired point in time.
- C. Export the DynamoDB data to Amazon S3 Glacier on a daily basis. For RPO recovery, import the data from S3 Glacier to DynamoDB.
- D. Schedule Amazon Elastic Block Store (Amazon EBS) snapshots for the DynamoDB table every 15 minutes. For RPO recovery, restore the DynamoDB table by using the EBS snapshot.

**Đáp án đúng**: **B**

**Giải thích chi tiết**:

- **B - ĐÚNG**: **Point-in-Time Recovery (PITR)** của DynamoDB cho phép restore table về bất kỳ giây nào trong 35 ngày qua. RPO gần như bằng 0. Thời gian restore (RTO) phụ thuộc volume nhưng thường rất nhanh (< 1 giờ cho table vừa phải). Đây là giải pháp chống "data corruption" (xóa nhầm, ghi sai) hiệu quả nhất.
- **A - SAI**: Global Table replicate data tức thì. Nếu data bị corrupt ở Region A, nó lập tức corrupt sang Region B. Không giúp ích cho logical corruption.
- **C - SAI**: Daily backup -> RPO 24 giờ.
- **D - SAI**: DynamoDB không chạy trên EBS volumes mà user quản lý được. Không thể snapshot EBS của DynamoDB.

---

## Câu 72

**Đề bài**:  A company runs a photo processing application that needs to frequently upload and download pictures from Amazon S3 buckets that are located in the same AWS Region. A solutions architect has noticed an increased cost in data transfer fees and needs to implement a solution to reduce these costs. How can the solutions architect meet this requirement?

**Các đáp án**:

- A. Deploy Amazon API Gateway into a public subnet and adjust the route table to route S3 calls through it.
- B. Deploy a NAT gateway into a public subnet and attach an endpoint policy that allows access to the S3 buckets.
- C. Deploy the application into a public subnet and allow it to route through an internet gateway to access the S3 buckets.
- D. Deploy an S3 VPC gateway endpoint into the VPC and attach an endpoint policy that allows access to the S3 buckets.

**Đáp án đúng**: **D**

**Giải thích chi tiết**:

- **D - ĐÚNG**: Nếu EC2 truy cập S3 qua Public Internet (hoặc NAT Gateway), bạn có thể chịu phí xử lý dữ liệu (NAT Gateway processing fee). Sử dụng **Gateway VPC Endpoint for S3** là hoàn toàn **miễn phí** và giữ traffic trong mạng riêng AWS. Đây là cách chuẩn để giảm chi phí data transfer tới S3.

---

## Câu 73

**Đề bài**:  A company recently launched Linux-based application instances on Amazon EC2 in a private subnet and launched a Linux-based bastion host on an Amazon EC2 instance in a public subnet of a VPC. A solutions architect needs to connect from the on-premises network, through the company's internet connection, to the bastion host, and to the application servers. The solutions architect must make sure that the security groups of all the EC2 instances will allow that access. Which combination of steps should the solutions architect take to meet these requirements? (Choose two.)

**Các đáp án**:

- A. Replace the current security group of the bastion host with one that only allows inbound access from the application instances.
- B. Replace the current security group of the bastion host with one that only allows inbound access from the internal IP range for the company.
- C. Replace the current security group of the bastion host with one that only allows inbound access from the external IP range for the company.
- D. Replace the current security group of the application instances with one that allows inbound SSH access from only the private IP address of the bastion host.
- E. Replace the current security group of the application instances with one that allows inbound SSH access from only the public IP address of the bastion host.

**Đáp án đúng**: **C, D**

**Giải thích chi tiết**:

- **Mô hình Bastion Host**: Users (On-prem) --(SSH)--> Bastion (Public) --(SSH)--> App Server (Private).
- **C - ĐÚNG**: Bastion Host cần mở port 22 cho nguồn là **External IP** (Public IP) của văn phòng công ty.
- **D - ĐÚNG**: App Server nằm trong Private Subnet, cần mở port 22 cho nguồn là **Bastion Host**. Vì giao tiếp trong VPC, nên nguồn là **Private IP** của Bastion (hoặc tốt nhất là tham chiếu Security Group ID của Bastion).
- **E - SAI**: Trong VPC, các instance nhìn thấy nhau bằng Private IP, App Server sẽ không thấy Public IP của Bastion trong gói tin đến.

---

## Câu 74

**Đề bài**:  A solutions architect is designing a two-tier web application. The application consists of a public-facing web tier hosted on Amazon EC2 in public subnets. The database tier consists of Microsoft SQL Server running on Amazon EC2 in a private subnet. Security is a high priority for the company. How should security groups be configured in this situation? (Choose two.)

**Các đáp án**:

- A. Configure the security group for the web tier to allow inbound traffic on port 443 from 0.0.0.0/0.
- B. Configure the security group for the web tier to allow outbound traffic on port 443 from 0.0.0.0/0.
- C. Configure the security group for the database tier to allow inbound traffic on port 1433 from the security group for the web tier.
- D. Configure the security group for the database tier to allow outbound traffic on ports 443 and 1433 to the security group for the web tier.
- E. Configure the security group for the database tier to allow inbound traffic on ports 443 and 1433 from the security group for the web tier.

**Đáp án đúng**: **A, C**

**Giải thích chi tiết**:

- **A - ĐÚNG**: Web Server (Public facing) cần nhận HTTPS request từ Internet, nên mở Inbound port 443 từ `0.0.0.0/0`.
- **C - ĐÚNG**: Database (SQL Server dùng port 1433) cần nhận connection từ Web Server. Best practice là cho phép Inbound port 1433 từ nguồn là **Security Group của Web Tier**.
- **B, D - SAI**: Outbound rule thường để mặc định (Allow All) hoặc chỉ mở cái cần thiết. DB không cần outbound port 443 connect tới web.
- **E - SAI**: DB không cần mở port 443 inbound (Web không gọi DB qua HTTPS 443).

---

## Câu 75

**Đề bài**:  A company wants to move a multi-tiered application from on premises to the AWS Cloud to improve the application's performance. The application consists of application tiers that communicate with each other by way of RESTful services. Transactions are dropped when one tier becomes overloaded. A solutions architect must design a solution that resolves these issues and modernizes the application. Which solution meets these requirements and is the MOST operationally efficient?

**Các đáp án**:

- A. Use Amazon API Gateway and direct transactions to the AWS Lambda functions as the application layer. Use Amazon Simple Queue Service (Amazon SQS) as the communication layer between application services.
- B. Use Amazon CloudWatch metrics to analyze the application performance history to determine the servers' peak utilization during the performance failures. Increase the size of the application server's Amazon EC2 instances to meet the peak requirements.
- C. Use Amazon Simple Notification Service (Amazon SNS) to handle the messaging between application servers running on Amazon EC2 in an Auto Scaling group. Use Amazon CloudWatch to monitor the SNS queue length and scale up and down as required.
- D. Use Amazon Simple Queue Service (Amazon SQS) to handle the messaging between application servers running on Amazon EC2 in an Auto Scaling group. Use Amazon CloudWatch to monitor the SQS queue length and scale up when communication failures are detected.

**Đáp án đúng**: **A**

**Giải thích chi tiết**:

- **Vấn đề**: "Transactions are dropped when overloaded" (mất kết nối đồng bộ) và cần "Modernize".
- **A - ĐÚNG**:
  - **Amazon SQS**: Giải quyết việc "dropped transactions". SQS đóng vai trò bộ đệm (buffer). Nếu tier sau xử lý chậm, tin nhắn nằm trong hàng đợi, không bị mất. **Decoupling**.
  - **API Gateway + Lambda**: "Modernize" sang kiến trúc **Serverless**. Lambda tự động scale theo số lượng request/message.
- **B, D - SAI**: Vẫn dùng EC2 (mặc dù D có SQS nhưng A modernizes hơn với Lambda). B chỉ là scale up (vertical scaling), tốn kém và không giải quyết triệt để burst traffic lớn.

---

## Câu 76

**Đề bài**:  A company receives 10 TB of instrumentation data each day from several machines located at a single factory. The data consists of JSON files stored on a storage area network (SAN) in an on-premises data center located within the factory. The company wants to send this data to Amazon S3 where it can be accessed by several additional systems that provide critical near-real-time analytics. A secure transfer is important because the data is considered sensitive. Which solution offers the MOST reliable data transfer?

**Các đáp án**:

- A. AWS DataSync over public internet
- B. AWS DataSync over AWS Direct Connect
- C. AWS Database Migration Service (AWS DMS) over public internet
- D. AWS Database Migration Service (AWS DMS) over AWS Direct Connect

**Đáp án đúng**: **B**

**Giải thích chi tiết**:

- **B - ĐÚNG**: 
    - **AWS DataSync**: Chuyên dụng để truyền tải data lớn (TB/PB) từ on-premise SAN/NAS lên S3/EFS với tốc độ cao (tối ưu hóa network protocol).
    - **AWS Direct Connect**: Cung cấp đường truyền riêng (private), băng thông ổn định và bảo mật (secure transfer) thay vì đi qua Public Internet không ổn định.
    - Đây là giải pháp "Most reliable" cho 10TB/day data sensitive.
- **A - SAI**: Public Internet không guaranteed reliability và performance cho 10TB mỗi ngày (độ trễ, packet loss).
- **C, D - SAI**: **AWS DMS** dùng để migrate Database (SQL/NoSQL/DW), không tối ưu cho việc transfer file JSON từ SAN filesystem.

---

## Câu 77

**Đề bài**:  A company needs to configure a real-time data ingestion architecture for its application. The company needs an API, a process that transforms data as the data is streamed, and a storage solution for the data. Which solution will meet these requirements with the LEAST operational overhead?

**Các đáp án**:

- A. Deploy an Amazon EC2 instance to host an API that sends data to an Amazon Kinesis data stream. Create an Amazon Kinesis Data Firehose delivery stream that uses the Kinesis data stream as a data source. Use AWS Lambda functions to transform the data. Use the Kinesis Data Firehose delivery stream to send the data to Amazon S3.
- B. Deploy an Amazon EC2 instance to host an API that sends data to AWS Glue. Stop source/destination checking on the EC2 instance. Use AWS Glue to transform the data and to send the data to Amazon S3.
- C. Configure an Amazon API Gateway API to send data to an Amazon Kinesis data stream. Create an Amazon Kinesis Data Firehose delivery stream that uses the Kinesis data stream as a data source. Use AWS Lambda functions to transform the data. Use the Kinesis Data Firehose delivery stream to send the data to Amazon S3.
- D. Configure an Amazon API Gateway API to send data to AWS Glue. Use AWS Lambda functions to transform the data. Use AWS Glue to send the data to Amazon S3.

**Đáp án đúng**: **C**

**Giải thích chi tiết**:

- **C - ĐÚNG**: Giải pháp "Serverless" toàn diện (Least operational overhead):
    - **API Gateway**: Làm API Endpoint nhận request (thay vì quản lý EC2).
    - **Kinesis Data Streams (KDS)**: Ingestion buffer. API Gateway có thể integration trực tiếp với KDS (Service Proxy).
    - **Kinesis Data Firehose (KDF)**: Delivery stream, hỗ trợ gọi **Lambda** để transform data in-flight và lưu xuống **S3**.
- **A - SAI**: Dùng EC2 host API tăng overhead quản lý/patching.
- **B, D - SAI**: **AWS Glue** thường dùng cho batch ETL hoặc Streaming ETL phức tạp (Spark Streaming), nhưng integration "Gateway -> Glue" không direct và straight-forward như Kinesis. Glue cũng có startup latency.

---

## Câu 78

**Đề bài**:  A company needs to keep user transaction data in an Amazon DynamoDB table. The company must retain the data for 7 years. What is the MOST operationally efficient solution that meets these requirements?

**Các đáp án**:

- A. Use DynamoDB point-in-time recovery to back up the table continuously.
- B. Use AWS Backup to create backup schedules and retention policies for the table.
- C. Create an on-demand backup of the table by using the DynamoDB console. Store the backup in an Amazon S3 bucket. Set an S3 Lifecycle configuration for the S3 bucket.
- D. Create an Amazon EventBridge (Amazon CloudWatch Events) rule to invoke an AWS Lambda function. Configure the Lambda function to back up the table and to store the backup in an Amazon S3 bucket. Set an S3 Lifecycle configuration for the S3 bucket.

**Đáp án đúng**: **B**

**Giải thích chi tiết**:

- **A - SAI**: PITR chỉ giữ backup tối đa **35 ngày**. Không thể giữ 7 năm.
- **B - ĐÚNG**: **AWS Backup** là dịch vụ backup tập trung, hỗ trợ DynamoDB. Bạn chỉ cần tạo Backup Plan, set retention rule = 7 years. AWS tự động lo việc snapshot và retention. "Least operational overhead".
- **C, D - SAI**: Việc tạo on-demand backup thủ công hoặc viết script Lambda (Export to S3) phức tạp hơn và cần quản lý lifecycle thủ công/code custom.

---

## Câu 79

**Đề bài**:  A company is planning to use an Amazon DynamoDB table for data storage. The company is concerned about cost optimization. The table will not be used on most mornings. In the evenings, the read and write traffic will often be unpredictable. When traffic spikes occur, they will happen very quickly. What should a solutions architect recommend?

**Các đáp án**:

- A. Create a DynamoDB table in on-demand capacity mode.
- B. Create a DynamoDB table with a global secondary index.
- C. Create a DynamoDB table with provisioned capacity and auto scaling.
- D. Create a DynamoDB table in provisioned capacity mode, and configure it as a global table.

**Đáp án đúng**: **A**

**Giải thích chi tiết**:

- **A - ĐÚNG**: **On-demand capacity mode** phù hợp hoàn hảo:
    - "Not used most mornings": Không tốn tiền (pay-per-request).
    - "Traffic unpredictable" & "Spikes happen very quickly": On-demand đáp ứng ngay lập tức các burst traffic lớn mà không cần chờ Auto Scaling khởi động (vốn có delay).
- **C - SAI**: Provisioned + Auto Scaling: Có độ trễ khi scale up. Nếu spike quá nhanh, request sẽ bị Throttled trước khi capacity kịp tăng. Ngoài ra tốn tiền duy trì provisioned capacity khi không dùng (mornings).

---

## Câu 80

**Đề bài**:  A company recently signed a contract with an AWS Managed Service Provider (MSP) Partner for help with an application migration initiative. A solutions architect needs ta share an Amazon Machine Image (AMI) from an existing AWS account with the MSP Partner's AWS account. The AMI is backed by Amazon Elastic Block Store (Amazon EBS) and uses an AWS Key Management Service (AWS KMS) customer managed key to encrypt EBS volume snapshots. What is the MOST secure way for the solutions architect to share the AMI with the MSP Partner's AWS account?

**Các đáp án**:

- A. Make the encrypted AMI and snapshots publicly available. Modify the key policy to allow the MSP Partner's AWS account to use the key.
- B. Modify the launchPermission property of the AMI. Share the AMI with the MSP Partner's AWS account only. Modify the key policy to allow the MSP Partner's AWS account to use the key.
- C. Modify the launchPermission property of the AMI. Share the AMI with the MSP Partner's AWS account only. Modify the key policy to trust a new KMS key that is owned by the MSP Partner for encryption.
- D. Export the AMI from the source account to an Amazon S3 bucket in the MSP Partner's AWS account, Encrypt the S3 bucket with a new KMS key that is owned by the MSP Partner. Copy and launch the AMI in the MSP Partner's AWS account.

**Đáp án đúng**: **B**

**Giải thích chi tiết**:

- **Nguyên tắc**: Để chia sẻ Encrypted AMI, bạn cần chia sẻ 2 thứ: (1) Quyền truy cập AMI, (2) Quyền sử dụng KMS Key để decrypt snapshot.
- **B - ĐÚNG**:
    - `modify-image-attribute (launchPermission)`: Cho phép Account ID của MSP launch instance từ AMI này. (Private Sharing).
    - `Modify Key Policy`: Cho phép Account ID của MSP thực hiện action `kms:Decrypt`, `kms:CreateGrant`... trên key CMK này.
    - Đây là cách chuẩn và secure nhất.
- **A - SAI**: Không được Public Encrypted AMI/Snapshot. Và public AMI là rủi ro bảo mật cực lớn.
- **D - SAI**: Quy trình Export AMI to S3 (VM Import/Export) phức tạp và thường dùng cho việc move image ra khỏi AWS hoặc cross-cloud, không phải standard way để share giữa 2 AWS accounts.

---

## Câu 81

**Đề bài**:  A solutions architect is designing the cloud architecture for a new application being deployed on AWS. The process should run in parallel while adding and removing application nodes as needed based on the number of jobs to be processed. The processor application is stateless. The solutions architect must ensure that the application is loosely coupled and the job items are durably stored. Which design should the solutions architect use?

**Các đáp án**:

- A. Create an Amazon SNS topic to send the jobs that need to be processed. Create an Amazon Machine Image (AMI) that consists of the processor application. Create a launch configuration that uses the AMI. Create an Auto Scaling group using the launch configuration. Set the scaling policy for the Auto Scaling group to add and remove nodes based on CPU usage.
- B. Create an Amazon SQS queue to hold the jobs that need to be processed. Create an Amazon Machine Image (AMI) that consists of the processor application. Create a launch configuration that uses the AMI. Create an Auto Scaling group using the launch configuration. Set the scaling policy for the Auto Scaling group to add and remove nodes based on network usage.
- C. Create an Amazon SQS queue to hold the jobs that need to be processed. Create an Amazon Machine Image (AMI) that consists of the processor application. Create a launch template that uses the AMI. Create an Auto Scaling group using the launch template. Set the scaling policy for the Auto Scaling group to add and remove nodes based on the number of items in the SQS queue.
- D. Create an Amazon SNS topic to send the jobs that need to be processed. Create an Amazon Machine Image (AMI) that consists of the processor application. Create a launch template that uses the AMI. Create an Auto Scaling group using the launch template. Set the scaling policy for the Auto Scaling group to add and remove nodes based on the number of messages published to the SNS topic.

**Đáp án đúng**: **C**

**Giải thích chi tiết**:

- **C - ĐÚNG**:
    - **SQS**: Đảm bảo "loosely coupled" và "job items durably stored". Worker pull job về xử lý.
    - **Scaling Policy**: Scale dựa trên số lượng message trong queue (metric `ApproximateNumberOfMessagesVisible`) là chiến lược "Scaling based on Backlog" chuẩn nhất cho worker tier.
- **A, D - SAI**: **SNS** là model Pub/Sub (Push), không lưu trữ bền vững (not queueing) nếu worker offline hoặc busy. Data có thể bị mất nếu không xử lý kịp. Scaling theo CPU (A) không phản ánh chính xác backlog công việc (ví dụ job nhẹ CPU nhưng nhiều job).

---

## Câu 82

**Đề bài**:  A company hosts its web applications in the AWS Cloud. The company configures Elastic Load Balancers to use certificates that are imported into AWS Certificate Manager (ACM). The company's security team must be notified 30 days before the expiration of each certificate. What should a solutions architect recommend to meet this requirement?

**Các đáp án**:

- A. Add a rule in ACM to publish a custom message to an Amazon Simple Notification Service (Amazon SNS) topic every day, beginning 30 days before any certificate will expire.
- B. Create an AWS Config rule that checks for certificates that will expire within 30 days. Configure Amazon EventBridge (Amazon CloudWatch Events) to invoke a custom alert by way of Amazon Simple Notification Service (Amazon SNS) when AWS Config reports a noncompliant resource.
- C. Use AWS Trusted Advisor to check for certificates that will expire within 30 days. Create an Amazon CloudWatch alarm that is based on Trusted Advisor metrics for check status changes. Configure the alarm to send a custom alert by way of Amazon Simple Notification Service (Amazon SNS).
- D. Create an Amazon EventBridge (Amazon CloudWatch Events) rule to detect any certificates that will expire within 30 days. Configure the rule to invoke an AWS Lambda function. Configure the Lambda function to send a custom alert by way of Amazon Simple Notification Service (Amazon SNS).

**Đáp án đúng**: **D** (Có thể B cũng đúng tùy ngữ cảnh, nhưng D trực tiếp hơn với ACM Events)

**Giải thích chi tiết**:

- **D - ĐÚNG**: **ACM** tự động gửi event `ACM Certificate Approaching Expiration` tới **EventBridge** khi chứng chỉ sắp hết hạn (mặc định là 45 ngày ngẫu nhiên, nhưng có thể config rules để catch). EventBridge rule trigger Lambda/SNS để thông báo. Đây là tính năng native integration.
- **B - ĐÚNG (Alternative)**: Dùng AWS Config rule `acm-certificate-expiration-check`. Config báo Compliance Change -> EventBridge -> SNS. Cũng là một giải pháp hợp lệ và phổ biến. Tuy nhiên D native hơn với event source từ ACM.
- **A - SAI**: ACM console/API không có chỗ "Add rule to publish SNS".
- **C - SAI**: Trusted Advisor check refresh có thể không realtime hoặc cần Business/Enterprise support để có đủ tính năng alarm/api access đầy đủ.

---

## Câu 83

**Đề bài**:  A company's dynamic website is hosted using on-premises servers in the United States. The company is launching its product in Europe, and it wants to optimize site loading times for new European users. The site's backend must remain in the United States. The product is being launched in a few days, and an immediate solution is needed. What should the solutions architect recommend?

**Các đáp án**:

- A. Launch an Amazon EC2 instance in us-east-1 and migrate the site to it.
- B. Move the website to Amazon S3. Use Cross-Region Replication between Regions.
- C. Use Amazon CloudFront with a custom origin pointing to the on-premises servers.
- D. Use an Amazon Route 53 geoproximity routing policy pointing to on-premises servers.

**Đáp án đúng**: **C**

**Giải thích chi tiết**:

- **C - ĐÚNG**: **Amazon CloudFront** (CDN) có các Edge Location tại Europe.
    - Static content: Cache tại Edge (Europe) -> User Europe tải cực nhanh.
    - Dynamic content: CloudFront dùng **AWS Global Network** backbone để route request về Origin (On-prem US) nhanh hơn và ổn định hơn public internet.
    - Đây là giải pháp "Immediate" (setup nhanh) và không cần move backend ("remain in US").
- **A - SAI**: Server vẫn ở US, user Europe vẫn bị latency cao.
- **D - SAI**: Route 53 chỉ điều hướng DNS request, traffic sau đó vẫn đi xuyên biển (Europe -> US) qua internet public, không giảm latency tải trang.

---

## Câu 84

**Đề bài**:  A company wants to reduce the cost of its existing three-tier web architecture. The web, application, and database servers are running on Amazon EC2 instances for the development, test, and production environments. The EC2 instances average 30% CPU utilization during peak hours and 10% CPU utilization during non-peak hours. The production EC2 instances run 24 hours a day. The development and test EC2 instances run for at least 8 hours each day. The company plans to implement automation to stop the development and test EC2 instances when they are not in use. Which EC2 instance purchasing solution will meet the company's requirements MOST cost-effectively?

**Các đáp án**:

- A. Use Spot Instances for the production EC2 instances. Use Reserved Instances for the development and test EC2 instances.
- B. Use Reserved Instances for the production EC2 instances. Use On-Demand Instances for the development and test EC2 instances.
- C. Use Spot blocks for the production EC2 instances. Use Reserved Instances for the development and test EC2 instances.
- D. Use On-Demand Instances for the production EC2 instances. Use Spot blocks for the development and test EC2 instances.

**Đáp án đúng**: **B**

**Giải thích chi tiết**:

- **Prod Env (24/7)**: Cần độ ổn định cao nhất -> Dùng **Reserved Instances** (hoặc Savings Plans) để giảm giá so với On-Demand (cam kết 1-3 năm). Không dùng Spot vì rủi ro bị terminate.
- **Dev/Test Env (8h/day)**: Có automation "stop when not in use".
    - Nếu mua Reserved Instances: Bạn trả tiền 24/7 (dù stop instance vẫn tính phí reservation theo giờ). Lãng phí 16h/ngày.
    - Dùng **On-Demand**: Chỉ trả tiền khi Running (8h). Stop 16h = 0$. Rẻ hơn RI trong trường hợp này (8h so với 24h RI effective).
- **Correct**: B.

---

## Câu 85

**Đề bài**:  A company has a production web application in which users upload documents through a web interface or a mobile app. According to a new regulatory requirement. new documents cannot be modified or deleted after they are stored. What should a solutions architect do to meet this requirement?

**Các đáp án**:

- A. Store the uploaded documents in an Amazon S3 bucket with S3 Versioning and S3 Object Lock enabled.
- B. Store the uploaded documents in an Amazon S3 bucket. Configure an S3 Lifecycle policy to archive the documents periodically.
- C. Store the uploaded documents in an Amazon S3 bucket with S3 Versioning enabled. Configure an ACL to restrict all access to read-only.
- D. Store the uploaded documents on an Amazon Elastic File System (Amazon EFS) volume. Access the data by mounting the volume in readonly mode.

**Đáp án đúng**: **A**

**Giải thích chi tiết**:

- **A - ĐÚNG**: **S3 Object Lock** (WORM - Write Once Read Many) là tính năng chuyên dụng cho compliance. Nó chặn việc xóa/ghi đè object trong thời gian retention. Yêu cầu bucket phải enable **Versioning**.
- **C - SAI**: ACL/Bucket Policy có thể bị thay đổi bởi Admin/Root. Không đảm bảo tính bất biến (Immutability) mạnh mẽ như Object Lock.
- **D - SAI**: Mount read-only ở client không ngăn được việc ai đó mount read-write ở chỗ khác xóa file.

---

## Câu 86

**Đề bài**:  A company has several web servers that need to frequently access a common Amazon RDS MySQL Multi-AZ DB instance. The company wants a secure method for the web servers to connect to the database while meeting a security requirement to rotate user credentials frequently. Which solution meets these requirements?

**Các đáp án**:

- A. Store the database user credentials in AWS Secrets Manager. Grant the necessary IAM permissions to allow the web servers to access AWS Secrets Manager.
- B. Store the database user credentials in AWS Systems Manager OpsCenter. Grant the necessary IAM permissions to allow the web servers to access OpsCenter.
- C. Store the database user credentials in a secure Amazon S3 bucket. Grant the necessary IAM permissions to allow the web servers to retrieve credentials and access the database.
- D. Store the database user credentials in files encrypted with AWS Key Management Service (AWS KMS) on the web server file system. The web server should be able to decrypt the files and access the database.

**Đáp án đúng**: **A**

**Giải thích chi tiết**:

- **A - ĐÚNG**: **AWS Secrets Manager** là dịch vụ chuẩn để lưu DB credentials. Nó hỗ trợ **Native Rotation** cho RDS MySQL (tự động đổi pass DB và update secret theo lịch). Web server dùng IAM Role để lấy secret runtime.
- **B, C, D - SAI**: Các giải pháp này không hỗ trợ **Automated Rotation** một cách native (phải tự viết script phức tạp để đồng bộ pass giữa DB và nơi lưu trữ). S3 hay File System cũng kém bảo mật hơn Secrets Manager.

---

## Câu 87

**Đề bài**:  A company hosts an application on AWS Lambda functions that are invoked by an Amazon API Gateway API. The Lambda functions save customer data to an Amazon Aurora MySQL database. Whenever the company upgrades the database, the Lambda functions fail to establish database connections until the upgrade is complete. The result is that customer data is not recorded for some of the event. A solutions architect needs to design a solution that stores customer data that is created during database upgrades. Which solution will meet these requirements?

**Các đáp án**:

- A. Provision an Amazon RDS proxy to sit between the Lambda functions and the database. Configure the Lambda functions to connect to the RDS proxy.
- B. Increase the run time of the Lambda functions to the maximum. Create a retry mechanism in the code that stores the customer data in the database.
- C. Persist the customer data to Lambda local storage. Configure new Lambda functions to scan the local storage to save the customer data to the database.
- D. Store the customer data in an Amazon Simple Queue Service (Amazon SQS) FIFO queue. Create a new Lambda function that polls the queue and stores the customer data in the database.

**Đáp án đúng**: **D**

**Giải thích chi tiết**:

- **Vấn đề**: DB Downtime (maintenance/upgrade) -> Mất data.
- **D - ĐÚNG**: Sử dụng pattern **Decoupling**.
    - API Gateway -> Lambda 1 -> **SQS** (Buffer).
    - Lambda 2 (Worker) -> Poll SQS -> Write DB.
    - Khi DB bảo trì, Lambda worker fail to write -> Message trả về Queue (hoặc DLQ) -> Không mất data. Khi DB online lại, worker tiếp tục xử lý backlog. FIFO đảm bảo thứ tự transaction.
- **A - SAI**: RDS Proxy giúp manage connection pool và failover nhanh hơn trong Multi-AZ, nhưng nếu DB upgrade (shutdown hẳn hoặc reboot lâu), Proxy cũng không ghi được dữ liệu (chỉ queue connection ở mức độ nhất định và timeout). SQS bền vững hơn cho maintenance window dài.
- **B - SAI**: Lambda max timeout 15 phút. Upgrade DB có thể lâu hơn -> vẫn mất data.

---

## Câu 88

**Đề bài**:  A survey company has gathered data for several years from areas in the United States. The company hosts the data in an Amazon S3 bucket that is 3 TB in size and growing. The company has started to share the data with a European marketing firm that has S3 buckets. The company wants to ensure that its data transfer costs remain as low as possible. Which solution will meet these requirements?

**Các đáp án**:

- A. Configure the Requester Pays feature on the company's S3 bucket.
- B. Configure S3 Cross-Region Replication from the company's S3 bucket to one of the marketing firm's S3 buckets.
- C. Configure cross-account access for the marketing firm so that the marketing firm has access to the company's S3 bucket.
- D. Configure the company's S3 bucket to use S3 Intelligent-Tiering. Sync the S3 bucket to one of the marketing firm's S3 buckets.

**Đáp án đúng**: **A**

**Giải thích chi tiết**:

- **A - ĐÚNG**: **Requester Pays** chuyển toàn bộ chi phí Data Transfer (và request cost) sang cho người download (Marketing Firm). Company chủ sở hữu bucket không tốn xu nào cho việc đối tác tải dữ liệu về.
- **B, C - SAI**: Nếu dùng CRR (B) hoặc Cross-account access thông thường (C), Account sở hữu bucket (Source) sẽ chịu phí **Data Transfer Out** (Internet/Region). Mà dữ liệu 3TB+ tải về Europe thì phí này rất cao.
- **D - SAI**: Intelligent-Tiering là cho storage cost, không giảm transfer cost.

---

## Câu 89

**Đề bài**:  A company uses Amazon S3 to store its confidential audit documents. The S3 bucket uses bucket policies to restrict access to audit team IAM user credentials according to the principle of least privilege. Company managers are worried about accidental deletion of documents in the S3 bucket and want a more secure solution. What should a solutions architect do to secure the audit documents?

**Các đáp án**:

- A. Enable the versioning and MFA Delete features on the S3 bucket.
- B. Enable multi-factor authentication (MFA) on the IAM user credentials for each audit team IAM user account.
- C. Add an S3 Lifecycle policy to the audit team's IAM user accounts to deny the s3:DeleteObject action during audit dates.
- D. Use AWS Key Management Service (AWS KMS) to encrypt the S3 bucket and restrict audit team IAM user accounts from accessing the KMS key.

**Đáp án đúng**: **A**

**Giải thích chi tiết**:

- **A - ĐÚNG**: **S3 Versioning** giúp khôi phục file nếu bị xóa (delete marker) hoặc ghi đè. **MFA Delete** buộc người dùng phải nhập mã MFA (từ thiết bị token của Root Account thường là vậy) mới được phép thực hiện thao tác **Permanently Delete** version hoặc thay đổi setting versioning. Đây là chốt chặn mạnh nhất chống "accidental deletion".
- **B - SAI**: MFA login chỉ bảo vệ lúc đăng nhập. Nếu user đăng nhập xong lỡ tay xóa file thì không cản được.
- **C - SAI**: Lifecycle Policy dùng để expire object, không phải permission policy để deny action.

---

## Câu 90

**Đề bài**:  A company is using a SQL database to store movie data that is publicly accessible. The database runs on an Amazon RDS Single-AZ DB instance. A script runs queries at random intervals each day to record the number of new movies that have been added to the database. The script must report a final total during business hours. The company's development team notices that the database performance is inadequate for development tasks when the script is running. A solutions architect must recommend a solution to resolve this issue. Which solution will meet this requirement with the LEAST operational overhead?

**Các đáp án**:

- A. Modify the DB instance to be a Multi-AZ deployment.
- B. Create a read replica of the database. Configure the script to query only the read replica.
- C. Instruct the development team to manually export the entries in the database at the end of each day.
- D. Use Amazon ElastiCache to cache the common queries that the script runs against the database.

**Đáp án đúng**: **B**

**Giải thích chi tiết**:

- **B - ĐÚNG**: **Read Replica** dùng để offload traffic Read. Script chạy query thống kê (Read-heavy) nên trỏ vào Read Replica. Database chính (Source) sẽ giải phóng tài nguyên CPU/IO để phục vụ Development Team (Write/Read khác).
- **A - SAI**: Multi-AZ là Synchronous Replication để HA. Standby instance KHÔNG nhận traffic read. Performance writte có thể giảm nhẹ. Không giải quyết vấn đề read contention.
- **D - SAI**: ElastiCache cache query result. Nếu script cần đếm "new movies added", dữ liệu thay đổi liên tục, cache có thể không chính xác hoặc cần invalidate phức tạp. Read Replica đơn giản hơn cho analytical query.

---

## Câu 91

**Đề bài**:  A company has applications that run on Amazon EC2 instances in a VPC. One of the applications needs to call the Amazon S3 API to store and read objects. According to the company's security regulations, no traffic from the applications is allowed to travel across the internet. Which solution will meet these requirements?

**Các đáp án**:

- A. Configure an S3 gateway endpoint.
- B. Create an S3 bucket in a private subnet.
- C. Create an S3 bucket in the same AWS Region as the EC2 instances.
- D. Configure a NAT gateway in the same subnet as the EC2 instances.

**Đáp án đúng**: **A**

**Giải thích chi tiết**:

- **A - ĐÚNG**: **Gateway VPC Endpoint for S3** tạo đường đi riêng (private route) từ VPC tới S3 thông qua hạ tầng AWS, không đi qua Internet Gateway hay NAT Gateway. Đảm bảo "no traffic ... travel across the internet".
- **B - SAI**: S3 Bucket không nằm trong subnet (Zonal), nó là Regional Service.
- **D - SAI**: NAT Gateway cho phép traffic đi ra Internet (dù source IP là private). Vi phạm "no traffic across internet" (về mặt logic security regulation thường coi NAT path là internet path). Endpoint là private path.

---

## Câu 92

**Đề bài**:  A company is storing sensitive user information in an Amazon S3 bucket. The company wants to provide secure access to this bucket from the application tier running on Amazon EC2 instances inside a VPC. Which combination of steps should a solutions architect take to accomplish this? (Choose two.)

**Các đáp án**:

- A. Configure a VPC gateway endpoint for Amazon S3 within the VPC.
- B. Create a bucket policy to make the objects in the S3 bucket public.
- C. Create a bucket policy that limits access to only the application tier running in the VPC.
- D. Create an IAM user with an S3 access policy and copy the IAM credentials to the EC2 instance.
- E. Create a NAT instance and have the EC2 instances use the NAT instance to access the S3 bucket.

**Đáp án đúng**: **A, C**

**Giải thích chi tiết**:

- **A - ĐÚNG**: Tạo **VPC Gateway Endpoint** để kết nối S3 private từ VPC.
- **C - ĐÚNG**: Dùng **Bucket Policy** với điều kiện `Condition: {"StringEquals": {"aws:sourceVpce": "vpce-id"}}`. Điều này đảm bảo chỉ request đi qua VPC Endpoint đó (từ App Tier) mới được phép access S3. Đây là lớp bảo mật 2 lớp (Network Access + Resource Policy).
- **D - SAI**: Dùng IAM User/Key trên EC2 là bad practice (Security risk). Nên dùng IAM Role.
- **B - SAI**: Make public là thảm họa bảo mật với "sensitive information".

---

## Câu 93

**Đề bài**:  A company runs an on-premises application that is powered by a MySQL database. The company is migrating the application to AWS to increase the application's elasticity and availability. The current architecture shows heavy read activity on the database during times of normal operation. Every 4 hours, the company's development team pulls a full export of the production database to populate a database in the staging environment. During this period, users experience unacceptable application latency. The development team is unable to use the staging environment until the procedure completes. A solutions architect must recommend replacement architecture that alleviates the application latency issue. The replacement architecture also must give the development team the ability to continue using the staging environment without delay. Which solution meets these requirements?

**Các đáp án**:

- A. Use Amazon Aurora MySQL with Multi-AZ Aurora Replicas for production. Populate the staging database by implementing a backup and restore process that uses the mysqldump utility.
- B. Use Amazon Aurora MySQL with Multi-AZ Aurora Replicas for production. Use database cloning to create the staging database on-demand.
- C. Use Amazon RDS for MySQL with a Multi-AZ deployment and read replicas for production. Use the standby instance for the staging database.
- D. Use Amazon RDS for MySQL with a Multi-AZ deployment and read replicas for production. Populate the staging database by implementing a backup and restore process that uses the mysqldump utility.

**Đáp án đúng**: **B**

**Giải thích chi tiết**:

- **B - ĐÚNG**:
    - **Amazon Aurora MySQL**: Hiệu năng cao cho heavy read.
    - **Database Cloning**: Tính năng **Fast Cloning** (Copy-on-write) của Aurora cho phép tạo một database mới (Staging) từ production DB chỉ trong vài phút, bất kể dung lượng lớn thế nào, và **không** ảnh hưởng performance của Production (không I/O hit). Dev team có database ngay lập tức ("without delay").
- **A, D - SAI**: `mysqldump` gây tải nặng lên database (latency) và tốn thời gian lâu để restore.
- **C - SAI**: Standby Instance của RDS Multi-AZ không cho phép access (nó chỉ active khi failover). Không thể dùng làm staging DB.

---

## Câu 94

**Đề bài**:  A company is designing an application where users upload small files into Amazon S3. After a user uploads a file, the file requires one-time simple processing to transform the data and save the data in JSON format for later analysis. Each file must be processed as quickly as possible after it is uploaded. Demand will vary. On some days, users will upload a high number of files. On other days, users will upload a few files or no files. Which solution meets these requirements with the LEAST operational overhead?

**Các đáp án**:

- A. Configure Amazon EMR to read text files from Amazon S3. Run processing scripts to transform the data. Store the resulting JSON file in an Amazon Aurora DB cluster.
- B. Configure Amazon S3 to send an event notification to an Amazon Simple Queue Service (Amazon SQS) queue. Use Amazon EC2 instances to read from the queue and process the data. Store the resulting JSON file in Amazon DynamoDB.
- C. Configure Amazon S3 to send an event notification to an Amazon Simple Queue Service (Amazon SQS) queue. Use an AWS Lambda function to read from the queue and process the data. Store the resulting JSON file in Amazon DynamoDB.
- D. Configure Amazon EventBridge (Amazon CloudWatch Events) to send an event to Amazon Kinesis Data Streams when a new file is uploaded. Use an AWS Lambda function to consume the event from the stream and process the data. Store the resulting JSON file in an Amazon Aurora DB cluster.

**Đáp án đúng**: **C**

**Giải thích chi tiết**:

- **C - ĐÚNG**:
    - **S3 Event -> SQS -> Lambda**: Kiến trúc serverless decoupled chuẩn. SQS giúp buffer request nếu traffic spike. Lambda tự động scale từ 0 lên hàng nghìn concurrent executions rồi về 0 -> Tối ưu chi phí và không overhead quản lý server.
    - **DynamoDB**: Lưu kết quả JSON (NoSQL fit well) tốt, chế độ On-Demand phù hợp với traffic thay đổi.
- **A - SAI**: EMR (Hadoop/Spark) quá nặng nề và expensive cho xử lý "small files", "one-time simple processing".
- **B - SAI**: EC2 quản lý cực hơn Lambda.
- **D - SAI**: Kinesis Stream tốn chi phí theo shard giờ (dù không có data). SQS ở phương án C rẻ hơn và đơn giản hơn cho event notification pattern.

---

## Câu 95

**Đề bài**:  An application allows users at a company's headquarters to access product data. The product data is stored in an Amazon RDS MySQL DB instance. The operations team has isolated an application performance slowdown and wants to separate read traffic from write traffic. A solutions architect needs to optimize the application's performance quickly. What should the solutions architect recommend?

**Các đáp án**:

- A. Change the existing database to a Multi-AZ deployment. Serve the read requests from the primary Availability Zone.
- B. Change the existing database to a Multi-AZ deployment. Serve the read requests from the secondary Availability Zone.
- C. Create read replicas for the database. Configure the read replicas with half of the compute and storage resources as the source database.
- D. Create read replicas for the database. Configure the read replicas with the same compute and storage resources as the source database.

**Đáp án đúng**: **D**

**Giải thích chi tiết**:

- **D - ĐÚNG**: Tạo **Read Replica** để offload traffic Read. Cấu hình Replica có cấu hình tương đương Source (Production) để đảm bảo Replica chịu được tải trọng read (vốn đã gây slow down Source).
- **C - SAI**: Nếu config Replica "half resources", nó có thể bị quá tải và replication lag cao, không giải quyết triệt để performance.
- **A, B - SAI**: Multi-AZ (Standby) không phục vụ traffic Read.

---

## Câu 96

**Đề bài**:  An Amazon EC2 administrator created the following policy associated with an IAM group containing several users: What is the effect of this policy?

**Các đáp án**:

- A. Users can terminate an EC2 instance in any AWS Region except us-east-1.
- B. Users can terminate an EC2 instance with the IP address 10.100.100.1 in the us-east-1 Region.
- C. Users can terminate an EC2 instance in the us-east-1 Region when the user's source IP is 10.100.100.254.
- D. Users cannot terminate an EC2 instance in the us-east-1 Region when the user's source IP is 10.100.100.254.

**Đáp án đúng**: **C**

**Giải thích chi tiết**:

- Policy là **DENY**.
- Condition: `StringNotEquals 10.100.100.254`.
- Nghĩa là: Nếu IP **KHÔNG PHẢI** là 254 -> Condition True -> DENY apply -> Bị chặn.
- Ngược lại: Nếu IP **LÀ** 254 -> Condition False -> Deny KHÔNG apply -> Được phép (giả sử user đã có quyền Allow tương ứng ở policy khác).
- Kết luận: Chỉ có thể terminate khi ngồi ở máy có IP 254 (thuộc subnet quản trị viên).

---

## Câu 97

**Đề bài**:  A company has a large Microsoft SharePoint deployment running on-premises that requires Microsoft Windows shared file storage. The company wants to migrate this workload to the AWS Cloud and is considering various storage options. The storage solution must be highly available and integrated with Active Directory for access control. Which solution will satisfy these requirements?

**Các đáp án**:

- A. Configure Amazon EFS storage and set the Active Directory domain for authentication.
- B. Create an SMB file share on an AWS Storage Gateway file gateway in two Availability Zones.
- C. Create an Amazon S3 bucket and configure Microsoft Windows Server to mount it as a volume.
- D. Create an Amazon FSx for Windows File Server file system on AWS and set the Active Directory domain for authentication.

**Đáp án đúng**: **D**

**Giải thích chi tiết**:

- **D - ĐÚNG**: **SharePoint** cần giao thức SMB và tính năng native Windows NTFS. **Amazon FSx for Windows File Server** là dịch vụ sinh ra để chạy workloads Microsoft (SharePoint, SQL Server, .NET app). Nó support **Multi-AZ** (Highly Available) và **Microsoft Active Directory Integration**.
- **A - SAI**: EFS không support SMB.
- **B, C - SAI**: Storage Gateway/S3 không cung cấp đủ tính năng file system native và performance/compatibility cho SharePoint Database/Data store như FSx.

---

## Câu 98

**Đề bài**:  An image-processing company has a web application that users use to upload images. The application uploads the images into an Amazon S3 bucket. The company has set up S3 event notifications to publish the object creation events to an Amazon Simple Queue Service (Amazon SQS) standard queue. The SQS queue serves as the event source for an AWS Lambda function that processes the images and sends the results to users through email. Users report that they are receiving multiple email messages for every uploaded image. A solutions architect determines that SQS messages are invoking the Lambda function more than once, resulting in multiple email messages. What should the solutions architect do to resolve this issue with the LEAST operational overhead?

**Các đáp án**:

- A. Set up long polling in the SQS queue by increasing the ReceiveMessage wait time to 30 seconds.
- B. Change the SQS standard queue to an SQS FIFO queue. Use the message deduplication ID to discard duplicate messages.
- C. Increase the visibility timeout in the SQS queue to a value that is greater than the total of the function timeout and the batch window timeout.
- D. Modify the Lambda function to delete each message from the SQS queue immediately after the message is read before processing.

**Đáp án đúng**: **C**

**Giải thích chi tiết**:

- **Vấn đề**: Lambda xử lý tin nhắn chưa xong (hoặc gần xong) nhưng **Visibility Timeout** của SQS đã hết. Tin nhắn trở lại Queue -> Lambda khác nhận và xử lý lại -> Duplicate email.
- **C - ĐÚNG**: Tăng **Visibility Timeout** phải lớn hơn thời gian xử lý tối đa của Lambda (Function Timeout) để đảm bảo message không bị hiện lại trong lúc đang xử lý. Khuyến cáo set Visibility Timeout >= 6 lần function timeout (hoặc ít nhất là function timeout + small buffer).
- **B - SAI**: S3 Event Notification không gửi trực tiếp được vào FIFO Queue (hiện tại chưa support direct integration đơn giản như Standard, và S3 event không đảm bảo order strict/deduplication ID dễ dàng từ source).

---

## Câu 99

**Đề bài**:  A company is implementing a shared storage solution for a gaming application that is hosted in an on-premises data center. The company needs the ability to use Lustre clients to access data. The solution must be fully managed. Which solution meets these requirements?

**Các đáp án**:

- A. Create an AWS Storage Gateway file gateway. Create a file share that uses the required client protocol. Connect the application server to the file share.
- B. Create an Amazon EC2 Windows instance. Install and configure a Windows file share role on the instance. Connect the application server to the file share.
- C. Create an Amazon Elastic File System (Amazon EFS) file system, and configure it to support Lustre. Attach the file system to the origin server. Connect the application server to the file system.
- D. Create an Amazon FSx for Lustre file system. Attach the file system to the origin server. Connect the application server to the file system.

**Đáp án đúng**: **D**

**Giải thích chi tiết**:

- **D - ĐÚNG**: Yêu cầu **Lustre clients** -> **Amazon FSx for Lustre**. Đây là dịch vụ Fully Managed high-performance file system hỗ trợ giao thức Lustre, thường dùng cho HPC, Machine Learning, Gaming. Support access từ on-premise qua VPN/Direct Connect.
- **A, C - SAI**: Storage Gateway File Gateway hỗ trợ NFS/SMB. EFS hỗ trợ NFS. Không hỗ trợ Lustre.

---

## Câu 100

**Đề bài**:  A company's containerized application runs on an Amazon EC2 instance. The application needs to download security certificates before it can communicate with other business applications. The company wants a highly secure solution to encrypt and decrypt the certificates in near real time. The solution also needs to store data in highly available storage after the data is encrypted. Which solution will meet these requirements with the LEAST operational overhead?

**Các đáp án**:

- A. Create AWS Secrets Manager secrets for encrypted certificates. Manually update the certificates as needed. Control access to the data by using fine-grained IAM access.
- B. Create an AWS Lambda function that uses the Python cryptography library to receive and perform encryption operations. Store the function in an Amazon S3 bucket.
- C. Create an AWS Key Management Service (AWS KMS) customer managed key. Allow the EC2 role to use the KMS key for encryption operations. Store the encrypted data on Amazon S3.
- D. Create an AWS Key Management Service (AWS KMS) customer managed key. Allow the EC2 role to use the KMS key for encryption operations. Store the encrypted data on Amazon Elastic Block Store (Amazon EBS) volumes.

**Đáp án đúng**: **C**

**Giải thích chi tiết**:

- **Yêu cầu**: Encrypt/Decrypt certificates near real time, store data HA, secure.
- **C - ĐÚNG**:
    - **AWS KMS**: Dịch vụ chuyên dụng để manage key và thực hiện thao tác **Encryption/Decryption** an toàn, "near real time" qua API. Application dùng IAM Role để gọi KMS.
    - **Amazon S3**: Lưu trữ encrypted data (certificates đã mã hóa) đảm bảo **Highly Available** (Multi-AZ) và Durability.
- **A - SAI**: Secrets Manager để lưu secret text, không thực hiện thao tác encrypt/decrypt data arbitrary lớn hoặc file certificates phức tạp theo cách "application needs to perform operations". Tuy nhiên nếu chỉ là lưu cert thì Secrets Manager ok, nhưng đề bài nhấn mạnh "encrypt and decrypt the certificates" (action) và "store data... after encrypted". KMS + S3 linh hoạt hơn cho storage arbitrary encrypted objects.
- **D - SAI**: EBS volume attach vào 1 instance, không phải "Highly Available storage" (shared/durable) theo nghĩa data persistence độc lập với compute instance như S3.

