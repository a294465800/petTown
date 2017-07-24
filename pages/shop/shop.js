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

    //模拟数据
    commodity_category:[
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
    }
  },

  onLoad(options) {
    const that = this
    let id = options.id
    wx.setNavigationBarTitle({
      title: '君悦宠物店',
    })
    that.setData({
      shop_id: id
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
    // let animation = 
    that.setData({
      animationNav: that.navAnimation(index).export(),
      current: index
    })
  },

  //商品目录切换
  shiftCategory(e){
    const that = this
    const id = e.currentTarget.dataset.id
    that.setData({
      category_id: id
    })
    
  }
})