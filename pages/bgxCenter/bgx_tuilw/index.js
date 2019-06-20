var util = require("../../../utils/util.js");
var strToArr = util.strToArr;
var arrToStr = util.arrToStr;
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    /*   所需工种(侧边栏)  */
    showGongz: false,
    // 显示的文字
    consType_text: "",
    consType_arr: [],
    gongzNum: 3,
    // 侧边栏标题
    consType: "", // skey 字码
    consType_title: "工种",
    consType_skey: "consType",
    consType_list: [],

  },

  // 展开所需工种
  openGongz: function (e) {
    let _this = this;
    app.onLoadData("consType", function (data) {
      _this.setData({
        consType_list: data,
        showGongz: true,
      })
    });
  },
  // 所需工种设置值
  showGongzArr: function (e) {
    let checkValue_text = e.detail.checkValue_text;
    let checkValue_code = e.detail.checkValue_code;
    let checkValue_text_arr = strToArr(checkValue_text);
    console.log(checkValue_text + "||" + checkValue_code + "||" + checkValue_text_arr);
    this.setData({
      consType_arr: checkValue_text_arr,
      consType_text: checkValue_text,
      consType: checkValue_code
    })
  },

  // 删除某工种
  onRemove: function(e) {
    var gongzVal = this.data.gongzVal;
    var index = e.currentTarget.dataset.index;
    gongzVal.splice(index, 1);

    // 重置gongzList
    var gongzList = this.data.gongzList;
    gongzList.forEach(item1 => {
      item1.checked = false;
      gongzVal.forEach(item2 => {
        if (item1.name == item2) {
          item1.checked = true
        }
      })
    })

    this.setData({
      gongzVal: gongzVal,
      gongzList: gongzList
    })
  },
  //删除工种
  gongzhong_close: function(e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    that.data.gongzhong.splice(index, 1);
    that.setData({
      gongzhong: that.data.gongzhong,
      gongzhong_data: that.data.gongzhong
    })
  },
  //工种类别
  bindPickerChange1: function(e) {
    //记录下标
    this.setData({
      gzClass_index: e.detail.value
    })
    if (this.data.gongzhong_data.length < 3) {
      if (this.data.gzClass[e.detail.value] == '请选择') {
        wx.showToast({
          title: '请选择有效值',
          icon: 'none'
        })
        return;
      }
      if (this.data.gongzhong_data.indexOf(this.data.gzClass[e.detail.value]) == -1) {
        this.data.gongzhong_data.push(this.data.gzClass[e.detail.value]);
        this.setData({
          gongzhong: this.data.gongzhong_data
        })
      } else {
        wx.showToast({
          title: '不要重复选择',
          icon: 'none'
        })
      }

    } else {
      wx.showToast({
        title: '工种限定为三个！',
        icon: 'none'
      })
    }
  },

  tuiLW: function() {
    var that = this;
    var data = {};
    data.token = app.globalData.token;
    data.offset = 1;
    data.limit = 3;
    data.w_pId = that.data.wpid;
    console.log("包工侠推劳务接口参数= " + JSON.stringify(data));
    app.ajax.req('workerproject_api_controller/workerPushWor', data, 'POST', function(res) {
      console.log("包工侠推劳务接口返回参数=" + JSON.stringify(res));
      if (parseInt(res.errorCode) === 200) {
        wx.showToast({
          title: res.errorDesc,
          icon: 'none',
          duration: 2000
        })
        // 返回到上一级页面
        setTimeout(function () {
          wx.navigateBack();
        }, 2500)
      }
    })
  },
  onSubmit: function() {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    var data = {};
    data.token = app.globalData.token;
    data.cons_type = that.data.consType;
    data.w_pid = that.data.wpid;
    console.log("包工侠提交工种参数=" + JSON.stringify(data));
    app.ajax.req('workerproject_api_controller/submitCons', data, 'GET', function(res) {
      wx.hideLoading();
      if (parseInt(res.errorCode) === 200) {
        wx.showToast({
          title: '提交成功,正在给你匹配劳务',
          icon: 'none',
        })
        that.tuiLW();
      } else {
        wx.showToast({
          title: res.errorDesc,
          icon: 'none'
        })
      }
    })
  },
  //删除工种数据
  gzData_close: function(e) {
    var that = this;
    if (that.data.infoDisabled == true) {
      wx.showToast({
        title: '控件已禁用',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    var index = e.currentTarget.dataset.index;
    that.data.gzData.splice(index, 1);
    that.setData({
      gzData: that.data.gzData
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // wx.showLoading({
    //   title: '加载中',
    // })
    var wpid = options.wpid;
    var that = this;
    that.setData({
      wpid: wpid,
      gzClass: app.globalData.gzData
    })
    var data = {};
    data.token = app.globalData.token;
    data.w_pid = wpid;
    // app.ajax.req('workerproject_api_controller/lookCons', data, 'GET', function(res) {
    //   wx.hideLoading();
    //   if (parseInt(res.errorCode) === 200) {
    //     if (isCons) {
    //       var arr = [];
    //       for (var i = 0; i < res.data.list.length; i++) {
    //         arr.push(res.data.list[i].consType);
    //       }
    //       that.setData({
    //         gzData: arr,
    //       })
    //     }
    //   }
    // })
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