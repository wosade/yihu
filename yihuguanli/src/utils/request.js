import axios from "axios";
 const request = axios.create({
   baseURL: 'https://v3pz.itndedu.com/v3pz',
  timeout: 200000000,
});
// 添加请求拦截器
request.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  // 集中处理 token
  const token=localStorage.getItem('token')
  //不需要请求token的地址
  const white = ['/get/code', '/user/authentication','/login']
  const requestPath = config.url || ''
  // 预处理token
if(token&&!white.includes(requestPath))
  {
    config.headers['x-token']=token}
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 添加响应拦截器
request.interceptors.response.use(function (response) {
  // 2xx 范围内的状态码都会触发该函数。
  // 对响应数据做点什么
  //预处理 错误信息
  if(response.data.code===-1){
    console.log(response.data.message);
  }
  // 如果token错误
  if(response.data.code===-2){
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
    localStorage.removeItem('data')
    // 让浏览器进行一次跳转 由于没有token会直接跳到login
    window.location.href=window.location.origin
  }
  return response;
}, function (error) {
  // 超出 2xx 范围的状态码都会触发该函数。
  // 对响应错误做点什么
  return Promise.reject(error);
});
export default request
