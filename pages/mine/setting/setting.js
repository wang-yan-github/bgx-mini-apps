// pages/mine/setting/setting.js
let app = getApp();
import {
  $wuxSelect
} from '../../vux/index.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    value1: '',
    title1: '',
    type: 2
  },
  //推出登录
  logOut:function(){
    //清除全局消息定时器
    clearTimeout(app.globalData.xiaoxiTime);
    //数据重置
    app.globalData.token = '';
    wx.removeStorageSync('phone');
    wx.removeStorageSync('phonePwd');
    wx.removeStorageSync('role');
    wx.removeStorageSync('pwd');
    wx.removeStorageSync('username');
    wx.navigateTo({
      url: '/pages/login/ipone/index',
    })
  },
  //改变工作状态
  onClick1() {
    $wuxSelect('#wux-select1').open({
      value: this.data.value1,
      options: [
        '空闲',
        '忙碌'
      ],
      onConfirm: (value, index, options) => {
        console.log('onConfirm', value, index, options)
        if (index !== -1) {
          this.setData({
            value1: value,
            title1: options[index],
          })
        }
        let data={};
        data.token = app.globalData.token;
        data.wokerStatus = index;
        wx.showLoading({
          title: '修改中',
        })
        app.ajax.req('workerproject_api_controller/changeWokerType',data,'POST',function(res){
          wx.hideLoading();
          if(Number.parseInt(res.errorCode) === 200){
            wx.showToast({
              title: '修改成功',
            })
          } 
        })
      },
    })
  },
  editPhone: function() {
    wx.navigateTo({
      url: 'editPhone/editPhone'
    })
  },
  feedback: function() {
    wx.navigateTo({
      url: 'feedback/feedback'
    })
  },
  helpCenter: function() {
    wx.navigateTo({
      url: 'helpCenter/helpCenter'
    })
  },
  contactUs: function() {
    wx.navigateTo({
      url: 'contactUs/contactUs'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      type: wx.getStorageSync("role")
    })
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