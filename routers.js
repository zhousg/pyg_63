//集合所有的路由
const express = require('express')
const router = express.Router()
const homeController = require('./controllers/home')

//渲染首页
router.get('/', homeController.index)
//todo 配置网站所有的路由

module.exports = router