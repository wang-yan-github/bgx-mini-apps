// pages/mine/setting/certification/certification.js
let util = require("../../../utils/util.js");
let app = getApp();
/***
 * 判断用户滑动
 * 左滑还是右滑
 */
const getTouchData = (endX, endY, startX, startY) => {
  let turn = "";
  if (endX - startX > 50 && Math.abs(endY - startY) < 50) { //右滑
    turn = "right";
  } else if (endX - startX < -50 && Math.abs(endY - startY) < 50) { //左滑
    turn = "left";
  }
  return turn;
}
Page({
  /**
   * 页面的初始数据
   */
  data: {
    touchStart: {
      x: 0,
      y: 0
    },
    touchEnd: {
      x: 0,
      y: 0
    },
    turn: 'right',
    marLeft: 0,
    fileList: [],
    uploadHead: "",
    uploadFront: "",
    uploadReverse: "",
    shenheInfo: "",
    shenheDisabled: false,
    //button
    btnDisabled: false,
    //按钮提交锁定
    subDis: false
  },
  //上传头像
  uploadHead1: function() {
    let that = this;
    if (that.data.btnDisabled) {
      return false;
    }
    let method = "uploadHead";
    let countNumber = 1;
    let time = util.formatTime1(new Date());
    let fileName = "idcard/" + time;
    let url = that.data.uploadHead;
    wx.navigateTo({
      url: "../../upload/upload?method=" + method + "&countNumber=" + countNumber + "&fileName=" + fileName + "&url=" + url
    })
  },
  //上传身份证正面
  uploadFront1: function() {
    if (this.data.btnDisabled) {
      return false;
    }
    let method = "uploadFront";
    let countNumber = 1;
    let time = util.formatTime(new Date());
    let fileName = "idcard/" + time;
    let url = this.data.uploadFront;
    wx.navigateTo({
      url: "../../upload/upload?method=" + method + "&countNumber=" + countNumber + "&fileName=" + fileName + "&url=" + url
    })
  },
  //上传身份证反面
  uploadReverse1: function() {
    if (this.data.btnDisabled) {
      return false;
    }
    let method = "uploadReverse";
    let countNumber = 1;
    let time = util.formatTime(new Date());
    let fileName = "idcard/" + time;
    let url = this.data.uploadReverse;
    wx.navigateTo({
      url: "../../upload/upload?method=" + method + "&countNumber=" + countNumber + "&fileName=" + fileName + "&url=" + url
    })
  },
  //提交
  submit: function() {
    let that = this;
    if (that.data.subDis) {
      wx.showToast({
        title: '操作过于繁忙',
        icon: 'none'
      })
      return false;
    }
    if (!this.data.uploadHead) {
      wx.showToast({
        title: '请上传头像',
        icon: 'none'
      })
      return false;
    }
    if (!this.data.uploadFront) {
      wx.showToast({
        title: '请上传身份证正面',
        icon: 'none'
      })
      return false;
    }
    if (!this.data.uploadReverse) {
      wx.showToast({
        title: '请上传身份证反面',
        icon: 'none'
      })
      return false;
    }
    let data = {};
    data.token = app.globalData.token;
    data.pic1 = this.data.uploadHead;
    data.pic2 = this.data.uploadFront;
    data.pic3 = this.data.uploadReverse;
    //锁定按钮
    that.setData({
      subDis: true
    })
    wx.showLoading({
      title: '上传中'
    })
    app.ajax.req('credit_api_controller/realNameAuthentica', data, 'POST', function(e) {
      if (Number.parseInt(e.errorCode) === 200) {
        console.log("提交返回得结果", e);
        that.setData({
          shenheInfo: e.data.Authentica,
          shenheDisabled: true
        })
        let status = e.data.Msg;
        if (status == 101) {
          that.setData({
            btnDisabled: false,
            shenheInfo: '审核未通过,请上传清晰图片',
            shenheDisabled: true
          })
        } else if (status == 102) {
          that.setData({
            btnDisabled: true,
            shenheInfo: '审核通过',
            shenheDisabled: true
          })
          //全局改变状态
          app.globalData.authentica = 1;
        } else if (status == 103) {
          that.setData({
            btnDisabled: false,
            shenheInfo: '证件已过期',
            shenheDisabled: true
          })
        } else {
          that.setData({
            btnDisabled: false,
            shenheDisabled: false
          })
        }
      }
      wx.hideLoading();
      //解锁
      that.setData({
        subDis: false
      })
    })
  },
  //展示信息
  infoShow: function() {
    let that = this;
    let data = {};
    data.token = app.globalData.token;
    wx.showLoading({
      title: '加载中',
    })
    app.ajax.req('credit_api_controller/authenticaInfo', data, 'POST', function(res) {
      if (Number.parseInt(res.errorCode) === 200) {
        console.log(res);
        let status = res.data.status;
        if (status == 101) {
          that.setData({
            btnDisabled: false,
            shenheInfo: '审核未通过,请上传清晰图片',
            shenheDisabled: true
          })
        } else if (status == 102) {
          that.setData({
            btnDisabled: true,
            shenheInfo: '审核通过',
            shenheDisabled: true
          })
          //全局改变状态
          app.globalData.authentica = 1;
        } else if (status == 103) {
          that.setData({
            btnDisabled: false,
            shenheInfo: '证件已过期',
            shenheDisabled: true
          })
        } else {
          that.setData({
            btnDisabled: false,
            shenheDisabled: false
          })
        }
        that.setData({
          uploadHead: res.data.picture ? res.data.picture : "",
          uploadFront: res.data.idCardFront ? res.data.idCardFront : "",
          uploadReverse: res.data.idCardBack ? res.data.idCardBack : ""
        })
      }
      wx.hideLoading();
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.infoShow();
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
    let that = this;
    if (app.globalData.uploadList != 0) {
      console.log("返回的值", app.globalData.uploadList.method);
      //上传身份证前面
      if (app.globalData.uploadList.method == "uploadFront") {
        let uploadFront = app.globalData.uploadList.upload;
        if (uploadFront.length > 0) {
          that.setData({
            uploadFront: uploadFront
          })
        } else {
          that.setData({
            uploadFront: ""
          })
        }
        console.log("设置的值", that.data.uploadFront);
      } else if (app.globalData.uploadList.method == "uploadReverse") {
        let uploadReverse = app.globalData.uploadList.upload;
        if (uploadReverse.length > 0) {
          that.setData({
            uploadReverse: uploadReverse
          })
        } else {
          that.setData({
            uploadReverse: ""
          })
        }
      } else if (app.globalData.uploadList.method == "uploadHead") {
        let uploadHead = app.globalData.uploadList.upload;
        if (uploadHead.length > 0) {
          that.setData({
            uploadHead: uploadHead
          })
        } else {
          that.setData({
            uploadHead: ""
          })
        }
      }
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