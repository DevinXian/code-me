1. RPC 是远程调用，跟 HTTP 不是一个层面的东西，后者是通用传输协议簇；RPC 当然也可以选择 HTTP 传输，但更多是在 TCP/IP 之上自定义协议，私有特性明显
2. RPC 主要是为了提高通信效率，常见的有：Dubbo、gRPC、Thrift 等
3. 可同步可异步
4. 策略要点：重试、LB、路由、高可用、流量控制等
5. 使用需要因地制宜，大公司采用私有协议较多