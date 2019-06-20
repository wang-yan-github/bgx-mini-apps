// pages/fbfCenter/tsYyLW_evaluate.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fenshu: 60,
    zishu: 0,
    evaluateText: '',
    wid: -1,
    wpid: -1,
    slider: 3
  },
  // 设置
  onEvaluateText: function (e) {
    this.setData({
      evaluateText: e.detail.value
    })
  },
  onSubmit: function() {
    var that = this;
    var data = {};
    data.token = app.globalData.token;
    data.r_id = that.data.wid;
    data.w_pid = that.data.wpid;
    data.p_id = that.data.pid;
    data.firstScore = that.data.fenshu;

    if (!that.data.evaluateText) {
      wx.showToast({
        title: '请输入文字再提交',
      })
      return;
    }
    data.firstComment = that.data.evaluateText;
    console.log("发包方评论参数=" + JSON.stringify(data));
    app.ajax.req('review_api_controller/bgxreviewadd', data, 'GET', function(res) {
      console.log("评论接口返回参数=" + JSON.stringify(res));
      if (parseInt(res.errorCode) == 200) {
        wx.showToast({
          title: '评论成功',
          icon: 'success',
        })

        //返回列表页
        setTimeout(function() {
          wx.navigateBack();
        }, 1000)
      }
    })

  },
  // text: function(e) {
  //   this.setData({
  //     zishu: e.detail.value.length,
  //     text: e.detail.value
  //   })
  // },

  sliderChange(e) {
    this.setData({
      slider: e.detail.value,
      fenshu: e.detail.value * 20
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var wid = options.wid;
    var wpid = options.wpid;
    var pid = options.pid;
    that.setData({
      wid: wid,
      wpid: wpid,
      pid: pid
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