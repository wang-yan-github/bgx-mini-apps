// pages/findXM/findXM/index.js
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
    //搜索文本
    searchText: '',
    //筛选项配置-----------------------开始
    // 下拉菜单
    tabList: [{
      itemshow: '类型',
      itemhide: ''
    }, {
      itemshow: '区域',
      itemhide: ''
    }, {
      itemshow: '金额',
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
    tab_item2: ['不限', '降序', '升序'],
    _res2: 0,
    clickOne2: 'clickOne2',
    //筛选左中右结构配置----------------------开始
    //每个分项的默认索引
    selected_index1: 0,
    selected_index2: 0,
    //左边选项的配置
    cityleft: cityData.area,
    //中间选项
    citycenter: {},
    // 更多筛选配置
    shaixuan: [{
      title: '发包主体',
      name: [{
        name: '不限',
        type: 0
      }, {
        name: '企业',
        type: 0
      }, {
        name: '个人',
        type: 0
      }]
    }, {
      title: '项目是否保真',
      name: [{
        name: '不限',
        type: 1
      }, {
        name: '项目保真',
        type: 1
      }]
    }, {
      title: '项目是否一手',
      name: [{
        name: '不限',
        type: 2
      }, {
        name: '一手项目',
        type: 2
      }]
    }],
    //更多筛选分项的默认索引
    shaixuan_: [0, 0, 0, 0],
    //下拉的显示与隐藏
    displays: "none",
    //默认的tab项
    currentTab: 0,
    //项目列表
    xmlist: [],
    //分页
    searchNum: 0,
    offset: 1,
    //背景幕
    locks: 0,
    //控制滚动
    isScroll: true
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
  //列表展示,参数如下
  //offset ---------页数
  //limit  ---------每页的条数
  //pColumnPrice ------------金额
  //region ---------区域
  //fidelity --------是否保真
  //p_name ---------项目名称
  //technicalType ------------工程类型
  //porject_type -------------发包主体（个人或公司）
  //inProject --------  是否一手项目
  //leadTime --------- 招标截至
  listShow: function(that, pColumnPrice, region, p_name, technicalType, porject_type, fidelity, inProject, leadTime) {
    //第一次搜索，数组清空
    if (!that.data.searchNum) {
      that.setData({
        xmlist: [],
        offset: 1
      })
    }
    let data = {};
    data.token = app.globalData.token ? app.globalData.token : '';
    data.offset = that.data.searchNum == 0 ? 1 : that.data.offset;
    data.limit = 6;
    data.pColumnPrice = pColumnPrice;
    data.region = region;
    data.fidelity = fidelity;
    data.p_name = p_name;
    data.technicalType = technicalType;
    data.projectType = porject_type;
    data.inProject = inProject;
    data.leadTime = '';
    wx.showLoading({
      title: '加载中'
    })
    app.ajax.req('homepage_api_controller/homeProjectList', data, 'POST', function(res) {
      if (parseInt(res.errorCode) === 200) {
        if (that.data.searchText || res.data.list.length || that.tabList(0) || that.tabList(1) || that.tabList(2) || that.tabList(3)[0] || that.tabList(3)[1] || that.tabList(3)[2]) {
          //没有内容提示
          if (res.data.total == 0){
            wx.showToast({
              title: '还没有项目符合您的筛选条件,请继续关注',
              icon: 'none',
              duration: 2000
            })
            return false;
          }
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
            xmlist: that.data.xmlist.concat(arr),
            offset: that.data.offset + 1,
            total: res.data.total,
            searchNum: that.data.searchNum + 1
          })
          console.log(that.data.offset);
        } else {
          if (that.data.searchText) {
            that.setData({
              xmlist: []
            })
          }
        }
      }
      wx.hideLoading();
    })
  },
  //查看项目项目详情
  click_item: function(e) {
    app.isLogin(function() {
      let pid = e.currentTarget.dataset.pid;
      wx.navigateTo({
        url: '../xmInfo/index?pid=' + pid
      })
    });
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
    if (!this.data.locks) {
      //下拉和背景幕显示
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
        [item1]: e.currentTarget.dataset.code
      })
    }
    that.setData({
      searchNum: 0
    })
    //筛选调用
    that.tab_shaixuan();
  },
  //筛选调用
  tab_shaixuan: function() {
    let that = this;
    let shaixuan1 = this.data.tabList[3].itemhide[0];
    let shaixuan2 = this.data.tabList[3].itemhide[1];
    let shaixuan3 = this.data.tabList[3].itemhide[2];
    that.listShow(that, that.tabList(2), that.tabList(1), that.data.searchText, that.tabList(0), shaixuan1, shaixuan2, shaixuan3);
    this.hideNav();
  },
  //单项选择-项目类型
  clickOne1: function(e) {
    //筛选
    var that = this;
    that.setData({
      _res1: e.target.dataset.index
    })
    //得到选择类型
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
      that.hideNav();
    })
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
    let money = that.data.tab_item2[e.target.dataset.index];
    let hideText = "";
    if (money == "降序") {
      hideText = "desc";
    } else if (money == "升序") {
      hideText = "asc";
    } else {
      hideText = ""
    }
    //给头部tab赋值
    var item = "tabList[" + 2 + "].itemshow";
    var item2 = "tabList[" + 2 + "].itemhide";
    this.setData({
      [item]: e.target.dataset.name,
      [item2]: hideText,
      searchNum: 0
    })
    //筛选调用
    that.tab_shaixuan();
    this.hideNav();
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
    let shaixuan3 = this.data.shaixuan[2].name[index3].name;
    let arr = [];
    if (shaixuan1 == "不限") {
      shaixuan1 = "";
    } else if (shaixuan1 == "企业") {
      shaixuan1 = 2;
    } else {
      shaixuan1 = 1;
    }
    arr.push(shaixuan1);
    if (shaixuan2 == "不限") {
      shaixuan2 = "";
    } else {
      shaixuan2 = 1;
    }
    arr.push(shaixuan2);
    if (shaixuan3 == "不限") {
      shaixuan3 = "";
    } else {
      shaixuan3 = 1;
    }
    arr.push(shaixuan3);
    this.setData({
      'tabList[3].itemhide': arr
    })
  },
  //头部tabs
  tabList: function(index) {
    return this.data.tabList[index].itemhide;
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
    that.$wuxBackdrop = $wuxBackdrop("#backdrop");
    //工程类型初始化
    app.onLoadData('technicalType', function(data) {
      let data1 = [];
      for (let i = 0; i < data.length; i++) {
        data1.push(data[i].name);
      }
      that.setData({
        tab_item1: data1,
        xmList: [],
        offset: 0,
        isbottom: false
      })
      //筛选调用
      that.tab_shaixuan();
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
    console.log("背景幕", this.data.locks);
    console.log("背景幕", this);
    var that = this;
    if (that.data.offset > Math.ceil(that.data.total / 10)) {
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

  }
})