# Amazon MQ

## 1. Tổng quan (Overview)

Amazon MQ là dịch vụ hàng đợi tin nhắn được quản lý (Managed Message Broker) dành cho **Apache ActiveMQ** và **RabbitMQ**.

- **Mục đích**: Giúp di chuyển (migrate) các ứng dụng hiện có đang dùng ActiveMQ/RabbitMQ lên đám mây **mà không cần viết lại code** (re-platforming).
- **Giao thức**: Hỗ trợ các giao thức chuẩn công nghiệp: JMS, NMS, AMQP, STOMP, MQTT, WebSocket.

## 2. Amazon MQ vs Amazon SQS/SNS

| Đặc điểm       | Amazon MQ                                                | Amazon SQS / SNS                              |
| :------------- | :------------------------------------------------------- | :-------------------------------------------- |
| **Mục đích**   | Migration (Re-platforming).                              | Cloud-native Integration (New Apps).          |
| **Giao thức**  | Standard (JMS, AMQP, MQTT...).                           | Proprietary (AWS API/SDK: `sqs:SendMessage`). |
| **Scaling**    | Vertical (Tăng size broker instance). Khó scale cực lớn. | Horizontal (Vô hạn).                          |
| **Serverless** | Không (Chạy trên Instance, trả tiền theo giờ).           | Có (Trả tiền theo request).                   |
| **Tính năng**  | Complex routing, durable subscriptions, transactions.    | Decoupling, fan-out, simple queuing.          |

## 3. Deployment Modes

1.  **Single-instance broker**:
    - 1 Instance duy nhất.
    - Dùng cho Development hoặc Test.
    - Nếu instance chết -> Mất kết nối.

2.  **Active/Standby broker for High Availability**:
    - 2 Instances ở 2 AZs khác nhau.
    - Share chung lưu trữ (Amazon EFS cho ActiveMQ).
    - Nếu Active chết -> Standby lên thay (Failover). Client tự động reconnect.

3.  **Network of Brokers**:
    - Nhiều broker kết nối với nhau để mở rộng khả năng xử lý (Scaling) và tăng tính sẵn sàng.

## 4. Exam Tips (Lưu ý thi SAA)

- Nếu đề bài yêu cầu **di chuyển ứng dụng dùng ActiveMQ/RabbitMQ** lên AWS mà **không muốn viết lại code** -> Chọn **Amazon MQ**.
- Nếu đề bài nói về **Cloud-native microservices**, cần scale vô hạn -> Chọn **SQS/SNS**.
- Nếu ứng dụng cần dùng giao thức **MQTT** hoặc **AMQP** chuẩn -> Chọn **Amazon MQ**. (IoT Core cũng hỗ trợ MQTT nhưng là serverless cho IoT).
- Để **High Availability** cho Amazon MQ -> Chọn mô hình **Active/Standby** broker (Multi-AZ).
