# AWS Certification Exam Questions 101-150

Tài liệu được biên soạn chi tiết với giải thích bằng tiếng Việt, giúp bạn hiểu sâu về các dịch vụ AWS.

---

## Câu 101

**Đề bài**:  A solutions architect is designing a VPC with public and private subnets. The VPC and subnets use IPv4 CIDR blocks. There is one public subnet and one private subnet in each of three Availability Zones (AZs) for high availability. An internet gateway is used to provide internet access for the public subnets. The private subnets require access to the internet to allow Amazon EC2 instances to download software updates. What should the solutions architect do to enable Internet access for the private subnets?

**Các đáp án**:

- A. Create three NAT gateways, one for each public subnet in each AZ. Create a private route table for each AZ that forwards non-VPC traffic to the NAT gateway in its AZ.
- B. Create three NAT instances, one for each private subnet in each AZ. Create a private route table for each AZ that forwards non-VPC traffic to the NAT instance in its AZ.
- C. Create a second internet gateway on one of the private subnets. Update the route table for the private subnets that forward non-VPC traffic to the private internet gateway.
- D. Create an egress-only internet gateway on one of the public subnets. Update the route table for the private subnets that forward non-VPC traffic to the egress-only Internet gateway.

**Đáp án đúng**: **A**

**Giải thích chi tiết**:

- **A - ĐÚNG**: **NAT Gateway** là giải pháp chuẩn để cho phép Private Subnet truy cập Internet (outbound only).
  - Đặt NAT Gateway tại **Public Subnet**.
  - Cấu hình Route Table của **Private Subnet** trỏ `0.0.0.0/0` về NAT Gateway.
  - Để đạt **High Availability** (HA) trên 3 AZ, cần tạo **3 NAT Gateway** riêng biệt (mỗi AZ một cái) để tránh việc mất kết nối nếu một AZ gặp sự cố.
- **B - SAI**: NAT Instance là giải pháp cũ (legacy), phải tự quản lý, patch, không HA mặc định.
- **C - SAI**: Internet Gateway không thể attach trực tiếp vào Private Subnet (nếu attach và route ra IGW thì subnet đó trở thành Public Subnet).
- **D - SAI**: **Egress-only Internet Gateway** chỉ dành cho **IPv6**. Đề bài đang nói về IPv4.

---

## Câu 102

**Đề bài**:  A company wants to migrate an on-premises data center to AWS. The data center hosts an SFTP server that stores its data on an NFS-based file system. The server holds 200 GB of data that needs to be transferred. The server must be hosted on an Amazon EC2 instance that uses an Amazon Elastic File System (Amazon EFS) file system. Which combination of steps should a solutions architect take to automate this task? (Choose two.)

**Các đáp án**:

- A. Launch the EC2 instance into the same Availability Zone as the EFS file system.
- B. Install an AWS DataSync agent in the on-premises data center.
- C. Create a secondary Amazon Elastic Block Store (Amazon EBS) volume on the EC2 instance for the data.
- D. Manually use an operating system copy command to push the data to the EC2 instance.
- E. Use AWS DataSync to create a suitable location configuration for the on-premises SFTP server.

**Đáp án đúng**: **B, E**

**Giải thích chi tiết**:

- **B, E - ĐÚNG**: **AWS DataSync** là dịch vụ tối ưu để chuyển dữ liệu từ On-premises (NFS/SMB) sang AWS (EFS/S3).
  - Cần cài **DataSync Agent** tại on-premise (gần nguồn dữ liệu) để đọc dữ liệu từ NFS server.
  - Cấu hình **DataSync Location** trỏ tới NFS server và EFS file system đích.
  - DataSync sẽ tự động copy data, handle retries, encryption, verification.
- **D - SAI**: Copy thủ công (SCP/Rsync) không phải là giải pháp "automate" và "managed" tốt nhất cho migration chuyên nghiệp, dù 200GB là nhỏ nhưng đề bài hỏi về "solutions architect" approach.
- **A - SAI**: EFS là Regional service, có thể mount từ bất kỳ AZ nào, không bắt buộc phải cùng AZ (dù cùng AZ thì latency thấp hơn nhưng không phải là step chính để migrate data).

---

## Câu 103

**Đề bài**:  A company has an AWS Glue extract, transform, and load (ETL) job that runs every day at the same time. The job processes XML data that is in an Amazon S3 bucket. New data is added to the S3 bucket every day. A solutions architect notices that AWS Glue is processing all the data during each run. What should the solutions architect do to prevent AWS Glue from reprocessing old data?

**Các đáp án**:

- A. Edit the job to use job bookmarks.
- B. Edit the job to delete data after the data is processed.
- C. Edit the job by setting the NumberOfWorkers field to 1.
- D. Use a FindMatches machine learning (ML) transform.

**Đáp án đúng**: **A**

**Giải thích chi tiết**:

- **A - ĐÚNG**: **Glue Job Bookmarks** là tính năng giúp Glue Job ghi nhớ trạng thái của các lần chạy trước (đã xử lý đến file nào). Khi enable, Glue chỉ đọc và xử lý các file **mới** (newly added) kể từ lần chạy cuối cùng.
- **B - SAI**: Xóa data gốc (Source Data) thường là bad practice trừ khi có yêu cầu archive.
- **D - SAI**: `FindMatches` là ML Transform dùng để tìm các bản ghi trùng lặp (deduplication) dựa trên nội dung mờ (fuzzy matching), không phải để track file đã xử lý.

---

## Câu 104

**Đề bài**:  A solutions architect must design a highly available infrastructure for a website. The website is powered by Windows web servers that run on Amazon EC2 instances. The solutions architect must implement a solution that can mitigate a large-scale DDoS attack that originates from thousands of IP addresses. Downtime is not acceptable for the website. Which actions should the solutions architect take to protect the website from such an attack? (Choose two.)

**Các đáp án**:

- A. Use AWS Shield Advanced to stop the DDoS attack.
- B. Configure Amazon GuardDuty to automatically block the attackers.
- C. Configure the website to use Amazon CloudFront for both static and dynamic content.
- D. Use an AWS Lambda function to automatically add attacker IP addresses to VPC network ACLs.
- E. Use EC2 Spot Instances in an Auto Scaling group with a target tracking scaling policy that is set to 80% CPU utilization.

**Đáp án đúng**: **A, C**

**Giải thích chi tiết**:

- **A - ĐÚNG**: **AWS Shield Advanced** cung cấp bảo vệ lớp nâng cao (Layer 3/4 và Layer 7 if combined with WAF) chống lại các cuộc tấn công DDoS lớn, kèm theo đội ngũ DRT (DDos Response Team) hỗ trợ 24/7.
- **C - ĐÚNG**: **Amazon CloudFront** hoạt động như một lớp lá chắn khổng lồ phân tán toàn cầu. Nó hấp thụ (absorb) các cuộc tấn công DDoS tại Edge Location (Layer 3/4 SYN floods, UDP reflection...). CloudFront chỉ forward traffic hợp lệ về Origin, bảo vệ Origin khỏi bị quá tải trực tiếp.
- **D - SAI**: Network ACL có giới hạn số lượng rules (limit 20 inbound/outbound recommended, max 200). Chặn "thousands of IPs" bằng NACL là không khả thi.
- **B - SAI**: GuardDuty là detection service, không phải prevention/mitigation service (mặc dù có thể trigger Lambda để block nhưng không hiệu quả với DDoS scales lớn).

