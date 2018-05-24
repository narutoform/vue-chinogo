<template>
  <div class="good-item">
    <div style="">
      <div class="good-img">
        <router-link :to="'goodsDetails?id='+msg.id">
          <img v-lazy="msg.image.split(',')[0]" :alt="msg.title">
        </router-link>
      </div>
      <h6 class="good-title" v-html="msg.title"></h6>
      <h3 class="sub-title ellipsis" v-html="msg.sellPoint"></h3>
      <div class="good-price pr">
        <div class="ds pa">
          <router-link :to="'goodsDetails?id='+msg.id">
            <y-button text="查看详情" style="margin: 0 5px"></y-button>
          </router-link>
          <y-button text="加入购物车"
                    style="margin: 0 5px"
                    @btnClick="addCart(msg.id,msg.price,msg.title,msg.image.split(',')[0],msg.colour,msg.size,msg.weight)"
                    classStyle="main-btn"
          ></y-button>
        </div>
        <p><span style="font-size: 16px">￥</span>
          {{msg.price}}</p>
      </div>
    </div>
  </div>
</template>
<script>
  import YButton from '/components/YButton'
  import { addCart } from '/api/goods.js'
  import { mapMutations, mapState } from 'vuex'

  export default {
    props: {
      msg: {type: Object}
    },
    data () {
      return {}
    },
    methods: {
      ...mapMutations(['ADD_CART', 'ADD_ANIMATION', 'SHOW_CART']),
      goodsDetails (id) {
        this.$router.push({path: 'goodsDetails/id=' + id})
      },
      addCart (id, price, name, img, colour, size, weight) {
        if (!this.showMoveImg) {     // 动画是否在运动
          if (this.login) { // 登录了 直接存在用户名下
            let req = new URLSearchParams()
            req.append('productId', id)
            addCart(req)
              .then(res => {
                // 并不重新请求数据
                this.ADD_CART({
                  productId: id,
                  productPrice: price,
                  productName: name,
                  productImg: img,
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
      }
    },
    computed: {
      ...mapState(['login', 'showMoveImg', 'showCart'])
    },
    components: {
      YButton
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss" scoped type="text/scss">
  @import "../assets/style/mixin";
  @import "../assets/style/theme";

  .good-item {
    background: #fff;
    width: 25%;
    transition: all .5s;
    height: 440px;
    &:hover {
      transform: translateY(-3px);
      box-shadow: 1px 1px 20px #999;
      .good-price p {
        display: none;
      }
      .ds {
        display: flex;
      }
    }
    .ds {
      @extend %block-center;
      width: 100%;
      display: none;
    }

    .good-img {
      img {
        margin: 50px auto 10px;
        @include wh(206px);
        display: block;
      }
    }
    .good-price {
      margin: 15px 0;
      height: 30px;
      text-align: center;
      line-height: 30px;
      color: #e4393c;
      font-size: 20px;
    }
    .good-title {
      line-height: 1.0;
      font-size: 16px;
      color: #424242;
      margin: 0 auto;
      padding: 0 14px;
      text-align: center;
      overflow: hidden;
    }
    h3 {
      text-align: center;
      line-height: 1.2;
      font-size: 12px;
      color: #d0d0d0;
      padding: 10px;
    }

  }
</style>
