// 监听事件的标识
export const EVENT = {
  runBegin: 'EVENT_RUN_BEGIN',      // 执行流程开始
  runEnd: 'EVENT_RUN_END',          // 执行流程结束
  suiteBegin: 'EVENT_SUITE_BEGIN',  // 执行suite开始
  suiteEnd: 'EVENT_SUITE_END',      // 执行suite结束
  fail: 'EVENT_FAIL',                // 执行用例失败
  pass: 'EVENT_PASS'                 // 执行用例成功
}

// 打印颜色
export const COLORS = {
  pass: 90,
  fail: 31,
  green: 32,
}
