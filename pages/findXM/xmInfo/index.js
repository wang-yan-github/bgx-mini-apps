// pages/findXM/xmInfo/index.js
let app = getApp();
let util = require('../../../utils/util.js');
let codeToTextArr = util.codeToTextArr;
let strToArr = util.strToArr;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    xmInfo: {}
  },

  lianxi: function(e) {
    //判断是否完善信息
    app.isPerfectInfo(function(res) {
      if (!res) {
        return false;
      } else {
        //跳转到聊天界面
        let infoId = e.currentTarget.dataset.bsid;
        let fbfName = e.currentTarget.dataset.fbfname;
        if (infoId == app.globalData.infoId) {
          wx.showToast({
            title: '不能联系自己',
            icon: 'none'
          })
          return false;
        }
        let type_ = 1;
        wx.navigateTo({
          url: '/pages/message/page/index?to_id=' + infoId + '&to_type=' + type_ + '&duty_name=' + fbfName
        })
      }
    })
  },
  yuyue: function(e) {
    //判断是否完善信息
    app.isPerfectInfo(function(res) {
      if (!res) {
        return false;
      } else {
        let bs_id = e.currentTarget.dataset.bsid;
        let bs_identity = 1;
        let p_id = e.currentTarget.dataset.pid;
        app.yuyue(bs_id, bs_identity, p_id, 1);
      }
    })
  },
  //收藏项目
  shoucang: function(e) {
    let that = this;
    let shoucang = e.currentTarget.dataset.shoucang;
    let data = {};
    data.token = app.globalData.token;
    data.c_Id = e.currentTarget.dataset.pid;
    //未收藏
    if (shoucang == 0) {
      data.type = 2;
      app.ajax.req('collection_api_controller/collectionSave', data, 'POST', function(res) {
        if (Number.parseInt(res.errorCode) === 200) {
          wx.showToast({
            title: '收藏成功',
            icon: 'none'
          })
          that.setData({
            ['xmInfo.collection']: 1
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
            ['xmInfo.collection']: 0
          })
        }
      })
    }

  },
  //项目分享
  onShareAppMessage: function(res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      let pid = res.target.dataset.pid;
      return {
        title: text,
        path: '/pages/discover/discover/index?pid=' + pid, // 路径，传递参数到指定页面。
      }
    }
  },
  //下载文件
  fujiantap: function(e) {
    wx.showLoading({
      title: '下载中',
    })
    let zhi = e.currentTarget.dataset.url;
    let xmName = e.currentTarget.dataset.xmName;
    wx.downloadFile({
      url: zhi,
      success: function(res) {
        wx.hideLoading();
        wx.showToast({
          title: '下载成功',
          icon: 'none'
        })
        wx.saveFile({
          tempFilePath: res.tempFilePath,
          success: function(res) {
            var savedFilePath = res.savedFilePath
            console.log("savedFilePath", savedFilePath);
            wx.showToast({
              title: '保存成功',
              icon: 'none'
            })
          }
        })
      },
      fail: function(e) {
        wx.showToast({
          title: '下载失败',
          icon: 'none'
        })
      }
    })
  },
  //查看项目详情
  lookXMInfo: function(pid_) {
    wx.showLoading({
      title: '加载中',
    })
    let that = this;
    let pid = pid_;
    let data = {};
    data.token = app.globalData.token;
    data.p_id = pid;
    app.ajax.req('company_api_controller/companyProjectInfo', data, 'POST', function(res) {
      if (parseInt(res.errorCode) === 200) {
        that.setData({
          xmInfo: res.data
        })
        //区域查询
        let quyu = util.getAreaText(res.data.p_region);
        let c_quyu = util.getAreaText(res.data.c_region);
        that.setData({
          ['xmInfo.p_region']: quyu,
          ['xmInfo.c_region']: c_quyu
        })
        app.onLoadData('technicalType', function(data) {
          let gcClass = codeToTextArr(data, strToArr(res.data.p_technical_type));
          that.setData({
            ['xmInfo.p_technical_type']: gcClass
          })
        })
        app.onLoadData('consType', function(data) {
          let gzClass = codeToTextArr(data, strToArr(res.data.p_cons_type));
          that.setData({
            ['xmInfo.p_cons_type']: gzClass
          })
        })
      }
      wx.hideLoading();
    })
  },
  //举报有奖
  report: function(e) {
    let pid = e.currentTarget.dataset.pid;
    wx.navigateTo({
      url: '../report/index?pid=' + pid
    })
  },
  //查看发包方详情
  lookFbf: function(e) {
    let cid = e.currentTarget.dataset.cid
    wx.navigateTo({
      url: '../fbfInfo/index?cid=' + cid
    })
  },
  //查看附件
  lookFujian: function() {
    wx.navigateTo({
      url: '../lookFuJian/index'
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.lookXMInfo(options.pid);
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