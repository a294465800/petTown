// coupon.js
const app = getApp()
Page({

  data: {
    BottomSwitch: false,
    page: 1,
    flag: false,
    coupon: [
      {
        id: 0,
        name: '宠物洗澡通用券',
        tip: '在线支付专享',
        price: 10,
        time: '2017.06.24-2017.07.15'
      },
    ]
  },

  onLoad(options) {
    this.getCouponsAPI(1)
  },

  //获取优惠券
  getCouponsAPI(page, cb) {
    wx.showLoading({
      title: '加载中',
    })
    const that = this
    wx.request({
      url: app.globalData.host_v2 + 'my/coupons',
      data: {
        page
      },
      success: res => {
        wx.hideLoading()
        typeof cb === 'function' && cb()
        if (200 == res.data.code) {
          const data = res.data.data
          that.setData({
            page: page + 1
          })
          if (data.length) {
            if (that.data.coupons) {
              that.setData({
                coupons: [...that.data.coupons, ...data]
              })
            } else {
              that.setData({
                coupons: data
              })
            }
          } else {
            that.setData({
              BottomSwitch: true
            })
          }
        } else {
          wx.showModal({
            title: '提示',
            content: res.data.msg,
          })
        }
      }
    })
  },

  onReachBottom() {
    const that = this

    //防止重复触发和主动关闭
    if (that.data.flag || that.data.bottomSwitch) {
      return false
    }

    that.getCouponsAPI(that.data.page)
  },

  onPullDownRefresh() {
    this.getCouponsAPI(1, () => {
      this.setData({
        bottomSwitch: false,
        flag: false
      })
      wx.stopPullDownRefresh()
    })
  }
})