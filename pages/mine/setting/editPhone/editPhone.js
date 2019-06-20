// pages/mine/setting/editPhone/editPhone.js
let interval = null;
const isTel = (value) => !/^1[34578]\d{9}$/.test(value);
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nphone: '',
    yzm: '',
    yzmTime: '获取验证码',
    yzmDisabled: false,
    yzmInitTime: 91,
  },
  nPhone(e) {
    this.setData({
      error: isTel(e.detail.value),
      nphone: e.detail.value
    })
  },
  yzm(e) {
    this.setData({
      yzm: e.detail.value
    })
  },
  //获取手机验证码
  getCode: function(options) {
    var that = this;
    if (that.data.yzmDisabled) {
      return;
    }
    if (!that.data.nphone) {
      wx.showToast({
        title: '现手机号不能为空',
        icon: 'none'
      })
      return;
    }
    if (Number.parseInt(that.data.nphone.length) !== 11) {
      wx.showToast({
        title: '现手机号长度有误',
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
    data.phone = that.data.nphone;
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

  //修改手机号
  submit: function(e) {
    let data = {};
    data.token = app.globalData.token;
    data.nphone = this.data.nPhone;
    data.code = this.data.yzm;
    app.ajax.req('/public_api_controller/changePhone', data, 'POST', function(res) {
       if(Number.parseInt(res.errorCode) === 200){
         wx.showToast({
           title: '修改成功',
         })
         setTimeout(function(){
           wx.navigateBack();
         },1500)
       }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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