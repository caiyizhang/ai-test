# 对话总结：看板任务管理系统开发

## 1. 任务目标
实现一个基于 **Python (Django)** 后端、**Vue 3** 前端和 **MySQL** 数据库的看板任务管理系统，并支持 **Docker Compose** 一键部署。核心功能包括任务的拖拽管理（Todo/Doing/Done）。

## 2. 技术栈与环境
*   **Backend**: Python 3.9, Django 4.2, Django REST Framework, PyMySQL
*   **Frontend**: Node.js 22, Vue 3, Vite, vuedraggable (拖拽组件), Axios
*   **Database**: MySQL 8.0
*   **DevOps**: Docker, Docker Compose

## 3. 实施步骤

### 3.1 后端初始化 (Backend)
*   创建 `backend` 目录及 `requirements.txt`。
*   安装依赖：`django`, `djangorestframework`, `django-cors-headers`, `pymysql`, `cryptography`。
    *   *注*：由于 `mysqlclient` 编译依赖问题，替换为纯 Python 实现的 `pymysql`。
*   初始化 Django 项目 `config` 和应用 `tasks`。
*   **配置修改 (`settings.py`)**:
    *   配置 MySQL 数据库连接。
    *   添加 `corsheaders` 支持跨域。
    *   配置 `INSTALLED_APPS` 和 `MIDDLEWARE`。
*   **API 开发**:
    *   定义 `Task` 模型（包含 `title`, `description`, `status`）。
    *   创建 `TaskSerializer` 和 `TaskViewSet`。
    *   注册路由 `/api/tasks/`。
*   创建 `Dockerfile` (Python 3.9)。

### 3.2 前端初始化 (Frontend)
*   创建 `frontend` 目录。
*   使用 Vite 初始化 Vue 项目。
    *   *注*：遇到 Node 版本兼容性问题，升级环境至 Node 20/22。
*   安装 `vuedraggable` 和 `axios`。
*   **组件开发**:
    *   实现 `KanbanBoard.vue`：包含三列（Todo, Doing, Done），支持拖拽更新状态，对接后端 API。
    *   配置 API 地址为 `http://localhost:8001/api/tasks/`。
*   创建 `Dockerfile` (Node 22-alpine)。

### 3.3 容器化编排 (Docker Compose)
*   编写 `docker-compose.yml`。
*   定义服务：`backend` (8000端口映射至主机8001), `frontend` (5173端口), `db` (3306端口映射至主机3307)。
*   配置服务依赖 `depends_on` 和数据卷 `volumes`。

## 4. 遇到的问题与解决方案

| 问题 | 原因 | 解决方案 |
| :--- | :--- | :--- |
| **安装 `mysqlclient` 失败** | 缺少系统级 MySQL 开发库依赖 | 替换为 `pymysql` 并在 `__init__.py` 中伪装为 `MySQLdb`。 |
| **Vite 启动失败** | Node.js 版本过低 (18.x) 不支持当前 Vite 版本 | 升级本地环境及 Docker 镜像至 Node 20/22。 |
| **Docker 连接拒绝** | 端口映射配置混淆 | 修正 `docker-compose.yml` 中的端口映射，确保后端监听 8000 端口。 |
| **Table doesn't exist** | 数据库迁移未成功执行 | **当前状态**：后端容器启动时尝试连接数据库可能过早，或迁移命令未执行成功。 |

## 5. 当前状态与后续步骤
*   **当前状态**：Docker 容器已配置并启动。前端可访问，但后端报错 `(1146, "Table 'kanban.tasks_task' doesn't exist")`，表明数据库表尚未创建。
*   **建议修复操作**：
    1.  进入后端容器手动执行迁移：
        ```bash
        docker compose exec backend python manage.py migrate
        ```
    2.  或者重启后端容器（如果 `Dockerfile` 中包含迁移命令）：
        ```bash
        docker compose restart backend
        ```
