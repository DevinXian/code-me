/**
 * TODO: 实现一个大于 Number.MAX_SAFE_INTERGER 的字符串相加算法 - leetcode 已做这道题
 * @param {string} str 
 */
const main = (str) => {
  const len = str.length

  if (len < 3) return false;

  // 第一个数长度变化范围
  for (let i = 1; i <= len - 2; i++) {
    if (checkNum1(i, str)) {
      return true;
    }
  }

  return false;
}

function checkNum1(len1, str) {
  // 第二个长度
  for (let i = 1; i <= str.length - len1; i++) {
    if (check(len1, i, str)) {
      return true;
    }
  }
  return false;
}

function isValidNum(str) {
  return Number(str).toString() === str
}

function numLen(num) {
  return num.toString().length
}

function check(len1, len2, str) {
  let str1 = str.slice(0, len1)
  let str2 = str.slice(len1, len1 + len2);

  if (!isValidNum(str1) || !isValidNum(str2)) {
    return false;
  }

  let num1 = Number(str1);
  let num2 = Number(str2);
  let num3 = 0;
  let len3 = 0;
  let preLen = len1 + len2 // 不包含第三个数字的长度

  while (preLen <= str.length) {
    num3 = num1 + num2;
    len3 = numLen(num3);

    // console.log(num1, num2, num3);

    // 超长了
    if (preLen + len3 > str.length) {
      return false;
    }

    const str3 = str.slice(preLen, preLen + len3);

    if (!isValidNum(str3)) {
      return false;
    }

    // 不想当不对
    if (str3 !== num3.toString()) {
      return false;
    }


    len1 = len2;
    num1 = num2;
    len2 = len3;
    num2 = num3
    preLen += len3;
    // console.error('prelen', preLen)

    if (preLen === str.length) {
      return true;
    }
  }

  return false;
}


console.log(main('1283')) // false
console.log(main('1235')) // true
console.log(main('199111992')) // true 1991 1 1992
console.log(main('199100199')) // true 1 99 100 199
// 1999999999999999910000000000000000 // 不能处理