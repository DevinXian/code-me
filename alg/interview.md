1. 8x8 棋盘有若干车： a. 判断其中是否存在互相攻击; b. 找出不会被攻击的点

  ```javascript
  // 以下是测试集和朴素解法（有没有高阶暂时没深究）
  const array = [];
  for (let i = 0; i < 8; i++) {
    array[i] = [];
    for (let j = 0; j < 8; j++) {
      array[i][j] = 0;
    }
  }
  array[0][0] = 1;
  array[1][5] = 1;
  array[3][4] = 1;
  array[6][2] = 1;
  array[5][7] = 1;

  // 检查是否有攻击
  function check(arr) {
    const row = {}
    const col = {}
    const len = arr.length

    for (let i = 0; i < len; i++) {
      for (let j = 0; j < len; j++) {
        // console.log(i, j, arr[i][j], '\n---', row[i], col[j])

        if (arr[i][j] > 0) {
          if (row[i]) return true
          if (col[j]) return true
          row[i] = 1
          col[j] = 1
        }
      }
    }
    return false
  }
  
  // 不被攻击的点
  function freeNodes(arr) {
    const rows = []
    const cols = []
    const len = arr.length
    const res = []

    for (let i = 0; i < len; i++) {
      for (let j = 0; j < len; j++) {
        if (arr[i][j]) {
          rows.push(i)
          cols.push(j)
        }
      }
    }

    for (let i = 0; i < len; i++) {
      if (rows.indexOf(i) > -1) continue

      for (let j = 0; j < len; j++) {
        if (cols.indexOf(j) > -1) continue
        res.push(i + ',' + j)
      }
    }
    return res
  }
  ```