//首页相关的业务路由
const settingsModel = require('../models/settings')
const productModel = require('../models/product')

exports.index = (req, res, next) => {
  //1. 渲染首页  轮播图数据
  //2. 渲染首页  猜你喜欢数据
  //Promise.race()  执行多个Promise对象  等最快的响应成功就会 调用成功的回调
  //参数是  Promise 数组
  Promise.all([settingsModel.getSliders(), productModel.getLikeProducts(6)])
    .then(results => {
      //results 是promise对象的返回值的集合 而且按照你传入的顺序
      res.locals.sliders = results[0]
      res.locals.likes = results[1]
      res.render('home')
    }).catch(err => next(err))
}

exports.like = (req, res, next) => {
  //返回json格式的数据  猜你喜欢
  productModel.getLikeProducts(6).then(data => {
    res.json({code: 200, data: data})
  }).catch(err => {
    res.json({code: 500, msg: err.message})
  })
  //自己约定好的错误信息  200 成功  500 失败
  //如果有错误不能交给统一错误中间件
  //错误处理中间件 响应的是页面
}