//集合所有的路由
const express = require('express')
const router = express.Router()
const homeController = require('./controllers/home')
const listController = require('./controllers/list')

//渲染首页
router.get('/', homeController.index)
//返回猜你喜欢的json数据
router.get('/like', homeController.like)

//商品列表页面
router.get('/list/:id',listController.index)

//todo 配置网站所有的路由

module.exports = router