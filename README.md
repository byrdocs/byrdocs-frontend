# byrdocs-frontend

byrdocs.org 前端。

## 安装与开发

```bash
pnpm i       # 安装依赖
pnpm dev     # 启动开发服务器
pnpm build   # 构建生产环境代码
pnpm preview # 本地预览构建结果
```

## 环境变量 `BASE_URL`

`BASE_URL` 用于指定后台 API 的地址，默认值为 `https://byrdocs.org`。在开发或部署时可在环境变量中进行配置，例如在 `.env` 文件或启动命令前导出：

```bash
# .env
BASE_URL=https://example.com
```

## 项目目录结构

- `src/pages`：页面级组件，对应不同路由。
- `src/components`：可复用的界面组件。
- `src/hooks`：项目内自定义的 React Hooks。

