### webpack federation

1. 代码复用问题：npm 包公用，升级版本，需要各方手动去更新版本
2. 应用集逻辑复用的解决方案

  1. Remote 模块提供者，container，通过 exposes 暴露出对应的模块、组件
  2. Host 模块使用者，通过 remote 指定需要的远程模块地址

源码分析参考：https://juejin.cn/post/7048125682861703181