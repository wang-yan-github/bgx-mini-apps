// pages/creditLife/fbf_credit/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 是否初始化成功
    isLinked: true,
    // 信用分
    creditScore: "0",
    // 信用等级
    creditRating: "",
    // 信用时间
    creditTime: "",
    // 完善信息
    companyInfo: "",
    companyInfo1: ""
  },
  // 完善信息
  onClickInfo: function() {
    wx.navigateTo({
      url: '/pages/fbfCenter/fbf_info/index',
    })
  },
  //实名认证
  onClickInfo1: function() {
    wx.navigateTo({
      url: '/pages/mine/certification/certification'
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
    wx.showLoading({
      title: '加载中',
    })
    let that = this;
    let data = {};
    data.token = app.globalData.token;
    app.ajax.req('credit_api_controller/companyCreditInfo', data, 'POST', function(res) {
      console.log("发包方江湖信用初始化加载=" + JSON.stringify(res));
      if (parseInt(res.errorCode) == 200) {
        wx.hideLoading();
        let data = res.data;
        console.log(that.switchText(data.companyInfo) + "||" + data.companyInfo);
        that.setData({
          creditScore: data.creditScore,
          creditRating: data.creditRating,
          creditTime: data.creditTime,
          companyInfo: that.switchText(data.companyInfo)
        })
        console.log("加载成功");
      } else {
        console.log("保存失败");
      }
    })
  },

  switchText: function(_code) {
    let code = _code + "";
    let toText = "";
    switch (code) {
      case '100':
        toText = "未完善";
        break;
      case '101':
        toText = "审核中";
        break;
      case '102':
        toText = "审核通过";
        break;
      case '103':
        toText = "审核失败";
        break;
      default:
        break;
    }
    return toText;
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