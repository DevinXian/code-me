/**
 * @param {number[]} list 
 * 从大到小排列
 */
function quickSort(list, left = 0, right = list.length - 1) {
  if (!list?.length) return []

  if (left < right) {
    const pivotIndex = partition2(list, left, right);
    quickSort(list, left, pivotIndex - 1)
    quickSort(list, pivotIndex + 1, right)
  }
  return list;
}


function partition(list, left, right) {
  let pivotIndex = Math.floor((left + right) / 2);
  const pivot = list[pivotIndex];
  let i = left;
  let j = right;

  while (i <= j) {
    // 比标兵大，则不动，找到第一个小的
    while (pivot < list[i]) {
      i++;
    }

    // 比标兵小，则不动，找到第一个大的
    while (pivot > list[j]) {
      j--;
    }

    // 相遇之前，把i对应小的的交换给后面的j；同时把j对应大的交换给i
    if (i <= j) {
      [list[i], list[j]] = [list[j], list[i]]
      i++;
      j--;
    }
  }
}

// 还有另外的partition方法，采用单指针，选定元素作为标兵，最后标兵归位
function partition2(list, left, right) {
  // 尾部元素作为标兵
  const pivot = list[right];
  let index = left; // 表明下一个被划分过来的元素的装填位置，当装填到最后的时候，Index + 1 就是标兵位置，完成划分

  for(let i = index + 1; i <= right - 1; i++) {
    // 比标兵大，放在前半部分
    if (list[i] > pivot) {
      [list[i], list[index]] = [list[index], list[i]]; 
      index++;
    }
  }

  const pivotIndex = index + 1;

  // left + count 和标兵互换
  [list[right], list[pivotIndex]] = [list[pivotIndex], list[right]];

  return pivotIndex;
}

console.log(quickSort([0, 1, 2, 3, 4, 5, 10, 100]))
console.log(quickSort([100, 1, -2, 3, 4, 5, 10, 1]))