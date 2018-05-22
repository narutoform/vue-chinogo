import Vue from 'vue'
import Router from 'vue-router'
const Index = resolve => require(['/page/index'], resolve)
const Login = resolve => require(['/page/login/login'], resolve)
const Home = resolve => require(['/page/Home/home'], resolve)
const GoodS = resolve => require(['/page/Goods/goods'], resolve)
const goodsDetails = resolve => require(['/page/Goods/goodsDetails'], resolve)
const Cart = resolve => require(['/page/Cart/cart'], resolve)
const order = resolve => require(['/page/Order/order'], resolve)
const user = resolve => require(['/page/User/user'], resolve)
const orderList = resolve => require(['/page/User/children/order'], resolve)
const information = resolve => require(['/page/User/children/information'], resolve)
const addressList = resolve => require(['/page/User/children/addressList'], resolve)
const checkout = resolve => require(['/page/Checkout/checkout'], resolve)
const payment = resolve => require(['/page/Order/payment'], resolve)
const paysuccess = resolve => require(['/page/Order/paysuccess'], resolve)
const payFailed = resolve => require(['/page/Order/payFailed'], resolve)
Vue.use(Router)
export default new Router({
  routes: [
    {
      path: '/',
      component: Index,
      name: 'index',
      redirect: '/home',
      children: [
        {path: 'home', component: Home},
        {path: 'goods', component: GoodS},
        {path: 'goodsDetails', name: 'goodsDetails', component: goodsDetails}
      ]
    },
    {path: '/login', name: 'login', component: Login},
    {path: '/cart', name: 'cart', component: Cart},
    {
      path: '/order',
      name: 'order',
      component: order,
      children: [
        {path: 'paysuccess', name: 'paysuccess', component: paysuccess},
        {path: 'payFailed', name: 'payFailed', component: payFailed},
        {path: 'payment', name: 'payment', component: payment}
      ]
    },
    {
      path: '/user',
      name: 'user',
      component: user,
      redirect: '/user/orderList',
      children: [
        {path: 'orderList', name: '订单列表', component: orderList},
        {path: 'information', name: '账户资料', component: information},
        {path: 'addressList', name: '收货地址', component: addressList}
      ]
    },
    {path: '/checkout', name: 'checkout', component: checkout},
    {path: '*', redirect: '/home'}
  ]
})
