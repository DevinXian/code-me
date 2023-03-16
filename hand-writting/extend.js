// 寄生组合继承为最终方案
function extend(Sub, Super) {
  // const Sub = Object.create(Super.prototype)
  function Proto() {}
  Proto.prototype = Super;
  Sub.prototype = new Proto();
}


