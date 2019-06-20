// pages/bgxCenter/fillInfo2/index.js
var app = getApp();
var util = require("../../../utils/util.js");
var getAreaText = util.getAreaText;
var formatTime = util.formatTime;
var strToArr = util.strToArr;
var arrToStr = util.arrToStr;
var codeToTextArr = util.codeToTextArr;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 是否加载成功
    isLinked: false,
    // token
    token: "",
    // 团队人数
    teamNumber: '',
    team_focus: false,
    // 从业时间
    workTime: "",
    workTime_focus: false,
    // 可施工地
    region_code: "",
    // 资质证书
    certificate_arr: [],
    certificateUid_str: "",
    fileList: [],
    /*   工程类别(侧边栏)  */
    showGclb: false,
    technicalType_text: [],
    gclbNum: 3,
    // 侧边栏标题
    technicalType: "", // skey字码
    technicalType_title: "工程类别",
    technicalType_list: [],

  },
  // 设置团队人数
  onTeamNumber: function(e) {
    let value1 = e.detail.value;
    let len = e.detail.value.length;
    if (len > 1 && value1.startsWith("0")){
      this.setData({
        teamNumber: value1.replace(0, 1, "")
      })
    }else{
      this.setData({
        teamNumber: value1
      })
    }
  },
  // 设置团队人数
  onWorkTime: function(e) {
    this.setData({
      workTime: e.detail.value
    })
  },
  // 设置户籍
  onGetArea: function(e) {
    this.setData({
      region_code: e.detail.region_code
    })
  },

  // 展开工程类型
  openGclb: function(e) {
    this.setData({
      showGclb: true,
    })
  },
  // 工程类型设置值
  showGclbArr: function(e) {
    let checkValue_text = e.detail.checkValue_text;
    let checkValue_code = e.detail.checkValue_code;
    this.setData({
      technicalType_text: strToArr(checkValue_text),
      technicalType: checkValue_code
    })
  },
  // 个人信息保存
  onSave: function(e) {
    var that = this;
    // 提交保存数据到后台
    const data = {};
    // 判断必填字段是否为空
    if (!that.data.teamNumber || that.data.teamNumber <= 0) {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '团队人数不能为空或小于0',
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
          that.setData({
            team_focus: true
          })
        }
      })
      return false;
    }

    if (!that.data.workTime || that.data.workTime <= 0) {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '从业时间不能为空或小于0',
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
          that.setData({
            workTime_focus: true
          })
        }
      })
      return false;
    }

    if (!that.data.technicalType) {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '可承接项目类型不能为空',
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      })
      return false;
    }

    if (!that.data.region_code) {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '可施工地不能为空',
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      })
      return false;
    }
    data.token = that.data.token;
    data.teamNumber = that.data.teamNumber;
    data.workTime = that.data.workTime;
    data.technicalType = that.data.technicalType;
    data.workAddress = that.data.region_code;
    data.certificate = that.data.certificateUid_str;


    console.log(JSON.stringify(data));

    app.ajax.req('workerproject_api_controller/bgxpeopleinfoadd', data, 'POST', function(res) {
      console.log(res.errorCode);
      if (parseInt(res.errorCode) == 200) {
        console.log("保存成功");
        wx.showToast({
          title: '保存成功',
          icon: 'success',
          duration: 1500
        })
        // 返回到上一级页面
        setTimeout(function() {
          wx.navigateBack();
        }, 1500)
      } else {
        console.log("保存失败");
      }
    })
    // 返回到上一级页面
    //wx.navigateBack();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    
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
  // 上传附件
  onUpCertificate: function(e) {
    // let fileName = "bgx/" + formatTime(new Date());
    // var certificateUid_str = this.data.certificateUid_str;
    // this.onUpLoad(9, fileName, "onUpCertificate", certificateUid_str);
    wx.navigateTo({
      url: '/pages/creditLife/addZzzs/index',
    })
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
      token: app.globalData.token
    })
    const data = {};
    data.token = app.globalData.token;
    app.ajax.req('workerproject_api_controller/getWokerInfo', data, 'POST', function (res) {

      if (parseInt(res.errorCode) == 200) {
        var wokerInfo = res.data.wokerInfo;
        console.log("编辑业务信息初始化数据=" + JSON.stringify(res));

        // 初始化工程类别文字解析
        app.onLoadData("technicalType", (data) => {
          that.setData({
            technicalType_list: data,
            technicalType_text: codeToTextArr(data, strToArr(wokerInfo.technicalType))
          })
        });
        console.log("certificateUid_str" + arrToStr(wokerInfo.certificate));

        that.setData({
          teamNumber: wokerInfo.teamNumber,
          workTime: wokerInfo.workTime,
          region_code: wokerInfo.workAddress,
          technicalType: wokerInfo.technicalType,
          certificate_arr: wokerInfo.certificate,
          certificateUid_str: arrToStr(wokerInfo.certificate),
          isLinked: true,
        })
        setTimeout(function () {
          wx.hideLoading()
        }, 1000)
      } else {
        console.log("加载失败");
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

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