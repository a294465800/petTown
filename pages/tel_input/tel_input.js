// tel_input.js
let app = getApp()
let timer

Page({

  data: {
    //控制验证码按钮
    captcha: true,

    captchaText: '获取验证码',

    //验证码
    captcha_input: 0,
    captcha_key: null,

    //手机号
    telNumber: 0,

    //提交按钮控制
    submit: true
  },

  onLoad(options) {

  },

  //手机验证
  checkTel(e) {
    const that = this
    let tel = e.detail.value
    if (tel.length != 11 || !(/^1[3|4|5|7|8][0-9]\d{8}$/.test(tel))) {
      that.setData({
        captcha: true
      })
    } else {
      that.setData({
        captcha: false,
        telNumber: tel
      })
    }
  },

  //获取验证码
  getCaptcha() {
    const that = this
    let i = 60

    that.setData({
      captcha: true,
    })
    wx.request({
      url: app.globalData.host + 'sms',
      // header: app.globalData.header,
      data: {
        number: that.data.telNumber
      },
      success: res => {
        if (200 != res.data.code) {
          wx.showModal({
            title: '提示',
            content: res.data.msg,
            showCancel: false,
            success: res => {
              if (res.confirm) {
                that.setData({
                  captcha: false
                })
              }
            }
          })
        } else {
          that.setData({
            captcha_key: res.data.data.key
          })
          timer = setInterval(() => {
            if (0 == i) {
              that.setData({
                captcha: false,
                captchaText: '获取验证码'
              })
              clearInterval(timer)
            } else {
              that.setData({
                captchaText: i + '秒'
              })
              i--
            }
          }, 1000)
        }
      }
    })
  },

  //验证码输入检测
  captchaInput(e) {
    const that = this
    let captcha = e.detail.value
    if (captcha > 99999) {
      that.setData({
        submit: false,
        captcha_input: captcha
      })
    } else {
      that.setData({
        captcha_input: captcha,
        submit: true
      })
    }
  },

  //表单提交
  register() {
    const that = this
    wx.showLoading({
      title: '注册中',
      mask: true
    })
    wx.login({
      withCredentials: true,
      success: rs => {
        wx.getUserInfo({
          success: res => {
            wx.request({
              url: app.globalData.host_v2 + 'register',
              header: app.globalData.header,
              method: 'POST',
              data: {
                captcha: that.data.captcha_input,
                captchaKey: that.data.captcha_key,
                code: rs.code,
                encryptedData: res.encryptedData,
                iv: res.iv
              },
              success: res => {
                if (200 == res.data.code) {
                  wx.hideLoading()
                  wx.showToast({
                    title: '注册成功',
                    complete: ok => {
                      app.globalData.host = res.data.data
                      wx.reLaunch({
                        url: '/pages/index/index',
                      })
                    }
                  })
                } else {
                  wx.hideLoading()
                  wx.showModal({
                    title: '提示',
                    content: res.data.msg || '注册失败',
                    showCancel: false
                  })
                }
              }
            })
          }
        })
      }
    })
  }
})