---

## Câu 105

**Đề bài**:  A company is preparing to deploy a new serverless workload. A solutions architect must use the principle of least privilege to configure permissions that will be used to run an AWS Lambda function. An Amazon EventBridge (Amazon CloudWatch Events) rule will invoke the function. Which solution meets these requirements?

**Các đáp án**:

- A. Add an execution role to the function with lambda:InvokeFunction as the action and \* as the principal.
- B. Add an execution role to the function with lambda:InvokeFunction as the action and Service: lambda.amazonaws.com as the principal.
- C. Add a resource-based policy to the function with lambda:\* as the action and Service: events.amazonaws.com as the principal.
- D. Add a resource-based policy to the function with lambda:InvokeFunction as the action and Service: events.amazonaws.com as the principal.

**Đáp án đúng**: **D**

**Giải thích chi tiết**:

- **D - ĐÚNG**:
  - Để EventBridge gọi Lambda, ta cần cấp quyền cho dịch vụ EventBridge (`events.amazonaws.com`) thực hiện action `lambda:InvokeFunction` trên hàm đó.
  - Cách chuẩn nhất là dùng **Resource-based Policy** gắn trực tiếp vào Lambda Function.
  - `lambda:InvokeFunction` là quyền tối thiểu (Least Privilege).
- **C - SAI**: `lambda:*` cấp quá nhiều quyền (Create, Delete function...), vi phạm Least Privilege.
- **A, B - SAI**: **Execution Role** (IAM Role) là quyền **CỦA** Lambda để Lambda gọi các dịch vụ khác (như đọc S3, ghi DynamoDB), **KHÔNG PHẢI** là quyền để **AI ĐÓ** gọi Lambda. Để cho phép service khác invoke Lambda, phải dùng Resource-based Policy (Function Policy).

---

## Câu 106

**Đề bài**:  A company is preparing to store confidential data in Amazon S3. For compliance reasons, the data must be encrypted at rest. Encryption key usage must be logged for auditing purposes. Keys must be rotated every year. Which solution meets these requirements and is the MOST operationally efficient?

**Các đáp án**:

- A. Server-side encryption with customer-provided keys (SSE-C)
- B. Server-side encryption with Amazon S3 managed keys (SSE-S3)
- C. Server-side encryption with AWS KMS keys (SSE-KMS) with manual rotation
- D. Server-side encryption with AWS KMS keys (SSE-KMS) with automatic rotation

**Đáp án đúng**: **D**

**Giải thích chi tiết**:

- **D - ĐÚNG**: **SSE-KMS** đáp ứng yêu cầu "Audit key usage" (mọi thao tác decrypt/encrypt đều log vào CloudTrail).
  - KMS hỗ trợ tính năng **Automatic Key Rotation** (Every year). Bạn chỉ cần tick 1 box là xong -> "Most operationally efficient".
- **B - SAI**: SSE-S3 có log việc acces object nhưng không log chi tiết về Key usage/Key ID một cách độc lập và rõ ràng như KMS trong CloudTrail. Quan trọng hơn, bạn không control việc Rotation policy của SSE-S3 master key.
- **A - SAI**: SSE-C bắt bạn tự quản lý key -> Overhead cao.

---

## Câu 107

**Đề bài**:  A bicycle sharing company is developing a multi-tier architecture to track the location of its bicycles during peak operating hours. The company wants to use these data points in its existing analytics platform. A solutions architect must determine the most viable multi-tier option to support this architecture. The data points must be accessible from the REST API. Which action meets these requirements for storing and retrieving location data?

**Các đáp án**:

- A. Use Amazon Athena with Amazon S3.
- B. Use Amazon API Gateway with AWS Lambda.
- C. Use Amazon QuickSight with Amazon Redshift.
- D. Use Amazon API Gateway with Amazon Kinesis Data Analytics.

**Đáp án đúng**: **D**

**Giải thích chi tiết**:

- **Phân tích**: "Track location... peak hours" -> Streaming Data. "Data points accessible from REST API".
- **D - ĐÚNG**: **Amazon Kinesis Data Analytics** (hoặc Kinesis Data Streams) dùng để xử lý dữ liệu realtime location.
  - Tuy nhiên, đề bài hơi tối nghĩa ở đoạn "accessible from REST API".
  - Option D "API Gateway with Kinesis Data Analytics" có thể hiểu là API Gateway nhận data (Ingest) đẩy vào Kinesis để Analytics xử lý. Hoặc là API Gateway query data đã xử lý.
  - Trong ngữ cảnh các services AWS, để build "Ingestion API" cho tracking data, pattern chuẩn là **API Gateway -> Kinesis**.
  - Kinesis Data Analytics có thể process data đó.
- **A - SAI**: Athena/S3 là Batch analytics, độ trễ cao, không tracking realtime location hiệu quả cho REST API response.
- **B - SAI**: "API Gateway + Lambda" là generic serverless backend. Đúng, nhưng Option D nhắc đến Kinesis Analytics (Streaming Analytics) phù hợp hơn với usecase "Tracking location data points" (Volume lớn, Stream).

---

## Câu 108

**Đề bài**:  A company has an automobile sales website that stores its listings in a database on Amazon RDS. When an automobile is sold, the listing needs to be removed from the website and the data must be sent to multiple target systems. Which design should a solutions architect recommend?

**Các đáp án**:

- A. Create an AWS Lambda function triggered when the database on Amazon RDS is updated to send the information to an Amazon Simple Queue Service (Amazon SQS) queue for the targets to consume.
- B. Create an AWS Lambda function triggered when the database on Amazon RDS is updated to send the information to an Amazon Simple Queue Service (Amazon SQS) FIFO queue for the targets to consume.
- C. Subscribe to an RDS event notification and send an Amazon Simple Queue Service (Amazon SQS) queue fanned out to multiple Amazon Simple Notification Service (Amazon SNS) topics.
- D. Subscribe to an RDS event notification and send an Amazon Simple Notification Service (Amazon SNS) topic fanned out to multiple Amazon Simple Queue Service (Amazon SQS) queues. Use AWS Lambda functions to update the targets.

**Đáp án đúng**: **D** (Pattern Fanout)

**Giải thích chi tiết**:

- **D - ĐÚNG**: Pattern **SNS Fanout to SQS**.
  - Khi có event "Sold" (RDS Notification hoặc App trigger), gửi 1 message tới **SNS Topic**.
  - SNS Topic sẽ đẩy copy của message đó tới nhiều **SQS Queues** khác nhau (mỗi queue cho một target system).
  - Các Lambda/Worker đọc từ Queue riêng của mình để update target system.
  - Đảm bảo Decoupling và Scalability.
- **Lưu ý**: RDS Event Notification chỉ báo Admin events (Reboot, Failover, Backup...), nó **KHÔNG** báo Data changes (Insert/Update/Delete rows). Đề bài có thể đang giản lược, hoặc ý nói là App sẽ publish event, hoặc dùng trigger. Nhưng pattern "Send to multiple targets" -> SNS Fanout.

---

