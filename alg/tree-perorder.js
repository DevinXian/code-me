/**
 * @typedef Node
 * @property {number} val
 * @property {Node} [left]
 * @property {Node} [right]
 * @param {Node} root
 * @param {number[]} res 
 */
function preorder(root, res = []) {

  if (!root) return res;

  const stack = []
  const res = []
  let node = root

  while (node || stack.length) {
    while (node) {
      stack.push(node)
      res.push(node.val);
      node = node.left;
    }

    // 左子树到底，则弹出父节点，换向右子树
    node = stack.pop();
    node = node.right
  }

  return res;
}

/**
 * @typedef Child
 * @property {number} val
 * @property {Child[]} [children]
 * @param {Child} root 
 * @param {number[]} res 
 */
function nPreorder(root, res = []) {
  if (!root) return res;

  let node = root;
  const stack = []
  const res = []
  const nextIndexMap = new Map();

  while (node || stack.length) {
    // 先序遍历：左子树先到底
    while (node) {
      stack.push(node)
      res.push(node.val)

      if (!node.children?.length) {
        break;
      }

      nextIndexMap.set(node, 1); // 记录子节点遍历索引
      node = node.children[0]
    }

    // 找到父节点
    // node = stack.pop(); // 不能弹出，非二叉树
    node = stack[stack.length - 1];
    const index = nextIndexMap.get(node);

    if (node.children?.length && index < node.children.length) {
      // 还有子树需要处理
      nextIndexMap.set(node, index + 1);
      node = node.children[index] // 处理index对应节点
    } else {
      // 父节点遍历完成，从栈弹出，并切除 map 记录，继续从stack 往上层处理
      stack.pop();
      nextIndexMap.delete(node);
      node = null
    }
  }

  return res;
}

function nPreorderShortly(root, res = []) {
  if (!root) return res;

  let node
  const stack = [root]

  while (stack.length) {
    node = stack.pop();
    res.push(node.val)

    if (node.children?.length) {
      stack.push(...node.children.reverse())
    }
  }

  return res;
}
