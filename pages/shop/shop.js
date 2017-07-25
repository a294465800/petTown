// shop.js
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
    category_id: 1,
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

    //模拟数据
    commodity_category: [
      {
        id: 0,
        name: '医疗'
      },
      {
        id: 1,
        name: '洗澡'
      },
      {
        id: 2,
        name: '活体'
      },
      {
        id: 3,
        name: '美容'
      },
      {
        id: 4,
        name: '医疗'
      },
      {
        id: 5,
        name: '洗澡洗澡'
      },
      {
        id: 6,
        name: '活体'
      },
      {
        id: 7,
        name: '美容狗狗猫猫'
      },
      {
        id: 8,
        name: '洗澡洗澡'
      },
      {
        id: 9,
        name: '活体'
      },
      {
        id: 10,
        name: '美容狗狗猫猫美容狗狗猫猫'
      },
      {
        id: 11,
        name: '美容狗狗猫猫'
      },
      {
        id: 12,
        name: '洗澡洗澡'
      },
      {
        id: 13,
        name: '活体'
      },
      {
        id: 14,
        name: '美容狗狗猫猫'
      },
      {
        id: 15,
        name: '洗澡洗澡'
      },
      {
        id: 16,
        name: '活体'
      },
    ],

    shopItem: {
      0: [
        {
          id: 0,
          img: 'http://pic.pimg.tw/livilife16888/1339552981-308415971.jpg',
          title: '狗狗洗澡',
          price: '60',
          sell: 13
        }
      ]
    },

    comments: [
      {
        id: 0,
        avatarUrl: 'http://pic.pimg.tw/livilife16888/1339552981-308415971.jpg',
        nickname: '小猪猪',
        product_name: '洗澡',
        createtime: '2017-02-08',
        score: 4,
        content: '服务挺好啊~',
        img: [
          'http://imgs6.iaweg.com/pic/HTTP3Bob3RvLmw5OS5jb20vYmlnZ2VyLzMyLzEzOTI3Mjg3OTkwNjNfdXMxdnE0LmpwZwloglog.jpg',
          'http://i.vividaily.com/2017/01/159d0005b07c18492982-e1484722780384.jpg?ver=20161208',
          'http://img2.pclady.com.cn/pclady/1008/12/589754_20100727_113602_13.jpg'
        ],
        replies: ['谢谢支持！'],
        likes: 12
      },
      {
        id: 1,
        avatarUrl: 'http://pic.pimg.tw/livilife16888/1339552981-308415971.jpg',
        nickname: '天使',
        product_name: '迷之原力洗澡',
        createtime: '2017-06-08',
        score: 4,
        content: '服务挺好啊服务挺好啊服务挺好啊服务挺好啊服务挺好啊服务挺好啊服务挺好啊~',
        img: [
          'http://imgs6.iaweg.com/pic/HTTP3Bob3RvLmw5OS5jb20vYmlnZ2VyLzMyLzEzOTI3Mjg3OTkwNjNfdXMxdnE0LmpwZwloglog.jpg',
          'http://i.vividaily.com/2017/01/159d0005b07c18492982-e1484722780384.jpg?ver=20161208',
          'http://img2.pclady.com.cn/pclady/1008/12/589754_20100727_113602_13.jpg'
        ],
        replies: ['谢谢支持！谢谢支持！谢谢支持！谢谢支持！谢谢支持！谢谢支持！谢谢支持！谢谢支持！'],
        likes: 1200
      },
    ],

    store: {
      full_name: '超级宠物中心连锁店',
      location: '广东省广州市市桥永恒大街33号',
      time: '9:00 - 20:00',
      number: [
        '1836488951'
      ],
      content: '欢迎来到我们的宠物店，热烈欢迎~~~~~~~~',
      images: [
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfuEwM0Kkl6LhLqhpLRZWpmcTiYTGVP-zA7WM9OYxgiVTfc5eV',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWOFZ93sUBUiDB5kbtwRxCkc4GF31wvtTOz4d5M_a9yB8UmkSI',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScjXjzJz8ruKzky3HByfYq3N9oRHla-HeBigFtC6cHPhtwHmEf'
      ]
    }
  },

  onLoad(options) {
    const that = this
    let id = options.id
    let arr = []
    //评论星数数量
    arr.length = 5
    wx.setNavigationBarTitle({
      title: '君悦宠物店',
    })
    that.setData({
      shop_id: id,
      star_count: arr
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

  //商品目录切换
  shiftCategory(e) {
    const that = this
    that.setData({
      category_id: e.currentTarget.dataset.id,
      category_index: e.currentTarget.dataset.index
    })
  },

  //具体商品跳转
  goToCommodity(e) {
    const that = this
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/commodity/commodity?id=' + id,
    })
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