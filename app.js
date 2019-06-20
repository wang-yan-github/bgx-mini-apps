//app.js
var http = require('utils/https.js');
const uploadAliyun = require('utils/uploadAliyun.js');
let util = require('utils/util.js');
//websocket
let socketMsgQueue = [];
let isLoading = false;
let heartCheck = {
  timeout: 10000,
  timeoutObj: null,
  serverTimeoutObj: null,
  start: function() {
    //重置定时器
    clearTimeout(this.timeoutObj);
    var self = this;
    var app = getApp();
    this.timeoutObj = setTimeout(function() {
      //在线状态才发送
      if (app.globalData.localSocket.readyState === 1) {
        let data = {};
        let message = {};
        let froms = {};
        let tos = {};
        message.content = '';
        //我的类型 --ID
        let userId = app.globalData.infoId;
        let type_ = wx.getStorageSync('role');
        froms.from = userId;
        froms.type = type_;
        message.froms = froms;
        tos.to = app.globalData.toId;
        tos.type = app.globalData.toType;
        message.tos = tos;
        let date = new Date();
        message.time = util.formatTime1(date);
        data.message = message;
        data.toType = 'HeartBeat';
        app.globalData.localSocket.send({
          data: JSON.stringify(data)
        });
      }
    }, 30000);
  },
};
App({
  onLaunch: function() {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || [];
    logs.unshift(Date.now());
    wx.setStorageSync('logs', logs);
    // 登录
    // wx.login({
    //   success: res => {
    //     // 发送 res.code 到后台换取 o
    //     penId, sessionKey, unionId
    //   }
    // })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo;
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    //websocket
    localSocket: {},
    callback: function() {},
    toId: null,
    toType: null,
    socketClose: false,
    //请求地址
    url: http.url,
    //阿里云上传地址
    uploadUrl: 'https://baogongxia1.oss-cn-shenzhen.aliyuncs.com/',
    //上传返回图片
    uploadList: {},
    //角色
    roles: ["发包方", "包工侠", "劳务"],
    //角色下标
    roleIndex: 1,
    infoId: -1,
    //验证令牌
    token: '',
    //登录状态（是否完善）
    perfectStatus: 0,
    //是否实名
    authentica: 0,
    //全局消息定时器
    xiaoxiTime: '',
    touxiang: '/pages/icons/touxiang.png'
  },
  // 封装的ajax方法
  ajax: {
    req: http.req
  },
  //消息总条数、我的消息总条数
  showXiaoxiTotal: function() {
    let data = {};
    let that = this;
    data.token = that.globalData.token;
    //消息总条数
    that.ajax.req('message_api_controller/myMessageNewTotal', data, 'POST', function(res) {
      if (Number.parseInt(res.errorCode) === 200) {
        clearTimeout(that.globalData.xiaoxiTime);
        that.setTotal((res.data.m_total).toString(), (res.data.s_total).toString());
        that.globalData.perfectStatus = res.data.status;
        that.globalData.xiaoxiTime = setTimeout(function() {
          that.showXiaoxiTotal();
        }, 15000);
      } else {
        wx.hideToast();
      }
    })
  },
  //设置消息总条数
  setTotal: function(messageTotal, wodeTotal) {
    if (Number.parseInt(messageTotal) === 0) {
      let messageTotal = messageTotal > 99 ? '99+' : messageTotal;
      let wodeTotal = wodeTotal > 99 ? '99+' : wodeTotal;
      wx.removeTabBarBadge({
        index: 2
      })
    } else {
      wx.setTabBarBadge({
        index: 2,
        text: messageTotal
      })
    }
    if (Number.parseInt(wodeTotal) === 0) {
      wx.removeTabBarBadge({
        index: 3,
      })
    } else {
      wx.setTabBarBadge({
        index: 3,
        text: wodeTotal,
      })
    }
  },
  //
  showLoad() {
    if (!isLoading) {
      wx.showLoading({
        title: '请稍后',
      })
      isLoading = true
    }
  },
  hideLoad() {
    wx.hideLoading();
    isLoading = false
  },
  //websock
  initSocket() {
    let that = this;
    let userId = that.globalData.infoId;
    let type_ = wx.getStorageSync('role');
    console.log('用户ID' + userId + '角色' + type_);
    //创建websocket链接
    that.globalData.localSocket = wx.connectSocket({
      // url: 'ws://118.24.66.77:9099'
      // url: 'ws://192.168.0.111:9099'
      url: 'wss://api.baogongxia.com:8088'
    })
    //websocket链接打开的时候
    that.globalData.localSocket.onOpen(function(res) {
      console.log('连接已打开！readyState=' + that.globalData.localSocket.readyState);
      //第一次注册
      let data = {};
      let message = {};
      let froms = {};
      let tos = {};
      message.content = '';
      froms.from = userId;
      froms.type = type_;
      message.froms = froms;
      tos.to = that.globalData.toId;
      tos.type = that.globalData.toType;
      message.tos = tos;
      let date = new Date();
      message.time = util.formatTime1(date);
      data.message = message;
      data.toType = 'register';
      that.sendSocketMessage(data);
      while (socketMsgQueue.length > 0) {
        var msg = socketMsgQueue.shift();
        console.log('重新发送数据', msg);
        that.sendSocketMessage(msg);
      }
    })
    //websocket接收消息
    that.globalData.localSocket.onMessage(function(res) {
      that.hideLoad();
      let resData = JSON.parse(res.data);
      console.log('返回的数据', resData);
      //返回的数据为心跳
      if (resData.type == "HeartBeat") {
        that.globalData.localSocket.close({
          success: function(res) {
            console.log('关闭成功', res);
          }
        });
      } else if (resData.type == "register") {
        // console.log('重新创建链接', resData);
      }
      that.globalData.callback(res);
    })
    //websocket发生错误
    that.globalData.localSocket.onError(function(res) {
      console.log('连接发生错误！readyState=' + that.globalData.localSocket.readyState);
      // that.initSocket();
    })
    //websocket关闭
    that.globalData.localSocket.onClose(function(res) {
      console.log('连接已关闭！readyState=' + that.globalData.localSocket.readyState);
      if (!that.globalData.socketClose) {
        that.initSocket();
      }
    })
  },
  //统一发送消息
  sendSocketMessage: function(msg) {
    if (this.globalData.localSocket.readyState === 1) {
      this.showLoad();
      console.log('发送成功的消息', msg);
      this.globalData.localSocket.send({
        data: JSON.stringify(msg)
      })
    } else {
      console.log('发送失败的消息', msg);
      socketMsgQueue.push(msg);
    }
  },
  //获取签名(上传图片的时候会用到)
  getQianming: function(that, dir) {
    //刷新签名
    var that_1 = this;
    uploadAliyun.getFormData(that_1.globalData.token, dir, function(res) {
      that.setData({
        formData: res,
        fileUrl: that_1.globalData.uploadUrl
      })
    })
  },
  //预约函数
  yuyue: function(bs_id, bs_identity, p_id, YyClass) {
    if (YyClass == 1) { //预约项目
      let role = wx.getStorageSync('role');
      if (role == 1) {
        wx.showToast({
          title: '您当前角色是发包方，不能预约项目,如要预约项目，请切换成包工侠或劳务角色',
          icon: 'none',
          duration: 5000
        })
        return;
      }
    }
    var data = {};
    data.token = this.globalData.token;
    data.bs_id = bs_id;
    data.bs_identity = bs_identity;
    data.p_id = p_id;
    this.ajax.req('bespeak_api_controller/companyWorkerBespeak', data, 'POST', function(res) {
      if (parseInt(res.errorCode) === 200) {
        wx.showToast({
          title: res.errorDesc,
          icon: 'none',
          duration: 2000
        })
      } else {
        wx.showToast({
          title: res.errorDesc,
          icon: 'none'
        })
      }
    })
  },
  //得到审核信息
  getShenheInfo: function(that, type) {
    var data = {};
    data.token = this.globalData.token;
    data.offset = 1;
    data.limit = 10;
    data.type = type;
    this.ajax.req('auditor_api_controller/auditorList', data, 'GET', function(res) {
      if (parseInt(res.errorCode) === 200) {
        that.setData({
          shenheInfo: res.data.list
        })
        setTimeout(function() {
          that.getShenheInfo();
        }, 10000);
      }
    })
  },
  //未登录提醒登录函数
  isLogin: function(callback) {
    if (!this.globalData.token) {
      wx.showModal({
        title: '登录提醒',
        content: '您还未登录，请先登录',
        confirmText: "登录",
        cancelText: "返回",
        success: function(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/login/ipone/index',
            })
          } else {
            wx.switchTab({
              url: '/pages/index/index',
            })
          }
        }
      });
    } else {
      callback();
    }
  },
  //判断是否完善信息
  isPerfectInfo: function(callback) {
    if (this.globalData.perfectStatus == 100) {
      wx.showModal({
        title: '完善信息提醒',
        content: '您还未完善信息，请先完善信息',
        confirmText: "去完善",
        cancelText: "返回",
        success: function(res) {
          if (res.confirm) {
            if (wx.getStorageSync('role') == 2) {
              wx.navigateTo({
                url: '/pages/bgxCenter/bgx_info/index',
              })
            } else if (wx.getStorageSync('role') == 3) {
              wx.navigateTo({
                url: '/pages/lwCenter/lw_info/index',
              })
            }
          } else {
            callback(false);
          }
        }
      });
    } else if (this.globalData.perfectStatus == 101) {
      wx.showToast({
        title: '您的完善信息正在审核中',
        icon: 'none'
      })
      callback(false);
    } else {
      callback(true);
    }
  },
  /* 选择 consType 
consType 工种类型
education 学历
nation 民salary 期望薪资族
technicalType 项目类型
salary 期望薪资
level 等级
*/
  onLoadData: function(_skey, _callback) {
    let data = {};
    data.skey = _skey;
    if (wx.getStorageSync(_skey)) {
      _callback(wx.getStorageSync(_skey));
    } else {
      this.ajax.req('public_api_controller/findDictList', data, 'POST', function(res) {
        if (parseInt(res.errorCode) == 200) {
          //保存已经查询的值
          wx.setStorageSync(_skey, res.data);
          _callback(res.data);
        } else {
          console.log("保存失败");
        }
      })
    }
  }
})