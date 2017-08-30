// search_input.js
const app = getApp()
let timer = null
Page({
  data: {
    shops: [],
    location: '',
    search_input: '',
    flag: false,
    page: 1,
  },

  onLoad(options) {
    this.setData({
      location: options.location
    })
  },

  //拼接数据
  setShops(data, page) {
    const that = this
    if (data.length) {
      if (that.data.shops.length) {
        that.setData({
          shops: [...that.data.shops, ...data],
          flag: false,
          page: page,
        })
      } else {
        that.setData({
          shops: data,
          flag: false,
          page: page,
        })
      }
    } else {
      that.setData({
        close: true,
        flag: false,
        page: page,
      })
    }
  },

  //搜索API
  searchAPI(value, page) {
    const that = this
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.host_v2 + 'stores',
      data: {
        keyword: value,
        location: that.data.location,
        page: page,
      },
      success: res => {
        wx.hideLoading()
        if (200 == res.data.code) {
          that.setShops(res.data.data, page)
        } else {
          wx.showModal({
            title: '提示',
            content: res.data.msg,
          })
        }
      }
    })
  },

  //自动搜索，延迟2s
  searchAuto(e) {
    const that = this
    clearTimeout(timer)
    timer = setTimeout(() => {
      const input = e.detail.value
      that.setData({
        search_input: input,
        close: false,
      })
      that.searchAPI(input, 1)
    }, 2000)
  },

  //手动搜索
  search(e) {
    const input = e.detail.value
    this.searchAPI(input, 1)
    this.setData({
      search_input: input,
      close: false,
    })
  },

  //触底刷新
  onReachBottom() {
    const that = this
    const flag = that.data.flag
    //主动关闭 || 防止重复触发
    if (flag || that.data.close) {
      return false
    }
    that.setData({
      flag: true
    })
    that.searchAPI(that.data.search_input, that.data.page + 1)
  }
})