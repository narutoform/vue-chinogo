<!--商品详情-->
<template>
  <div class="w store-content">
    <div class="gray-box">
      <div class="gallery-wrapper">
        <div class="gallery">
          <div class="thumbnail">
            <ul>
              <li v-for="(image, index) in small" :class="{on:big===item}" @click="big=item.image.split(',')[index]">
                <img v-lazy="image" :alt="item.title">
              </li>
            </ul>
          </div>
          <div class="thumb">
            <div class="big">
              <img :src="big" :alt="item.title">
            </div>
          </div>
        </div>
      </div>
      <!--右边-->
      <div class="banner">
        <div class="sku-custom-title">
          <h4>{{item.title}}</h4>
          <h6>
            <span>{{item.sellPoint}}</span>
            <span class="price">
              <em>¥</em><i>{{item.price}}</i></span>
          </h6>
        </div>
        <div class="num">
          <span class="params-name">数量</span>
          <buy-num @edit-num="editNum" :limit="Number(item.num)"></buy-num>
        </div>
        <div class="buy">
          <y-button text="加入购物车"
                    @btnClick="addCart(item.id,item.price,item.title,item.image, item.colour, item.size, item.weight)"
                    classStyle="main-btn"
                    style="width: 145px;height: 50px;line-height: 48px"></y-button>
          <y-button text="现在购买"
                    @btnClick="checkout(item.id)"
                    style="width: 145px;height: 50px;line-height: 48px"></y-button>
        </div>
      </div>
    </div>

    <el-tabs type="border-card">
      <el-tab-pane label="商品详情">
        <div class="item-info">
          <div slot="content">
            <div class="img-item" v-if="itemDesc" v-html="itemDesc">
            </div>
            <div class="no-info" v-else>
              该产品暂无内容
            </div>
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane label="规格参数">
        <el-form v-for="(paramData, index) in itemParamItem" label-position="left">
          <el-form-item label-width="200px" :label="paramData.group">
            <el-form-item label-width="120px" :label="param.k" v-for="(param, index) in paramData.params">
              <el-form-item label-width="580px" :label="param.v"></el-form-item>
            </el-form-item>
          </el-form-item>
          <hr style="height:1px;border:none;border-top:1px dashed #c0c0c0;"/>
        </el-form>
      </el-tab-pane>
    </el-tabs>

  </div>
</template>
<script>
  import { addCart, getItemById, getItemDescById, getItemParamItemByItemId } from '/api/goods'
  import { mapMutations, mapState } from 'vuex'
  import BuyNum from '/components/buynum'
  import YButton from '/components/YButton'

  export default {
    data () {
      return {
        itemDesc: '',
        itemParamItem: [],
        small: [],
        big: '',
        item: {},
        productNum: 1
      }
    },
    computed: {
      ...mapState(['login', 'showMoveImg', 'showCart'])
    },
    methods: {
      ...mapMutations(['ADD_CART', 'ADD_ANIMATION', 'SHOW_CART']),
      _itemBase (id) {
        getItemById(id).then(res => {
          if (res.status === 'success') {
            let result = res.item
            this.item = result
            this.small = result.image.split(',')
            this.big = this.small[0]
          }
        })
      },
      _itemDesc (id) {
        getItemDescById(id).then(res => {
          if (res.status === 'success') {
            this.itemDesc = res.itemDesc.itemDesc || ''
          }
        })
      },
      _itemParam (id) {
        getItemParamItemByItemId(id).then(res => {
          if (res.status === 'success') {
            this.itemParamItem = JSON.parse(res.itemParamItem.paramData) || []
          }
        })
      },
      addCart (id, price, name, img, colour, size, weight) {
        if (!this.showMoveImg) {     // 动画是否在运动
          if (this.login) { // 登录了 直接存在用户名下
            let req = new URLSearchParams()
            req.append('productId', id)
            req.append('productNum', this.productNum)
            addCart(req)
              .then(res => {
                // 并不重新请求数据
                this.ADD_CART({
                  productId: id,
                  productPrice: price,
                  productName: name,
                  productImg: img,
                  productNum: this.productNum,
                  colour: colour,
                  size: size,
                  weight: weight
                })
                this.$message.success('添加购物车成功')
              })
              .catch(res => {
                this.$message.error('添加购物车失败')
              })
          } else { // 未登录 vuex
            this.ADD_CART({
              productId: id,
              productPrice: price,
              productName: name,
              productImg: img,
              productNum: this.productNum,
              colour: colour,
              size: size,
              weight: weight
            })
            this.$message.success('添加购物车成功')
          }
          // 加入购物车动画
          var dom = event.target
          // 获取点击的坐标
          let elLeft = dom.getBoundingClientRect().left + (dom.offsetWidth / 2)
          let elTop = dom.getBoundingClientRect().top + (dom.offsetHeight / 2)
          // 需要触发
          this.ADD_ANIMATION({moveShow: true, elLeft: elLeft, elTop: elTop, img: img})
          if (!this.showCart) {
            this.SHOW_CART({showCart: true})
          }
        }
      },
      checkout (productId) {
        this.$router.push({path: '/checkout', query: {productId, num: this.productNum}})
      },
      editNum (num) {
        this.productNum = num
      }
    },
    components: {
      BuyNum, YButton
    },
    created () {
      let id = this.$route.query.id
      this._itemBase(id)
      this._itemDesc(id)
      this._itemParam(id)
    }
  }
