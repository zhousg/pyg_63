//支付路由
const orderModel = require('../models/order')
const getPayUrl = require('../utils/alipay')

//跳去支付
exports.pay = (req, res, next) => {
  //根据现在的交易信息生产支付地址 进行跳转
  orderModel.item(req.query.num)
    .then(order => {
      //传入订单信息获取支付地址
      res.redirect(getPayUrl(order))
    }).catch(err => next(err))
}
//处理支付宝的回跳  修改订单状态
exports.callback = (req, res, next) => {
  //根据支付的结果去修改订单的状态
  //获取订单编号
  const num = req.query.out_trade_no
  const trade_no = req.query.trade_no
  orderModel.edit(num, 1, trade_no)
    .then(data => {
      //渲染一个页面  结果展示页面  参考结算页面
      res.locals.order = data
      res.render('payResult')
    }).catch(err => next(err))
}