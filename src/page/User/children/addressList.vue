<template>
  <div>
    <y-shelf title="收货地址">
      <span slot="right"><y-button text="添加收货地址" style="margin: 0" @btnClick="update()"></y-button></span>
      <div slot="content">
        <div v-if="addList.length">
          <div class="address-item" v-for="(item,i) in addList" :key="i">
            <div class="name">{{item.receiverName}}</div>
            <div class="address-msg">{{item.receiverState + item.receiverCity + item.receiverDistrict + item.receiverAddress}}</div>
            <div class="telephone">{{item.receiverMobile}}</div>
            <div class="defalut">
              <a @click="changeDef(item)"
                 href="javascript:;"
                 v-text="item.isDefault?'( 默认地址 )':'设为默认'"
                 :class="{'defalut-address':item.isDefault}"></a>
            </div>
            <div class="operation">
              <a href="javascript:;" @click="update(item)">修改</a>
              <a href="javascript:;" :data-id="item.addrId" @click="del(item.addrId)">删除</a>
            </div>
          </div>
        </div>
        <div v-else>
          <div style="padding: 80px 0;text-align: center">
            <div style="font-size: 20px">你还未添加收货地址</div>
            <div style="margin: 20px ">
              <y-button text="添加地址" @btnClick="update()"></y-button>
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
</template>
<script>
  import { addressList, addressUpdate, addressAdd, addressDel, setDefaultAddr } from '/api/goods'
  import YButton from '/components/YButton'
  import YPopup from '/components/popup'
  import YShelf from '/components/shelf'
  import { regionData, CodeToText, TextToCode } from 'element-china-area-data'

  export default {
    data () {
      return {
        addList: [],
        popupOpen: false,
        popupTitle: '管理收货地址',
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
        selectedOptions: []
      }
    },
    computed: {
      btnHighlight () {
        let msg = this.msg
        return msg.receiverName && msg.receiverPhone && msg.receiverAddress
      }
    },
    methods: {
      handleChange (value) {
        this.msg.receiverState = CodeToText[value[0]]
        this.msg.receiverCity = CodeToText[value[1]]
        this.msg.receiverDistrict = CodeToText[value[2]]
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
      _addressUpdate (params) {
        addressUpdate(this.msg).then(res => {
          this._addressList()
        })
      },
      _addressAdd (params) {
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
      changeDef (item) {
        if (!item.isDefault) {
          item.isDefault = 1
          setDefaultAddr(item).then(res => {
            this._addressList()
          })
        }
        return false
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
      del (addrId, i) {
        this._addressDel(addrId)
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
      }
    },
    created () {
      this._addressList()
    },
    components: {
      YButton,
      YPopup,
      YShelf
    }
  }
</script>
<style scoped lang="scss" type="text/scss">
  .address-item {
    display: flex;
    align-items: center;
    height: 115px;
    text-align: center;
    .name {
      width: 106px;
    }
    .address-msg {
      flex: 1;
    }
    .telephone {
      width: 160px;
    }
    .defalut {
      width: 80px;
      > a {
        text-align: center;
        /*display: none;*/
      }
    }
    .operation {
      width: 135px;
      a {
        padding: 10px 5px;
      }
    }
    &:hover {
      .defalut > a {
        display: block;
      }
    }
  }

  .address-item + .address-item {
    border-top: 1px solid #CFCFCF;
  }

  .defalut-address {
    color: #626262;
    display: block;
    pointer-events: none;
    cursor: default;
  }

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
</style>
