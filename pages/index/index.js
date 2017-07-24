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
    animationSearch: {},

    //星星
    star_count: [],
    star_img: {
      ok: '/images/order/star_f.png',
      no: '/images/order/star_n.png'
    },

    //加载提示控制
    loading_tips: true,

    //模拟数据
    shops: [
      {
        id: 0,
        name: '君悦宠物店',
        score: 2,
        type: ['医疗', '美容', '活体'],
        distance: '2.5km',
      },
      {
        id: 1,
        name: '肥猪宠物店啊啊啊啊啊啊啊',
        score: 1,
        type: ['医疗', '美容', '活体'],
        distance: '2.5km',
      },
      {
        id: 2,
        name: '宠物店',
        score: 5,
        type: ['洗澡', '活体'],
        distance: '2.5km',
      },
      {
        id: 3,
        name: '一号',
        score: 3,
        type: ['医疗', '美容', '活体', '洗澡', '体检', '喂食'],
        distance: '2.5km',
      },
      {
        id: 4,
        name: '三号',
        score: 7,
        type: ['医疗', '美容', '活体'],
        distance: '2.5km',
      },
      {
        id: 5,
        name: '爱之旅宠物店',
        score: 3,
        type: ['医疗', '美容'],
        distance: '2.5km',
      },
      {
        id: 6,
        name: '飞跃宠物店',
        score: 4,
        type: ['医疗', '美容', '活体'],
        distance: '2.5km',
      },
    ],

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
    let that = this

    let arr = []
    //评论星数数量
    arr.length = 5
    that.setData({
      star_count: arr
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
    setTimeout(() => {
      that.setData({
        shops: [...that.data.shops, ...that.data.new_shops]
      })
    }, 500)
  }
})
