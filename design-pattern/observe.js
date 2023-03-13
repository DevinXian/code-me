/**
 * observer basic demo
 */
class Observer {
  constructor(name) {
    this.name = name
  }

  update() {
    console.log(`Observer ${this.name} updated!`);
  }

}

class Observable {
  constructor() {
    this.obs = []
  }

  add(ob) {
    const index = this.obs.findIndex(i => i === ob);

    if (index === -1) {
      this.obs.push(ob)
    }

    return this;
  }

  remove(ob) {
    const index = this.obs.findIndex(i => i === ob);

    if (index !== -1) {
      this.obs.splice(index, 1);
    }
    return this;
  }



  notify() {
    this.obs.forEach(ob => ob.update())
  }
}


const ob1 = new Observer('tmax');
const ob2 = new Observer('juliet');
new Observable().add(ob1).add(ob2).notify();
