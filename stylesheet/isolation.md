### 样式隔离

1. Scoped CSS （vue 典型）
2. CSS in JS （styled Component 典型），tagedFunction，有运行时损耗
3. CSS Modules，CSS 作为 module 引入，在组件中使用，最后对应选择器变为 hash
4. BEM，基于规范，选择器比较长，容易出问题
5. ShadowDOM，兼容性有点问题
6. 预处理器添加统一前缀；典型场景，更改第三方组件库类名前缀等
