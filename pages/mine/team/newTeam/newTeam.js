// pages/mine/team/newTeam/newTeam.js
let app = getApp();
let util = require("../../../../utils/util.js");
let codeToTextArr = util.codeToTextArr;
let strToArr = util.strToArr;
let arrToStr = util.arrToStr;
import {
  $wuxSelect
} from '../../../vux/index';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    img: [],
    /* 所需工种(侧边栏) */
    showGongz: false,
    // 显示的文字
    consType_text: [],
    gongzNum: 3,
    // 侧边栏标题
    consType: "", // skey 字码
    consType_title: "工种",
    consType_list: [],
    //输入文字
    name: '',
    phone: '',
    //分组
    value1: '',
    title1: '',
    //班组类型
    banzuClass: [],
    id: -1
  },
  name: function(e) {
    console.log(e);
    this.setData({
      name: e.detail.value
    })
  },
  phone: function(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  //获取班组类型
  getTeamTypeList: function(callback) {
    let data = {};
    data.token = app.globalData.token;
    app.ajax.req('team_api_controller/getTeamTypeList', data, 'POST', function(res) {
      if (Number.parseInt(res.errorCode) === 200) {
        callback(res);
      }
    })
  },
  //选择班组
  switchRoles: function() {
    let that = this;
    that.getTeamTypeList(function(res) {
      //班组类型
      that.setData({
        banzuClass: res.data
      })
      let banzuClass_text = [];
      for (let i = 0; i < res.data.length; i++) {
        banzuClass_text.push(res.data[i].name);
      }
      $wuxSelect('#wux-select1').open({
        value: that.data.value1,
        options: banzuClass_text,
        onConfirm: (value, index, options) => {
          console.log('onConfirm', value, index, options)
          if (index !== -1) {
            that.setData({
              value1: value,
              title1: options[index],
            })
          }
        },
      })
    })
  },
  // 展开所需工种
  openGongz: function(e) {
    this.setData({
      showGongz: true,
    })
  },
  // 所需工种设置值
  showGongzArr: function(e) {
    let checkValue_text = e.detail.checkValue_text;
    let checkValue_code = e.detail.checkValue_code;
    console.log(checkValue_text + "||" + checkValue_code);
    this.setData({
      consType_text: strToArr(checkValue_text),
      consType: checkValue_code
    })
  },
  //新建班组成员
  teamAdd: function() {
    let that = this;
    let data = {};
    data.token = app.globalData.token;
    data.dutyName = that.data.name;
    data.consType = that.data.consType;
    data.dutyPhone = that.data.phone;
    data.headPortrait = that.data.img.length > 0 ? that.data.img.join(';') : '';
    let banzuClass = that.data.banzuClass;
    for (let i = 0; i < banzuClass.length; i++) {
      if (banzuClass[i].name == this.data.value1) {
        data.tId = banzuClass[i].t_id;
      }
    }
    data.id = that.data.id != -1 ? that.data.id : '';
    app.ajax.req('/team_api_controller/teamAdd', data, 'POST', function(res) {
      if (Number.parseInt(res.errorCode) === 200) {
        wx.showToast({
          title: '新建用户成功！',
          icon: 'none'
        })
        setTimeout(function() {
          wx.navigateBack();
        }, 1500)
      }
    })
  },
  //上传或修改头像
  settingTX: function() {
    let url = this.data.img.join(';');
    let countNumber = 1;
    let time = new Date();
    let time2 = util.formatTime(time);
    let fileName = "bgx/" + time2;
    let method = "settingTX";
    let data = 'url=' + url + '&countNumber=' + countNumber + '&fileName=' + fileName + '&method=' + method;
    console.log(data);
    wx.navigateTo({
      url: '../../../upload/upload?' + data
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    if (options.info) {
      //修改信息
      let info = JSON.parse(options.info);
      let arr = [];
      arr.push(info.head_portrait);
      this.setData({
        name: info.duty_name,
        phone: info.duty_phone,
        img: arr,
        value1: info.name,
        consType_text: info.cons_type,
        id: info.id
      })
     
    }
    app.onLoadData("consType", (data) => {
      that.setData({
        consType_list: data
      })
      console.log("工种数据", that.data.consType_list);
    });

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
    //图片赋值
    let uploadList = app.globalData.uploadList;
    if (uploadList) {
      if (uploadList.method == "settingTX") {
        that.setData({
          img: uploadList.upload
        })
        //全局初始化
        app.globalData.uploadList = [];
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