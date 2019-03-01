//封装一个生产动态分页的函数
const template = require('art-template')
const path = require('path')
const url = require('url')

// options ===> {currPage,total,btnNum} 传参数据格式
module.exports = (options) => {
  //处理分页的业务逻辑
  /*1. 处理参数*/
  if (!(options.currPage && options.total)) return ''
  const btnNum = options.btnNum || 5 //默认显示5个按钮
  const {currPage, total} = options
  /*2. 计算起始页面 和 结束页码*/
  /*a 第一步理想情况*/
  let start = currPage - Math.floor(btnNum / 2)
  let end = start + btnNum - 1
  /*b 意外 start 小于正常页码 也就是1 */
  start = start <= 0 ? 1 : start
  end = start + btnNum - 1
  /*c 意外 end 可能大于总页码*/
  end = end >= total ? total : end
  start = end - btnNum + 1
  /*d 意外 start 小于正常页码 也就是1*/
  start = start <= 0 ? 1 : start

  /*e 使用 start end 进行变量输出按钮  结合模版*/
  /*分页HTML格式的字符串 = 数据 + 模版*/
  /*在浏览器中使用  template(模版ID,数据) */
  /*在NODEjs中使用 template(模版路径,数据) */
  let templateUrl = path.join(__dirname, '../views/component/pagination.art')

  /*------------渲染分页按钮地址--------------*/
  /*1. 需要当前分类的ID  不需要考虑*/
  /*2. 需要地址栏除分页以外的所有传参   地址携带其他的传参只需要改分页的数据*/
  /*3. 在模版内去操作比较麻烦  建议在js代码中操作*/
  /*4. url操作   nodejs模块 url模块专门操作地址*/
  /*5. 最终结果就是获取一个带分页的地址*/
  /*6. 封装一个函数 能够根据页码分页的地址*/
  /*---------实现------------*/
  //1. 获取之前的地址 req.url  才能修改
  const reqUrl = options.req.url  //字符串格式修改不方便
  //2. 转换成url对象
  const urlObject = url.parse(reqUrl, true)
  //url.parse(url) urlObject.query 地址栏传参  字符串键值对
  //url.parse(url,true) urlObject.query 地址栏传参  对象形式
  const getUrl = (page) => {
    //3. 修改urlObject中的query对象
    urlObject.query.page = page
    //注意：只要当urlObject.search是undefined的时候才会去采用urlObject.query去生成URL字符串
    urlObject.search = undefined
    //4. 转换回url地址
    return url.format(urlObject)
  }

  /*输入分页页码点击确认跳转分页*/
  /*这个操作是在客户端进行的   所以功能只能在客户端js去实现*/
  /*客户端js去实现  像url操作需要自己去操作  很麻烦*/
  /*痛点：其他参数不改只改page*/
  /*方案：使用from表单提交  修改page的值   把地址栏其他的参数生产input隐藏*/
  /*需要数据：地址栏参数对象*/

  //artTemplate不能直接使用外部定义的变量
  let html = template(templateUrl, {
    currPage,
    total,
    btnNum,
    start,
    end,
    getUrl,query:urlObject.query,
    pathname:urlObject.pathname
  })
  //返回动态的分页HTML格式的字符串
  return html
}