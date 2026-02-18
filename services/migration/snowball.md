# AWS Snow Family

## 1. Tổng quan (Overview)

AWS Snow Family là tập hợp các thiết bị vật lý giúp di chuyển lượng dữ liệu khổng lồ (TB đến PB) vào và ra khỏi AWS **mà không cần dùng mạng Internet** (Offline migration). Ngoài ra còn cung cấp khả năng tính toán tại biên (Edge Computing).

## 2. Các thiết bị (Devices)

### a. AWS Snowcone

- **Dung lượng**: Nhỏ nhất (8 TB, 14 TB).
- **Đặc điểm**: Nhỏ gọn, di động, bền bỉ (chịu va đập), chạy bằng pin.
- _Use Case_: Xe cứu thương, balo người lính, IoT field gateway, di chuyển dữ liệu nhỏ (vài TB).
- Có thể gửi dữ liệu về AWS qua mạng (dùng DataSync cài sẵn) hoặc ship thiết bị.

### b. AWS Snowball Edge

- **Storage Optimized**: 80 TB (khả dụng). Dành cho di chuyển dữ liệu lớn.
- **Compute Optimized**: 42 TB + vCPU/RAM mạnh + GPU. Dành cho xử lý dữ liệu tại biên (Machine Learning, Video analysis) trước khi gửi về AWS.
- _Use Case_: Migration quy mô lớn (Data center migration), Remote locations (tàu biển, giàn khoan).

### c. AWS Snowmobile

- **Dung lượng**: Xe container 45-foot, chứa tới **100 PB** (Petabytes).
- _Use Case_: Di chuyển toàn bộ Data Center của tập đoàn lớn (Exabytes data).

## 3. Quy trình (Workflow)

1.  **Request**: Đặt hàng thiết bị qua AWS Console.
2.  **Receive**: Nhận thiết bị tại DC của bạn.
3.  **Connect**: Cắm vào mạng LAN, dùng Snowball Client/S3 Adapter để copy dữ liệu vào thiết bị.
4.  **Ship back**: Gửi trả thiết bị về AWS (màn hình E-ink tự động hiện địa chỉ AWS).
5.  **Ingest**: AWS copy dữ liệu từ thiết bị vào S3 Bucket của bạn. Wipe (xóa trắng) thiết bị theo chuẩn NIST.

## 4. Edge Computing

- Snowball Edge cho phép chạy **EC2 instances** và **Lambda functions** trực tiếp trên thiết bị (không cần kết nối Internet về AWS).
- Dùng để xử lý dữ liệu thô (Raw data) tại chỗ (Local processing) trước khi gửi về cloud.

## 5. Exam Tips (Lưu ý thi SAA)

- Nếu đề bài yêu cầu di chuyển **lượng lớn dữ liệu (TB/PB)** và mạng Internet **chậm/không ổn định/đắt đỏ** -> Chọn **Snowball Edge**.
- Nếu dữ liệu lên tới **Exabytes (EB)** -> Chọn **Snowmobile**.
- Nếu cần **tính toán/xử lý dữ liệu** tại nơi hẻo lánh (không có internet) -> Chọn **Snowball Edge Compute Optimized**.
- Không được dùng Snow Family để di chuyển dữ liệu **nhỏ (GB)** và mạng nhanh -> Dùng **S3 Transfer Acceleration** hoặc **DataSync** hoặc **VPN** sẽ nhanh và tiện hơn.
- Dữ liệu trong Snowball luôn được **mã hóa (Encrypted)** bằng KMS (256-bit keys).
