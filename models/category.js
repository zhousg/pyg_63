const axios = require('./axiosInstance')

//获取的全部分类
exports.getCategory = () => {
  return axios.get('categories?format=tree')
    .then(res => res.data)
    .catch(err => Promise.reject(err))
}

//获取某一个分类详细信息 包含上一级 上上一级
exports.getBreadcrumb = (id) => {
  return axios.get(`categories/${id}?include=parent`)
    .then(res => res.data)
    .catch(err => Promise.reject(err))
}