// single_buy.js
let app = getApp()
let date = new Date()

Page({

  data: {
    commodity_id: 0,
    coupon_id: 0,

    //时间选择期
    date: '日期',
    time: '时间',
    today_year: date.getFullYear(),
    real_date: null,
    buy: false,
    end_price: null,

    //下单操作
    order_id: null,

    //接口数据
    commodity: null,

  },

  onLoad(options) {
    const that = this
    const id = options.id
    wx.request({
      url: app.globalData.host_v1 + 'prepay/' + id,
      success: res => {
        if (200 == res.data.code) {
          that.setData({
            commodity: res.data.data,
            commodity_id: id
          })
        } else {
          wx.showModal({
            title: '提示',
            content: res.data.msg,
            showCancel: false,
            success: res => {
              if (res.confirm) {
                wx.navigateBack()
              }
            }
          })
        }
      }
    })
  },

  //获取优惠券
  getCoupon(e) {
    const that = this
    const index = e.detail.value
    const id = that.data.commodity.coupons[index].id
    const price = that.data.commodity.coupons[index].price
    let newPrice = that.data.commodity.price - price
    that.setData({
      end_price: newPrice >= 0 ? newPrice : 0,
      coupon_id: id
    })
  },

  //立即下单
  buyCommodity(e) {
    const that = this
    let timestamp = new Date().getTime()
    let product_id = e.currentTarget.dataset.id
    if (!app.globalData.userInfo) {
      app.goToTelInput()
    } else {
      wx.request({
        url: app.globalData.host + 'order/make',
        success: res => {
          if (200 == res.data.code) {
            let order_id = res.data.data
            that.setData({
              order_id: order_id
            })
            wx.request({
              url: app.globalData.host_v2 + 'order/pay',
              method: 'POST',
              data: {
                product_id: product_id,
                number: order_id,
                coupon: that.data.coupon_id,
                token: app.globalData.token,
              },
              success: res => {
                wx.requestPayment({
                  timeStamp: res.data.data.timeStamp,
                  nonceStr: res.data.data.nonceStr,
                  package: res.data.data.package,
                  signType: res.data.data.signType,
                  paySign: res.data.data.paySign,
                  success: rs => {
                    wx.showToast({
                      title: '下单成功',
                    })
                    if (that.data.commodity.type == 1) {
                      that.setData({
                        buy: true
                      })
                    }
                  }
                })
              }
            })
          } else {
            wx.showToast({
              title: '下单失败',
            })
          }
        }
      })
    }
  },


  //获取picker
  getDate(e) {
    let val = e.detail.value
    this.setData({
      date: val.replace(/\d{4}-/, ''),
      real_date: val
    })
  },
  getTime(e) {
    const that = this
    if (that.data.date == '日期') {
      wx.showModal({
        title: '提示',
        content: '请先选择预约日期',
        showCancel: false
      })
      return
    }
    let val = e.detail.value
    this.setData({
      time: val
    })
  },

  //预约
  getOrderTime() {
    const that = this
    let date = that.data.real_date
    let time = that.data.time
    if (!date || !time) {
      wx.showModal({
        title: '提示',
        content: '请输入预约时间',
        showCancel: false
      })
    } else {
      wx.request({
        url: app.globalData.host + 'schedule/add',
        header: app.globalData.header,
        method: 'POST',
        data: {
          number: that.data.order_id,
          time: that.data.real_date + ' ' + that.data.time
        },
        success: res => {
          if (200 == res.data.code) {
            wx.showModal({
              title: '提示',
              content: '预约成功！有其他问题可直接联系商家',
              showCancel: false
            })
            that.setData({
              buy: false
            })
          } else {
            wx.showToast({
              title: '预约失败',
            })
          }
        }
      })
    }
  },

  //取消预约
  cancelOrderTime() {
    this.setData({
      buy: false
    })
  },

})