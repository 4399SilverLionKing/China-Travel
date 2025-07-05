# China Travel - 智能旅行规划平台

一个基于AI的智能旅行规划平台，为用户提供个性化的中国旅行体验。该项目采用现代化的全栈架构，集成了地图服务、天气查询、智能对话等功能，为用户打造完整的旅行规划解决方案。

## 🌟 项目特色

- **🤖 AI智能规划**: 基于智谱AI(GLM-4-Plus)的智能行程规划
- **🗺️ 地图集成**: 集成高德地图API，提供精准的地理位置服务
- **🌤️ 天气查询**: 实时天气信息和预报，助力旅行决策
- **📱 响应式设计**: 移动端优先的现代化UI设计
- **🔐 用户认证**: 完整的用户注册、登录和权限管理系统
- **📝 行程管理**: 历史行程记录和管理功能
- **💬 智能对话**: 支持流式响应的AI助手对话

## 🏗️ 项目架构

### 技术栈概览

```
Frontend (Next.js)  ←→  Backend (Spring Boot)  ←→  Database (MySQL)
       ↓                        ↓                        ↓
   AI Agent (FastAPI)  ←→  Cache (Redis)        ←→  External APIs
```

### 核心模块

#### 1. 前端应用 (Frontend)
- **技术栈**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **主要功能**:
  - 响应式地图界面 (高德地图集成)
  - 智能搜索和位置服务
  - 行程规划表单和结果展示
  - 用户认证和个人中心
  - 实时天气信息展示
  - 历史行程管理

#### 2. 后端服务 (Backend)
- **技术栈**: Spring Boot 3.5, Java 17, MyBatis-Plus, Spring Security
- **主要功能**:
  - RESTful API服务
  - JWT身份认证和授权
  - 用户管理和权限控制
  - 行程历史记录管理
  - 数据库操作和事务管理
  - Redis缓存集成

#### 3. AI智能代理 (Agent)
- **技术栈**: FastAPI, LangChain, Python 3.x
- **主要功能**:
  - 智能对话处理
  - 行程规划生成
  - 天气信息查询工具
  - 流式响应支持
  - 多工具集成 (天气、地图等)

## 🚀 快速开始

### 环境要求

- Node.js 18+
- Java 17+
- Python 3.8+
- MySQL 8.0+
- Redis 6.0+

### 安装步骤

#### 1. 克隆项目
```bash
git clone <repository-url>
cd China-Travel
```

#### 2. 前端设置
```bash
cd frontend
npm install
# 或使用 pnpm
pnpm install

# 配置环境变量
cp .env.example .env.local
# 编辑 .env.local 文件，配置API密钥
```

#### 3. 后端设置
```bash
cd backend
# 配置数据库连接
# 编辑 src/main/resources/application.yaml

# 构建项目
mvn clean package
# 运行
java -jar target/travel-0.0.1-SNAPSHOT.jar
```

#### 4. AI代理设置
```bash
cd agent
# 创建虚拟环境
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 安装依赖
pip install -r requirements.txt

# 配置环境变量
cp .env.example .env
# 编辑 .env 文件，配置API密钥

# 运行服务
python -m uvicorn app.main:app --host 0.0.0.0 --port 20001
```

### 环境变量配置

#### 前端 (.env.local)
```env
NEXT_PUBLIC_JAVA_API_BASE_URL=http://localhost:20000
NEXT_PUBLIC_PYTHON_API_BASE_URL=http://localhost:20001
NEXT_PUBLIC_AMAP_API_KEY=your_amap_api_key
```

#### AI代理 (.env)
```env
OPENAI_API_KEY=your_zhipu_api_key
OPENAI_BASE_URL=https://open.bigmodel.cn/api/paas/v4/
AMAP_API_KEY=your_amap_api_key
REDIS_HOST=localhost
REDIS_PASSWORD=your_redis_password
```

#### 后端 (application.yaml)
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/travel
    username: your_db_username
    password: your_db_password
  data:
    redis:
      host: localhost
      password: your_redis_password
