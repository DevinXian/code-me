/**
 * KMP 字符串匹配算法
 * 
 * 前缀、后缀：
 * 前缀集合，Harry: { H, Ha, Har, Harr } 不包含自身
 * 后缀集合，Potter: { otter, tter, ter, er, r } 不包含自身
 * 
 * PMT = Partial Match Table
 * 值是字符串的前缀集合与后缀集合的交集中最长元素的长度。
 * 例如，对于”aba”，前缀集合为 { a, ab }，后缀集合 { ba, a }，两个集合的交集为{ a }，长度为1
 * 例如，”ababa”，它的前缀集合为{”a”, ”ab”, ”aba”, ”abab”}，它的后缀集合为{”baba”, ”aba”, ”ba”, ”a”}， 两个集合的交集为{”a”, ”aba”}，其中最长的元素为”aba”，长度为3。
 * 
 * 对于字符串 abababca
 * 
 * index = 5: ababab
 * 前缀 ababa abab aba ab a 
 * 后缀 babab abab aba ba a
 * 共有集合为{ abab aba a } 故而：PMT[5] = 4
 *
 * index = 6: abababc
 * 前缀 ababab ababa abab aba ab a
 * 后缀 bababc ababc babc abc bc c
 * 共有集合为 { } 故而：PMT[6] = 0
 * 
 * abababca
 * 前缀 abababc ababab ababa abab aba ab a
 * 后缀 bababca ababca babca abca bca ca a
 * 共有集合为 { a } 故而：PMT[7] = 1
 * 
 * 同理可得最终： PMT = [0, 0, 1, 2, 3, 4, 0, 1]
 * 
 * 思路分析：
 * 假设前置匹配情况：模式串到索引 j-1，主串到 i-1, 则已经匹配长度长度是j
 * 继续匹配，主串 i 和模式串 j 失配，则当前考虑如果不用子串从头开始匹配，则找到**公共匹配段**进行跳过
 * PMT[j] 表示j之前后缀重合最大值，则子串 [j - PMT[j], j) 这段跟子串 [0, PMT[j]) 是匹配的
 * 同时由于之前主串和模式串匹配，故而主串 [i - PMT[j], i) 段跟子串 [0, PMT[j]) 是匹配的
 * 所以子串索引 j 可以跳到 PMT[j]，省略了 **公共匹配段**
 * 
 * leetcode KMP 图解考：
 * https://leetcode.cn/problems/find-the-index-of-the-first-occurrence-in-a-string/solutions/575568/shua-chuan-lc-shuang-bai-po-su-jie-fa-km-tb86/
 * 
 * @param {string} str 
 * @param {string} target 
 */
function match(str, target) {
  let result = -1;

  if (str.length < target.length) {
    return result;
  }

  // 计算 PMT 数组
  


  // 根据 PMT 数组进行匹配



  return result;
}

