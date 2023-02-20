/**
 * 本实现思路参考：https://github.com/nswbmw/appoint/blob/master/appoint.js
 * 特别鸣谢！
 */
function INTERNAL() { }
function isFunction(func) {
  return typeof func === 'function'
}
function isObject(obj) {
  return typeof obj === 'object'
}
function isArray(arr) {
  return Array.isArray(arr)
}

const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

class Callback {
  constructor(promise, onResolved, onRejected) {
    this.promise = promise; // Promise
    this.onRejected = onRejected; // then 传入的成功回调
    this.onResolved = onResolved; // then 传入的失败回调
  }

  callResolve(value) {
    process.nextTick(() => {
      try {
        let val = value;
        if (this.onResolved) {
          val = this.onResolved(value); // 用户传入 resolve 并执行 resolve() 返回值获取
        }
        if (val === this.promise) {
          this.promise.doReject('shoud not return promise self');
        } else {
          this.promise.doResolve(val); // 推动 Promise 状态变更
        }
      } catch (error) {
        // 运行时错误，走错误处理流程
        this.callReject(value);
      }
    })
  }

  // error 为用户执行 reject() 结果
  callReject(error) {
    process.nextTick(() => {
      try {
        let val = error;
        if (this.onRejected) {
          val = this.onRejected(value); // then 回调执行, 其结果决定当前返回的子 promise 状态
        }
        if (val === this.promise) {
          this.promise.doReject('shoud not return promise self');
        } else {
          this.promise.doResolve(val); // 推动 Promise 状态变更
        }
      } catch (error) {
        // 有错误，promise 变为错误状态
        // 此处不能是 this.callReject(error) 则变成死循环
        this.promise.doReject(error);
      }
    });
  }
}

function getThen(value) {
  const then = value && value.then

  if (value && (isObject(value) || isFunction(value)) && isFunction(then)) {
    return (...args) => then.call(value, ...args)
  }
}

class Promise {
  state = PENDING
  callbacks = []

  constructor(executor) {
    if (executor !== INTERNAL) {
      executor(this.doResolve, this.doReject);
    }
  }

  safelyResolveThen = (then) => {
    let called = false

    const once = (fn) => {
      if (called) return;
      called = true;
      fn();
    }

    try {
      then(function (value) {
        once(() => this.doResolve(value));
      }, function (error) {
        once(() => this.doReject(error))
      })
    } catch (error) {
      once(() => this.doReject(error))
    }
  }

  doResolve = (value) => {
    // value 作为入参，传入进去
    const then = getThen(value)
    if (then) {
      // 判断 then 是递归: value => value.then => doResolve => value => value.then
      this.safelyResolveThen(then)
      return;
    }

    try {
      this.value = value;
      this.state = FULFILLED
      this.callbacks.forEach(item => {
        item.callResolve(value)
      })
    } catch (error) {
      this.doReject(error)
    }
    return this;
  }

  doReject = (error) => {
    this.value = error;
    this.state = REJECTED
    this.callbacks.forEach(item => {
      item.callReject(error)
    });
  }

  // 根据状态决定是否执行回调，回调需要异步执行
  then = (onResolved, onRejected) => {
    const promise = new Promise(INTERNAL);
    const callback = new Callback(promise, onResolved, onRejected);

    if (this.state === PENDING) {
      this.callbacks.push(callback)
    } else {
      // 本 promise 状态已定，则当前 value 当做入参调用 then 回调，返回结果作为子 promise 状态
      const ret = this.state === FULFILLED ? onResolved(this.value) : onRejected(this.value);
      promise.doResolve(ret)
    }
    return promise

    /*
    return new Promise((resolve, reject) => {
      // 存储此 resolve reject 到callbacks中，等待上层 promise 内部 resolve/reject 推动状态变更; 
      // 父 promise resolve() 之后状态变更，如果有 onResolved 则 value = onResolved(value)，继续推动当前 resolve 流程
      // ps: 不用保存 promise (promise 和其 resolve/reject 等价)
    })
    */
  }
}

module.exports = Promise
