# 纸人煞：中式民俗 ARG 网页游戏

> 一个部署在 GitHub Pages 的纯静态叙事解谜项目。玩家从旧站、档案、网页源码和场景细节中追索线索，逐步进入纸人、阴司、昆仑、归墟与情卦构成的五章故事。

[在线体验](https://azrielnan.github.io/my-secret-garden/) · [游戏说明](games/zhirensha/README.md) · [当前版本通关教程](games/zhirensha/当前版本通关教程.md) · [简历表述参考](RESUME.md)

![纸人煞主视觉](games/zhirensha/images/zhirensha-promo-keyart.png)

## 项目亮点

- **五章连续叙事**：从民俗怪谈延展到阴司契约、昆仑神话、归墟因果和道家终局，章节结局会写入浏览器本地状态并影响后续文案与场景。
- **ARG 交互设计**：线索分布于 HTML 注释、近底色文本、选中复制事件、悬停、右键、Canvas 显影、拖拽、组合按键与跨场景物件描述中。
- **非线性探索结构**：第三至第五章采用“中心枢纽 + 花瓣式探索区”，玩家可自由调查，关键遗物与双钥匙机制负责收束主线。
- **无框架前端实现**：以 HTML、CSS、原生 JavaScript、Canvas、Web Audio 和 `localStorage` 完成互动、绘制、状态持久化和跨章分支。
- **静态部署友好**：无需构建服务或后端，可部署到 GitHub Pages、Cloudflare Pages、Netlify、Nginx 或任意静态托管环境。

## 项目结构

```text
.
├─ games/zhirensha/          # 《纸人煞》完整游戏
│  ├─ chapter2-contract.html # 阴司债
│  ├─ chapter3-forgotten-river.html
│  ├─ chapter4-guixu-zhulong.html
│  ├─ chapter5-bagua-guiyuan.html
│  ├─ secret/                # 第一章仪式与隐藏补卷
│  ├─ js/                    # 原生交互、ARG 扩充、叙事重构
│  └─ images/                # 场景与角色美术资产
├─ assets/                   # 站点入口资源
├─ games.json                # 可扩展游戏目录元数据
├─ index.html                # 当前默认跳转至《纸人煞》序章
└─ RESUME.md                 # 基于真实实现的简历表述参考
```

## 核心实现

| 模块 | 实现方式 |
| --- | --- |
| 跨章状态 | `localStorage` 记录结局、遗物、道藏、玩家留言与分支回声。 |
| ARG 线索 | 源码注释、CSS 近底色文字、复制事件、右键菜单、热点、悬停与键盘组合。 |
| 画面与谜题 | Canvas 噪点显影、场景绘制、拖拽配对、手写轨迹、动态频谱与 Web Audio 短音效。 |
| 叙事结构 | 前两章建立谜团，后三章使用“三生石 / 归墟门 / 太极图”作为自由探索枢纽。 |
| 质量控制 | 通过 Node.js 对内联脚本与外部脚本做解析校验，并检查章节间本地链接完整性。 |

## 本地运行

项目不依赖构建工具。可直接打开 `games/zhirensha/prologue.html`，或使用任意静态服务器：

```powershell
python -m http.server 4173 --directory .
```

然后访问 `http://localhost:4173/`。

## 继续扩展

`games.json` 保留了多游戏目录能力。新增作品时在 `games/` 下放置独立静态项目，并在 `games.json` 添加入口、封面和描述即可。

## License

本仓库用于个人作品展示。故事、文字、美术与交互代码未经授权不得用于商业发布。
