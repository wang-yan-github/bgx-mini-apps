let util = require("../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fileList: [],
    files: []
  },
  //图片预览
  previewImage: function(e) {
    var arr = [];
    for (let i = 0; i < this.data.fileList.length; i++) {
      arr.push(this.data.fileList[i].filePath);
    }
    this.setData({
      files: arr
    })
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    wx.getSavedFileList({
      success: function(res) {
        var filelist = [];
        for (let i = 0; i < res.fileList.length; i++) {
          //时间处理
          var data = new Date(res.fileList[i].createTime * 1000);
          var time = util.formatTime(data);
          filelist.push({
            filePath: res.fileList[i].filePath,
            time: time
          })
        }
        that.setData({
          fileList: filelist
        })
      }
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