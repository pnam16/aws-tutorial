# AWS Application Migration Service (MGN) & Server Migration Service (SMS)

## 1. Tổng quan (Overview)

**AWS Application Migration Service (MGN)** là dịch vụ chính được khuyến nghị để di chuyển (Lift-and-shift) các máy chủ on-premise (Physical, Virtual, hoặc Cloud khác) lên AWS.

- **Replaces AWS SMS**: AWS MGN là thế hệ mới, thay thế cho AWS Server Migration Service (SMS - đã cũ).
- **Block-Level Replication**: Sao chép dữ liệu ở cấp độ block ổ đĩa liên tục, không làm gián đoạn ứng dụng đang chạy.

## 2. Quy trình hoạt động (MGN Workflow)

1.  **Install Agent**: Cài đặt **AWS Replication Agent** lên máy chủ nguồn (Source Server).
2.  **Continuous Replication**: Agent bắt đầu sao chép block dữ liệu về AWS (vào một Staging Area nhẹ, rẻ tiền).
3.  **Launch Test Instances**: Khi cần test, bạn có thể launch các máy chủ EC2 từ dữ liệu đã replicate (Non-disruptive testing).
4.  **Cutover**: Khi sẵn sàng, thực hiện chuyển đổi chính thức. MGN sẽ launch các EC2 instance production và chuyển hướng traffic. Downtime rất ngắn (phút).

## 3. AWS Server Migration Service (SMS) - _Legacy_

- Dịch vụ cũ, dựa trên snapshot (Incremental replication).
- Chỉ hỗ trợ **VMware vSphere**, **Hyper-V** và **Azure VMs**. (Không hỗ trợ máy vật lý physical servers như MGN).
- Tạo ra **AMI (Amazon Machine Image)** sau mỗi lần replication.
- _Lưu ý_: Trong bài thi SAA mới, ưu tiên chọn **MGN** (Application Migration Service) thay vì SMS.

## 4. Exam Tips (Lưu ý thi SAA)

- Nếu đề bài yêu cầu di chuyển **Lift-and-shift** hàng loạt máy chủ lên AWS với **downtime tối thiểu** -> Chọn **AWS MGN**.
- MGN hỗ trợ đa dạng nguồn: Physical, VMware, Hyper-V, Azure, GCP, AWS (Region khác).
- MGN sử dụng cơ chế **Continuous Data Replication** (Block-level).
- SMS sử dụng cơ chế **Snapshot-based** (chậm hơn, RPO cao hơn) và tạo ra **AMI**.
- Để chuyển đổi server thành AMI tự động -> MGN/SMS đều làm được, nhưng MGN hiện đại hơn.
