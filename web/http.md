### 为什么有了 ip 还需要 mac 地址

1. 根本：历史上数据链路层出现在网络层之前，存在数据链路层（二层）异构问题，引入网络层（三层）可统一上层封装，方便进行路由选择和分组转发等
2. ip 是逻辑地址，相当于通讯地址；mac 地址相当于身份证号；ip 引入分层结构，便于分层切换实现，也能提高查找效率，且支持子网划分
3. mac 地址太偏平，存储查询都是问题，不如网状分布式稳定，也不能实现子网划分，进行分组分区域管理和其他操作

### http2 主要特点

1. 二进制分帧，基于 TLS 层和应用层之间，将请求拆分成有流 ID 标记的二进制帧，而不是 http1.* 那种基于完整请求响应的方式，采用二进制内容，不用排队等待，便于多路复用
2. 多路复用：一个链接，所有请求和响应交织在一起，二进制分帧层进行组装交付 —— 基本解决 http 队头阻塞问题
3. 头部压缩：HPACK 算法进行传输，双方在动态表和静态表维护头部信息，重复的只传递头部编码，且采用了哈夫曼编码等优化方式
4. 优先级调整：可以设置优先级，避免低优先级限制了整体加载进度
5. 流量控制：基于流的流量控制，具体不详- -
6. 服务端推送等
7. 问题：基于 tpc 链接，握手慢 —— http3 QUIC 基于 UDP，有更好的链接时延表现

### Socket 是什么

1. Socket 是应用层与 TCP/IP 协议簇通信的中间抽象层，是一组接口（并不是协议）。Socket 作为门面将复杂的协议封装隐藏在接口内部，用户调用对应接口即可实现通信
2. 工作原理：初始化`socket()`, 绑定端口`bind()`并监听端口`listen()`，然后`accept()`表示准备完毕，阻塞等待客户端连接。客户端`connect()`连接之后，双方通过`write()`和`read()`进行消息收发，客户端收到消息后`close()`关闭连接； read 读取 read buffer 内容；write 读取 write buffer
3. 请求对象和响应对象都是序列化成字节交给 socket 进行发送，然后到接收端反序列化
4. 可分为长连接和短链接，长连接安全性差，消耗更多资源；http 等使用短连接

### http 跟 websocket 区别 [参考](https://www.geeksforgeeks.org/what-is-web-socket-and-how-it-is-different-from-the-http/)

1. 两者都是 client/server 模式下的通信协议，均基于 TCP 连接
2. http(s)
  
    - 单向的，client 发送请求， server 响应，一一对应
    - 响应发送完毕，连接关闭，所以是无状态协议（keep-alive 不改变根本）
    - 基于 TCP 三次握手建立连接以及丢包重传等机制
    - 消息都是使用 ASCII 编码（就是文本），包含 http 协议版本、http 方法、http 头部和 http 请求体等内容，通常是 700-800 字节范围

3. websocket

    - 全双工有状态协议，连接一旦建立需要主动关闭，且关闭之后双方都不能使用
    - 多应用在实时、游戏和聊天应用中；如果数据请求不频繁，建议使用 http，websocket 链接服务端压力大
    - 协议 ws:// 或者 wss://
    - 状态码 101 表示协议升级，响应头 Upgrade 告诉客户端服务端协议已升级

        ```
        HTTP/1.1 101 Switching Protocols
        Upgrade: websocket 
        Connection: Upgrade
        ```

### WebSocket 是如何建立的 [参考](https://developer.mozilla.org/en-US/docs/Web/HTTP/Protocol_upgrade_mechanism#)

1. HTTP/1.1 协议开始提供了一种使用 `Upgrade` 头部将已建立连接进行协议更换的方式；该机制是可选的，也就是实现方明知道可以升级而可以不采取升级方式；HTTP2 不允许这种协议升级方式
2.  HTTP/1.1 下的协议转换方式：

    1.  客户端发送请求携带对应头部信息，如：

        ```
        GET /index.html HTTP/1.1
        Host: www.example.com
        Connection: upgrade
        Upgrade: example/1, foo/2
        ```

        Upgrade 是一种 hop-by-hop 头，涉及到中间节点存储转发，所以需要 Connection 头部也写明，[参考](https://en.wikipedia.org/wiki/Hop-by-hop_transport)；可能还有额外请求头来配置 WebSocket 

    2. 服务器端收到该请求，决定是否升级协议：如果不升级，忽略 `Upgrade` 请求头，返回普通响应（如 200 OK）；否则，响应 `101 Switching Protocols`，有些协议升级还需要额外必要的握手信息；101 响应发送之后，标志着升级完成，该连接会变成一个双向管道，发起 upgrade 的请求会在新协议下完成

    3. 示例代码：

        ```javascript
        const webSocket = new WebSocket('wss://a.b.com')
        // WebSocket API 帮你完成建立连接及升级协议过程
        // 如果手动升级协议，需要发送 Connection 和 Upgrade 头部
        ```


3. 测试网站：[https://www.websocket.org/echo.html](https://www.websocket.org/echo.html)，可以在 network 查看具体请求头响应头，体验发送消息过程


### HTTP2 如何建立 WebSocket（TODO -_-||)

1. 参考[rfc-8441](https://tools.ietf.org/html/rfc8441)，重点参考第 5 点，[medium](https://medium.com/@pgjones/http-2-websockets-81ae3aab36dd)
2. WebSocket 本身没变，只是 HTTP 协议变更导致如何建立 WebSocket 连接变化
3. 由于 HTTP2 双工的特性，不再需要 HTTP/1.1 下用于建立连接的 `Upgrade Connection` 及 `101 Switching Protocols` 等握手内容
4. （此条非精确，待细究）HTTP2 采用扩展 CONNECT 请求的方式（必须包含伪头部 :protocol = websocket 等）。基于多路复用特性，不再占用单独 TCP 连接，而是包装为所谓的 Tunneled Stream（暂译：隧道流）进行 WebSocket 通信