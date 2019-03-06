//购物车相关的业务路由函数
//购物车操作 分两种情况  未登录  已登录
//未登录 购物车操作  操作的都是本地存储   cookie
//已登录 购物车操作  操作的都是接口服务器
//判断端用户的登录状态     使用session
//如果登录成  session  往里面存用户信息  字段约定 user
const configs = require('../configs')
const productModel = require('../models/product')
const cartModel = require('../models/cart')

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
    //res.cookie(key,value,options)
    res.cookie(configs.cookieCart.key, JSON.stringify(cartList), {expires})
    /*5. 重定向到  展示加入的商品信息页面*/
    res.redirect(`/cart/addSuc?id=${id}&num=${num}`)
  } else {
    //登录状态操作
    cartModel.add(req.session.user.id, id, num)
      .then(data => {
        res.redirect(`/cart/addSuc?id=${id}&num=${num}`)
      }).catch(err => next(err))
  }
}

exports.addCartSuc = (req, res, next) => {
  //1. 商品信息   根据 ID 去查询
  //2. 数量 num
  const {id, num} = req.query
  productModel.getProductBaseById(id)
    .then(data => {
      res.locals.product = {
        id: data.id,
        name: data.name,
        thumbnail: data.thumbnail,
        num: num
      }
      //res.json(res.locals.product)
      res.render('cart-add')
    })
}

//展示购物车页面 不包含数据
exports.index = (req, res, next) => {
  res.render('cart')
}

//提供给浏览器数据的接口
exports.list = (req, res, next) => {
  //获取购物数据
  if (!req.session.user) {
    //未登录
    /*1. 获取cookie信息*/
    const cartCookie = req.cookies[configs.cookieCart.key] || '[]'
    /*2. 转换对象*/
    const cartList = JSON.parse(cartCookie)
    /*3. 这个数据是客户端的要求吗  返回比较详细的商品信息*/
    /*4. 把购物车对象 转换成 获取商品信息的 promise 对象 组合成 数组*/
    const promiseArr = cartList.map((item, i) => productModel.getProductBaseById(item.id))
    Promise.all(promiseArr)
      .then(results => {
        res.json({
          code: 200,
          data: results.map((item, i) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            thumbnail: item.thumbnail,
            amount: item.amount,
            num: +cartList[i].num  //结果的顺序和cartList的数据顺序一致的
          }))
        })
      }).catch(err => {
      res.json({code: 500, msg: '获取购物车信息失败'})
    })
  } else {
    //登录状态操作
    cartModel.list(req.session.user.id)
      .then(data => {
        res.json({
          code: 200,
          data: data.map((item, i) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            thumbnail: item.thumbnail,
            amount: 100,
            num: item.amount
          }))
        })
      }).catch(err => {
      res.json({
        code: 200,
        data: []
      })
    })
  }
}

//修改商品数量 接口
exports.edit = (req, res, next) => {
  // id 商品ID  num 修改后的数量
  const {id, num} = req.body
  if (!req.session.user) {
    // 修改 cookie 数据
    const cartCookie = req.cookies[configs.cookieCart.key] || '[]'
    const cartList = JSON.parse(cartCookie)
    const product = cartList.find((item, i) => item.id == id)
    product.num = num
    const expires = new Date(Date.now() + configs.cookieCart.expires)
    res.cookie(configs.cookieCart.key, JSON.stringify(cartList), {expires})
    res.json({code: 200, msg: '修改成功'})
  } else {
    //登录状态操作
    cartModel.edit(req.session.user.id, id, num)
      .then(data => {
        res.json({code: 200, msg: '修改成功'})
      }).catch(err => {
      res.json({code: 500, msg: '修改失败'})
    })
  }
}

//删除 接口
exports.remove = (req, res, next) => {
  //删除需要 id  post提交
  const id = req.body.id
  if (!req.session.user) {
    //获取
    const cartCookie = req.cookies[configs.cookieCart.key] || '[]'
    const cartList = JSON.parse(cartCookie)
    //删除
    const index = cartList.findIndex((item, i) => item.id == id)
    cartList.splice(index, 1)
    //存储
    const expires = new Date(Date.now() + configs.cookieCart.expires)
    res.cookie(configs.cookieCart.key, JSON.stringify(cartList), {expires})
    //响应  json
    res.json({code: 200, msg: '删除成功'})
  } else {
    //登录状态操作
    cartModel.remove(req.session.user.id, id)
      .then(data => {
        res.json({code: 200, msg: '删除成功'})
      }).catch(err => {
      res.json({code: 500, msg: '删除失败'})
    })
  }
}