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
function reverseRecursively(head) {
  function iterator(prev, curr) {
    if (!curr) return prev

    let next = curr.next
    curr.next = prev

    return iterator(curr, next)
  }

  return iterator(null, head)
}

/**
 * 判断是否有环: 
 * 方法1：通过map记录已访问节点，重复访问即为入口（略）
 * 方法2：快慢指针-快一次走两步（可多步），慢一次走一步
 */
function checkCircle(head) {
  let slow = head
  let fast = head

  // 如果有环会一直循环到快慢指针相遇
  while (fast && fast.next) {
    slow = slow.next
    fast = fast.next.next
    if (slow === fast) {
      // 此时可获得快慢指针相遇点
      return true
    }
  }
  return false
}

/**
 * 已知有环，查找链表环入口
 * @param {*} head 头指针
 * @param {*} meet 首次相遇点
 */
function findCircleEntry(head, meet) {
  let p1 = head
  let p2 = meet

  // 原理说明: 设 head 到入口距离 x，入口到相遇点最短距离 y, 慢指针假设走过 s，快指针则走过 2s，又假设快指针已绕环 n 圈，有
  // 1. 慢 s = x + y    2. 快 x + nr + y = 2s； 可推导出 nr = x + y，即 x = nr - y，
  // 设两个指针，p1 从 head 出发，p2 从 meet 出发
  // nr - y 也可理解为：当 p1 到达入口时，p2 还差 y 步绕回入口，那么 p2 从 y 处提前出发，就可以刚好在入口相遇
  // 反过来想：等式两边各减去 x，可理解为从入口（题设相遇处）各自后退，则 0 => nr - y - x  = nr - nr = 0 => 0 = 0，意味着两者同步出发 x 步后环入口相遇

  while (p1 !== p2) {
    p1 = p1.next
    p2 = p2.next
  }

  return p1;
}