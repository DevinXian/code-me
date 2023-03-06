/**
 * 最大并发 limit
 * @param {Function} tasks 
 * @param {number} limit 
 */
function concurrent(tasks, limit) {
  const list = []  // 进行中
  let running = 0;
  const promises = []
  let resolve

  const allPromise = new Promise(ok => (resolve = ok))

  const addTask = () => {
    // 到达并发限制 or 没有更多任务
    if (list.length >= limit || !tasks.length) {
      return
    }

    running++;
    const item = tasks.shift()();
    promises.push(item)
    item.then(value => {
      console.log('--- value: ', value)
      return value;
    }).finally(() => {
      running--;
      if (running === 0 && tasks.length === 0) {
        resolve(Promise.all(promises))
        return;
      }
      addTask()
    });
  }

  for (let i = 0; i < limit; i++) {
    addTask();
  }

  return allPromise
}

/** 以下为测试代码 */
function task(seq) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`task - ${seq}`)
    }, 1000 + seq * 100)
  })
}

const arr = []
for (let i = 0; i < 10; i++) {
  arr.push(task.bind(null, i));
}

concurrent(arr, 2).then(console.log, console.error);
