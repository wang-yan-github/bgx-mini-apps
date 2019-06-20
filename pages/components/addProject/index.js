// pages/components/addProject/index.js
import {
  $wuxCalendar
} from '../../vux/index';
var util = require("../../../utils/util.js");
var getAreaText = util.getAreaText;
var formatTime = util.formatTime;
var strToArr = util.strToArr;
var arrToStr = util.arrToStr;

const app = getApp();

Component({
  /**
   * 组件的属性列表
   * 
   */
  properties: {
    itemId: {
      type: String,
      value: ""
    },
    token: {
      type: String,
      value: ""
    },
    type: {
      type: String,
      value: ""
    },
    name: {
      type: String,
      value: ""
    },
    startTime: {
      type: Array,
      value: []
    },
    endTime: {
      type: Array,
      value: []
    },
    money: {
      type: String,
      value: ""
    },
    region_code: {
      type: String,
      value: ""
    },
    content: {
      type: String,
      value: ""
    },
    workImgs_arr: {
      type: Array,
      value: []
    },
    workImgsUid_str: {
      type: String,
      value: ""
    },
    isNewAdd: {
      type: String,
      value: "0"
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    show: false,
    // 项目描述文字长度
    textLength: 0,
  },

  /**
   * 组件的方法列表
   */

  methods: {
    // 设置项目名称
    onName: function(e) {
      this.setData({
        name: e.detail.value
      })
    },
    // 设置项目金额
    getMoney: function(e) {
      console.log("修改金额=" + e.detail.value);
      this.setData({
        money: e.detail.value
      })
    },
    // 设置项目地址
    onGetArea: function(e) {
      this.setData({
        region_code: e.detail.region_code
      })
    },
    // 设置项目地址
    getContent: function(e) {
      console.log(e.detail.value.length);
      this.setData({
        content: e.detail.value,
        // textLength: e.detail.value.length
      })
    },

    ready() {

    },
    onTextFocus: function(e) {
      this.setData({
        show: true
      })
    },
    onTextBlur: function(e) {
      show: false
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
    // 上传工作图片
    onUpWorkImgs: function(e) {
      let role = wx.getStorageSync('role') ? wx.getStorageSync('role') : 2;
      let fileName = "";
      if (role == 2) {
        fileName = "bgx/" + formatTime(new Date());
      } else if (role == 3) {
        fileName = "lw/" + formatTime(new Date());
      }
      var workImgsUid_str = this.data.workImgsUid_str;
      this.onUpLoad(9, fileName, "onUpWorkImgs", workImgsUid_str);
    },
    // 判断空字符串
    isEmpty: function(obj) {
      if (typeof obj == "undefined" || obj == null || obj == "" || obj.length == 0) {
        return true;
      } else {
        return false;
      }
    },

    // 业绩(编辑)保存
    onSave: function(e) {
      var that = this;
      // 提交保存数据到后台
      const data = {};
      if (that.isEmpty(that.data.name)) {
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: '项目名称不能为空',
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

      if (that.isEmpty(that.data.startTime)) {
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: '开始时间不能为空',
          success(res) {
            if (res.confirm) {
              console.log('用户点击确定')
            }
          }
        })
        return false;
      }
      console.log()

      if (that.isEmpty(that.data.endTime)) {
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: '结束时间不能为空',
          success(res) {
            if (res.confirm) {
              console.log('用户点击确定')
            }
          }
        })
        return false;
      }

      if (that.isEmpty(that.data.money)) {
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: '项目金额不能为空',
          success(res) {
            if (res.confirm) {
              console.log('用户点击确定')
            }
          }
        })
        return false;
      }

      if (that.isEmpty(that.data.region_code)) {
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: '项目地址不能为空',
          success(res) {
            if (res.confirm) {
              console.log('用户点击确定')
            }
          }
        })
        return false;
      }

      if (that.isEmpty(that.data.content)) {
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: '施工内容不能为空',
          success(res) {
            if (res.confirm) {
              console.log('用户点击确定')
            }
          }
        })
        return false;
      }

      data.type = that.data.type;
      data.token = that.data.token;
      data.id = that.data.itemId;
      data.name = that.data.name;
      data.projectMoney = that.data.money,
        data.startTime = arrToStr(that.data.startTime);
      data.endTime = arrToStr(that.data.endTime);
      data.address = that.data.region_code;
      data.content = that.data.content;
      data.pFiles = that.data.workImgsUid_str;

      console.log("保存业绩时的参数=" + JSON.stringify(data));

      app.ajax.req('achieve_api_controller/achieveAdd', data, 'POST', function(res) {
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
          // console.log(res);
        } else {
          console.log("保存失败");
        }
      })
    },

    // 业绩删除
    onDelete: function(e) {
      const that = this;
      // 提交保存数据到后台
      const data = {};
      data.token = that.data.token;
      data.id = that.data.itemId;

      console.log("包工侠业绩删除==" + JSON.stringify(data));
      wx.showModal({
        title: '提示',
        content: '该操作不可逆，请谨慎操作。确认删除该条项目业绩吗？',
        success(res) {
          if (res.confirm) {
            app.ajax.req('achieve_api_controller/achieveRemove', data, 'POST', function(res) {
              if (parseInt(res.errorCode) == 200) {
                console.log("删除成功");
                wx.showToast({
                  title: '删除成功',
                  icon: 'success',
                  duration: 1500
                })
                // 返回到上一级页面
                setTimeout(function() {
                  wx.navigateBack();
                }, 1500)
                // console.log(res);
              } else {
                console.log("删除失败");
              }
            })
          } else if (res.cancel) {
            wx.showToast({
              title: '取消删除成功',
              icon: 'success',
              duration: 1500
            })
          }
        }
      })
    },
    // 开始时间
    openCalendar1: function() {
      var that = this;
      $wuxCalendar().open({
        value: that.data.startTime,
        onChange: (values, displayValues) => {
          if (that.data.endTime.length != 0) {
            if (displayValues[0] > that.data.endTime[0]) {
              wx.showModal({
                title: '提示',
                showCancel: false,
                content: '开始时间不能大于结束时间，请重新选择',
                success(res) {
                  if (res.confirm) {
                    console.log('用户点击确定')
                    that.setData({
                      startTime: []
                    })
                  }
                }
              })
            } else {
              //开始时间与当前时间比较
              that.seletTimeToCurTime(1, displayValues);
            }
          } else {
            //开始时间与当前时间比较
            that.seletTimeToCurTime(1, displayValues);
          }
        }
      })
    },
    //选择的时间与当前时间比较
    seletTimeToCurTime: function(type, time) {
      let that = this;
      let time1 = formatTime(new Date());
      if (time[0] > time1) {
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: '开始时间不能大于当前时间，请重新选择',
          success(res) {
            if (res.confirm) {
              console.log('用户点击确定')
              that.setData({
                text: []
              })
            }
          }
        })
      } else {
        if (type == 1) {
          that.setData({
            startTime: time
          })
        } else {
          that.setData({
            endTime: time
          })
        }
      console.log("时间",time);
      }
    },
    // 结束时间
    openCalendar2: function() {
      var that = this;
      $wuxCalendar().open({
        value: that.data.endTime,
        onChange: (values, displayValues) => {
          // console.log('onChange', values, displayValues)
          if (that.data.startTime.length != 0) {
            if (that.data.startTime[0] > displayValues[0]) {
              console.log("结束日期判断");
              wx.showModal({
                title: '提示',
                showCancel: false,
                content: '结束时间不能小于开始时间，请重新选择',
                success(res) {
                  if (res.confirm) {
                    console.log('用户点击确定')
                    that.setData({
                      endTime: []
                    })
                  }
                }
              })
            } else {
              //结束时间与当前时间比较
              that.seletTimeToCurTime(2, displayValues);
            }
          } else {
            //结束时间与当前时间比较
            that.seletTimeToCurTime(2, displayValues);
          }
        }
      })
    },
  }
})