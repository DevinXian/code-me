## micro-app 要点分析

### DOM 渲染

1. HTML 自定义组件及属性，监听对应属性(此处为 name 和 url)
2. 创建微应用，控制资源加载、渲染和卸载过程
3. 根据 url 来获取 entry html，并做缓存和设置 innerHTML（innerHTML 忽略脚本执行-[见标准](https://www.w3.org/TR/2008/WD-html5-20080610/dom.html#innerhtml0)；注意此处不会 append 到容器中，只是在内存中处理。
4. 从 entry html 中提取 js css 等内容，读取 HTMLLinkElement HTMLScriptElement HTMLStyleElement，并放入缓存
5. 执行 `mount`，渲染 DOM 结构，并执行脚本（需要沙箱）

### JS 隔离

1. 子应用独立的变量和事件空间，解决冲突
2. 利用 Proxy 代理 window，用沙箱变量来集合当前子应用值，没有再回退到容器 window
3. 需要有沙箱启动和清理方法，方便切换和关闭子应用等
4. eval 包裹子应用代码，通过 with 来覆盖子应用 window 对象
5. 重写事件监听，原因：子应用不知道自己何时关闭，无法主动清除事件监听，需要暴露方法给基座进行事件管理。

### 样式隔离

1. 添加类似 `app[name=xxx]` 来添加前缀，即可达到类似 Scoped 效果，要注意监听 style 等变化
2. 核心原理简单，正则匹配即可选择器，进行选择器内容替换加强；替换之前需要设置样式 disabled

### 数据通信

1. 实现发布订阅模式
2. 针对子应用和基座进行通信方向规定，进行通信封装
3. micro-app 元素对象类型属性的支持，改造 `setAttribute` 方法，监听子应用 data 属性变化，并通过事件通知子元素

#### 参考地址

https://github.com/micro-zoe/micro-app/issues/17（实例仓库基座是 Vue 项目，子应用是 React)
