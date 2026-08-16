# 我的个人博客

由 **Hexo + Butterfly** 驱动，代码存放在 GitHub，由**腾讯 EdgeOne Pages** 和 **GitHub Pages** 双平台自动构建发布（均免费）。

## 两个访问地址

| 地址 | 适合 | 说明 |
| ---- | ---- | ---- |
| <https://1987066289.github.io/blog/> | 海外及国内（时快时慢） | GitHub Pages 镜像，大陆可直接访问但速度不稳定 |
| <https://lcs-blog-3rydeodl.edgeone.cool> | 仅海外网络 | EdgeOne Pages 主站，大陆直接访问返回 401（平台规则） |

> 大陆临时查看主站：到 [EdgeOne Pages 控制台](https://console.cloud.tencent.com/edgeone/makers/project/makers-r4lbbqvgpcly/index) 点右上角「预览」生成 3 小时有效链接。
> 想让大陆读者稳定快速访问：绑自己的域名（免费方案见下），或以后购买域名。

## 双平台自动部署

- **EdgeOne Pages**（主站）：连接 GitHub 仓库，每次推送自动构建
- **GitHub Pages**（镜像）：`.github/workflows/deploy-pages.yml` 工作流，每次推送自动构建；站点配置覆盖见 `_config.ghpages.yml`
- 两边构建互不影响：主站用 `_config.yml`，镜像用 `_config.yml + _config.ghpages.yml` 合并配置

## 免费获得自己域名的路径（可选升级）

1. 申请 [eu.org](https://nic.eu.org/) 免费域名（如 `你的名字.eu.org`，需人工审核数天~数周）
2. 到 [Cloudflare](https://www.cloudflare.com/) 免费托管解析
3. EdgeOne 控制台「域名管理」绑定（加速区域选「全球不含中国大陆」可免备案）
4. 改 `_config.yml` 里的 `url` 并提交即可

---

## 📝 如何发布一篇新文章（全程浏览器操作，1 分钟）

1. 打开本仓库，进入 `source/_posts/` 目录
2. 点右上角 **Add file → Create new file**
3. 文件名随便起（建议英文或拼音，如 `my-first-post.md`，以 `.md` 结尾）
4. 粘贴下面的模板并填写正文：

   ```yaml
   ---
   title: 文章标题
   date: 2026-08-16 12:00:00
   tags:
     - 标签1
   categories:
     - 分类1
   ---

   正文用 Markdown 写……
   ```

5. 拉到页面底部点绿色按钮 **Commit changes**
6. 等约 1 分钟，博客自动更新 ✅

> 更详细的写法见博客里的《写作指南：一篇文章的结构》一文，或 `source/_posts/markdown-writing-guide.md`。

## ✏️ 常见修改速查

| 想改什么 | 改哪个文件 |
| ---- | ---- |
| 站名、副标题、作者、简介 | `_config.yml` 顶部「Site」区域 |
| 菜单、侧边栏、头像、深色模式等外观 | `_config.butterfly.yml`（有中文注释） |
| 「关于」页面 | `source/about/index.md` |
| 头像 / 图片 | 上传到 `source/img/`，引用时写 `/img/文件名` |
| 文章版权声明的名字和链接 | `_config.butterfly.yml` 中 `post_copyright` 段 |

改完同样点 Commit 即可自动发布，无需任何本地工具。

## 🖼️ 如何在文章里放图片

1. 在仓库打开 `source/img/` 目录，**Add file → Upload files** 上传图片
2. 文章里写：`![图片说明](/img/图片文件名.jpg)`

## 🌐 部署原理（了解即可）

```
你改了仓库 (GitHub)
        │  自动触发
        ▼
EdgeOne Pages 拉取代码 → 运行 hexo generate 生成静态页面
        │
        ▼
发布到 CDN，全球（含国内）可访问，自动 HTTPS
```

- **托管平台**：[EdgeOne Pages](https://console.cloud.tencent.com/edgeone/pages) —— 免费、无需备案、腾讯 CDN 国内访问快
- **框架**：[Hexo](https://hexo.io/)（构建命令 `npm run build`，输出目录 `public`）
- **主题**：[Butterfly](https://butterfly.js.org/)（通过 npm 安装，升级只需改 `package.json` 版本号）

## 🔧 本地预览（可选，不装也完全不影响使用）

如果想在电脑上先看效果再发布（需要安装 [Node.js](https://nodejs.org/)）：

```bash
npm install      # 首次
npm run server   # 启动预览，浏览器打开 http://localhost:4000
npm run build    # 手动构建到 public/
```

## 📁 目录结构

```
_config.yml              # 站点配置（站名、作者等）
_config.butterfly.yml    # 主题外观配置（菜单、侧边栏等）
source/
  _posts/                # ★ 所有文章都放这里
  about/index.md         # 「关于」页面
  tags/  categories/     # 标签页、分类页
  img/                   # 图片素材
scaffolds/               # 新文章模板
```
