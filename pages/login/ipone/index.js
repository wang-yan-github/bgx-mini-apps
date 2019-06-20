// pages/loginPage/index.js
let app = getApp();
let interval = null;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    phone: '',
    yzm: '',
    yzmTime: '获取验证码',
    yzmDisabled: false,
    yzmInitTime: 91,
    //按钮锁定
    disabled: false
  },
  //用户协议
  userAgreement: function() {
    wx.navigateTo({
      url: '../userAgreement/index'
    })
  },
  phone: function(e) {
    this.setData({
      phone: e.detail.value
    });
  },
  yzm: function(e) {
    this.setData({
      yzm: e.detail.value
    });
  },
  //非空验证公共函数
  ValueIsNull: function(that) {
    if (!that.data.phone) {
      wx.showToast({
        title: '手机号不为空',
        icon: 'none'
      })
      return;
    }
    if (Number.parseInt(that.data.phone.length) !== 11) {
      wx.showToast({
        title: '手机号长度有误',
        icon: 'none'
      })
      return;
    }
    if (!that.data.yzm) {
      wx.showToast({
        title: '手机验证码不为空',
        icon: 'none'
      })
      return;
    }
  },
  //手机号快捷登录
  login: function(e) {
    let that = this;
    if (that.data.disabled) {
      return false;
    }
    //非空验证
    that.ValueIsNull(that);
    wx.showLoading({
      title: '加载中',
    })
    let data = {};
    let pwd = wx.getStorageSync('pwd');
    let role = wx.getStorageSync('role') ? wx.getStorageSync('role') : 0;;
    let phone = wx.getStorageSync('phone') ? wx.getStorageSync('phone') : that.data.phone;
    data.role = role;
    data.phone = phone;
    data.password = pwd;
    data.code = that.data.yzm;
    if (!phone) {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none'
      })
      return false;
    }

    if (!pwd && !that.data.yzm) {
      wx.showToast({
        title: '验证码不能为空',
        icon: 'none'
      })
      return false;
    }
    //锁定按钮
    that.setData({
      disabled: true
    })
    wx.showLoading({
      title: '登录中',
    })
    app.ajax.req('user_api_controller/phonelogin', data, 'POST', function(res) {
      wx.hideLoading();
      if (parseInt(res.errorCode) === 200) {
        that.loginRes(that, res);
      } else {
        wx.showToast({
          title: res.errorDesc,
          icon: 'none',
          duration: 2000
        })
        that.setData({
          disabled: false
        })
      }
      console.log("登录返回的值", res);
    })
  },
  //登录返回结果集处理
  loginRes: function(that, res) {
    try {
      //缓存手机号，用户名，密码
      let phone = wx.getStorageSync('phone') ? wx.getStorageSync('phone') : res.data.phone;
      wx.setStorageSync('phone', phone);
      wx.setStorageSync('phonePwd', res.data.phonePwd);
      wx.setStorageSync('username', res.data.userName);
      wx.setStorageSync('pwd', res.data.password);
    } catch (e) {
      wx.showToast({
        title: e,
        icon: 'none'
      })
    }
    app.globalData.token = res.data.token;
    app.globalData.perfectStatus = parseInt(res.data.status);
    app.globalData.authentica = parseInt(res.data.authentica);
    app.globalData.touxiang = res.data.headPortrait ? res.data.headPortrait : app.globalData.touxiang;
    app.globalData.infoId = res.data.infoId;
    //解锁按钮
    that.setData({
      disabled: false
    })
    let role = wx.getStorageSync('role');
    if (!role) {
      wx.navigateTo({
        url: '../roleSelect/index'
      })
    } else {
      wx.switchTab({
        url: '/pages/index/index'
      })
    }
    //消息的总条数
    app.showXiaoxiTotal();

  },
  //获取手机验证码
  getCode: function(options) {
    var that = this;
    if (that.data.yzmDisabled) {
      return;
    }
    if (!that.data.phone) {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none'
      })
      return;
    }
    if (Number.parseInt(that.data.phone.length) !== 11) {
      wx.showToast({
        title: '手机号长度有误',
        icon: 'none'
      })
      return;
    }
    //设置验证码不可点击
    that.setData({
      yzmDisabled: true
    })
    //处理倒计时
    var currentTime = that.data.yzmInitTime;
    interval = setInterval(function() {
      currentTime--;
      that.setData({
        yzmTime: currentTime + '秒'
      })
      if (currentTime <= 0) {
        clearInterval(interval)
        that.setData({
          yzmTime: '重新获取',
          yzmInitTime: 91,
          yzmDisabled: false
        })
      }
    }, 1000);
    //点击获取验证码
    var data = {};
    data.phone = that.data.phone;
    app.ajax.req('public_api_controller/bgxsendcode', data, 'POST', function(res) {
      if (parseInt(res.errorCode) !== 200) {
        wx.showToast({
          title: res.errorDesc,
          icon: 'none'
        })
        return;
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let pwd = wx.getStorageSync("pwd");
    if (pwd) {
      this.login();
    }
    // if (app.globalData.userInfo) {
    //   this.setData({
    //     userInfo: app.globalData.userInfo,
    //     hasUserInfo: true
    //   })
    // } else if (this.data.canIUse) {
    //   // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //   // 所以此处加入 callback 以防止这种情况
    //   app.userInfoReadyCallback = res => {
    //     this.setData({
    //       userInfo: res.userInfo,
    //       hasUserInfo: true
    //     })
    //     console.log("个人信息", res.userInfo);
    //   }
    // } else {
    //   // 在没有 open-type=getUserInfo 版本的兼容处理
    //   wx.getUserInfo({
    //     success: res => {
    //       app.globalData.userInfo = res.userInfo
    //       this.setData({
    //         userInfo: res.userInfo,
    //         hasUserInfo: true
    //       })
    //     }
    //   })
    // }
  },
  getUserInfo: function(e) {
    console.log(e)
    if (e.detail.errMsg == "getUserInfo:ok") {
      app.globalData.userInfo = e.detail.userInfo
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })
      let that = this;
      wx.login({
        success: function(res) {
          console.log("微信授权返回", res);
          let code = res.code;
          if (res.code) {
            let data = {};
            data.code = code;
            wx.showLoading({
              title: '加载中'
            })
            app.ajax.req('user_api_controller/getSessionkey', data, 'POST', function(res) {
              if (parseInt(res.errorCode) === 200) {
                //判断是否为第一次绑定数据
                if (!res.data.phone) {
                  wx.navigateTo({
                    url: '../wx/wxLogin?openid=' + res.data.openid + '&nickname=' + that.data.userInfo.nickName + '&avatarUrl=' + that.data.userInfo.avatarUrl,
                  })
                } else {
                  console.log("微信返回的值", res);
                  //有手机号
                  wx.setStorageSync('phone', res.data.phone);
                  wx.setStorageSync('pwd', res.data.password);
                  that.login();
                }
              }
              wx.hideLoading();
            })
          } else {
            console.log('获取用户登录态失败！' + res.errMsg)
          }
        }
      });
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})