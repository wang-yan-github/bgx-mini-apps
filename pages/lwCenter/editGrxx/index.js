// pages/bgxCenter/fillInfo1/index.js
var util = require("../../../utils/util.js");
var getAreaText = util.getAreaText;
var formatTime = util.formatTime;
var strToArr = util.strToArr;
var arrToStr = util.arrToStr;
var codeToTextArr = util.codeToTextArr;
import {
  $wuxSelect
} from '../../vux/index';
import {
  $wuxCalendar
} from '../../vux/index';

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
    // 姓名
    name: "",
    name_focus: false,
    // 昵称
    nickname: "",
    // 性别
    sex: "",
    sexVal: "",
    // 出身日期
    birthday: [],
    // 民族
    nation: "", // 焦点默认值
    nationVal: "", // 文字
    nation_code: "", // skey编码
    nation_list: [], // 列表
    // 选择学历
    eduVal: "", // 焦点默认值
    education: "", // 文字
    education_code: "", // skey编码
    education_list: [], // 列表
    // 户籍
    region_code: "",
    // 头像
    face_arr: [],
    faceUid_str: "",
  },

  isParams: function(str) {
    if (str.indexOf("?") != -1) {
      str = str.substring(0, str.indexOf("?"))
    }
    return str;
  },

  // 设置姓名
  onName: function(e) {
    // console.log(e.detail.value);
    this.setData({
      name: e.detail.value
    })
  },
  // 设置昵称
  onNickname: function(e) {
    // console.log(e.detail.value);
    this.setData({
      nickname: e.detail.value
    })
  },

  // 选择性别
  openSex() {
    $wuxSelect('#wux-select-sex').open({
      // value: this.data.sexVal,
      options: [
        '男',
        '女'
      ],
      onConfirm: (value, index, options) => {
        // console.log('onConfirm', value, index, options)
        if (index !== -1) {
          this.setData({
            sex: options[index],
          })
        }
      },
    })
  },
  // 选择出身年月
  openCalendar: function() {
    $wuxCalendar().open({
      value: this.data.birthday,
      onChange: (values, displayValues) => {
        // console.log('onChange', values, displayValues)
        this.setData({
          birthday: displayValues
        })
      }
    })
  },
  // 选择民族
  openNation: function(e) {
    $wuxSelect('#wux-select-nation').open({
      value: this.data.nationVal,
      options: this.repValue(this.data.nation_list),
      onConfirm: (value, index, options) => {
        console.log('民族', value, index, options)
        if (index !== -1) {
          this.setData({
            nationVal: value,
            nation: options[index].title,
            nation_code: options[index].value
          })
        }
      },
    })
  },

  // select组件需要将name/skey转化成title/value
  repValue: function(arr) {
    var str = JSON.stringify(arr);
    var str2 = str.replace(new RegExp("name", "g"), "title");
    var str3 = str2.replace(new RegExp("skey", "g"), "value");
    var newarr = JSON.parse(str3);
    // console.log(newarr);
    return newarr;
  },
  openEdu(e) { // 选择学历
    $wuxSelect('#wux-select-edu').open({
      value: this.data.eduVal,
      options: this.repValue(this.data.education_list),
      onConfirm: (value, index, options) => {
        console.log('onConfirm学历', value, index, options)
        if (index !== -1) {
          this.setData({
            eduVal: value,
            education: options[index].title,
            education_code: options[index].value,
          })
        }
      },
    })
  },

  // 设置户籍
  onGetArea: function(e) {
    this.setData({
      region_code: e.detail.region_code
    })
  },

  isNull: function(obj) {
    if (obj == "null") {
      obj = "";
    }
    return obj;
  },
  // 个人信息保存
  onSave: function(e) {
    var that = this;
    // 提交保存数据到后台
    const data = {};
    // that.setData({
    //   token: app.globalData.token
    // })
    // 对必填字段进行判断
    if (!that.data.name) {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '名字不能为空',
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
          that.setData({
            name_focus: true
          })
        }
      })
      return false;
    }
    if (!that.data.sex) {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '性别不能为空，请选择您的性别',
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
        content: '户籍不能为空，请选择您的户籍',
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      })
      return false;
    }
    let headPortrait = "";
    // if (that.data.fileList) {
    //   headPortrait = that.data.fileList.upload[0].uid;
    // }
    data.token = app.globalData.token;
    data.headPortrait = that.data.faceUid_str;
    data.dutyName = that.data.name;
    data.nickName = that.data.nickname;
    data.sex = that.data.sex;
    data.birthday = arrToStr(that.data.birthday);
    data.nation = that.data.nation_code;
    data.education = that.data.education_code;
    data.residence = that.data.region_code;

    console.log("保存所传参数=" + JSON.stringify(data));

    app.ajax.req('workerproject_api_controller/wokerinfoadd', data, 'POST', function(res) {
      console.log(res);
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

  },
  /**
   * 生命周期函数--监听页面加载

   */
  onLoad: function(options) {
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    var data = {};
    // that.setData({
    //   token: app.globalData.token
    // })
    data.token = app.globalData.token;

    app.ajax.req('workerproject_api_controller/getWokerInfo', data, 'POST', function(res) {
      console.log(JSON.stringify(res));
      if (parseInt(res.errorCode) == 200) {
        console.log("加载成功");
        // 获取到个人信息
        const personInfo_temp = res.data.personInfo;
        // 初始化民族文字解析
        app.onLoadData("nation", (data) => {
          var arr = codeToTextArr(data, strToArr(personInfo_temp.nation));
          that.setData({
            nationVal: personInfo_temp.nation,
            nation_list: data,
            nation: arrToStr(arr)
          })
        });
        // 初始化文化程度文字解析
        app.onLoadData("education", (data) => {
          var arr = codeToTextArr(data, strToArr(personInfo_temp.education));
          that.setData({
            eduVal: personInfo_temp.education,
            education_list: data,
            education: arrToStr(arr)
          })
        });

        that.setData({
          region_code: personInfo_temp.residence,
          name: personInfo_temp.dutyName,
          nickname: personInfo_temp.nickName,
          sex: personInfo_temp.sex,
          birthday: strToArr(personInfo_temp.birthday),
          nation_code: personInfo_temp.nation,
          education_code: personInfo_temp.education,
          face_arr: strToArr(res.data.head_portrait),
          faceUid_str: res.data.head_portrait,
          isLinked: true,
        });

        setTimeout(function() {
          wx.hideLoading()
        }, 500)
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
    let fileName = "lw/" + formatTime(new Date());
    var faceUid_str = this.data.faceUid_str;
    this.onUpLoad(1, fileName, "onUpFace", faceUid_str);
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
      console.log("currImgs_url=" + currImgs_url);
      console.log("currImgs_uids_str=" + currImgs_uids_str);
      that.setData({
        face_arr: currImgs_url,
        faceUid_str: currImgs_uids_str
      })
      //初始化uploadList
      app.globalData.uploadList = [];
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    console.log("个人信息onHide");
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