## Câu 109

**Đề bài**:  A company needs to store data in Amazon S3 and must prevent the data from being changed. The company wants new objects that are uploaded to Amazon S3 to remain unchangeable for a nonspecific amount of time until the company decides to modify the objects. Only specific users in the company's AWS account can have the ability 10 delete the objects. What should a solutions architect do to meet these requirements?

**Các đáp án**:

- A. Create an S3 Glacier vault. Apply a write-once, read-many (WORM) vault lock policy to the objects.
- B. Create an S3 bucket with S3 Object Lock enabled. Enable versioning. Set a retention period of 100 years. Use governance mode as the S3 bucket’s default retention mode for new objects.
- C. Create an S3 bucket. Use AWS CloudTrail to track any S3 API events that modify the objects. Upon notification, restore the modified objects from any backup versions that the company has.
- D. Create an S3 bucket with S3 Object Lock enabled. Enable versioning. Add a legal hold to the objects. Add the s3:PutObjectLegalHold permission to the IAM policies of users who need to delete the objects.

**Đáp án đúng**: **D** (Legal Hold)

**Giải thích chi tiết**:

- **Yêu cầu**: "Unchangeable for nonspecific amount of time" (Không xác định thời hạn) + "Until company decides to modify" + "Only specific users can delete".
- **D - ĐÚNG**: **Legal Hold** (Chế độ lưu giữ pháp lý) của S3 Object Lock:
  - Không có thời hạn (Indefinite retention).
  - Giữ object ở trạng thái WORM cho đến khi Legal Hold được gỡ bỏ thủ công.
  - Chỉ user có quyền `s3:PutObjectLegalHold` mới gỡ được hold để xóa/sửa. Đây chính xác là requirement.
- **B - SAI**: Retention period "100 years" là fixed time, không phải "nonspecific". Governance mode cho phép user có quyền đặc biệt xóa, nhưng Legal Hold fit hơn với "Stop deletion indefinitely until action".

---

## Câu 110

**Đề bài**:  A social media company allows users to upload images to its website. The website runs on Amazon EC2 instances. During upload requests, the website resizes the images to a standard size and stores the resized images in Amazon S3. Users are experiencing slow upload requests to the website. The company needs to reduce coupling within the application and improve website performance. A solutions architect must design the most operationally efficient process for image uploads. Which combination of actions should the solutions architect take to meet these requirements? (Choose two.)

**Các đáp án**:

- A. Configure the application to upload images to S3 Glacier.
- B. Configure the web server to upload the original images to Amazon S3.
- C. Configure the application to upload images directly from each user's browser to Amazon S3 through the use of a presigned URL.
- D. Configure S3 Event Notifications to invoke an AWS Lambda function when an image is uploaded. Use the function to resize the image.
- E. Create an Amazon EventBridge rule that invokes an AWS Lambda function on a schedule.

**Đáp án đúng**: **C, D**

**Giải thích chi tiết**:

- **C - ĐÚNG**: **Presigned URL** cho phép Client (Browser) upload thẳng file lên S3 mà không qua Web Server (EC2). Điều này giảm tải cho EC2 và tăng tốc độ upload (S3 bandwidth khổng lồ).
- **D - ĐÚNG**: Pattern **Event-driven Processing**. Khi file vừa lên S3 -> S3 trigger **Lambda** để resize. Quá trình resize diễn ra bất đồng bộ (Async), người dùng không phải chờ resize xong mới nhận response. Application được Decoupled hoàn toàn.

---

## Câu 111

**Đề bài**:  A company recently migrated a message processing system to AWS. The system receives messages into an ActiveMQ queue running on an Amazon EC2 instance. Messages are processed by a consumer application running on Amazon EC2. The consumer application processes the messages and writes results to a MySQL database running on Amazon EC2. The company wants this application to be highly available with low operational complexity. Which architecture offers the HIGHEST availability?

**Các đáp án**:

- A. Add a second ActiveMQ server... Replicate MySQL...
- B. Use Amazon MQ with active/standby brokers... Replicate MySQL...
- C. Use Amazon MQ with active/standby brokers... Use Amazon RDS for MySQL with Multi-AZ enabled.
- D. Use Amazon MQ with active/standby brokers... Add an Auto Scaling group for the consumer EC2 instances... Use Amazon RDS for MySQL with Multi-AZ enabled.

**Đáp án đúng**: **D**

**Giải thích chi tiết**:

- **Amazon MQ Active/Standby**: Đây là chuẩn HA cho ActiveMQ trên AWS (Managed Service).
- **RDS Multi-AZ**: Chuẩn HA cho MySQL (Managed Service), tự động failover, low ops complexity.
- **Auto Scaling Group for Consumers**: Consumer là stateless application xử lý message. Để đạt "Highest Availability", cần chạy Consumer trong ASG (trải dài Multi-AZ) để nếu 1 instance chết, ASG tự launch cái khác.
- **D** kết hợp tất cả các yếu tố trên -> Tối ưu nhất.

---

## Câu 112

**Đề bài**:  A company hosts a containerized web application on a fleet of on-premises servers that process incoming requests. The number of requests is growing quickly. The on-premises servers cannot handle the increased number of requests. The company wants to move the application to AWS with minimum code changes and minimum development effort. Which solution will meet these requirements with the LEAST operational overhead?

**Các đáp án**:

- A. Use AWS Fargate on Amazon Elastic Container Service (Amazon ECS) to run the containerized web application...
- B. Use two Amazon EC2 instances to host the containerized web application...
- C. Use AWS Lambda with a new code...
- D. Use a high performance computing (HPC) solution...

**Đáp án đúng**: **A**

**Giải thích chi tiết**:

- **A - ĐÚNG**: **AWS Fargate** là Serverless Compute for Containers.
  - Bạn đã có Docker Container (từ on-prem). Chỉ cần đẩy image lên ECR và chạy task trên Fargate. không cần quản lý EC2 (Least operational overhead).
  - ECS hỗ trợ Auto Scaling (Service Auto Scaling) xử lý traffic tăng nhanh.
- **B - SAI**: Quản lý EC2 instances thủ công tốn công sức (patching, scaling setup).
- **C - SAI**: "Minimum code changes" -> Chuyển sang Lambda có thể yêu cầu sửa code nhiều để phù hợp với Serverless handler/time limits.

---

## Câu 113

**Đề bài**:  A company uses 50 TB of data for reporting. The company wants to move this data from on premises to AWS. A custom application in the company’s data center runs a weekly data transformation job. The company plans to pause the application until the data transfer is complete and needs to begin the transfer process as soon as possible. The data center does not have any available network bandwidth for additional workloads. A solutions architect must transfer the data and must configure the transformation job to continue to run in the AWS Cloud. Which solution will meet these requirements with the LEAST operational overhead?

**Các đáp án**:

- A. AWS DataSync (Cần network).
- B. Snowcone (Quá nhỏ, max 8TB/14TB).
- C. Snowball Edge Storage Optimized (80TB). Copy data. Use AWS Glue? Glue chạy trên Cloud, cần data đã lên Cloud.
- D. Order an AWS Snowball Edge Storage Optimized device that includes Amazon EC2 compute. Copy the data to the device. Create a new EC2 instance on AWS to run the transformation application.

