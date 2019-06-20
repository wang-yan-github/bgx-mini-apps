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
    // 已上传的图
    creditImage: [],
    oldFiles_arr: [],
    // 新上传的图
    newFiles_arr: [],
    newFilesUids_str: "",
    disabled: false,
  },
  switchText: function(code) {
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
  onUpLoad: function(_countNumber, _fileName, _method, _uidStr) {
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
  // 上传新的资产证明
  onUpZczm: function(e) {
    let role = this.data.role;
    let fileName = "";
    if (role == 2) {
      fileName = "bgx/" + formatTime(new Date());
    } else if (role == 3) {
      fileName = "lw/" + formatTime(new Date());
    }
    var newFilesUids_str = this.data.newFilesUids_str;
    this.onUpLoad(9, fileName, "onUpZczm", newFilesUids_str);
  },
  // 提交上传
  onSubmit: function() {
    if (this.data.disabled) {
      return;
    }
    let that = this;
    if (that.data.creditImage && (that.data.creditImage.length + that.data.newFiles_arr.length) > 9) {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '最多只能上传9张图片',
      })
      return false;
    }
    let data = {};
    data.token = app.globalData.token;
    data.imageUrl = that.data.newFilesUids_str;
    console.log("提交实名认证参数=" + JSON.stringify(data));
    app.ajax.req('credit_api_controller/addAssetsProve', data, 'GET', function(res) {
      console.log("返回参数=" + JSON.stringify(res));
      if (parseInt(res.errorCode) == 200) {
        wx.showToast({
          title: '提交成功',
          icon: 'none',
          duration: 1000
        })
        that.onShow();
        that.setData({
          newFiles_arr: [],
          newFilesUids_str: "",
          disabled: !that.data.disabled,
        })
        console.log("提交成功");
      } else {
        console.log("提交失败");
      }
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
    const that = this;
    // 图片加载
    var uploadList = app.globalData.uploadList;
    console.log("初始化onShow时uploadList=" + JSON.stringify(uploadList));
    var currImgs_url = [];
    var currImgs_uids_str = "";
    if (JSON.stringify(uploadList) != "{}") {
      currImgs_url = uploadList.upload;
      currImgs_uids_str = arrToStr(uploadList.upload);
      if (uploadList.method == "onUpZczm") {
        that.setData({
          newFiles_arr: currImgs_url,
          newFilesUids_str: currImgs_uids_str
        })
      }
      //初始化
      app.globalData.uploadList = {};
    }
    if (!that.data.newFilesUids_str) {
      that.setData({
        disabled: true,
      })
    } else {
      that.setData({
        disabled: false,
      })
    }

    let role = wx.getStorageSync('role') ? wx.getStorageSync('role') : 2;
    var data = {};
    data.token = app.globalData.token;
    app.ajax.req('credit_api_controller/assetsProve', data, 'GET', function(res) {
      console.log("资质证明onload=" + JSON.stringify(res));
      if (parseInt(res.errorCode) == 200) {
        wx.hideLoading();
        let creditImage = res.data.creditImage;
        let oldFiles_arr = [];
        let oldFiles_status = [];
        if (creditImage) {
          for (let i = 0; i < creditImage.length; i++) {
            oldFiles_arr.push(creditImage[i].creditImage);
            creditImage[i].creditCertification = that.switchText(creditImage[i].creditCertification);
          }
        }
        that.setData({
          creditImage,
          oldFiles_arr,
          role,
        })
        console.log("资产证明", creditImage);
      } else {
        console.log("提交失败");
      }
    })
  },

  // 已有图片预览
  onPreviewOldImg: function(e) {
    console.log(e.currentTarget.dataset.index);
    var index = e.currentTarget.dataset.index;
    var imgArr = this.data.oldFiles_arr;
    wx.previewImage({
      current: imgArr[index],
      urls: imgArr,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  // 新添加图片预览
  onPreviewNewImg: function(e) {
    console.log(e.currentTarget.dataset.index);
    var index = e.currentTarget.dataset.index;
    var imgArr = this.data.newFiles_arr;
    wx.previewImage({
      current: imgArr[index],
      urls: imgArr,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
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