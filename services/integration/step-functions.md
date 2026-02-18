# AWS Step Functions

## 1. Tổng quan (Overview)

AWS Step Functions là dịch vụ điều phối (orchestration service) serverless, cho phép bạn kết hợp nhiều dịch vụ AWS thành các quy trình làm việc không máy chủ (serverless workflows).

- **State Machine**: Mô hình hóa quy trình nghiệp vụ dưới dạng biểu đồ trạng thái (Flowchart).
- **Visual Workflow**: Giao diện kéo thả trực quan để thiết kế quy trình.
- **Error Handling**: Tự động thử lại (Retry) khi lỗi và xử lý ngoại lệ (Catch) mà không cần viết code trong Lambda.

## 2. Các thành phần chính (Key Concepts)

### a. States (Trạng thái)

Một State Machine gồm nhiều bước (States):

1.  **Task State**: Thực hiện một công việc (gọi Lambda, chạy ECS Task, gọi API Gateway).
2.  **Choice State**: Rẽ nhánh dựa trên điều kiện (If-Else logic).
3.  **Parallel State**: Chạy nhiều nhánh song song.
4.  **Map State**: Lặp qua một danh sách (Array) và chạy task cho mỗi phần tử (Dynamic Parallelism).
5.  **Wait State**: Dừng workflow trong một khoảng thời gian (ví dụ: chờ 5 phút).
6.  **Fail/Succeed State**: Kết thúc workflow với trạng thái Lỗi hoặc Thành công.

### b. Standard vs Express Workflows

| Đặc điểm           | Standard Workflows                                                 | Express Workflows                              |
| :----------------- | :----------------------------------------------------------------- | :--------------------------------------------- |
| **Thời gian chạy** | Tối đa 1 năm (Long-running).                                       | Tối đa 5 phút (High-volume).                   |
| **Tốc độ**         | 2,000 executions/s.                                                | 100,000+ executions/s.                         |
| **Pricing**        | Tính theo số lần chuyên trạng thái (State Transition).             | Tính theo thời gian chạy + RAM (giống Lambda). |
| **History**        | Xem lịch sử thực thi từng bước trong Console (dễ debug).           | Chỉ log vào CloudWatch Logs (khó debug hơn).   |
| **Use Case**       | Quy trình phê duyệt (human approval), Order fulfillment (kéo dài). | Xử lý IoT data, Streaming data ingestion.      |

## 3. Features

### a. Error Handling (Retry & Catch)

- Định nghĩa logic retry ngay trong JSON ASL (Amazon States Language).
- _Ví dụ_: `Retry: [{ "ErrorEquals": ["Lambda.TooManyRequestsException"], "IntervalSeconds": 1, "MaxAttempts": 3, "BackoffRate": 2.0 }]`
- Giúp code Lambda gọn nhẹ hơn, không cần try/catch/sleep.

### b. Human Approval

- Tạm dừng workflow và chờ con người phê duyệt (gửi email có link "Approve/Reject").
- Khi con người click link -> Gửi Task Token về Step Functions để tiếp tục workflow.

## 4. Exam Tips (Lưu ý thi SAA)

- Nếu đề bài yêu cầu **điều phối (orchestrate)** nhiều Lambda functions hoặc microservices -> Chọn **Step Functions**.
- Nếu quy trình nghiệp vụ có **nhiều bước**, cần **retry logic**, hoặc **chờ đợi (wait)** -> Chọn **Step Functions**.
- Nếu cần quy trình **phê duyệt thủ công (Human in the loop)** -> Dùng Step Functions **Wait for Callback** pattern (Task Token).
- Phân biệt **Step Functions vs SWF (Simple Workflow Service)**:
  - **Step Functions**: Hiện đại, JSON-based, visual, serverless. Khuyên dùng cho hầu hết trường hợp.
  - **SWF**: Cũ, code-based (Java/Ruby), quản lý phức tạp hơn. Chỉ dùng khi cần can thiệp rất sâu vào child processes mà Step Functions không hỗ trợ.
- Nếu workflow chạy nhanh, số lượng lớn (IoT ingestion) -> Chọn **Express Workflows**.
