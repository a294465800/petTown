// commodity_cards.js
let app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //次数卡导航
    cards_nav: [{
      id: 0,
      name: '使用中'
    }, {
      id: 1,
      name: '已失效'
    }],

    //导航动画
    animationNav: {},
    current: 0,

    //请求控制
    page: {},
    close: {},
    //避免重复触发
    flag: false,

    //接口数据
    cards: null,
    cards_lost: null
  },

  onLoad(options) {
  },
  onShow() {
    this.firstRequest()
  },

  //初次请求封装
  firstRequest() {
    const that = this
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.host_v2 + 'my/cards?state=1',
      data: {
        token: app.globalData.token
      },
      success: res => {
        wx.hideLoading()
        if (200 == res.data.code) {
          that.saveCards([], res.data.data, 1, 1)
        }
      }
    })

    wx.request({
      url: app.globalData.host_v2 + 'my/cards?state=2',
      data: {
        token: app.globalData.token
      },
      success: res => {
        if (200 == res.data.code) {
          that.saveCards([], res.data.data, 1, 2)
        }
      }
    })
  },

  //数据保存函数
  saveCards(old, newRes, page, state) {
    const that = this
    let tmp = 'page.' + state
    let tmp2 = 'cards.' + state
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

  //次数卡跳转
  goToCard(e) {
    let id = e.currentTarget.dataset.id
    if (!app.globalData.userInfo) {
      app.goToTelInput()
    } else {
      wx.navigateTo({
        url: '/pages/commodity_cards_use/commodity_cards_use?id=' + id,
      })
    }
  },

  //次数卡的触底刷新
  toBottomCards(e) {
    const that = this
    if (that.data.flag) {
      return false
    }
    const state = e.currentTarget.dataset.state
    let close = that.data.close[state] || false

    if (close) {
      return false
    }
    let page = that.data.page[state]
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.host_v2 + 'my/cards?state=' + state + '&page=' + (page + 1),
      data: {
        token: app.globalData.token
      },
      success: res => {
        if (200 == res.data.code) {
          let data = res.data.data
          const cards = that.data.cards[state]
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
          that.saveCards(cards, data, page + 1, state)
        }else {
          wx.hideLoading()
          wx.showModal({
            title: '提示',
            content: res.data.msg,
            showCancel: false
          })
        }
      }
    })
    that.setData({
      flag: true
    })
  },

  //下拉刷新
  onPullDownRefresh() {
    this.firstRequest()
    this.setData({
      close: {}
    })
    wx.stopPullDownRefresh()
  }
})