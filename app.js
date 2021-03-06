//app.js
App({
  onLaunch() {
  },
  onShow() {
  },

  globalData: {
    userInfo: null,
    host: 'http://119.23.202.220/api/',
    host_v1: 'http://119.23.202.220/api/V1/',
    host_v2: 'http://119.23.202.220/api/v2/',
    // host: 'https://www.sennkisystem.cn/api/v2/',
    // header: {
    //   'content-type': 'application/x-www-form-urlencoded',
    //   'AppVersion': '4.0',
    //   'storeNumber': '1400344af3767f15f957ff6c4d7c3f2c'
    // },
    shop: null,
    token: null,
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
    wx.getSetting({
      success: setting => {
        if (setting.authSetting["scope.userInfo"]) {
          wx.showLoading({
            title: '登录中',
            mask: true
          })
          //调用登录接口
          wx.login({
            withCredentials: true,
            success: rs => {
              wx.getUserInfo({
                success: res => {
                  wx.request({
                    url: that.globalData.host_v2 + 'login',
                    method: 'POST',
                    data: {
                      code: rs.code,
                      encryptedData: res.encryptedData,
                      iv: res.iv,
                    },
                    success: e => {
                      wx.hideLoading()
                      if (200 != e.data.code) {
                        wx.showToast({
                          title: '登录失败',
                        })
                        that.globalData.userInfo = null
                      } else {
                        if (!e.data.data.register) {
                          wx.showModal({
                            title: '提示',
                            content: '你还没有绑定手机号，去绑定手机号？',
                            success: confirm => {
                              if(confirm.confirm){
                                wx.navigateTo({
                                  url: '/pages/tel_input/tel_input',
                                })
                              }
                            }
                          })
                        } else {
                          that.globalData.userInfo = e.data.data
                          that.globalData.token = e.data.token
                          wx.showToast({
                            title: '登录成功',
                          })
                        }
                      }
                      typeof cb == "function" && cb(that.globalData.userInfo)
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

  //注册
  // register(){
  //   const that = this
  //   wx.request({
  //     url: that.globalData.host_v2 + '/sms',
  //     data: {
  //       number: 18142883149
  //     },
  //     success: response => {
  //       if(200 == res.data.code)
  //     }
  //   })
  //   wx.login({
  //     withCredentials: true,
  //     success: rs => {
  //       wx.getUserInfo({
  //         success: res => {
  //           that.globalData.userInfo = res.userInfo
  //           wx.request({
  //             url: that.globalData.host + 'register',
  //             method: 'POST',
  //             data: {
  //               code: rs.code,
  //               encryptedData: res.encryptedData,
  //               iv: res.iv,
  //             },
  //             success: res => {
  //               // that.globalData
  //             }
  //           })
  //         }
  //       })
  //     }
  //   })
  // },

  //如果已授权，直接登录，否则，不做操作
  nowLogin(cb) {
    const that = this
    wx.getSetting({
      success: setting => {
        if (setting.authSetting["scope.userInfo"]) {
          wx.showLoading({
            title: '登录中',
            mask: true
          })
          wx.login({
            withCredentials: true,
            success: rs => {
              wx.getUserInfo({
                success: res => {
                  that.globalData.userInfo = res.userInfo
                  wx.request({
                    url: that.globalData.host_v2 + 'login',
                    method: 'POST',
                    data: {
                      code: rs.code,
                      encryptedData: res.encryptedData,
                      iv: res.iv,
                    },
                    success: e => {
                      wx.hideLoading()
                      if (200 != e.data.code) {
                        wx.showToast({
                          title: '登录失败',
                        })
                        that.globalData.userInfo = null
                      } else {
                        that.globalData.token = e.data.token
                        wx.showToast({
                          title: '登录成功',
                        })
                      }
                      typeof cb == "function" && cb(that.globalData.userInfo)
                    }
                  })
                }
              })
            }
          })
        } else {
          typeof cb == "function" && cb(that.globalData.userInfo)
        }
      }
    })
  },

  //登录询问
  goToTelInput(cb) {
    const that = this
    wx.showModal({
      title: '提示',
      content: '请先登录',
      success: res => {
        if (res.confirm) {
          that.getSetting(cb)
        }
      }
    })
  },

  //登录验证
  // checkLogin(cb) {
  //   const that = this
  //   wx.request({
  //     url: that.globalData.host + 'auth/check',
  //     header: that.globalData.header,
  //     success: res => {
  //       if (200 == res.data.code) {
  //         if (that.globalData.userInfo) {
  //           typeof cb == "function" && cb(that.globalData.userInfo)
  //         }
  //         else {
  //           that.globalData.userInfo = res.data.data
  //           wx.showToast({
  //             title: '登录成功',
  //           })
  //           typeof cb == "function" && cb(res.data.data)
  //         }
  //       } else {
  //         wx.showToast({
  //           title: '登录失败',
  //         })
  //       }
  //     },
  //     error: () => {
  //       wx.showToast({
  //         title: '登录失败',
  //       })
  //     }
  //   })
  // },

  //登录跳转函数
  // goToTelInput() {
  //   wx.showModal({
  //     title: '提示',
  //     content: '请先登录',
  //     success: res => {
  //       if (res.confirm) {
  //         wx.navigateTo({
  //           url: '/pages/mine/mine',
  //         })
  //       }
  //     }
  //   })
  // },

})
