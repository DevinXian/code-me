import { EVENT, COLORS } from '../src/consts.js'

function message(type, str) {
  return '\u001b[' + COLORS[type] + 'm' + str + '\u001b[0m';
}

export default function print(runner) {
  let time = Date.now();
  let indentCount = 0;
  let passCount = 0;
  let failCount = 0;

  function indent(isSub) {
    return Array(indentCount + isSub ? 1 : 0).join(' ');
  }

  runner.on(EVENT.runBegin, function () {
    console.log('------------- Mocha run start -----------')
  });

  runner.once(EVENT.runEnd, function () {
    console.log('------------- Mocha run end -----------')
    console.log(message('green', '  %d passing'), passCount, message('pass', `(${Date.now() - time}ms)`));
    console.log(message('fail', '  %d failing'), failCount);
  });

  runner.on(EVENT.suiteBegin, function (suite) {
    indentCount++;
    console.log(indent(), suite.title);
  });

  runner.on(EVENT.suiteEnd, () => {
    indentCount--;
    if (indentCount == 1) console.log(); // 最后一行换行
  })

  // 用例通过
  runner.on(EVENT.pass, function (title) {
    passCount++;
    const fmt = indent(1) + message('green', '  ✓') + message('pass', ' %s');
    console.log(fmt, title);
  });
  
  // 用例失败
  runner.on(EVENT.fail, function (title) {
    failCount++;
    const fmt = indent(1) + message('fail', '  × %s');
    console.log(fmt, title);
  });
}

