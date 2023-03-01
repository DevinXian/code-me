## TCP

1. IP 和 TCP 首部通常是 20 字节（忽略可选部分），TCP 首部最多 60 字节
2. TCP 是全双工的，双端各自维护传输数据序列号
3. 标志位 URG ACK PSH RST SYN FIN 后三个常用
4. MTU 最大传输包大小 = MSS 最大报文段长度 + IP 首部 + TCP 首部
5. 4 次挥手
   主动方 FIN_WAIT1 -> FIN_WAIT2(收到 ACK) -> TIME_AWAIT（等待 2MSL，避免被动关闭重传 FIN）
   被动方 CLOSE_WAIT -> (发送 ACK 后) -> LAST_ACK -> CLOSED(如果最后的 ACK 没收到，可能会重传，所以主动方需要等待 2MSL 防止最后 ACK 丢失)

6. HTTP2 解决了引用层的队头阻塞（Head of line blocking)，但是无法解决 TCP 队头阻塞；多个请求公用同一个 TCP 连接，多路复用并行特性对 TCP 的丢包恢复机制不可见，所以一个丢失或者失序会导致所有请求收到影响 -> 高丢包，HTTP/1.1 反而表现更好
7. HTTP3 采用新的协议来替代 TCP，每个流都是独立的，彼此互不影响，所以不存在队头阻塞问题（QUIC UDP）
