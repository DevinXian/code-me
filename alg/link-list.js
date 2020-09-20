/**
 * 双向连表添加节点 node
 * 
 * next pointer ->
 * node.next = item.next
 * item.next = node
 * 
 * prev pointer ->
 * node.prev = item.prev
 * item.prev = node
 * 
 */

// 单链表-就地逆置
function reverse(head) {
  if (!head) return null
  let prev = null
  let curr = head

  while (curr.next) {
    next = curr.next
    curr.next = prev
    prev = curr
    curr = next
  }

  return prev
}

// 递归写法
function reverseRecursively() {
  function iterator(prev, curr) {
    if (!curr) return prev

    let next = curr.next
    curr.next = prev

    return iterator(curr, next)
  }

  return iterator(null, head)
}
