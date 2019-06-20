// pages/findXM/report/index.js
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pId: '',
    content: ''
  },
  content: function(e) {
    this.setData({
      content: e.detail.value
    })
  },
  //举报接口
  report: function(e) {
    let data = {};
    let pId = this.data.pId;
    data.token = app.globalData.token;
    data.content = this.data.content;
    data.pId = pId;
    app.ajax.req('/company_api_controller/projectReport', data, 'POST', function(res) {
      if (Number.parseInt(res.errorCode) === 200) {
        wx.showToast({
          title: '举报成功，请关注消息列表查看反馈信息',
          icon: 'none'
        })
        setTimeout(function() {
          wx.navigateBack();
        }, 1500)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      pId: options.pid
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