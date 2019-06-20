// pages/bgxCenter/fillInfo2/index.js
var util = require("../../../utils/util.js");
var getAreaText = util.getAreaText;
var formatTime = util.formatTime;
var strToArr = util.strToArr;
var arrToStr = util.arrToStr;
var codeToTextArr = util.codeToTextArr;

const app = getApp();
import {
  $wuxSelect
} from '../../vux/index';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 是否加载成功
    isLinked: false,
    // token
    token: "",
    /* 所需工种(侧边栏)*/
    showGongz: false,
    // 显示的文字
    consType_text: [],
    gongzNum: 1,
    // 侧边栏标题
    consType: "", // skey 字码
    consType_title: "工种",
    consType_list: [],

    // 工种级别
    level: "",
    levelVal: "",
    level_code: "",
    level_list: [],
    // 从业时间
    workTime: "",
    workTime_focus: false,
    // 期望薪资
    salaryVal: "",
    salary: "",
    salary_code: "",
    salary_list: [],
    // 可施工地
    region_code: "",
    // 技能证书
    certificate_arr: [],
    certificateUid_str: "",
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

  repValue: function(arr) {
    var str = JSON.stringify(arr);
    var str2 = str.replace(new RegExp("name", "g"), "title");
    var str3 = str2.replace(new RegExp("skey", "g"), "value");
    var newarr = JSON.parse(str3);
    return newarr;
  },
  // 选择级别
  openLevel(e) {
    $wuxSelect('#wux-select-level').open({
      value: this.data.levelVal,
      options: this.repValue(this.data.level_list),
      onConfirm: (value, index, options) => {
        if (index !== -1) {
          this.setData({
            levelVal: value,
            level: options[index].title,
            level_code: options[index].value,
          })
        }
      },
    })
  },
  // 设置从业年限
  onWorkTime: function(e) {
    this.setData({
      workTime: e.detail.value
    })
  },
  // 选择期望薪资
  openSalary(e) {
    $wuxSelect('#wux-select-salary').open({
      value: this.data.salaryVal,
      options: this.repValue(this.data.salary_list),
      onConfirm: (value, index, options) => {
        if (index !== -1) {
          this.setData({
            salaryVal: value,
            salary: options[index].title,
            salary_code: options[index].value,
          })
        }
      },
    })
  },

  onGetArea: function(e) {
    console.log("region_code=" + e.detail.region_code);
    this.setData({
      region_code: e.detail.region_code
    })
  },

  // 业务信息保存
  onSave: function(e) {
    var that = this;
    // 提交保存数据到后台
    const data = {};

    console.log("劳务业务信息参数=" + JSON.stringify(data));
    // 对必填字段进行判断
    if (!that.data.consType) {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '工种不能为空，请选择工种',
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      })
      return false;
    }
    if (!that.data.level) {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '级别不能为空，请选择级别',
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
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
    if (!that.data.salary) {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '期望薪资不能为空，请选择薪资',
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
        content: '可施工地不能为空，请选择',
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      })
      return false;
    }
    data.token = app.globalData.token;
    data.consType = that.data.consType;
    data.level = that.data.level_code;
    data.workTime = that.data.workTime;
    data.salary = that.data.salary_code;
    data.workAddress = that.data.region_code;
    data.certificate = that.data.certificateUid_str;
    console.log("劳务编辑业务信息保存参数=" + JSON.stringify(data));

    app.ajax.req('workerproject_api_controller/lwpeopleinfoadd', data, 'POST', function(res) {
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
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '加载中',
    })
    const that = this;
    const data = {};
    data.token = app.globalData.token;
    
    app.ajax.req('workerproject_api_controller/getWokerInfo', data, 'POST', function(res) {
      console.log(JSON.stringify(res));
      if (parseInt(res.errorCode) == 200) {
        console.log("加载成功");
        // 获取到业务信息
        const wokerInfo_temp = res.data.wokerInfo;

        // 等级
        app.onLoadData("level", (data) => {
          var arr = codeToTextArr(data, strToArr(wokerInfo_temp.level));
          that.setData({
            levelVal: wokerInfo_temp.level,
            level_list: data,
            level: arrToStr(arr)
          })
        });

        // 薪资
        app.onLoadData("salary", (data) => {
          var arr = codeToTextArr(data, strToArr(wokerInfo_temp.salary));
          that.setData({
            salary_list: data,
            salary: arrToStr(arr),
            salaryVal: wokerInfo_temp.salary
          })
        });

        // 工种解析
        app.onLoadData("consType", (data) => {
          that.setData({
            consType_list: data,
            consType_text: codeToTextArr(data, strToArr(wokerInfo_temp.consType))
          })
        });

        that.setData({
          consType: wokerInfo_temp.consType,
          level_code: wokerInfo_temp.level,
          workTime: wokerInfo_temp.workTime,
          salary_code: wokerInfo_temp.salary,
          region_code: wokerInfo_temp.workAddress,
          certificate_arr: wokerInfo_temp.certificate,
          certificateUid_str: arrToStr(wokerInfo_temp.certificate),
          isLinked: true
        })
        setTimeout(function () {
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
  // 上传技能证书
  onUpCertificate: function(e) {
    // let fileName = "lw/" + formatTime(new Date());
    // let certificateUid_str = this.data.certificateUid_str;
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
    const data = {};
    data.token = app.globalData.token;

    app.ajax.req('workerproject_api_controller/getWokerInfo', data, 'POST', function (res) {
      console.log(JSON.stringify(res));
      if (parseInt(res.errorCode) == 200) {
        console.log("加载成功");
        // 获取到业务信息
        const wokerInfo_temp = res.data.wokerInfo;

        // 等级
        app.onLoadData("level", (data) => {
          var arr = codeToTextArr(data, strToArr(wokerInfo_temp.level));
          that.setData({
            levelVal: wokerInfo_temp.level,
            level_list: data,
            level: arrToStr(arr)
          })
        });

        // 薪资
        app.onLoadData("salary", (data) => {
          var arr = codeToTextArr(data, strToArr(wokerInfo_temp.salary));
          that.setData({
            salary_list: data,
            salary: arrToStr(arr),
            salaryVal: wokerInfo_temp.salary
          })
        });

        // 工种解析
        app.onLoadData("consType", (data) => {
          that.setData({
            consType_list: data,
            consType_text: codeToTextArr(data, strToArr(wokerInfo_temp.consType))
          })
        });

        that.setData({
          consType: wokerInfo_temp.consType,
          level_code: wokerInfo_temp.level,
          workTime: wokerInfo_temp.workTime,
          salary_code: wokerInfo_temp.salary,
          region_code: wokerInfo_temp.workAddress,
          certificate_arr: wokerInfo_temp.certificate,
          certificateUid_str: arrToStr(wokerInfo_temp.certificate),
          isLinked: true
        })
        setTimeout(function () {
          wx.hideLoading()
        }, 500)
      } else {
        console.log("加载失败");
      }
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