### flex vs grid

1. flex 一维，基于内容，更加关注元素对齐和空间；更关注小型或局部布局，适合组件布局
2. grid 二维，基于布局(layout)，更适合大型及非线性布局
3. flex 关注点是内容流动，宽（高）是由内容和剩余空间来决定，默认不会被布局约束
4. grid 关注点是内容放置，把空间划分为一定的行和列，然后把内容放置进去，可以更容易实现复杂布局
5. 区分关键：

    - content shapes layout -> flexbox; 
    - layout shapes content ->  grid

### 典型场景

5个div，flexbox 一行放置了3个，另一行放置了2了，统一设置 flex: 1，则第二行2个div会占满全部行空间，这样从垂直看就无法对齐；需要固定宽度或者hack手段；这种情况下，grid 就很容易做到


### 参考资料
[flex vs grid](https://webdesign.tutsplus.com/articles/flexbox-vs-css-grid-which-should-you-use--cms-30184) 这篇文章 *不认可* 1 和 2 说法。

[MDN flex-grid](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout/Relationship_of_Grid_Layout) 重点：只需要一行？flexbox；同时关注行和列？gridlayout

[video](https://www.youtube.com/watch?v=18VLSXfsj94)