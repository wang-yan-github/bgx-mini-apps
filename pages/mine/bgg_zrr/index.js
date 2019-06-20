// pages/bggCenter/bgg_xmjl/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listData: [{
        img: "../../icons/bgg1.png",
        text: "安全指标"
      },
      {
        img: "../../icons/bgg2.png",
        text: "安全汇报"
      },
      {
        img: "../../icons/bgg3.png",
        text: "安全资料上传"
      },
      {
        img: "../../icons/bgg4.png",
        text: "官方计划"
      },
      {
        img: "../../icons/bgg5.png",
        text: "添加周计划"
      },
      {
        img: "../../icons/bgg6.png",
        text: "更新周计划"
      },
      {
        img: "../../icons/bgg7.png",
        text: "历史数据"
      },

    ]
  },

  onThetap: function(e) {
    var index = e.currentTarget.dataset.index;
    console.log(index);
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