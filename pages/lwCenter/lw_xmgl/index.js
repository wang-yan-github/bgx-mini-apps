var app = getApp();
Page({
  isShow: true,
  currentTab: 0,
  data: {
    // 下拉菜单
    tabList: [{
      itemshow: '来源',
      itemhide: ''
    }, {
      itemshow: '状态',
      itemhide: ''
    }, {
      itemshow: '认证',
      itemhide: ''
    }],
    _res: 0,
    _res1: 0,
    _res2: 0,
    //筛选单项选择
    tab_item: ['不限', '推送', '预约'],
    tab_item1: ['不限', '发包方待确认', '包工侠待确认', '包工侠已拒绝', '劳务待确认', '劳务已拒绝', '项目待完善', '合同待包工侠上传', '合同待发包方确认', '发包方已拒绝', '合同待审核', '合同待修改', '已签约', '施工中', '待完工', '施工完'],
    tab_item2: ['不限', '已认证', '未认证'],
    //推送预约项目列表
    listData: [],
    //项目列表操作按钮的显示与隐藏
    oprator_show: false,
    oprator_index: 0,
    offset: 1,
    //搜索栏
    searchText: '',
    total: 1
  },
  //搜索栏键盘输入时触发
  searchTextonChange(e) {
    this.setData({
      searchText: e.detail.value,
      listData: [],
      offset: 1
    })
    var that = this;
    //that.tsYyXmShow(that, that.data.offset, e.detail.value);
  },
  //搜索栏点击清除图标时触发
  searchTextonClear(e) {
    this.setData({
      searchText: '',
      listData: [],
      offset: 1
    })
    var that = this;
    that.tsYyXmShow(that, that.data.offset, e.detail.value);
  },
  // 操作按钮的显示与隐藏
  oprator_toggle: function(e) {
    this.setData({
      oprator_show: !this.data.oprator_show,
      oprator_index: e.currentTarget.dataset.index
    })
  },
  //包工侠推送预约项目列表展示
  tsYyXmShow: function(that, offset, p_name) {
    wx.showLoading({
      title: '加载中',
    })
    var data = {};
    data.token = app.globalData.token;
    data.offset = offset;
    data.limit = 10;
    data.name = p_name;
    console.log("劳务项目列表展示参数=" + JSON.stringify(data));
    app.ajax.req('workerproject_api_controller/workerBespeakList', data, 'GET', function(res) {
      console.log("劳务项目管理返回值=" + JSON.stringify(res));
      if (parseInt(res.errorCode) === 200) {
        that.setData({
          listData: res.data.list,
          total: res.data.total,
          offset: that.data.offset + 1
        })
      }

      wx.hideLoading();
    })

  },
  //操作按钮处理
  opratorTap: function(e) {
    var that = this;
    var text = e.currentTarget.dataset.text;
    var wid = e.currentTarget.dataset.wid;
    var pid = e.currentTarget.dataset.pid;
    var bid = e.currentTarget.dataset.bid;
    var laiyuan = e.currentTarget.dataset.laiyuan;
    var status = e.currentTarget.dataset.status;
    var wpid = e.currentTarget.dataset.wpid;
    if (text == "详情") {
      if (!pid) {
        wx.showToast({
          title: '项目待包工侠完善,请联系',
          icon: 'none'
        })
        return;
      }
      wx.navigateTo({
        url: 'lw_tsYyXM_xiangq?pid=' + pid
      })
    } else if (text == "确认") {
      //劳务待确认
      if (status == "劳务待确认") {
        wx.showModal({
          title: '确认？',
          content: '是否要接受当前项目？请谨慎操作，当前操作不可逆',
          confirmText: "确认",
          cancelText: "返回",
          success: function(res) {
            if (res.confirm) {
              //判断来源
              if (laiyuan == "系统推送") {
                wx.showLoading({
                  title: '加载中',
                })
                var data = {};
                data.token = app.globalData.token;
                data.b_id = bid;
                app.ajax.req('workerproject_api_controller/workerAndworOk', data, 'GET', function(res) {
                  if (parseInt(res.errorCode) === 200) {
                    wx.showToast({
                      title: '操作成功',
                      duration: 1000
                    })
                    setTimeout(function() {
                      //刷新页面
                      that.onShow();
                    }, 1500)
                  }
                  wx.hideLoading();
                })
              } else { //主动预约
                var data = {};
                data.token = app.globalData.token;
                data.b_id = bid;
                app.ajax.req('workerproject_api_controller/workerOk', data, 'GET', function(res) {
                  if (parseInt(res.errorCode) === 200) {
                    wx.showToast({
                      title: '操作成功',
                      duration: 1000
                    })
                    setTimeout(function() {
                      //刷新页面
                      that.onShow();
                    }, 1500)
                  }
                })
              }
            } else {
              console.log('用户点击辅助操作')
            }
          }
        });
      }
    } else if (text == "关闭") {
      wx.showModal({
        title: '关闭',
        content: '注意：您正在关闭这个项目，请谨慎操作，这个操作不可逆！',
        confirmText: "确定",
        cancelText: "返回",
        success: function(res) {
          if (res.confirm) {
            console.log('确定')
            var data = {};
            data.token = app.globalData.token;
            data.b_id = bid;
            app.ajax.req('workerproject_api_controller/bgxworkerclose', data, 'GET', function(res) {
              if (parseInt(res.errorCode) === 200) {
                wx.showToast({
                  title: '关闭成功',
                  duration: 1000
                })
                setTimeout(function() {
                  //刷新页面
                  that.onShow();
                }, 1500);
              }
            })
          } else {
            console.log('返回')
          }
        }
      });
    } else if (text == "上传") {
      wx.navigateTo({
        url: '../../bgxCenter/bgx_upHetong/index?wpid=' + wpid + '&type_=1'
      })
    } else if (text == "修改") { //修改合同
      wx.navigateTo({
        url: 'bgx_editHetong?wpid=' + wpid + '&bid=' + bid + '&type_=' + 1
      })
    } else if (text == "施工") {
      wx.showModal({
        title: '确认施工',
        content: '注意：请确认当前项目已经开始施工？',
        confirmText: '确认施工',
        cancelText: '返回',
        success: function(res) {
          if (res.confirm) {
            var data = {};
            data.token = app.globalData.token;
            data.w_pid = wpid;
            app.ajax.req('workerproject_api_controller/workerCon', data, 'GET', function(res) {
              if (parseInt(res.errorCode) === 200) {
                wx.showToast({
                  title: '确认施工',
                  duration: 1000
                })
                setTimeout(function() {
                  //刷新页面
                  that.onShow();
                }, 1500)
              }
            })
          }
        }
      })
    } else if (text == "推劳务") {
      wx.navigateTo({
        url: 'bgx_tsYyLW_tuiLW?wpid=' + wpid,
      })
    } else if (text == "写日志") {
      wx.navigateTo({
        url: '../lw_logs/index?wpid=' + wpid,
      })
    } else if (text = "完工") {
      wx.showModal({
        title: '确认完工',
        content: '注意：请确认当前项目是否已完工？',
        confirmText: "确定完工",
        cancelText: "返回",
        success: function(res) {
          console.log(res);
          if (res.confirm) {
            console.log('确定')
            var data = {};
            data.token = app.globalData.token;
            data.w_pid = wpid;
            app.ajax.req('workerproject_api_controller/workerFinished', data, 'GET', function(res) {
              if (parseInt(res.errorCode) === 200) {
                wx.showToast({
                  title: '确认完工'
                });
                setTimeout(function() {
                  //刷新页面
                  that.onShow();
                }, 1500)
              }
            })
          } else {
            console.log('返回')
          }
        }
      });
    }
    //取消最新状态
    let data = {};
    data.token = app.globalData.token;
    data.bid = bid;
    app.ajax.req('message_api_controller/saveList', data, 'POST', function (res) {
      if (Number.parseInt(res.errorCode) === 200) {
        console.log('取消劳务最新状态');
      }
    })
  },
  // 下拉切换
  hideNav: function() {
    this.setData({
      displays: "none"
    })
  },
  // tab切换
  tabNav: function(e) {
    this.setData({
      displays: "block"
    })
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {

      var showMode = e.target.dataset.current == 0;

      this.setData({
        currentTab: e.target.dataset.current,
        isShow: showMode
      })
    }
  },
  // 筛选单选
  clickHouse: function(e) {
    this.setData({
      _res: e.target.dataset.index
    })
    //给头部tab赋值
    var item = "tabList[" + 0 + "].itemshow";
    this.setData({
      [item]: e.target.dataset.name
    })
    this.setData({
      displays: "none"
    })
  },
  clickHouse1: function(e) {
    this.setData({
      _res1: e.target.dataset.index
    })
    //给头部tab赋值
    var item1 = "tabList[" + 1 + "].itemshow";
    this.setData({
      [item1]: e.target.dataset.name
    })
    this.setData({
      displays: "none"
    })
  },
  clickHouse2: function(e) {
    this.setData({
      _res2: e.target.dataset.index
    })
    //给头部tab赋值
    var item2 = "tabList[" + 2 + "].itemshow";
    this.setData({
      [item2]: e.target.dataset.name
    })
    this.setData({
      displays: "none"
    })
  },
  onLoad: function(options) {

  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.onShow();
    setTimeout(function() {
      wx.stopPullDownRefresh();
    }, 100);
  },
  //页面显示刷新页面
  onShow: function() {
    var that = this;
    //展示劳务列表
    that.tsYyXmShow(that, 1, '');
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var that = this;
    //改变分页
    // if (that.data.isXiala) { //可以下拉
    // var offset = that.data.offset + 1;
    // that.setData({
    //   offset: offset,
    //   isXiala: false
    // })
    // var b_type = that.data.tab_item[that.data._res];
    // var l_creditrating = that.data.tab_item1[that.data._res1];
    // var b_status = that.data.tab_item2[that.data._res2];
    // if (b_type == "不限") {
    //   b_type = '';
    // }
    // if (l_creditrating == "不限") {
    //   l_creditrating = '';
    // }
    // if (b_status == "不限") {
    //   b_status = '';
    // }
    if (that.data.offset > Math.ceil(that.data.total / 10)) {
      wx.showToast({
        title: '没有更多',
        icon: 'none'
      })
      return;
    }
    that.tsYyLwShow(that, that.data.offset, that.data.searchText)
    // }
  },
})