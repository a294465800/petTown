//app.js
App({
  onLaunch() {
  },
  onShow() {
    const that = this
    if (that.globalData.userInfo) {
      this.checkLogin()
    }
  },

  globalData: {
    userInfo: null,
    host: 'https://www.sennkisystem.cn/api/',
    header: {
      'content-type': 'application/x-www-form-urlencoded',
      'AppVersion': '4.0',
      'storeNumber': '1400344af3767f15f957ff6c4d7c3f2c'
    },
    shop: null
  },

  getUserInfo(cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },

  //获取用户设置
  getSetting(cb) {
    let that = this
    wx.getSystemInfo({
      success: res => {
        if (res.SDKVersion.replace(/\./g, '') < 125) {
          wx.showModal({
            title: '提示',
            content: '当前微信版本过低，部分功能可能无法使用，请升级到最新微信版本。',
            showCancel: false
          })
        }
      }
    })
    if (that.globalData.userInfo) {
      typeof cb == "function" && cb(that.globalData.userInfo)
      return false
    }
    wx.showLoading({
      title: '登录中',
    })
    wx.getSetting({
      success: setting => {
        if (setting.authSetting["scope.userInfo"]) {
          //调用登录接口
          wx.login({
            withCredentials: true,
            success: rs => {
              wx.getUserInfo({
                success: res => {
                  wx.request({
                    url: that.globalData.host + 'oauth/login',
                    method: 'POST',
                    header: that.globalData.header,
                    data: {
                      code: rs.code,
                      encryptedData: res.encryptedData,
                      iv: res.iv
                    },
                    success: e => {
                      wx.hideLoading()
                      if (!e.header) {
                        wx.showModal({
                          title: '提示',
                          content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。',
                          showCancel: false
                        })
                      } else if (200 != e.data.code) {
                        wx.showToast({
                          title: '登录失败',
                        })
                      } else {
                        that.globalData.header.Cookie = e.header['Set-Cookie'].split(";")[0]

                        if (0 == e.data.data.register) {
                          wx.showModal({
                            title: '提示',
                            content: '你还没有绑定手机号码？',
                            confirmText: '确认绑定',
                            success: res => {
                              if (res.confirm) {
                                wx.navigateTo({
                                  url: '/pages/tel_input/tel_input',
                                })
                              } else {
                                typeof cb == "function" && cb(that.globalData.userInfo)
                              }
                            }
                          })
                        } else {
                          that.checkLogin(cb)
                        }
                      }
                    }
                  })
                }
              })
            }
          })
        } else if (setting.authSetting["scope.userInfo"] === false) {
          wx.hideLoading()
          wx.showModal({
            title: '提示',
            content: '您之前拒绝了授权，现在是否开启？',
            success: res => {
              if (res.confirm) {
                wx.openSetting({
                  success: rs => {
                    if (rs.authSetting["scope.userInfo"]) {
                      that.getSetting(cb)
                    }
                  }
                })
              } else {
                typeof cb == "function" && cb(that.globalData.userInfo)
              }
            }
          })
        } else {
          wx.hideLoading()
          wx.getUserInfo({
            success: res => {
              that.getSetting(cb)
            },
            fail: () => {
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      }
    })
  },

  //登录验证
  checkLogin(cb) {
    const that = this
    wx.request({
      url: that.globalData.host + 'auth/check',
      header: that.globalData.header,
      success: res => {
        if (200 == res.data.code) {
          if (that.globalData.userInfo) {
            typeof cb == "function" && cb(that.globalData.userInfo)
          }
          else {
            that.globalData.userInfo = res.data.data
            wx.showToast({
              title: '登录成功',
            })
            typeof cb == "function" && cb(res.data.data)
          }
        } else {
          wx.showToast({
            title: '登录失败',
          })
        }
      },
      error: () => {
        wx.showToast({
          title: '登录失败',
        })
      }
    })
  },

  //登录跳转函数
  goToTelInput() {
    wx.showModal({
      title: '提示',
      content: '请先登录',
      success: res => {
        if (res.confirm) {
          wx.navigateTo({
            url: '/pages/mine/mine',
          })
        }
      }
    })
  },

})
