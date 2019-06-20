var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    //系统消息
    info: '',
    listData: []
  },
  messageList: function() {
    var that = this;
    var data = {};
    data.token = app.globalData.token;
    wx.showLoading({
      title: '加载中'
    })
    //请求系统消息
    app.ajax.req('message_api_controller/messageList', data, 'POST', function(res) {
      if (parseInt(res.errorCode) === 200) {
        that.setData({
          info: res.data
        })
        //马上调用消息条数
        clearTimeout(app.globalData.xiaoxiTime);
        app.showXiaoxiTotal();
      }
      wx.hideLoading();
    })
  },
  system_xiaoxi: function() {
    wx.navigateTo({
      url: '../System/index'
    })
  },
  liaotian: function(e) {
    if (this.data.info.l_total == 0) {
      wx.showToast({
        title: '暂无消息',
        icon: 'none'
      })
      return false;
    }

    let id_ = e.currentTarget.dataset.toid;
    let type_ = e.currentTarget.dataset.totype;
    let dutyname = e.currentTarget.dataset.dutyname;
    wx.navigateTo({
      url: '../page/index?to_id=' + id_ + '&to_type=' + type_ + '&duty_name=' + dutyname,
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
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let that = this;
    app.isLogin(function() {
      //获得消息数
      that.messageList();
      //获取聊天记录列表
      wx.showLoading({
        title: '加载中'
      })
      let data = {};
      data.token = app.globalData.token;
      app.ajax.req('chat_record_api_controller/chatList', data, 'POST', function(res) {
        if (parseInt(res.errorCode) === 200) {
          let listData = res.data;
          that.setData({
            listData: listData
          })
        }
        wx.hideLoading();
      })
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