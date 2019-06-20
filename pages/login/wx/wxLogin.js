// pages/login/wx/wxLogin.js
let interval = null;
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
    yzm: '',
    yzmTime: '获取验证码',
    yzmDisabled: false,
    yzmInitTime: 91,
    openid: '',
    //昵称
    nickname: '',
    //头像
    avatarUrl: ''
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
    app.ajax.req('public_api_controller/bgxsendcode', data, 'GET', function(res) {
      if (parseInt(res.errorCode) !== 200) {
        wx.showToast({
          title: res.errorDesc,
          icon: 'none'
        })
        return;
      }
    })
  },
  //绑定
  bind: function() {
    let that = this;
    let data = {};
    data.openid = this.data.openid;
    data.phone = this.data.phone;
    data.code = this.data.yzm;
    data.nickName = this.data.nickname;
    data.headportrait = this.data.avatarUrl;
    app.ajax.req('/user_api_controller/wxRegist', data, 'POST', function(res) {
      if (parseInt(res.errorCode) === 200) {
        wx.setStorageSync('phone', that.data.phone);
        wx.setStorageSync('pwd', res.data.password);
        wx.navigateTo({
          url: '../roleSelect/index'
        })
      }else{
        wx.showToast({
          title: res.errorDesc,
          icon:'none'
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      openid: options.openid,
      nickname: options.nickname,
      avatarUrl: options.avatarUrl
    })
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