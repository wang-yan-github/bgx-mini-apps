// pages/findXM/fbfInfo/index.js
let app = getApp();
let util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: 'tab1',
    cid: '',
    fbfInfo: ''
  },
  onChange(e) {
    console.log('onChange', e)
    this.setData({
      current: e.detail.key,
    })
  },
  //发包方信息展示
  fbfInfoShow: function() {
    wx.showLoading({
      title: '加载中',
    })
    let that = this;
    let data = {};
    data.token = app.globalData.token;
    data.c_id = that.data.cid;
    app.ajax.req('company_api_controller/companyInfo', data, 'POST', function(res) {
      if (Number.parseInt(res.errorCode)) {
        that.setData({
          fbfInfo: res.data
        })

        //区域查询
        let quyu = util.getAreaText(res.data.region);
        that.setData({
          ['fbfInfo.region']: quyu
        })
      }
      wx.hideLoading();
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      cid: options.cid
    })
    this.fbfInfoShow();
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