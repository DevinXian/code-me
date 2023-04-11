function shuffle(list) {
  for (let i = 0; i < list.length; i++) {
    const index = Math.floor(Math.random() * (list.length - i)) + i;
    [list[i], list[index]] = [list[index], list[i]]
  }
  return list;
}

// const list = [0, 0, 0, 1, 1, 1, 2, 2, 2];
// console.log(shuffle(list))
