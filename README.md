### 开发环境搭建

- 初始化数据库 自己创建数据库newshop  执行newshop.sql文件即可
- 启动PHP服务器  双击 start.cmd 的文件   黑色命令窗口不要关闭
- 当然部分同学运行有错误  执行 vc14_redist.x86 进行修复  重新启动电脑
- 如果还不成功 建议大家使用线上的接口  ：https://documenter.getpostman.com/view/130308/newshop/RVncfwwX
- 测试接口服务器：使用postman进行测试  http://localhost:8000/v1/settings
- 调用接口服务器需要认证：auth认证（在请求头传递认证数据  Basic Auth 选项
键值对 username(newshop-frontend) password(d8667837fce5a0270a35f4a8fa14be479fadc774) ）

### 搭建项目

- 大家安装MVC的思维去搭建


### 环境的区分  生产 开发
- 通过环境变量 
- 如果是windows 使用命令 SET NODE_ENV=development
- 如果是windows 使用命令 SET NODE_ENV=production
- 在linux可能不支持命名 需要使用跨平台工具  cross-env  node包 命令行工具
- 所有的系统环境变量的设置 cross-env NODE_ENV=development
- 这种方式的环境变量的设置是在内存中的。

在代码中去区分运行环境

### 统一错误处理

```javascript
//如果代码执行到这里 没有对象的路由规则  证明是404
app.use((req, res, next) => {
  //创建404错误对象  交给下一个错误处理中间件
  // const error = new Error('Not Found')
  // error.status = 404
  //next(error)
  //错误创建工具  更快捷一些  http-errors
  next(createError('Not Found', 404))
})
//统一错误处理中间件
app.use((err, req, res, next) => {
  //包含程序出现的错误和404错误
  //1. 如果是开发环境  把详细的错误信息响应给客户端
  //2. 如果是生产环境  只需要响应404 500 页面给客户端即可
  //a. 如何去判断现在的运行环境
  const env = req.app.get('env')  //获取设置的环境变量的值 NODE_ENV
  if (env === 'development') {
    //开发环境   把错误信息详细展示处理
    //使用youch的第三方包  把错误信息组织成HTML格式的字符串  包含非常详细的错误信息
    //res.send(err.message)
    new Youch(err, req).toHTML().then((html) => {res.send(html)})
  } else {
    //生产环境
    //区分错误的类型 如果是404 响应的404页面  否则是500页面
    const status = err.status === 404 ? 404 : 500
    //输出页面 TODO
    res.send('ok--' + status)
  }
})
```



