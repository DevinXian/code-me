### cluster 监听实现

1. worker 进程监听函数 hack 重写，使之不再承担原有功能
2. master 监听端口之后，从 worker 中按策略选取，发送对应的消息和句柄，worker 实现对应业务处理。

参考：[Cluster实现](https://cnodejs.org/topic/56e84480833b7c8a0492e20c)