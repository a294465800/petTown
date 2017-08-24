// coupon.js
let app = getApp()
Page({

  data: {

    //优惠券导航
    coupon_nav: [
      {
        id: 0,
        name: '可使用'
      },
      {
        id: 1,
        name: '已失效'
      }
    ],

    //刷新页数
    page: {},

    //关闭触底刷新
    close: {},

    //避免重复触发
    flag: false,

    current: 0,
    animationNav: {},

    //接口数据
    coupons_lost: null,
    coupons: null,
  },

  onLoad(options) {
    this.getCoupons()
  },

  onShow() {
  },

  //优惠券请求封装
  getCoupons() {
    const that = this
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.host_v2 + 'my/coupons?state=1',
      data: {
        token: app.globalData.token
      },
      success: res => {
        if (200 == res.data.code) {
          that.saveCoupons([], res.data.data, 1, 1)
          wx.hideLoading()
        }
      }
    })
    wx.request({
      url: app.globalData.host_v2 + 'my/coupons?state=2',
      data: {
        token: app.globalData.token
      },
      success: res => {
        if (200 == res.data.code) {
          that.saveCoupons([], res.data.data, 1, 2)
        }
      }
    })
  },

  //优惠券保存函数
  saveCoupons(old, newRes, page, state) {
    const that = this
    let tmp = 'page.' + state
    let tmp2 = 'coupons.' + state
    that.setData({
      [tmp2]: [...old, ...newRes],
      [tmp]: page
    })
  },

  //导航动画封装
  navAnimation(index) {
    let animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease'
    })
    let distance = index * 50 + '%'
    return animation.left(distance).step()
  },

  //导航切换
  shiftPage(e) {
    const that = this
    let index = e.currentTarget.dataset.index
    that.setData({
      animationNav: that.navAnimation(index).export(),
      current: index
    })
  },
  nextPage(e) {
    const that = this
    let current = e.detail.current
    if (that.data.current === e.detail.current) {
      return false
    }
    that.setData({
      animationNav: that.navAnimation(current).export(),
      current: current
    })
  },

  //优惠券的触底刷新
  toBottomUse(e) {
    const that = this
    if (that.data.flag) {
      return false
    }
    const state = e.currentTarget.dataset.state
    let close = that.data.close[state] || false
    if (!state || close) {
      return false
    }
    wx.showLoading({
      title: '加载中',
    })
    let page = that.data.page[state] + 1
    wx.request({
      url: app.globalData.host_v2 + 'my/coupons?state=' + state + '&page=' + page,
      data: {
        token: app.globalData.token
      },
      success: res => {
        if (200 == res.data.code) {
          let data = res.data.data
          const coupons = that.data.coupons[state]
          wx.hideLoading()
          that.setData({
            flag: false
          })
          if (0 === data.length) {
            let tmp = 'close.' + state
            that.setData({
              [tmp]: true
            })
            return false
          }
          that.saveCoupons(coupons, data, page, state)
        }
      }
    })

    that.setData({
      flag: true
    })
  },

  //下拉刷新
  onPullDownRefresh() {
    this.getCoupons()
    this.setData({
      close: {}
    })
    wx.stopPullDownRefresh()
  }

})