```

## 📱 功能特性

### 主要页面

1. **首页地图** (`/`)
   - 交互式地图界面
   - 位置搜索和标记
   - 快速功能入口 (行程规划、位置介绍、天气查询)

2. **行程规划** (`/itinerary/plan`)
   - AI驱动的个性化行程生成
   - 支持多种出行方式和偏好设置
   - Markdown格式的详细行程展示

3. **历史记录** (`/itinerary`)
   - 行程历史管理
   - 收藏和分享功能
   - 快速重新规划

4. **个人中心** (`/profile`)
   - 用户信息管理
   - 登录状态管理
   - 账户设置

### 核心功能

#### 🤖 AI智能规划
- 基于用户输入的出发地、目的地、时间等信息
- 结合天气数据提供合理建议
- 支持历史文化、自然风光、美食、购物等多种偏好
- 生成详细的分天行程安排

#### 🗺️ 地图服务
- 高德地图集成，支持搜索、定位、标记
- 实时位置获取和地址解析
- 交互式地图操作体验

#### 🌤️ 天气服务
- 实时天气信息查询
- 多天天气预报
- 基于位置的自动天气获取

#### 💬 智能对话
- 支持自然语言交互
- 流式响应提升用户体验
- 多轮对话上下文保持

## 🔧 API接口

### 后端API (端口: 20000)

#### 用户认证
- `POST /authenticate/login` - 用户登录
- `POST /authenticate/register` - 用户注册

#### 行程管理
- `GET /itinerary/history` - 获取历史记录
- `POST /itinerary/history` - 保存行程记录
- `DELETE /itinerary/history/{id}` - 删除行程记录

### AI代理API (端口: 20001)

#### 智能对话
- `POST /chat` - 发送聊天消息
- `POST /chat/stream` - 流式聊天响应

## 🛠️ 开发指南

### 项目结构

```
China-Travel/
├── frontend/                 # Next.js前端应用
│   ├── app/                  # App Router页面
│   ├── components/           # 可复用组件
│   ├── lib/                  # 工具库和配置
│   └── public/               # 静态资源
├── backend/                  # Spring Boot后端
│   ├── src/main/java/        # Java源码
│   ├── src/main/resources/   # 配置文件
│   └── pom.xml               # Maven配置
├── agent/                    # Python AI代理
│   ├── app/                  # FastAPI应用
│   ├── requirements.txt      # Python依赖
│   └── venv/                 # 虚拟环境
└── document/                 # 项目文档
```

### 开发规范

1. **代码风格**
   - 前端: ESLint + Prettier
   - 后端: Google Java Style Guide
   - Python: PEP 8

2. **提交规范**
   - 使用语义化提交信息
   - 格式: `type(scope): description`

3. **分支管理**
   - `main`: 主分支
   - `develop`: 开发分支
   - `feature/*`: 功能分支

## 🚢 部署指南

### Docker部署

#### 后端服务
```bash
cd backend
docker build -t china-travel-backend .
docker run -p 20000:20000 china-travel-backend
```

#### 前端应用
```bash
cd frontend
docker build -t china-travel-frontend .
docker run -p 3000:3000 china-travel-frontend
```

### 生产环境配置

1. **数据库优化**
   - 配置连接池
   - 设置索引优化
   - 定期备份策略

2. **缓存策略**
   - Redis集群配置
   - 缓存过期策略
   - 缓存预热

3. **安全配置**
   - HTTPS证书配置
   - API限流设置
   - 敏感信息加密

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- [高德地图API](https://lbs.amap.com/) - 地图和位置服务
- [智谱AI](https://open.bigmodel.cn/) - AI对话和文本生成
- [Next.js](https://nextjs.org/) - React框架
- [Spring Boot](https://spring.io/projects/spring-boot) - Java后端框架
- [LangChain](https://langchain.com/) - AI应用开发框架

## 📞 联系方式

如有问题或建议，请通过以下方式联系：

- 项目Issues: [GitHub Issues](https://github.com/your-repo/issues)
- 邮箱: your-email@example.com

---

**China Travel** - 让AI为您的中国之旅保驾护航 🇨🇳✈️
