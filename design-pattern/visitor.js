let eId = 0;

class BaseElement {
  constructor(name) {
    this.id = ++eId;
    this.name = name; // 属性修改影响 visitor 实现
  }

}

class KpiElement extends BaseElement {
  constructor(name) {
    super(name);
    this.kpi = Math.round(Math.random(1000));
  }

  getKpiSummary() {
    return 'excellent kpi'
  }

  // 接受外部访问者
  accept(visitor) {
    visitor.visit(this);
    // 此处可以通过 this 调用一些方法，违反了 迪米特法则
    // 此处传入的 visitor 必须是具体类，不然无法实现区分逻辑
  }
}

class CodeElement extends BaseElement {
  constructor(name) {
    super(name);
    this.point = Math.round(Math.random(1000000));
  }

  getCodeSummary() {
    return 'great coder'
  }

  // 接受外部访问者
  accept(visitor) {
    visitor.visit(this);
  }
}

// 接口类
class BaseVisitor {
  /**
   * @param {BaseElement} element 接口类型，传入不同子类
   */
  visit(element) {
    throw new Error('Should be implemented in sub class')
  }
}

class ScoreVisitor extends BaseVisitor {
  /**
   * js 无法方法重载，只能 if else
   * 理论上应该是上个 visit 方法，通过重载接收不同的 Element 实例，如下：
   * visit(element: CodeElement);
   * visit(element: KpiElement);
   * 
   * @param {*} element 
   */
  visit(element) {
    if (element instanceof CodeElement)
      console.log('name: ', element.name, ' point: ', element.point);
    else if (element instanceof KpiElement)
      console.log('name: ', element.name, ' kpi: ', element.kpi);
  }

}

class SummaryVisitor extends BaseVisitor {
  /**
   * @param {*} element 
   */
  visit(element) {
    if (element instanceof CodeElement)
      console.log('name: ', element.name, ' summary: ', element.getCodeSummary());
    else if (element instanceof KpiElement)
      console.log('name: ', element.name, ' summary: ', element.getKpiSummary());
  }
}

/**
 * 总结：不同 Visitor 关注点不同
 */

const visitor1 = new ScoreVisitor()
const visitor2 = new SummaryVisitor()

const element1 = new CodeElement('code killer');
const element2 = new KpiElement('kpi runner');

// 集合（或其他数据结构）遍历
[element1, element2].forEach(ele => {
  ele.accept(visitor1)
  ele.accept(visitor2)
})






