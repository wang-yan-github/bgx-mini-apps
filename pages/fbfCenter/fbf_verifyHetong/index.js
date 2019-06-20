// pages/fbfCenter/tsYyLW_hetongQueren.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '包大侠',
    time: '2018-12-01',
    images: [],
    isfankui: false,
    bid: -1,
    fankui: '',
    wpid: -1
  },
  hetong_ok: function() {
    var data = {};
    data.token = app.globalData.token;
    data.w_pid = this.data.wpid;
    data.audit = 1;
    console.log("发包方确认合同参数=" + JSON.stringify(data));
    app.ajax.req('company_api_controller/companyContractOk', data, 'GET', function(res) {
      if (parseInt(res.errorCode) === 200) {
        wx.showToast({
          title: '确认成功',
          duration: 1000
        })
        setTimeout(function() {
          wx.navigateBack();
        }, 1500)
      }
    })
  },
  fankuiSubmit: function() {
    var data = {};
    data.token = app.globalData.token;
    data.w_pid = this.data.wpid;
    data.audit = 2;
    data.content = this.data.fankui;

    app.ajax.req('company_api_controller/companyContractOk', data, 'GET', function(res) {
      if (parseInt(res.errorCode) === 200) {
        wx.showToast({
          title: '反馈成功',
          duration: 1000
        })
        setTimeout(function() {
          wx.navigateBack();
        }, 1500)
      }
    })
  },
  fankui: function(e) {
    var fankui = e.detail.value;
    this.setData({
      fankui: fankui
    })
    var data = {};
    data.token = app.globalData.token;
    //  data.
  },
  hideFankui: function() {
    this.setData({
      isfankui: !this.data.isfankui
    })
  },
  hetong_error: function() {
    this.setData({
      isfankui: !this.data.isfankui
    })
  },
  //点击合同图片预览
  previewImage: function(e) {
    var arr = [];
    for (let i = 0; i < this.data.images.length; i++) {
      arr.push(this.data.images[i].img);
    }
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接  
      urls: arr // 需要预览的图片http链接列表  
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    that.setData({
      wpid: options.wpid
    })
    var bid = options.bid;
    var data = {};
    data.token = app.globalData.token;
    data.b_id = bid;
    data.type = 9;
    app.ajax.req('contract_api_controller/contractLook', data, 'GET', function(res) {
      console.log("发包方确认合同res= " + JSON.stringify(res));
      if (parseInt(res.errorCode) === 200) {
        that.setData({
          name: res.data.HtName,
          time: res.data.UpTime,
          images: res.data.imgs
        })
      }
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