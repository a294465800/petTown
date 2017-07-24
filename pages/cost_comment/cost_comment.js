// cost_comment.js
let app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //评论总星数
    star_count: [],

    //评论内容
    comments: null,

    //上传图片
    imgs: [],

    //星星图片
    star_img: {
      ok: '/images/order/star_f.png',
      no: '/images/order/star_n.png'
    },

    //评分
    score: {
      environment: 5,
      service: 5
    },

    //图片数据
    baseurl: '',
    host: 'https://www.sennkisystem.cn/'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const that = this
    let arr = []
    arr.length = 5
    that.setData({
      star_count: arr,
      order_id: options.id
    })
  },

  //图片选择、上传
  addImg() {
    const that = this
    wx.chooseImage({
      count: 3,
      sizeType: ['compressed'],
      success: res => {
        that.imgUpload(res.tempFilePaths, 0)
      },
    })
  },

  //图片预览
  preImg(e) {
    let img = e.currentTarget.dataset.img
    let imgs = e.currentTarget.dataset.imgs
    wx.previewImage({
      current: img,
      urls: imgs
    })
  },

  //删除图片
  delImg(e) {
    const that = this
    let img = e.currentTarget.dataset.img
    let imgs = that.data.imgs
    let index = imgs.indexOf(img)
    imgs.splice(index, 1)
    that.setData({
      imgs: imgs
    })
  },

  //店铺评分
  getScore(e) {
    const that = this
    let id = e.currentTarget.dataset.index
    let type = e.currentTarget.dataset.type
    let temp = 'score.' + type
    that.setData({
      [temp]: id + 1
    })
  },

  //文件上传递归
  imgUpload(imgs, i) {
    const that = this

    if (imgs[i]) {
      wx.uploadFile({
        url: app.globalData.host + 'upload',
        filePath: imgs[i],
        name: 'image',
        success: res => {
          let json = JSON.parse(res.data)
          let temp = that.data.host + json.baseurl
          let arr = [...that.data.imgs, temp]
          let index = that.data.imgs.indexOf(temp)
          if (arr.length > 3) {
            arr.length = 3
          } else if (index > -1 && arr.length > 1) {
            arr.splice(index, 1)
          }
          that.setData({
            imgs: arr
          })
          if (200 == json.code && imgs[i + 1]) {
            that.imgUpload(imgs, i + 1)
          }
        }
      })
    }
  },

  //获取评论
  getComments(e) {
    this.setData({
      comments: e.detail.value
    })
  },

  commentPost() {
    const that = this

    if (!that.data.comments) {
      wx.showModal({
        title: '提示',
        content: '请输入评论内容',
        showCancel: true,
        success: res => {
          return false
        }
      })
    } else {
      let baseurl = ''
      for (let i in that.data.imgs) {
        baseurl += that.data.imgs[i].replace(that.data.host, '') + ';'
      }

      wx.request({
        url: app.globalData.host + 'order/comment',
        method: 'POST',
        header: app.globalData.header,
        data: {
          orderID: that.data.order_id,
          content: that.data.comments,
          score_en: that.data.score.environment,
          score_at: that.data.score.service,
          img: baseurl
        },
        success: res => {
          if (200 == res.data.code) {
            wx.showToast({
              title: '评论成功',
              complete: () => {
                wx.navigateBack({})
              }
            })
          } else {
            wx.showToast({
              title: '评论失败',
            })
          }
        }
      })
    }
  }

})