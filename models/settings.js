const axios = require('./axiosInstance')

/*
* 获取轮播图数据的方法
* */
exports.getSliders = () => {
  return axios.get('settings/home_slides')
    .then(res => res.data)
    .catch(err => Promise.reject(err))

  //1. 在then return res.data  返回 成功的promise操作
  //2. 在catch return 对象 数据 也会当做 成功的promise操作
  //3. 如果调用这个promise对象想要那到错误信息且在catch的时候获取 必须返回的是一个 Promise.reject(err)
}