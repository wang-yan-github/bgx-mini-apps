// pages/login/role_select.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  click_: function(e) {
    //清除全局消息定时器
    // clearTimeout(app.globalData.xiaoxiTime);
    let role = e.currentTarget.dataset.text;
    switch (role) {
      case "1":
        wx.setStorageSync('role', 1);
        wx.navigateTo({
          url: '/pages/login/ipone/index',
        })
        break;
      case "2":
        wx.setStorageSync('role', 2);
        wx.navigateTo({
          url: '/pages/login/ipone/index',
        })
        break;
      case "3":
        wx.setStorageSync('role', 3);
        wx.navigateTo({
          url: '/pages/login/ipone/index',
        })
        break;
      default:
        wx.navigateTo({
          url: '/pages/login/ipone/index',
        })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let role = wx.getStorageSync('role');
    // if()
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