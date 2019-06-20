// pages/creditLife/creditLifeIndex/index.js
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mainList: [{
        name: "白条",
        name_ss: "现金借款",
        intro: "信用越高，额度越高",
        img: "/pages/icons/xy_baitiao.png",
        text: "前往",
        url: "/pages/daBaiTiao/daBaiTiao/index",
      },
      {
        name: "法务",
        name_ss: "江湖信用>500",
        intro: "法务服务免费享",
        img: "/pages/icons/xy_fawu.png",
        text: "前往",
        url: "../lawService/index",
      },
      {
        name: "保险",
        name_ss: "江湖积分高",
        intro: "保险免费送",
        img: "/pages/icons/xy_baoxian.png",
        text: "前往",
        url: "../insurance/index",
      },
      {
        name: "优先预约",
        name_ss: "江湖积分高",
        intro: "优质项目优先约",
        img: "/pages/icons/xy_yxyy.png",
        text: "前往",
        url: "../priorityBook/index",
      },
    ],
    score: 500,
    userName: '包工大侠',
    creditRating: "江湖大侠"

  },
  scoreShow: function(){
    let that = this;
    let data ={};
    data.token = app.globalData.token;
    app.ajax.req('credit_api_controller/CreditLifeInfo',data,'POST',function(res){
       if(Number.parseInt(res.errorCode) == 200){
           that.setData({
             score: res.data.creditScore,
             userName: res.data.userName,
             creditRating: res.data.creditRating
           })
       }
    })
  },
  //提升信用
  upCredit: function() {
    let role = wx.getStorageSync('role');
    if (role == 1) {
      wx.navigateTo({
        url: '../fbf_credit/index',
      })
    } else {
      wx.navigateTo({
        url: '../personalCredit/index',
      })
    }
  },
  // 白条 法务 保险 优先预约路由
  onItemClick: function(e) {
    var index = e.currentTarget.dataset.index;
    console.log("index=" + index);
    var url = this.data.mainList[index].url;
    console.log("url=" + url);
    wx.navigateTo({
      url: url,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.scoreShow();
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