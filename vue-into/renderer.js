const isArray = Array.isArray
const Text = Symbol('text')
const Comment = Symbol('comment')
const Fragment = Symbol('fragment');

function setText(el, text) {
  el.nodeValue = text;
}

function patchProp(el, key, prevValue, nextValue) {
  // 秒啊，通过invoker代理，减少事件绑定和解绑！
  if (/^on/.test(key)) {
    // let invoker = el._vei
    let invokers = el._vei
    const name = key.slice(2).toLowerCase();
    let invoker = invokers[key];

    if (nextValue) {
      if (!invoker) {
        //   invoker = el._vei = (e) => {
        //     invoker.value(e);
        //   }
        // 增强事件绑定，解决覆盖问题
        invoker = el._vei[key] = (e) => {
          // 时间戳解决父子元素依赖同一变量进行事件绑定时候的 *事件绑定和事件冒泡先后不定问题*
          if (e.timeStamp < invoker.attached) return;
          if (isArray(invoker.value)) {
            invoker.value.forEach(fn => fn(e))
          } else {
            invoker.value(e)
          }
        }
        invoker.value = nextValue
        invoker.attached = performance.now()
        el.addEventListener(name, invoker);
      } else {
        invoker.value = nextValue;
      }
    } else if (invoker) {
      el.removeEventListener(name, prevValue)
    }
  } else if (key === 'class') {
    el.className = nextValue;
  } else if (shouldSetAsProp(el, key, nextValue)) {
    const type = typeof el[key]
    if (type === 'boolean' && nextValue === '') {
      el[key] = true
    } else {
      el[key] = nextValue;
    }
  } else {
    el.setAttribute(key, nextValue);
  }
}

function unmount(vnode) {
  if (vnode.type === Fragment) {
    vnode.children.forEach(c => unmount(c))
  }
  vnode.el.parentNode?.removeChild(vnode.el);

}

function renderer(options) {
  function patchChildren(n1, n2, container) {
    // el == n1.el == n2.el el 是文本节点
    if (typeof n2.children === 'string') {
      if (isArray(n1.children)) {
        n1.children.forEach(c => unmout(c))
      }
      setElementText(container, n2.children);
    } else if (isArray(n2.children)) {
      if (isArray(n1.children)) {
        // 核心算法 diff patch
        // TODO:
      } else {
        // 旧节点，要么文本，要么空节点
        setElementText(container, '')
        n2.children.forEach(child => patch(null, child, container));
      }
    } else {
      // 新节点不存在，卸载纠结点
      if (isArray(n1.children)) {
        n1.children.forEach(c => unmount(c));
      } else if (typeof n1.children === 'string') {
        setElementText(container, '')
      }
    }
  }

  function patchElement(n1, n2) {
    const el = n2.el = n1.el;
    const oldProps = n1.props;
    const newProps = n2.props;

    for (const key in newProps) {
      if (newProps[key] !== oldProps[key]) {
        patchProp(el, key, oldProps[key], newProps[key]);
      }
    }
    for (const key in oldProps) {
      if (!(key in newProps)) {
        patchProp(el, key, oldProps[key], null);
      }
    }

    patchChildren(n1, n2, el);
  }

  function mountElement(vnode, container) {
    const el = vnode.el = createElement(vnode.type);

    if (typeof vnode.children === 'string') {
      setElementText(vnode.textContent);
    } else if (Array.isArray(vnode.children)) {
      vnode.children.forEach(child => {
        patch(null, child, el)
      })
    }

    if (vnode.props) {
      for (key in vnode.props) {
        patchProp(vnode.el, key, null, vnode.props[key])
      }
    }

    insert(el, container);
  }

  function patch(n1, n2, container) {
    // 类型不同就卸载重新挂载
    if (n1 && n1.type !== n2.type) {
      unmount(n1)
      n1 = null
    }
    const { type } = n2;

    // 文本节点
    if (type === Text) {
      if (!n1) {
        const el = n2.el = document.createTextNode(n2.children)
        insert(el, container);
      } else {
        const el = n2.el = n1.el
        if (n2.children !== n1.children) {
          setText(el, n2.children)
        }
      }
    } else if (type === Comment) {
      // similar to Text patch
    } else if (type === Fragment) {
      // 没有props diff，直接进入children
      if (!n1) {
        n2.children.forEach(c => patch(null, c, container));
      } else {
        patchChildren(n1, n2, container)
      }
    } else if (typeof type === 'string') {
      if (!n1) {
        mountElement(n2, container);
      } else {
        patchElement(n1, n2);
      }
    }
  }


  function render(vnode, container) {
    if (vnode) {
      patch(container._vnode, vnode, container);
    } else if (container._vnode) {
      container.innerHTML = ''
    }
    container._vnode = vnode;
  }

  // 服务端使用
  function hydrate(vnode, container) { }

  return {
    render,
    hydrate,
  };
}

export default renderer;