**Đáp án đúng**: **D** (Có chút phân vân với C về workflow transformation).

**Giải thích chi tiết**:

- Cần **Snowball Edge** vì "No available network bandwidth" và "50TB".
- Đề bài nói: "configure the transformation job to continue to run in the AWS Cloud" hay "run ON THE DEVICE"?
  - Đề bài: "runs a weekly data transformation job... plans to pause application until data transfer is complete... configure the transformation job to continue to run in the AWS Cloud"
  - Tức là mục tiêu là move data + app lên Cloud. DataSync (A) ko dùng được do ko có mạng.
  - Dùng Snowball (C/D) là đúng.
  - Option D nói: Copy data to device. Create new EC2 _on AWS_ to run app.
  - Option C nói: Copy data. Use AWS Glue.
  - Nếu "runs a custom application", việc move sang EC2 (Lift & Shift) dễ hơn move sang Glue (Rewrite logic). Và C không nói rõ App chạy ở đâu sau khi migrate. D rõ ràng hơn: "Create new EC2 instance on AWS".

---

## Câu 114

**Đề bài**:  A company has created an image analysis application in which users can upload photos and add photo frames to their images. The users upload images and metadata to indicate which photo frames they want to add to their images. The application uses a single Amazon EC2 instance and Amazon DynamoDB to store the metadata. The application is becoming more popular, and the number of users is increasing. The company expects the number of concurrent users to vary significantly depending on the time of day and day of week. The company must ensure that the application can scale to meet the needs of the growing user base. Which solution meats these requirements?

**Các đáp án**:

- A. Use AWS Lambda to process photos. Store photos and metadata in DynamoDB. (Sai, DynamoDB ko lưu photos tốt - max 400KB limit & cost).
- B. Kinesis Data Firehose (Sai mục đích).
- C. Use AWS Lambda to process photos. Store the photos in Amazon S3. Retain DynamoDB to store the metadata.
- D. Increase EC2... (Scaling thủ công/tốn kém).

**Đáp án đúng**: **C**

**Giải thích chi tiết**:

- **C - ĐÚNG**: Kiến trúc chuẩn (Canonical Pattern):
  - **S3**: Lưu trữ BLOB (Binary Large Objects - Photos) vô hạn, giá rẻ.
  - **DynamoDB**: Lưu metadata (JSON, attributes) nhanh, scale tốt.
  - **Lambda**: Xử lý logic (Add frame) theo kiểu Event-driven, auto-scale theo request.

---

## Câu 115

**Đề bài**:  A medical records company is hosting an application on Amazon EC2 instances. The application processes customer data files that are stored on Amazon S3. The EC2 instances are hosted in public subnets. The EC2 instances access Amazon S3 over the internet, but they do not require any other network access. A new requirement mandates that the network traffic for file transfers take a private route and not be sent over the internet. Which change to the network architecture should a solutions architect recommend to meet this requirement?

**Các đáp án**:

- A. NAT gateway (Vẫn đi qua đường public của AWS, technically "internet" path logic in routing tables though traffic stays in region).
- B. Security Group (Không thay đổi route).
- C. Move EC2 to private subnets. Create a VPC endpoint for Amazon S3...
- D. Remove IGW... Direct Connect (Overkill/Sai).

**Đáp án đúng**: **C**

**Giải thích chi tiết**:

- **C - ĐÚNG**: Để đảm bảo "Private route" hoàn toàn và EC2 không còn nằm trong Public Subnet (nơi tiếp xúc Internet):
  - Di chuyển EC2 vào **Private Subnet**.
  - Sử dụng **VPC Gateway Endpoint for S3**.
  - Route Table của Private Subnet trỏ `pl-xxxx (S3 Prefix List)` -> `vpce-xxxx (Endpoint)`. Traffic đi hoàn toàn trong mạng nội bộ AWS, không bao giờ ra Internet Gateway.

---

## Câu 116

**Đề bài**:  A company uses a popular content management system (CMS) for its corporate website. However, the required patching and maintenance are burdensome. The company is redesigning its website and wants anew solution. The website will be updated four times a year and does not need to have any dynamic content available. The solution must provide high scalability and enhanced security. Which combination of changes will meet these requirements with the LEAST operational overhead? (Choose two.)

**Các đáp án**:

- A. CloudFront (Must combine with something).
- B. WAF (Security only).
- C. Lambda (Overkill for static).
- D. Create new website and S3 bucket. Deploy with static website hosting enabled.
- E. EC2 Auto Scaling (Vẫn phải patch OS/CMS -> không giải quyết vấn đề "patching burdensome").

**Đáp án đúng**: **D** (Có thể kết hợp A nếu đề cho chọn, nhưng D là cốt lõi). Đề bắt chọn 2?
Để xem lại đề... "Which combination... (Choose two)".
Okay:

- **D**: S3 Static Website Hosting (Giải quyết vấn đề "No dynamic content", "No patching", Scalability vô hạn của S3).
- **A** hoặc **B**?
- **A (CloudFront)**: Cần thiết để hỗ trợ HTTPS (S3 Website Endpoint không hỗ trợ HTTPS native với custom domain). CloudFront cũng tăng scalability/performance.
- **B (WAF)**: Tăng security.
- Nhưng A quan trọng hơn vì S3 Website Hosting pattern thường đi kèm CloudFront để có HTTPS và Caching.
- Đáp án: **A, D**.

---

## Câu 117

**Đề bài**:  A company stores its application logs in an Amazon CloudWatch Logs log group. A new policy requires the company to store all application logs in Amazon OpenSearch Service (Amazon Elasticsearch Service) in near-real time. Which solution will meet this requirement with the LEAST operational overhead?

**Các đáp án**:

- A. Configure a CloudWatch Logs subscription to stream the logs to Amazon OpenSearch Service.
- B. Lambda (Overhead code).
- C. Kinesis Data Firehose (Logs -> Firehose -> OpenSearch).
- D. Kinesis Agent (Source là Log files trên server? Đề bài nói log đang ở CloudWatch Logs. Vậy D sai vì cài Agent lại từ đầu).

**Đáp án đúng**: **A**

**Giải thích chi tiết**:

- **A - ĐÚNG**: Tính năng **CloudWatch Logs Subscription Filter** hỗ trợ stream trực tiếp (thực tế backend AWS setup Lambda hoặc Firehose giúp bạn nhưng với User interface nó là "Subscription"). Trong Console, bạn có thể chọn "Stream to Amazon OpenSearch Service" -> đây là cách ít overhead nhất.

---

## Câu 118

**Đề bài**:  A company is building a web-based application running on Amazon EC2 instances in multiple Availability Zones. The web application will provide access to a repository of text documents totaling about 900 TB in size. The company anticipates that the web application will experience periods of high demand. A solutions architect must ensure that the storage component for the text documents can scale to meet the demand of the application at all times. The company is concerned about the overall cost of the solution. Which storage solution meets these requirements MOST cost-effectively?

**Các đáp án**:

- A. EBS (Đắt, block storage khó share 900TB cho web farm nếu không dùng Multi-Attach io2 which is very expensive).
- B. EFS (Đắt hơn S3 nhiều).
- C. OpenSearch (Search engine, chi phí storage cao).
- D. Amazon S3.

