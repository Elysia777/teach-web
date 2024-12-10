# 使用官方 Node.js 作为基础镜像
FROM node

# 设置工作目录
WORKDIR /app

# 将 package.json 和 package-lock.json 复制到工作目录
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制项目文件到工作目录
COPY . .


# 暴露应用运行的端口（根据您的配置，通常是 3000 或 8080）
EXPOSE 3000
EXPOSE 9000

