// pages/mine/team/team.js
import {
  $wuxDialog
} from '../../vux/index';
let app = getApp();
let util = require('../../../utils/util.js');
let codeToTextArr = util.codeToTextArr;
let strToArr = util.strToArr;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    buttons: [{
        label: '从平台添加用户',
        icon: '/pages/icons/logo.png'
      },
      {
        label: '新建用户',
        icon: '/pages/icons/logo.png'
      }
    ],
    //班组标签
    teamClass: [],
    //班组成员
    teamList: [],
    //工种类型
    consType_text: [],
    tid: ''
  },
  //搜索班组成员
  searchTeam: function(e) {
    let tid = e.currentTarget.dataset.tid;
    this.setData({
      tid: tid
    })
    this.getTeamList();
  },
  //修改班组信息
  edit: function(e) {
    let id = e.currentTarget.dataset.id;
    let teamList = this.data.teamList;
    let data = '';
    for (let i = 0; i < teamList.length; i++) {
      if (teamList[i].id == id) {
        data = JSON.stringify(teamList[i]);
      }
    }
    wx.navigateTo({
      url: 'newTeam/newTeam?info=' + data
    })
  },
  //立即联系
  callphone: function(e) {
    let phone = e.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phone,
    })
  },
  //班组成员列表
  getTeamList: function() {
    let that = this;
    let data = {};
    data.token = app.globalData.token;
    data.t_id = that.data.tid;
    data.offset = 1;
    data.limit = 100;
    app.ajax.req('team_api_controller/getTeamList ', data, 'POST', function(res) {
      if (Number.parseInt(res.errorCode) === 200) {
        //工种类型解析文字解析
        app.onLoadData("consType", (data) => {
          let teamList = res.data.list;
          for (let i = 0; i < teamList.length; i++) {
            teamList[i].cons_type = codeToTextArr(data, strToArr(teamList[i].cons_type))
          }
          that.setData({
            teamList: res.data.list
          })
        });
      }
    })
  },
  //点击悬浮按钮处理
  buttonClicked(e) {
    const {
      index
    } = e.detail
    //登录
    if (index === 0) {
      wx.navigateTo({
        url: 'searchAddTeam/searchAddTeam'
      })
    } else { //发布项目
      wx.navigateTo({
        url: 'newTeam/newTeam',
      })
    }
  },
  //新建班组
  newTeam() {
    const alert = (content) => {
      $wuxDialog('#wux-dialog--alert').alert({
        resetOnClose: true,
        title: '班组名称',
        content: content,
      })
    }
    let that = this;
    $wuxDialog().prompt({
      resetOnClose: true,
      title: '请输入班组名称',
      content: '',
      defaultText: '限定8个字符',
      placeholder: '',
      maxlength: 8,
      onConfirm(e, response) {
        if (response.length > 8) {
          wx.showToast({
            title: '输入的字符不能大于8个',
            icon: 'none'
          })
          return;
        }
        //新增班组
        let data = {};
        data.token = app.globalData.token;
        data.name = response;
        app.ajax.req('team_api_controller/addTeamType', data, 'POST', function(res) {
          if (Number.parseInt(res.errorCode) === 200) {
            wx.showToast({
              title: '新建班组成功',
              icon: 'none'
            })
            that.banzuLabel(that);
          }
        })
      },
    });
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
          teamClass: res.data
        })
      }
      wx.hideLoading();
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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
    that.banzuLabel(that);
    that.getTeamList();
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