//自定义中间件
const configs = require('./configs')
const categoryModel = require('./models/category')

exports.global = (req, res, next) => {
  //1. 往模版设置网站公用信息
  res.locals.site = configs.site
  //2. 分类信息设置 TODO
  categoryModel.getCategory().then(data => {
    res.locals.categoryList = data
    next()
  }).catch(err => next(err))
}