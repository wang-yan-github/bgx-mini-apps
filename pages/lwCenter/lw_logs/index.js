// pages/bgxCenter/bgx_tsYyXM_addLogs.js
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    logText: '',
    wpid: -1
  },
  logText: function(e) {
    this.setData({
      logText: e.detail.value
    })
  },
  submitLog: function() {
    var that = this;
    var data = {};
    data.token = app.globalData.token;
    data.w_pid = that.data.wpid;
    data.logText = that.data.logText;
    app.ajax.req('log_api_controller/comAndWorLogAdd', data, 'GET', function(res) {
      if (parseInt(res.errorCode) == 200) {
        wx.showToast({
          title: '提交成功',
          icon: 'none'
        })
      } else {
        wx.showToast({
          title: res.errorDesc,
          icon: 'none'
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      // wpid: options.wpid
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