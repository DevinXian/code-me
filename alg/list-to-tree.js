const list = [
  { pid: null, id: 1, data: "1" },
  { pid: 1, id: 2, data: "2-1" },
  { pid: 1, id: 3, data: "2-2" },
  { pid: 2, id: 4, data: "3-1" },
  { pid: 3, id: 5, data: "3-2" },
  { pid: 4, id: 6, data: "4-1" },
];

function toTree(arr) {
  const list = JSON.parse(JSON.stringify(arr))
  const root = []
  const obj = {}

  // 先缓存关系 - 6年前用过...
  list.forEach(item => {
    obj[item.id] = item
    item.children = []
  })

  list.forEach(item => {
    if (item.pid === null) {
      root.push(item);
    } else {
      // 添加到父级别
      obj[item.pid].children.push(item)
    }
  })

  return root;
}

function toTree2(arr) {
  const list = JSON.parse(JSON.stringify(arr))
  const root = []
  const obj = {}

  list.forEach(item => {
    obj[item.id] = obj[item.id] ? { ...obj[item.id], ...item } : item;

    if (item.pid === null) {
      root.push(item)
    } else {
      // 找到父元素
      obj[item.pid] = obj[item.pid] ?? {};
      obj[item.pid].children = obj[item.pid].children ?? [];
      obj[item.pid].children.push(item);
    }
  })

  return root;
}

console.log(JSON.stringify(toTree(list)))
console.log(JSON.stringify(toTree2(list)))
