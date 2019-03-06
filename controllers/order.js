//处理订单相关的业务路由
const orderModel = require('../models/order')

exports.checkout = (req, res, next) => {
  //结算页面
  //需要数据   订单信息  如果需要进行收货地址的切换（收货地址列表）
  const num = req.query.num
  orderModel.item(num)
    .then(data => {
      res.locals.order = data
      res.render('checkout')
    }).catch(err => next(err))
}

exports.add = (req, res, next) => {
  //生成订单
  if (!req.query.items) return next(createError(500, '至少选中一件商品进行支付'))
  //需要商品ID以逗号分隔
  const items = req.query.items
  //调用接口
  orderModel.add(req.session.user.id, items)
    .then(data => {
      console.log(data)
      //订单创建完毕
      res.redirect('/checkout?num=' + data.order_number)
    }).catch(err => next(err))
}

exports.list = (req, res, next) => {
  orderModel.list(req.session.user.id)
    .then(data => {
      res.locals.list = data
      //订单列表展示
      res.render('order')
    }).catch(err => next(err))
}