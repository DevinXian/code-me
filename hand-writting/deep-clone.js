
// string number boolean null undefined symbol
// array set map 
// Buffer Date RegExp Error
// arrayBuffer Boolean DataView Float32Array Float64Array Int16Array Int32Array Int8Array Uint16Array Uint32Array Uint8Array Uint8ClampedArray
// Map Set Number String

// function
// 仿照 lodash 的实现
function cloneDeep(value, map = new WeakMap()) {
  const cached = map.get(value);
  if (cached) {
    return cached;
  }
  if (value === null) return null;
  if (typeof value !== 'object') return value;
  if (value instanceof Date) return new Date(value);
  if (value instanceof RegExp) return new RegExp(value);
  if (value instanceof Error) return new Error(value);
  if (value instanceof Map) return new Map(value);
  if (value instanceof Set) return new Set(value);
  if (value instanceof ArrayBuffer) return value.slice(0);
  if (value instanceof Boolean) return new Boolean(value);
  if (value instanceof DataView) return new DataView(value);
  if (value instanceof Float32Array) return new Float32Array(value);
  if (value instanceof Float64Array) return new Float64Array(value);
  if (value instanceof Int16Array) return new Int16Array(value);
  if (value instanceof Int32Array) return new Int32Array(value);
  if (value instanceof Int8Array) return new Int8Array(value);
  if (value instanceof Uint16Array) return new Uint16Array(value);
  if (value instanceof Uint32Array) return new Uint32Array(value);
  if (value instanceof Uint8Array) return new Uint8Array(value);
  if (value instanceof Uint8ClampedArray) return new Uint8ClampedArray(value);
  if (value instanceof Number) return new Number(value);
  if (value instanceof String) return new String(value);
  if (value instanceof Function) return value;
  if (value instanceof Array) {
    return value.map(item => cloneDeep(item));
  }
  if (value instanceof Object) {
    const obj = {};
    for (let key in value) {
      obj[key] = cloneDeep(value[key]);
    }
    return obj;
  }

  return value;
}