**Đáp án đúng**: **D**

**Giải thích chi tiết**:

- **D - ĐÚNG**: **S3** là Object Storage, lưu trữ vô hạn (Exabytes), truy cập qua HTTP API (Web friendly). Giá thành rẻ nhất trong các store 900TB online. "Scale to meet demand" tự động.

---

## Câu 119

**Đề bài**:  A global company is using Amazon API Gateway to design REST APIs for its loyalty club users in the us-east-1 Region and the ap-southeast-2 Region. A solutions architect must design a solution to protect these API Gateway managed REST APIs across multiple accounts from SQL injection and cross-site scripting attacks. Which solution will meet these requirements with the LEAST amount of administrative effort?

**Các đáp án**:

- A. AWS WAF in both regions (Manual setup).
- B. AWS Firewall Manager (Centrally configure).
- C. AWS Shield (DDoS only, not SQLi/XSS).
- D. AWS Shield (DDoS).

**Đáp án đúng**: **B**

**Giải thích chi tiết**:

- **B - ĐÚNG**: **AWS Firewall Manager** cho phép quản trị viên định nghĩa rule WAF tập trung (Central Security Policy) và tự động apply nó cho các resource (API Gateway, ALB, CloudFront) trên nhiều Account và nhiều Region thuộc AWS Organization. Đây là giải pháp "Least administrative effort".

---

## Câu 120

**Đề bài**:  A company has implemented a self-managed DNS solution on three Amazon EC2 instances behind a Network Load Balancer (NLB) in the us-west2 Region. Most of the company's users are located in the United States and Europe. The company wants to improve the performance and availability of the solution. The company launches and configures three EC2 instances in the eu-west-1 Region and adds the EC2 instances as targets for a new NLB. Which solution can the company use to route traffic to all the EC2 instances?

**Các đáp án**:

- A. Route 53 Geolocation... (DNS based latency).
- B. AWS Global Accelerator.
- C. Elastic IP + Route 53 Geolocation (Direct EC2 exposure - Bad).
- D. Replace NLB with ALB + Route 53 Latency.

**Đáp án đúng**: **B**

**Giải thích chi tiết**:

- **B - ĐÚNG**: **AWS Global Accelerator** cung cấp 2 Static Anycast IP. Traffic từ user sẽ vào Edge Location gần nhất rồi đi qua mạng AWS backbone tới NLB ở region gần nhất.
  - Global Accelerator support NLB endpoint natively.
  - Không cần đổi sang ALB (trừ khi cần Layer 7 features).
  - GA failover (< 30s) nhanh hơn DNS caching của Route 53.
  - Đề bài đề cập tới việc hiện tại đang dùng NLB và muốn improve performance/availability -> GA là cặp bài trùng với NLB.

---

## Câu 121

**Đề bài**:  A company is running an online transaction processing (OLTP) workload on AWS. This workload uses an unencrypted Amazon RDS DB instance in a Multi-AZ deployment. Daily database snapshots are taken from this instance. What should a solutions architect do to ensure the database and snapshots are always encrypted moving forward?

**Các đáp án**:

- A. Encrypt copy of snapshot. Replace DB.
- B. EBS volume trick (Không áp dụng cho RDS managed service).
- C. Copy snapshot & enable encryption (AWS KMS). Restore encrypted snapshot to existing DB? (Không thể restore đè lên existing instance đang chạy, phải restore ra instance mới rồi switch endpoint).
- D. S3 SSE-KMS (Chỉ encrypt file backup, không encrypt DB instance đang chạy).

**Đáp án đúng**: **A** (hoặc C viết lại ý A).

**Giải thích chi tiết**:

- Quy trình chuẩn:
  1.  Take snapshot of unencrypted DB.
  2.  **Copy snapshot** và tích chọn **Encrypt** (chọn KMS Key) trong quá trình copy.
  3.  **Restore** DB instance mới từ Encrypted Snapshot.
  4.  Switch traffic sang DB mới.
- Đáp án **A** mô tả đúng quy trình này (Replace existing DB instance - ý là thay thế về mặt application connection hoặc delete cũ dùng mới).

---

## Câu 122

**Đề bài**:  A company wants to build a scalable key management infrastructure to support developers who need to encrypt data in their applications. What should a solutions architect do to reduce the operational burden?

**Các đáp án**:

- B. **AWS Key Management Service (AWS KMS)**. (Managed Service, lo việc lưu trữ, xoay vòng, bảo mật key FIPS 140-2).
- Các đáp án khác (MFA, ACM, IAM) không phải là "Key Management Infrastructure" cho data encryption của application. (ACM quản lý SSL/TLS Certificate).

**Đáp án đúng**: **B**

---

## Câu 123

**Đề bài**:  A company has a dynamic web application hosted on two Amazon EC2 instances. The company has its own SSL certificate, which is on each instance to perform SSL termination. There has been an increase in traffic recently, and the operations team determined that SSL encryption and decryption is causing the compute capacity of the web servers to reach their maximum limit. What should a solutions architect do to increase the application's performance?

**Các đáp án**:

- A. ACM certificate on each instance? (ACM public cert không export được ra EC2).
- B. S3 bucket? (Sai).
- C. Proxy server (Thêm 1 điểm nghẽn/quản lý thủ công).
- D. Import ... ACM. Create ALB with HTTPS listener.

**Đáp án đúng**: **D**

**Giải thích chi tiết**:

- **D - ĐÚNG**: **SSL Offloading**. Chuyển nhiệm vụ giải mã SSL từ EC2 sang **Application Load Balancer (ALB)**.
  - ALB tích hợp tốt với **ACM** (AWS Certificate Manager) để quản lý chứng chỉ.
  - EC2 sẽ nhận traffic HTTP (80) nhẹ nhàng hơn từ ALB (hoặc HTTPS re-encryption nếu cần compliance, nhưng thường offload ở ALB là giải pháp performance).

---

## Câu 124

**Đề bài**:  A company has a highly dynamic batch processing job that uses many Amazon EC2 instances to complete it. The job is stateless in nature, can be started and stopped at any given time with no negative impact, and typically takes upwards of 60 minutes total to complete. The company has asked a solutions architect to design a scalable and cost-effective solution that meets the requirements of the job. What should the solutions architect recommend?

**Các đáp án**:

- A. **EC2 Spot Instances**.
- D. AWS Lambda (Limit 15 phút -> Không chạy được job 60 phút).

**Đáp án đúng**: **A**

**Giải thích chi tiết**:

- **Spot Instances**: Giảm giá tới 90% so với On-Demand.
- Tính chất job: "Stateless", "stopped... no negative impact" -> Hoàn hảo cho đặc tính hay bị reclaim của Spot.

---

## Câu 125

**Đề bài**:  A company runs its two-tier ecommerce website on AWS. The web tier consists of a load balancer that sends traffic to Amazon EC2 instances. The database tier uses an Amazon RDS DB instance. The EC2 instances and the RDS DB instance should not be exposed to the public internet. The EC2 instances require internet access to complete payment processing of orders through a third-party web service. The application must be highly available. Which combination of configuration options will meet these requirements? (Choose two.)

**Các đáp án**:

