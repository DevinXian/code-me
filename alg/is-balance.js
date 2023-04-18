/** leetcode  */
function isBalance(root) {
  if (!root) return true;

  return isBalance(root.left) && isBalance(root.right) && Math.abs(height(root.left) - height(root.right) < 2)

  function height(node) {
    if (!node) return 0;
    // map.get(node) 实际运行反而慢了
    return Math.max(height(node.left), height(node.right)) + 1
  }
}

// 从下往上计算height
function isBalance(root) {
  return height(root) !== -1;

  function height(node) {
    if (!node) {
      return 0;
    }

    const lh = height(node.left);
    const rh = height(node.right);

    if (lh === -1 || rh === -1 || Math.abs(lh - rh) > 1) {
      return -1;
    }

    return Math.max(lh, rh) + 1;
  }
}
