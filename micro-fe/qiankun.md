### Sandbox

1. snapshotSandbox: 通过快照来进行恢复和切换沙箱状态，只能有一个，污染 window 全局对象，但可以在没有 Proxy
2. proxySandbox

  1. lagecySandbox 在 proxy 中进行设置拦截，记录 modify 和 add 变量，并同步到 window 上；会造成全局污染，但不用遍历 window，性能稍好
  2. proxySandbox 原理和 micro-app 一样，可以同时存在多个而互不影响；获取属性，有限从被代理对象获取，没有再回退到 window；设置属性，不会落到window上，直接在被代理对象上

参考：[qiankun sandbox 源码](https://github.com/umijs/qiankun/tree/master/src/sandbox)
