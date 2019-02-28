const axios = require('./axiosInstance')

//获取猜你喜欢的商品
exports.getLikeProducts = () => {
  return axios.get('products?type=like&limit=6')
    .then(res => res.data)
    .catch(err => Promise.reject(err))
}

//获取分类下的商品列表数据且带分页
exports.getProductByCategory = (id, page, per_page,sort) => {
  return axios.get(`categories/${id}/products?page=${page}&per_page=${per_page}&sort=${sort}`)
    .then(res => ({
      list:res.data,
      currPage:+res.headers['x-current-page'],
      totalPage:+res.headers['x-total-pages'],
    }))
    // res 理解成响应报文对象   响应状态行  响应头  响应主体
    // res.data 响应的主体 内容
    // res.headers 响应头中的信息  包含分页数据
    .catch(err => Promise.reject(err))
}


