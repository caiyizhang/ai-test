# 📋 Kanban Board System (任务看板系统)

这是一个基于现代化技术栈构建的轻量级任务管理看板系统，支持任务的拖拽流转、状态管理及实时交互。界面简洁美观，采用 Docker 容器化部署，开箱即用。

## ✨ 功能特性

- **可视化看板**：提供 To Do（待办）、In Progress（进行中）、Done（已完成）三个状态列。
- **拖拽交互**：支持通过拖拽卡片在不同状态间流转任务。
- **任务管理**：支持快速添加新任务、删除任务。
- **现代化 UI**：
  - 基于 **Ant Design Vue** 和 **Tailwind CSS** 构建。
  - 响应式布局，适配不同屏幕尺寸。
  - 清晰的状态颜色区分（蓝/橙/绿）。
- **容器化部署**：使用 Docker Compose 一键启动前后端及数据库服务。

## 🛠 技术栈

### Frontend (前端)
- **Framework**: Vue 3 (Composition API)
- **Build Tool**: Vite
- **UI Library**: Ant Design Vue 4.x
- **Styling**: Tailwind CSS 3.x
- **Drag & Drop**: vuedraggable (Sortable.js)
- **HTTP Client**: Axios

### Backend (后端)
- **Framework**: Django 4.x
- **API**: Django REST Framework (DRF)
- **Database Connector**: PyMySQL

### Database (数据库)
- **Database**: MySQL 8.0

### DevOps
- **Containerization**: Docker & Docker Compose
- **Server**: Django Development Server / Vite Dev Server (开发模式)

## 🚀 快速开始

### 前置要求
- 安装 [Docker](https://www.docker.com/) 和 [Docker Compose](https://docs.docker.com/compose/)。

### 启动项目

1. **克隆仓库** (如果已在本地则跳过)
   ```bash
   git clone <repository-url>
   cd ai-test
   ```

2. **启动服务**
   在项目根目录下运行以下命令：
   ```bash
   docker compose up -d --build
   ```
   *该命令会自动构建镜像并启动 Backend、Frontend 和 Database 容器。*

3. **访问应用**
   服务启动后，可以通过以下地址访问：
   - **前端页面 (看板)**: [http://localhost:5173](http://localhost:5173)
   - **后端 API**: [http://localhost:8001/api/tasks/](http://localhost:8001/api/tasks/)

### 常用操作命令

- **查看日志**:
  ```bash
  docker compose logs -f
  ```
- **重启前端**:
  ```bash
  docker compose restart frontend
  ```
- **停止服务**:
  ```bash
  docker compose down
  ```

## 📂 项目结构

```
.
├── backend/                # Django 后端代码
│   ├── config/             # 项目配置 (settings.py, urls.py)
│   ├── tasks/              # 任务应用 (models, views, serializers)
│   ├── Dockerfile          # 后端镜像构建文件
│   └── requirements.txt    # Python 依赖
├── frontend/               # Vue 前端代码
│   ├── src/
│   │   ├── components/     # 组件 (KanbanBoard.vue)
│   │   └── ...
│   ├── Dockerfile          # 前端镜像构建文件 (Node 22)
│   ├── package.json        # JS 依赖
│   ├── tailwind.config.js  # Tailwind 配置
│   └── vite.config.js      # Vite 配置
├── docker-compose.yml      # 容器编排配置
└── README.md               # 项目文档
```

## 🔌 API 接口说明

后端提供标准的 RESTful API 接口：

| 方法 | 路径 | 描述 |
| --- | --- | --- |
| `GET` | `/api/tasks/` | 获取所有任务列表 |
| `POST` | `/api/tasks/` | 创建新任务 |
| `PATCH` | `/api/tasks/{id}/` | 更新任务状态 (拖拽时触发) |
| `DELETE` | `/api/tasks/{id}/` | 删除任务 |

## 📝 开发备注

- **数据库迁移**: 容器启动时会自动执行 `makemigrations` 和 `migrate`，无需手动干预。
- **跨域配置 (CORS)**: 后端已配置 `django-cors-headers` 允许前端 `localhost:5173` 的请求。
- **Node 版本**: 前端容器使用 `node:22-alpine` 以兼容最新的 Vite 版本。
