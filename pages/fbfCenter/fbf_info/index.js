// pages/fbfCenter/information/index.js
var util = require("../../../utils/util.js");
var formatTime = util.formatTime;
// var parseTextCode = util.parseTextCode;
var strToArr = util.strToArr;
var arrToStr = util.arrToStr;
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 是否加载成功
    isLinked: false,
    // token
    token: "",
    img: ["/pages/icons/logo.png"],

    // 公司信息的显示隐藏
    show: false,
    // 姓名
    name: "",
    // 昵称
    nickname: "",
    // 电话
    phone: "",
    // 公司名称
    compName: "",
    compName_focus: false,
    // 公司区域
    region_code: "",
    // 公司详细地址
    compAddr: "",
    compAddr_focus: false,
    // 头像
    face_arr: [],
    faceUid_str: "",
    // 公司logo
    logo_arr: [],
    logoUid_str: "",
    // 营业执照图片
    license_arr: [], // 当前图片的地址数组
    licenseUid_str: "", // 需要传递给upload组件的uid
  },
  // 设置姓名
  onName: function(e) {
    this.setData({
      name: e.detail.value
    })
  },
  // 设置昵称
  onNickname: function(e) {
    this.setData({
      nickname: e.detail.value
    })
  },
  // 修改手机号
  onEditphone: function() {
    let currPhone = this.data.phone;
    wx.navigateTo({
      url: '/pages/fbfCenter/editPhone/index?phone=' + currPhone,
    })
  },
  // 设置公司名称
  onCompName: function(e) {
    // console.log(e.detail.value);
    this.setData({
      compName: e.detail.value
    })
  },
  // 设置公司区域
  onGetArea: function(e) {
    this.setData({
      region_code: e.detail.region_code
    })
  },
  // 设置公司详细地址
  onCompAddr: function(e) {
    // console.log(e.detail.value);
    this.setData({
      compAddr: e.detail.value
    })
  },

  // 保存
  onSave: function(e) {
    var that = this;
    var data = {};
    if (that.data.compName || that.data.region_code || that.data.compAddr || that.data.license_arr != 0) {

      if (!that.data.compName) {
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: '公司名称不能为空',
          success(res) {
            if (res.confirm) {
              console.log('用户点击确定')
            }
            that.setData({
              compName_focus: true
            })
          }
        })
        return false;
      } else {
        if (!that.data.region_code) {
          wx.showModal({
            title: '提示',
            showCancel: false,
            content: '公司区域不能为空',
            success(res) {
              if (res.confirm) {
                console.log('用户点击确定')
              }
            }
          })
          return false;
        }
        if (!that.data.compAddr) {
          wx.showModal({
            title: '提示',
            showCancel: false,
            content: '详细地址不能为空',
            success(res) {
              if (res.confirm) {
                console.log('用户点击确定')
              }
              that.setData({
                compAddr_focus: true
              })
            }
          })
          return false;
        }
        // 判断营业执照上传
        if (that.data.license_arr.length == 0) {
          wx.showModal({
            title: '提示',
            // cancelText: "暂不添加",
            content: "请上传真实营业执照，点击‘确定’继续添加，点击‘取消’可下次到个人中心继续添加公司信息",
            success(res) {
              if (res.confirm) {
                console.log('用户点击确定')
              } else if (res.cancel) {
                that.setData({ // 重置公司信息，收起公司信息
                  show: false,
                  compName: "",
                  region_code: "",
                  compAddr: "",
                  license_arr: []
                })
                console.log('用户点击取消')
              }
            }
          })
          return false;
        }
      }
    }
    data.token = app.globalData.token;
    data.userName = that.data.nickname;
    data.dutyName = that.data.name;
    data.name = that.data.compName;
    data.region = that.data.region_code;
    data.address = that.data.compAddr;
    data.dutyPhone = that.data.phone;
    data.headPortrait = that.data.faceUid_str;
    data.bizlicense = that.data.licenseUid_str;
    data.logo = that.data.logoUid_str;
    app.ajax.req('company_api_controller/bgxcompanyinfoadd', data, 'POST', function(res) {
      if (parseInt(res.errorCode) == 200) {
        wx.showToast({
          title: '保存成功',
          duration: 1500,
          icons: "success",
        })
        app.globalData.touxiang = that.data.faceUid_str ? that.data.faceUid_str:'/pages/icons/touxiang.png';
        app.globalData.perfectStatus = res.data.status;
        // 返回到上一级页面
        setTimeout(function() {
          wx.navigateBack();
        }, 1500)

      } else {
        console.log("提交失败");
      }
    })
  },
  // 收起公司信息
  onPullDown: function() {
    this.setData({
      show: !this.data.show
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const that = this;
    wx.showLoading({
      title: '加载中',
    })
    var data = {};
    data.token = app.globalData.token;
    app.ajax.req('company_api_controller/companyInfo', data, 'POST', function(res) {
      console.log("发包方完善信息onload=" + JSON.stringify(res));
      if (parseInt(res.errorCode) == 200) {
        var dataObj = res.data;
        for (let item in dataObj) {
          if (dataObj[item] == null || dataObj[item] == undefined) {
            dataObj[item] = "";
          }
        }
        console.log("地区code=" + dataObj.region);
        if (dataObj.name) {
          that.setData({
            show: true
          })
        }
        that.setData({
          region_code: dataObj.region,
          name: dataObj.dutyName,
          nickname: dataObj.userName,
          phone: dataObj.dutyPhone,
          compName: dataObj.name,
          compAddr: dataObj.address,
          face_arr: strToArr(dataObj.headPortrait),
          faceUid_str: dataObj.headPortrait,
          logo_arr: strToArr(dataObj.logo),
          logoUid_str: dataObj.logo,
          license_arr: dataObj.bizlicense,
          licenseUid_str: arrToStr(dataObj.bizlicense),
          isLinked: true,
        })
        setTimeout(function() {
          wx.hideLoading()
        }, 500);
      } else {
        console.log("提交失败");
      }
    })
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

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
  // 上传头像
  onUpFace: function(e) {
    let fileName = "fbf/" + formatTime(new Date());
    var faceUid_str = this.data.faceUid_str;
    this.onUpLoad(1, fileName, "onUpFace", faceUid_str);
  },
  // 上传logo
  onUpLogo: function() {
    var logoUid_str = this.data.logoUid_str;
    let fileName = "fbf/" + formatTime(new Date());
    this.onUpLoad(1, fileName, "onUpLogo", logoUid_str);
  },
  // 上传营业执照
  onUpLicense: function() {
    var licenseUid_str = this.data.licenseUid_str;
    let fileName = "fbf/" + formatTime(new Date());
    this.onUpLoad(9, fileName, "onUpLicense", licenseUid_str);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let that = this;
    var uploadList = app.globalData.uploadList;
    console.log("初始化onShow时uploadList=" + JSON.stringify(uploadList));
    var currImgs_url = [];
    var currImgs_uids_str = "";
    if (JSON.stringify(uploadList) != "{}") {
      currImgs_url = uploadList.upload;
      currImgs_uids_str = arrToStr(uploadList.upload);
      if (uploadList.method == "onUpFace") {
        that.setData({
          face_arr: currImgs_url,
          faceUid_str: currImgs_uids_str
        })
      } else if (uploadList.method == "onUpLogo") {
        that.setData({
          logo_arr: currImgs_url,
          logoUid_str: currImgs_uids_str
        })
      } else if (uploadList.method == "onUpLicense") {
        that.setData({
          license_arr: currImgs_url,
          licenseUid_str: currImgs_uids_str
        })
      }
      //初始化uploadList
      uploadList = [];
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    console.log("onHide监听页面隐藏");
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