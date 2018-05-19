<template>
  <div class="goods">
    <div class="nav">

      <div class="w">
        <a href="javascript:;" :class="{active:sortType===1}" @click="reset()">综合排序</a>
        <a href="javascript:;" @click="sort(1)" :class="{active:sortType===2}">价格从低到高</a>
        <a href="javascript:;" @click="sort(-1)" :class="{active:sortType===3}">价格从高到低</a>
        <div class="price-interval">
          <input type="number" class="input" placeholder="价格" v-model="min">
          <span style="margin: 0 5px"> - </span>
          <input type="number" placeholder="价格" v-model="max">
          <y-button text="确定" classStyle="main-btn" @btnClick="maxAndMin" style="margin-left: 10px;"></y-button>
        </div>
      </div>
    </div>

    <!--商品-->
    <div class="goods-box w">
      <mall-goods v-for="(item,i) in searchList" :key="i" :msg="item"></mall-goods>
    </div>
    <div v-show="!busy" class="w" style="text-align: center;background: #fff" v-infinite-scroll="loadMore"
         infinite-scroll-disabled="busy" infinite-scroll-distance="0">
      正在加载中...
    </div>
  </div>
</template>
<script>
  import mallGoods from '/components/mallGoods'
  import YButton from '/components/YButton'
  import { mapState, mapMutations } from 'vuex'

  export default {
    data () {
      return {
        min: '',
        max: '',
        sortType: 1,
        windowHeight: null,
        windowWidth: null
      }
    },
    computed: {
      ...mapState([
        'paramsData', 'searchResult', 'searchList', 'timer', 'busy'
      ])
    },
    methods: {
      ...mapMutations(['SEARCH_ITEM', 'SEARCH_ITEM_PARAM', 'ADD_SEARCH_ITEM', 'LOADMORE', 'SETBUSY', 'SETMAXPRICE', 'SETMINPRICE']),
      _getItems (flag) {
        let paramsData = this.paramsData
        // 获取查询参数
        let q = this.$route.query.q || ''
        if (!q) {
          this.SETBUSY(true)
          return this.$message.error('参数为空')
        }
        let pa = {
          q: q,
          page: paramsData.params.page,
          sort: paramsData.params.sort
        }
        if (paramsData.params.priceGt) {
          pa.priceGt = paramsData.params.priceGt
        }
        if (paramsData.params.priceLte) {
          pa.priceLte = paramsData.params.priceLte
        }
        this.SEARCH_ITEM_PARAM(pa)
        this.SEARCH_ITEM(flag)
      },
      // 默认排序
      reset () {
        this.paramsData.sortType = 1
        this.paramsData.params.sort = ''
        this.paramsData.params.page = 1
        this.SETBUSY(false)
        this._getItems()
      },
      // 价格排序
      sort (v) {
        v === 1 ? this.sortType = 2 : this.sortType = 3
        this.paramsData.params.sort = v
        this.paramsData.params.page = 1
        this.SETBUSY(false)
        this._getItems()
      },
      // 最小到最大区间
      maxAndMin () {
        this.paramsData.params.page = 1
        this.SETMAXPRICE(this.max * 100)
        this.SETMINPRICE(this.min * 100)
        this.SETBUSY(false)
        this._getItems()
      },
      // 加载更多
      loadMore () {
        this.SETBUSY(false)
        let timer = setTimeout(() => {
          this.paramsData.params.page++
          this._getItems(true)
        }, 1)
        this.LOADMORE(timer)
      }
    },
    mounted () {
      this.windowHeight = window.innerHeight
      this.windowWidth = window.innerWidth
    },
    components: {
      mallGoods,
      YButton
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss" scoped type="text/scss">
  @import "../../assets/style/mixin";
  @import "../../assets/style/theme";

  .nav {
    height: 60px;
    line-height: 60px;
    > div {
      display: flex;
      align-items: center;
      a {
        padding: 0 15px;
        height: 100%;
        @extend %block-center;
        font-size: 12px;
        color: #999;
        &.active {
          color: #5683EA;
        }
        &:hover {
          color: #5683EA;
        }
      }
      input {
        @include wh(80px, 30px);
        border: 1px solid #ccc;
      }
      input + input {
        margin-left: 10px;
      }
    }
    .price-interval {
      padding: 0 15px;
      @extend %block-center;
      input[type=number] {
        border: 1px solid #ccc;
        text-align: center;
        background: none;
        border-radius: 5px;
      }
    }
  }

  .goods-box {
    > div {
      float: left;
      border: 1px solid #efefef;
    }
  }


</style>
