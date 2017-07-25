// commodity.js
let date = new Date()
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //商品
    commodity_id: 0,
    commodity: {},
    imgUrls: [],
    interval: 4000,
    duration: 500,
    indicator_color: '#666',
    indicator_active_color: '#ff963d',

    //时间选择期
    date: '日期',
    time: '时间',
    today_year: date.getFullYear(),
    real_date: null,

    //下单操作
    buy: false,
    order_id: null,

    //星星图片
    star_count: [],
    star_img: {
      ok: '/images/shop/star_f.png',
      no: '/images/shop/star_n.png'
    },

    //接口数据
    comments: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const that = this
    let arr = []
    //评论星数数量
    arr.length = 5
    that.setData({
      commodity_id: options.commodity_id,
      star_count: arr
    })
    wx.request({
      url: app.globalData.host + 'product/' + options.commodity_id,
      header: app.globalData.header,
      success: res => {
        that.setData({
          commodity: res.data.data,
          imgUrls: res.data.data.img,
          comments: res.data.data.comments
        })
      }
    })
  },
  onShow() {
  },

  onReachBottom() {
    return false
  },

  //商品图片预览
  preImg(e) {
    wx.previewImage({
      current: e.currentTarget.dataset.url,
      urls: e.currentTarget.dataset.imggup,
    })
  },

  //立即下单
  buyCommodity(e) {
    const that = this
    let timestamp = new Date().getTime()
    let product_id = e.currentTarget.dataset.id
    if (!app.globalData.userInfo) {
      app.goToTelInput()
    } else {
      wx.request({
        url: app.globalData.host + 'order/make',
        header: app.globalData.header,
        success: res => {
          if (200 == res.data.code) {
            let order_id = res.data.data
            that.setData({
              order_id: order_id
            })
            wx.request({
              url: app.globalData.host + 'order/pay',
              header: app.globalData.header,
              method: 'POST',
              data: {
                product_id: product_id,
                number: order_id
              },
              success: res => {
                wx.requestPayment({
                  timeStamp: res.data.data.timeStamp,
                  nonceStr: res.data.data.nonceStr,
                  package: res.data.data.package,
                  signType: res.data.data.signType,
                  paySign: res.data.data.paySign,
                  success: rs => {
                    wx.showToast({
                      title: '下单成功',
                    })
                    that.setData({
                      buy: true
                    })
                  }
                })
              }
            })
          } else {
            wx.showToast({
              title: '下单失败',
            })
          }
        }
      })
    }
  },

  //获取picker
  getDate(e) {
    let val = e.detail.value
    this.setData({
      date: val.replace(/\d{4}-/, ''),
      real_date: val
    })
  },
  getTime(e) {
    const that = this
    if (that.data.date == '日期') {
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

  //预约
  getOrderTime() {
    const that = this
    let date = that.data.real_date
    let time = that.data.time
    if (!date || !time) {
      wx.showModal({
        title: '提示',
        content: '请输入预约时间',
        showCancel: false
      })
    } else {
      wx.request({
        url: app.globalData.host + 'schedule/add',
        header: app.globalData.header,
        method: 'POST',
        data: {
          number: that.data.order_id,
          time: that.data.real_date + ' ' + that.data.time
        },
        success: res => {
          if (200 == res.data.code) {
            wx.showModal({
              title: '提示',
              content: '预约成功！有其他问题可直接联系商家',
              showCancel: false
            })
            that.setData({
              buy: false
            })
          } else {
            wx.showToast({
              title: '预约失败',
            })
          }
        }
      })
    }
  },

  //取消预约
  cancelOrderTime() {
    this.setData({
      buy: false
    })
  },

  //查看所有评论
  goToAllComments(e) {
    const that = this
    if (that.data.comments.length < 1) {
      wx.showToast({
        title: '没有评论',
      })
    } else {
      let id = e.currentTarget.dataset.id
      let title = that.data.commodity.title
      wx.navigateTo({
        url: '/pages/all_comment/all_comment?id=' + id + '&title=' + title,
      })
    }
  },

  //具体评论点赞
  commentGood(e) {
    if (!app.globalData.userInfo) {
      app.goToTelInput()
    } else {
      const that = this
      let id = e.currentTarget.dataset.id
      let index = e.currentTarget.dataset.index
      let temp = "comments[" + index + '].likes'
      wx.request({
        url: app.globalData.host + 'product/comment/like',
        method: 'POST',
        header: app.globalData.header,
        data: {
          comment_id: id
        },
        success: res => {
          if (200 == res.data.code) {
            that.setData({
              [temp]: (Number(that.data.comments[index].likes) + Number(res.data.data))
            })
          } else {
            wx.showToast({
              title: '点赞失败',
            })
          }
        }
      })
    }

  },

  //具体评论图片预览
  commentPreImg(e) {
    const that = this
    let img = e.currentTarget.dataset.img
    let index = e.currentTarget.dataset.index
    let imgs = that.data.comments[index].img
    wx.previewImage({
      urls: imgs,
      current: img
    })
  }
})