<script src="../../../utils/formatDate.js"></script>
<template>
  <div>
    <y-shelf title="我的订单">
      <div slot="content">
        <div v-if="orderList.length">

          <div v-for="(item,i) in orderList" :key="i">
            <div class="gray-sub-title cart-title">
              <div class="first">
                <div>
                  <span class="date">{{item.order.createTime | dateFormat}}</span>
                  <span class="order-id"> 订单号： <a href="javascript:;">{{item.order.orderId}}</a> </span>
                </div>
                <div class="f-bc">
                  <span class="price">单价</span>
                  <span class="num">数量</span>
                  <span class="operation">商品操作</span>
                </div>
              </div>
              <div class="last">
                <span class="sub-total">实付金额</span>
                <span> 订单状态<em class="icon-font"></em> </span>
              </div>
            </div>
            <div class="pr">
              <div class="cart" v-for="(good,j) in item.orderItems" :key="j">
                <div class="cart-l" :class="{bt:j>0}">
                  <div class="car-l-l">
                    <div class="img-box"><img
                      :src="good.picPath.split(',')[0]"
                      alt=""></div>
                    <div class="ellipsis">{{good.title}}</div>
                  </div>
                  <div class="cart-l-r">
                    <div>¥ {{(good.totalFee / 100).toFixed(2)}}</div>
                    <div class="num">{{good.num}}</div>
                    <div class="type"><a @click="_delOrder(item.order.orderId,i)" href="javascript:;" v-if="j<1"
                                         class="del-order">删除此订单</a>
                    </div>
                  </div>
                </div>
                <div class="cart-r">
                  <span></span>
                  <span></span>
                </div>
              </div>
              <div class="prod-operation pa" style="right: 0;top: 0;">
                <div class="total">¥ {{(item.order.payment / 100).toFixed(2)}}</div>
                <div class="status"> {{item.order.status | payStatus}}</div>
              </div>
            </div>
          </div>

          <div class="Pagination" style="text-align: left;margin-top: 20px; margin-bottom: 10px; margin-left: 10px">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-sizes="[5, 10, 15, 20]"
              :page-size="limit"
              layout="total, sizes, prev, pager, next, jumper"
              :total="count">
            </el-pagination>
          </div>
        </div>
        <div v-else>
          <div style="padding: 100px 0;text-align: center">
            你还未创建过订单
          </div>
        </div>
      </div>
    </y-shelf>

  </div>
</template>
<script>
  import { orderList, delOrder } from '/api/goods'
  import YShelf from '/components/shelf'
  import { formatDate } from '/utils/formatDate.js'

  export default {
    data () {
      return {
        orderList: [],
        currentPage: 1,
        count: 0,
        limit: 5
      }
    },
    methods: {
      _orderList () {
        let req = new URLSearchParams()
        req.append('current', this.currentPage)
        req.append('size', this.limit)
        orderList(req).then(res => {
          this.orderList = res.records
          this.count = res.total
        }).catch(res => {
          this.$message.error('登录失效，请重新登陆')
        })
      },
      _delOrder (orderId, i) {
        delOrder(orderId)
          .then(res => {
            if (res.status === '0') {
              this.$message.success('删除成功')
              this.orderList.splice(i, 1)
            } else {
              this.$message.error('删除失败')
            }
          })
          .catch(res => {
            this.$message.error('删除失败')
          })
      },
      handleSizeChange (val) {
        this.limit = val
        this._orderList()
      },
      handleCurrentChange (val) {
        this.currentPage = val
        this._orderList()
      }
    },
    created () {
      this._orderList()
    },
    components: {
      YShelf
    },
    filters: {
      dateFormat (date) {
        let now = new Date(date)
        return formatDate(now, 'yyyy-MM-dd hh:mm:ss')
      },
      // 支付状态判断
      payStatus (val) {
        if (val === 1) {
          return '未付款'
        } else if (val === 2) {
          return '已付款'
        } else if (val === 3) {
          return '未发货'
        } else if (val === 4) {
          return '已发货'
        } else if (val === 5) {
          return '交易成功'
        } else if (val === 6) {
          return '交易关闭'
        } else {
          return '未知错误'
        }
      }
    }
  }
</script>
<style lang="scss" scoped type="text/scss">
  @import "../../../assets/style/mixin";

  .gray-sub-title {
    height: 38px;
    padding: 0 24px;
    background: #EEE;
    border-top: 1px solid #DBDBDB;
    border-bottom: 1px solid #DBDBDB;
    line-height: 38px;
    font-size: 12px;
    color: #666;
    display: flex;
    span {
      display: inline-block;
      height: 100%;
    }
    .first {
      display: flex;
      justify-content: space-between;
      flex: 1;
      .f-bc {
        > span {
          width: 112px;
          text-align: center;
        }
      }
    }
    .last {
      width: 230px;
      text-align: center;
      display: flex;
      border-left: 1px solid #ccc;
      span {
        flex: 1;
      }
    }
  }

  .bt {
    border-top: 1px solid #EFEFEF;
  }

  .date {
    padding-left: 6px;
  }

  .order-id {
    margin-left: 20px;
  }

  .cart {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 24px;
    &:hover {
      .del-order {
        display: block;
      }
    }
    .del-order {
      display: none;
    }
    .cart-l {
      display: flex;
      align-items: center;
      flex: 1;
      padding: 15px 0;
      justify-content: space-between;
      position: relative;
      &:before {
        position: absolute;
        content: ' ';
        right: -1px;
        top: 0;
        width: 1px;
        background-color: #EFEFEF;
        height: 100%;
      }
      .ellipsis {
        margin-left: 20px;
        width: 220px;
      }
      .img-box {
        border: 1px solid #EBEBEB;
      }
      img {
        display: block;
        @include wh(80px);
      }
      .cart-l-r {
        display: flex;
        > div {
          text-align: center;
          width: 112px;
        }
      }
      .car-l-l {
        display: flex;
        align-items: center;
      }
    }
    .cart-r {
      width: 230px;
      display: flex;
      span {
        text-align: center;
        flex: 1;
      }
    }
  }

  .prod-operation {
    height: 110px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 254px;
    div {
      width: 100%;
      text-align: center;
    }
    div:last-child {
      padding-right: 24px;
    }
  }
</style>
