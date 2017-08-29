//index.js
//获取应用实例
const app = getApp()

//记录触摸位置
let startY, startX
let endY, endX

Page({
  data: {
    imgUrls: [
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],
    autoplay: false,
    interval: 5000,
    duration: 1000,
    userInfo: {},

    //搜索条位置控制
    animationSearch: {},

    //星星
    star_count: [],
    star_img: {
      ok: '/images/order/star_f.png',
      no: '/images/order/star_n.png'
    },

    //加载提示控制
    close: false,
    flag: false,

    //接口数据
    shops: null,
    page: 1,
    location_flag: false,
    type_id: '',
    location: null,
    store_types: [],
    current_type: null,

    //模拟数据

    new_shops: [
      {
        id: 7,
        name: '啦啦啦啦啦啦啦啦啦啦啦啦啦',
        score: 2,
        type: ['医疗', '美容', '活体'],
        distance: '0.5km',
      },
      {
        id: 8,
        name: '新家宠物店',
        score: 2,
        type: ['医疗', '美容'],
        distance: '5.5km',
      },
      {
        id: 9,
        name: '来个狗',
        score: 2,
        type: ['医疗', '美容', '活体'],
        distance: '3.5km',
      },
    ]
  },
  onLoad() {
    const that = this

    let arr = []
    //评论星数数量
    arr.length = 5
    app.nowLogin()
    that.judgeLocationAPI(res => {
      that.setData({
        star_count: arr,
        shops: res
      })
    })
  },

  //获取定位
  getLocation(cb) {
    const that = this
    wx.getLocation({
      success: res => {
        console.log('success')
        const tmp = res.latitude + ',' + res.longitude
        if (typeof cb === 'function') {
          cb(tmp)
        } else {
          console.log('cb')
          that.firstRequest(tmp, data => {
            that.setData({
              shops: [...data, ...that.data.new_shops],
              close: false,
              location_flag: true,
            })
          })
        }
      },
      fail: error => {
        console.log('error')
        wx.openSetting({
          success: rs => {
            if (rs.authSetting['scope.userLocation']) {
              that.getLocation(cb)
            }
          }
        })
      }
    })
  },

  //判定定位权限
  judgeLocationAPI(cb) {
    const that = this
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userLocation'] === true) {
          that.getLocation(location => {
            that.setData({
              location: location,
              location_flag: true,
            })
            that.firstRequest(location, cb)
          })
        } else {
          that.setData({
            location_flag: false
          })
          that.firstRequest('', cb)
        }
      }
    })
  },

  //初次请求封装
  firstRequest(location, cb) {
    const that = this
    wx.request({
      url: app.globalData.host_v2 + 'stores',
      data: {
        location: location
      },
      success: res => {
        if (200 == res.data.code) {
          typeof cb == "function" && cb(res.data.data)
        } else {
          wx.showModal({
            title: '提示',
            content: res.data.msg,
          })
        }
      }
    })

    wx.request({
      url: app.globalData.host + 'adverts',
      success: res => {
        if (200 == res.data.code) {
          that.setData({
            imgUrls: res.data.data
          })
        }
      }
    })

    //请求分类
    wx.request({
      url: app.globalData.host_v2 + 'store/types',
      success: res => {
        if (200 == res.data.code) {
          that.setData({
            store_types: res.data.data
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

  //请求商店
  getStore(id, page, cb) {
    const that = this
    wx.request({
      url: app.globalData.host_v2 + 'stores',
      data: {
        location: that.data.location || '',
        page: page,
        type: id || ''
      },
      success: res => {
        if (200 == res.data.code) {
          typeof cb == "function" && cb(res.data.data)
        } else {
          wx.showModal({
            title: '提示',
            content: res.data.msg,
          })
        }
      }
    })
  },

  //监听触摸开始位置
  touchStart(e) {
    startY = e.changedTouches[0].clientY
    startX = e.changedTouches[0].clientX
  },

  //监听触摸结束
  touchEnd(e) {
    const that = this
    let animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease'
    })
    endY = e.changedTouches[0].clientY
    endX = e.changedTouches[0].clientX
    let temp = endX - startX
    if (temp > 30 || temp < -30) {
      return false
    }
    if (endY < startY && (temp < 30 || temp > -30)) {
      animation.top("-150rpx").step()
      that.setData({
        animationSearch: animation.export()
      })
    } else {
      animation.top(0).step()
      that.setData({
        animationSearch: animation.export()
      })
    }
  },

  //搜索
  searchInput() {
    wx.navigateTo({
      url: '/pages/search_input/search_input',
    })
  },

  //右上角分享
  onShareAppMessage() {
    return {
      title: '小主帮',
      path: '/pages/index/index',
    }
  },

  //触底刷新
  onReachBottom() {
    const that = this
    //主动关闭触底或者防止二次触发
    if (that.data.close || that.data.flag) {
      return false
    }
    wx.showLoading({
      title: '加载中',
    })
    that.setData({
      flag: true
    })
    that.getStore(that.data.type_id, that.data.page + 1, (data) => {
      if (data.length) {
        that.setData({
          shops: [...that.data.shops, ...data],
          page: that.data.page + 1,
          flag: false
        })
      } else {
        that.setData({
          close: true,
          page: that.data.page + 1,
          flag: false
        })
      }
      wx.hideLoading()
    })
  },

  //下拉刷新
  onPullDownRefresh() {
    const that = this
    that.judgeLocationAPI(res => {
      that.setData({
        close: false,
        shops: res
      })
      wx.stopPullDownRefresh()
    })
  },

  //店铺分类搜索
  storeType(e) {
    const that = this
    const id = e.currentTarget.dataset.id
    const index = e.currentTarget.dataset.index
    wx.showLoading({
      title: '加载中',
    })
    if (index === that.data.current_type) {
      that.setData({
        current_type: null,
        type_id: '',
      })
      that.getStore('', 1, data => {
        wx.hideLoading()
        that.setData({
          close: false,
          shops: data,
        })
      })
    } else {
      that.setData({
        current_type: index,
        type_id: id,
      })
      that.getStore(id, 1, data => {
        wx.hideLoading()
        that.setData({
          close: false,
          shops: data,
        })
      })
    }
  },


  //具体店铺跳转
  goToShop(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/shop/shop?id=' + id,
    })
  },

  //广告跳转
  goToAdContent(e) {
    wx.navigateTo({
      url: '/pages/ad_page/ad_page?link=' + e.currentTarget.dataset.content,
    })
  }
})
