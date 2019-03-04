//用户相关的业务路由
const svgCaptcha = require('svg-captcha')
const createError = require('http-errors')
//展示登录页
exports.login = (req, res, next) => {
  //缺验证码  使用 svg-captcha 创建验证码图片
  /*1. 创建 数学公式 的*/
  const captcha = svgCaptcha.createMathExpr({width: 120, height: 30, fontSize: 30})
  /*2. captcha对象  {data:'svg标签',text:'结果'}*/
  res.locals.svg = captcha.data
  req.session.text = captcha.text  //存储的目的 下一次登录的时候要进行对比
  res.render('login')
}
//登录业务逻辑
exports.loginLogic = (req, res, next) => {
  /*需求*/
  const {username,password,captcha,auto} = req.body
  Promise.resolve().then(()=>{
    /*1. 数据完整性校验*/
    if (!(username && password && captcha)) throw createError(400,'表单需要填写完整')
    /*2. 验证码校验*/
    if (captcha !== req.session.text) throw createError(400,'验证码错误')
    /*3. 去接口服务器进行 用户名 密码 校验*/
    /*4. 完成自动登录*/
    /*5. 合并购物车*/
  }).catch((err)=>{
    /*6. 统一进行错误处理  catch异常处理 把错误信息提示给用户*/
    /*1. 自己创建的错误的状态码是400 */
    if(err.status == 400){
      res.locals.msg = err.message
    }else{
      res.locals.msg = '服务异常'
    }
    /*2. 验证码图片更新*/
    const captcha = svgCaptcha.createMathExpr({width: 120, height: 30, fontSize: 30})
    req.session.text = captcha.text //存储的目的 下一次登录的时候要进行对比
    res.locals.svg = captcha.data
    res.render('login')
  })
}