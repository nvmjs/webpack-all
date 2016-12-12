# huaxia-fe

华夏前端开发框架：基于Webpack的多页面前端开发框架，实现模块化开发、资源打包编译、延迟加载等前端优化技术，使用Jquery作为基础类库，ArtTemplate作为模版引擎，Flexible作为HTML5自适应解决方案。达到开发便捷、性能卓越、易于维护的目的。


### 安装软件

- Node.js：v6.0+


### 拷贝项目模板

``` bash
```


### 安装依赖模块

``` bash
$ npm install -g webpack
$ cd huaxia-fe && npm install
```

### 本地开发环境

- 启动本地开发服务器

    ``` bash
    $ npm run start-dev
    ```


### 业务开发

##### 目录结构

``` js
.
├── package.json              # 项目配置
├── README.md                 # 项目说明
├── src                       # 源码目录
│   ├── index.html            # 入口文件index
│   ├── index1.html           # 入口文件index1
│   ├── css/                  # css资源
│   │   ├── components/       # 组件css
│   │   ├── common.css        # 公共css
│   ├── img/                  # 图片资源
│   ├── font/                 # 字体资源
│   ├── js                    # js资源
│   │   ├── index.js          # 入口文件index
│   │   ├── index1.js         # 入口文件index1
│   │   ├── components/       # 组件
│   │   └── tmpl/             # 模板目录
│   │   ├── helpers/          # 业务无关的辅助工具
│   │   ├── lib/              # 没有存放在npm的第三方库或者下载存放到本地的基础库，如jQuery、flexible、tmod等
│   │   └── utils/            # 业务相关的辅助工具
│   ├── pathmap.json          # 手动配置某些模块的路径，可以加快webpack的编译速度
├── make-webpack-config.js    # webpack配置
├── webpack-config.js         # 正式环境webpack配置入口
└── webpack-dev-config.js     # 开发环境webpack配置入口
```

##### 多页面支持

约定`/src/*.html`为应用的入口文件，在`/src/js/`一级目录下有一个同名的js文件作为该入口文件的逻辑入口（即entry）。

在编译时会扫描入口html文件并且根据webpack配置项解决entry的路径依赖，同时还会对html文件进行压缩、字符替换等处理。

### 编译

``` bash
$ npm run build
```

### 模拟生产环境

``` bash
$ npm run start-release
```

### 部署&发布

纯静态页面型的应用，最简单的做法是直接把`assets`文件夹部署到指定机器即可（先配置好机器ip、密码、上传路径等信息）：


### 修改日志

#### 2016.10.09

初次提交

