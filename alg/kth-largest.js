/**
 * 快排划分思想
 * @param {number[]} nums 
 * @param {number} k 
 */
function findKthLargest(nums, k) {
  if (nums.length < k) return -1;

  let left = 0;
  let right = nums.length - 1;

  while (left <= right) {
    const pivotIndex = partition(list, left, right);
    // console.log(pivotIndex, nums)

    if (pivotIndex === k - 1) {
      return nums[pivotIndex];
    }

    // 缩小边界，有点类似于二分查找获取第一个出现位置
    if (pivotIndex < k - 1) {
      // 在右侧
      left = pivotIndex + 1;
    } else {
      // 在左侧
      right = pivotIndex - 1;
    }
  }

  return -1;
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

  return i - 1;
}

const list = [1, 4, 2, 3, 9, 8, 6, 7, 10, 5]
// 10 9 8 7 6 5 4 3 2 1
console.log(findKthLargest(list, 1)) // 10
console.log(findKthLargest(list, 2)) // 9
console.log(findKthLargest(list, 5)) // 6
console.log(findKthLargest(list, 6)) // 5
console.log(findKthLargest(list, 7)) // 4
console.log(findKthLargest(list, 10)) // 1