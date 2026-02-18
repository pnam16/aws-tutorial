# Amazon SageMaker

## 1. Tổng quan (Overview)

Amazon SageMaker là một dịch vụ máy học (Machine Learning - ML) được quản lý hoàn toàn, giúp các nhà phát triển và nhà khoa học dữ liệu xây dựng, huấn luyện và triển khai các mô hình ML một cách nhanh chóng.

- **End-to-End ML**: Bao phủ toàn bộ quy trình ML từ chuẩn bị dữ liệu đến triển khai và giám sát.
- **Managed Infrastructure**: Tự động quản lý tài nguyên tính toán (EC2 instances) cho training và hosting.
- **Modular**: Bạn có thể chỉ dùng tính năng Training mà không cần dùng Deploy, hoặc ngược lại.

## 2. Các thành phần chính (Key Components)

SageMaker chia quy trình ML thành 4 giai đoạn chính:

### a. Prepare (Chuẩn bị dữ liệu)

1.  **SageMaker Ground Truth**:
    - Dịch vụ gán nhãn dữ liệu (Data Labeling) được quản lý.
    - Kết hợp con người (Mechanical Turk, vendors, hoặc team nội bộ) và máy học để gán nhãn cho ảnh, văn bản, video.
    - _Ví dụ_: Vẽ bounding box quanh xe hơi trong ảnh để training object detection.

2.  **SageMaker Data Wrangler**:
    - Chuẩn bị và làm sạch dữ liệu (Data Cleansing) với giao diện trực quan (ít code).
    - Import dữ liệu từ S3, Athena, Redshift, Snowflake.

3.  **SageMaker Feature Store**:
    - Kho lưu trữ tập trung các đặc trưng (features) để dùng chung giữa training và inference.
    - Đảm bảo tính nhất quán của dữ liệu (Consistency) giữa lúc train và lúc chạy thực tế.

### b. Build (Xây dựng mô hình)

1.  **SageMaker Studio**:
    - Môi trường phát triển tích hợp (IDE) chuyên dụng cho ML (dựa trên JupyterLab).
    - Tích hợp tất cả công cụ SageMaker vào một giao diện web.

2.  **SageMaker Notebook Instances**:
    - Các EC2 instance chạy Jupyter Notebook được quản lý, cài sẵn các thư viện ML phổ biến (TensorFlow, PyTorch, MXNet).

3.  **SageMaker Autopilot (AutoML)**:
    - Tự động xây dựng, huấn luyện và điều chỉnh các mô hình ML tốt nhất dựa trên dữ liệu của bạn.
    - Không cần kiến thức chuyên sâu về ML.
    - Trả về danh sách các mô hình được xếp hạng (Leaderboard).

4.  **SageMaker Canvas**:
    - Giao diện No-code cho người dùng doanh nghiệp (Business Analyst) để tạo dự báo tài chính, bán hàng mà không cần viết code.

### c. Train (Huấn luyện)

1.  **Training Jobs**:
    - SageMaker tự động khởi tạo EC2 cluster -> Copy dữ liệu từ S3 -> Chạy training code (Docker container) -> Lưu model artifacts vào S3 -> Tự động tắt cluster.
    - Tính tiền theo giây sử dụng.

2.  **Automatic Model Tuning (Hyperparameter Tuning)**:
    - Tự động chạy nhiều training jobs với các tham số (hyperparameters) khác nhau để tìm ra bộ tham số tối ưu nhất.

3.  **Managed Spot Training**:
    - Sử dụng EC2 Spot Instances để tiết kiệm tới 90% chi phí training.
    - Tự động Checkpoint để resume nếu bị gián đoạn.

### d. Deploy (Triển khai & Hosting)

1.  **Real-time Inference (Endpoints)**:
    - Triển khai model lên một HTTPS endpoint để ứng dụng gọi API lấy kết quả tức thì (low latency).
    - Hỗ trợ Auto Scaling dựa trên workload.

