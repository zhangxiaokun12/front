# 需要下载node 16

# 拉代码注意，最好git禁用掉自动切换CRLF

git config --global core.autocrlf false

# 先安装依赖

yarn

# 访问国外网站比较慢的用户可以在后面加--registry

yarn --registry=https://registry.npmmirror.com

# 依赖安装好后运行项目

yarn run dev

# 运行时重新生成缓存文件

yarn run dev --force

# 打包命令

yarn run build

# 其他常用命令记录

```shell
# 安装包
yarn add xxx

# 安装到dev环境包
yarn add -D xxx

# 安装qs
yarn add qs
```

# 前端部署在子路径

1. 在vite.config.js中配置：

```js
// ......省略其它代码
export default defineConfig(({ command }) => {
    return {
        // 在这里增加 base 写子路径
        base: '/guns-devops/',  // 注意这里前后都要有斜杠
        // ...
        // 如果要修改打包后的输出目录可以加这个配置
        build: {
            outDir: 'guns'  // 默认是 dist
        }
    };
});
```

2. 然后在 src/router/index.ts 中增加：

```js
// ......省略其它代码
const router = createRouter({
    routes,
    // 给 createWebHistory 方法传参数配置子路径
    history: createWebHistory(import.meta.env.BASE_URL)
});
```

3. 在打包时候执行如下命令即可

```shell
yarn run build --base=/guns-devops/
```