//集合所有的路由
const express = require('express')
const router = express.Router()
const homeController = require('./controllers/home')
const listController = require('./controllers/list')
const itemController = require('./controllers/item')
const cartController = require('./controllers/cart')
const usersController = require('./controllers/users')

//渲染首页
router.get('/', homeController.index)
//返回猜你喜欢的json数据
router.get('/like', homeController.like)

//商品列表页面
router.get('/list/:id',listController.index)
router.get('/search',listController.search)

//商品详情页面
router.get('/item/:id',itemController.index)

//购物车相关路由
router.get('/cart/add',cartController.addCart)
router.get('/cart/addSuc',cartController.addCartSuc)
router.get('/cart',cartController.index)
router.get('/cart/list',cartController.list)
router.post('/cart/edit',cartController.edit)
router.post('/cart/remove',cartController.remove)

//用户相关
router.get('/login',usersController.login)
router.post('/login',usersController.loginLogic)

//todo 配置网站所有的路由

module.exports = router