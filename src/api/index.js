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
// 获取权限数据
export const getsetmenu=(params)=>{
  return request.get('/user/getmenu',{params})
}
// 修改权限
export const setmenu=(data)=>{
  return request.post('/user/setmenu',data)
}
// 获取权限列表
export const getlist=(params)=>{
  return request.get('/menu/list',{params})
}
// 获取权限下拉列表
export const getselectlist=(params)=>{
  return request.get('/menu/selectlist',{params})
}
// 用户信息修改
export const updatauser=(data)=>{
  return request.post('/update/user',data)
}
// 用户菜单权限
export const menupermissons=(params)=>{
  return request.get('/menu/permissions',{params})
}
