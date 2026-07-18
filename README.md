# YE NAN Portfolio

一个使用原生 HTML、CSS、JavaScript 和 Three.js 构建的个人作品集网站。

## 本地运行

```bash
npm run build
python3 -m http.server 4173 -d dist
```

打开 <http://127.0.0.1:4173/>。

## 发布

Cloudflare Pages 使用以下设置：

- Build command: `npm run build`
- Build output directory: `dist`
- Node.js: 18 或更高版本

运行时文件只来自 `assets/`、`css/`、`js/` 和 `index.html`。原始照片、视频、模型与设计参考保存在本地 `source-assets/`，不会发布。

## 素材优化

macOS 下运行 `npm run optimize:assets` 可重新生成 WebP 图片和低码率展示视频。图片步骤需要 Python 3 与 Pillow，原始素材不会被覆盖。
