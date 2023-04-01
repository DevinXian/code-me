let pending = false;
const callbacks = []

function flushCallbacks() {
  pending = false;
  const copied = callbacks.slice(0);
  // 防止污染，跟redux中间件复制列表一个原理
  callbacks.length = 0;
  for (let i = 0; i < copied.length; i++) {
    copied[i]()
  }
}

let microTimerFunc
let macroTimerFunc
let useMacroTask = false; // default micro task flush

// 宏任务
if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
  macroTimerFunc = () => setImmediate(flushCallbacks)
} else if (typeof MessageChannel !== 'undefined' && (isNative(MessageChannel) || MessageChannel.toString() === '[object MessageChannelConstructor]')) {
  const channel = new MessageChannel();
  channel.port1.onmessage = flushCallbacks
  macroTimerFunc = () => {
    channel.port2.postMessage(1)
  }
} else {
  macroTimerFunc = () => setTimeout(flushCallbacks, 0)
}

// 微任务
if (typeof Promise !== 'undefined' && isNative(Promise)) {
  const p = Promise.resolve()
  microTimerFunc = () => {
    p.then(flushCallbacks)
  }
} else {
  microTimerFunc = macroTimerFunc;
}

export function withMacroTask(fn) {
  return fn._withTask || (fn._withTack = function () {
    useMacroTask = true;
    const res = fn.apply(null, arguments)
    useMacroTask = false;
    return res;
  })
}

export function nextTick(cb, ctx) {
  let _resolve;

  callbacks.push(function () {
    if (cb) {
      cb.call(ctx)
    } else if (_resolve) {
      _resolve(ctx)
    }
  })

  // 打开异步队列
  if (!pending) {
    pending = true;
    useMacroTask ? macroTimerFunc() : microTimerFunc();
  }

  // 支持 nextTick().then() Promise 形式
  if (!cb && typeof Promise !== 'undefined') {
    return new Promise(r => {
      _resolve = r;
    })
  }
}
