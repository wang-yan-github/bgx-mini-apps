// pages/creditLife/xmAchieve/index.js
var util = require("../../../utils/util.js");
var getAreaText = util.getAreaText;
var codeToTextArr = util.codeToTextArr;
var strToArr = util.strToArr;
var arrToStr = util.arrToStr;
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 当前项目
    currItem: 0,
    // 业绩列表
    dataList: [],
  },
  openCurrItem: function (e) {
    var index = e.currentTarget.dataset.index;
    console.log("index==" + index);
    var dataList = this.data.dataList;
    dataList[index].checked = !dataList[index].checked;
    console.log("dataList-checked==" + dataList[index].checked );
    this.setData({
      dataList: dataList,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    wx.showLoading({
      title: '加载中',
    })
    let that = this;
    let data = {};
    data.token = app.globalData.token;
    data.offset = 1;
    data.limit = 10;
    app.ajax.req('achieve_api_controller/ahieveList', data, 'GET', function (res) {
      console.log("业绩查询列表=" + JSON.stringify(res));
      if (parseInt(res.errorCode) == 200) {
        console.log("查询成功");
        let dataList = res.data.list;
        if (dataList.length > 0) {
          for (let i = 0; i < dataList.length; i++) {
            dataList[i].checked = false;
            dataList[i].address = getAreaText(dataList[i].address);
          }
          dataList[0].checked = true;
        }
        console.log("更改之后的list=" + JSON.stringify(dataList));
        that.setData({
          dataList: dataList
        })
        
        setTimeout(function () {
          wx.hideLoading()
        }, 500)
        // 返回到上一级页面
      } else {
        console.log("查询失败");
      }
    })
  },
  // 添加项目业绩
  onAddXmyj: function (e) {
    wx.navigateTo({
      url: '/pages/bgxCenter/editXmyj/index?addyj=0&isNewAdd=0',
    })
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