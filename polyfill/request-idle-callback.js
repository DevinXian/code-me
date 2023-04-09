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
        }
      });
    }, 1000);
  };
} 


