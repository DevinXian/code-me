### CommonJS vs ES6 modules

### CommonJS 

1. 运行时获取模块，所以无法确定哪些导出和导入是不需要的，不能 tree shaking
2. 循环引用有初始化先后问题，只会输出已经初始化部分
3. exports 值拷贝，修改导出变量不影响内部值
4. this 为当前模块

### ES modules

1. 静态导入，在编译时输出接口，所以可以进行模块静态分析，进一步支持 tree shaking
2. 循环引入，变量不会被缓存，而是通过引用访问，所以能取到最终值(待分析)
3. this 为 undefined

### 结合

1. ES modules 中可以使用 require（node端）
2. CMD 并不能 require es6 模块，需要指定 type: module 或者 .mjs 文件等o

### tree-shaking

1. webpack 不能配置 babel 翻译掉 es module 规范模块，且 optimization.usedExports: true，否则无法静态分析
2. 模块需要配置 sideEffects 表明可以被 tree-shaking 的文件； 或者 PURE 注解
3. 原理是标记没有使用的 export 内容，最后在 Terser 删除掉被标记的内容
