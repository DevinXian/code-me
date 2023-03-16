/**
 * @formily/reactive 中参考而来,注意 delete 方法对下标的处理
 */
export class ArraySet<T> {
  value: T[]
  forEachIndex = 0 // 维护内部迭代索引
  constructor(value: T[] = []) {
    this.value = value
  }

  add(item: T) {
    if (!this.has(item)) {
      this.value.push(item)
    }
  }

  has(item: T) {
    return this.value.indexOf(item) > -1
  }

  delete(item: T) {
    const len = this.value.length
    if (len === 0) return
    if (len === 1 && this.value[0] === item) {
      this.value = []
      return
    }
    const findIndex = this.value.indexOf(item)
    if (findIndex > -1) {
      this.value.splice(findIndex, 1)
      // 注意：如果在 forEach 中调用 delete 则需要维护 forEachIndex，后续元素往前
      if (findIndex <= this.forEachIndex) {
        this.forEachIndex -= 1
      }
    }
  }

  forEach(callback: (value: T) => void) {
    if (this.value.length === 0) return
    this.forEachIndex = 0
    for (; this.forEachIndex < this.value.length; this.forEachIndex++) {
      callback(this.value[this.forEachIndex])
    }
  }

  batchDelete(callback: (value: T) => void) {
    if (this.value.length === 0) return
    this.forEachIndex = 0
    for (; this.forEachIndex < this.value.length; this.forEachIndex++) {
      const value = this.value[this.forEachIndex]
      this.value.splice(this.forEachIndex, 1)
      // 由于元素被delete，所以后续元素相当于被提前，则 forEachIndex--；
      // 当 this.forEachIndex === this.value.length === 0 时候，循环终止，删除完成
      this.forEachIndex--
      callback(value)
    }
  }

  clear() {
    this.value.length = 0
  }
}
