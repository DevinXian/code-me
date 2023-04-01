function defineReactiveV1(target, key, val) {
  const deps = []

  Object.defineProperty(target, key, {
    enumerable: true,
    configurable: true,
    get: function () {
      deps.push(window.target);
      return val
    },
    set: function (newVal) {
      if (newVal === val) return;
      val = newVal;
      deps.forEach(dep => dep(newVal, val));
    }
  })
}

function remove(arr, item) {
  if (!arr.length) return;

  const index = arr.indexOf(item);
  if (index >= 0) {
    arr.splice(index, 1)
  }
}

class Dep {
  constructor() {
    this.subs = []
  }

  addSub(sub) {
    this.subs.push(sub)
  }

  removeSub(sub) {
    remove(this.subs, sub)
  }

  depend() {
    window.target && this.addSub(window.target)
  }

  notify() {
    const subs = this.subs.slice();
    subs.forEach(sub => sub.update())
  }
}

function defineReactiveV2(target, key, val) {
  const dep = new Dep();

  Object.defineProperty(target, key, {
    enumerable: true,
    configurable: true,
    get: function () {
      dep.depend();
      return val
    },
    set: function (newVal) {
      if (newVal === val) return;
      val = newVal;
      dep.notify();
    }
  })
}

function parsePath(path) {
  // reg check path
  const paths = path.split('.');

  return function (obj) {
    for (let i = 0; i < paths.length; i++) {
      if (!obj) return;
      obj = obj[paths[i]];
    }
    return obj;
  }
}

class Watcher {
  constructor(vm, expOrFn, cb) {
    this.vm = vm;
    this.getter = parsePath(expOrFn);
    this.value = this.get()
    this.cb = cb;
  }

  get() {
    window.target = this
    const res = this.getter.call(this.vm, this.vm);
    window.target = undefined
    return res;
  }

  update() {
    const oldVal = this.value;
    this.value = this.get();
    this.cb.call(this.vm, this.value, oldVal)
  }
}

// 抽象封装
class Observer {
  constructor(value) {
    this.value = value;
    
    if (Array.isArray(value)) {

    } else {
      this.walk(value)
    }
  }

  walk(value) {
    const keys = Object.keys();
    keys.forEach(key => {
      defineReactiveV3(value, key, value[key]);
    })
  }
}

function defineReactiveV3(target, key, val) {
  const dep = new Dep();

  Object.defineProperty(target, key, {
    enumerable: true,
    configurable: true,
    get: function () {
      dep.depend();
      return val
    },
    set: function (newVal) {
      if (newVal === val) return;
      val = newVal;
      dep.notify();
    }
  })

  // 值递归变为响应式
  if (typeof val === 'object') {
    new Observer(val);
  }
}