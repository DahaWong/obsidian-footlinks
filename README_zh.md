# 尾链 Footlinks
> 这是一个[黑曜石](https://obsidian.md)（Obsidian）第三方插件。

（[En](https://github.com/DahaWong/obsidian-footlinks/blob/main/README.md) | 简）

这个插件可以把

```md
... [text1](url1) ...
... [text2](url2) ...
... [text3](url3) ...
```
转换成

```md
... [text1] ...
... [text2] ...
... [text3] ...

[text1]: url1
[text2]: url2
[text3]: url3
```

## 加载
1. 前往 [安装包]。
2. 从 `Assets` 下载最新的 `main.js` 及 `manifest.json`，然后把它们放入`..<你的笔记仓库>/.obsidian/plugins/footlinks/`。
3. 刷新(`Ctrl/Cmd + R`) Obsidian 页面.
4. 打开 `Settings -> Third-party Plugins -> Footlinks` 中的开关。

## 使用
- 在主页左侧菜单栏点击 Footlinks 的图标.
- 或者**打开指令面板**（Cmd/Ctrl + p） 输入`Footlinks`

## 设置
在 `Footlinks` 设置页面，可以:
-  在正文和尾链之间添加一个分割线`---`（默认为空）
- 决定是否在主页左侧菜单栏中显示图标。



[releases]: https://github.com/DahaWong/obsidian-footlinks/releases
