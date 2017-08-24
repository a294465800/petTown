// shop.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shop_id: 0,
    shop_nav: [
      {
        id: 0,
        name: '商品'
      },
      {
        id: 1,
        name: '评价'
      },
      {
        id: 2,
        name: '商家'
      }
    ],

    //导航动画
    animationNav: {},

    //当前页
    current: 0,

    //商品目录
    category_id: 0,
    category_index: 0,

    //评论页面开关
    tips_flag_c: false,
    tips_all_c: false,
    //星星
    star_count: [],
    star_img: {
      ok: '/images/order/star_f.png',
      no: '/images/order/star_n.png'
    },

    //触底刷新开关
    bottomSwitch: {},

    //接口数据
    categories: null,

    shopItem: {},

    comments: null,

    store: null,
  },

  onLoad(options) {
    const that = this
    let id = options.id
    let arr = []
    //评论星数数量
    arr.length = 5
    that.setData({
      shop_id: id,
      star_count: arr
    })
    wx.showNavigationBarLoading()
    that.firstRequest(id, store => {
      wx.hideNavigationBarLoading()
      wx.setNavigationBarTitle({
        title: store.name,
      })
    })

  },

  //初次请求封装
  firstRequest(id, cb) {
    const that = this
    wx.request({
      url: app.globalData.host_v2 + 'categories/' + id,
      success: res => {
        if (200 == res.data.code) {
          const tmp_id = res.data.data[0].id
          that.setData({
            categories: res.data.data,
            category_id: tmp_id
          })

          wx.request({
            url: app.globalData.host_v2 + 'products/' + tmp_id,
            success: res => {
              if (200 == res.data.code) {
                let temp = 'shopItem[' + 0 + ']'
                that.setData({
                  [temp]: res.data.data
                })
              } else {
                wx.showModal({
                  title: '提示',
                  content: res.data.msg,
                })
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

    wx.request({
      url: app.globalData.host_v2 + 'store/info/' + id,
      success: res => {
        if (200 == res.data.code) {
          that.setData({
            store: res.data.data
          })
          typeof cb === 'function' && cb(res.data.data)
        } else {
          wx.showModal({
            title: '提示',
            content: res.data.msg,
          })
        }
      }
    })

    wx.request({
      url: app.globalData.host_v2 + 'store/comments/' + id,
      success: res => {
        if (200 == res.data.code) {
          that.setData({
            comments: res.data.data
          })
        } else {
          wx.showModal({
            title: '提示',
            content: res.data.msg,
          })
        }
      }
    })
  },

  //分享
  onShareAppMessage() {
    let id = this.data.shop_id
    return {
      title: '快来君悦宠物店线上商店啦~',
      path: '/pages/shop/shop?id=' + id,
    }
  },

  //导航动画封装
  navAnimation(index) {
    let animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease'
    })
    let distance = index * 33.3 + '%'
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

  //商品请求
  getCommodityAPI(id, page, index) {
    wx.showLoading({
      title: '加载中',
    })
    const that = this
    wx.request({
      url: app.globalData.host_v2 + 'products/' + id,
      data: {
        page: page
      },
      success: res => {
        wx.hideLoading()
        if (200 == res.data.code) {
          if (res.data.data.length) {
            const temp = 'shopItem[' + index + ']'
            if (1 === page) {
              that.setData({
                [temp]: res.data.data
              })
            } else {
              that.setData({
                [temp]: [...that.data.shopItem[index], ...res.data.data]
              })
            }
          } else {
            const tmp = 'bottomSwitch[' + index + '].bottom'
            that.setData({
              tmp: true
            })
          }
        } else {
          wx.showModal({
            title: '提示',
            content: res.data.msg,
          })
        }
      }
    })
  },

  //商品目录切换
  shiftCategory(e) {
    const that = this
    const id = e.currentTarget.dataset.id
    const index = e.currentTarget.dataset.index
    that.setData({
      category_id: id,
      category_index: index
    })
    if (!that.data.shopItem[index]) {
      that.getCommodityAPI(id, 1, index)
    }
  },

  //具体商品跳转
  goToCommodity(e) {
    const that = this
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/commodity/commodity?commodity_id=' + id,
    })
  },

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

  //评论图片预览
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

  //打开商家地图
  openLocation() {
    wx.showLoading({
      title: '地图加载中',
    })
    let latitude = 23.138595
    let longitude = 113.328032
    wx.openLocation({
      latitude: latitude,
      longitude: longitude,
      scale: 28,
      name: '森乾科技',
      address: '广东省广州市番禺区永恒大街6号花城创意园2号楼122',
      success: res => {
        wx.hideLoading()
      }
    })
  },

  //电话商家
  callStore(e) {
    const that = this
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.tel,
    })
  },

  //商家图片预览
  preStoreImg(e) {
    const that = this
    wx.previewImage({
      current: e.currentTarget.dataset.url,
      urls: that.data.store.images,
    })
  },

})