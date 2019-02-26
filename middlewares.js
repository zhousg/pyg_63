//自定义中间件
const configs = require('./configs')

exports.global = (req, res, next) => {
  //1. 往模版设置网站公用信息
  res.locals.site = configs.site
  //2. 分类信息设置 TODO

  next()
}