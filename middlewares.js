//自定义中间件
const configs = require('./configs')
const categoryModel = require('./models/category')
const productModel = require('./models/product')
const cartModel = require('./models/cart')

exports.global = (req, res, next) => {
  //1. 往模版设置网站公用信息
  res.locals.site = configs.site
  //2. 存放用户信息
  res.locals.user = req.session.user
  //3. 分类信息设置
  //思路是  第一次请求的时候缓存数据
  //再次请求去判断是否缓存过数据  去缓存数据
  //缓存了数据
  if (res.app.locals.categoryList) {
    res.locals.categoryList = res.app.locals.categoryList
    next()
  } else {
    categoryModel.getCategory().then(data => {
      // 1.  req  不可以  每次请求req对象都是新对象
      // 2.  存储在全局变量   ok  不建议
      // 3.  req.app  进行存储  这是我们自己创建的应用对象
      res.app.locals.categoryList = data
      res.locals.categoryList = data
      next()
    }).catch(err => next(err))
  }
}

exports.headCart = (req, res, next) => {
  //后去头部的购物车信息（总数量，商品名称列表）
  if (!req.session.user) {
    //未登录
    const cartCookie = req.cookies[configs.cookieCart.key] || '[]'
    const cartList = JSON.parse(cartCookie)
    const cartNum = cartList.reduce((prev, item) => prev + parseInt(item.num), 0)
    const promiseArr = cartList.map((item, i) => productModel.getProductBaseById(item.id))
    Promise.all(promiseArr)
      .then(results => {
        res.locals.headCart = {
          cartNum,
          cartList: results.map((item, i) => item.name)
        }
        next()
      }).catch(err => next(err))
  } else {
    //未登录
    cartModel.list(req.session.user.id)
      .then(data => {
        res.locals.headCart = {
          cartNum: data.reduce((prev, item) => prev + parseInt(item.amount), 0),
          cartList: data.map((item, i) => item.name)
        }
        next()
      }).catch(err => next(err))
  }
}

//定义拦截未登录状态
exports.checkLogin = (req, res, next) => {
  //没有登录重定向  /order?id=100 包含特殊字符
  if (!req.session.user) {
    return res.redirect('/login?returnUrl=' + encodeURIComponent(req.url))
  }
  next()
}