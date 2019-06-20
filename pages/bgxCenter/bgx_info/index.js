// pages/bgxCenter/fillInfo1/index.js
var util = require("../../../utils/util.js");
var getAreaText = util.getAreaText;
var strToArr = util.strToArr;
var arrToStr = util.arrToStr;
var codeToTextArr = util.codeToTextArr;
import {
  $wuxSelect
} from '../../vux/index';
import {
  $wuxCalendar
} from '../../vux/index';

var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLinked: false,
    // token
    token: "",
    // 默认头像
    defaultFace: "/pages/icons/touxiang.png",
    face: "",
    // 个人信息
    phone: "",
    personInfo: {},
    nation: "",
    education: "",
    // 是否填写户籍
    isFillGrxx: false,
    // 业务信息
    wokerInfo: {},
    // 可承接项目类型
    technicalType: "",
    technicalType_skey: "technicalType",
    // 项目业绩列表
    achieveInfo: [],
    // 资质证书
    certificate: [],

  },

  // 个人信息
  openGrxx: function(e) {
    wx.navigateTo({
      url: '../editGrxx/index'
    })
  },

  // 业务信息
  openYwxx: function(e) {
    // 判断个人信息是否已填写
    if (!this.data.isFillGrxx) {
      wx.showModal({
        title: '提示',
        confirmText: "前往",
        content: '您的个人信息还未填写完成，请先前往个人信息完善',
        success(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../editGrxx/index'
            })
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    } else {
      wx.navigateTo({
        url: '../editYwxx/index'
      })
    }
  },

  // 添加项目业绩
  onAddXmyj: function(e) {
    wx.navigateTo({
      url: '../editXmyj/index?addyj=0&isNewAdd=0',
    })
  },

  // 修改项目业绩
  openXmyj: function(e) {
    var id = e.currentTarget.dataset.id;
    console.log("id==" + id);
    wx.navigateTo({
      url: '../editXmyj/index?addyj=1&isNewAdd=1&id=' + id
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

  isEmpty: function(obj) {
    if (typeof obj == "undefined" || obj == null || obj == "" || obj == 0 || obj.length == 0) {
      return true;
    } else {
      return false;
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    wx.showLoading({
      title: '加载中',
    })
    const that = this;
    that.setData({
      token: app.globalData.token,
    })
    let data = {};
    data.token = app.globalData.token;
    console.log("token==" + app.globalData.token);
    app.ajax.req('workerproject_api_controller/getWokerInfo', data, 'POST', function(res) {
      console.log("初始化数据=" + JSON.stringify(res));

      if (parseInt(res.errorCode) == 200) {
        console.log("加载成功");
        let personInfo_temp = res.data.personInfo;
        let wokerInfo_temp = res.data.wokerInfo;
        let achieveInfo_temp = res.data.achieveInfo;

        // 是否填写个人信息
        if (personInfo_temp.residence) {
          that.setData({
            isFillGrxx: true
          })
        }

        // 头像
        if (!res.data.head_portrait) {
          that.setData({
            face: that.data.defaultFace
          })
          //设置成全局
          app.globalData.touxiang = that.data.defaultFace;
        } else {
          that.setData({
            face: res.data.head_portrait
          })
          //设置成全局
          app.globalData.touxiang = res.data.head_portrait;
        }
        // 户籍
        personInfo_temp.residence = getAreaText(personInfo_temp.residence);
        // 可施工地
        wokerInfo_temp.workAddress = getAreaText(wokerInfo_temp.workAddress);
        // 民族
        app.onLoadData("nation", (data) => {
          let arr = codeToTextArr(data, strToArr(personInfo_temp.nation));
          that.setData({
            nation: arrToStr(arr)
          })
        })
        // 学历
        app.onLoadData("education", (data) => {
          let arr = codeToTextArr(data, strToArr(personInfo_temp.education));
          that.setData({
            education: arrToStr(arr)
          })
        });
        // 可承接项目类型
        app.onLoadData("technicalType", (data) => {
          let arr = codeToTextArr(data, strToArr(wokerInfo_temp.technicalType));
          that.setData({
            technicalType: arrToStr(arr)
          })
        });

        that.setData({
          personInfo: personInfo_temp,
          wokerInfo: wokerInfo_temp,
          certificate: wokerInfo_temp.certificate,
          achieveInfo: achieveInfo_temp,
          isLinked: true,
        })

        setTimeout(function() {
          wx.hideLoading()
        }, 500);
      } else {
        console.log("加载失败");
      }
    })
  },
  // 头像预览
  onPrevFace: function(e) {
    var face = this.data.face;
    console.log("face=" + face);
    if (face) {
      wx.previewImage({
        current: face,
        urls: strToArr(face),
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
    }
  },
  // 资质证书预览
  onPrevCertificate: function(e) {
    console.log(e.currentTarget.dataset.index);
    var index = e.currentTarget.dataset.index;
    var imgArr = this.data.certificate;
    wx.previewImage({
      current: imgArr[index],
      urls: imgArr,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  // 修改手机号
  onEditphone: function() {
    let currPhone = this.data.personInfo.phone;
    wx.navigateTo({
      url: '/pages/fbfCenter/editPhone/index?phone=' + currPhone,
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