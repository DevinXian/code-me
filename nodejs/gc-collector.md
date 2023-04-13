## GC Collector: Orinoco

### GC 周期性任务

1. 区分 heap 中存活和垃圾（dead）对象
2. 垃圾对象占用内存回收利用
3. 压缩内存片段(可选)
4. 问题：如果主线程执行，会打断js执行，引起延迟，降低程序吞吐量(throughput)

### Major GC(Full Mark-Compact)

1. 作用于整个 heap，main thread 过程： js -> marking -> sweeping -> compacting -> js
2. marking: 运行期间根据 reachability 来判定是否失活；从 root set 出发，递归寻找执行栈和全局对象中可达到对象，进行标记（white black gray）
3. sweeping: dead 对象被收集到 free list 中
4. compaction: 将存活对象复制到未被压缩的页面中（利用 free-list)；潜在问题：复制代价可能高昂，所以只压缩高度碎片化页面

### 分代布局（generational layout)

1. 前提：动态语言中，多数对象被认为是早死的
2. 两代：新生代和老生代
3. 新生代（细分 nursery + intermediate）,新创建对象进入 nursery，经过一次GC后存活进入 intermediate，再次GC依旧存活，则进入老生代
4. 代价是需要复制对象（存活对象，非所有创建对象）

### Minor GC(Scanvenger)

1. 新生代被分为 from 和 to 两半，一半永远是空的（to）
2. old-to-new 引用(write barrier)、stack 和全局对象，得到所有新生代，避免取遍历追踪整个老生代
3. 在 GC 过程中， from 中对象会移动到 to 中，然后切换 from 和 to
4. 新对象在 from 中创建；两次 GC 后存活，则进入老生代

### Orinoco

GC 特性：并行、增量、并发, 主要目的解放主线程

1. Parallel: 依旧是 stop the world 模式，但是 GC 被其他线程和主线程共同分担，容易实现
2. Incremental： GC 分为多段，但是运行时对 head 状态修改可能导致之间的增量工作失效；增加总体时长，但是提升了响应速度
3. Concurrent: 主线程只执行js，helper线程完成全部GC；最难实现，任何对象任何时间都可能改变并且使之前工作作废

  - 主要考虑线程同步读写问题
  - 完全解放主线程，代码就是线程同步

### V8 GC 状态

1. scavenging: 使用 parallel 的 scavenge 进行分布式工作，需要 helper 线程同步状态（具体待研究 TODO）
2. major GC: 

  - concurrent 执行标记（主线程不停止）
  - 主线程执行快速一个标记确定步骤，这时候主线程暂停执行(~10ms，也是GC所有暂停时间)
  - sweep 完全由 helper 线程执行，主线程不影响

3. Idle-time GC: 比如浏览器可以选择在一帧 16.67ms 中动画完毕时的空闲时间执行 GC

### 补充

1. V8 gc 工具新特性是逐步加入进来的，大大改善了暂停时间、延迟、页面加载和动画时间、滚动和用户交互流畅性，技术受益明显
2. 工作还未完成
3. 理解 GC 有助于编程中减低内存消耗和优化编程模式，比如：对象越短存活越好

### 参考资料

1. [trash-talk](https://v8.dev/blog/trash-talk)