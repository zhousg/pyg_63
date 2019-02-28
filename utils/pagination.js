//封装一个生产动态分页的函数
const template = require('art-template')
const path = require('path')

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
  let html = template(templateUrl, {currPage, total, btnNum, start, end})
  //返回动态的分页HTML格式的字符串
  return html
}