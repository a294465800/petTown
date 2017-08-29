// complaint.js
const app = getApp()
Page({

  data: {
    left: 200,
    complait_content: '',
    number: ''
  },

  onLoad(options) {

  },

  //获取反馈内容
  getComplaint(e) {
    const content = e.detail.value
    this.setData({
      complaint_content: content,
      left: 200 - content.length
    })
  },

  //电话号码
  numberInput(e) {
    this.setData({
      number: e.detail.value
    })
  },

  //手机验证
  checkTel() {
    const that = this
    let tel = this.data.number
    return tel.length === 11 || (/^1[3|4|5|7|8][0-9]\d{8}$/.test(tel))
  },

  //提交
  complaintPost() {
    const that = this
    if (!that.data.complaint_content || !that.data.number) {
      wx.showModal({
        title: '提示',
        content: '不要留空哦~',
        showCancel: false,
      })
      return false
    }

    if (that.checkTel()) {
      wx.request({
        url: app.globalData.host_v2 + 'feedback/add',
        method: 'POST',
        data: {
          phone: that.data.number,
          content: that.data.complaint_content
        },
        success: res => {
          if (200 == res.data.code) {
            wx.showToast({
              title: '反馈成功',
              complete: () => {
                wx.navigateBack()
              }
            })
          } else {
            wx.showModal({
              title: '提示',
              content: res.data.msg,
              showCancel: false,
              success: rs => {
                if (rs.confirm) {
                  wx.navigateBack()
                }
              }
            })
          }
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '起码输个像样的手机号码嘛~',
        showCancel: false
      })
    }
  }
})