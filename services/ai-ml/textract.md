# Amazon Textract

## 1. Tổng quan (Overview)

Amazon Textract là dịch vụ máy học tự động trích xuất văn bản, chữ viết tay và dữ liệu từ các tài liệu được scan (quét). Nó vượt xa nhận dạng ký tự quang học (OCR) đơn giản để xác định, hiểu và trích xuất dữ liệu từ các biểu mẫu (forms) và bảng (tables).

- **Beyond Regular OCR**: Không chỉ nhận diện ký tự `A`, `B`, `C` mà còn hiểu cấu trúc tài liệu (đâu là tiêu đề, đâu là dòng, đâu là cột).
- **Fully Managed**: Không cần training model, chỉ cần gọi API.

## 2. Các tính năng chính (Key Features)

### a. Detect Document Text (Trích xuất văn bản thô)

- Nhận diện các dòng (lines) và từ (words) trong tài liệu.
- Hỗ trợ cả văn bản in và chữ viết tay (handwriting) tiếng Anh.
- Trả về tọa độ (bounding box) và độ tin cậy.

### b. Analyze Document (Phân tích tài liệu)

Đây là tính năng mạnh mẽ nhất, bao gồm:

1.  **Forms Extraction (Key-Value Pairs)**:
    - Tự động xác định các cặp khóa-giá trị trong biểu mẫu.
    - _Ví dụ_: Trong một form đăng ký, nó tìm thấy "Full Name: John Doe" -> Trả về Key: "Full Name", Value: "John Doe".
    - Giữ nguyên mối quan hệ này mà không cần template cố định.

2.  **Table Extraction (Trích xuất bảng)**:
    - Bảo toàn cấu trúc hàng và cột của bảng dữ liệu.
    - Trả về từng Cell, Row, Column, Span.
    - Rất hữu ích cho báo cáo tài chính, bảng lương.

3.  **Queries (Truy vấn tài liệu)**:
    - Cho phép bạn đặt câu hỏi bằng ngôn ngữ tự nhiên về tài liệu.
    - _Ví dụ_: Đưa vào hóa đơn và hỏi "What is the vendor name?" hoặc "Total amount due?". Textract sẽ tìm câu trả lời chính xác mà không cần biết cấu trúc cụ thể.

4.  **Signatures (Chữ ký)**:
    - Phát hiện xem chữ ký có tồn tại ở vị trí cần thiết hay không.
    - _Lưu ý_: Không xác minh chữ ký của ai, chỉ xác nhận là **có** chữ ký hay không.

5.  **Layout Analysis**:
    - Phân biệt các thành phần bố cục: Tiêu đề (Header), Chân trang (Footer), Số trang, Đoạn văn, List items.

### c. Specialized Analysis (Phân tích chuyên biệt)

1.  **Analyze Expense (Hóa đơn & Biên lai)**:
    - API chuyên dụng (`AnalyzeExpense`) cho hóa đơn bán lẻ và hóa đơn thương mại.
    - Trích xuất: Vendor Name, Total, Tax, Date, Line Items.

2.  **Analyze ID (Giấy tờ tùy thân)**:
    - API chuyên dụng (`AnalyzeID`) cho hộ chiếu Mỹ, bằng lái xe.
    - Trích xuất: Name, DOB, Issue Date, Expiry Date.

## 3. Cơ chế hoạt động (Modes of Operation)

### Synchronous API (Hình ảnh)

- `DetectDocumentText`, `AnalyzeDocument`: Gửi ảnh (JPEG/PNG) -> Nhận kết quả ngay.
- Dùng cho ứng dụng mobile chụp ảnh, xử lý từng trang đơn lẻ.

### Asynchronous API (PDF/Multipage TIFF)

- `StartDocumentTextDetection`, `StartDocumentAnalysis`: Gửi file PDF nhiều trang từ S3 -> Job ID -> Notification (SNS) -> Get Results (`GetDocumentAnalysis`).
- Hỗ trợ tài liệu lớn hàng nghìn trang.

## 4. Use Cases (Trường hợp sử dụng)

1.  **Automated Loan Processing (Xử lý khoản vay tự động)**:
    - Khách hàng upload đơn xin vay (Form), sao kê ngân hàng (Table), bảng lương.
    - Textract trích xuất dữ liệu -> Application logic tính toán khả năng trả nợ.

2.  **Invoice & Receipt Processing (Xử lý hóa đơn)**:
    - Chụp ảnh hóa đơn -> Textract Expense lấy thông tin -> Tự động nhập vào phần mềm kế toán (ERP).

3.  **Search Indexing (Tạo chỉ mục tìm kiếm)**:
    - Chuyển đổi kho lưu trữ tài liệu PDF scan (hình ảnh) thành văn bản để search engine (Amazon OpenSearch) có thể tìm kiếm nội dung bên trong.

4.  **Patient Intake (Y tế)**:
    - Số hóa các mẫu đơn bệnh nhân viết tay khi đến khám.

## 5. Security & Compliance

- **HIPAA Eligible**: Có thể dùng cho hồ sơ y tế.
- **VPC Endpoint**: Truy cập qua PrivateLink an toàn.
- **KMS**: Mã hóa dữ liệu output trên S3.

## 6. Pricing (Định giá)

- **Pay per page**: Tính phí trên mỗi trang tài liệu được xử lý.
- Mức giá khác nhau cho từng tính năng (Text only < Forms < Tables < Queries).
- **Free Tier**: 1000 trang/tháng trong 3 tháng đầu.

## 7. Exam Tips (Lưu ý thi SAA)

- Nếu đề bài yêu cầu trích xuất **văn bản từ tài liệu scan**, **PDF**, **hình ảnh** -> Chọn **Textract**.
- Nếu đề bài yêu cầu trích xuất dữ liệu từ **biểu mẫu (forms)** hoặc **bảng (tables)** và bảo toàn cấu trúc -> Chọn **Textract**.
- Nếu đề bài yêu cầu trích xuất **Key-Value pairs** -> Chọn **Textract**.
- Nếu đề bài yêu cầu nhận diện **chữ viết tay (handwriting)** -> Chọn **Textract**.
- Phân biệt với **Rekognition**: Rekognition trích xuất text ngắn trong ảnh tự nhiên (biển báo). Textract chuyên cho tài liệu văn bản mật độ cao.
- Kết hợp: **Textract** (OCR) -> **Comprehend** (NLP) -> **Elasticsearch/OpenSearch** (Search) là pattern phổ biến cho xử lý tài liệu thông minh (IDP).
- Nếu muốn tìm thông tin cụ thể (ví dụ: "Số chứng minh thư là gì?") từ tài liệu không có cấu trúc cố định -> Dùng tính năng **Queries**.
