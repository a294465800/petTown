// schedule.js
let app = getApp()
let date = new Date()
Page({

  data: {
    //时间选择期
    date: '请选择日期',
    time: '请选择时间',
    today_year: date.getFullYear(),
    order_id: 0,
    // order_info: null

    //模拟数据
    order_info: {
      product_name: '狗狗洗澡',
      store_name: '宠物之家',
      price: '35',
      time: '2017-06-20 12:30',
      number: '21215415421545215'
    }
  },

  onLoad(options) {
    const that = this
    let order_id = options.id
    that.setData({
      order_id: order_id
    })
    wx.request({
      url: app.globalData.host + 'order',
      data: {
        number: order_id,
        token: app.globalData.token,
      },
      success: res => {
        if (200 == res.data.code) {
          that.setData({
            order_info: res.data.data
          })
        }else {
          wx.showModal({
            title: '提示',
            content: '没有该订单',
            showCancel: false,
            success: res => {
              wx.navigateBack({})
            }
          })
        }
      }
    })
  },

  //获取picker
  getDate(e) {
    let val = e.detail.value
    this.setData({
      date: val
    })
  },
  getTime(e) {
    const that = this
    if (that.data.date == '请选择日期') {
      wx.showModal({
        title: '提示',
        content: '请先选择预约日期',
        showCancel: false
      })
      return
    }
    let val = e.detail.value
    this.setData({
      time: val
    })
  },

  //核销
  closeOrder() {
    const that = this
    wx.showModal({
      title: '提示',
      content: '请确定该订单已经消费。',
      success: res => {
        if (res.confirm) {
          wx.request({
            url: app.globalData.host_v2 + 'order/finish',
            method: 'POST',
            data: {
              number: that.data.order_id,
              token: app.globalData.token,
            },
            success: res => {
              if (200 == res.data.code) {
                wx.showToast({
                  title: '消费成功',
                  complete: () => {
                    wx.navigateBack({})
                  }
                })
              }else {
                wx.showToast({
                  title: '确认失败',
                })
              }
            }
          })
        }
      }
    })
  },

  //预约
  orderSchedule() {
    const that = this
    let date = that.data.date
    let time = that.data.time
    if (date == '请选择日期' || time == '请选择时间') {
      wx.showModal({
        title: '提示',
        content: '请先选择预约时间',
        showCancel: false
      })
      return false
    }

    wx.request({
      url: app.globalData.host_v2 + 'schedule/add',
      method: 'POST',
      data: {
        number: that.data.order_id,
        time: that.data.date + ' ' + that.data.time + ':00',
          token: app.globalData.token,
      },
      success: res => {
        if (200 == res.data.code) {
          wx.showModal({
            title: '提示',
            content: '预约成功！有其他问题可直接联系商家',
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
  }

})