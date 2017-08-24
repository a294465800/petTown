// commodity_cards_use.js
let app = getApp()

Page({

  data: {

    card_id: 0,

    //接口数据
    card_info: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const that = this
    let id = options.id
    that.setData({
      card_id: id
    })
    wx.request({
      url: app.globalData.host_v2 + 'card/' + id,
      data: {
        token: app.globalData.token
      },
      success: res => {
        if (200 == res.data.code) {
          that.setData({
            card_info: res.data.data
          })
        } else {
          wx.showModal({
            title: '提示',
            content: '该次数卡不存在。',
            showCancel: false,
            success: res => {
              if (res.confirm) {
                wx.navigateBack({})
              }
            }
          })
        }
      }
    })
  },

  //消耗次数卡
  cardUse(e) {
    const that = this
    let id = e.currentTarget.dataset.id
    wx.showModal({
      title: '提示',
      content: '确认消耗一次该次数卡吗？',
      success: res => {
        if (res.confirm) {
          wx.request({
            url: app.globalData.host_v2 + 'card/use/' + id,
            data: {
              token: app.globalData.token
            },
            success: res => {
              if (200 == res.data.code) {
                let tmp = that.data.card_info.left - 1
                let date = new Date()
                that.setData({
                  'card_info.left': tmp
                })
                wx.showModal({
                  title: '提示',
                  content: '您已确认使用一次该次数卡，使用时间为：' + date.toLocaleString(),
                  showCancel: false,
                  success: res => {
                    if(res.confirm){
                      wx.navigateBack({})
                    }
                  }
                })
              } else {
                wx.showModal({
                  title: '提示',
                  content: res.data.msg,
                })
              }
            }
          })
        }
      }
    })
  }

})