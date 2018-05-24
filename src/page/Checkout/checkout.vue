<template>
  <div class="checkout">
    <y-header>
      <div slot="nav"></div>
    </y-header>
    <div class="w" style="padding-top: 40px;">
      <!-- 收货地址 -->
      <y-shelf title="收货信息">
        <div slot="content">
          <ul class="address-item-list clearfix">
            <li v-for="(item,i) in addList"
                :key="i"
                class="address pr"
                :class="{checked:addrId === item.addrId}"
                @click="defaultAddress(item.addrId)">
           <span v-if="addrId === item.addrId" class="pa">
             <svg viewBox="0 0 1473 1024" width="17.34375" height="12">
             <path
               d="M1388.020 57.589c-15.543-15.787-37.146-25.569-61.033-25.569s-45.491 9.782-61.023 25.558l-716.054 723.618-370.578-374.571c-15.551-15.769-37.151-25.537-61.033-25.537s-45.482 9.768-61.024 25.527c-15.661 15.865-25.327 37.661-25.327 61.715 0 24.053 9.667 45.849 25.327 61.715l431.659 436.343c15.523 15.814 37.124 25.615 61.014 25.615s45.491-9.802 61.001-25.602l777.069-785.403c15.624-15.868 25.271-37.66 25.271-61.705s-9.647-45.837-25.282-61.717M1388.020 57.589z"
               fill="#6A8FE5" p-id="1025">
               </path>
             </svg>
             </span>
              <p>收货人: {{item.receiverName}} {{item.isDefault ? '(默认地址)' : ''}}</p>
              <p class="street-name ellipsis">收货地址: {{item.receiverState + item.receiverCity +
                item.receiverDistrict}}</p>
              <p class="street-name ellipsis">{{item.receiverAddress}}</p>
              <p>移动电话: {{item.receiverMobile}}</p>
              <p>固定电话: {{item.receiverPhone}}</p>
              <p>邮政编码: {{item.receiverZip}}</p>
              <div class="operation-section">
                <span class="update-btn" @click="update(item)">修改</span>
                <span class="delete-btn" :data-id="item.addrId" @click="del(item.addrId)">删除</span>
              </div>
            </li>

            <li class="add-address-item" @click="update()">
              <img src="../../../static/svg/jia.svg" alt="">
              <p>使用新地址</p>
            </li>
          </ul>
        </div>
      </y-shelf>
      <!-- 购物清单 -->
      <y-shelf title="购物清单">
        <div slot="content">
          <div class="box-inner ui-cart">
            <div>
              <!--标题-->
              <div class="cart-table-title">
                <span class="name">商品信息</span>
                <span class="subtotal">小计</span>
                <span class="num">数量</span>
                <span class="price">单价</span>
              </div>
              <!--列表-->
              <div class="cart-table" v-for="(item,i) in cartList" :key="i" v-if="item.checked === '1'">
                <div class="cart-group divide pr" :data-productid="item.productId">
                  <div class="cart-top-items">
                    <div class="cart-items clearfix">
                      <!--图片-->
                      <div class="items-thumb fl">
                        <img :alt="item.productName"
                             :src="item.productImg">
                        <a href="javascript:;" :title="item.productName" target="_blank"></a>
                      </div>
                      <!--信息-->
                      <div class="name hide-row fl">
                        <div class="name-table">
                          <router-link :to="'goodsDetails?id=' + item.productId" :title="item.productName"
                                       target="_blank"
                                       v-html="item.productName">
                          </router-link>
                          <ul class="attribute">
                            <li><span style="margin-right: 15px">{{item.colour}}</span>
                              <span style="margin-right: 15px">{{item.size}}</span>
                              <span>{{item.weight}}克</span></li>
                          </ul>
                        </div>
                      </div>
                      <!--商品数量-->
                      <div>
                        <!--总价格-->
                        <div class="subtotal" style="font-size: 14px">¥ {{subtotal(item.productPrice, item.productNum)}}
                        </div>
                        <!--数量-->
                        <div class="item-cols-num">
                          <div class="select">
                            <span v-text="item.productNum"></span>
                          </div>
                        </div>
                        <!--价格-->
                        <div class="price">¥ {{item.productPrice}}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- 合计 -->
            <div class="cart-bottom-bg fix-bottom">
              <div class="fix-bottom-inner">
                <div class="shipping">
                  <div class="shipping-box" style="padding: 0 40px;">
                    <div class="shipping-total shipping-price"><h4
                      class="highlight">应付总额：<em>￥{{checkPrice}}</em>
                    </h4>
                    </div>
                  </div>
                  <y-button class="big-main-btn"
                            :classStyle="sub_disabled?'disabled-btn':'main-btn'"
                            style="margin: 0;width: 130px;height: 50px;line-height: 50px;font-size: 16px"
                            text="提交订单"
                            @btnClick="_submitOrder">
                  </y-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </y-shelf>

      <y-popup :open="popupOpen" @close='popupOpen=false' :title="popupTitle">
        <div slot="content" class="md" :data-id="msg.addrId">
          <div>
            <input type="text" placeholder="收货人姓名" v-model="msg.receiverName">
          </div>
          <div>
            <input type="number" placeholder="固定号码" v-model="msg.receiverPhone">
          </div>
          <div>
            <input type="number" placeholder="移动电话" v-model="msg.receiverMobile">
          </div>
          <div>
            <el-cascader
              size="large"
              style="width: 100%"
              :options="options"
              v-model="selectedOptions"
              @change="handleChange">
            </el-cascader>
          </div>
          <div>
            <input type="text" placeholder="收货地址" v-model="msg.receiverAddress">
          </div>
          <div>
            <input type="text" placeholder="邮政编码" v-model="msg.receiverZip">
          </div>
          <div>
            <span> <el-checkbox v-model="msg.isDefault" style="margin-right: 5px;" :true-label="1" :false-label="0">
              设为默认</el-checkbox></span>
          </div>
          <y-button text='保存'
                    class="btn"
                    :classStyle="btnHighlight?'main-btn':'disabled-btn'"
                    @btnClick="save({addrId:msg.addrId})">
          </y-button>
        </div>
      </y-popup>
    </div>
    <y-footer></y-footer>
  </div>
