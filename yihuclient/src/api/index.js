import request from "@/utils/request";
export default{
  // 用户登录
    login(data) {
    return request.post('/login', data)
  },
  // 客户端首页获取数据
  gethome(){
    return request.get('/Index/index') 
  },
  // 获取陪护师列表
  getcompanion(){
    return request.get('/h5/companion')
  },
  // 提交订单
  postcreateorder(data){
    return request.post('/createOrder',data)
  },
  // 订单列表
  orderlist(params){
    return request.get('/order/list',{params})
  },
  // 订单详情
  orderdetail(params){
    return request.get('/order/detail',{params})
  }
}