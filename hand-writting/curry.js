function curry(fn) {
  let params = []
  const len = fn.length

  const inner = (...args) => {
    params = [...params, ...args]

    if (params.length >= len) {
      fn.call(null, ...params)
    } else {
      return inner
    }
  }
}

/**
 * curry 习题例子:
 * 要求:
 *  add(1) = 1
 *  add(1, 2) = 3
 *  add(1)(2) = 3
 *  add(1)(2)() = 3
 *  add(1)(2)(3) = 6
 */
function add(...params) {
  let sum = params.reduce((pre, curr) => pre + curr);

  const inner = (...args) => {
    if (args.length === 0) {
      // 满足 add() => 输出当前 sum
      return sum;
    } else {
      args.forEach(item => sum += item);
      return inner;
    }
  }

  inner.valueOf = function() {
    return sum;
  }

  inner.toString = function() {
    return sum + '';
  }

  return inner;
}
console.log(' ' + add(1)) // 1
console.log(' ' + add(1, 2)) // 3
console.log(' ' + add(1)(2)) // 3
console.log(' ' + add(1)(2)()) // 3
console.log(' ' + add(1)(2)(3)) // 6
