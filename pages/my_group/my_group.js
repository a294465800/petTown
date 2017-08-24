// my_group.js
let app = getApp()

//倒计时
let clock = new Array()
let clock_time = new Array()
let timer = {}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //拼团导航
    current: 0,
    group_nav: [
      {
        id: 0,
        name: '正在拼团'
      },
      {
        id: 1,
        name: '拼团成功'
      }
    ],

    //定时器
    left_time: [],
    time_flag: false,

    //开关
    close: {},
    page: {},
    flag: false,

    //接口数据
    groups: null,

  },

  onLoad(options) {
    const that = this
    that.firstRequest()
  },

  //封装初次请求
  firstRequest() {
    const that = this
    wx.request({
      url: app.globalData.host + 'V1/my/groups',
      header: app.globalData.header,
      success: res => {
        if (200 == res.data.code) {
          that.saveMyGroups([], res.data.data, 1, 1)
          that.getTime()

          //使onShow开始生效
          that.setData({
            time_flag: true
          })
        }
      }
    })
  },

  //我的拼团数据保存
  saveMyGroups(old, newRes, page, state) {
    const that = this
    let tmp = 'page.' + state
    let tmp2 = 'groups.' + state
    that.setData({
      [tmp2]: [...old, ...newRes],
      [tmp]: page
    })
  },

  //触底刷新
  toBottomGroup(e) {
    const that = this

    // 阻止重复触发
    if (that.data.flag) {
      return false
    }
    const state = e.currentTarget.dataset.state
    let close = that.data.close[state] || false
    //主动关闭触底刷新
    if (close) {
      return false
    }
    wx.showLoading({
      title: '加载中',
    })
    let page = that.data.page[state] + 1
    wx.request({
      url: app.globalData.host + 'V1/my/groups?state=' + state + '&page=' + page,
      header: app.globalData.header,
      success: res => {
        if (200 == res.data.code) {
          let data = res.data.data
          const groups = that.data.groups[state]
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
          that.saveMyGroups(groups, data, page, state)
          if (state == 1) {
            that.getTime()
          }
        }
      }
    })

    that.setData({
      flag: true
    })

  },

  onHide() {
    //清除计时器
    clearInterval(timer['main'])
  },

  onShow() {
    const that = this

    wx.request({
      url: app.globalData.host + 'V1/my/groups?state=2',
      header: app.globalData.header,
      success: res => {
        if (200 == res.data.code) {
          that.saveMyGroups([], res.data.data, 1, 2)
        }
      }
    })

    //每次显示定时器都先关闭上次定时器
    if (that.data.time_flag) {
      that.resetTimeData()
    }
  },

  //压入时间
  getTime() {
    const that = this
    clock = [], clock_time = []
    let length = that.data.groups[1].length
    for (let i = 0; i < length; i++) {
      let tmp = that.data.groups[1][i].lave
      if (0 >= tmp) {
        wx.redirectTo({
          url: '/pages/my_group/my_group',
        })
      }
      let current_time = tmp
      clock.push(that.formatTime(current_time))
      clock_time.push(current_time)
    }
    that.setGroupInterval()
  },

  //拼接时间格式
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
    let length = clock_time.length

    for (let i in timer) {
      clearInterval(timer[i])
    }
    for (let i = 0; i < length; i++) {
      //计算时间，保存到全局变量clock和clock_time中
      timer[i] = setInterval(
        () => {
          ((index) => {
            if (0 >= clock_time[index]) {
              wx.redirectTo({
                url: '/pages/my_group/my_group',
              })
            }
            clock[index] = that.formatTime(clock_time[index]--)
          })(i)
        }, 1000)
    }
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

  //分享
  onShareAppMessage(e) {
    let id = e.target.dataset.id
    return {
      title: '快来参加我的拼团啦~~',
      path: '/pages/group_buy/group_buy?id=' + id + '&login=1',
    }
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

  //查看拼团详情
  goToOrder(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/schedule/schedule?id=' + id,
    })
  },

  //查看当前团购
  goToCommodity(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/group_buy/group_buy?id=' + id,
    })
  }
})