</template>
<script>
  import { getCartList, addressList, addressUpdate, addressAdd, addressDel, getItemById, submitOrder } from '/api/goods'
  import YShelf from '/components/shelf'
  import YButton from '/components/YButton'
  import YPopup from '/components/popup'
  import YHeader from '/common/header'
  import YFooter from '/common/footer'
  import { regionData, CodeToText, TextToCode } from 'element-china-area-data'
  import Decimal from 'decimal.js'

  export default {
    data () {
      return {
        cartList: [],
        addList: [],
        addrId: '1',
        popupOpen: false,
        popupTitle: '管理收货地址',
        num: '', // 立刻购买
        productId: '',
        msg: {
          addrId: '',
          receiverName: '',
          receiverPhone: '',
          receiverMobile: '',
          receiverState: '',
          receiverCity: '',
          receiverDistrict: '',
          receiverAddress: '',
          receiverZip: '',
          isDefault: 0
        },
        options: regionData,
        selectedOptions: [],
        sub_disabled: false
      }
    },
    computed: {
      btnHighlight () {
        let msg = this.msg
        return msg.receiverName && msg.receiverPhone && msg.receiverAddress
      },
      // 选中的总价格
      checkPrice () {
        let totalPrice = 0
        this.cartList && this.cartList.forEach(item => {
          if (item.checked === '1') {
            let a = new Decimal(item.productPrice).mul(new Decimal(item.productNum))
            totalPrice = new Decimal(totalPrice).add(new Decimal(a)).toNumber()
          }
        })
        return totalPrice
      }
    },
    methods: {
      handleChange (value) {
        this.msg.receiverState = CodeToText[value[0]]
        this.msg.receiverCity = CodeToText[value[1]]
        this.msg.receiverDistrict = CodeToText[value[2]]
      },
      _getCartList () {
        getCartList()
          .then(res => {
            this.cartList = res.result
          })
      },
      _addressList () {
        addressList().then(res => {
          let data = res.result
          if (data.length) {
            this.addList = data
            let defaultAddr = data[0].addrId
            for (let curr of data) {
              if (curr.isDefault === 1) {
                defaultAddr = curr.addrId
              }
            }
            this.addrId = defaultAddr
          } else {
            this.addList = []
          }
        })
      },
      _addressUpdate () {
        addressUpdate(this.msg).then(res => {
          this._addressList()
        })
      },
      _addressAdd () {
        this.msg.isDefault = this.msg.isDefault
        addressAdd(this.msg).then(res => {
          this._addressList()
        })
      },
      _addressDel (params) {
        addressDel(params).then(res => {
          this._addressList()
        })
      },
      // 提交订单
      _submitOrder () {
        this.sub_disabled = true
        let realCart = []
        for (let item of this.cartList) {
          if (item.checked === '1') {
            realCart.push(item)
          }
        }
        // 进行订单的提交
        let req = new URLSearchParams()
        req.append('addrId', this.addrId)
        req.append('tbCartList', JSON.stringify(realCart))
        submitOrder(req)
          .then(res => {
            this.$message.success('订单创建成功，请尽快支付')
            // 需要拿到地址id
            this.$router.push({
              path: '/order/payment',
              query: {
                'addrId': this.addrId,
                'productId': this.productId,
                'num': this.num,
                'out_trade_no': res.result.orderId
              }
            })
          })
          .catch(res => {
            this.$message.error('订单创建失败，请尽重新提交订单')
          })
      },
      // 选择地址
      defaultAddress (id) {
        this.addrId = id
      },
      // 修改
      update (item) {
        this.popupOpen = true
        if (item) {
          this.popupTitle = '管理收货地址'
          this.msg.receiverName = item.receiverName
          this.msg.receiverPhone = item.receiverPhone
          this.msg.receiverMobile = item.receiverMobile

          this.msg.receiverState = item.receiverState
          this.msg.receiverCity = item.receiverCity
          this.msg.receiverDistrict = item.receiverDistrict
          this.selectedOptions = [TextToCode[item.receiverState].code,
            TextToCode[item.receiverState][item.receiverCity].code,
            TextToCode[item.receiverState][item.receiverCity][item.receiverDistrict].code]

          this.msg.receiverAddress = item.receiverAddress
          this.msg.receiverZip = item.receiverZip
          this.msg.isDefault = item.isDefault
          this.msg.addrId = item.addrId
        } else {
          this.popupTitle = '新增收货地址'
          this.msg.receiverName = ''
          this.msg.receiverPhone = ''
          this.msg.receiverMobile = ''
          this.msg.receiverState = ''
          this.msg.receiverCity = ''
          this.msg.receiverDistrict = ''
          this.msg.receiverAddress = ''
          this.msg.receiverZip = ''
          this.msg.isDefault = 0
          this.msg.addrId = ''
          this.selectedOptions = []
        }
      },
      // 保存
      save (p) {
        if (p.addrId) {
          this._addressUpdate()
        } else {
          delete p.addrId
          this._addressAdd()
        }
        this.popupOpen = false
      },
      // 删除
      del (addrId) {
        this._addressDel(addrId)
      },
      _productDet (productId) {
        getItemById(productId).then(res => {
          let item = {}
          if (res.status === 'success') {
            item.checked = '1'
            item.productImg = res.item.image.split(',')[0]
            item.productNum = this.num
            item.productPrice = res.item.price
            item.productId = res.item.id
            item.productName = res.item.title
            item.colour = res.item.colour
            item.size = res.item.size
            item.weight = res.item.weight
            item.priceView = res.item.priceView
          }
          this.cartList.push(item)
        })
      },
      subtotal (productPrice, productNum) {
        return new Decimal(productPrice).mul(new Decimal(productNum)).toNumber()
      }
    },
    created () {
      let query = this.$route.query
      if (query.productId && query.num) {
        this.productId = query.productId
        this.num = query.num
        this._productDet(this.productId)
      } else {
        this._getCartList()
      }
      this._addressList()
    },
    components: {
      YShelf,
      YButton,
      YPopup,
      YHeader,
      YFooter
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss" scoped type="text/scss">
  // 收货地址
  .address-item-list {
    padding: 30px 13px 0;
    .address {
      padding: 19px 14px 0 19px;
      p {
        line-height: 26px;
      }
    }
    li.checked {
      border-color: #6A8FE5;
      position: relative;
      background: #fff;
      .pa {
        right: 15px;
        top: 18px;
      }
      &:hover {
        background: #fff;
      }
    }
    li {
      position: relative;
      overflow: hidden;
      float: left;
      width: 376px;
      height: 198px;
      margin: 0 0 30px 16px;
      border: 1px solid #E5E5E5;
      border-radius: 3px;
      background: #FAFAFA;
      line-height: 14px;
      text-align: left;
      word-wrap: break-word;
      word-break: normal;
      color: #626262;
      cursor: pointer;
      -moz-user-select: -moz-none;
      -webkit-user-select: none;
      -o-user-select: none;
      user-select: none;
      &:hover {
        background: #F2F2F2;
        .operation-section {
          visibility: visible;
          transform: translate(0, 0);
        }
      }
      &.add-address-item {
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        p {
          margin-top: 5px;
        }
      }
      .operation-section {
        visibility: hidden;
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 28px;
        background: #E1E1E1;
        border-top: 1px solid #E1E1E1;
        transition: all .2s ease;
        transform: translate(0, 29px);
        border-top: 1px solid #E1E1E1;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 11;
        span {
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          flex: 1;
          height: 100%;
          &:hover {
            background: #F2F2F2;
          }
        }

        span + span {
          border-left: 1px solid #E1E1E1;
        }

      }
    }
  }

  .s-content {
    .md {
      > div {
        text-align: left;
        margin-bottom: 15px;
        > input {
          width: 100%;
          height: 50px;
          font-size: 18px;
          padding: 10px 20px;
          border: 1px solid #ccc;
          border-radius: 6px;
          box-shadow: 0 3px 5px -4px rgba(0, 0, 0, .4) inset, -1px 0 3px -2px rgba(0, 0, 0, .1) inset;
          line-height: 46px;
        }
      }
    }

    .btn {
      margin: 0;
      width: 100%;
      height: 50px;
      font-size: 14px;
      line-height: 48px
    }
  }

  .ui-cart {
    img {
      width: 80px;
      height: 80px;
    }

    .cart-table-title {
      position: relative;
      z-index: 1;
      line-height: 38px;
      height: 38px;
      padding: 0 0 0 30px;
      font-size: 12px;
      background: #eee;
      border-bottom: 1px solid #dbdbdb;
      border-bottom-color: rgba(0, 0, 0, .08);
      .name {
        float: left;
        text-align: left;
      }
      span {
        width: 137px;
        float: right;
        text-align: center;
        color: #838383;
      }
    }
    .cart-group.divide {
      .cart-items {
        border-top: 1px dashed #eee;
      }
    }
    .cart-items {
      position: relative;
      height: 140px;
      margin-left: 74px;
      .subtotal {
        font-weight: 700;
      }
      .item-cols-num,
      .price,
      .subtotal {
        overflow: hidden;
        float: right;
        width: 137px;
        text-align: center;
        color: #666;
        line-height: 140px;
      }
      /*数量*/
      .item-cols-num {
        padding-top: 50px;
        line-height: 40px;
      }
      .select {
        width: 112px;
        height: 40px;
        padding-top: 4px;
        margin: 0 auto;
        line-height: 40px;
        .down {
          background-position: 0 -60px;
        }
        .down.down-disabled:hover {
          background-position: 0 -300px;
          cursor: not-allowed;
        }
        .num {
          position: relative;
          overflow: hidden;
          display: inline-block;
          width: 36px;
          height: 18px;
          margin: 7px 0 0;
          border: none;
          border-radius: 3px;
          line-height: 18px;
          text-align: center;
          font-size: 14px;
          transition: all .2s ease-out;
        }
      }

    }
    .down.down-disabled {
      background-position: 0 -300px;
      cursor: not-allowed;
    }
  }

  .cart-group.divide .cart-top-items:first-child .cart-items {
    border-top: none;
  }

  .items-choose {
    position: absolute;
    left: -74px;
    top: 0;
    width: 74px;
    height: 20px;
    padding: 60px 0 0 31px;
    font-size: 12px;
    color: #999;
  }

  .items-thumb {
    position: relative;
    margin-top: 30px;
    overflow: hidden;
    width: 80px;
    height: 80px;
  }

  .cart-items .items-thumb > a, .ui-cart .cart-items .items-thumb > i {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    border: 1px solid #fff;
    border-radius: 3px;
    border: 0 solid rgba(255, 255, 255, .1);
    box-shadow: inset 0 0 0 1px rgba(0, 0, 0, .06);
  }

  .name {
    width: 380px;
    margin-left: 20px;
    color: #323232;
    display: table;
    a {
      color: #333;
      font-size: 16px;
    }
  }

  .name-table {
    display: table-cell;
    vertical-align: middle;
    height: 140px;
  }

  .fix-bottom {
    padding: 22px 29px 19px 30px;
    height: 90px;
    width: 100%;
    z-index: 1;
    background-position: center;
    background: #fdfdfd;
    background: -webkit-linear-gradient(#fdfdfd, #f9f9f9);
    background: linear-gradient(#fdfdfd, #f9f9f9);
    border-top: 1px solid #e9e9e9;
    box-shadow: 0 -3px 8px rgba(0, 0, 0, .04);
    .cart-bottom-bg {
      height: 80px;
      border-top: 1px solid #D9D9D9;
      border-radius: 0 0 8px 8px;
    }
    .fix-bottom-inner {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }
    .shipping {
      display: flex;
      align-items: center;
    }
    em {
      display: inline-block;
      position: relative;
      top: 3px;
      margin-top: -4px;
      font-size: 24px;
      color: #d44d44;
      font-weight: 700;
    }
  }

  .attribute, .name p {
    color: #999;
    font-size: 12px;
    padding-top: 4px;
    line-height: 17px;
  }


</style>
