<template>
  <div class="login v2">
    <div class="wrapper">
      <div class="dialog dialog-shadow" style="display: block; margin-top: -362px;">
        <div class="title" v-if="loginPage">
          <h4>使用 chinogo 账号登录官网</h4></div>
        <div v-if="loginPage" class="content">
          <ul class="common-form">
            <li class="username border-1p">
              <div class="input">
                <input type="text" v-model="ruleForm.userName" placeholder="账号">
              </div>
            </li>
            <li>
              <div class="input">
                <input type="password" v-model="ruleForm.userPwd" @keyup.enter="login" placeholder="密码">
              </div>
            </li>
            <li style="text-align: right" class="pr">
              <span class="pa" style="top: 0;left: 0;color: #d44d44">{{ruleForm.errMsg}}</span>
              <a href="javascript:;" style="padding: 0 5px" @click="loginPage=false">注册 chinogo</a>
            </li>
          </ul>
          <!--登陆-->
          <div>
            <y-button text="登陆"
                      :classStyle="ruleForm.userPwd&& ruleForm.userName?'main-btn':'disabled-btn'"
                      @btnClick="login"
                      style="margin: 0;width: 100%;height: 48px;font-size: 18px;line-height: 48px"></y-button>
          </div>
        </div>
        <div class="registered" v-else>
          <h4>注册 chinogo</h4>
          <div class="content" style="margin-top: 20px;">
            <ul class="common-form">
              <li class="username border-1p">
                <div class="input">
                  <input type="text"
                         v-model="registered.userName" placeholder="用户名"
                         @focus="username_focus()"
                         @blur="username_blur()"
                         @keyup="registered.userName=registered.userName.replace(/[^\w\-\u4e00-\u9fa5]/ig,'')">
                </div>
                <div v-if="username_show" v-html="username_message"></div>
              </li>
              <li>
                <div class="input">
                  <input type="password"
                         v-model="registered.userPwd"
                         @focus="password_focus()"
                         @blur="password_blur()"
                         placeholder="密码">
                </div>
                <div v-if="password_show" v-html="password_message"></div>
              </li>
              <li>
                <div class="input">
                  <input type="password"
                         v-model="registered.userPwd2"
                         @focus="check_password_focus()"
                         @blur="check_password_blur()"
                         placeholder="确认密码">
                </div>
                <div v-if="check_password_show" v-html="check_password_message"></div>
              </li>
              <li>
                <div class="input">
                  <input type="text"
                         v-model="registered.phone"
                         @focus="phone_focus()"
                         @blur="phone_blur()"
                         placeholder="手机号">
                </div>
                <div v-if="phone_show" v-html="phone_message"></div>
                <a class="orEmail" href="javascript:;" @click="mail_show_form = !mail_show_form" tabindex="-1">邮箱验证</a>
              </li>
              <li v-if="mail_show_form">
                <div class="input">
                  <input type="text"
                         v-model="registered.mail"
                         @focus="mail_focus()"
                         @blur="mail_blur()"
                         placeholder="邮 箱 验 证">
                </div>
                <div v-if="mail_show" v-html="mail_message"></div>
              </li>
              <li>
                <div class="input">
                  <input type="text"
                         v-model="registered.authCode"
                         @focus="authCode_focus()"
                         @blur="authCode_blur()"
                         autocomplete="off"
                         placeholder="请输入验证码">
                  <img class="img-code" title="换一换" id="imgAuthCode"
                       :src="auth_code_url"
                       @click="auth_code_url = 'http://localhost:8104/verify/image?uid=' + my_uuid + '&amp;yys=' + new Date().getTime()"
                       ver_colorofnoisepoint="#888888"/>
                </div>
                <div v-if="authCode_show" v-html=" authCode_message"></div>
              </li>
              <li>
                <div class="input">
                  <input type="text"
                         v-model="registered.mobileCode"
                         autocomplete="off"
                         placeholder="请输入手机验证码">
                </div>
                <y-button
                  :classStyle="form.phone_check && mobileCodeShow?'main-btn':'disabled-btn'"
                  :text="mobileCodeMessage"
                  style="margin: 0;line-height: 48px; position: absolute;right: 3px;
                  top: 3px;width: 110px;height: 44px;border: none; padding: 0; font-size:9px"
                  @btnClick="sendMobileCode">
                </y-button>
                <div>手机验证码:{{showMobileCode}}</div>
              </li>
            </ul>
            <div>
              <y-button
                :classStyle="check_isRegist()?'main-btn':'disabled-btn'"
                text="注册"
                style="margin: 0;width: 100%;height: 48px;font-size: 18px;line-height: 48px"
                @btnClick="regist"
              >
              </y-button>
            </div>
            <ul class="common-form pr">
              <li class="pa" style="left: 0;top: 0;margin: 0;color: #d44d44">{{registered.errMsg}}</li>
              <li style="text-align: center;line-height: 48px;margin-bottom: 0;">
                <span>如果您已注册 chinogo，则可在此</span>
                <a href="javascript:;"
                   style="margin: 0 5px"
                   @click="loginPage=true">登陆</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import YFooter from '/common/footer'
  import YButton from '/components/YButton'
  import {
    userLogin, register, uuid, authCodeCheck, userIsEngaged, mailIsEngaged, phoneIsEngaged,
    mobileCode
  } from '/api/index.js'
  import { addCart1 } from '/api/goods.js'
  import { getStore, removeStore } from '/utils/storage.js'

  export default {
    data () {
      return {
        username_show: false,
        username_message: '',
        password_show: false,
        password_message: '',
        check_password_show: false,
        check_password_message: '',
        phone_show: false,
        phone_message: '',
        mail_show_form: false,
        mail_show: false,
        mail_message: '',
        authCode_show: false,
        authCode_message: '',
        showMobileCode: '',
        mobileCodeMessage: '获取验证码',
        mobileCodeShow: true,
        timer: Object,
        my_uuid: '',
        auth_code_url: '',
        cart: [],
        loginPage: true,
        ruleForm: {
          userName: '',
          userPwd: '',
          errMsg: ''
        },
        registered: {
          userName: '',
          userPwd: '',
          userPwd2: '',
          phone: '',
          mail: '',
          authCode: '',
          mobileCode: '',
          errMsg: ''
        },
        form: {
          username_check: false,
          password_check: false,
          check_password_check: false,
          mail_check: false,
          phone_check: false,
          authCode_check: false
        }
      }
    },
    computed: {
      count () {
        return this.$store.state.login
      }
    },
    methods: {
      // 用户名提示
      username_focus () {
        this.username_show = true
        this.username_message = '支持中文、字母、数字、“-”“_”的组合，1-20个字符'
      },
      // 用户名检测
      username_blur () {
        let userName = this.registered.userName
        if (!userName) {
          this.username_message = '<span style="color: red">账号不能为空</span>'
          this.form.username_check = false
          return false
        }
        if (userName.length < 1 || userName.length > 20) {
          this.username_message = '<span style="color: red">账号长度不规范</span>'
          this.form.username_check = false
          return false
        }

        let req = new URLSearchParams()
        req.append('regName', userName)
        userIsEngaged(req).then(res => {
          if (res.success === 1) {
            this.username_show = true
            let namelist = res.morePin
            this.username_message = `<span style="color: red">该用户名已经被别人注册了,推荐${namelist[0]},${namelist[1]},${namelist[2]}</span>`
            this.form.username_check = false
          } else {
            this.username_show = false
            this.form.username_check = true
          }
        })
      },
      // 邮箱提示
      mail_focus () {
        this.mail_show = true
        this.mail_message = '完成验证后，你可以用该邮箱登录和找回密码'
      },
      // 邮箱检测
      mail_blur () {
        let mail = this.registered.mail
        if (!(/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(mail))) {
          this.mail_message = '<span style="color: red">邮箱不合法</span>'
          this.form.mail_check = false
          return false
        }
        let req = new URLSearchParams()
        req.append('email', this.registered.mail)
        mailIsEngaged(req).then(res => {
          if (res.success === 1) {
            this.mail_show = true
            this.mail_message = '<span style="color: red">该邮箱已经被别人注册了QAQ</span>'
            this.form.mail_check = false
          } else {
            this.mail_show = false
            this.form.mail_check = true
          }
        })
      },
      // 手机提示
      phone_focus () {
        this.phone_show = true
        this.phone_message = '完成验证后，你可以用该手机登录和找回密码'
      },
      // 手机检测
      phone_blur () {
        let phone = this.registered.phone
        if (!phone) {
          this.phone_message = '<span style="color: red">手机号不能为空</span>'
          return false
        }
        if (phone.length !== 11 && !(/^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(14[0-9]{1})|)+\d{8})$/.test(phone))) {
          this.form.phone_check = false
          this.phone_message = '<span style="color: red">手机号不合法</span>'
          return false
        }
        let req = new URLSearchParams()
        req.append('phone', phone)
        phoneIsEngaged(req).then(res => {
          if (res.success === 1) {
            this.phone_show = true
            this.phone_message = '<span style="color: red">该手机已经被别人注册了QAQ</span>'
            this.form.phone_check = false
          } else {
            this.phone_show = false
            this.form.phone_check = true
          }
        })
      },
      // 密码提示
      password_focus () {
        this.password_show = true
        this.password_message = '建议使用字母、数字和符号两种及以上的组合，6-20个字符'
      },
      // 密码检测
      password_blur () {
        let userPwd = this.registered.userPwd
        if (!userPwd) {
          this.password_message = '<span style="color: red">密码不能为空</span>'
          this.form.password_check = false
          return false
        }
        if (userPwd.length < 6 || userPwd.length > 20) {
          this.password_message = '<span style="color: red">密码长度不规范</span>'
          this.form.password_check = false
          return false
        }
        this.password_show = false
        this.form.password_check = true
      },
      // 确认密码提示
      check_password_focus () {
        this.check_password_show = true
        this.check_password_message = '建议使用字母、数字和符号两种及以上的组合，6-20个字符'
      },
      // 确认密码检测
      check_password_blur () {
        let userPwd2 = this.registered.userPwd2
        if (!userPwd2) {
          this.check_password_message = '<span style="color: red">确认密码不能为空</span>'
          this.form.check_password_check = false
          return false
        }
        if (userPwd2 !== this.registered.userPwd) {
          this.check_password_message = '<span style="color: red">两次输入的密码不相同</span>'
          this.form.check_password_check = false
          return false
        }
        this.check_password_show = false
        this.form.check_password_check = true
      },
      // 验证码提示
      authCode_focus () {
        this.authCode_show = true
        this.authCode_message = '看不清？点击图片更换验证码'
      },
      // 验证码检测
      authCode_blur () {
        let authCode = this.registered.authCode
        if (!authCode) {
          this.authCode_message = '<span style="color: red">验证码不能为空</span>'
          this.form.authCode_check = false
          return false
        }
        // 判断验证码是否正确
        let params = new URLSearchParams()
        params.append('authCode', authCode)
        params.append('uuid', this.my_uuid)
        authCodeCheck(params)
          .then((res) => {
            if (res.success === 1) {
              this.authCode_message = '<span style="color: red">验证码不对</span>'
              this.form.authCode_check = false
            } else {
              this.authCode_show = false
              this.form.authCode_check = true
            }
          })
      },
      // 登陆时将本地的添加到用户购物车
      login_addCart () {
        let cartArr = []
        let locaCart = JSON.parse(getStore('buyCart'))
        if (locaCart && locaCart.length) {
          locaCart.forEach(item => {
            cartArr.push({
              'productId': item.productId,
              'productNum': item.productNum
            })
          })
        }
        this.cart = cartArr
      },
      // 进行登陆
      login () {
        if (!this.ruleForm.userName || !this.ruleForm.userPwd) {
          this.ruleForm.errMsg = '账号或者密码不能为空!'
          return false
        }
        userLogin({
          'username': this.ruleForm.userName,
          'password': this.ruleForm.userPwd
        })
          .then(res => {
            // 返回信息=》 -1:用户名不存在或者密码错误 1: 成功响应首页
            if (res.status === -1) {
              this.ruleForm.errMsg = res.err
              this.$message.error('登陆失败')
              return false
            } else {
              this.$message.success('登陆成功')
              if (this.cart.length) {
                addCart1(this.cart).then(res => {
                  if (res.status === '1') {
                    removeStore('buyCart')
                  }
                }).then(this.$router.push(this.$route.query.redirect || '/'))
              } else {
                this.$router.push(this.$route.query.redirect || '/')
              }
            }
          })
          .catch(() => {
            this.$message.error('登陆失败')
            this.ruleForm.errMsg = '登陆失败'
          })
      },
      // 判断注册信息是否合乎规范
      check_isRegist () {
        let usernameCheck = this.form.username_check
        let passwordCheck = this.form.password_check
        let checkPasswordCheck = this.form.check_password_check
        let mailCheck = this.form.mail_check
        let phoneCheck = this.form.phone_check
        let authCodeCheck = this.form.authCode_check

        let isCheck = false
        if (this.mail_show_form) {
          isCheck = usernameCheck && passwordCheck && checkPasswordCheck && authCodeCheck && phoneCheck && mailCheck
        } else {
          isCheck = usernameCheck && passwordCheck && checkPasswordCheck && authCodeCheck && phoneCheck
        }
        return isCheck
      },
      // 发送手机验证码
      sendMobileCode () {
        let num = 60
        this.timer = setInterval(() => {
          num--
          this.mobileCodeMessage = num + '秒后重新获取'
          this.mobileCodeShow = false
          if (num === 0) {
            this.mobileCodeMessage = '获取验证码'
            this.mobileCodeShow = true
            clearInterval(this.timer)
          }
        }, 1000)
        let req = new URLSearchParams()
        req.append('mobile', this.registered.phone)
        mobileCode(req).then(res => {
          if (res.remain === -1) {
            this.showMobileCode = '次数没了，请半小时后试试'
          } else {
            this.showMobileCode = res.remain
          }
        })
      },
      // 进行注册
      regist () {
        let isCheck = this.check_isRegist()

        if (isCheck) {
          let req = new URLSearchParams()
          req.append('regName', this.registered.userName)
          req.append('pwd', this.registered.userPwd)
          req.append('pwdRepeat', this.registered.userPwd2)
          req.append('phone', this.registered.phone)
          req.append('mobileCode', this.registered.mobileCode)
          req.append('email', this.registered.mail)
          req.append('authCode', this.registered.authCode)
          req.append('uuid', this.my_uuid)
          register(req)
            .then(res => {
              if (res.status === 200) {
                this.$message.success('注册成功QAQ, 请登陆')
                setTimeout(() => {
                  // 清除注册信息
                  this.ruleForm.errMsg = ''
                  this.registered.errMsg = ''
                  this.registered.userName = ''
                  this.registered.userPwd = ''
                  this.registered.userPwd2 = ''
                  this.registered.phone = ''
                  this.registered.mobileCode = ''
                  this.registered.authCode = ''
                  this.registered.mail = ''
                  this.showMobileCode = ''
                  this.mobileCodeMessage = '获取验证码'
                  this.mobileCodeShow = true
                  this.auth_code_url = 'http://localhost:8104/verify/image?uid=' + this.my_uuid + '&amp;yys=' + new Date().getTime()
                  clearInterval(this.timer)
                  // 跳到登陆页面
                  this.loginPage = true
                }, 1000)
              } else {
                this.registered.errMsg = res.msg
              }
            })
            .catch(() => {
              this.registered.errMsg = '注册失败'
            })
        }
      }
    },
    mounted () {
      let _this = this
      this.$nextTick(() => {
        _this.login_addCart()
        // 获取
        uuid().then(res => {
          this.my_uuid = res
          this.auth_code_url = 'http://localhost:8104/verify/image?uid=' + this.my_uuid
        })
      })
    },
    components: {
      YFooter,
      YButton
    }
  }
