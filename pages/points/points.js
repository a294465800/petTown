// points.js
let app = getApp()
Page({

  data: {
    points: 0
  },

  onLoad(options) {
    const that = this
    wx.request({
      url: app.globalData.host_v2 + 'member/point',
      data: {
        token: app.globalData.token
      },
      success: res => {
        if (200 == res.data.code) {
          that.setData({
            points: res.data.data
          })
        }
      }
    })
  },

})