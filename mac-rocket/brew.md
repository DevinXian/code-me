### Homebrew 更新太慢解决方法

1. 查看

```bash
# 进入 brew 的仓库根目录
cd "$(brew --repo)"

# 查看仓库地址
git remote -v

# 显示 github 源，较慢
```

2. 更换 brew 和 brew-core 的 remote url

```base
git remote set-url origin https://mirrors.ustc.edu.cn/brew.git

cd ./Library/Taps/homebrew/homebrew-core"
git remote set-url origin https://mirrors.ustc.edu.cn/homebrew-core.git

brew update
```

3. 愉快更新


#### 参考 https://segmentfault.com/a/1190000021114534?utm_source=tag-newest