2.  **Serverless Inference**:
    - Tự động scale từ 0 lên dựa trên traffic, chỉ trả tiền khi có request xử lý.
    - Phù hợp cho traffic không thường xuyên.

3.  **Batch Transform**:
    - Xử lý suy luận (inference) cho một lượng lớn dữ liệu đã lưu trong S3 (không cần real-time).
    - Trả kết quả về S3.

4.  **Asynchronous Inference**:
    - Cho các request xử lý lâu (vài phút) hoặc kích thước payload lớn.
    - Hàng đợi các request và xử lý dần.

### e. Manage (Quản lý)

1.  **SageMaker Model Monitor**:
    - Giám sát model đang chạy production để phát hiện **Model Drift** (model bị sai lệch theo thời gian do dữ liệu thay đổi).
    - Cảnh báo và kích hoạt train lại.

2.  **SageMaker Pipelines**:
    - Dịch vụ CI/CD chuyên dụng cho ML.
    - Tự động hóa luồng: Data Prep -> Train -> Evaluate -> Deploy.

3.  **SageMaker Lineage Tracking**:
    - Theo dõi nguồn gốc của model (được train từ dữ liệu nào, code nào, tham số gì).

## 3. Cơ chế hoạt động (How It Works)

1.  **Dữ liệu**: Lưu trữ trong **Amazon S3**.
2.  **Code**: Viết code training (Python) trong **Notebook Instance** hoặc local IDE.
3.  **Container**: Đóng gói code training và dependencies vào **Docker Image** (ECR). SageMaker cung cấp sẵn container cho các thuật toán phổ biến (XGBoost, Image Classification...).
4.  **Training**: Gọi API `CreateTrainingJob`. SageMaker kéo hình ảnh Docker và dữ liệu S3 vào cluster để chạy.
5.  **Artifacts**: Kết quả training (model weights) được lưu lại vào S3.
6.  **Inference**: Gọi API `CreateEndpoint` để deploy model từ S3 lên EC2 instance phục vụ dự đoán.

## 4. Security & Compliance

- **IAM Role**: Kiểm soát quyền truy cập vào S3 và các tài nguyên khác.
- **VPC**: Chạy notebook và training job trong VPC private subnet để bảo mật.
- **Inter-container traffic encryption**: Mã hóa dữ liệu truyền giữa các node khi distributed training.
- **KMS**: Mã hóa dữ liệu rest và dữ liệu trên EBS volume của instance.

## 5. Pricing (Định giá)

- **Training**: Trả phí theo giờ cho loại instance sử dụng (e.g., ml.m5.xlarge).
- **Inference**: Trả phí theo giờ cho instance chạy endpoint (Real-time) hoặc theo lượng dữ liệu/thời gian xử lý (Serverless/Batch).
- **Storage**: Phí lưu trữ dữ liệu trên S3 và EBS volumes đi kèm instance.

## 6. Exam Tips (Lưu ý thi SAA)

- Nếu đề bài yêu cầu **xây dựng, huấn luyện và triển khai** mô hình ML -> Chọn **SageMaker**.
- Nếu đề bài nhắc đến **gán nhãn dữ liệu (labeling)** -> Chọn **SageMaker Ground Truth**.
- Nếu đề bài muốn dùng **Spot Instances** để _huấn luyện_ cho rẻ -> Chọn **Managed Spot Training**.
- Nếu đề bài muốn **AutoML** (không code, tự động chọn thuật toán) -> Chọn **SageMaker Autopilot**.
- Nếu hỏi về **Docker**: SageMaker sử dụng Docker containers cho cả training và inference.
- Nếu hỏi về **Store Features** để dùng chung -> Chọn **SageMaker Feature Store**.
- Phân biệt: **Batch Transform** (xử lý lô lớn file S3) vs **Real-time Endpoint** (API trả về ngay).
