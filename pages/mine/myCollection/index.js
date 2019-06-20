// pages/mine/myCollection/index.js
let util = require('../../../utils/util.js');
let codeToTextArr = util.codeToTextArr;
let strToArr = util.strToArr;
let textArrToCode = util.textArrToCode;
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    //更多话题的显示和隐藏
    isMore: false,
    //选中话题索引
    more1_index: -1,
    //评论内容
    pinglun_content: '',
    pinglun_index: '',
    pinglunData: [],
    //展开索引
    zhankai_index: '',
    //上拉刷新控制状态
    // isTopfresh: false,
    //列表分页
    // offset: 1,
    //底线
    // isbottom: false,
    //总页数
    // total: 1,
    isDianzan: true,
    //是否收藏
    isShouchang: true,
    //删除按钮的显示与隐藏
    del: true,
    //关注的显示和隐藏
    focus: false,
    //回复
    reply: '',
    //评论页数
    pinglun_offset: 1,
    //回复页数
    replyLimit: 1,
    type: 0
  },
  //删除帖子
  discover_del: function(e) {
    let that = this;
    wx.showModal({
      title: '删除提醒',
      content: '注意：这个操作不可逆',
      confirmText: "确认删除",
      cancelText: "返回",
      success: function(res) {
        console.log(res);
        if (res.confirm) {
          let data = {};
          data.token = app.globalData.token;
          data.cf_id = e.currentTarget.dataset.cfid;
          app.ajax.req('circle_friends_api_controller/remove', data, 'POST', function(res) {
            if (Number.parseInt(res.errorCode) === 200) {
              wx.showToast({
                title: '删除成功',
                icon: 'none'
              })
              that.onLoad();
            }
          });
        } else {
          // console.log('用户点击辅助操作')
        }
      }
    });
  },
  //评论输入内容
  pinglun_content: function(e) {
    this.setData({
      pinglun_content: e.detail.value
    })
  },
  //点击头像查看详情
  cookInfo: function(e) {
    let role = e.currentTarget.dataset.role;
    let wid = e.currentTarget.dataset.wid;
    if (role == 1) {
      wx.navigateTo({
        url: '/pages/findXM/fbfInfo/index?wid=' + wid
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
                let pinglunData = that.data.pinglunData;
                for (let j = 0; j < pinglunData.length; j++) {
                  if (pinglunData[j].c_id == cid) {
                    let followNum = 'pinglunData[' + j + '].c_followNum';
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
                let pinglunData = that.data.pinglunData;
                for (let j = 0; j < pinglunData.length; j++) {
                  if (pinglunData[j].c_id == cid) {
                    let followNum = 'pinglunData[' + j + '].c_followNum';
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
      if (!that.data.isCollection) { //收藏
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
      data.r_id = reply.id ? reply.id : '';
      if (reply.id) {
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
        url: '../../findBGX/bgxInfo/index?wid=' + wid + '&type=' + type,
      })
    })
  },
  //查看项目项目详情
  click_item: function(e) {
    app.isLogin(function() {
      let pid = e.currentTarget.dataset.pid;
      wx.navigateTo({
        url: '../../findXM/xmInfo/index?pid=' + pid
      })
    });
  },
  //收藏列表展示
  listShow: function() {
    let that = this;
    let data = {};
    data.token = app.globalData.token;
    data.offset = 1;
    data.limit = 20;
    data.type = that.data.type;
    wx.showLoading({
      title: '加载中',
    })
    app.ajax.req('collection_api_controller/collectionList', data, 'POST', function(e) {
      if (Number.parseInt(e.errorCode) === 200) {
        that.setData({
          list: e.data.cflist
        })
        let list = that.data.list;
        if (list.length == 0){
          wx.showToast({
            title: '没有相关收藏',
            icon: 'none'
          })
          return false;
        }
        for (let i = 0; i < list.length; i++) {
          if (list[i].type == 2) {
            //项目区域或工种类型解析
            app.onLoadData('technicalType', function(data) {
              that.setData({
                ['list[' + i + '].technical_type']: codeToTextArr(data, strToArr(list[i].technical_type)),
                ['list[' + i + '].region']: util.getAreaText(list[i].region)
              })
            })
          } else if (list[i].type == 4 || list[i].type == 5) {
            app.onLoadData('technicalType', function(data) {
              that.setData({
                ['list[' + i + '].technical_type']: codeToTextArr(data, strToArr(list[i].technical_type)),
                ['list[' + i + '].work_address']: util.getAreaText(list[i].work_address)
              })
            })

          }
        }
      }
      wx.hideLoading();
    })
  },
  //收藏搜索
  labelClick: function(e) {
    let type = e.currentTarget.dataset.type;
    this.setData({
      list: [],
      type: type
    })
    this.listShow();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.listShow();
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
    this.setData({
      type: 0,
      list: []
    })
    this.listShow();
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