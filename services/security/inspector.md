# Amazon Inspector

## 1. Tổng quan (Overview)

Amazon Inspector là dịch vụ quản lý lỗ hổng (Vulnerability Management) tự động, giúp quét (scan) các workload AWS để tìm ra các lỗ hổng phần mềm và phơi nhiễm mạng ngoài ý muốn.

- **Continuous Scanning**: Tự động quét lại khi có thay đổi (ví dụ: cài package mới, deploy code mới).
- **Risk Score**: Chấm điểm rủi ro dựa trên mức độ nghiêm trọng của lỗ hổng (CVE - Common Vulnerabilities and Exposures).

## 2. Các loại quét (Scan Types)

### a. EC2 Scanning

- Cần cài đặt **SSM Agent**.
- Inspector quét hệ điều hành và các phần mềm cài đặt để tìm lỗ hổng (ví dụ: CVE-2021-44228 Log4j).

### b. ECR Container Image Scanning

- Quét các Docker image nằm trong Amazon Elastic Container Registry (ECR).
- Tự động quét khi push image mới (Continuous Scan) hoặc quét lại (Retest) khi database CVE cập nhật.

### c. Lambda Function Scanning

- Quét code trong Lambda function và các layer phụ thuộc (dependencies) để tìm lỗ hổng bảo mật (ví dụ: thư viện `requests` cũ bị lỗi).

### d. Network Reachability

- Phân tích cấu hình mạng (Security Group, NACL, IGW) để xem EC2 instance có bị **mở port ra Internet** một cách không an toàn hay không (ví dụ: Port 22 SSH open to 0.0.0.0/0).
- Không cần Agent.

## 3. Inspector vs GuardDuty

| Đặc điểm      | Amazon Inspector                                 | Amazon GuardDuty                                      |
| :------------ | :----------------------------------------------- | :---------------------------------------------------- |
| **Mục đích**  | Tìm **Lỗ hổng** (Vulnerability Assessment).      | Tìm **Mối đe dọa** (Threat Detection).                |
| **Thời điểm** | Trước khi bị tấn công (Phòng ngừa).              | Khi đang/đã bị tấn công (Phát hiện).                  |
| **Câu hỏi**   | "Server của tôi có cài phần mềm lỗi thời không?" | "Có hacker nào đang bruteforce SSH vào server không?" |

## 4. Exam Tips (Lưu ý thi SAA)

- Nếu đề bài yêu cầu **đánh giá lỗ hổng (Vulnerability Assessment)** trên EC2, ECR, Lambda -> Chọn **Inspector**.
- Nếu đề bài yêu cầu kiểm tra xem EC2 có bị **phơi nhiễm mạng (Network Exposure)** không mong muốn -> Chọn **Inspector Network Reachability**.
- Inspector cần **SSM Agent** để quét sâu bên trong OS (Package vulnerability).
- Kết quả scan của Inspector được gửi về **AWS Security Hub** để quản lý tập trung.
