import { EventEmitter } from 'events'
import { EVENT } from './consts.js'

export default class Runner extends EventEmitter {
  constructor() {
    super();
    this.suites = []
  }

  async run(root) {
    this.emit(EVENT.runBegin)
    await this.runSuite(root)
    this.emit(EVENT.runBegin)
  }

  async runSuite(suite) {
    this.emit(EVENT.suiteBegin, suite)

    // beforeAll
    for (const fn of suite._beforeAll) {
      try {
        await fn();
      } catch (err) {
        this.emit(EVENT.fail, `"before all" hook in ${suite.title}: ${err.message}`);
        // suite执行结束
        this.emit(EVENT.suiteEnd);
        return;
      }
    }

    this.suites.unshift(suite); // 放入栈顶

    // run tests
    for (const test of suite.tests) {
      await this.runTest(test);
    }

    // sub suites
    for (const sub of suite.suites) {
      await this.runSuite(sub);
    }

    this.suites.shift(); // 弹出栈顶

    // afterAll
    for (const fn of suite._afterAll) {
      try {
        await fn();
      } catch (err) {
        this.emit(EVENT.fail, `"after all" hook in ${suite.title}: ${err.message}`);
        // suite执行结束
        this.emit(EVENT.suiteEnd);
        return;
      }
    }

    this.emit(EVENT.suiteEnd, suite);
  }

  async runTest(test) {
    // execute beforeEach from root to current suite in order
    // 当前节点在最前面，所以 reverse 改变顺序
    const beforeList = [...this.suites].reverse().reduce((list, curr) => list.concat(curr._beforeEach), [])
    for (const each of beforeList) {
      try {
        await each();
      } catch (err) {
        this.emit(EVENT.fail, `"before all" hook in ${each.title}: ${err.message}`);
        return;
      }
    }

    try {
      await test.fn(); // 执行测试用例
      this.emit(EVENT.pass, test.title);
    } catch (err) {
      this.emit(EVENT.fail, `${test.title}: ${err.message}`);
      return;
    }

    // execute afterEach from current to root suite in order
    const afterList = [...this.suites].reduce((list, curr) => list.concat(curr._afterEach), [])
    for (const each of afterList) {
      try {
        await each();
      } catch (err) {
        this.emit(EVENT.fail, `"after all" hook in ${each.title}: ${err.message}`);
        // suite执行结束
        this.emit(EVENT.suiteEnd);
        return;
      }
    }
  }
}
