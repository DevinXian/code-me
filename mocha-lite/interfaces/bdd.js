import Suite from '../src/suite.js'
import Test from '../src/test.js';
import { promisify } from '../src/utils.js';

export default function (context, root) {
  const suites = [root]

  context.describe = context.context = function (title, callback) {
    // 为了嵌套，取栈顶
    const current = suites[0]
    const suite = new Suite(current, title);

    // 加入栈，弹出，则达到嵌套效果
    suites.unshift(suite)
    callback.call(suite)
    suites.shift();
  }

  context.it = context.specify = function (title, fn) {
    // 获取当前suite
    const current = suites[0]
    const test = new Test({
      title,
      fn: promisify(fn)
    })
    current.tests.push(test);
  }

  context.before = function (fn) {
    const cur = suites[0];
    cur._beforeAll.push(promisify(fn));
  }

  context.after = function (fn) {
    const cur = suites[0];
    cur._afterAll.push(promisify(fn));
  }

  context.beforeEach = function (fn) {
    const cur = suites[0];
    cur._beforeEach.push(promisify(fn));
  }

  context.afterEach = function (fn) {
    const cur = suites[0];
    cur._afterEach.push(promisify(fn));
  }
}