- A. ASG private subnets. RDS Multi-AZ private. (Thiếu Internet access cho EC2 vì không nhắc đến NAT).
- B. 2 Private Subnets, 2 NAT Gateways (Multi-AZ). ALB in private? (Sai, ALB phải public để user truy cập web).
- D. 1 Public, 1 Private, 2 NAT? (Cấu hình mạng này hơi lạ/lệch).
- E. (Hoặc option cuối cùng): VPC with **2 Public Subnets** (cho ALB và NAT), **2 Private Subnets** (cho EC2 và RDS), **2 NAT Gateways** (cho HA outbound). Deploy ALB in Public Subnets.

**Đáp án đúng**: **E** (Đáp án cuối cùng trong danh sách đề bài, có vẻ typo D thành E hoặc dòng 2052).

**Giải thích chi tiết**:

- **ALB** phải ở **Public Subnet** (để nhận traffic từ internet).
- **EC2** và **RDS** ở **Private Subnet** (security requirement).
- **NAT Gateway** phải ở **Public Subnet** (để route EC2 traffic ra IGW).
- **High Availability**: Cần nhân đôi mọi thứ trên 2 AZ (2 Public Subnets, 2 Private Subnets, 2 NAT GW).

---

## Câu 126

**Đề bài**:  A solutions architect needs to implement a solution to reduce a company's storage costs. All the company's data is in the Amazon S3 Standard storage class. The company must keep all data for at least 25 years. Data from the most recent 2 years must be highly available and immediately retrievable. Which solution will meet these requirements?

**Các đáp án**:

- A. Lifecycle to Glacier Deep Archive immediately. (Sai, 2 năm đầu cần immediate access).
- B. **Lifecycle ... to Glacier Deep Archive after 2 years**. (Chuẩn).
- C. Intelligent-Tiering (Phí monitoring, và Deep Archive access times lâu nếu không config chuẩn, Lifecycle Policy explicit B là rõ ràng nhất cho requirement "after 2 years").
- D. Transition to One Zone-IA immediately... (One Zone rủi ro mất data, đề bài ko yêu cầu hy sinh durability).

**Đáp án đúng**: **B**

---

## Câu 127

**Đề bài**:  A media company is evaluating the possibility of moving its systems to the AWS Cloud. The company needs at least 10 TB of storage with the maximum possible I/O performance for video processing, 300 TB of very durable storage for storing media content, and 900 TB of storage to meet requirements for archival media that is not in use anymore. Which set of services should a solutions architect recommend to meet these requirements?

**Các đáp án**:

- A. EBS (Max perf), S3 (Durable), Glacier (Archival).
- B. EBS... EFS... (EFS durable but slower/expensive than S3).
- C. EC2 Instance Store (Max I/O), EFS... S3...
- D. **EC2 Instance Store** (Max I/O: Millions IOPS, Direct attached NVMe), **S3** (Durable storage), **S3 Glacier** (Archival).

**Đáp án đúng**: **D** (hoặc A tùy ngữ cảnh "Persistent" của 10TB).

- Nếu 10TB video processing là dữ liệu tạm (processing scratchpad) -> **Instance Store** là nhanh nhất (NVMe).
- Nếu cần persistance cho 10TB đó trong lúc process (stop/start instance vẫn còn) -> EBS io2 Block Express.
- Tuy nhiên, cụm "Maximum possible I/O performance" thường ám chỉ Instance Store trong các bài thi AWS cũ. Và 900TB archival thì Glacier là chắc chắn. 300 TB durable -> S3 chuẩn hơn EFS (EFS đắt).
- Chọn **D**.

---

## Câu 128

**Đề bài**:  A company wants to run applications in containers in the AWS Cloud. These applications are stateless and can tolerate disruptions within the underlying infrastructure. The company needs a solution that minimizes cost and operational overhead. What should a solutions architect do to meet these requirements?

**Các đáp án**:

- A. **Spot Instances** in EC2 Auto Scaling group.
- B. **Spot Instances** in **Amazon EKS** managed node group.
- (Cả A và B đều dùng Spot - cost effective).
- Nếu phải chọn "Minimzes operational overhead" nữa thì EKS managed node group giúp quản lý k8s worker nodes. Nhưng nếu không dùng K8s?
- Câu hỏi "Company wants to run applications in containers...". Không nói rõ đang dùng K8s.
- Tuy nhiên, trong ngữ cảnh hiện đại, EKS Managed Node Group with Spot là giải pháp rất mạnh mẽ.
- Nhưng A (EC2 ASG) là generic cho cả ECS/Docker Swarm/Custom.
- Thường câu hỏi AWS sẽ hint về EKS nếu đáp án là EKS.
- Nhưng A là "EC2 ASG". Đáp án **A** an toàn hơn nếu không có ngữ cảnh K8s. Hoặc nếu đề bài ngụ ý ECS (thường dùng thuật ngữ "Tasks" hoặc Fargate).
- "Tolerate disruptions" -> Spot.
- Đáp án **A** hoặc **B**. (Nghiêng về **A** nếu generic, **B** nếu là EKS user).
- Check lại đề: "Company wants to run apps in containers".
- Thường thì **Spot Instances in EC2 ASG** (cho ECS Capacity Provider hoặc EKS) là đáp án core.

---

## Câu 129

**Đề bài**:  A company is running a multi-tier web application on premises. The web application is containerized and runs on a number of Linux hosts connected to a PostgreSQL database that contains user records. The operational overhead of maintaining the infrastructure and capacity planning is limiting the company's growth. A solutions architect must improve the application's infrastructure. Which combination of actions should the solutions architect take to accomplish this? (Choose two.)

**Các đáp án**:

- A. **Migrate PostgreSQL to Amazon Aurora**. (Fully managed DB -> Reduce DB ops overhead).
- E. **Migrate web application to AWS Fargate with Amazon ECS**. (Serverless Containers -> Reduce Compute ops overhead).
- B (EC2) vẫn phải quản lý OS. D (ElastiCache) là performance optimization, not infrastructure migration main step.

**Đáp án đúng**: **A, E**

---

## Câu 130

**Đề bài**:  An application runs on Amazon EC2 instances across multiple Availability Zonas. The instances run in an Amazon EC2 Auto Scaling group behind an Application Load Balancer. The application performs best when the CPU utilization of the EC2 instances is at or near 40%. What should a solutions architect do to maintain the desired performance across all instances in the group?

**Các đáp án**:

- B. **Use a target tracking policy**. (Đây là policy modern và dễ dùng nhất: "Keep Avg CPU at 40%". ASG tự tính toán số lượng instance cần thiết để giữ metric ở mức đó).

**Đáp án đúng**: **B**

---

## Câu 131

**Đề bài**:  A company is developing a file-sharing application that will use an Amazon S3 bucket for storage. The company wants to serve all the files through an Amazon CloudFront distribution. The company does not want the files to be accessible through direct navigation to the S3 URL. What should a solutions architect do to meet these requirements?

**Các đáp án**:

- D. **Create an origin access identity (OAI)** (hoặc Origin Access Control - OAC mới hơn). Assign to CloudFront. Update S3 Bucket Policy to allow only OAI read.

**Đáp án đúng**: **D**

---

## Câu 132

