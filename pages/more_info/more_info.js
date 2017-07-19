// more_info.js
let app = getApp()
Page({

  data: {
    QRcode: false
  },


  onLoad(options) {

  },

  //二维码跳转
  showQRcode() {
    this.setData({
      QRcode: true
    })
  },
  hideQRcode() {
    console.log(1)
    this.setData({
      QRcode: false
    })
  },

  //二维码预览
  preQRcode(e) {
    wx.previewImage({
      urls: ['https://www.sennkisystem.cn/qrcode.png'],
    })
  },

  //电话小主帮
  callUs(e) {
    const that = this
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.tel,
    })
  },
})