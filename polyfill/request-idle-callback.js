let frameDeadline;
let pendingCallback;
let channel = new MessageChannel();

// setTimeout 也可以替代 MessageChannel
channel.port2.onmessage = function () {
  let timeRemaining = frameDeadline - performance.now();
  if (timeRemaining > 0) {
    pendingCallback?.({
      timeRemaining,
      didTimeout: false
    })
  }
};

window.requestIdleCallback = function (callback) {
  requestAnimationFrame(function (rafTime) {
    frameDeadline = rafTime + 16.66; // 帧开始 + 帧时长 => 帧结束
    pendingCallback = callback;
    channel.port1.postMessage(null);
  })
}

// npm package requestIdleCallback polyfill
if (!window.requestIdleCallback) {
  // If not, create a polyfill
  window.requestIdleCallback = function (cb) {
    // Set a fallback timeout of 1 second
    var start = Date.now();
    return setTimeout(function () {
      cb({
        didTimeout: false,
        timeRemaining: function () {
          // 50 是UI交互延迟研究所得
          return Math.max(0, 50 - (Date.now() - start));
          // 就应用及时响应研究数据表明 100ms 以内UI交互延迟是可接受的；大部分情况下，可以将 50ms 时间用来完成 idle 注册的 cb 任务（个人理解：交互延时在50ms以内, 其他时间用来执行 idle cb 任务了）
          // When trying to maintain a responsive application, all responses to user interactions should be kept under 100ms. Should the user interact the 50ms window should, in most cases, allow for the idle callback to complete, and for the browser to respond to the user’s interactions. You may get multiple idle callbacks scheduled back-to-back 

        }
      });
    }, 1000);
  };
} 


