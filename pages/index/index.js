//index.js
//获取应用实例
let app = getApp()

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
    animationSearch: {}
  },
  onLoad() {
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
      duration: 500,
      timingFunction: 'ease'
    })
    endY = e.changedTouches[0].clientY
    endX = e.changedTouches[0].clientX
    let temp = endX - startX
    if (temp > 30 || temp < -30){
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
  }
})
