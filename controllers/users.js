//用户相关的业务路由
const svgCaptcha = require('svg-captcha')
const createError = require('http-errors')
const usersModel = require('../models/users')
const cartModel = require('../models/cart')
const configs = require('../configs')
//展示登录页
exports.login = (req, res, next) => {
  //缺验证码  使用 svg-captcha 创建验证码图片
  /*1. 创建 数学公式 的*/
  const captcha = svgCaptcha.createMathExpr({width: 120, height: 30, fontSize: 30})
  /*2. captcha对象  {data:'svg标签',text:'结果'}*/
  res.locals.svg = captcha.data
  req.session.text = captcha.text  //存储的目的 下一次登录的时候要进行对比
  // 设置登录后的跳转地址   如果有回调走returnUrl 如果没有回跳走个人中心
  res.locals.returnUrl = req.query.returnUrl || '/member'
  res.render('login')
}
//登录业务逻辑
exports.loginLogic = (req, res, next) => {
  /*需求*/
  const {username, password, captcha, auto} = req.body
  Promise.resolve().then(() => {
    /*1. 数据完整性校验*/
    if (!(username && password && captcha)) throw createError(400, '表单需要填写完整')
    /*2. 验证码校验*/
    if (captcha !== req.session.text) throw createError(400, '验证码错误')
    /*3. 去接口服务器进行 用户名 密码 校验*/
    return usersModel.login(username, password)
  }).then(user => {
    //证明登录成功 但是为了严谨的考虑
    if (!user) throw createError(400, '登录失败')
    req.session.user = user
    /*4. 完成自动登录需要存储的信息 */
    /*4.1 确认 在客户端存储什么信息  user id password*/
    /*4.2 使用cookie进行存储  设置有效期  7天 */
    /*4.3 以后需要使用这些数据进行自动登录*/
    if(auto){
      res.cookie(configs.cookieUser.key, JSON.stringify({
        id: user.id,
        password: user.password
      }), {expires: new Date(Date.now() + configs.cookieUser.expires), httpOnly: true})
    }
    /*5. 合并购物车*/
    /*获取cookie中的购物车数据  包含若干件商品和添加的数量 */
    /*依次遍历  调用添加接口  对应的商品ID及数量 发送接口服务器*/
    const cartCookie = req.cookies[configs.cookieCart.key] || '[]'
    const cartList = JSON.parse(cartCookie)
    const promiseArr = cartList.map((item, i) => cartModel.add(user.id, item.id, item.num))
    return Promise.all(promiseArr)
  }).then(results=>{
    //合并购物车成功
    //清除客户端的购物车信息 cookie
    res.clearCookie(configs.cookieCart.key)
    //跳转 重定向
    res.redirect(req.body.returnUrl || '/member')
  }).catch((err) => {
    console.log(err)
    /*6. 统一进行错误处理  catch异常处理 把错误信息提示给用户*/
    /*1. 自己创建的错误的状态码是400 */
    if (err.status == 400) {
      res.locals.msg = err.message
    } else {
      //可以选中服务器响应给我们的错误
      if (err.response && err.response.data.message) {
        res.locals.msg = err.response.data.message || '服务异常'
      } else {
        res.locals.msg = '服务异常'
      }
    }
    /*2. 验证码图片更新*/
    const captcha = svgCaptcha.createMathExpr({width: 120, height: 30, fontSize: 30})
    req.session.text = captcha.text //存储的目的 下一次登录的时候要进行对比
    res.locals.svg = captcha.data
    res.render('login')
  })
}