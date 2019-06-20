// pages/message/System/index.js
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    info: '',
    list: []
  },
  //知道
  know: function(e) {
    let status = e.currentTarget.dataset.status;
    if (status == 1) {
      return false;
    }
    let that = this;
    let data = {};
    data.token = app.globalData.token;
    data.id = e.currentTarget.dataset.id;
    let text = e.currentTarget.dataset.text;
    if (text == "已知") {
      app.ajax.req('message_api_controller/saveMessage', data, 'POST', function(res) {
        if (Number.parseInt(res.errorCode) == 200) {
          let list = that.data.list;
          for (let i = 0; i < list.length; i++) {
            if (list[i].id == e.currentTarget.dataset.id) {
              that.setData({
                ['list[' + i + '].status']: 1
              })
            }
          }
        }
      })
    } else {
      let isOk = '';
      if (text == "同意") {
        isOk = 1;
      } else {
        isOk = 0;
      }
      data.isOk = isOk;
      app.ajax.req('message_api_controller/teamIsOk', data, 'POST', function(res) {
        if (Number.parseInt(res.errorCode) == 200) {
          if (text == "同意") {
            wx.showToast({
              title: '已同意加入班组',
              icon: 'none'
            })
          } else {
            wx.showToast({
              title: '已拒绝加入班组',
              icon: 'none'
            })
          }
          let list = that.data.list;
          for (let i = 0; i < list.length; i++) {
            if (list[i].id == e.currentTarget.dataset.id) {
              that.setData({
                ['list[' + i + '].status']: 1
              })
            }
          }
        }
      })
    }
  },
  messageList: function() {
    var that = this;
    var data = {};
    data.token = app.globalData.token;
    wx.showLoading({
      title: '加载中',
    })
    app.ajax.req('message_api_controller/messageInfo', data, 'POST', function(res) {
      wx.hideLoading();
      if (parseInt(res.errorCode) === 200) {
        console.log(res.data);
        that.setData({
          list: res.data.list
        })
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
    this.messageList();
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