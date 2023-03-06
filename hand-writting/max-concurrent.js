/**
 * 最大并发 limit
 * @param {Function} tasks 
 * @param {number} limit 
 */
function concurrent(tasks, limit) {
  const promises = []
  let resolve

  const allPromise = new Promise(ok => (resolve = ok))

  const addTask = () => {
    // 没有更多任务
    if (!tasks.length) {
      resolve(Promise.all(promises))
      return;
    }

    const item = tasks.shift()();
    promises.push(item)
    console.log('promises display: ', promises) // 观察到始终最多只有2个在pending状态的Promise实例
    item.finally(() => addTask());
  }

  for (let i = 0; i < limit; i++) {
    addTask();
  }

  return allPromise
}

/** 以下为测试代码 */
function task(seq, delay) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`task - ${seq} - ${delay}`)
    }, delay * 100)
  })
}

const arr = []
for (let i = 0; i < 10; i++) {
  arr.push(task.bind(null, i, Math.floor(Math.random(100) * 100)));
}

concurrent(arr, 2).then(console.log, console.error);
