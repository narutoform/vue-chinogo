import http from './public'
// 登陆
export const userLogin = (params) => {
  return http.fetchPost('/user/login', params)
}
// 退出登陆
export const loginOut = (params) => {
  return http.fetchPost('/user/logout', params)
}
// 上传图片
export const upload = (params) => {
  return http.fetchPost('/user/upload', params)
}
// 首页接口
export const indexHome = (categoryId) => {
  return http.fetchGet('/content/show/' + categoryId, {})
}
// 用户信息
export const userInfo = (params) => {
  return http.fetchPost('/user/userInfo', params)
}
// 注册账号
export const register = (params) => {
  return http.fetchPost('/user/regService', params)
}
// uuid获取接口
export const uuid = (params) => {
  return http.fetchGet('/user/uuid', params)
}
// 验证码检查接口
export const authCodeCheck = (params) => {
  return http.fetchPost('/user/validateAuthCode', params)
}
// 用户检查接口
export const userIsEngaged = (params) => {
  return http.fetchPost('/user/validateUser/isPinEngaged', params)
}
// 邮箱检查接口
export const mailIsEngaged = (params) => {
  return http.fetchPost('/user/validateUser/isEmailEngaged', params)
}
// 电话检查接口
export const phoneIsEngaged = (params) => {
  return http.fetchPost('/user/validateUser/isMobileEngaged', params)
}
// 电话检查接口
export const mobileCode = (params) => {
  return http.fetchPost('/user/mobileCode', params)
}