**Đề bài**:  A company’s website provides users with downloadable historical performance reports. The website needs a solution that will scale to meet the company’s website demands globally. The solution should be cost-effective, limit the provisioning of infrastructure resources, and provide the fastest possible response time. Which combination should a solutions architect recommend to meet these requirements?

**Các đáp án**:

- A. **Amazon CloudFront and Amazon S3**. (S3 lưu file rẻ, CloudFront cache global nhanh nhất, không cần provision server EC2/Lambda).

**Đáp án đúng**: **A**

---

## Câu 133

**Đề bài**:  A company runs an Oracle database on premises. As part of the company’s migration to AWS, the company wants to upgrade the database to the most recent available version. The company also wants to set up disaster recovery (DR) for the database. The company needs to minimize the operational overhead for normal operations and DR setup. The company also needs to maintain access to the database's underlying operating system. Which solution will meet these requirements?

**Các đáp án**:

- C. **Migrate to Amazon RDS Custom for Oracle**. (RDS Custom cho phép truy cập OS - SSH/RDP, đồng thời vẫn hỗ trợ automation cho backup/patching ở mức độ nhất định. RDS Standard (B/D) không cho access OS. EC2 (A) high overhead).

**Đáp án đúng**: **C**

---

## Câu 134

**Đề bài**:  A company wants to move its application to a serverless solution. The serverless solution needs to analyze existing and new data by using SL. The company stores the data in an Amazon S3 bucket. The data requires encryption and must be replicated to a different AWS Region. Which solution will meet these requirements with the LEAST operational overhead?

**Các đáp án**:

- A. S3 CRR (Replication) + **AWS KMS multi-Region keys** + **Amazon Athena**.
  - **Athena**: Serverless SQL analytics.
  - **KMS Multi-Region Keys**: Cùng 1 Key ID ở 2 region -> Không cần re-encrypt/decrypt phức tạp khi replicate data. App ở Region B có thể decrypt data dùng key y hệt Region A.
  - S3 CRR hỗ trợ replicate encrypted objects.

**Đáp án đúng**: **A**

---

## Câu 135

**Đề bài**:  A company runs workloads on AWS. The company needs to connect to a service from an external provider. The service is hosted in the provider's VPC. According to the company’s security team, the connectivity must be private and must be restricted to the target service. The connection must be initiated only from the company’s VPC. Which solution will mast these requirements?

**Các đáp án**:

- D. **AWS PrivateLink (VPC Endpoint)**.
  - Provider tạo **Endpoint Service** (NLB).
  - Consumer (Company) tạo **Interface VPC Endpoint**.
  - Kết nối này là Private, One-way (Consumer -> Provider), và chỉ định tuyến tới đúng Service đó (NLB target) chứ không thông toàn bộ mạng như VPC Peering (A).

**Đáp án đúng**: **D**

---

## Câu 136

**Đề bài**:  A company is migrating its on-premises PostgreSQL database to Amazon Aurora PostgreSQL. The on-premises database must remain online and accessible during the migration. The Aurora database must remain synchronized with the on-premises database. Which combination of actions must a solutions architect take to meet these requirements? (Choose two.)

**Các đáp án**: (Choose two)

- A. **Create an ongoing replication task**. (DMS Task CDC).
- C. **Create an AWS Database Migration Service (AWS DMS) replication server**. (Cần hạ tầng DMS để chạy task).
- (Hoặc D. SCT nếu cần convert schema, nhưng Postgres -> Aurora Postgres thường tương thích 100%, nên DMS Server + Task là 2 bước bắt buộc của DMS process).

**Đáp án đúng**: **A, C**

---

## Câu 137

**Đề bài**:  A company uses AWS Organizations to create dedicated AWS accounts for each business unit to manage each business unit's account independently upon request. The root email recipient missed a notification that was sent to the root user email address of one account. The company wants to ensure that all future notifications are not missed. Future notifications must be limited to account administrators. Which solution will meet these requirements?

**Các đáp án**:

- B. **Configure all AWS account root user email addresses as distribution lists**.
  - Best practice: Email root không nên là email cá nhân 1 người. Nên là email group (alias/distribution list) ví dụ `aws-alerts@company.com` để nhiều admin cùng nhận được.

**Đáp án đúng**: **B**

---

## Câu 138

**Đề bài**:  A company runs its ecommerce application on AWS. Every new order is published as a massage in a RabbitMQ queue that runs on an Amazon EC2 instance in a single Availability Zone. These messages are processed by a different application that runs on a separate EC2 instance. This application stores the details in a PostgreSQL database on another EC2 instance. All the EC2 instances are in the same Availability Zone. The company needs to redesign its architecture to provide the highest availability with the least operational overhead. What should a solutions architect do to meet these requirements?

**Các đáp án**:

- B. Migrate queue to **Amazon MQ (Active/Standby)**. App on **EC2 Multi-AZ ASG**. Database on **Amazon RDS for PostgreSQL Multi-AZ**.
  - Amazon MQ Active/Standby: Standard HA for Message Broker.
  - RDS Multi-AZ: Standard HA for DB.
  - ASG: Standard HA for Compute.

**Đáp án đúng**: **B**

---

## Câu 139

**Đề bài**:  A reporting team receives files each day in an Amazon S3 bucket. The reporting team manually reviews and copies the files from this initial S3 bucket to an analysis S3 bucket each day at the same time to use with Amazon QuickSight. Additional teams are starting to send more files in larger sizes to the initial S3 bucket. The reporting team wants to move the files automatically analysis S3 bucket as the files enter the initial S3 bucket. The reporting team also wants to use AWS Lambda functions to run pattern-matching code on the copied data. In addition, the reporting team wants to send the data files to a pipeline in Amazon SageMaker Pipelines. What should a solutions architect do to meet these requirements with the LEAST operational overhead?

**Các đáp án**:

- D. **Configure S3 replication... Configure analysis bucket to send notifications to Amazon EventBridge... ObjectCreated rule... Lambda and SageMaker Pipelines as targets**.
  - EventBridge là "Hub" xử lý event mạnh mẽ nhất hiện nay.
  - Nó support multiple targets (Lambda, SageMaker Pipeline...) từ 1 rule.
  - S3 Replication tự động copy file. Bucket đích bắn event.

**Đáp án đúng**: **D**

---

## Câu 140

**Đề bài**:  A solutions architect needs to help a company optimize the cost of running an application on AWS. The application will use Amazon EC2 instances, AWS Fargate, and AWS Lambda for compute within the architecture. The EC2 instances will run the data ingestion layer of the application. EC2 usage will be sporadic and unpredictable. Workloads that run on EC2 instances can be interrupted at any time. The application front end will run on Fargate, and Lambda will serve the API layer. The front-end utilization and API layer utilization will be predictable over the course of the next year. Which combination of purchasing options will provide the MOST cost-effective solution for hosting this application? (Choose two.)

**Các đáp án**:

- A. **Use Spot Instances for data ingestion layer**. (Sporadic, unpredictable -> Spot is perfect).
- C (hoặc E). **Compute Savings Plan vs EC2 Instance Savings Plan**.
  - Fargate và Lambda **CHỈ** được cover bởi **Compute Savings Plans** (Không phải EC2 Instance Savings Plans).
  - EC2 Instance SP chỉ cover EC2 family cụ thể.
  - EC2 Compute SP cover EC2 (any family), Fargate, Lambda.
  - Chọn **C** (Compute SP).

