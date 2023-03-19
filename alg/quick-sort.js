/**
 * @param {number[]} list 
 */
function quickSort(list, left = 0, right = list.length - 1) {
  if (!list?.length) return []

  if (left < right) {
    const pivotIndex = partition(list, left, right);
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

console.log(quickSort([0, 1, 2, 3, 4, 5, 10, 100]))
console.log(quickSort([100, 1, -2, 3, 4, 5, 10, 1]))