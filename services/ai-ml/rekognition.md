# Amazon Rekognition

## 1. Tổng quan (Overview)

Amazon Rekognition là dịch vụ thị giác máy tính (computer vision) sử dụng deep learning để nhận diện các đối tượng, người, văn bản, cảnh vật và hoạt động trong hình ảnh và video.

- **Managed Service**: Không cần xây dựng hay quản lý cơ sở hạ tầng deep learning.
- **Tích hợp**: Sẵn sàng để tích hợp vào ứng dụng của bạn qua API đơn giản.
- **Hình ảnh & Video**: Hỗ trợ phân tích cả hình ảnh tĩnh và video streaming/lưu trữ.

## 2. Các tính năng chính (Key Features)

### a. Phân tích Hình ảnh (Image Analysis)

1.  **Labels (Nhãn)**:
    - Phát hiện hàng nghìn đối tượng (xe hơi, tòa nhà, điện thoại) và cảnh vật (bãi biển, thành phố, hoàng hôn).
    - Trả về nhãn kèm theo độ tin cậy (confidence score) và bounding box (hộp bao quanh).

2.  **Facial Analysis (Phân tích khuôn mặt)**:
    - Phát hiện khuôn mặt trong hình ảnh.
    - Thuộc tính: Giới tính, dải tuổi ước tính, cảm xúc ( vui, buồn, giận dữ), mắt (mở/nhắm), có đang đeo kính/kính râm không, có râu không.
    - **Lưu ý**: Không nhận diện "ai", chỉ phân tích thuộc tính của khuôn mặt.

3.  **Face Search & Verification (Tìm kiếm & Xác minh khuôn mặt)**:
    - **CompareFaces**: So sánh khuôn mặt trong 2 hình ảnh để xem có phải cùng 1 người không (Similarity Score).
    - **SearchFacesByImage**: Tìm kiếm khuôn mặt trong một bộ sưu tập (Collection) đã index trước đó.
    - Dùng cho xác thực danh tính (eKYC) hoặc chấm công.

4.  **PPE Detection (Phát hiện đồ bảo hộ)**:
    - Phát hiện xem người trong ảnh có đang đeo khẩu trang (face cover), găng tay (hand cover), mũ bảo hộ (head cover) hay không.
    - Dùng để giám sát an toàn lao động.

5.  **Content Moderation (Kiểm duyệt nội dung)**:
    - Phát hiện nội dung không phù hợp, nhạy cảm (Explicit, Suggestive, Violence).
    - Giúp tự động lọc ảnh/video do người dùng tải lên.

6.  **Text in Image**:
    - Phát hiện và trích xuất văn bản từ hình ảnh (ví dụ: biển báo giao thông, biển số xe, tên cửa hàng).
    - **Phân biệt với Textract**: Textract chuyên cho tài liệu (giấy tờ, form), Rekognition chuyên cho text trong ảnh chụp tự nhiên (scene text).

7.  **Celebrity Recognition**:
    - Nhận diện người nổi tiếng trong lĩnh vực giải trí, chính trị, thể thao.

8.  **Custom Labels**:
    - Huấn luyện mô hình riêng để nhận diện các đối tượng đặc thù (logo thương hiệu, linh kiện máy móc cụ thể, cây trồng bị bệnh...).
    - Đơn giản: Upload ảnh mẫu -> Label -> Train.

### b. Phân tích Video (Video Analysis)

- Phân tích video đã lưu (Stored Video) hoặc video trực tiếp (Streaming Video - Kinesis Video Streams).
- Phát hiện: People pathing (theo dõi đường đi của người), Activities (đang chạy, đang bơi), Segment detection (technical cues, shot detection).

## 3. Cơ chế hoạt động (Modes of Operation)

### Synchronous API (Hình ảnh)

- `DetectLabels`, `DetectFaces`: Gửi ảnh (byte hoặc S3 Object) -> Nhận JSON kết quả ngay lập tức.
- Giới hạn kích thước ảnh (thường < 5MB-15MB tùy loại input).

### Asynchronous API (Video & Large Image Batch)

- Start Job (`StartLabelDetection`) -> Job ID -> Notification (SNS) khi hoàn tất -> Get Results (`GetLabelDetection`).
- Video được phân tích theo từng frame hoặc segment.

## 4. Use Cases (Trường hợp sử dụng)

1.  **Identity Verification (eKYC)**:
    - So sánh ảnh selfie với ảnh trên CMND/CCCD để xác minh danh tính người dùng khi mở tài khoản ngân hàng online.

2.  **Smart Home & Surveillance**:
    - Phát hiện người lạ, thú cưng, hoặc các gói hàng trước cửa nhà.

3.  **Media Analysis**:
    - Tự động gắn thẻ (tagging) cho thư viện ảnh/video khổng lồ để dễ dàng tìm kiếm (ví dụ: "tìm tất cả ảnh có con chó").
    - Tạo highlight video dựa trên sự xuất hiện của người nổi tiếng hoặc bàn thắng.

4.  **Workplace Safety**:
    - Cảnh báo khi nhân viên vào khu vực nguy hiểm mà không đội mũ bảo hộ (PPE Detection).

## 5. Security & Compliance

- **Data Privacy**: Bạn có thể opt-out để AWS không dùng dữ liệu của bạn để huấn luyện mô hình chung.
- **Encryption**: Dữ liệu lưu trữ (Collections) được mã hóa bằng KMS.

## 6. Pricing (Định giá)

- **Image Analysis**: Tính phí theo số lượng hình ảnh được xử lý (ví dụ: $1 cho 1000 ảnh).
- **Video Analysis**: Tính phí theo phút video được lưu trữ hoặc xử lý.
- **Face Storage**: Tính phí lưu trữ vector đặc trưng khuôn mặt trong Collection (rất rẻ).

## 7. Exam Tips (Lưu ý thi SAA)

- Nếu đề bài yêu cầu **nhận diện người, vật thể, cảnh vật** trong ảnh/video -> Chọn **Rekognition**.
- Nếu đề bài yêu cầu **xác minh danh tính** (so sánh khuôn mặt) -> Chọn **Rekognition CompareFaces**.
- Nếu đề bài yêu cầu tìm kiếm nội dung **nhạy cảm/người lớn** -> Chọn **Rekognition Content Moderation**.
- Nếu đề bài yêu cầu trích xuất **text từ biển báo, biển số xe** -> Chọn **Rekognition** (Text in Image). Nếu là **văn bản tài liệu scan** -> Chọn **Textract**.
- Nếu đề bài yêu cầu phát hiện **logo thương hiệu riêng** -> Chọn **Rekognition Custom Labels**.
- Rekognition **KHÔNG** dùng để xác thực quyền truy cập IAM (đó là IAM). Nó dùng cho xác thực ứng dụng của bạn.
