//作用  生成支付地址（支付网关?加密参数）
const Alipay = require('alipay-node-sdk')
const fs = require('fs')
const path = require('path')
const alipay = new Alipay({
  //应用ID
  appId: '2016092300579138',
  //通知地址
  notifyUrl: 'http://127.0.0.1:3000/pay/notify',
  //密钥  路径
  rsaPrivate: path.join(__dirname, './rsa_private_key.pem'),
  //公钥  路径
  rsaPublic: path.join(__dirname, './rsa_public_key.pem'),
  //是不是测试环境
  sandbox: true,
  //加密算法
  signType: 'RSA2'
})
//getPayUrl 不需要使用名字   order 订单信息
module.exports = (order) => {
  //使用alipay-node-sdk 进行网页版支付步骤
  /*1. 装包 npm i alipay-node-sdk */
  /*2. 导包*/
  /*3. 初始化 支付 实例*/
  /*4. 生产加密后的参数字符串  键值对字符串*/
  const params = alipay.pagePay({
    //支付标题
    subject: '品优购商品',
    //具体的商品
    body: order.products.map((item, i) => item.name).join('\n'),
    //商户的订单的编号
    outTradeId: order.order_number,
    //支付超时时间
    timeout: '10m',
    //支付金额
    amount: order.total_price,
    //商品类型  虚拟 0 实物 1
    goodsType: '1',
    //二维码的类型  大的  小的
    qrPayMode: 2,
    //回调地址
    return_url: 'http://127.0.0.1:3000/pay/callback'
  })
  return 'https://openapi.alipaydev.com/gateway.do?' + params
}