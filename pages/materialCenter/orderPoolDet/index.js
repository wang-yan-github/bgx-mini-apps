// pages/materialCenter/orderPoolDet/index.js
const materialList = require("../materialList/materialList.js").materialList;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShoucang: false,
    spImg: 'http://baogongxia1.oss-cn-shenzhen.aliyuncs.com/banner/index1.jpg',
    dataDetail: {},
  },
  // 收藏
  onShoucang: function () {
    this.setData({
      isShoucang: !this.data.isShoucang
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    let spid = options.spid;
    materialList.forEach((item) => {
      if (spid == item.sp_id) {
        console.log(JSON.stringify(item));
        _this.setData({
          dataDetail: item
        })
      }
    })
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})