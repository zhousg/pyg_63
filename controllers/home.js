//首页相关的业务路由
const settingsModel = require('../models/settings')
const productModel = require('../models/product')

exports.index = (req, res, next) => {
  //1. 渲染首页  轮播图数据
  //2. 渲染首页  猜你喜欢数据

  //Promise.all()   执行多个Promise对象  等最慢的响应成功才会 调用成功的回调
  //Promise.race()  执行多个Promise对象  等最快的响应成功就会 调用成功的回调
  //参数是  Promise 数组
  Promise.all([settingsModel.getSliders(), productModel.getLikeProducts()])
    .then(results => {
      //results 是promise对象的返回值的集合 而且按照你传入的顺序
      res.locals.sliders = results[0]
      res.locals.likes = results[1]
      res.render('home')
    }).catch(err => next(err))
}