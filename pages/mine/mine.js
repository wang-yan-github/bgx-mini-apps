// pages/mine/mine.js
let app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    name: "",
    phone: "",
    perfectStatus: 102,
    role: "",
    itemNumber: 3,
    isfbf: true,
    isbgx: true,
    islw: true,
    //是否实名
    authentica: "",
    touxiang: '',
    x_total: '',
    l_total: ''
  },
  //基本信息
  infoMore: function() {
    let role = wx.getStorageSync('role');
    if (role == 1) {
      wx.navigateTo({
        url: '/pages/fbfCenter/fbf_info/index',
      })
    } else if (role == 2) {
      wx.navigateTo({
        url: '/pages/bgxCenter/bgx_info/index',
      })
    } else if (role == 3) {
      wx.navigateTo({
        url: '/pages/lwCenter/lw_info/index',
      })
    }

  },
  certification: function() {
    wx.navigateTo({
      url: 'certification/certification',
    })
  },
  setting: function() {
    wx.navigateTo({
      url: 'setting/setting',
    })
  },
  switchRoles: function() {
    wx.navigateTo({
      url: 'switchRoles/switchRoles',
    })
  },
  team: function() {
    wx.navigateTo({
      url: 'team/team',
    })
  },
  // 江湖信用
  credibility: function() {
    let role = wx.getStorageSync('role') ? wx.getStorageSync('role') : 2;
    console.log("角色roleIndex=" + role);
    if (role == 1) {
      wx.navigateTo({
        url: "/pages/creditLife/fbf_credit/index",
      })
    } else if (role == 2) {
      wx.navigateTo({
        url: "/pages/creditLife/personalCredit/index",
      })
    } else if (role == 3) {
      wx.navigateTo({
        url: '/pages/creditLife/personalCredit/index',
      })
    }
  },
  //平台推广
  expand: function() {
    wx.navigateTo({
      url: 'expand/expand',
    })
  },
  //我的钱包
  wallet: function() {
    wx.navigateTo({
      url: 'wallet/wallet',
    })
  },
  //我的帖子
  myDiscover: function() {
    wx.navigateTo({
      url: 'myDiscover/index',
    })
  },
  //我的收藏
  myCollection: function() {
    wx.navigateTo({
      url: 'myCollection/index',
    })
  },
  //项目管理
  xmgl: function() {
    let role = wx.getStorageSync('role') ? wx.getStorageSync('role') : 2;
    if (role == 1) {
      wx.navigateTo({
        url: '/pages/fbfCenter/fbf_xmgl/index',
      })
    } else if (role == 2) {
      wx.navigateTo({
        url: '/pages/bgxCenter/bgx_xmgl/index',
      })
    } else if (role == 3) {
      wx.navigateTo({
        url: '/pages/lwCenter/lw_xmgl/index',
      })
    }
  },
  //劳务管理
  lwgl: function() {
    let role = wx.getStorageSync('role') ? wx.getStorageSync('role') : 2;
    if (role == 1) {
      wx.navigateTo({
        url: '/pages/fbfCenter/fbf_lwgl/index',
      })
    } else if (role == 2) {
      wx.navigateTo({
        url: '/pages/bgxCenter/bgx_lwgl/index',
      })
    }
  },
  //发布项目
  fbxm: function() {
    if (this.data.perfectStatus == 100) {
      wx.showToast({
        title: '信息未完善，不能发布项目',
        icon: 'none'
      })
      return false;
    } else if (this.data.perfectStatus == 101) {
      wx.showToast({
        title: '信息待审核，不能发布项目',
        icon: 'none'
      })
      return false;
    }
    let role = wx.getStorageSync('role') ? wx.getStorageSync('role') : 2;
    console.log("role=" + role);
    if (role == 1) {
      wx.navigateTo({
        url: "/pages/fbfCenter/selectFbfs/index"
      })
    }
  },
  //包管管
  bgg: function() {
    let role = wx.getStorageSync('roleIndex') ? wx.getStorageSync('roleIndex') : app.globalData.roleIndex;
    if (role == 0) {
      wx.navigateTo({
        url: '../mine/bgg_zrr/index',
      })
    } else {
      wx.navigateTo({
        url: '../mine/bgg_xmjl/index',
      })
    }
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
    //判断是否登录
    app.isLogin(function() {
      let name = wx.getStorageSync("username") ? wx.getStorageSync("username") : '游客';
      let phone = wx.getStorageSync("phonePwd") ? wx.getStorageSync("phonePwd") : '';
      let perfectStatus = app.globalData.perfectStatus;
      let authentica = app.globalData.authentica;
      let touxiang = app.globalData.touxiang;
      if (authentica == 1) {
        that.setData({
          authentica: "已实名"
        })
      } else {
        that.setData({
          authentica: "未实名"
        })
      }
      that.setData({
        name: name,
        phone: phone,
        perfectStatus: perfectStatus,
        touxiang: touxiang
      })
      let role = wx.getStorageSync('role') ? wx.getStorageSync('role') : 2;
      if (role == 1) {
        that.setData({
          isfbf: true,
          isbgx: false,
          islw: true,
          itemNumber: 4,
          role: "发包方"
        })
      } else if (role == 2) {
        that.setData({
          isfbf: false,
          isbgx: true,
          islw: true,
          itemNumber: 4,
          role: "包工侠"
        })
      } else {
        that.setData({
          isfbf: false,
          isbgx: false,
          islw: false,
          itemNumber: 2,
          role: "劳务"
        })
      }
      let data = {};
      data.token = app.globalData.token;
      app.ajax.req('message_api_controller/bgxPushList', data, 'POST', function(res) {
        if (Number.parseInt(res.errorCode) === 200) {
          that.setData({
            x_total: res.data.x_total,
            l_total: res.data.l_total
          })
          //马上调用消息条数
          clearTimeout(app.globalData.xiaoxiTime);
          app.showXiaoxiTotal();
        }
      })
    });
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