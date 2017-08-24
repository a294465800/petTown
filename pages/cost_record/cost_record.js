// cost_record.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

    userInfo: null,

    //导航动画
    animationNav: {},

    //当前页
    current: 0,
    state: 1,

    //星星
    star_count: [],
    star_img: {
      ok: '/images/order/star_f.png',
      no: '/images/order/star_n.png'
    },

    //消费记录导航
    cost_records: [
      {
        id: 1,
        name: '未使用'
      },
      {
        id: 2,
        name: '未评价'
      },
      {
        id: 3,
        name: '已评价'
      },
    ],

    //控制触底刷新
    orderSwitch: {},
    flag: false,
    pages: {},

    //接口数据
    orders: {},
  },

  onLoad(options) {
    let that = this

    let arr = []
    //评论星数数量
    arr.length = 5
    that.setData({
      star_count: arr
    })
  },

  onShow() {
    const that = this
    that.setData({
      userInfo: app.globalData.userInfo
    })
    that.orderRequestAPI(1, that.data.state)
  },

  //订单请求
  orderRequestAPI(page, state) {
    wx.showLoading({
      title: '加载中',
    })
    const that = this
    wx.request({
      url: app.globalData.host_v2 + 'my/orders',
      data: {
        page,
        state,
        token: app.globalData.token
      },
      success: res => {
        wx.hideLoading()
        if (200 == res.data.code) {
          const pages = 'pages[' + state + ']'
          that.setData({
            [pages]: page + 1,
            flag: false
          })
          if (res.data.data.length) {
            const tmp = 'orders[' + state + ']'
            if (1 === page) {
              that.setData({
                [tmp]: res.data.data
              })
            } else {
              that.setData({
                [tmp]: [...that.data.orders[state], res.data.data]
              })
            }
          } else {
            const tmp = 'orderSwitch[' + state + ']'
            that.setData({
              [tmp]: true
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

  //触底加载订单请求
  toMoreOrders() {
    const that = this
    const state = that.data.state

    //防止重复触发和主动关闭
    if (that.data.flag || that.data.orderSwitch[state]) {
      return false
    }
    that.setData({
      flag: true
    })
    that.orderRequestAPI(that.data.pages[state], state)
  },

  //动画封装
  animationNav(id) {
    let left = (id * 33.3) + '%'
    let animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease'
    })
    return animation.left(left).step()
  },

  //点击切换函数
  shiftPage(e) {
    const that = this
    const index = e.currentTarget.dataset.index
    const id = e.currentTarget.dataset.id
    that.setData({
      current: index,
      state: id,
      animationNav: that.animationNav(index).export()
    })
    if (!that.data.orders[id] && !that.data.orderSwitch[id]) {
      that.orderRequestAPI(1, id)
    }
  },

  //swiper变动切换函数
  nextPage(e) {
    const that = this
    const index = e.detail.current
    const id = index + 1
    that.setData({
      current: index,
      state: id,
      animationNav: that.animationNav(index).export()
    })
    if (!that.data.orders[id] && !that.data.orderSwitch[id]) {
      that.orderRequestAPI(1, id)
    }
  },

  //评论跳转
  goToComment(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/cost_comment/cost_comment?id=' + id,
    })
  },

  //查看订单
  goToOrder(e) {
    let id = e.currentTarget.dataset.order_id
    wx.navigateTo({
      url: '/pages/schedule/schedule?id=' + id,
    })
  }
})