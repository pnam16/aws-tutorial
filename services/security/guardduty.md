# Amazon GuardDuty

## 1. Tổng quan (Overview)

Amazon GuardDuty là dịch vụ phát hiện mối đe dọa (Threat Detection) thông minh, giúp bảo vệ tài khoản, workload và dữ liệu AWS của bạn.

- **Machine Learning**: Sử dụng học máy để phát hiện các hành vi bất thường.
- **Integrated Threat Intelligence**: Tích hợp thông tin tình báo mối đe dọa từ AWS Security và các đối tác (CrowdStrike, Proofpoint).
- **Serverless**: Không cần cài đặt agent hay sensor. Bật lên là chạy.

## 2. Nguồn dữ liệu (Data Sources)

GuardDuty phân tích log từ các nguồn sau (bạn không cần bật logging để GuardDuty hoạt động, nó đọc trực tiếp từ backend AWS):

1.  **CloudTrail Management Events**: Ai đang làm gì trong tài khoản? (ví dụ: tạo user, tắt logging).
2.  **VPC Flow Logs**: Ai đang kết nối với ai? (ví dụ: IP lạ từ Triều Tiên connect port 22).
3.  **DNS Logs**: Domain nào đang được truy cập? (ví dụ: malware connect về C&C server `evil.com`).
4.  **S3 Data Events**: Ai đang đọc dữ liệu nhạy cảm?
5.  **EKS Audit Logs**: Ai đang chạy lệnh `kubectl` gì?
6.  **RDS Login Activity**: Brute force attack vào DB?

## 3. Findings (Phát hiện)

- Khi phát hiện mối đe dọa, GuardDuty tạo ra một **Finding**.
- Mức độ: Low, Medium, High.
- _Ví dụ_: `EC2 instance i-123 is querying a domain name associated with Bitcoin mining.`
- **Automated Response**: GuardDuty -> EventBridge -> Lambda (Tự động cách ly instance, block IP).

## 4. Exam Tips (Lưu ý thi SAA)

- Nếu đề bài yêu cầu **phát hiện mối đe dọa (Threat Detection)**, **hành vi bất thường (Anomaly/Malicious)**, **Cryptocurrency Mining** -> Chọn **GuardDuty**.
- GuardDuty **không chặn** tấn công. Nó chỉ **phát hiện và cảnh báo**. (Muốn chặn phải kết hợp với WAF/Shield/Lambda).
- Để bật GuardDuty cho **toàn bộ Organization** -> Sử dụng **Delegated Administrator** ở Master Account.
- Không cần cài **Agent** cho GuardDuty (nó phân tích log metadata).
