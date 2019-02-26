const axios = require('axios')
const {server} = require('../configs')
//创建axios实例
const instance = axios.create({
  baseURL: server.baseURL,
  timeout: server.timeout,
  auth: {
    username: server.username,
    password: server.password
  }
})

module.exports = instance