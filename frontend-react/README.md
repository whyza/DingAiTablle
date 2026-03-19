# 钉钉AI表格数据源配置页面

基于React + TypeScript + Vite开发的钉钉AI表格数据源配置页面，符合钉钉官方开发规范。

## 功能特性

- ✅ 使用官方脚手架 dingtalk-docs-cool-app
- ✅ iframe环境初始化
- ✅ 数据源配置表单
- ✅ saveConfigAndGoNext API调用
- ✅ 响应式设计
- ✅ TypeScript类型支持

## 快速开始

### 安装依赖

```bash
cd frontend-react
npm install
```

### 开发模式

```bash
npm run dev
```

访问 http://localhost:3001

### 生产构建

```bash
npm run build
```

构建产物在 `dist` 目录

## 部署说明

### 1. 部署到公网服务器

将 `dist` 目录部署到公网可访问的HTTPS服务器

### 2. 本地开发 + 内网穿透

使用ngrok等工具进行本地开发：

```bash
# 安装ngrok
# 访问 https://ngrok.com/ 下载安装

# 启动ngrok
ngrok http 3001
```

将ngrok生成的HTTPS地址配置到钉钉开放平台

## 钉钉开放平台配置

### 配置前端插件URL

在钉钉开放平台配置前端插件URL时，可以使用占位符：

```
https://your-domain.com?corpId=$CORPID$
```

钉钉会自动将 `$CORPID$` 替换为当前AI表格所属组织的corpId

### 获取当前登录用户（免登）

```typescript
// 前端调用
const authCode = await Dingdocs.base.host.getAuthCode(corpId);

// 将authCode发送到插件服务端
// 插件服务端调用钉钉开放接口通过authCode获取用户信息
```

## 配置参数说明

配置保存后会以key-value格式传递给后端：

```typescript
{
  serviceUrl: string;      // 服务地址
  dataSourceId: string;     // 数据源ID
  dataSourceName: string;   // 数据源名称
  description?: string;     // 描述（可选）
}
```

## 技术栈

- React 18
- TypeScript
- Vite
- dingtalk-docs-cool-app

## 注意事项

1. 前端页面必须使用HTTPS协议
2. 服务地址必须是公网可访问的
3. 需要在钉钉开放平台完成应用注册和配置
4. iframe环境初始化成功后才能进行配置操作
