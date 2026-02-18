# AWS Migration Hub & Application Discovery Service

## 1. AWS Local Discovery (Application Discovery Service - ADS)

**Mục đích**: Thu thập thông tin về danh mục phần cứng (Server configuration), mức sử dụng hiệu năng (Performance utilization) và sự phụ thuộc mạng (Network dependencies) của các máy chủ on-premise của bạn.

### a. Các phương thức thu thập

1.  **Agentless Discovery Connector**:
    - Không cần cài agent lên từng máy chủ.
    - Dùng cho môi trường **VMware vCenter**.
    - Thu thập thông tin tổng quan (CPU, RAM, Disk allocation) nhưng **không** biết chi tiết process hay network connection bên trong OS.
2.  **Discovery Agent**:
    - Cài agent lên từng máy chủ vật lý hoặc máy ảo (Linux/Windows).
    - Thu thập thông tin chi tiết nhất (Processes đang chạy, Inbound/Outbound connections, Performance chính xác theo thời gian thực).

### b. Data Usage

- Dữ liệu thu thập được gửi về **AWS Migration Hub**.
- Giúp bạn lên kế hoạch di chuyển (Migration Planning), estimte chi phí (TCO analysis).

## 2. AWS Migration Hub

**Mục đích**: Nơi tập trung (Central place) để theo dõi tiến độ di chuyển ứng dụng lên AWS từ nhiều công cụ khác nhau (AWS DMS, SMS/MGN, Partner tools).

- **Dashboard**: Xem trạng thái của tất cả các migration tasks (đang chạy, lỗi, hoàn thành) ở một nơi duy nhất.
- **Application Grouping**: Gom nhóm các server liên quan thành một "Application" để track chung.
- **Refactor Spaces**: Tính năng mới giúp chuyển đổi dần dần (Incremental Refactoring) ứng dụng monolithic sang microservices (dùng Strangler Fig pattern).

## 3. Exam Tips (Lưu ý thi SAA)

- Nếu đề bài yêu cầu **lập kế hoạch di chuyển**, cần biết server on-premise nào nói chuyện với server nào (dependencies) -> Chọn **Application Discovery Service (Agent-based)**.
- Nếu muốn **ước tính chi phí (TCO)** khi di chuyển lên AWS dựa trên cấu hình hiện tại -> Dùng dữ liệu từ **ADS** kết hợp với **Migration Hub**.
- Để **theo dõi tiến độ** của nhiều dự án migration cùng lúc, từ nhiều tool khác nhau -> Chọn **Migration Hub**.
- **Agentless** chỉ dùng cho VMware và thông tin cơ bản. **Agent-based** dùng cho mọi môi trường và thông tin chi tiết.
