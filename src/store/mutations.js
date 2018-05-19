import {
  INIT_BUYCART,
  ADD_CART,
  GET_USERINFO,
  RECORD_USERINFO,
  ADD_ANIMATION,
  SHOW_CART,
  REDUCE_CART,
  EDIT_CART,
  SEARCH_ITEM_PARAM,
  SEARCH_ITEM,
  CLEAR_SEARCH_ITEM,
  ADD_SEARCH_ITEM,
  LOADMORE,
  SETBUSY,
  SETMINPRICE,
  SETMAXPRICE
} from './mutation-types'
import { setStore, getStore } from '../utils/storage'
import { searchItem } from '/api/goods'

export default {
  // 网页初始化时从本地缓存获取购物车数据
  [INIT_BUYCART] (state) {
    let initCart = getStore('buyCart')
    if (initCart) {
      state.cartList = JSON.parse(initCart)
    }
  },
  // 加入购物车
  [ADD_CART] (state, {productId, productPrice, productName, productImg, colour, size, weight, productNum = 1}) {
    let cart = state.cartList // 购物车
    let flag = true
    let goods = {
      productId,
      productPrice,
      productName,
      productImg,
      colour,
      size,
      weight
    }
    if (cart.length) {        // 有内容
      cart.forEach(item => {
        if (item.productId === productId) {
          if (item.productNum >= 0) {
            flag = false
            item.productNum += productNum
          }
        }
      })
    }
    if (!cart.length || flag) {
      goods.productNum = productNum
      goods.checked = '1'
      cart.push(goods)
    }
    state.cartList = cart
    // 存入localStorage
    setStore('buyCart', cart)
  },
  // 加入购物车动画
  [ADD_ANIMATION] (state, {moveShow, elLeft, elTop, img, cartPositionT, cartPositionL, receiveInCart}) {
    state.showMoveImg = moveShow
    if (elLeft) {
      state.elLeft = elLeft
      state.elTop = elTop
    }
    state.moveImgUrl = img
    state.receiveInCart = receiveInCart
    if (cartPositionT) {
      state.cartPositionT = cartPositionT
      state.cartPositionL = cartPositionL
    }
  },
  // 是否显示购物车
  [SHOW_CART] (state, {showCart}) {
    // let timer = null
    state.showCart = showCart
    // clearTimeout(timer)
    // if (showCart) {
    //   timer = setTimeout(() => {
    //     state.showCart = false
    //   }, 5000)
    // }
  },
  // 移除全部商品
  [REDUCE_CART] (state) {
    state.cartList = []
    // 存入localStorage
    setStore('buyCart', state.cartList)
  },
  // 修改购物车
  [EDIT_CART] (state, {productId, productNum, checked}) {
    let cart = state.cartList
    if (productNum) {
      cart.forEach((item, i) => {
        if (item.productId === productId) {
          item.productNum = productNum
          item.checked = checked
        }
      })
    } else if (productId) {
      cart.forEach((item, i) => {
        if (item.productId === productId) {
          cart.splice(i, 1)
        }
      })
    } else {
      cart.forEach((item) => {
        item.checked = checked ? '1' : '0'
      })
    }
    state.cartList = cart
    // 存入localStorage
    setStore('buyCart', state.cartList)
  },
  // 记录用户信息
  [RECORD_USERINFO] (state, info) {
    state.userInfo = info
    state.login = true
    setStore('userInfo', info)
  },
  // 获取用户信息
  [GET_USERINFO] (state, info) {
    if (state.userInfo && (state.userInfo.username !== info.username)) {
      return
    }
    if (!state.login) {
      return
    }
    if (!info.message) {
      state.userInfo = {...info}
    } else {
      state.userInfo = null
    }
  },
  // 查询搜索商品参数
  [SEARCH_ITEM_PARAM] (state, params) {
    let pa = {
      params: {
        q: params.q,
        page: params.page,
        sort: params.sort,
        priceGt: params.priceGt,
        priceLte: params.priceLte
      }
    }
    state.paramsData = pa
  },
  [SEARCH_ITEM] (state, flag) {
    searchItem(state.paramsData)
      .then(res => {
        state.searchResult = res
        if (state.searchResult.perNum !== 0) {
          if (flag) {
            state.searchList = state.searchList.concat(state.searchResult.itemList)
          } else {
            state.searchList = state.searchResult.itemList
          }
        } else {
          clearTimeout(state.timer)
          state.busy = true
        }
      })
      .catch(res => {
        console.error('查询失败')
      })
  },
  // 清空查询结果
  [CLEAR_SEARCH_ITEM] (state) {
    state.searchResult = {}
    state.searchList = []
    state.timer = null
    state.busy = false
    state.paramsData = {
      params: {
        q: '',
        page: 1,
        sort: '',
        priceGt: '',
        priceLte: ''
      }
    }
  },
  // 添加查询结果集合
  [ADD_SEARCH_ITEM] (state, param) {
    if (param) {
      state.searchList = state.searchList.concat(state.searchResult.itemList)
    } else {
      state.searchList = state.searchResult.itemList
    }
  },
  // 加载更多
  [LOADMORE] (state, param) {
    state.timer = param
  },
  // 设置busy
  [SETBUSY] (state, param) {
    state.busy = param
  },
  [SETMAXPRICE] (state, param) {
    state.paramsData.params.priceLte = param
  },
  [SETMINPRICE] (state, param) {
    state.paramsData.params.priceGt = param
  }
}
