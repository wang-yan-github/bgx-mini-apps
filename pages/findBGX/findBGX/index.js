// pages/findBGX/findBGX/index.js
let cityData = require('../../../utils/area.js');
let util = require('../../../utils/util.js');
let codeToTextArr = util.codeToTextArr;
let strToArr = util.strToArr;
let textArrToCode = util.textArrToCode;
let app = getApp();
import {
  $wuxBackdrop
} from '../../vux/index';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //角色类型
    type: 2,
    //搜索文本
    searchText: '',
    //筛选项配置-----------------------开始
    // 下拉菜单
    tabList: [{
      itemshow: '行业',
      itemhide: ''
    }, {
      itemshow: '区域',
      itemhide: ''
    }, {
      itemshow: '认证',
      itemhide: ''
    }, {
      itemshow: '筛选',
      itemhide: ['', '', '']
    }],
    _num: 0,
    //筛选单项选择配置----------------------开始
    tab_item1: [],
    _res1: 0,
    clickOne1: 'clickOne1',
    tab_item2: ['不限', '已实名', '未实名'],
    _res2: 0,
    clickOne2: 'clickOne2',
    //筛选左中右结构配置------------------------------开始
    //每个分项的默认索引
    selected_index1: 0,
    selected_index2: 0,
    selected_index3: 0,
    //左边选项的配置
    cityleft: cityData.area,
    //中间选项
    citycenter: {},
    //右边选项
    cityright: {},
    // 更多筛选配置
    shaixuan: [{
      title: '从业年限',
      name: [{
        name: '不限',
        type: 0
      }, {
        name: '2年内',
        type: 0
      }, {
        name: '2年到5年',
        type: 0
      }, {
        name: '5年到10年',
        type: 0
      }, {
        name: '10年以上',
        type: 0
      }]
    }, {
      title: '工作状态',
      name: [{
        name: '不限',
        type: 1
      }, {
        name: '空闲',
        type: 1
      }, {
        name: '忙碌',
        type: 1
      }]
    }],
    //更多筛选分项的默认索引
    shaixuan_: [0, 0, 0, 0],
    //下拉的显示与隐藏
    displays: "none",
    //默认的tab项
    currentTab: 0,
    //列表数据
    lwList: [],
    //工程类型
    technicalType_text: [],
    technicalType_skey: "technicalType",
    //分页
    offset: 1,
    total: 0,
    searchNum: 0,
    //背景幕
    locks: 0,
  },
  //搜索栏键盘输入时触发
  searchTextonChange(e) {
    this.setData({
      searchText: e.detail.value,
      searchNum: 0
    })
    var that = this;
    //筛选调用
    that.tab_shaixuan();
  },
  //搜索栏点击清除图标时触发
  searchTextonClear(e) {
    this.setData({
      searchText: '',
      searchNum: 0
    })
    var that = this;
    //筛选调用
    that.tab_shaixuan();
  },
  //头部tabs
  tabList: function(index) {
    return this.data.tabList[index].itemhide;
  },
  //筛选调用
  tab_shaixuan: function() {
    let that = this;
    let shaixuan1 = this.data.tabList[3].itemhide[0];
    let shaixuan2 = this.data.tabList[3].itemhide[1];
    let shaixuan3 = this.data.tabList[3].itemhide[2];
    that.listShow(that, shaixuan3, shaixuan1, shaixuan2, that.tabList(1), that.tabList(2), that.data.searchText, that.tabList(0), that.tabList(0));
    this.hideNav();
  },
  //项目列表展示
  //level -- 工种等级
  //workTime -- 工作年限
  //workerStatus -- 工作状态
  //region -- 区域
  //authentica -- 认证状态
  //name -- 姓名
  //consType -- 工种类型
  //technicalType -- 工程类型
  listShow: function(that, level, workTime, workerStatus, region, authentica, name, consType, technicalType) {
    //第一次搜索，数组清空
    if (!that.data.searchNum) {
      that.setData({
        lwList: [],
        offset: 1
      })
    }
    var data = {};
    data.offset = that.data.searchNum == 0 ? 1 : that.data.offset;
    data.limit = 6;
    data.level = level;
    data.workTime = workTime;
    data.workerStatus = workerStatus;
    data.region = region;
    data.authentica = authentica;
    data.name = name;
    data.type = that.data.type;
    if (that.data.type == 2) {
      data.technicalType = technicalType;
      data.consType = "";
    } else {
      data.technicalType = "";
      data.consType = consType;
    }
    wx.showLoading({
      title: '加载中',
    })
    app.ajax.req('homepage_api_controller/homeWorkerList', data, 'POST', function(res) {
      if (parseInt(res.errorCode) === 200) {
        //对搜索进行处理searchNum
        if (that.data.searchText || res.data.list.length || that.tabList(3)[0] || that.tabList(3)[1] || that.tabList(3)[2] || that.tabList(0) || that.tabList[1] || that.tabList(2)) {
          //没有内容提示
          if (res.data.total == 0) {
            wx.showToast({
              title: '还没有项目符合您的筛选条件,请继续关注',
              icon: 'none',
              duration: 2000
            })
            return false;
          }
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
          that.setData({
            lwList: that.data.lwList.concat(arr),
            offset: that.data.offset + 1,
            total: res.data.total,
            searchNum: that.data.searchNum + 1
          })
        } else {
          if (that.data.searchText) {
            that.setData({
              lwlist: []
            })
          }
        }
      }
      wx.hideLoading();
    })
  },
  //查看包工侠详情
  item_click: function(e) {
    let that = this;
    app.isLogin(function() {
      let wid = e.currentTarget.dataset.wid;
      wx.navigateTo({
        url: '../bgxInfo/index?wid=' + wid + '&type=' + that.data.type,
      })
    })
  },
  //下拉和背景幕隐藏
  hideNav: function() {
    this.setData({
      displays: "none"
    })
    this.$wuxBackdrop.release();
    this.setData({
      locks: this.$wuxBackdrop.backdropHolds
    })
  },
  // tab切换
  tabNav: function(e) {
    //下拉和背景幕显示
    if (!this.data.locks) {
      this.setData({
        displays: "block"
      })
      this.$wuxBackdrop.retain();
      this.setData({
        locks: this.$wuxBackdrop.backdropHolds
      })
    }

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
  // 下拉左中右结构切换 ----------------开始
  selectleft: function(e) {
    var that = this;
    //左边选择的索引
    that.setData({
      selected_index1: e.target.dataset.index
    })
    var cityleft = that.data.cityleft;
    for (var item_ in cityleft) {
      if (cityleft[item_].value == e.target.dataset.code) {
        that.setData({
          // cityright: {},
          citycenter: cityleft[item_].children,
        });
      }
    }
  },
  //地区中间选择
  selectcenter: function(e) {
    const that = this;
    //给头部tab赋值
    let item = "tabList[" + 1 + "].itemshow";
    let item1 = "tabList[" + 1 + "].itemhide";
    if (e.currentTarget.dataset.name.length > 3) {
      var value = e.currentTarget.dataset.name.substring(0, 3) + "...";
      this.setData({
        [item]: value,
        [item1]: e.currentTarget.dataset.code,
      })
    } else {
      this.setData({
        [item]: e.currentTarget.dataset.name,
        [item1]: e.currentTarget.dataset.code,
        selected_index3: e.target.dataset.index
      })
    }
    that.setData({
      searchNum: 0
    })
    //筛选调用
    that.tab_shaixuan();
  },

  //单项选择
  clickOne1: function(e) {
    let that = this;
    that.setData({
      _res1: e.target.dataset.index
    })
    if (that.data.type == 2) {
      let technical_type = that.data.tab_item1[e.target.dataset.index];
      app.onLoadData('technicalType', function(data) {
        let hideText = textArrToCode(data, strToArr(technical_type))
        //给头部tab赋值
        let item = "tabList[" + 0 + "].itemshow";
        let item1 = "tabList[" + 0 + "].itemhide";
        if (e.currentTarget.dataset.name.length > 3) {
          let value = e.currentTarget.dataset.name.substring(0, 3) + "...";
          that.setData({
            [item]: value,
            [item1]: hideText,
          })
        } else {
          that.setData({
            [item]: e.currentTarget.dataset.name,
            [item1]: hideText == "technicalType_00" ? '' : hideText
          })
        }
      })
    } else {
      let consType = that.data.tab_item1[e.target.dataset.index];
      app.onLoadData('consType', function(data) {
        let hideText = textArrToCode(data, strToArr(consType))
        //给头部tab赋值
        let item = "tabList[" + 0 + "].itemshow";
        let item1 = "tabList[" + 0 + "].itemhide";
        if (e.currentTarget.dataset.name.length > 3) {
          let value = e.currentTarget.dataset.name.substring(0, 3) + "...";
          that.setData({
            [item]: value,
            [item1]: hideText,
          })
        } else {
          that.setData({
            [item]: e.currentTarget.dataset.name,
            [item1]: hideText == "consType_00" ? '' : hideText
          })
        }
      })
    }
    that.setData({
      searchNum: 0
    })
    //筛选调用
    that.tab_shaixuan();
  },
  //单项选择
  clickOne2: function(e) {
    let that = this;
    that.setData({
      _res2: e.target.dataset.index
    })
    //给头部tab赋值
    var item = "tabList[" + 2 + "].itemshow";
    var item1 = "tabList[" + 2 + "].itemhide";
    let authentica = that.data.tab_item2[e.target.dataset.index];
    let hideText = "";
    if (authentica == "已实名") {
      hideText = 1;
    } else if (authentica == "未实名") {
      hideText = 0;
    }
    that.setData({
      [item]: e.target.dataset.name,
      [item1]: hideText
    })
    that.setData({
      searchNum: 0
    })
    //筛选调用
    that.tab_shaixuan();
  },

  // 更多筛选
  shuanxuan_click: function(e) {
    var index = e.currentTarget.dataset.index; //获取自定义的ID值
    if (e.currentTarget.dataset.type == 0) {
      this.data.shaixuan_[0] = index;
      this.setData({
        shaixuan_: this.data.shaixuan_
      })

    } else if (e.currentTarget.dataset.type == 1) {
      this.data.shaixuan_[1] = index;
      this.setData({
        shaixuan_: this.data.shaixuan_
      })
    } else if (e.currentTarget.dataset.type == 2) {
      this.data.shaixuan_[2] = index;
      this.setData({
        shaixuan_: this.data.shaixuan_
      })
    } else if (e.currentTarget.dataset.type == 3) {
      this.data.shaixuan_[3] = index;
      this.setData({
        shaixuan_: this.data.shaixuan_
      })
    }
    let index1 = this.data.shaixuan_[0];
    let index2 = this.data.shaixuan_[1];
    let index3 = this.data.shaixuan_[2];
    let shaixuan1 = this.data.shaixuan[0].name[index1].name;
    let shaixuan2 = this.data.shaixuan[1].name[index2].name;
    let shaixuan3 = "";
    if (this.data.shaixuan.length == 3) {
      shaixuan3 = this.data.shaixuan[2].name[index3].name;
    }

    let arr = [];
    if (shaixuan1 == "不限") {
      shaixuan1 = "";
    } else {
      shaixuan1 = shaixuan1;
    }
    arr.push(shaixuan1);
    if (shaixuan2 == "空闲") {
      shaixuan2 = 0;
    } else if (shaixuan2 == "忙碌") {
      shaixuan2 = 1;
    } else {
      shaixuan2 = "";
    }
    arr.push(shaixuan2);
    if (shaixuan3 == "普工") {
      shaixuan3 = "level_01";
    } else if (shaixuan3 == "初级工") {
      shaixuan3 = "level_02";
    } else if (shaixuan3 == "中级工") {
      shaixuan3 = "level_03";
    } else if (shaixuan3 == "高级工") {
      shaixuan3 = "level_04";
    } else if (shaixuan3 == "技师") {
      shaixuan3 = "level_04";
    } else {
      shaixuan3 = "";
    }
    arr.push(shaixuan3);
    this.setData({
      'tabList[3].itemhide': arr
    })
  },
  queren: function() {
    //筛选
    console.log("筛选条件", this.data.tabList[3].itemhide);
    var that = this;
    that.setData({
      searchNum: 0
    })
    //筛选调用
    that.tab_shaixuan();
  },
  qingchu: function() {
    //筛选
    var that = this;
    let item7 = "tabList[" + 3 + "].itemhide";
    that.setData({
      [item7]: ['', '', '', ''],
      shaixuan_: [0, 0, 0, 0]
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    //背景幕
    that.$wuxBackdrop = $wuxBackdrop("#backdrop");
    let type = options.type;
    that.setData({
      type: type
    })
    //改变行业或工种
    if (type == 2) {
      //包工侠
      app.onLoadData('technicalType', function(data) {
        let data1 = [];
        for (let i = 0; i < data.length; i++) {
          data1.push(data[i].name);
        }
        that.setData({
          tab_item1: data1,
          lwList: [],
          isbottom: false
        })
        //筛选调用
        that.tab_shaixuan();
      })
    } else {
      //劳务
      wx.setNavigationBarTitle({
        title: '找劳务',
      })
      app.onLoadData('consType', function(data) {
        let data1 = [];
        for (let i = 0; i < data.length; i++) {
          data1.push(data[i].name);
        }
        let zhicheng = {
          title: '职称等级',
          name: [{
            name: '不限',
            type: 2
          }, {
            name: '普工',
            type: 2
          }, {
            name: '初级工',
            type: 2
          }, {
            name: '中级工',
            type: 2
          }, {
            name: '高级工',
            type: 2
          }, {
            name: '技师',
            type: 2
          }]
        }
        that.data.shaixuan.push(zhicheng);
        that.setData({
          ['tabList[0].itemshow']: "工种",
          tab_item1: data1,
          lwList: [],
          isbottom: false,
          shaixuan: that.data.shaixuan
        })
        //筛选调用
        that.tab_shaixuan();
      })
    }
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
    var that = this;
    console.log('上拉', that.data.offset)
    if (that.data.offset > Math.ceil(that.data.total / 6)) {
      wx.showToast({
        title: '没有更多',
        icon: 'none'
      })
      return;
    }
    //筛选调用
    that.tab_shaixuan();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
})