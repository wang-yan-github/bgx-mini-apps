// pages/bgxCenter/fillInfo2/index.js
import {
  $wuxSelect
} from '../../vux/index';
import {
  $wuxCalendar
} from '../../vux/index';
var util = require("../../../utils/util.js");
var getAreaText = util.getAreaText;
var formatTime = util.formatTime;
var strToArr = util.strToArr;
var arrToStr = util.arrToStr;
var codeToTextArr = util.codeToTextArr;
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isLinked: false,
    // token
    token: "",
    // pId
    pId: "",
    // 项目名称
    pName: "",
    pName_focus: false,
    // 发布主体
    fbzhuti: false,
    currProjectType: 1,
    projectType: 1,
    projectType_text: "个人发布",
    selectFB: [{
        id: 1,
        text: "个人发布"
      },
      {
        id: 2,
        text: "企业发布",
      },
    ],
    /*   工程类别(侧边栏)  */
    showGclb: false,
    technicalType_text: "",
    // 所需工种数量(最大可选)
    gclbNum: 1,
    // 侧边栏标题
    technicalType: "", // skey字码
    technicalType_title: "工程类别",
    technicalType_skey: "technicalType",
    technicalType_list: [],

    img: ["/pages/icons/logo.png"],

    /*   所需工种(侧边栏)  */
    showGongz: false,
    consType_text: "",
    // 所需工种数量(最大可选)
    gongzNum: 20,
    // 侧边栏标题
    consType: "", // skey 字码
    consType_title: "所需工种",
    consType_skey: "consType",
    consType_list: [],
    // 工期
    startTime: [],
    endTime: [],
    // 项目预算
    money: "",
    money_focus: false,
    // 施工区域
    // region: "",
    region_code: "",
    // 项目详细地址
    pAddress: "",
    pAddress_focus: false,
    // 截止日期
    abortTime: [],
    // 进场时间
    enterTime: [],
    // 项目附件上传图片
    fujian_arr: [], // 当前图片的地址数组
    fujianUid_str: "", // 需要传递给upload组件的uid
    // 项目备案号
    recordNumber: "",
    // 项目描述
    pDescribe: "这个项目很牛逼",
    pDescribe_focus: false,
    // 项目描述文字长度
    desTextLen: 0,

  },
  // 设置项目名称
  onPname: function(e) {
    this.setData({
      pName: e.detail.value
    })
  },
  // 发布主体
  openFbzt: function() {
    this.setData({
      fbzhuti: !this.data.fbzhuti
    })
  },
  // 个人、企业发布
  onFbzt: function(e) {
    var currProjectType = e.currentTarget.dataset.id;
    if (this.data.projectType == '1') {
      if (currProjectType == '2') {
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: '若要选择企业发布，请先到个人中心完善公司信息',
        })
        return;
      }
    }
    this.setData({
      projectType_text: e.currentTarget.dataset.text,
      currProjectType: e.currentTarget.dataset.id,
      fbzhuti: !this.data.fbzhuti
    })
  },
  // 展开工程类型
  openGclb: function (e) {
    this.setData({
      showGclb: true,
    })
  },
  // 工程类型设置值
  showGclbArr: function (e) {
    let checkValue_text = e.detail.checkValue_text;
    let checkValue_code = e.detail.checkValue_code;
    this.setData({
      technicalType_text: strToArr(checkValue_text),
      technicalType: checkValue_code
    })
  },
  // 展开所需工种
  openGongz: function (e) {
    this.setData({
      showGongz: true,
    })
  },
  // 所需工种设置值
  showGongzArr: function (e) {
    let checkValue_text = e.detail.checkValue_text;
    let checkValue_code = e.detail.checkValue_code;
    console.log(checkValue_text + "||" + checkValue_code);
    this.setData({
      consType_text: strToArr(checkValue_text),
      consType: checkValue_code
    })
  },
  // 工期 工期开始
  openCalendar1: function() {
    var that = this;
    $wuxCalendar("#wux-calendar1").open({
      // value: this.data.value1,
      onChange: (values, displayValues) => {
        console.log('开始日期onChange', values, displayValues)
        if (that.data.endTime.length != 0) {
          if (displayValues[0] >= that.data.endTime[0]) {
            wx.showModal({
              title: '提示',
              showCancel: false,
              content: '工期开始时间不能大于或者等于工期结束时间，请重新选择开始日期',
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
            this.setData({
              startTime: displayValues
            })
          }
        } else {
          this.setData({
            startTime: displayValues
          })
        }
      }
    })
  },
  // 工期 工期结束
  openCalendar2: function() {
    var that = this;
    $wuxCalendar("#wux-calendar2").open({
      // value: this.data.value1,
      onChange: (values, displayValues) => {
        console.log('onChange', values, displayValues)
        if (that.data.startTime.length != 0) {
          if (that.data.startTime[0] >= displayValues[0]) {
            console.log("结束日期判断");
            wx.showModal({
              title: '提示',
              showCancel: false,
              content: '工期结束时间不能小于或者等于开始时间，请重新选择结束日期',
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
            this.setData({
              endTime: displayValues
            })
          }
        } else {
          this.setData({
            endTime: displayValues
          })
        }
      }
    })

  },
  // 设置项目预算
  onMoney: function(e) {
    this.setData({
      money: e.detail.value
    })
  },
  // 设置施工区域
  onGetArea: function(e) {
    this.setData({
      region_code: e.detail.region_code
    })
  },
  // 设置详细地址
  onAddress: function(e) {
    this.setData({
      pAddress: e.detail.value
    })
  },
  // 截止日期
  openCalendar3: function() {
    var that = this;
    $wuxCalendar("#wux-calendar3").open({
      // value: this.data.value1,
      onChange: (values, displayValues) => {
        console.log('onChange', values, displayValues);
        if (that.data.startTime.length == 0 || that.data.endTime.length == 0) {
          wx.showModal({
            title: '提示',
            showCancel: false,
            content: '项目工期的开始或者结束日期还未填写，请先填写',
            success(res) {
              if (res.confirm) {
                console.log('用户点击确定')
                that.setData({
                  abortTime: []
                })
              }
            }
          })
          return false;
        }

        if (that.data.startTime[0] > displayValues[0]) {
          wx.showModal({
            title: '提示',
            showCancel: false,
            content: '招标截止时间不能小于或者等于开始时间，请重新选择截止时间',
            success(res) {
              if (res.confirm) {
                console.log('用户点击确定')
                that.setData({
                  abortTime: []
                })
              }
            }
          })
          return false;
        }
        if (that.data.endTime[0] < displayValues[0]) {
          wx.showModal({
            title: '提示',
            showCancel: false,
            content: '招标截止时间不能大于或者等于结束时间，请重新选择截止时间',
            success(res) {
              if (res.confirm) {
                console.log('用户点击确定')
                that.setData({
                  abortTime: []
                })
              }
            }
          })
          return false;
        }
        this.setData({
          abortTime: displayValues
        })

      }
    })
  },
  // 进场时间
  openCalendar4: function() {
    var that = this;
    $wuxCalendar("#wux-calendar4").open({
      // value: this.data.value1,
      onChange: (values, displayValues) => {
        console.log('onChange', values, displayValues);
        if (that.data.startTime.length == 0 || that.data.endTime.length == 0) {
          wx.showModal({
            title: '提示',
            showCancel: false,
            content: '项目工期的开始或者结束时间还未填写，请先填写',
            success(res) {
              if (res.confirm) {
                console.log('用户点击确定')
                that.setData({
                  enterTime: []
                })
              }
            }
          })
          return false;
        }
        if (that.data.startTime[0] > displayValues[0]) {
          wx.showModal({
            title: '提示',
            showCancel: false,
            content: '进场时间不能小于或者等于开始时间，请重新选择进场时间',
            success(res) {
              if (res.confirm) {
                console.log('用户点击确定')
                that.setData({
                  enterTime: []
                })
              }
            }
          })
          return false;
        }
        if (that.data.endTime[0] < displayValues[0]) {
          wx.showModal({
            title: '提示',
            showCancel: false,
            content: '进场时间不能大于或者等于结束时间，请重新选择进场时间',
            success(res) {
              if (res.confirm) {
                console.log('用户点击确定')
                that.setData({
                  enterTime: []
                })
              }
            }
          })
          return false;
        }
        this.setData({
          enterTime: displayValues
        })

      }
    })
  },
 
  // 设置项目备案号
  onRecordNumber: function(e) {
    console.log("项目备案号=" + e.detail.value);
    this.setData({
      recordNumber: e.detail.value
    })
  },
  // 项目描述
  onDescribe: function(e) {
    this.setData({
      pDescribe: e.detail.value,
      // desTextLen: e.detail.value.length
    })
  },
  // 发布项目
  onIssue: function () {
    const that = this;
    that.setData({
      token: app.globalData.token
    })

    if (!that.data.pName) {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '项目名称不能为空',
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
          that.setData({
            pName_focus: true
          })
        }
      })
      return false;
    }
    if (!that.data.technicalType_text) {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '工程类别不能为空，请选择',
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      })
      return false;
    }
    if (that.data.startTime.length == 0) {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '项目工期的工期开始时间不能为空，请选择',
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      })
      return false;
    }

    if (that.data.endTime.length == 0) {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '项目工期的工期结束时间不能为空，请选择',
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
        content: '施工区域不能为空，请选择',
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      })
      return false;
    }
    if (!that.data.pAddress) {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '项目地址不能为空，请输入',
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      })
      return false;
    }
    if (that.data.abortTime.length == 0) {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '招标截止日期不能为空',
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      })
      return false;
    }

    if (that.data.enterTime.length == 0) {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '进场时间不能为空，请选择',
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      })
      return false;
    }
    if (!that.data.pDescribe) {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '项目描述不能为空，请输入',
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
          that.setData({
            pDescribe_focus: true
          })
        }
      })
      return false;
    }

    const data = {};
    data.token = app.globalData.token;
    data.pId = that.data.pId;
    data.pName = that.data.pName;
    data.projectType = that.data.currProjectType;
    data.technicalType = that.data.technicalType;
    data.consType = that.data.consType;
    data.startTime = arrToStr(that.data.startTime);
    data.endTime = arrToStr(that.data.endTime);
    data.pColumnPrice = that.data.money;
    data.region = that.data.region_code;
    data.pAddress = that.data.pAddress;
    data.endDate = arrToStr(that.data.abortTime);
    data.approachTime = arrToStr(that.data.enterTime);
    data.recordNumber = that.data.recordNumber;
    data.pFiles = that.data.fujianUid_str;
    data.pRemark = that.data.pDescribe;
    console.log("发布(修改)项目参数=" + JSON.stringify(data));

    app.ajax.req('company_api_controller/companyProjectAdd', data, 'POST', function (res) {
      if (parseInt(res.errorCode) == 200) {
        console.log("修改项目成功");
        wx.showToast({
          title: '修改项目成功',
          icon: 'success',
          duration: 1500
        })
        // 返回到上一级页面
        setTimeout(function () {
          wx.navigateBack();
        }, 1500)
        console.log("发布项目返回值res==" + JSON.stringify(res));
      } else {
        console.log("保存失败");
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    let data = {};
    data.token = app.globalData.token;
    that.setData({
      pId: options.pid
    })
    data.p_id = options.pid;
    console.log("修改项目初始化所传参数=" + JSON.stringify(data));
    app.ajax.req('company_api_controller/companyProjectInfo', data, 'GET', function(res) {
      console.log("修改项目初始化res==" + JSON.stringify(res));
      if (parseInt(res.errorCode) == 200) {
        let data = res.data;
        // 工程类别解析
        app.onLoadData("technicalType", (gcData) => {
          that.setData({
            technicalType_list: gcData,
            technicalType_text: codeToTextArr(gcData, strToArr(data.p_technical_type))
          })
        });
        // 工种解析
        app.onLoadData("consType", (gcData) => {
          that.setData({
            consType_list: gcData,
            consType_text: codeToTextArr(gcData, strToArr(data.p_cons_type))
          })
        });

        that.setData({
          pName: data.p_name,
          projectType: data.project_type,
          currProjectType: data.project_type,
          projectType_text: that.data.selectFB[Number(data.project_type) - 1].text,
          technicalType: data.p_technical_type,
          consType: data.p_cons_type,
          startTime: strToArr(data.start_time),
          endTime: strToArr(data.end_date),
          money: data.p_column_price,
          region_code: data.p_region,
          pAddress: data.p_address,
          abortTime: strToArr(data.end_date),
          enterTime: strToArr(data.p_approach_time),
          recordNumber: data.record_number,
          fujian_arr: data.p_files,
          fujianUid_str: data.p_files,
          pDescribe: data.p_remark,
          isLinked: true,
        })
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
  onUpLoad: function (_countNumber, _fileName, _method, _uidStr) {
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
  onUpFujian: function (e) {
    let fileName = "fbf/" + formatTime(new Date());
    var fujianUid_str = this.data.fujianUid_str;
    this.onUpLoad(9, fileName, "onUpFujian", fujianUid_str);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    var uploadList = app.globalData.uploadList;
    console.log("初始化onShow时uploadList=" + JSON.stringify(uploadList));
    var currImgs_url = [];
    var currImgs_uids_str = "";
    if (JSON.stringify(uploadList) != "{}" && uploadList.upload.length > 0) {
      currImgs_url = uploadList.upload;
      currImgs_uids_str = arrToStr(uploadList.upload);
      console.log("currImgs_url=" + currImgs_url);
      console.log("currImgs_uids_str=" + currImgs_uids_str);
      that.setData({
        fujian_arr: currImgs_url,
        fujianUid_str: currImgs_uids_str
      })
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