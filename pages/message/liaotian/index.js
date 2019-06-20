let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listData: [],
  },
  liaotian: function(e) {
    let id_ = e.currentTarget.dataset.toid;
    let type_ = e.currentTarget.dataset.totype;
    let dutyname = e.currentTarget.dataset.dutyname;
    wx.navigateTo({
      url: 'pageXiaoxi?to_id=' + id_ + '&to_type=' + type_ + '&duty_name=' + dutyname,
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
    var that = this
    //获取聊天记录列表
    wx.showLoading({
      title: '加载中',
    })
    let data = {};
    data.token = app.globalData.token;
    app.ajax.req('chat_record_api_controller/chatList', data, 'POST', function(res) {
      if (parseInt(res.errorCode) === 200) {
        let listData = res.data;
        console.log('接收到的数据', listData);
        that.setData({
          listData: listData
        })
      }
      wx.hideLoading();
    })
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