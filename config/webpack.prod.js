const path = require("path");
const ESLintWebpackPlugin = require("eslint-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin")


// 获取处理样式的Loaders
const getStyleLoaders = (preProcessor) => {
  return [
    MiniCssExtractPlugin.loader,
    "css-loader",
    // Css 兼容性处理 npm i postcss-loader postcss postcss-preset-env -D
    {
      loader: "postcss-loader",
      options: {
        postcssOptions: {
          plugins: [
            "postcss-preset-env", // 能解决大多数样式兼容性问题
          ],
        },
      },
    },
    preProcessor,
  ].filter(Boolean);
};

module.exports = {
  // 入口
  // 相对路径和绝对路径都行
  entry: "./src/main.js",
  // 输出
  output: {
    path: path.resolve(__dirname, "../dist"),
    // 输出入口文件路径
    filename: "static/js/main.js",
    // clean: true // 自动将上次打包目录资源清空
  },
  // 加载器
  module: {
    rules: [
      {
        // npm i css-loader style-loader -D
        // 用来匹配 .css 结尾的文件
        test: /\.css$/,
        // use 数组里面 Loader 执行顺序是从右到左
        // css-loader  解析 CSS 文件后，使用 import 加载，并且返回 CSS 代码
        // style-loader将模块的导出作为样式添加到 DOM 中
        // use: [{ loader: "style-loader" }, "css-loader"],
        use: getStyleLoaders()
      },
      {
        // npm i less-loader less -D
        // 用来匹配 .scss /.sass 结尾的文件
        test: /\.less$/,
        // use: ["style-loader", "css-loader", 'less-loader'],
        use: getStyleLoaders("less-loader"),
      },
      {
        // npm i sass-loader sass -D
        // 用来匹配 .scss /.sass 结尾的文件
        test: /\.s[ac]ss$/,
        // use: ["style-loader", "css-loader", 'sass-loader'],
        use: getStyleLoaders("sass-loader"),
      },
      // 过去在 Webpack4 时，我们处理图片资源通过 `file-loader` 和 `url-loader` 进行处理
      // 现在 Webpack5 已经将两个 Loader 功能内置到 Webpack 里了，我们只需要简单配置即可处理图片资源
      // 1. `type: "asset/resource"` 相当于`file-loader`, 将文件转化成 Webpack 能识别的资源，其他不做处理
      // 2. `type: "asset"` 相当于`url-loader`, 将文件转化成 Webpack 能识别的资源，同时小于某个大小的资源会处理成 data URI 形式
      {
        test: /\.(png|jpe?g|gif|webp)$/,
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024 // 小于10kb的图片会被base64处理
          },
        },
        generator: {
          // 将图片文件输出到 static/imgs 目录中
          // 将图片文件命名 [hash:8][ext][query]
          // [hash:8]: hash值取8位
          // [ext]: 使用之前的文件扩展名
          // [query]: 添加之前的query参数
          filename: "static/imgs/[hash:8][ext][query]",
        },
      },
      {
        test: /\.(ttf|woff2?|map4|map3|avi)$/,
        type: "asset/resource",
        generator: {
          filename: "static/media/[hash:8][ext][query]",
        },
      },
      // npm i babel-loader @babel/core @babel/preset-env -D
      {
        test: /\.js$/,
        exclude: /node_modules/, // 排除node_modules代码不编译
        loader: "babel-loader",
      },
    ],
  },
  // 插件
  plugins: [
    // npm i eslint-webpack-plugin eslint -D
    new ESLintWebpackPlugin({
      // 指定检查文件的根目录
      context: path.resolve(__dirname, "../src"),
    }),
    // npm i html-webpack-plugin -D
    new HtmlWebpackPlugin({
      // 以 public/index.html 为模板创建文件
      // 新的html文件有两个特点：1. 内容和源文件一致 2. 自动引入打包生成的js等资源
      template: path.resolve(__dirname, "../public/index.html"),
    }),
    // npm i mini-css-extract-plugin -D
    // 提取css成单独文件 通过 link 标签加载性能才好
    new MiniCssExtractPlugin({
      // 定义输出文件名和目录
      filename: "static/css/main.css",
    }),
  ],
  // npx webpack --config ./config/webpack.prod.js
  // 模式
  mode: "production",
}