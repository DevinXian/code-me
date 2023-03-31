### [How Blink Works](https://docs.google.com/document/d/1aitSOucL0VHZa9Z2vbRJSyAIsAz24kX8LFByQ5xQnUg/edit#)

1. renderer 进程和 iframes tabs 并不是 1:1，因为可能开很多 tab, RAM 也有限
2. renderer 进程包含线程：

  1. 主线程：JS/DOM/CSS/style and layout 计算
  2. N个 worker 线程： Web Workers/ServiceWorker/Worklets
  3. 若干内部线程： webaudio/database/GC 等
  4. 除非必要的性能追求，一般不推荐不使用 Shared memory

### [Multi-process Architecture](https://www.chromium.org/developers/design-documents/multi-process-architecture/)

1. 渲染进程不可能保证绝对安全和不崩溃，所以需要更鲁棒性的设计
2. 进程：Browser 进程（主进程，）、渲染进程、插件进程、GPU进程、网络、存储、音频服务、V8代理解析器等
3. Browser 进程管理其他进程，进程

### 渲染流程

[inside-browser](https://developer.chrome.com/blog/inside-browser-part3/)

1. HTML -> DOM Tree + CSSOM -> Render Tree -> Render Layer （-> Composite Layer 可选） -> Painting -> Display

2. 单独图层情形：

  1. 拥有 stacking context [案例](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Positioning/Understanding_z_index/The_stacking_context)
  2. 需要裁剪（clip）的地方，如页面有滚动条的情形
  3. 绘制包含一个个小的绘画指令
  4. Raster（光栅化）：绘制由渲染引擎中的合成线程来完成；合成线程将图层划分为 Tiles，Tiles 通过栅格化转化为位图，可在 GPU 中加速生成位图。