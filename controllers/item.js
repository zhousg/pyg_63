const productModel = require('../models/product')
//定义商品详情页面需要的路由业务
exports.index = (req,res,next) =>{
  /*需求*/
  /*1. 渲染面包屑*/
  /*2. 渲染商品基本信息*/
  /*3. 渲染商品图片*/
  /*4. 渲染商品简介*/
  /*5. 渲染相关商品列表  使用猜你喜欢*/
  const id = req.params.id
  /*获取商品详情数据*/
  // productModel.getProductById(id)
  //   .then(data=>{
  //     res.json(data)
  //   }).catch(err=>next(err))
  Promise.all([productModel.getProductById(id),productModel.getLikeProducts(4)])
    .then(results=>{
      res.locals.product = results[0]
      res.locals.other = results[1]
      //res.json(res.locals)
      res.render('item')
    })
}