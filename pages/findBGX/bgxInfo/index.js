// pages/findBGX/bgxInfo/index.js
let app = getApp();
let util = require('../../../utils/util.js');
import {
  $wuxActionSheet
} from '../../vux/index';
let getAreaText = util.getAreaText;
let codeToTextArr = util.codeToTextArr;
let strToArr = util.strToArr;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //默认显示的tab
    current: "tab1",
    //页面角色
    wid: '',
    lwInfo: '',
    xmlist: [],
    visible: false,
    //角色
    type: 2,
    bsid: -1
  },
  //收藏项目
  shoucang: function(e) {
    let that = this;
    let shoucang = e.currentTarget.dataset.shoucang;
    let data = {};
    data.token = app.globalData.token;
    data.c_Id = e.currentTarget.dataset.wid;
    //未收藏
    if (!shoucang) {
      if(that.data.type == 2){
        data.type = 4;
      }else{
        data.type = 5;
      }
      app.ajax.req('collection_api_controller/collectionSave', data, 'POST', function(res) {
        if (Number.parseInt(res.errorCode) === 200) {
          wx.showToast({
            title: '收藏成功',
            icon: 'none'
          })
          that.setData({
            ['lwInfo.isCollection']: true
          })
        }
      })
    } else {
      app.ajax.req('collection_api_controller/removeCollection', data, 'POST', function(res) {
        if (Number.parseInt(res.errorCode) === 200) {
          wx.showToast({
            title: '取消成功',
            icon: 'none'
          })
          that.setData({
            ['lwInfo.isCollection']: false
          })
        }
      })
    }

  },
  //图片预览
  previewImage: function(e) {
    let src = e.currentTarget.dataset.src;
    wx.previewImage({
      current: src,
      urls: [src]
    })
  },
  //图片预览1
  previewImage1: function(e) {
    let src = e.currentTarget.dataset.src;
    let images = e.currentTarget.dataset.images;
    wx.previewImage({
      current: src,
      urls: images
    })
  },
  //图片预览2
  previewImage2: function (e) {
    let src = e.currentTarget.dataset.src;
    let images = e.currentTarget.dataset.images;
    wx.previewImage({
      current: src,
      urls: images
    })
  },
  lianxi: function(e) {
    let that = this;
    //判断是否完善信息
    app.isPerfectInfo(function(res) {
      if (!res) {
        return false;
      } else {
        //跳转到聊天界面
        let infoId = e.currentTarget.dataset.bsid;
        let lwName = e.currentTarget.dataset.lwname;
        if (infoId == app.globalData.infoId) {
          wx.showToast({
            title: '不能联系自己',
            icon: 'none'
          })
          return false;
        }
        let type_ = that.data.type;
        wx.navigateTo({
          url: '/pages/message/page/index?to_id=' + infoId + '&to_type=' + type_ + '&duty_name=' + lwName
        })
      }
    })
  },
  // yuyue: function(e) {
  //   //判断是否完善信息
  //   app.isPerfectInfo(function(res) {
  //     if (!res) {
  //       return false;
  //     } else {
  //       let bs_id = e.currentTarget.dataset.bsid;
  //       let bs_identity = 1;
  //       let p_id = e.currentTarget.dataset.pid;
  //       app.yuyue(bs_id, bs_identity, p_id, 1);
  //     }
  //   })
  // },
  showActionSheet2() {
    let that = this;
    $wuxActionSheet('#wux-actionsheet').showSheet({
      titleText: '请选择关联项目',
      buttons: that.data.xmlist,
      buttonClicked(index, item) {
        that.setData({
          pid: item.p_id
        })
        let bs_id = that.data.bsid;
        let bs_identity;
        if (that.data.type == 2) {
          bs_identity = 2;
        }
        if (that.data.type == 3) {
          bs_identity = 3;
        }
        let p_id = that.data.pid;
        //2为预约劳务
        app.yuyue(bs_id, bs_identity, p_id, 2);
        return true;
      },
      cancelText: '取消',
      cancel() {}
    })
  },
  yuyue: function(e) {
    var that = this;
    let bs_id = e.currentTarget.dataset.bsid;
    that.setData({
      bsid: bs_id
    })
    let bs_identity = 1;
    let p_id = e.currentTarget.dataset.pid;
    if (wx.getStorageSync('role') == 1) { //发包方
      let data = {};
      data.token = app.globalData.token;
      app.ajax.req('bespeak_api_controller/getProject', data, 'POST', function(res) {
        if (parseInt(res.errorCode) === 200) {
          if (res.data.length == 0) {
            wx.showToast({
              title: '您还没有发布项目或未审核通过的项目',
              icon: 'none'
            })
          } else {
            that.setData({
              xmlist: res.data
            })
            that.showActionSheet2();
          }
        }
      })
    } else {
      let bs_identity = that.data.type;
      //2为预约劳务
      app.yuyue(bs_id, bs_identity, '', 2);
    }
  },
  //tab切换
  onChange(e) {
    this.setData({
      current: e.detail.key
    })
  },
  //查询详情
  showLWInfo: function() {
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    var data = {};
    data.token = app.globalData.token;
    data.w_id = that.data.wid;
    app.ajax.req('workerproject_api_controller/findBgxWokerInfo', data, 'POST', function(res) {
      wx.hideLoading();
      if (parseInt(res.errorCode) === 200) {
        that.setData({
          lwInfo: res.data
        })
        //名族解析
        app.onLoadData("nation", function(data) {
          let education = codeToTextArr(data, strToArr(res.data.nation));
          that.setData({
            ['lwInfo.nation']: education
          })
        })
        //基本信息的家乡解析
        let hometown = getAreaText(res.data.basicinfo.hometown);
        //基本信息的区域解析
        let quyu = getAreaText(res.data.basicinfo.wokeraddress);
        that.setData({
          ['lwInfo.basicinfo.hometown']: hometown,
          ['lwInfo.basicinfo.wokeraddress']: quyu
        })
        //基本信息的学历解析
        app.onLoadData("education", function(data) {
          let education = codeToTextArr(data, strToArr(res.data.basicinfo.education));
          that.setData({
            ['lwInfo.basicinfo.education']: education
          })
        })
        //基本信息的工程类型解析
        app.onLoadData("technicalType", function(data) {
          let technicalType = codeToTextArr(data, strToArr(res.data.basicinfo.technicalType));
          that.setData({
            ['lwInfo.basicinfo.technicalType']: technicalType
          })
        })
        //业绩解析
        let yeji = res.data.achieves;
        for (let i = 0; i < yeji.length; i++) {
          let quyu = getAreaText(yeji[i].address);
          that.setData({
            ['lwInfo.achieves[' + i + '].address']: quyu
          })
        }
        //工种解析
        app.onLoadData('consType', function(data) {
          let team = that.data.lwInfo.basicinfo.teaminfo;
          if (that.data.type == 2) {
            if (team.length > 0) {
              for (let i = 0; i < team.length; i++) {
                let cons = team[i].constype.split(',')[0]
                that.setData({
                  ['lwInfo.basicinfo.teaminfo[' + i + '].constype']: codeToTextArr(data, strToArr(cons))
                })
              }
            }
          }
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let wid = options.wid;
    let type = options.type;
    if (type == 3) {
      wx.setNavigationBarTitle({
        title: '劳务详情页'
      })
    }
    this.setData({
      wid: wid,
      type: type
    })
    this.showLWInfo();
    console.log("当前type", this.data.type);
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