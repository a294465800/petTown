// all_groups.js
const app = getApp()
//倒计时
let clock = new Array()
let clock_time = new Array()
let timer = {}

Page({

  data: {
    groups: null,
    group_imgs: [],
    limit: 3,
    group_id: 0,
    //倒计时
    left_time: [],
    flag_time: false,
    close: false,
    page: 1,

    //防止重复触发
    flag: false
  },

  onLoad(options) {
    const that = this
    let id = options.id

    //limit用于控制头像显示数量
    let limit = options.limit
    //拼团头像数量
    let arr2 = []
    arr2.length = 15
    wx.request({
      url: app.globalData.host + 'V1/product/group/' + id,
      header: app.globalData.header,
      success: res => {
        if (200 == res.data.code) {
          that.setData({
            group_imgs: arr2,
            limit: limit,
            group_id: id,
            flag_time: true
          })
          that.saveMyGroups([], res.data.data, 1)
          that.getIntervalTime()
        }
      }
    })
  },

  onHide() {
    clearInterval(timer['main'])
  },

  onShow() {
    const that = this
    if (that.data.flag_time) {
      that.resetTimeData()
    }
  },

  //压入时间
  getIntervalTime() {
    const that = this
    let length = that.data.groups.length
    clock = [], clock_time = []
    for (let i = 0; i < length; i++) {
      let current_time = that.data.groups[i].lave
      clock.push(that.formatTime(current_time))
      clock_time.push(current_time)
    }
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
              clock[index] = '已结束'
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

  //参团
  joinGroup(e) {
    const that = this
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/group_buy/group_buy?id=' + id,
    })
  },

  //我的拼团数据保存
  saveMyGroups(old, newRes, page) {
    const that = this
    that.setData({
      groups: [...old, ...newRes],
      page: page
    })
  },

  
  //触底刷新
  onReachBottom() {
    const that = this

    // 阻止重复触发
    if (that.data.flag) {
      return false
    }
    let close = that.data.close
    //主动关闭触底刷新
    if (close) {
      return false
    }
    wx.showLoading({
      title: '加载中',
    })
    let page = that.data.page + 1
    wx.request({
      url: app.globalData.host + 'V1/product/group/' + that.data.group_id + '?page=' + page,
      header: app.globalData.header,
      success: res => {
        if (200 == res.data.code) {
          let data = res.data.data
          const groups = that.data.groups
          wx.hideLoading()
          that.setData({
            flag: false
          })
          if (0 === data.length) {
            that.setData({
              close: true
            })
            return false
          }
          that.saveMyGroups(groups, data, page)
          that.getIntervalTime()
        }
      }
    })

    that.setData({
      flag: true
    })
    
    }

})