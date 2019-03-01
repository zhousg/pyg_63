//主文件
const createError = require('http-errors')
const Youch = require('youch')
const artTemplate = require('express-art-template')
const path = require('path')
const favicon = require('express-favicon')
const middlewares = require('./middlewares')
const routers = require('./routers')
const configs = require('./configs')

/*1.创建服务器*/
const express = require('express')

const app = express()

app.listen(4000, () => console.log('pyg_63 server started'))

//配置模版引擎
app.engine('art', artTemplate)
app.set('view engine', 'art') //设置默认的模版引擎 然后可以省略后缀
//process.env.NODE_ENV 获取现在的运行环境的变量
app.set('view options', {debug: process.env.NODE_ENV === 'development'})
//静态资源处理
app.use('/', express.static(path.join(__dirname, './public')))
//处理请求数据  bodyParser
app.use(express.json()) //处理json格式的数据
app.use(express.urlencoded({extended: false})) //处理url形式的传参 application/x-www-form-urlencoded
//处理请求数据成对象格式 便于操作
//网站小图标处理
app.use(favicon(path.join(__dirname,'./favicon.ico')))


//配置session
/*1. 导入  express-session express-mysql-session*/
const session = require('express-session')
const mysqlSession = require('express-mysql-session')
/*2. 获取持久化的构造函数*/
const MySQLStore = mysqlSession(session)
/*3. 需要链接mysql信息  配置信息  在configs定义*/
/*4. 实例化持久化对象*/
const sessionStore = new MySQLStore(configs.mysql)
/*5. 配置中间件*/
app.use(session({
  key: 'pygSID',  //sessionId
  secret: 'pyg_63_secret', //加密字符串
  store: sessionStore, //持久化对象
  resave: false, //是否重新保存session
  saveUninitialized: false  //是否在项目初始化的时候实例session 还是在使用session的时候再去初始化
}))


//自定义的中间件
app.use(middlewares.global)

//定义的业务路由
app.use(routers)

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
    //输出页面  页面需要数据
    //1. res.render('error', {status:status})
    //2. 如果想传数据给模版 可以给locals挂载数据
    // res.locals.status = status
    // res.locals.abc = 100
    // res.render('error')
    res.locals.status = status
    res.render('error')
  }
})