**Đáp án đúng**: **A, C**

---

## Câu 141

**Đề bài**:  A company runs a web-based portal that provides users with global breaking news, local alerts, and weather updates. The portal delivers each user a personalized view by using mixture of static and dynamic content. Content is served over HTTPS through an API server running on an Amazon EC2 instance behind an Application Load Balancer (ALB). The company wants the portal to provide this content to its users across the world as quickly as possible. How should a solutions architect design the application to ensure the LEAST amount of latency for all users?

**Các đáp án**:

- A. **Deploy in single Region. Use Amazon CloudFront... specifying ALB as origin**.
  - CloudFront cache static content tại Edge.
  - CloudFront route dynamic requests qua AWS Backbone tới ALB origin (nhanh hơn public internet routing).
  - Đây là single-region deployment tối ưu nhất cho global reach mà không cần quản lý multi-region complex replication.
  - (Multi-region B/D sẽ latency thấp hơn về lý thuyết vật lý, nhưng complexity cao. Nhưng câu hỏi hỏi "Design... to ensure LEAST amount of latency" - về mặt tuyệt đối thì Multi-region thấp hơn. Tuy nhiên "Use CloudFront" thường là đáp án chuẩn của AWS cho bài toán này vì nó cân bằng Cost/Complexity/Performance. Nếu đề bài không care cost thì B/D. Nhưng A là đáp án phổ biến nhất cho kịch bản "ALB Origin").

**Đáp án đúng**: **A**

---

## Câu 142

**Đề bài**:  A gaming company is designing a highly available architecture. The application runs on a modified Linux kernel and supports only UDP-based traffic. The company needs the front-end tier to provide the best possible user experience. That tier must have low latency, route traffic to the nearest edge location, and provide static IP addresses for entry into the application endpoints. What should a solutions architect do to meet these requirements?

**Các đáp án**:

- C. **AWS Global Accelerator to NLB**. (Support UDP, Anycast Static IP, Routing to nearest region).

**Đáp án đúng**: **C**

---

## Câu 143

**Đề bài**:  A company wants to migrate its existing on-premises monolithic application to AWS. The company wants to keep as much of the front-end code and the backend code as possible. However, the company wants to break the application into smaller applications. A different team will manage each application. The company needs a highly scalable solution that minimizes operational overhead. Which solution will meet these requirements?

**Các đáp án**:

- D. **Amazon ECS**. (Containerization cho phép giữ code/runtime environment cũ, chỉ đóng gói lại. ECS quản lý orchestration, scale tốt). Lambda (A) phải sửa code nhiều.

**Đáp án đúng**: **D**

---

## Câu 144

**Đề bài**:  A company recently started using Amazon Aurora as the data store for its global ecommerce application. When large reports are run, developers report that the ecommerce application is performing poorly. After reviewing metrics in Amazon CloudWatch, a solutions architect finds that the ReadIOPS and CPUUtilizalion metrics are spiking when monthly reports run. What is the MOST cost-effective solution?

**Các đáp án**:

- B. **Migrate monthly reporting to Aurora Replica**. (Tạo Replica tốn ít chi phí hơn dựng cụm Redshift riêng, và giải quyết được vấn đề contention resource ngay lập tức).

**Đáp án đúng**: **B**

---

## Câu 145

**Đề bài**:  A company hosts a website analytics application on a single Amazon EC2 On-Demand Instance. The analytics software is written in PHP and uses a MySQL database. The analytics software, the web server that provides PHP, and the database server are all hosted on the EC2 instance. The application is showing signs of performance degradation during busy times and is presenting 5xx errors. The company needs to make the application scale seamlessly. Which solution will meet these requirements MOST cost-effectively?

**Các đáp án**:

- D. **Migrate DB to Aurora**. **Web App AMI -> Launch Template -> ASG (Spot Fleet) + ALB**.
  - Tách DB ra khỏi Web server (Database Tier).
  - Web Tier dùng ASG để scale out/in.
  - Spot Fleet (hoặc Mixed Instance Policy) giúp optimize cost.

**Đáp án đúng**: **D**

---

## Câu 146

**Đề bài**:  A company runs a stateless web application in production on a group of Amazon EC2 On-Demand Instances behind an Application Load Balancer. The application experiences heavy usage during an 8-hour period each business day. Application usage is moderate and steady overnight. Application usage is low during weekends. The company wants to minimize its EC2 costs without affecting the availability of the application. Which solution will meet these requirements?

**Các đáp án**:

- B. **Reserved Instances for baseline... Spot Instances for additional capacity**. (Option này optimize cost tốt nhất trong các lựa chọn an toàn. Spot cho phần peak capacity của stateless app là hợp lý).

**Đáp án đúng**: **B**

---

## Câu 147

**Đề bài**:  A company needs to retain application log files for a critical application for 10 years. The application team regularly accesses logs from the past month for troubleshooting, but logs older than 1 month are rarely accessed. The application generates more than 10 TB of logs per month. Which storage option meets these requirements MOST cost-effectively?

**Các đáp án**:

- B. **Store in S3. S3 Lifecycle ... to Glacier Deep Archive**. (Rẻ nhất cho 10TB data/tháng lưu 10 năm).

**Đáp án đúng**: **B**

---

## Câu 148

**Đề bài**:  A company has a data ingestion workflow that includes the following components: An Amazon Simple Notification Service (Amazon SNS) topic that receives notifications about new data deliveries An AWS Lambda function that processes and stores the data The ingestion workflow occasionally fails because of network connectivity issues. When failure occurs, the corresponding data is not ingested unless the company manually reruns the job. What should a solutions architect do to ensure that all notifications are eventually processed?

**Các đáp án**:

- D. **Configure SQS as on-failure destination. Modify Lambda to process queue**. (Dead Letter Queue pattern / On-failure destination pattern để bắt các event lỗi, sau đó xử lý lại).

**Đáp án đúng**: **D**

---

## Câu 149

**Đề bài**:  A company has a service that produces event data. The company wants to use AWS to process the event data as it is received. The data is written in a specific order that must be maintained throughout processing. The company wants to implement a solution that minimizes operational overhead. How should a solutions architect accomplish this?

**Các đáp án**:

- A. **SQS FIFO queue + Lambda**. (SQS FIFO đảm bảo **Strictly Ordered**. Lambda support trigger từ FIFO queue).

**Đáp án đúng**: **A**

---

## Câu 150

**Đề bài**:  A company is migrating an application from on-premises servers to Amazon EC2 instances. As part of the migration design requirements, a solutions architect must implement infrastructure metric alarms. The company does not need to take action if CPU utilization increases to more than 50% for a short burst of time. However, if the CPU utilization increases to more than 50% and read IOPS on the disk are high at the same time, the company needs to act as soon as possible. The solutions architect also must reduce false alarms. What should the solutions architect do to meet these requirements?

**Các đáp án**:

- A. **Create Amazon CloudWatch composite alarms**. (Tính năng Composite Alarm cho phép kết hợp nhiều alarm con bằng logic AND/OR/NOT). `ALARM(CPU) AND ALARM(DiskIO)`.

**Đáp án đúng**: **A**

---
