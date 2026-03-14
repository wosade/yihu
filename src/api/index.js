// 获取验证码
import request from '@/utils/request'
// 获取短信验证码
export const getcode=(data)=>{
  return request.post('/get/code',data)
}
// 注册用户
export const signuser=(data)=>{
  return request.post('/user/authentication',data)
}
// 用户登录
export const login=(data)=>{
  return request.post('/login',data)
}
// 账号管理
export const manageuser=(params)=>{
  return request.get('/auth/admin',{params})
}
