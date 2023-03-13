/**
 * pub-sub base demo
 * 发布订阅者模式 -- 比观察者模式多中间管理
 */

class Subscriber {
  constructor(name, eventBus) {
    this.name = name;
    this.eventBus = eventBus;
  }

  sub(topic, callback) {
    this.eventBus.on(topic, callback);
  }

  unSub(topic) {
    this.eventBus.off(topic)
  }
}

class EventBus {
  constructor(name) {
    this.name = name
    this.topics = {}
  }

  on(topic, callback) {
    const callbacks = this.topics[topic] || (this.topics[topic] = [])
    const index = callbacks.findIndex(i => i.callback === callback);

    if (index >= 0) {
      // 重复绑定更新，也可以考虑支持数组
      callbacks.splice(index, 1, callback);
    } else {
      callbacks.push(callback);
    }
  }

  off(topic, callback) {
    const callbacks = this.topics[topic];
    if (!callbacks?.length) return false;

    const index = callbacks.findIndex(i => i.callback === callback);

    if (index >= 0) {
      callbacks.splice(index, 1);
    }
  }

  emit(topic, data) {
    const callbacks = this.topics[topic];
    if (!callbacks?.length) return false;
    callbacks.forEach(cb => cb(data));
  }

  // other methods
}

// 也可以省略
class Publisher {
  constructor(name, eventBus) {
    this.name = name;
    this.eventBus = eventBus;
  }

  pub(topic, data) {
    this.eventBus.emit(topic, data);
  }
}

const eb = new EventBus('eb');
const sub1 = new Subscriber('sub-1', eb)
const sub2 = new Subscriber('sub-2', eb)

sub1.sub('t1', console.log)
sub1.sub('t2', console.log)

new Publisher('pub2', eb).pub('t1', 'this is topic t1 message')
new Publisher('pub2', eb).pub('t2', 'this is topic t2 message')



