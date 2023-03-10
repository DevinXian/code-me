/**
 * redux 核心 applyMiddleware 实现解析
 * 
 * 注：参考 createStore 源码，实际上本方法是个 enhanceReducer，每次 dispatch 都会执行
 *   const store = createStore(
 *     reducers.todos,
 *     applyMiddleware(multiArgMiddleware, dummyMiddleware) // 类型为 function 则为 enhancer
 *   )
 */
/**
 * @param {Function[]} fns
 */
const compose = (fns) => {
  if (!fns.length) {
    return arg => arg;
  }

  if (fns.length === 1) {
    return fns[0];
  }

  return fns.reduce((prev, curr) => {
    return (...arg) => {
      prev(curr(...arg))
    }
  });

}
export const applyMiddleware = (middlewares) => {
  return (createStore) => (reducer, initialState) => {
    const store = createStore(reducer, initialState);
    let realDispatch = () => {
      throw new Error('不应该调用');
    }

    const middlewareAPI = {
      getState: store.getState,
      dispatch: (action) => realDispatch(action) // 是中间件能访问最终 realDispatch，拥有发起能力
    }

    const chain = middlewares.map(m => m(middlewareAPI));

    realDispatch = compose(...chain)(store.dispatch);

    /**
     * 中间件模式 const middle = store => next => next(action)
     * 第一层调用注入有限的 API 能力
     * 第二层 next => next(action) 则是 compose 关键，达到了 store.dispatch 层层穿透效果
     * 比如 compose(f1, f2, f3), f3 是最内层，真正用到了 store.dispatch，而 f2 中的 next 是 f3 函数体，同理，f1 中的 next 是 f2 的函数体，依次类推...
     */

    return {
      ...store,
      dispatch: realDispatch,
    }
  }

}
