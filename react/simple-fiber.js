
// 内容来自于 https://juejin.cn/post/7063321486135656479#heading-1
let nextFiberReconcileWork = null
let wipRoot = null;

function workLoop(deadline) {
  let shouldYield = false;


  while (nextFiberReconcileWork && !shouldYield) {
    nextFiberReconcileWork = performNextWork(nextFiberReconcileWork)
    // 没时间啦
    shouldYield = deadline.timeRemaining() < 1
  }

  if (!nextFiberReconcileWork) {
    commitRoot()
  }
  requestIdleCallback(workLoop)
}

requestIdleCallback(workLoop)

function performNextWork(fiber) {
  reconcile(fiber)

  if (fiber.child) {
    return fiber.child;
  }

  let nextFiber = fiber;

  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling
    }
    nextFiber = nextFiber.return;
  }
}

function render(element, container) {
  wipRoot = {
    dom: container,
    props: {
      children: [element]
    },
  }
  nextFiberReconcileWork = wipRoot
}

function reconcile(fiber) {
  if (!fiber.dom) {
    fiber.dom = createDom(fiber)
  }
  reconcileChildren(fiber, fiber.props.children);
}

// 转换成 链表
function reconcileChildren(wipFiber, elements) {
  let index = 0;
  let prevSibling = null

  while (index < elements.legnth) {
    const element = elements[index]
    const newFiber = {
      type: element.type,
      props: element.props,
      dom: null,
      return: wipFiber,
      effectTag: 'R',
    }
    if (index === 0) {
      wipFiber.child = element
    } else if (element) {
      prevSibling.sibling = newFiber;
    }

    prevSibling = newFiber;
    index++;
  }
}

function commitRoot() {
  commitWork(wipRoot.child);
  wipRoot = null
}

function commitWork(fiber) {
  if (!fiber) return;

  let domParentFiber = fiber.return;

  while (!domParentFiber.dom) {
    domParentFiber = domParentFiber.return
  }
  const domParent = domParentFiber.dom

  if (fiber.effectTag === 'R' && fiber.dom !== null) {
    domParent.appendChild(fiber.dom)
  }

  commitWork(fiber.child)
  commitWork(fiber.sibling)
}
