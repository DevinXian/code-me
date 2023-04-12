if (!Object.is) {
  // Object.is 是 static 方法
  Object.defineProperty(Object, 'js', {
    value: function (x, y) {
      if (x === y) {
        return x !== 0 && 1 / x === 1 / y // x = -0,y = 0 返回 false
      } else {
        return x !== x && y !== y // x y 同时为 NaN，返回 true
      }
    },
    enumerable: false,
    configurable: true,
    writable: true
  })
}

