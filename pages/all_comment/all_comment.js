// all_comment.js
let app = getApp()
Page({

  data: {

    //星星图片
    star_count: [],
    star_img: {
      ok: '/images/order/star_f.png',
      no: '/images/order/star_n.png'
    },

    commodity: {},

    //加载提示
    tips_flag: false,
    tips_all: false,

    //关闭触底刷新
    close: false,

    //商品id
    product_id: 0,

    //评论页数
    page: 1,

    //接口数据
    comments: null
  },

  onLoad(options) {
    const that = this
    let arr = []
    //评论星数数量
    arr.length = 5
    that.setData({
      star_count: arr,
      product_id: options.id,
      'commodity.title': options.title
    })
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.host_v1 + 'product/comments',
      data: {
        page: 1,
        product_id: options.id
      },
      success: res => {
        wx.hideLoading()
        if (200 == res.data.code) {
          that.setData({
            comments: res.data.data
          })
        } else {
          wx.showToast({
            title: '加载失败',
          })
        }
      }
    })
  },
  onShow() {
    const that = this
    that.setData({
      page: 1,
      tips_flag: false,
      tips_all: false,
      close: false
    })
  },

  //触底刷新评论
  onReachBottom() {
    const that = this
    let page = that.data.page + 1
    if (that.data.close) {
      return false
    }
    that.setData({
      tips_flag: true
    })
    wx.request({
      url: app.globalData.host_v1 + 'product/comments',
      data: {
        page: page,
        product_id: that.data.product_id
      },
      success: res => {
        if (200 == res.data.code) {
          if (res.data.data.length < 1) {
            that.setData({
              close: true,
              tips_all: true,
              tips_flag: false
            })
            return false
          }
          let temp = [...that.data.comments, ...res.data.data]
          that.setData({
            comments: temp,
            page: page,
            tips_flag: false
          })
        }
      }
    })
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
        url: app.globalData.host_v2 + 'product/comment/like',
        method: 'POST',
        data: {
          comment_id: id,
          token: app.globalData.token,
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