# 口腔牙列印模制取虚拟仿真实训系统

基于 React、Vite、Tailwind CSS 和 React Three Fiber 开发的口腔医学虚拟仿真实训网页。项目包含病例学习、知识学习、标准流程训练、三维模型展示、可点击实景训练、自动评分和实验报告。

## 本地运行

```bash
npm install
npm run dev
```

浏览器访问终端显示的本地地址。

## 生产构建

```bash
npm run build:static
```

构建结果位于 `dist`。

## GitHub Pages

仓库中的 `.github/workflows/deploy-pages.yml` 会在 `main` 分支更新后自动构建并发布 GitHub Pages。PWA 和 GLB 模型资源会根据仓库名称自动使用正确的基础路径。

## 模型文件

GLB 模型放置在 `public/models`。替换模型时请保留代码中使用的文件名，或同步修改模型配置。
