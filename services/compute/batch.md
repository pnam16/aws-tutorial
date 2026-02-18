# AWS Batch

## 1. Tổng quan (Overview)

AWS Batch là dịch vụ giúp chạy các tác vụ tính toán hàng loạt (batch computing workloads) trên quy mô lớn. Nó tự động cung cấp tài nguyên, lên lịch và thực thi hàng trăm nghìn job mà không cần cài đặt phần mềm quản lý cluster.

- **Fully Managed**: Không cần quản lý server, job scheduler.
- **Container-based**: Các job chạy trong Docker containers.
- **Cost-optimized**: Tự động sử dụng Spot Instances để tiết kiệm tối đa chi phí.

## 2. Các thành phần chính (Key Concepts)

### a. Jobs

- Đơn vị công việc cần thực thi (một shell script, một file thực thi, hoặc container image).
- Có thể định nghĩa input, output, biến môi trường.

### b. Job Definitions

- Bản thiết kế (template) cho Job.
- Quy định: Docker image, vCPU, Memory, IAM Role, Mount points.
- Giống như "Task Definition" trong ECS.

### c. Job Queues

- Hàng đợi chứa các jobs đang chờ chạy.
- Có **độ ưu tiên (Priority)**: High, Medium, Low.
- Một Job Queue được liên kết với một hoặc nhiều Compute Environment.

### d. Compute Environments

- Nơi thực sự chạy các jobs (trên EC2 instances hoặc Fargate).
- **Managed**: AWS tự động scale EC2 (On-Demand hoặc Spot) dựa trên nhu cầu của hàng đợi.
- **Unmanaged**: Bạn tự quản lý EC2 instances (ECS agent required).

## 3. Cơ chế hoạt động (How It Works)

1.  **Submit Job**: Người dùng gửi Job (tham chiếu Job Definition) vào **Job Queue**.
2.  **Scheduler**: AWS Batch Scheduler kiểm tra hàng đợi, đánh giá độ ưu tiên và sự phụ thuộc (Job A cần chạy xong trước Job B).
3.  **Scale Up**: Nếu có Job đang chờ, Batch yêu cầu Compute Environment khởi tạo thêm EC2 instances (hoặc dùng Spot Fleet).
4.  **Execute**: ECS Agent trên instance kéo Docker image và chạy container.
5.  **Complete**: Job chạy xong, log được đẩy về CloudWatch Logs.
6.  **Scale Down**: Nếu hàng đợi rỗng, Batch tự động terminate instances để tiết kiệm tiền.

## 4. Multi-node Parallel Jobs

- Cho phép chạy một job duy nhất trải rộng trên nhiều EC2 instances (MPI - Message Passing Interface).
- Dùng cho các ứng dụng HPC (High Performance Computing) cần giao tiếp low-latency giữa các node.

## 5. AWS Batch vs Lambda vs Glue

| Đặc điểm           | AWS Batch                                                           | AWS Lambda                                      | AWS Glue                               |
| :----------------- | :------------------------------------------------------------------ | :---------------------------------------------- | :------------------------------------- |
| **Thời gian chạy** | Không giới hạn (vài giờ, vài ngày).                                 | Tối đa 15 phút.                                 | Không giới hạn.                        |
| **Môi trường**     | Docker container (bất kỳ ngôn ngữ/thư viện nào).                    | Runtime hỗ trợ (Node, Py, Java...) hoặc Custom. | Spark/Python ETL script.               |
| **Use Case**       | Batch processing tổng quát (Image processing, simulaton, genomics). | Event-driven, short tasks, API backend.         | Data integration, ETL, convert format. |
| **Hạ tầng**        | EC2/Fargate (quản lý bởi Batch).                                    | Serverless (quản lý bởi Lambda).                | Serverless (quản lý bởi Glue).         |

## 6. Exam Tips (Lưu ý thi SAA)

- Nếu đề bài yêu cầu **xử lý hàng loạt (batch processing)** với thời gian chạy **trên 15 phút** -> Chọn **AWS Batch**. (Lambda chỉ chạy tối đa 15 phút).
- Nếu muốn **tối ưu chi phí** cho batch jobs -> Cấu hình Compute Environment sử dụng **Spot Instances**. AWS Batch tự động quản lý việc spot interruption (retry job).
- Nếu ứng dụng đóng gói trong **Docker** container và cần chạy theo lịch hoặc sự kiện -> **Batch** là lựa chọn tuyệt vời.
- Batch thực chất chạy trên **ECS**. Vì vậy các khái niệm container properties tương tự ECS.
- Để xử lý các job phụ thuộc nhau (Job B chỉ chạy khi Job A thành công) -> Batch hỗ trợ **Job Dependencies**.
