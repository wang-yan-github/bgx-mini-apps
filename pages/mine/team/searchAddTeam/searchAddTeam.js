// pages/mine/team/searchAddTeam/searchAddTeam.js
let app = getApp();
let util = require('../../../../utils/util.js');
import {
  $wuxBackdrop
} from '../../../vux/index'
let codeToTextArr = util.codeToTextArr;
let strToArr = util.strToArr;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    List: [],
    teamClass: [],
    show: false,
    wid: ''
  },
  //查询班组类型
  banzuLabel: function(that) {
    let data = {};
    data.token = app.globalData.token;
    wx.showLoading({
      title: '加载中',
    })
    app.ajax.req('team_api_controller/teamTop', data, 'POST', function(res) {
      if (Number.parseInt(res.errorCode) === 200) {
        that.setData({
          teamClass: res.data.list,
          show: true
        })
        wx.hideLoading();
      }
    })
  },

  //搜索
  onChange(e) {
    this.getWorkerList(e.detail.value);
  },
  //列表展示
  getWorkerList: function(name_phone) {
    let that = this;
    let data = {};
    data.token = app.globalData.token;
    data.name_phone = name_phone;
    app.ajax.req('team_api_controller/getWorkerList', data, 'POST', function(res) {
      if (Number.parseInt(res.errorCode) === 200) {
        //工种类型解析文字解析
        app.onLoadData("consType", (data) => {
          let teamList = res.data.list;
          for (let i = 0; i < teamList.length; i++) {
            teamList[i].cons_type = codeToTextArr(data, strToArr(teamList[i].cons_type))
          }
          that.setData({
            List: res.data.list
          })
        });
      }
    })
  },
  //添加人员
  addteam: function(e) {
    //开启背景幕
    this.$wuxBackdrop.retain();
    let that = this;
    let wid = e.currentTarget.dataset.wid;
    that.setData({
      wid: wid
    })
    that.banzuLabel(that);
  },
  addteam1: function(e) {
    let that = this;
    let data = {};
    data.token = app.globalData.token;
    data.w_id = this.data.wid;
    data.t_id = e.currentTarget.dataset.tid;
    wx.showLoading({
      title: '添加中',
    })
    app.ajax.req('team_api_controller/teamAllSave', data, 'POST', function(res) {
      if (Number.parseInt(res.errorCode) === 200) {
        wx.showToast({
          title: '添加成功，已发送通知给劳务',
          icon: 'none',
          duration: 2000
        })
        //隐藏背景幕
        that.$wuxBackdrop.release();
        that.setData({
          show: !that.data.show
        })

      }
      wx.hideLoading();
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.$wuxBackdrop = $wuxBackdrop();
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