const axios = require('./axiosInstance')

exports.getCategory = () => {
  return axios.get('categories?format=tree')
    .then(res => res.data)
    .catch(err => Promise.reject(err))
}