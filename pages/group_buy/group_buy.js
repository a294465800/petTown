// group_buy.js
let app = getApp()
//倒计时
let clock, clock_time, timer = {}
Page({

  data: {
    id: 0,

    //倒计时
    left_time: null,
    flag_time: false,
    //接口数据
    commodity: null,

  },

  onLoad(options) {
    const that = this
    let id = options.id
    if (options.login) {
      app.getSetting()
    }
    wx.request({
      url: app.globalData.host + 'V1/group/' + id,
      header: app.globalData.header,
      success: res => {
        if (200 == res.data.code) {
          that.setData({
            commodity: res.data.data,
            id: id,
            flag_time: true
          })
          that.getIntervalTime()
        }else {
          wx.showModal({
            title: '提示',
            content: res.data.msg,
            showCancel: false,
            success: (res) => {
              if(res.confirm){
                wx.navigateBack()
              }
            }
          })
        }
      }
    })
  },

  onHide() {
    //清除计时器
    clearInterval(timer['main'])
  },

  onShow() {
    const that = this
    if (that.data.flag_time) {
      that.resetTimeData()
    }
  },

  onReachBottom() {
    return false
  },

  //压入时间
  getIntervalTime() {
    const that = this
    let current_time = that.data.commodity.lave
    clock = that.formatTime(current_time)
    clock_time = current_time
    that.setGroupInterval()
  },

  //格式化时间
  formatTime(time) {
    let h = parseInt(time / 3600)
    let m = parseInt((time - h * 3600) / 60)
    let s = (time - h * 3600) % 60
    if (h < 10) {
      h = "0" + h
    }
    if (m < 10) {
      m = "0" + m
    }
    if (s < 10) {
      s = "0" + s
    }
    return (h + ":" + m + ":" + s)
  },

  //设置倒计时
  setGroupInterval() {
    const that = this

    for (let i in timer) {
      clearInterval(timer[i])
    }

    //计算时间，保存到全局变量clock和clock_time中
    timer['count'] = setInterval(
      () => {
        if (0 >= clock_time) {
          clearInterval(timer['count'])
          clearInterval(timer['main'])
          wx.showModal({
            title: '提示',
            content: '该团已关闭',
            showCancel: false,
            success: res => {
              if (res.confirm) {
                let position = getCurrentPages()
                if (position.length > 1) {
                  wx.navigateBack()
                } else {
                  wx.switchTab({
                    url: '/pages/index/index'
                  })
                }
              }
            }
          })
        }
        clock = that.formatTime(clock_time--)
      }, 1000)
    that.resetTimeData()
  },

  //重设data计时器
  resetTimeData() {
    const that = this
    //每秒只重设一次data
    that.setData({
      left_time: clock
    })
    timer['main'] = setInterval(() => {
      that.setData({
        left_time: clock
      })
    }, 1000)
  },

  //立即下单
  buyCommodity(e) {
    const that = this
    let timestamp = new Date().getTime()
    let group_id = e.currentTarget.dataset.id
    let product_id = that.data.commodity.product_id
    if (!app.globalData.userInfo) {
      app.goToTelInput()
    } else {
      wx.showLoading({
        title: '支付中',
      })

      wx.request({
        url: app.globalData.host + 'order/make',
        header: app.globalData.header,
        success: res => {
          if (200 == res.data.code) {
            let order_id = res.data.data
            that.setData({
              order_id: order_id
            })
            wx.request({
              url: app.globalData.host + 'order/pay',
              header: app.globalData.header,
              method: 'POST',
              data: {
                product_id: product_id,
                group_id: group_id,
                type: 2,
                number: order_id
              },
              success: res => {
                wx.hideLoading()
                if (200 == res.data.code) {
                  wx.requestPayment({
                    timeStamp: res.data.data.timeStamp,
                    nonceStr: res.data.data.nonceStr,
                    package: res.data.data.package,
                    signType: res.data.data.signType,
                    paySign: res.data.data.paySign,
                    success: rs => {
                      wx.showToast({
                        title: '开团成功',
                        complete: () => {
                          wx.redirectTo({
                            url: '/pages/group_buy/group_buy?id=' + that.data.id,
                          })
                        }
                      })
                    },
                    fail: fail => {
                      wx.request({
                        url: app.globalData.host + 'V1/group/cancel/' + group_id,
                        header: app.globalData.header
                      })
                    }
                  })
                } else {
                  wx.showModal({
                    title: '提示',
                    content: res.data.msg,
                    showCancel: false
                  })
                }
              }
            })

          }
        }
      })
    }
  },

})