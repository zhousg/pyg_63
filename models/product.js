const axios = require('./axiosInstance')

//获取猜你喜欢的商品
exports.getLikeProducts = (limit) => {
  return axios.get(`products?type=like&limit=${limit}`)
    .then(res => res.data)
    .catch(err => Promise.reject(err))
}

//获取分类下的商品列表数据且带分页
exports.getProductByCategory = (id, page, per_page, sort) => {
  return axios.get(`categories/${id}/products?page=${page}&per_page=${per_page}&sort=${sort}`)
    .then(res => ({
      list: res.data,
      currPage: +res.headers['x-current-page'],
      totalPage: +res.headers['x-total-pages'],
    }))
    // res 理解成响应报文对象   响应状态行  响应头  响应主体
    // res.data 响应的主体 内容
    // res.headers 响应头中的信息  包含分页数据
    .catch(err => Promise.reject(err))
}

//获取某个关键字下的商品列表数据且带分页
exports.getProductBySearch = (q, page, per_page, sort) => {
  //转成URL编码  url传递数据的时候  如果是特殊字符 或者 中文字符 导致url解析异常
  q = encodeURIComponent(q)  //转换URL编码
  //q = decodeURIComponent(q)  //解析成普通字符
  return axios.get(`products?page=${page}&per_page=${per_page}&sort=${sort}&q=${q}`)
    .then(res => ({
      list: res.data,
      currPage: +res.headers['x-current-page'],
      totalPage: +res.headers['x-total-pages'],
    }))
    .catch(err => Promise.reject(err))
}

//根据ID获取商品详情
exports.getProductById = (id) =>{
  return axios.get(`products/${id}?include=introduce,category,pictures`)
    .then(res=>res.data)
    .catch(err => Promise.reject(err))
}

//根据ID获取商品基本信息
exports.getProductBaseById = (id) =>{
  return axios.get(`products/${id}`)
    .then(res=>res.data)
    .catch(err => Promise.reject(err))
}
