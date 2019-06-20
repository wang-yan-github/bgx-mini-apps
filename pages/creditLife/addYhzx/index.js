var util = require("../../../utils/util.js");
var formatTime = util.formatTime;
var strToArr = util.strToArr;
var arrToStr = util.arrToStr;
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 角色
    role: 0,
    oldFiles: "",
    // 新上传的图
    img_default: "/pages/icons/yhzx_default.png",
    imgStr: "",
    isNewImgStr: "",
    imgStr_status: "",
    disabled: false,
  },
  switchText: function (code) {
    let toText = "";
    let _code = code + "";
    switch (_code) {
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
  // 上传文件通用方法
  onUpLoad: function (_countNumber, _fileName, _method, _uidStr) {
    // _countNumber 上传图片数量
    // _fileName 文件名
    // _method 标识方法
    // _uidStr 不带后缀的图
    let fileName = _fileName + formatTime(new Date());
    let url = "";
    if (_uidStr) {
      url = _uidStr.replace(/\,/g, ";");
    };
    let params = "countNumber=" + _countNumber + "&fileName=" + fileName + "&method=" + _method + "&url=" + url;
    console.log("上传附件图参数params=" + params);
    wx.navigateTo({
      url: '/pages/upload/upload?' + params
    })
  },
  // 上传银行征信
  onUpYhzx: function (e) {
    let role = this.data.role;
    let fileName = "";
    if (role == 2) {
      fileName = "bgx/" + formatTime(new Date());
    }
    else if (role == 3) {
      fileName = "lw/" + formatTime(new Date());
    }
    var imgStr = this.data.imgStr;
    this.onUpLoad(1, fileName, "onUpYhzx", imgStr);
  },
  // 提交上传
  onSubmit: function () {
    if (this.data.disabled) {
      return;
    }
    let that = this;
    let data = {};
    let imgStr = that.data.imgStr;
    data.token = app.globalData.token;
    data.imageUrl = that.data.imgStr;
    console.log("提交实名认证参数=" + JSON.stringify(data));
    app.ajax.req('credit_api_controller/addCreditProve', data, 'POST', function (res) {
      console.log("返回参数=" + JSON.stringify(res));
      if (parseInt(res.errorCode) == 200) {
        wx.showToast({
          title: '提交成功',
          icon: 'succes',
          duration: 1000,
          // mask: true
        })
        // 返回到上一级页面
        setTimeout(function () {
          wx.navigateBack();
        }, 1000)
      } else {
        console.log("提交失败");
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    let that = this;
    let role = wx.getStorageSync('role') ? wx.getStorageSync('role') : 2;
    var data = {};
    data.token = app.globalData.token;
    app.ajax.req('credit_api_controller/creditProve', data, 'GET', function (res) {
      console.log("银行征信onload=" + JSON.stringify(res));
      if (parseInt(res.errorCode) == 200) {
        wx.hideLoading();
        that.setData({
          imgStr: res.data.creditImage,
          imgStr_status: that.switchText(res.data.creditCertification),
          role,
        })
      } else {
        console.log("提交失败");
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
    const that = this;
    // 图片加载
    var uploadList = app.globalData.uploadList;
    console.log("初始化onShow时uploadList=" + JSON.stringify(uploadList));
    var currImgs_uids_str = "";
    if (JSON.stringify(uploadList) != "{}") {
      currImgs_uids_str = arrToStr(uploadList.upload);
      if (uploadList.method == "onUpYhzx") {
        that.setData({
          imgStr: currImgs_uids_str,
          isNewImgStr: currImgs_uids_str,
        })
      }
      //初始化
      app.globalData.uploadList = {};
    }
    if (!currImgs_uids_str) {
      that.setData({
        disabled: true,
      })
    }
    else {
      that.setData({
        disabled: false,
      })
    }

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