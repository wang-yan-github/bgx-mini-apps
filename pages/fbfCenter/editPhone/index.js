// pages/fbfCenter/editPhone/index.js
let app = getApp();
let interval = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    org_phone: "", // 原手机号 
    phone_focus: false,
    phone: "",
    yzm: '',
    yzmTime: '获取验证码',
    yzmDisabled: false,
    yzmInitTime: 91
  },
  // 监听手机号
  onPhone: function(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  // 监听验证码
  onYzm: function(e) {
    this.setData({
      yzm: e.detail.value
    })
  },
  //获取手机验证码
  getCode: function(options) {
    let that = this;
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
  // 提交保存
  onSave: function() {
    const that = this;
    let data = {};
    data.rephone = that.data.phone;
    data.code = that.data.yzm;
    data.token = app.globalData.token;
    console.log("提交新手机号参数=" + JSON.stringify(data));
    app.ajax.req('public_api_controller/changePhone', data, 'GET', function(res) {
      if (parseInt(res.errorCode) !== 200) {
        wx.showToast({
          title: "修改成功",
          icon: 'success',
          duration: 1000,
          success: function() {
            wx.clearStorageSync();
            wx.redirectTo({
              url: '/pages/login/ipone/index',
            })
          }
        })
        return;
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      phone_focus: true,
      org_phone: options.phone
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