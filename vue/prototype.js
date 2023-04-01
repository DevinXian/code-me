const { nextTick } = require('./next-tick')

function remove(arr, item) {
  if (!arr.length) return;

  const index = arr.indexOf(item)
  if (index > -1) {
    arr.splice(index, 1)
  }
}

Vue.prototype.$on = function (event, fn) {
  if (Array.isArray(event)) {
    event.forEach(e => {
      this.$on(e, fn);
    })
    return this;
  }

  if (!this._events[event]) {
    this.events[event] = []
  }
  this._events[event].push(fn);
  return this;
}

Vue.prototype.$off = function (event, fn) {
  // arguments.length
  if (!arguments.length) {
    // remove all event listeners
    this._events = Object.create(null);
    return this;
  }

  if (Array.isArray(event)) {
    // for...loop this.$off
    return this;
  }

  // check if events exists

  // check if fn is specified
  // yes -> remove the specified event handler
  // no -> remove all event handler -> item or item.fn === fn
}

Vue.prototype.$once = function (event, fn) {
  const on = (...args) => {
    vm.$off(event, on);
    fn.call(vm, ...args);
  }
  on.fn = fn; // for off equals check
  this.$on(event, fn);
  return vm
}

Vue.prototype.$emit = function (event, ...args) {
  // check this._events[event]
  this._events[event].forEach(fn => {
    try {
      fn.call(this, ...args)
    } catch (e) {
      // handle Error
    }
  })
}

Vue.prototype.$forceUpdate = function () {
  if (this._watcher) {
    this._watcher.update();
  }
}

Vue.prototype.$destroy = function () {
  // 1. status
  if (this._isBeingDestroyed) {
    return;
  }
  // call beforeDestroy hook
  callHook(vm, 'beforeDestroy') // hook
  this._isBeingDestroyed = true;

  // remove from parent
  const parent = this.$parent;
  if (parent && !parent._isBeingDestroyed && !this.$options.abstract) {
    remove(parent.$children, this)
  }

  // remove watcher created by Vue component render
  if (this._watcher) {
    this._watcher.tearDown();
  }

  // remove sub for deps which created by `this.$watch` 
  let i = this._watchers.length

  while (i--) {
    this._watchers[i].tearDown();
  }

  this._isDestroyed = true;
  // gengxin Vnode
  this._patch__(this.node, null)
  callHook(this, 'destroyed')
  this.$off();
}

/**
 * Micro task: Promise.then . MutationObserver process.nextTick Object.observe .etc
 * Macro task: setTimeout setImmediate setInterval Message-Channel I/O requestAnimationFrame UI .etc
 * Vue update DOM on nextTick, in this way, state/props changes are merged to one time render
 */

Vue.prototype.$nextTick = function (callback) {
  nextTick(callback, this);
}

function compileToFunctions(template, options, vm) {
  // cache by key(template string)

  /**
   * compile 包含了：
   * 1. 解析器 template -> AST
   * 2. 优化器 static node marking
   * 3. 代码生成器 AST -> render function string: `with(this){return _c("div", { attrs: {"id":"el"}}, [_v("Hello"+_s(name))])}`
   */
  const compiled = compileIgnored(template, options)

  return {
    render: new Function(compiled.code)
  }
}

function wrapWithCompiling(Vue) {
  const mount = Vue.$prototype.mount;

  Vue.$prototype.mount = function (el) {
    el = el && query(el) // query ignored
    const options = this.$options;

    if (!options.render) {
      // get template from el, support id nodeType and from el.outerHTML
      const template = getTemplateIgnored(el);
      if (template) {
        const render = compileToFunctions(template, options, this)
        options.render = render;
      }
    }

    return mount.call(this, el);
  }
}

Vue.prototype.$mount = function (el) {
  callHook(this, 'beforeMount')

  this._watch = new Watcher(this, () => {
    // run in Watcher constructor as value.get(), so deps track started
    this._update(this.render());
  }, function() {})

  callHook(this, 'mounted')
}

let preCompiled = true; // 是否 vue-loader vuerify 等编译过
if (!preCompiled) {
  wrapWithCompiling(Vue);
}