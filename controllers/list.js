//商品列表页相关的路由函数
const productModel = require('../models/product')
const categoryModel = require('../models/category')
const paginationUtil = require('../utils/pagination')

//分类列表页
exports.index = (req, res, next) => {
  //获取分类ID
  //客户端的传参
  //地址栏 参数  ?name=nll&age=18    req.query
  //post  参数  请求主体中    req.body
  //restful 规则传参在路径  list/nll/18  => list/:name/:age   req.params
  const id = req.params.id
  //获取页码  默认是第一页
  const page = req.query.page || 1
  //自己约定每页多少条
  const per_page = 5
  //获取排序的方式  默认是综合排序
  //commend 综合排序  quantity 销量 market_time 新品 -price 价格升序  price 价格降序
  const sort = req.query.sort || 'commend'

  // productModel.getProductByCategory(id, page, per_page, sort)
  //   .then(data => {
  //     //res.json(data)
  //     //data 缺少分页相关的信息
  //     //data 获取分页数据后  ｛list,currPage,totalPage｝
  //     //需求：
  //     //1. 排序渲染
  //     //2. 列表渲染
  //     //3. 路径导航渲染  分类信息
  //     //4. 分页渲染
  //     res.locals.list = data.list
  //     res.locals.sort = sort
  //     res.locals.categoryId = id
  //     res.render('list')
  //   }).catch(err => next(err))

  Promise.all([
    productModel.getProductByCategory(id, page, per_page, sort),
    categoryModel.getBreadcrumb(id)
  ]).then(results => {
    res.locals.list = results[0].list  //列表数据
    res.locals.sort = sort //当前排序
    res.locals.categoryId = id //当前分类ID
    res.locals.breadcrumb = results[1] //面包屑数据
    //分页的HTML格式代码
    res.locals.paginationHTML = paginationUtil({
      currPage: results[0].currPage,
      total: results[0].totalPage,
      req
    })
    res.render('list')
  }).catch(err => next(err))
}

//搜索列表页
exports.search = (req, res, next) => {
  /*需求：*/
  /*1. 搜索框显示 搜索的关键字*/
  /*2. 在面包屑位置  提示文字*/
  /*3. 重新渲染排序按钮*/
  /*依赖数据  根据关键字查询的列表数据包含分页即可*/
  const q = req.query.q
  const page = req.query.page || 1
  const per_page = 5
  const sort = req.query.sort || 'commend'
  productModel.getProductBySearch(q, page, per_page, sort)
    .then(data=>{
      res.locals.list = data.list
      res.locals.sort = sort
      res.locals.q = q
      res.locals.paginationHTML = paginationUtil({
        currPage: data.currPage,
        total: data.totalPage,
        req
      })
      res.render('list')
    }).catch(err => next(err))
}