// cost_record.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //导航动画
    animationNav: {},

    //当前页
    current: 0,

    //星星
    star_count: [],
    star_img: {
      ok: '/images/order/star_f.png',
      no: '/images/order/star_n.png'
    },

    //消费记录导航
    cost_records: [
      {
        id: 0,
        name: '未使用'
      },
      {
        id: 1,
        name: '未评价'
      },
      {
        id: 2,
        name: '已评价'
      },
    ],

    //模拟数据
    orders: {
      unUse: [
        {
          id: 0,
          img: 'http://img.t.388g.com/27/images/201611/1480040435897352.jpg',
          product_name: '猫咪洗澡',
          store_name: 'XX宠物店',
          schedule: '2017-07-30 18:20',
          number: '4501385485215412'
        }
      ],
      unComment: [
        {
          id: 0,
          img: 'http://img.t.388g.com/27/images/201611/1480040435897352.jpg',
          product_name: '猫咪洗澡',
          store_name: 'XX宠物店',
          time: '2017-07-30 18:20'
        }
      ],
      finish: [
        {
          id: 0,
          img: 'http://img.t.388g.com/27/images/201611/1480040435897352.jpg',
          product_name: '猫咪洗澡',
          store_name: 'XX宠物店',
          score: 3
        }
      ]
    },

    //接口数据
    // orders: null,
  },

  onLoad(options) {
    let that = this

    let arr = []
    //评论星数数量
    arr.length = 5
    that.setData({
      star_count: arr
    })
  },

  onShow() {
    const that = this
  },

  //动画封装
  animationNav(id) {
    let left = (id * 33.3) + '%'
    let animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease'
    })
    return animation.left(left).step()
  },

  //点击切换函数
  shiftPage(e) {
    const that = this
    let id = e.currentTarget.dataset.index
    that.setData({
      current: id,
      animationNav: that.animationNav(id).export()
    })
  },

  //swiper变动切换函数
  nextPage(e) {
    const that = this
    let index = e.detail.current
    that.setData({
      current: index,
      animationNav: that.animationNav(index).export()
    })
  },

  //评论跳转
  goToComment(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/cost_comment/cost_comment?id=' + id,
    })
  },

  //查看订单
  goToOrder(e) {
    let id = e.currentTarget.dataset.order_id
    wx.navigateTo({
      url: '/pages/schedule/schedule?id=' + id,
    })
  }
})