</script>
<style lang="scss" type="text/scss" rel="stylesheet/scss" scoped>
  * {
    box-sizing: content-box;
  }

  .login {
    overflow-x: hidden;
    overflow-y: hidden;
    .input {
      height: 50px;
      display: flex;
      align-items: center;
      input {
        font-size: 16px;
        width: 100%;
        height: 100%;
        padding: 10px 15px;
        box-sizing: border-box;
        border: 1px solid #ccc;
        border-radius: 6px;
      }
    }
    .wrapper {
      background: url(/static/images/bg_9b9dcb65ff.png) repeat;
      background-size: 100px;
      min-height: 800px;
      min-width: 630px;
    }
  }

  .v2 .dialog {
    width: 450px;
    border: 1px solid #dadada;
    border-radius: 10px;
    top: 50%;
    left: 50%;
    margin-left: -225px;
    position: absolute;
    .title {
      background: linear-gradient(#fff, #f5f5f5);
      height: auto;
      overflow: visible;
      box-shadow: 0 1px 4px rgba(0, 0, 0, .08);
      position: relative;
      background-image: url(/static/images/main.png);
      background-size: 120px;
      background-position: top center;
      background-repeat: no-repeat;
      height: 92px;
      margin: 23px 0 50px;
      padding: 75px 0 0;
      box-shadow: none;
      h4 {
        padding: 0;
        text-align: center;
        color: #666;
        border-bottom: 1px solid #dcdcdc;
        -webkit-box-shadow: none;
        -moz-box-shadow: none;
        box-shadow: none;
        font-weight: 700;
        position: absolute;
        bottom: 0;
        width: 100%;
        text-align: center;
        margin: 0;
        padding: 0;
        border-bottom: 0;
        -webkit-box-shadow: none;
        -moz-box-shadow: none;
        box-shadow: none;
        line-height: 1em;
        height: auto;
        color: #333;
        font-weight: 400;
      }
    }
    .content {
      padding: 0 40px 22px;
      height: auto;
      .common-form {
        li {
          clear: both;
          margin-bottom: 15px;
          position: relative;
        }
      }
    }
  }

  .dialog-shadow, .v2 .bbs .dialog-shadow, .v2 .dialog-shadow {
    -webkit-box-shadow: 0 9px 30px -6px rgba(0, 0, 0, .2), 0 18px 20px -10px rgba(0, 0, 0, .04), 0 18px 20px -10px rgba(0, 0, 0, .04), 0 10px 20px -10px rgba(0, 0, 0, .04);
    -moz-box-shadow: 0 9px 30px -6px rgba(0, 0, 0, .2), 0 18px 20px -10px rgba(0, 0, 0, .04), 0 18px 20px -10px rgba(0, 0, 0, .04), 0 10px 20px -10px rgba(0, 0, 0, .04);
    box-shadow: 0 9px 30px -6px rgba(0, 0, 0, .2), 0 18px 20px -10px rgba(0, 0, 0, .04), 0 18px 20px -10px rgba(0, 0, 0, .04), 0 10px 20px -10px rgba(0, 0, 0, .04);
  }

  @media screen and (min-width: 737px), screen and (-webkit-max-device-pixel-ratio: 1.9) and (max-width: 736px) and (min-device-width: 737px) {
    .wrapper {
      background: url(/static/images/con-bg_04f25dbf8e.jpg) repeat-x;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
    }
    .dialog {
      background: url(/static/images/dialog-gray-bg.png) #fff bottom repeat-x;
      border-radius: 12px;
      display: none;
      margin: -163px 0 0 -218px;
      width: 436px;
      position: fixed;
      left: 50%;
      top: 50%;
    }
    .dialog .title h4 {
      border-bottom: #d1d1d1 solid 1px;
      box-shadow: 0 2px 6px #d1d1d1;
      color: #666;
      font-size: 20px;
      height: 61px;
      line-height: 61px;
      padding: 0 0 0 35px;
    }
    .common-form li {
      clear: both;
      margin-bottom: 15px;
      position: relative;
    }
  }

  .registered {
    h4 {
      padding: 0;
      text-align: center;
      color: #666;
      border-bottom: 1px solid #dcdcdc;
      -webkit-box-shadow: none;
      -moz-box-shadow: none;
      box-shadow: none;
      font-weight: 700;
      font-size: 20px;
      height: 60px;
      line-height: 60px;
    }
  }

  .orEmail {
    position: absolute;
    right: 0;
    bottom: -15px;
    font-size: 12px
  }

  .item-phone-wrap .orEmail a {
    color: #38f
  }

  .img-code {
    position: absolute;
    right: 3px;
    top: 3px;
    width: 110px;
    height: 44px;
    cursor: pointer
  }

</style>
