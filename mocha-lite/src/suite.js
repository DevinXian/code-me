export default class Suite {
  constructor(parent, title) {
    this.parent = parent;
    this.title = title;
    this.suites = []
    this.tests = []
    this._beforeAll = [];
    this._afterAll = []
    this._beforeEach = []
    this._afterEach = []

    if (parent instanceof Suite) {
      parent.suites.push(this) // 树形结构的关键
    }
  }
}
