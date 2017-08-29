// mine.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const that = this
    that.setData({
      userInfo: app.globalData.userInfo
    })
  },
  onShow() {
    const that = this
    // if (!that.data.userInfo && app.globalData.userInfo) {
    //   that.setData({
    //     userInfo: app.globalData.userInfo
    //   })
    // }
    that.setData({
      userInfo: app.globalData.userInfo
    })
  },

  //登录
  Login() {
    const that = this

    app.getSetting((userInfo) => {
      that.setData({
        userInfo: userInfo
      })
    })
  },

  onReachBottom() {
    return false
  },


  //我的拼团跳转
  goToMygroup() {
    wx.navigateTo({
      url: '/pages/my_group/my_group',
    })
  },

  //商品次数
  goToCards() {
    wx.navigateTo({
      url: '/pages/commodity_cards/commodity_cards',
    })
  },

  //优惠券跳转
  goToCoupon() {
    wx.navigateTo({
      url: '/pages/coupon/coupon',
    })
  },

  //关于跳转
  goToMore() {
    wx.navigateTo({
      url: '/pages/more_info/more_info',
    })
  },

  //积分跳转
  goToPoints() {
    wx.navigateTo({
      url: '/pages/points/points',
    })
  },

  //反馈跳转
  goToComplaint() {
    wx.navigateTo({
      url: '/pages/complaint/complaint',
    })
  }
})