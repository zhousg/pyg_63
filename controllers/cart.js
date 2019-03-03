//购物车相关的业务路由函数
//购物车操作 分两种情况  未登录  已登录
//未登录 购物车操作  操作的都是本地存储   cookie
//已登录 购物车操作  操作的都是接口服务器
//判断端用户的登录状态     使用session
//如果登录成  session  往里面存用户信息  字段约定 user
const configs = require('../configs')

exports.addCart = (req, res, next) => {
  //参数 商品ID
  const id = req.query.id
  //参数 选择的数量
  const num = req.query.num || 1 //默认加入一件

  //两种情况
  if (!req.session.user) {
    //未登录  添加购物车
    /*1. 获取购物车列表数据  存储在cookie  怎么获取cookie信息*/
    // cookie-parser 中间件  转换cookie的格式  获取信息req.cookies即可
    // 物车列表数据cookie  约定key  pyg63_cart_info
    const cartCookie = req.cookies[configs.cookieCart.key] || '[]' //考虑可能为空
    /*2. 购物车信息的格式  json字符串  转换成对象或数组*/
    const cartList = JSON.parse(cartCookie)  //数据格式 [{id:100,num:2},...]
    /*3. 往数组中追加一条商品数据   如果有一样的商品加数量即可  否则直接追加 */
    const item = cartList.find((item, i) => item.id == id)
    if (item) {
      //有一样的商品
      item.num = parseInt(item.num) + parseInt(num)
    } else {
      cartList.push({id: id, num: num})
    }
    /*4. 再次去更新cookie购物车数据*/
    const expires = new Date(Date.now() + configs.cookieCart.expires)
    res.cookie(configs.cookieCart.key,JSON.stringify(cartList),{expires})
    /*5. 重定向到  展示加入的商品信息页面*/
    res.redirect(`/cart/addSuc?id=${id}&num=${num}`)
  } else {
    //已登录
  }
}

exports.addCartSuc = (req, res, next) => {

  //TODO 渲染刚刚添加的商品级加入的数量

  res.send('ok')
}