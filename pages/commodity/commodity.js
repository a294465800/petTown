// commodity.js
let app = getApp()
//倒计时
let clock = new Array()
let clock_time = new Array()
let timer = {}

Page({

  data: {
    //商品
    commodity_id: 0,
    imgUrls: [],
    interval: 4000,
    duration: 500,
    indicator_color: '#666',
    indicator_active_color: '#ff963d',

    //拼团头像设置
    group_imgs: [],

    //下单操作
    group_id: null,
    order_id: null,

    //星星图片
    star_count: [],
    star_img: {
      ok: '/images/order/star_f.png',
      no: '/images/order/star_n.png'
    },

    //倒计时
    left_time: [],
    flag_time: false,

    //接口数据
    comments: null,
    commodity: null,
  },

  onLoad(options) {
    const that = this
    let arr = [], arr2 = []
    //评论星数数量
    arr.length = 5
    arr2.length = 15
    //拼团头像数量
    that.setData({
      commodity_id: options.commodity_id,
      star_count: arr,
      group_imgs: arr2,
      flag_time: true
    })
    that.firstRequest()
  },

  //封装初次请求
  firstRequest() {
    const that = this
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.host + 'product/' + that.data.commodity_id,
      success: res => {
        wx.hideLoading()
        that.setData({
          commodity: res.data.data,
          imgUrls: res.data.data.img,
          comments: res.data.data.comments
        })
        if (res.data.data.groupList) {
          that.getIntervalTime()
        }
      }
    })
  },

  onHide() {
    //清除计时器
    clearInterval(timer['main'])
  },

  onShow() {
    const that = this
    if (that.data.flag_time) {
      that.resetTimeData()
    }
  },

  onReachBottom() {
    return false
  },

  //压入时间
  getIntervalTime() {
    const that = this
    let length = that.data.commodity.groupList.length
    clock = [], clock_time = []
    for (let i = 0; i < length; i++) {
      let tmp = that.data.commodity.groupList[i].lave
      if (0 >= tmp) {
        wx.redirectTo({
          url: '/pages/all_groups/all_groups?commodity_id=' + that.data.commodity_id,
        })
      }
      let current_time = tmp
      clock.push(that.formatTime(current_time))
      clock_time.push(current_time)
      that.setGroupInterval()
    }
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
              for (let i in timer) {
                clearInterval(timer[i])
              }
              wx.redirectTo({
                url: '/pages/all_groups/all_groups?commodity_id=' + that.data.commodity_id,
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
      wx.showLoading({
        title: '支付中',
      })
      wx.request({
        url: app.globalData.host + 'order/make',
        success: res => {
          if (200 == res.data.code) {
            let order_id = res.data.data
            that.setData({
              order_id: order_id,
              token: app.globalData.token
            })
            wx.request({
              url: app.globalData.host_v2 + 'make/group',
              data: {
                product_id: product_id,
                token: app.globalData.token,
              },
              success: res => {
                if (200 == res.data.code) {
                  let group_id = res.data.data
                  that.setData({
                    group_id: group_id
                  })
                  wx.request({
                    url: app.globalData.host_v2 + 'order/pay',
                    method: 'POST',
                    data: {
                      product_id: product_id,
                      group_id: group_id,
                      type: 2,
                      number: order_id,
                      token: app.globalData.token,
                    },
                    success: res => {
                      wx.hideLoading()
                      if (200 == res.data.code) {
                        wx.requestPayment({
                          timeStamp: res.data.data.timeStamp,
                          nonceStr: res.data.data.nonceStr,
                          package: res.data.data.package,
                          signType: res.data.data.signType,
                          paySign: res.data.data.paySign,
                          success: rs => {
                            wx.showToast({
                              title: '开团成功',
                              complete: () => {
                                wx.redirectTo({
                                  url: '/pages/commodity/commodity?commodity_id=' + that.data.commodity_id,
                                })
                              }
                            })
                          },
                          fail: fail => {
                            wx.request({
                              url: app.globalData.host_v2 + 'group/delete/' + group_id,
                              data: {
                                token: app.globalData.token
                              },
                              success: res => {
                                wx.showToast({
                                  title: '已取消',
                                })
                              }
                            })
                          }
                        })
                      } else {
                        wx.showModal({
                          title: '提示',
                          content: res.data.msg,
                          showCancel: false
                        })
                      }
                    }
                  })
                } else {
                  wx.showToast({
                    title: '开团失败',
                  })
                }
              }
            })
          }
        }
      })
    }
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
        url: app.globalData.host_v2 + 'product/comment/like',
        method: 'POST',
        data: {
          comment_id: id,
          token: app.globalData.token
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
  },

  //单独购买
  goToBuySingle(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/single_buy/single_buy?id=' + id,
    })
  },

  //参团
  joinGroup(e) {
    const that = this
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/group_buy/group_buy?id=' + id,
    })
  },

  //查看所有拼团
  goToAllGroups(e) {
    const that = this
    let id = e.currentTarget.dataset.id
    let limit = e.currentTarget.dataset.limit
    wx.navigateTo({
      url: '/pages/all_groups/all_groups?id=' + id + '&limit=' + limit,
    })
  }
})