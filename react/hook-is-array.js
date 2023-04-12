const hooks = []
const hookIndex = 0;

function useState(initialState) {
  if (hooks[hookIndex]) {
    hookIndex++;
    return hooks[hookIndex]
  }

  const pair = [initialState]
  pair.push((newState) => {
    pair[0] = newState
    reRender();
  });
  hooks.push(pair); // 等价于 hooks[hookIndex] = pair
  hookIndex++;

  return pair;
}

// 代码可简化 todo
function useEffect(callback, deps) {
  let hook = hooks[hookIndex];
  if (hook) {
    const [lastDeps] = hook;
    // 必须依赖项有变化才会执行副作用
    const changed = lastDeps? deps.some((dep, index) => dep !== lastDeps[index]): true;
    if (changed) {
      callback(); // 可返回 cleanup 函数，等待卸载执行
      hook[1] = callback;
    }
  } else {
    hook = [deps, callback]
    callback(); // 可返回 cleanup 函数，等待卸载执行
  }
  
  hookIndex++;
}



