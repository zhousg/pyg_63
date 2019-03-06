//订单操作相关的接口
const axios = require('./axiosInstance')

//创建订单
exports.add = (userId, items) => {
  return axios.post('orders', {user_id: userId, items})
    .then(res => res.data)
    .catch(err => Promise.reject(err))
}

//查询单个订单
exports.item = (num) => {
  return axios.get('orders/' + num)
    .then(res => res.data)
    .catch(err => Promise.reject(err))
}

//查询所有订单
exports.list = (userId) => {
  return axios.get('orders/?user_id=' + userId)
    .then(res => res.data)
    .catch(err => Promise.reject(err))
}

//修改订单
exports.edit = (num, pay_status, trade_no) => {
  return axios.patch('orders/' + num, {pay_status, trade_no})
    .then(res => res.data)
    .catch(err => Promise.reject(err))
}