import path from 'path'
import Suite from './suite.js'
import { bdd } from '../interfaces/index.js'
import Runner from './runner.js';
import { findCaseFile } from './utils.js'

class Mocha {
  constructor() {
    this.rootSuite = new Suite(null, '');
    // 注入全局 API
    bdd(global, this.rootSuite)
  }

  async resolveTests() {
    // 可以改为配置
    const dirname = new URL(import.meta.url).pathname
    const spec = path.resolve(dirname, '../../test');
    const files = findCaseFile(spec);
    // 加载测试用例文件，构建测试用例结构树
    await Promise.all(files.map(file => import(file)))
  }

  async run(print) {
    await this.resolveTests();
    const runner = new Runner();
    print(runner);
    runner.run(this.rootSuite);
  }
}

export default Mocha;
