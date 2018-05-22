import http from './public'

// 获取用户地址
export const addressList = (params) => {
  return http.fetchGet('/address/list', params)
}
// 根据地址id获取用户地址
export const addressListByAddrId = (addrId) => {
  return http.fetchPost('/address/one/' + addrId, {})
}
// 修改收货地址
export const addressUpdate = (params) => {
  return http.fetchPost('/address/update', params)
}
// 修改收货地址
export const setDefaultAddr = (params) => {
  return http.fetchPost('/address/defaultAddr', params)
}
// 添加收货地址
export const addressAdd = (params) => {
  return http.fetchPost('/address/add', params)
}
// 删除收货地址
export const addressDel = (addrId) => {
  return http.fetchPost('/address/delete/' + addrId, {})
}
// 支付
export const payMent = (params) => {
  return http.fetchPost('/pay/aliPay', params)
}
// 订单列表
export const orderList = (params) => {
  return http.fetchPost('/order/list', params)
}
// 通过订单id订单商品列表
export const getOrderItemById = (params) => {
  return http.fetchPost('/order/item/list', params)
}
// 提交订单
export const submitOrder = (params) => {
  return http.fetchPost('/order/createOrder', params)
}
// 删除订单
export const delOrder = (orderId) => {
  return http.fetchPost('/order/delete/' + orderId, {})
}
// 商品详情
export const productDet = (params) => {
  return http.fetchGet('/goods/productDet', params)
}
// 根据关键字进行搜索
export const searchItem = (params) => {
  return http.fetchGet('/search/item', params)
}

// 获得商品基本信息
export const getItemById = (id) => {
  return http.fetchGet('/item/base/' + id, {})
}

// 根据商品id得到商品描述
export const getItemDescById = (id) => {
  return http.fetchGet('/item/desc/' + id, {})
}

// 根据商品id得到商品规格
export const getItemParamItemByItemId = (id) => {
  return http.fetchGet('/item/paramItem/' + id, {})
}

// 加入购物车
export const addCart = (param) => {
  return http.fetchPost('/cart/add', param)
}

// 加入购物车
export const addCart1 = (param) => {
  return http.fetchPost('/cart/add1', param)
}

// 获取购物车列表
export const getCartList = (params) => {
  return http.fetchGet('/cart/list', params)
}
// 删除购物车
export const delCart = (params) => {
  return http.fetchPost('/cart/delete/' + params, {})
}

// 删除全部购物车
export const deleteCartAll = (params) => {
  return http.fetchPost('/cart/delete/all', params)
}

// 编辑购物车
export const cartEdit = (params) => {
  return http.fetchPost('/cart/decreOrIncre', params)
}

// 全选
export const editCheckAll = (params) => {
  return http.fetchPost('/cart/select/all', params)
}
