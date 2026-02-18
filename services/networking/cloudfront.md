# Amazon CloudFront

## 1. Tổng quan (Overview)

Amazon CloudFront là mạng phân phối nội dung (CDN - Content Delivery Network) toàn cầu giúp phân phối dữ liệu, video, ứng dụng và API đến người xem với độ trễ thấp và tốc độ truyền cao.

- **Edge Locations**: Hàng trăm điểm hiện diện (PoP) trên toàn cầu, nằm gần người dùng nhất.
- **Caching**: Lưu bản sao nội dung tại Edge. Người dùng truy cập Edge -> Nhanh hơn truy cập Origin gốc.

## 2. Các thành phần chính (Key Components)

### a. Origins

- Nguồn dữ liệu gốc. Hỗ trợ:
  - **S3 Bucket**: Phân phối file tĩnh, ảnh, video.
  - **Custom Origin (HTTP)**: EC2, ELB, hoặc server On-premise.
  - **MediaStore / MediaPackage**: Video streaming.

### b. S3 Origin Access Identity (OAI) & Origin Access Control (OAC)

- **Vấn đề**: Người dùng có thể bypass CloudFront và truy cập thẳng vào S3 url -> Mất tốn phí S3 request hoặc xem nội dung trả tiền miễn phí.
- **Giải pháp**:
  - Tạo **OAI/OAC** trong CloudFront.
  - Cập nhật **S3 Bucket Policy**: Chỉ cho phép OAI/OAC đọc bucket. Block tất cả truy cập khác.
  - _OAC_ là phiên bản mới hơn, hỗ trợ tốt hơn (SSE-KMS, region khác nhau).

### c. Signed URLs & Signed Cookies

- Dùng để phân phối nội dung riêng tư (Private Content / Premium Content) mà người dùng phải trả tiền hoặc đăng nhập mới xem được.
- **Signed URL**: Dùng cho từng file riêng lẻ (ví dụ: link tải ebook).
- **Signed Cookie**: Dùng cho truy cập nhiều file (ví dụ: xem toàn bộ website phim premium).

## 3. Advanced Features

### a. Geo Restriction (Geoblocking)

- Cho phép hoặc chặn người dùng từ các quốc gia cụ thể (dựa trên IP).
- _Ví dụ_: Chỉ cho phép IP Việt Nam xem video bản quyền.

### b. Edge Functions

- Chạy code ngay tại biên (Edge) để tùy biến request/response.
  1.  **CloudFront Functions**: Viết bằng JavaScript, chạy siêu nhanh (sub-millisecond), scale cực lớn. Dùng cho thao tác header đơn giản, URL rewrite, redirect.
  2.  **Lambda@Edge**: Viết bằng Node.js/Python, mạnh hơn (access network, filesystem). Dùng cho authentication, logic phức tạp, A/B testing, resize ảnh on-the-fly.

### c. Price Classes

- **Price Class All**: Dùng tất cả Edge location (Tốt nhất nhưng đắt nhất).
- **Price Class 200**: Loại bỏ các nước đắt đỏ (Nam Mỹ, Úc).
- **Price Class 100**: Chỉ dùng US, Canada, Europe (Rẻ nhất).

## 4. Exam Tips (Lưu ý thi SAA)

- Nếu đề bài yêu cầu **bảo vệ S3 Bucket**, bắt buộc user phải qua CloudFront -> Dùng **OAI** hoặc **OAC** với Bucket Policy.
- Nếu muốn phân phối nội dung **cho người dùng trả phí** (Premium) -> Dùng **Signed URLs / Signed Cookies**.
- Phân biệt **S3 Pre-signed URL** vs **CloudFront Signed URL**:
  - **S3 Pre-signed URL**: Cho phép upload/download trực tiếp từ S3 (thường dùng cho **Upload**).
  - **CloudFront Signed URL**: Cho phép truy cập nội dung đã cache qua CDN (thường dùng cho **Download/Streaming** global).
- Để tăng tốc độ **upload** toàn cầu -> Dùng **S3 Transfer Acceleration** (dùng mạng CloudFront để đẩy về S3).
- Để chặn tấn công DDoS tại biên -> CloudFront tích hợp mặc định với **AWS Shield Standard** và có thể bật **AWS WAF**.
