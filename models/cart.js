//购物车相关的接口操作
const axios = require('./axiosInstance')

//添加
exports.add = (userId, id, num) => {
  return axios.post(`/users/${userId}/cart`, {id, amount: num})
    .then(res => res.data)
    .catch(err => Promise.reject(err))
}

//查询
exports.list = (userId, id, num) => {
  return axios.get(`/users/${userId}/cart`)
    .then(res => res.data)
    .catch(err => Promise.reject(err))
}

//修改
exports.edit = (userId, id, num) => {
  return axios.patch(`/users/${userId}/cart/${id}`, {amount: num})
    .then(res => res.data)
    .catch(err => Promise.reject(err))
}

//删除
exports.remove = (userId, id) => {
  return axios.delete(`/users/${userId}/cart/${id}`)
    .then(res => res.data)
    .catch(err => Promise.reject(err))
}