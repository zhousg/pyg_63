//用户相关的业务路由
const svgCaptcha = require('svg-captcha')
//展示登录页
exports.login = (req, res, next) => {
  //缺验证码  使用 svg-captcha 创建验证码图片
  /*1. 创建 数学公式 的*/
  const captcha = svgCaptcha.createMathExpr({width:120,height:30,fontSize:30})
  /*2. captcha对象  {data:'svg标签',text:'结果'}*/
  res.locals.svg = captcha.data
  res.render('login')
}
//登录业务逻辑
exports.loginLogic = (req, res, next) => {
  res.send('ok')
}