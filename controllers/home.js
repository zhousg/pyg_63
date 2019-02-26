//首页相关的业务路由
const settingsModel = require('../models/settings')

exports.index = (req, res, next) => {
  settingsModel.getSliders().then(data => {
    //给模版设置  轮播图数据
    res.locals.sliders = data
    res.render('home')
  }).catch(err => next(err))
}