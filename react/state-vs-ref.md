### useState vs useRef

1. 都是用来在渲染和UI更新过程中存储状态，但是只有 useState 会因为重新渲染
2. 语法不同，useRef 返回一个持有 current 属性的对象；useState 则返回数组（状态和其 updater）
3. useRef().current 是可以直接更改的；而 state 必须通过 updater 来更改
4. 只有 useRef() 能够绑定到 React 组件或者 DOM 元素，如 `<input ref={inputRef} />`

### 典型案例分析

1. 为何不能用 let 替代 useRef

```javascript
const App = () => {
  const [count, setCount] = useState(0);
  let prevCount;
  useEffect(() => {
    prevCount = count;
  }, [count]);
  return (
    <div className="App">
      <h1>
        Now: {count}, before: {prevCount}
      </h1>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
};
// 每次 before 都是 undefined，因为 prevCount 是在 useEffect 内部跟新的，也就是 render 结束；当 count 改变，则 prevCount 更改，此时重新渲染，但是 prevCount 又被重新声明，变为 undefined.
// If you’re familiar with React class lifecycle methods, you can think of useEffect Hook as componentDidMount, componentDidUpdate, and componentWillUnmount combined.
```

2. 封装一个 usePrevious

```js
import { useState, useEffect, useRef } from "react";
function App() {
  const [count, setCount] = useState(0);
  const prevCount = usePrevious(count);
  return (
    <div>
      <h1>
        Now: {count}, before: {prevCount}
      </h1>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}

// Hook
function usePrevious(value) {
  // The ref object is a generic container whose current property is mutable ...
  // ... and can hold any value, similar to an instance property on a class
  const ref = useRef();
  // Store current value in ref
  useEffect(() => {
    ref.current = value;
  }, [value]); // Only re-run if value changes
  // Return previous value (happens before update in useEffect above)
  return ref.current;
}
```
