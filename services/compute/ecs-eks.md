# Amazon ECS & Amazon EKS

## 1. Tổng quan (Overview)

Hai dịch vụ quản lý container (Container Orchestration) chính của AWS:

- **Amazon ECS (Elastic Container Service)**: Dịch vụ độc quyền của AWS, tích hợp sâu, dễ sử dụng.
- **Amazon EKS (Elastic Kubernetes Service)**: Dịch vụ quản lý Kubernetes (K8s) chuẩn công nghiệp, mã nguồn mở.

Cả hai đều giúp bạn chạy, quản lý và mở rộng các ứng dụng đóng gói trong container (Docker).

## 2. Amazon ECS

### a. Các thành phần chính

1.  **Cluster**: Nhóm logic chứa các tài nguyên chạy container (EC2 instances hoặc Fargate).
2.  **Task Definition**: Bản thiết kế (blueprint) cho container (giống `docker-compose.yml`). Định nghĩa Image, CPU, Memory, Port mappings, Environment Variables.
3.  **Task**: Một instance đang chạy của Task Definition.
4.  **Service**: Đảm bảo luôn có một số lượng Task nhất định đang chạy (Replica). Tích hợp với Load Balancer để phân phối traffic tới các Task.

### b. Launch Types (Kiểu chạy)

- **EC2 Launch Type**: Bạn quản lý các EC2 instances trong cluster. Cần patch OS, scale instances. Giá rẻ hơn nếu tận dụng tốt resource.
- **Fargate Launch Type**: Serverless. Bạn không quản lý EC2. Chỉ định CPU/RAM cho Task và chạy. AWS lo hạ tầng.

### c. ECS Agent

- Chạy trên mỗi EC2 instance trong cluster. Kết nối instance với ECS control plane.

## 3. Amazon EKS

### a. Tổng quan

- Chạy Kubernetes control plane (Master nodes) được quản lý bởi AWS (bạn không thấy master nodes).
- Bạn quản lý Worker nodes (EC2) hoặc dùng Fargate profile.
- Tương thích hoàn toàn với các công cụ K8s chuẩn: `kubectl`, Helm charts.

### b. Các thành phần chính

1.  **Control Plane**: AWS quản lý, HA qua 3 AZs.
2.  **Worker Nodes**: Nơi chạy các Pods (container). Có thể là Managed Node Group (AWS quản lý việc update/patching EC2) hoặc Self-managed.
3.  **Fargate Profile**: Cho phép chạy Pods trên Fargate (Serverless K8s).

### c. EKS Distro & EKS Anywhere

- **EKS Distro**: Bản phân phối K8s của AWS để bạn tự cài trên on-premise.
- **EKS Anywhere**: Giúp tạo cluster EKS trên cơ sở hạ tầng của riêng bạn (VMware vSphere, Bare metal).

## 4. So sánh ECS vs EKS

| Đặc điểm                  | Amazon ECS                                             | Amazon EKS                                                      |
| :------------------------ | :----------------------------------------------------- | :-------------------------------------------------------------- |
| **Độ phức tạp**           | Thấp. Dễ học, dễ setup.                                | Cao. Cần kiến thức K8s chuyên sâu.                              |
| **Tính linh hoạt**        | Tích hợp chặt chẽ với AWS (ALB, IAM). Ít tùy biến sâu. | Rất cao. Cộng đồng lớn, nhiều plugins (CNCF).                   |
| **Di động (Portability)** | Khó mang đi đâu khác (AWS specific).                   | Dễ dàng di chuyển sang Azure/GCP/On-prem (Kubernetes standard). |
| **Giá (Control Plane)**   | Miễn phí (chỉ trả tiền resource chạy container).       | $0.10/giờ cho mỗi cluster (~$72/tháng).                         |

## 5. Exam Tips (Lưu ý thi SAA)

- Nếu đề bài yêu cầu chạy container **đơn giản**, tích hợp tốt nhất với AWS services, không cần quản lý phức tạp -> Chọn **ECS**.
- Nếu công ty đã có hệ thống **Kubernetes** on-premise và muốn di chuyển lên AWS mà không sửa đổi quy trình, công cụ (Helm, kubectl) -> Chọn **EKS**.
- Nếu muốn chạy container mà **không muốn quản lý server/EC2** (Serverless containers) -> Chọn **Fargate** (cho cả ECS và EKS).
- Để truy cập các dịch vụ AWS form container an toàn -> Sử dụng **IAM Roles for Tasks** (ECS) hoặc **IAM Roles for Service Accounts** (IRSA - EKS). Đừng gán quyền cho EC2 instance role (quá rộng).
- ECS hỗ trợ **Dynamic Port Mapping** với ALB -> Cho phép chạy nhiều task cùng port trên cùng 1 instance.
