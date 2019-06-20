//index.js
//获取应用实例
const app = getApp();
var util = require('../../utils/util.js');
let codeToTextArr = util.codeToTextArr;
let strToArr = util.strToArr;
let textArrToCode = util.textArrToCode;
Page({
  data: {
    //banner参数开始
    imgUrls: ['http://baogongxia1.oss-cn-shenzhen.aliyuncs.com/banner/index1.jpg',
      'http://baogongxia1.oss-cn-shenzhen.aliyuncs.com/banner/index2.jpg',
      'http://baogongxia1.oss-cn-shenzhen.aliyuncs.com/banner/index3.jpg',
      'http://baogongxia1.oss-cn-shenzhen.aliyuncs.com/banner/index4.jpg'
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    //banner参数结束
    //推广跑马灯
    gonggao_content: '华侨城发布项目了。   地铁一号线工程开始招标了。  包工侠陈**发布了一条招工信息。  恭喜张包工侠在平台上承接了星辰国际项目',
    //功能按钮
    "grids": [{
        url: "/pages/icons/findXM.png",
        name: "找项目",
        method: "findXM"
      },
      {
        url: "/pages/icons/findBGX.png",
        name: "找包工侠",
        method: "findBGX"
      },
      {
        url: "/pages/icons/findWorker.png",
        name: "找劳务",
        method: "findLW"
      },
      {
        url: "/pages/icons/findMaterials.png",
        name: "拼材料",
        method: "pincailiao"
      },
      {
        url: "/pages/icons/creditLife.png",
        name: "信用生活",
        method: "creditLife"
      }
    ],
    // 今日任务
    myTask: ["今天搬500皮砖", "铺10m的路"],
    //悬浮按钮开始
    visible: false,
    position: 'bottomRight',
    theme: 'assertive',
    buttons: [{
        label: '登录',
        icon: "/pages/icons/login.png",
      },
      {
        label: '发帖',
        icon: "/pages/icons/fatie.png",
      },
      {
        label: '发布项目',
        icon: "/pages/icons/fabu.png",
      }
    ],
    //帖子列表
    dataList: [],
    //选中话题索引
    more1_index: -1,
    //评论内容
    pinglun_content: '',
    pinglun_index: '',
    pinglunData: [],
    //展开索引
    zhankai_index: '',
    //上拉刷新控制状态
    isTopfresh: false,
    //列表分页
    offset: 1,
    //底线
    isbottom: false,
    //总页数
    total: 1,
    isDianzan: true,
    isShouchang: true,
    //背景幕
    locks: 0,
    //删除按钮的显示与隐藏
    del: true,
    //关注的显示和隐藏
    focus: true,
    //悬浮按钮结束
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    shareId: '',
    refresh: 1,
    //暂时
    xmlist: [],
    lwList1: [],
    lwList2: []
  },
  //评论输入内容
  pinglun_content: function(e) {
    this.setData({
      pinglun_content: e.detail.value
    })
  },
  //点击头像查看详情
  cookInfo: function(e) {
    app.isLogin(function() {
      let role = e.currentTarget.dataset.role;
      let wid = e.currentTarget.dataset.wid;
      let perStatus = e.currentTarget.dataset.perstatus;
      if (Number.parseInt(perStatus) !== 102) {
        wx.showToast({
          title: '此信息未完善',
          icon: 'none'
        })
        return false;
      }
      if (role == 1) {
        wx.navigateTo({
          url: '/pages/findXM/fbfInfo/index?cid=' + wid
        })
      } else if (role == 2) {
        wx.navigateTo({
          url: '/pages/findBGX/bgxInfo/index?wid=' + wid + '&type=' + 2
        })
      } else if (role == 3) {
        wx.navigateTo({
          url: '/pages/findBGX/bgxInfo/index?wid=' + wid + '&type=' + 3
        })
      }
    })
  },
  //关注
  focus: function(e) {
    let that = this;
    app.isLogin(function() {
      let role = e.currentTarget.dataset.role;
      let wid = e.currentTarget.dataset.wid;
      if (app.globalData.infoId == wid) {
        wx.showToast({
          title: '请不要关注自己',
          icon: 'none'
        })
        return false;
      }
      let isConcern = e.currentTarget.dataset.isconcern;
      if (isConcern) {
        //关注过，取消关注
        that.offFocus(that, wid, role);
      } else {
        //未关注过，关注
        that.onFocus(that, wid, role);
      }
    })
  },
  //取消关注
  offFocus: function(that, wid, role) {
    let data = {};
    data.token = app.globalData.token;
    data.bs_id = wid;
    data.bs_type = role;
    app.ajax.req('circle_friends_api_controller/removeConcern', data, 'POST', function(res) {
      if (Number.parseInt(res.errorCode) == 200) {
        wx.showToast({
          title: '取消关注',
        })
        //初始化关注
        that.initFocus(that, wid);
      }
    })
  },
  //关注
  onFocus: function(that, wid, role) {
    let data = {};
    data.token = app.globalData.token;
    data.bs_id = wid;
    data.bs_type = role;
    app.ajax.req('circle_friends_api_controller/w_follow', data, 'POST', function(res) {
      if (Number.parseInt(res.errorCode) == 200) {
        wx.showToast({
          title: '已关注',
        })
        //初始化关注
        that.initFocus(that, wid);
      }
    })
  },
  //初始化关注状态
  initFocus: function(that, wid) {
    let list = that.data.dataList;
    for (let i = 0; i < list.length; i++) {
      if (list[i].cf_wId == wid) {
        let focus = 'dataList[' + i + '].isConcern';
        that.setData({
          [focus]: !that.data.dataList[i].isConcern
        })
      }
    }
  },
  //点赞
  dianzan: function(e) {
    let that = this;
    let cfid = e.currentTarget.dataset.cfid;
    let cid = e.currentTarget.dataset.cid ? e.currentTarget.dataset.cid : '';
    app.isLogin(function() {
      //查询点赞状态
      that.isFollow(that, cfid, cid);
    })
  },
  //查询是否点赞
  isFollow: function(that, cfid, cid) {
    let data = {};
    if (!that.data.isDianzan) {
      wx.showToast({
        title: '操作过于频繁',
        icon: 'none'
      })
      return;
    }
    //锁定按钮
    that.setData({
      isDianzan: false
    })
    data.token = app.globalData.token;
    data.cf_id = cfid;
    data.c_id = cid;
    //查询点赞状态
    app.ajax.req('circle_friends_api_controller/isFollow', data, 'POST', function(res) {
      if (parseInt(res.errorCode) === 200) {
        //是否已点赞
        that.setData({
          dianzan: res.data.isCollection
        })

        //判断为文章的评论点赞
        if (cid) {
          //如果没有被点赞
          if (!that.data.dianzan) {
            app.ajax.req('circle_friends_api_controller/follow', data, 'POST', function(res) {
              if (parseInt(res.errorCode) === 200) {
                let pinglunData = that.data.pinglunData.clist;
                for (let j = 0; j < pinglunData.length; j++) {
                  if (pinglunData[j].c_id == cid) {
                    let followNum = 'pinglunData.clist[' + j + '].c_followNum';
                    that.setData({
                      [followNum]: parseInt(pinglunData[j].c_followNum) + 1
                    })
                  }
                }
              }
              //解锁按钮
              that.setData({
                isDianzan: true
              })
            })
          } else {
            //被点过赞了
            app.ajax.req('circle_friends_api_controller/removeFollow', data, 'POST', function(res) {
              if (parseInt(res.errorCode) === 200) {
                let pinglunData = that.data.pinglunData.clist;
                for (let j = 0; j < pinglunData.length; j++) {
                  if (pinglunData[j].c_id == cid) {
                    let followNum = 'pinglunData.clist[' + j + '].c_followNum';
                    that.setData({
                      [followNum]: parseInt(pinglunData[j].c_followNum) - 1
                    })
                  }
                }
              }
              //解锁按钮
              that.setData({
                isDianzan: true
              })
            })
          }
        } else {
          //如果没有被点赞
          if (!that.data.dianzan) {
            app.ajax.req('circle_friends_api_controller/follow', data, 'POST', function(res) {
              if (parseInt(res.errorCode) === 200) {
                for (let i = 0; i < that.data.dataList.length; i++) {
                  if (that.data.dataList[i].cf_id == cfid) {
                    let num = 'dataList[' + i + '].cf_followNum';
                    that.setData({
                      [num]: parseInt(that.data.dataList[i].cf_followNum) + 1
                    })
                    console.log(that.data.dataList[i]);
                  }
                }
              }
              //解锁按钮
              that.setData({
                isDianzan: true
              })
            })
          } else {
            //被点过赞了
            app.ajax.req('circle_friends_api_controller/removeFollow', data, 'POST', function(res) {
              if (parseInt(res.errorCode) === 200) {
                for (let i = 0; i < that.data.dataList.length; i++) {
                  if (that.data.dataList[i].cf_id == cfid) {
                    let num = 'dataList[' + i + '].cf_followNum';
                    that.setData({
                      [num]: parseInt(that.data.dataList[i].cf_followNum) - 1
                    })
                  }
                }
              }
              //解锁按钮
              that.setData({
                isDianzan: true
              })
            })
          }
        }
      } else {
        //网络出错
        //解锁按钮
        that.setData({
          isDianzan: true
        })
      }
    })
  },
  //帖子分享
  onShareAppMessage: function(res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      let cfid = res.target.dataset.cfid;
      let text = res.target.dataset.text;
      let images = res.target.dataset.images.length != 0 ? res.target.dataset.images[0].img : null;
      return {
        title: text,
        path: '/pages/discover/discover/index?cfid=' + cfid, // 路径，传递参数到指定页面。
        imageUrl: images
      }
    }
  },
  //帖子收藏
  shoucang: function(e) {
    var that = this;
    if (!that.data.isShouchang) {
      wx.showToast({
        title: '操作过于频繁',
        icon: 'none'
      })
      return false;
    }
    //是否登录
    app.isLogin(function() {
      //锁定控件
      that.setData({
        isShouchang: false
      })
      //查询收藏状态
      let cfid = e.currentTarget.dataset.cfid;
      let isCollection = e.currentTarget.dataset.collection;
      let data1 = {};
      data1.token = app.globalData.token;
      data1.c_Id = cfid;
      if (!isCollection) { //收藏
        data1.type = 1;
        app.ajax.req('collection_api_controller/collectionSave', data1, 'POST', function(res) {
          if (parseInt(res.errorCode) === 200) {
            for (let i = 0; i < that.data.dataList.length; i++) {
              if (that.data.dataList[i].cf_id == cfid) {
                let isCollection = 'dataList[' + i + '].isCollection';
                that.setData({
                  [isCollection]: true
                })
              }
            }
          }
          //解锁控件
          that.setData({
            isShouchang: true
          })
        })
      } else {
        app.ajax.req('collection_api_controller/removeCollection', data1, 'POST', function(res) {
          if (parseInt(res.errorCode) === 200) {
            for (let i = 0; i < that.data.dataList.length; i++) {
              if (that.data.dataList[i].cf_id == cfid) {
                let isCollection = 'dataList[' + i + '].isCollection';
                that.setData({
                  [isCollection]: false
                })
              }
            }
          }
          //解锁控件
          that.setData({
            isShouchang: true
          })
        })
      }
    })
  },
  //点击评论展示详情
  pinglun_: function(e) {
    let that = this;
    let cfid = e.currentTarget.dataset.cfid;
    let isPinglun = e.currentTarget.dataset.pinglun;
    if (that.data.pinglun_index == cfid) {
      //同一个帖子
      if (isPinglun) {
        that.setData({
          pinglun_index: -1
        })
        return;
      } else {
        //查看更多评论
        that.setData({
          pinglun_offset: that.data.pinglun_offset + 1
        })
        let limit = that.data.pinglun_offset * 2;
        that.cookXiangq(that, cfid, limit);
      }
    } else {
      that.setData({
        pinglun_index: cfid,
        pinglun_content: '',
        pinglun_offset: 1
      })
      let limit = 2;
      that.cookXiangq(that, cfid, limit);
    }
  },
  //评论
  pinglunSubmit: function(e) {
    var that = this;
    app.isLogin(function() {
      let data = {};
      let reply = that.data.reply;
      let cfid = e.currentTarget.dataset.cfid;
      data.token = app.globalData.token;
      data.cf_id = cfid;
      data.r_id = reply ? reply.id : '';
      if (reply) {
        let nameStr = '@' + reply.name;
        let nameLength = nameStr.length;
        data.content = that.data.pinglun_content.substring(nameLength);
      } else {
        data.content = that.data.pinglun_content;
      }
      //对发布内容进行判断
      let content = util.trim(data.content);
      if (!content) {
        wx.showModal({
          title: '文字为空',
          content: '文字不能为空',
          confirmText: "重新输入",
          cancelText: "返回",
          success: function(res) {
            if (res.confirm) {
              console.log('重新输入');
            } else {
              wx.navigateBack();
            }
          }
        })
      } else {
        wx.showLoading({
          title: '上传中',
        })
        app.ajax.req('circle_friends_api_controller/commentArticle', data, 'POST', function(res) {
          wx.hideLoading();
          if (parseInt(res.errorCode) === 200) {
            for (let i = 0; i < that.data.dataList.length; i++) {
              if (that.data.dataList[i].cf_id == cfid) {
                let num = 'dataList[' + i + '].cf_replyNum';
                that.setData({
                  [num]: parseInt(that.data.dataList[i].cf_replyNum) + 1
                })
              }
            }
            that.setData({
              pinglun_content: ''
            })
            setTimeout(function() {
              that.cookXiangq(that, e.currentTarget.dataset.cfid, that.data.pinglun_offset * 2);
            }, 3000)
          }
        })
      }
    });
  },
  //回复评论
  reply: function(e) {
    let that = this;
    app.isLogin(function() {
      let name = e.currentTarget.dataset.name;
      let id = e.currentTarget.dataset.id;
      that.setData({
        reply: {
          name: name,
          id: id
        },
        pinglun_content: '@' + name
      })
    })
  },
  //查看回复或更多回复
  lookReply: function(e) {
    let that = this;
    let cid = e.currentTarget.dataset.cid;
    let isreply = e.currentTarget.dataset.isreply;
    let data = {};
    data.c_id = cid;
    data.offset = 1;
    //判断是否是外层回复
    if (isreply) {
      data.limit = 2;
      that.setData({
        replyLimit: 1
      })
    } else {
      that.setData({
        replyLimit: that.data.replyLimit + 1
      })
      data.limit = that.data.replyLimit * 2
    }
    app.ajax.req('circle_friends_api_controller/infoCommentReply', data, 'POST', function(res) {
      if (Number.parseInt(res.errorCode) === 200) {
        let clist = that.data.pinglunData.clist;
        for (let i = 0; i < clist.length; i++) {
          //初始化
          // delete that.data.pinglunData.clist[i].rlist;
          if (clist[i].c_id == cid) {
            let rlist = 'pinglunData.clist[' + i + '].rlist';
            that.setData({
              [rlist]: res.data.rlist
            })
          }
        }
      }
    })
  },
  //查看单个帖子详情
  cookXiangq: function(that, cfid, limit) {
    let data = {};
    data.cf_id = cfid;
    data.offset = 1;
    data.limit = limit;
    wx.showLoading({
      title: '加载中',
    })
    app.ajax.req('circle_friends_api_controller/circleFriendsInfo', data, 'POST', function(res) {
      if (parseInt(res.errorCode) === 200) {
        that.setData({
          pinglunData: res.data.cfMap
        })
      }
      wx.hideLoading();
    })
  },
  //图片预览
  previewImage: function(e) {
    var arr = [];
    var imgs = e.currentTarget.dataset.imags;
    for (let i = 0; i < imgs.length; i++) {
      arr.push(imgs[i].img);
    }
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: arr // 需要预览的图片http链接列表
    })
  },
  //帖子文字的展开与隐藏
  zhankai: function(e) {
    var that = this;
    var cfid = e.currentTarget.dataset.cfid;
    if (!that.data.zhankai_index) {
      that.setData({
        zhankai_index: cfid
      })
    } else {
      that.setData({
        zhankai_index: ''
      })
    }
  },
  //点击悬浮按钮处理
  buttonClicked(e) {
    const {
      index
    } = e.detail
    //登录
    if (index === 0) {
      wx.navigateTo({
        url: '/pages/login/ipone/index',
      })
    } else if (index === 1) { //发布项目
      app.isLogin(function() {
        wx.navigateTo({
          url: '/pages/discover/discover_fabu/index',
        })
      })
    } else {
      //再跳转到发布项目页面
      if (wx.getStorageSync('role') == 1 && app.globalData.perfectStatus == 1) {
        wx.navigateTo({
          url: '/pages/fbfCenter/issuexm/index',
        })
      } else {
        wx.showToast({
          title: '请切换成发包方角色再发布项目',
          icon: 'none'
        })
      }
    }
  },
  //加载列表
  show_tiezi: function(that, offset, topic) {
    let data = {};
    data.offset = offset;
    data.limit = 6;
    data.topic = topic;
    data.token = app.globalData.token ? app.globalData.token : '';
    data.id = that.data.shareId;
    wx.showLoading({
      title: '加载中'
    })
    app.ajax.req('circle_friends_api_controller/circleFriendsList', data, 'POST', function(res) {
      if (parseInt(res.errorCode) !== 200) {
        that.setData({
          isTopfresh: false,
          isbottom: true
        })
      } else {
        if (res.data.cflist.length > 0) {
          that.setData({
            dataList: that.data.dataList.concat(res.data.cflist),
            isTopfresh: true,
            isbottom: true,
            total: res.data.total
          })
        } else {
          that.setData({
            isTopfresh: false,
            isbottom: true
          })
        }
      }
      wx.hideLoading();
    })
  },
  //找项目
  findXM: function() {
    wx.navigateTo({
      url: '../findXM/findXM/index',
    })
  },
  //找包工侠
  findBGX: function() {
    wx.navigateTo({
      url: '../findBGX/findBGX/index?type=2',
    })
  },
  //找劳务
  findLW: function() {
    wx.navigateTo({
      url: '../findBGX/findBGX/index?type=3',
    })
  },
  //打白条
  pincailiao: function() {
    wx.navigateTo({
      url: "/pages/materialCenter/index/index"
    })
  },
  //信用生活
  creditLife: function() {
    wx.navigateTo({
      url: '/pages/creditLife/creditLifeIndex/index',
    })
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function(options) {
    //用户已经登录过
    if (!app.globalData.token && wx.getStorageSync('pwd')) {
      wx.navigateTo({
        url: '../login/ipone/index',
      })
      return;
    }
    let that = this;
    if (options) {
      if (options.cfid) {
        that.setData({
          shareId: options.cfid
        })
      }
    }
    that.setData({
      dataList: []
    })
    if (that.data.more1_index == -1) {
      // that.show_tiezi(that, 1, '');
      //暂时
      this.listShow();
      this.listShow1(2);
      this.listShow1(3);
    }
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        console.log("个人信息", res.userInfo);
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  onShow: function() {
    if (app.globalData.token && this.data.refresh == 1) {
      this.onLoad();
      this.setData({
        refresh: this.data.refresh + 1
      })
    }
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    var that = this;
    that.setData({
      dataList: [],
      offset: 1,
      more1_index: -1,
      isbottom: false,
      isbottomfresh: true
    })
    that.onLoad();
    setTimeout(function() {
      wx.stopPullDownRefresh();
    }, 100);
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var that = this;
    //是否刷新
    if (that.data.isTopfresh) {
      if (that.data.offset > Math.ceil(that.data.total / 6)) {
        wx.showToast({
          title: '没有更多',
          icon: 'none'
        })
        return;
      }
      that.show_tiezi(that, that.data.offset + 1, '');
      that.setData({
        offset: that.data.offset + 1
      })
    }
  },


  //项目展示
  listShow: function() {
    let that = this;
    let data = {};
    data.token = app.globalData.token ? app.globalData.token : '';
    data.offset = 1;
    data.limit = 4;
    data.pColumnPrice = '';
    data.region = '';
    data.fidelity = '';
    data.p_name = '';
    data.technicalType = '';
    data.projectType = '';
    data.inProject = '';
    data.leadTime = '';
    wx.showLoading({
      title: '加载中'
    })
    app.ajax.req('homepage_api_controller/homeProjectList', data, 'POST', function(res) {
      if (parseInt(res.errorCode) === 200) {
        let arr = [];
        for (let i = 0; i < res.data.list.length; i++) {
          let obj = {};
          obj.p_name = res.data.list[i].p_name;
          //工程类型解析
          app.onLoadData('technicalType', function(data) {
            obj.technical_type = codeToTextArr(data, strToArr(res.data.list[i].technical_type));
          })
          obj.authentica = res.data.list[i].authentica;
          obj.add_time = res.data.list[i].add_time;
          obj.p_column_price = res.data.list[i].p_column_price;
          //处理区域
          let quyu = util.getAreaText(res.data.list[i].region);
          obj.region = quyu;
          obj.p_remark = res.data.list[i].p_remark;
          obj.p_id = res.data.list[i].p_id;
          obj.name = res.data.list[i].name;
          obj.headPortrait = res.data.list[i].headPortrait;
          obj.projectType = res.data.list[i].projectType;
          obj.fidelity = res.data.list[i].fidelity;
          obj.inProject = res.data.list[i].inProject;
          arr.push(obj);
        }
        that.setData({
          xmlist: arr
        })
      }
      wx.hideLoading();
    })
  },
  listShow1: function(type) {
    let that = this;
    var data = {};
    data.offset = that.data.searchNum == 0 ? 1 : that.data.offset;
    data.limit = 4;
    data.level = '';
    data.workTime = '';
    data.workerStatus = '';
    data.region = '';
    data.authentica = '';
    data.name = '';
    data.type = type;
    data.technicalType = "";
    data.consType = "";
    wx.showLoading({
      title: '加载中',
    })
    app.ajax.req('homepage_api_controller/homeWorkerList', data, 'POST', function(res) {
      if (parseInt(res.errorCode) === 200) {
        let arr = [];
        // 初始化工程类别文字解析
        for (let i = 0; i < res.data.list.length; i++) {
          let obj = {};
          obj.duty_name = res.data.list[i].duty_name;
          obj.age = res.data.list[i].age;
          obj.type = res.data.list[i].type;
          obj.authentica = res.data.list[i].authentica;
          obj.work_time = res.data.list[i].work_time;
          obj.worker_status = res.data.list[i].worker_status;
          obj.credit_score = res.data.list[i].credit_score;
          app.onLoadData("technicalType", (data) => {
            obj.technical_type = codeToTextArr(data, strToArr(res.data.list[i].technical_type));
          });
          obj.achieveCount = res.data.list[i].achieveCount;
          obj.w_id = res.data.list[i].w_id;
          obj.head_portrait = res.data.list[i].head_portrait;
          //处理区域
          let area = res.data.list[i].region.split(",");
          let quyu = ""
          for (let j = 0; j < area.length; j++) {
            if (j == area.length - 1) {
              quyu += util.getAreaText(area[j]);
            } else {
              quyu += util.getAreaText(area[j]) + " | ";
            }
          }
          obj.work_address = quyu;
          //工种处理
          app.onLoadData('consType', function(data) {
            obj.cons_type = codeToTextArr(data, strToArr(res.data.list[i].cons_type));
          })
          arr.push(obj);
        }
        if (type == 2) {
          that.setData({
            lwList1: arr
          })
        } else {
          that.setData({
            lwList2: arr
          })
        }
      }
      wx.hideLoading();
    })
  },
  tjXM: function() {
    wx.navigateTo({
      url: '/pages/findXM/findXM/index'
    })
  },
  tjBGX: function() {
    wx.navigateTo({
      url: '../findBGX/findBGX/index?type=2',
    })
  },
  tjLW: function() {
    wx.navigateTo({
      url: '../findBGX/findBGX/index?type=3',
    })
  },
  //查看包工侠详情
  item_click: function(e) {
    let that = this;
    app.isLogin(function() {
      let wid = e.currentTarget.dataset.wid;
      let type = e.currentTarget.dataset.type;
      if (type == 4) {
        type = 2;
      } else {
        type = 3;
      }
      wx.navigateTo({
        url: '../findBGX/bgxInfo/index?wid=' + wid + '&type=' + type,
      })
    })
  },
  //查看项目项目详情
  click_item: function(e) {
    app.isLogin(function() {
      let pid = e.currentTarget.dataset.pid;
      wx.navigateTo({
        url: '../findXM/xmInfo/index?pid=' + pid
      })
    });
  }
})