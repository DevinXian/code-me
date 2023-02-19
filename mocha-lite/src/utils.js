import fs from 'fs';
import path from 'path'

export function findCaseFile(filepath) {
  function readFileList(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    files.forEach((item, _) => {
      var fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        readFileList(path.join(dir, item), fileList);  // 递归读取文件
      } else {
        fileList.push(fullPath);
      }
    });
    return fileList;
  }

  const fileList = [];
  // 路径如果是文件则直接返回
  try {
    const stat = fs.statSync(filepath);
    if (stat.isFile()) {
      fileList = [filepath];
      return fileList;
    }
    readFileList(filepath, fileList);
  } catch (e) { console.log(e) }

  return fileList;
}

export function promisify(fn) {
  return () => new Promise((resolve, reject) => {
    // 使用done
    if (fn.length !== 0) {
      fn(err => {
        err ? reject(err) : resolve()
      });
      return
    }

    try {
      const result = fn();
      if (result instanceof Promise) {
        result.then(resolve, reject)
      } else {
        resolve(result)
      }
    } catch (err) {
      reject(err)
    }
  })
}
