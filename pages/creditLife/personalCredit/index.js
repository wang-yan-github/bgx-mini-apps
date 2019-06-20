// pages/creditLife/personalCredit/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 是否初始化成功
    isLinked: false,
    // 角色
    role: "",
    // 信用分
    creditScore: "0",
    // 信用等级
    creditRating: "",
    // 信用时间
    creditTime: "",
    // 百分比
    percentage: "",
    // 手机认证 未认证0 已认证 1
    phoneCertification: 1,
    // 实名认证
    nameCertification: "",
    // 征信认证
    creditCertification: "",
    // 资产证明
    assetsCertification: "",
    // 业绩认证
    achieveCertification: "",
    // 资质证明认证
    qualificationCertification: "",
    // 甲方评价认证（暂无）
    reviewCertification: "",
    // 班组规模
    teamNum: "",

  },
  // 展示手机号码
  openPhone: function() {
    wx.navigateTo({
      url: "/pages/creditLife/showPhone/index",
    })
  },
  // 实名认证
  onUpSmrz: function() {
    wx.navigateTo({
      url: '/pages/mine/certification/certification',
    })
  },
  //班组规模
  openTeam: function() {
    wx.navigateTo({
      url: '/pages/mine/team/team',
    })
  },
  // 打开项目经验认证
  openXmAchieve: function() {
    wx.navigateTo({
      url: '../xmAchieve/index',
    })
  },
  // 上传资质证书
  openAddZzzs: function() {
    wx.navigateTo({
      url: '../addZzzs/index',
    })
  },
  // 打开资产证明
  openAddZczm: function() {
    wx.navigateTo({
      url: '../addZczm/index',
    })
  },
  // 打开银行征信证明
  openAddYhzx: function() {
    wx.navigateTo({
      url: '../addYhzx/index',
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
  switchText: function(code) {
    let toText = "";
    switch (code) {
      case '100':
        toText = "审核中";
        break;
      case '101':
        toText = "审核失败";
        break;
      case '102':
        toText = "审核通过";
        break;
      case '103':
        toText = "已过期";
        break;
      case '104':
        toText = "未上传";
        break;
      default:
        break;
    }
    return toText;
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    wx.showLoading({
      title: '加载中',
    })
    let role = wx.getStorageSync('role') ? wx.getStorageSync('role') : 2;
    let that = this;
    let data = {};
    data.token = app.globalData.token;
    app.ajax.req('credit_api_controller/creditinfo', data, 'POST', function(res) {
      console.log("发包方江湖信用初始化加载=" + JSON.stringify(res));
      if (parseInt(res.errorCode) == 200) {
        let data = res.data;
        that.setData({
          creditScore: data.creditScore,
          creditRating: data.creditRating,
          creditTime: data.creditTime,
          percentage: data.percentage,
          phoneCertification: data.phoneCertification,
          nameCertification: data.nameCertification,
          creditCertification: data.creditCertification,
          creditCertification_text: that.switchText(data.creditCertification),
          assetsCertification: data.assetsCertification,
          assetsCertification_text: that.switchText(data.assetsCertification),
          achieveCertification: data.achieveCertification,
          qualificationCertification: data.qualificationCertification,
          reviewCertification: data.reviewCertification,
          teamNum: data.teamNum,
          role: role,
          isLinked: true
        })
        //实名认证
        that.setData({
          nameCertification_text: app.globalData.authentica
        })
        setTimeout(function() {
          wx.hideLoading();
        }, 500)
        console.log("加载成功");
      } else {
        console.log("保存失败");
      }
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