</script>
<style lang="scss" scoped type="text/scss">
  @import "../../assets/style/mixin";

  .store-content {
    clear: both;
    width: 1220px;
    min-height: 600px;
    padding: 0 0 25px;
    margin: 0 auto;
  }

  .gray-box {
    display: flex;
    padding: 60px;
    margin: 20px 0;
    .gallery-wrapper {
      .gallery {
        display: flex;
        width: 540px;
        .thumbnail {
          li:first-child {
            margin-top: 0px;
          }
          li {
            @include wh(80px);
            margin-top: 10px;
            padding: 12px;
            border: 1px solid #f0f0f0;
            border: 1px solid rgba(0, 0, 0, .06);
            border-radius: 5px;
            cursor: pointer;
            &.on {
              padding: 10px;
              border: 3px solid #ccc;
              border: 3px solid rgba(0, 0, 0, .2);
            }
            img {
              display: block;
              @include wh(100%);
            }
          }
        }
        .thumb {
          .big {
            margin-left: 20px;
          }
          img {
            display: block;
            @include wh(440px)
          }
        }
      }
    }
    // 右边
    .banner {
      width: 450px;
      margin-left: 10px;
      h4 {
        font-size: 24px;
        line-height: 1.25;
        color: #000;
        margin-bottom: 13px;
      }
      h6 {
        font-size: 14px;
        line-height: 1.5;
        color: #bdbdbd;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .sku-custom-title {
        overflow: hidden;
        padding: 8px 8px 18px 10px;
        position: relative;
      }
      .params-name {
        padding-right: 20px;
        font-size: 14px;
        color: #8d8d8d;
        line-height: 36px;
      }
      .num {
        padding: 29px 0 8px 10px;
        border-top: 1px solid #ebebeb;
        display: flex;
        align-items: center;
      }
      .buy {
        position: relative;
        border-top: 1px solid #ebebeb;
        padding: 30px 0 0 10px;
      }
    }
  }

  .item-info {

    .gray-box {
      padding: 0;
      display: block;
    }
    .img-item {
      width: 1220px;
      img {
        width: 100%;
        height: auto;
        display: block;
      }
    }
  }

  .no-info {
    padding: 200px 0;
    text-align: center;
    font-size: 30px;
  }

  .price {
    display: block;
    color: #d44d44;
    font-weight: 700;
    font-size: 16px;
    line-height: 20px;
    text-align: right;
    i {
      padding-left: 2px;
      font-size: 24px;
    }
  }

</style>
