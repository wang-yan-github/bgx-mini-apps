// pages/bgxCenter/fillInfo3/index.js
var util = require("../../../utils/util.js");
var getAreaText = util.getAreaText;
var strToArr = util.strToArr;
var arrToStr = util.arrToStr;
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 是否加载成功
    isLinked: false,
    // token
    token: "",
    type: 13,
    // 初始化表单展示变量
    name: "",
    startTime: [],
    endTime: [],
    money: "",
    region_code: "",
    content: "",
    // 工作图片
    workImgs_arr: [],
    workImgsUid_str: "",
    itemId: "",
    isNewAdd: "",
  },


  // 关闭一条业绩
  onClose: function(e) {
    var index = e.currentTarget.dataset.index;
    var yejiArr = this.data.yejiArr;

    yejiArr.splice(index, 1);
    this.setData({
      yejiArr: yejiArr,
      allLength: this.data.allLength - 1
    })
  },

  // 业绩收起
  onPullDown: function(e) {
    var index = e.currentTarget.dataset.index;
    var yejiArr = this.data.yejiArr;

    yejiArr[index].down = !yejiArr[index].down;
    this.setData({
      yejiArr: yejiArr
    })

    console.log(e.currentTarget.dataset.index);
  },

  // 判断空字符串
  isEmpty: function (obj) {
    if (typeof obj == "undefined" || obj == null || obj == "") {
      return true;
    } else {
      return false;
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const that = this;
    that.setData({
      token: app.globalData.token
    })
    var id = options.id;
    var isNewAdd = options.isNewAdd;
    console.log("xmyj=id=" + id + "||isNewAdd==" + isNewAdd);
    const addyj = options.addyj;
    // addyj = "1";
    if (addyj == "0") { // 新添加业绩
      console.log("添加业绩");
      that.setData({
        isLinked: true,
        name: "",
        startTime: [],
        endTime: [],
        money: "",
        region_code: "",
        content: "",
        workImgs_arr: [],
        isNewAdd: isNewAdd
      })
    } else { // 编辑当前业绩
      wx.showLoading({
        title: '加载中',
      })
      setTimeout(function () {
        wx.hideLoading()
      }, 500)
      const data = {};
      data.id = id;
      app.ajax.req('achieve_api_controller/achieveInfo', data, 'POST', function(res) {

        console.log("当前列表=" + JSON.stringify(res));
        console.log("接口返回的id=" + res.data.id);
        console.log("当前地址=" + getAreaText(res.data.address));
        if (parseInt(res.errorCode) == 200) {
          console.log("加载成功");
          that.setData({
            name: res.data.name,
            startTime: strToArr(res.data.startTime),
            endTime: strToArr(res.data.endTime),
            money: res.data.projectMoney,
            region_code: res.data.address,
            content: res.data.content,
            itemId: res.data.id,
            workImgs_arr: res.data.imgList,
            workImgsUid_str: arrToStr(res.data.imgList),
            isNewAdd: isNewAdd,
            isLinked: true,
          })

          setTimeout(function() {
            wx.hideLoading()
          }, 500)
        } else {
          console.log("加载失败");
        }
      })
    }

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    var uploadList = app.globalData.uploadList;
    console.log("初始化onShow时uploadList=" + JSON.stringify(uploadList));
    var currImgs_url = [];
    var currImgs_uids_str = "";
    if (JSON.stringify(uploadList) != "{}" && uploadList.upload.length > 0) {
      currImgs_url = uploadList.upload;
      currImgs_uids_str = arrToStr(uploadList.upload);
      console.log("currImgs_url=" + currImgs_url);
      console.log("currImgs_uids_str=" + currImgs_uids_str);
      that.setData({
        workImgs_arr: currImgs_url,
        workImgsUid_str: currImgs_uids_str
      })
    }
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
    app.globalData.uploadList = {};
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