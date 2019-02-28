//自定义中间件
const configs = require('./configs')
const categoryModel = require('./models/category')

exports.global = (req, res, next) => {
  //1. 往模版设置网站公用信息
  res.locals.site = configs.site
  //2. 分类信息设置
  //思路是  第一次请求的时候缓存数据
  //再次请求去判断是否缓存过数据  去缓存数据
  //缓存了数据
  if(res.app.locals.categoryList){
    res.locals.categoryList = res.app.locals.categoryList
    next()
  }else{
    categoryModel.getCategory().then(data => {
      // 1.  req  不可以  每次请求req对象都是新对象
      // 2.  存储在全局变量   ok  不建议
      // 3.  req.app  进行存储  这是我们自己创建的应用对象
      res.app.locals.categoryList =  data
      res.locals.categoryList = data
      next()
    }).catch(err => next(err))
  }
}