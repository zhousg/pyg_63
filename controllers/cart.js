
//购物车相关的业务路由函数
//购物车操作 分两种情况  未登录  已登录
//未登录 购物车操作  操作的都是本地存储   cookie
//已登录 购物车操作  操作的都是接口服务器
//判断端用户的登录状态     使用session

exports.addCart = (req,res,next) =>{
  //参数 商品ID
  const id = req.query.id
  //参数 选择的数量
  const num = req.query.num || 1 //默认加入一件

  //TODO 加入购物车
  req.session.user = {} //使用了session

  //添加购物车
  res.redirect(`/cart/addSuc?id=${id}&num=${num}`)
}

exports.addCartSuc = (req,res,next) =>{

  //TODO 渲染刚刚添加的商品级加入的数量

  res.send('ok')
}