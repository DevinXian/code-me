## Event Loop

### 主要阶段

由于 v8 初始化实际不定，所以处于哪个阶段未可知

1. timers - 执行由 setTimout 和 setInterval 设置的回调函数
2. pending callbacks - 执行延迟到下一个循环的 I/O callbacks
3. idle, prepare - 仅内部使用
4. poll - 取回 I/O 事件；执行 I/O 相关回调函数（除去定时回调和 close 回调）

  - 职责：计算阻塞和等待 I/O 时长；处理 poll queue 事件
  - 在 poll 阶段，A. 没有 timers, 那么走下面逻辑： poll queue 非空，则同步执行 poll queue 直到所有完成 or 达到系统设置限制；如果 poll queue 空，则继续判断：如果有 setImmediate 则进入 check 阶段，否则阻塞在 poll 阶段等待 callback 加入 queue，并立刻执行; B. 如果有 timers，则简单是否有 timers 到期，是则跳回到 timers 阶段

5. check - 执行 setImmediate() 回调函数
6. close callbacks - 执行一些 close 事件回调，比如 `socket.on('close', ...)`

在每次事件循环运行之前，Node 都会检查是否有异步 I/O 或者 timers 在等待中，没有则关闭退出

### setImmediate vs setTimeout 

1. 看上下文，在 I/O 回调中，setImmediate 总是先执行；否则顺序未知，因为会收到进程性能影响（其他进程影响）

### process.nextTick

1. 在当前 phase 触发，可以在 callback 执行之前，允许其他同步代码得到执行；典型场景：

  ```javascript
  const EventEmitter = require('events');

  class MyEmitter extends EventEmitter {
    constructor() {
      super();

      // 改为同步则无效，因为事件 callback 还未绑定
      process.nextTick(() => {
        this.emit('event');
      });
    }
  }

  const myEmitter = new MyEmitter();
  myEmitter.on('event', () => {
    console.log('an event occurred!');
  });
  ```

2. 微任务一环，可以嵌套执行，直到达到设置上限
3. 允许在 event loop 继续下一个任务之前，执行 callback


### 参考资料

1. [nodejs docs](https://nodejs.org/ru/docs/guides/event-loop-timers-and-nexttick)
