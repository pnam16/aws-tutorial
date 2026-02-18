# Amazon Comprehend

## 1. Tổng quan (Overview)

Amazon Comprehend là một dịch vụ xử lý ngôn ngữ tự nhiên (NLP) sử dụng machine learning để khám phá thông tin chi tiết (insights) và mối quan hệ trong văn bản.

- **Managed Service**: Hoàn toàn được quản lý bởi AWS, không cần server hay kinh nghiệm về ML.
- **Mục tiêu**: Trích xuất thông tin, phân tích cảm xúc, tự động phân loại văn bản.
- **Compliance**: Hỗ trợ HIPAA, GDPR, PCI DSS.

## 2. Các tính năng chính (Key Features)

### a. Phân tích văn bản (Text Analysis)

Amazon Comprehend cung cấp các API được huấn luyện trước (pre-trained) để phân tích:

1.  **Entity Recognition (Nhận diện thực thể)**:
    - Phát hiện: Tên người (PERSON), địa điểm (LOCATION), tổ chức (ORGANIZATION), ngày tháng (DATE), số lượng (QUANTITY).
    - _Ví dụ_: Từ "Amazon HQ is in Seattle", nó trích xuất "Amazon" (ORG) và "Seattle" (LOC).

2.  **Sentiment Analysis (Phân tích cảm xúc)**:
    - Xác định cảm xúc của văn bản: **Positive** (Tích cực), **Negative** (Tiêu cực), **Neutral** (Trung tính), hoặc **Mixed** (Hỗn hợp).
    - Cung cấp điểm tin cậy (Confidence Score) cho từng loại.

3.  **Key Phrase Extraction (Trích xuất cụm từ khóa)**:
    - Tìm các danh từ hoặc cụm danh từ mô tả chủ đề chính.
    - _Ví dụ_: "The quick brown fox" -> "quick brown fox".

4.  **Language Detection (Phát hiện ngôn ngữ)**:
    - Tự động xác định ngôn ngữ của văn bản (hỗ trợ 100+ ngôn ngữ).
    - Trả về mã ngôn ngữ (e.g., `en`, `vi`) và điểm tin cậy.

5.  **PII Detection & Redaction (Phát hiện & Che giấu thông tin cá nhân)**:
    - Phát hiện thông tin nhạy cảm: SSN, số thẻ tín dụng, email, địa chỉ, số điện thoại.
    - Hỗ trợ che giấu (redact) thay thế PII bằng ký tự thay thế (ví dụ: `***`) hoặc nhãn entity.

6.  **Syntax Analysis (Phân tích cú pháp)**:
    - Phân tích token hóa (tokenization) và các thành phần câu (Part of Speech - PoS) như danh từ, động từ, tính từ.

7.  **Events Detection**:
    - Trích xuất cấu trúc sự kiện từ tài liệu (ví dụ: phá sản, mua lại IPO).

### b. Topic Modeling (Mô hình hóa chủ đề)

- Phân tích một tập hợp lớn văn bản để tìm ra các chủ đề (topics) chung.
- **Chỉ hỗ trợ Asynchronous (Batch processing)**: Cần upload dữ liệu lên S3, chạy job, và nhận kết quả output về S3.

### c. Customization (Tùy chỉnh)

1.  **Custom Entity Recognition**: Huấn luyện mô hình để nhận diện các thực thể đặc thù (ví dụ: mã sản phẩm, thuật ngữ chuyên ngành).
2.  **Custom Classification**: Huấn luyện mô hình để phân loại văn bản theo nhãn riêng của bạn (ví dụ: Phân loại email thành Spam/Not Spam, hoặc Support/Sales).
    - Sử dụng **Comprehend Flywheel** để quản lý quy trình huấn luyện và versioning liên tục.

## 3. Amazon Comprehend Medical

Một biến thể riêng biệt dành cho y tế:

- **Detect PHI**: Phát hiện thông tin sức khỏe được bảo vệ (Protected Health Information).
- **Medical Entities**: Thuốc (Medication), bệnh lý (Medical Condition), liều lượng (Dosage), phương pháp điều trị (Treatment).
- **Ontology Linking**: Liên kết thực thể với mã chuẩn y tế (ICD-10-CM, RxNorm).

## 4. Cơ chế hoạt động (Modes of Operation)

### Synchronous (Real-time)

- Trả về kết quả ngay lập tức.
- Phù hợp cho ứng dụng tương tác người dùng, chatbot.
- Giới hạn: Kích thước văn bản nhỏ hơn (thường < 5KB per doc).

### Asynchronous (Batch Processing)

- Xử lý lượng lớn tài liệu lưu trong Amazon S3.
- Start Job -> Wait -> Get Results.
- Phù hợp cho phân tích lịch sử dữ liệu, daily logs.

## 5. Use Cases (Trường hợp sử dụng)

1.  **Voice of Customer (VOC)**:
    - Phân tích review khách hàng, support ticket, social media để hiểu cảm xúc và các vấn đề chính (topics).
    - Kết hợp: Kinesis Firehose -> S3 -> Comprehend -> QuickSight.

2.  **Intelligent Search (Tìm kiếm thông minh)**:
    - Sử dụng Entity Recognition và Key Phrases để đánh chỉ mục (index) tài liệu tốt hơn trong Amazon OpenSearch Service.

3.  **Knowledge Management**:
    - Topic Modeling giúp tổ chức hàng triệu tài liệu vào các nhóm chủ đề tự động.

4.  **Tự động hóa quy trình (Process Automation)**:
    - Phân loại email gửi đến (Custom Classification) để route đến đúng bộ phận (CSKH, Kế toán).

## 6. Security & Compliance

- **IAM**: Kiểm soát quyền truy cập.
- **KMS**: Mã hóa dữ liệu (Input/Output data in S3, Volume encryption cho jobs).
- **VPC Endpoint**: Truy cập qua PrivateLink mà không cần đi qua Internet công cộng.

## 7. Pricing (Định giá)

- **Pay-as-you-go**: Tính phí dựa trên số lượng "unit" văn bản được xử lý (1 unit = 100 kỹ tự).
- **Custom Models**: Tính phí thời gian training (per hour) và endpoint hosting (per second) cho real-time inference.
- **Free Tier**: 50K units sentiment analysis, 50K units entity recognition... trong 12 tháng đầu.

## 8. Exam Tips (Lưu ý thi SAA)

- Nếu đề bài nhắc đến **"NLP"**, **"sentiment analysis"**, **"extract entities"** -> Chọn **Comprehend**.
- Nếu cần xử lý **hồ sơ bệnh án**, tìm kiếm thuốc/bệnh -> Chọn **Comprehend Medical**.
- Nếu muốn tìm **chủ đề (topics)** từ hàng nghìn file trên S3 -> Chọn **Topic Modeling** (Async).
- Nếu cần che giấu thông tin cá nhân (**redact PII**) trong văn bản -> Dùng tính năng PII Detection của Comprehend.
- Phân biệt với **Textract**: Textract là OCR (hình ảnh -> văn bản). Comprehend là NLP (văn bản -> ý nghĩa). Thường kết hợp: Textract trích xuất text, sau đó Comprehend phân tích text đó.
