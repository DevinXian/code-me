### Mocha 实现原理

1. 实现全局方法，如 `describe`、`it` 等，挂载到 `global` 上
2. 加载测试文件，通过读取测试文件，构建测试用例结构树: Suite 即包含子 Suite，又包含对应的 Test 用例；
3. 实现运行流程 Runner：

    1. 针对单个 Suite，执行顺序：`beforeAll` 钩子、用例集合、子 Suite、`afterAll` 钩子；此过程递归
    2. 针对单个 Test 用例，执行顺序：`beforeEach` 钩子、当前用例、`afterEach` 钩子
    3. 运行过程中需注意执行的递归过程，采用栈结构来控制流程上下文跳转（重要）
    4. 继承 `EventEmitter` 实现执行流程节点事件分发
    5. reporter 中实现事件监听，并进行统计结果处理

*参考鸣谢：*

1. https://mp.weixin.qq.com/s/jdi7Zupbgald0fwpwD7DUQ
2. 本例已采用 ES Modules 改写。
