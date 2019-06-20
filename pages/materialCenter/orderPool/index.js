// pages/AmyTest/cascader/index.js
var util = require("../../../utils/util.js");
var getAreaText = util.getAreaText;
const materialList = require("../materialList/materialList.js").materialList;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shuaiXuan: false,
    // 区域编码
    region_code: "",
    // 地区
    region_text: "",
    // 区域组件位置
    position: "top",
    // 是否打开地区
    visible: false,
    // 时间 true 升序 false 降序
    timeUpDown: false,
    // 顶部选项区list
    currTopItem: -1,
    topList: [
      {
        id: 0,
        type: "oneTrg",
        label: "品名",
      },
      {
        id: 1,
        type: "twoTrg",
        label: "时间",
      },
      {
        id: 2,
        type: "oneTrg",
        label: "地区",
      },
      {
        id: 3,
        type: "oneTrg",
        label: "筛选",
      }
    ],
    // 品名列表
    pmList: [
      {
        name: '火灾报警',
        key: 0,
        checked: false,
        children: [
          {
            key: 0,
            name: '探测器',
            checked: false,
          },
          {
            key: 1,
            name: '报警按钮',
            checked: false,
          },
          {
            key: 2,
            name: '报警主机',
            checked: false,
          },
          {
            key: 3,
            name: '感温电缆',
            checked: false,
          },
          {
            key: 4,
            name: '输出模块',
            checked: false,
          },
          {
            key: 5,
            name: '输入模块',
            checked: false,
          },
        ]
      },
      {
        name: '火灾防护',
        key: 1,
        checked: false,
        children: [
          {
            key: 0,
            name: '防火门',
            checked: false,
          },
          {
            key: 1,
            name: '防火窗',
            checked: false,
          },
          {
            key: 2,
            name: '防火卷帘',
            checked: false,
          },
          {
            key: 3,
            name: '防火涂料',
            checked: false,
          },
          {
            key: 4,
            name: '防火玻璃',
            checked: false,
          },
          {
            key: 5,
            name: '排烟风机',
            checked: false,
          },
        ]
      },
      {
        name: '灭火设备',
        key: 2,
        checked: false,
        children: [
          {
            key: 0,
            name: '喷淋头',
            checked: false,
          },
          {
            key: 1,
            name: '报警阀',
            checked: false,
          },
          {
            key: 2,
            name: '灭火剂',
            checked: false,
          },
          {
            key: 3,
            name: '消火栓',
            checked: false,
          },
          {
            key: 4,
            name: '灭火器',
            checked: false,
          },
          {
            key: 5,
            name: '消防箱',
            checked: false,
          },
          {
            key: 6,
            name: '消防水带',
            checked: false,
          },
        ]
      },
      {
        name: '消防设备',
        key: 3,
        checked: false,
        children: [
          {
            key: 0,
            name: '防火服',
            checked: false,
          },
          {
            key: 1,
            name: '消防靴',
            checked: false,
          },
          {
            key: 2,
            name: '呼吸器',
            checked: false,
          },
          {
            key: 3,
            name: '缓降器',
            checked: false,
          },
          {
            key: 4,
            name: '破拆工具',
            checked: false,
          },
          {
            key: 5,
            name: '消防梯',
            checked: false,
          },
          {
            key: 6,
            name: '消防头盔',
            checked: false,
          },
          {
            key: 7,
            name: '消防手套',
            checked: false,
          },
        ]
      }
    ],
    // 二级列表
    pmchildrenList: [],
    // 当前一级产品索引
    currOneIndex: -1,
    // 当前二级产品索引
    currTwoIndex: -1,
    pm_show: false,
    oneText: "",
    twoText: "",


    // 产品列表
    prodList: [],

  },
  // 品名点击一级菜单
  onOneItem: function (e) {
    let index = e.currentTarget.dataset.index;
    let pmList = this.data.pmList;//选项集合
    let pmchildrenList = [];
    let oneText = "";

    if (pmList[index].checked) return;//如果点击的当前已选中则直接返回

    pmList.forEach(item => {
      item.checked = false
    })
    pmList[index].checked = true;//改变当前选中的checked值以及获取相应的值
    oneText = pmList[index].name;
    pmchildrenList = pmList[index].children;
    // 切换一级栏目的时候要清除之前选中的二级焦点
    pmchildrenList.forEach(item2 => {
      item2.checked = false
    })
    console.log("oneText==" + oneText + ",,pmchildrenList=" + pmchildrenList);
    this.setData({
      oneText,
      pmchildrenList,
      pmList,
      twoText: "",
    })
  },
  // 品名点击二级级菜单
  onTwoItem: function (e) {
    let index = e.currentTarget.dataset.index;
    let pmchildrenList = this.data.pmchildrenList;//子选项集合
    let twoText = "";

    if (pmchildrenList[index].checked) return;//如果点击的当前已选中则直接返回
    pmchildrenList.forEach(item => {
      item.checked = false
    })
    pmchildrenList[index].checked = true;//改变当前选中的checked值以及获取相应的值
    twoText = pmchildrenList[index].name;
    console.log("twoText==" + twoText);
    this.setData({
      twoText,
      pmchildrenList,
    })
  },
  // 点击品名蒙层
  onPmMask: function () {
    this.setData({
      pm_show: false
    })
  },
  // 品名确定按钮
  onPmComfirm: function () {
    console.log("所选的值=" + this.data.oneText + "," + this.data.twoText);
    this.setData({
      pm_show: false
    })
  },
  // 品名重置按钮
  onPmReset: function () {
    let pmList = this.data.pmList;
    let pmchildrenList = this.data.pmchildrenList;

    pmList.forEach(item1 => {
      item1.checked = false
    })
    pmchildrenList.forEach(item2 => {
      item2.checked = false
    })
    this.setData({
      pmList,
      pmchildrenList,
      oneText: "",
      twoText: ""
    })
  },
  // 顶部选项栏点击事件
  onTopItem: function (e) {
    var index = e.currentTarget.dataset.index;
    // 从非价格选到价格时设置默认升序
    this.setData({
      currTopItem: index
    })
    console.log(index);
    if (index == 0) {
      this.setData({
        pm_show: true,
        timeUpDown: false
      })
    }
    else if (index == 1) {
      console.log("点击了时间降序升序");
      this.setData({
        pm_show: false,
        timeUpDown: !this.data.timeUpDown
      })
    }
    else if (index == 2) {
      console.log("点击了地区");
      this.setData({
        visible: true,
        pm_show: false,
        timeUpDown: false
      })
    }
    else if (index == 3) {
      console.log("筛选");
      
    }
  },
  // 打开地区组件
  onOpenArea() {
    this.setData({
      visible: true,
      // address_code: this.data.defaultValue
    })
    console.log("打开地区组件");
  },
  // 列表点击
  onClickOrder: function (e) {
    let spid = e.currentTarget.dataset.spid;
    wx.navigateTo({
      url: '../orderPoolDet/index?spid=' + spid,
    })
  },
  // 设置区域
  onGetArea: function (e) {
    let topList = this.data.topList;
    let region_text = getAreaText(e.detail.region_code);
    topList[this.data.currTopItem].label = region_text;
    console.log("地区设置==" + region_text);
    this.setData({
      topList,
      region_code: e.detail.region_code,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  
  onLoad: function (options) {
    this.getScreeHeight();
    let pmchildrenList = [];
    if (this.data.currOneIndex != -1) {
      pmchildrenList = this.data.pmList[this.data.currOneIndex].children
    }
    else {
      pmchildrenList = this.data.pmList[0].children
    }
    this.setData({
      pmchildrenList: pmchildrenList,
      prodList: materialList
    })
  },
  // 获取屏幕高度
  getScreeHeight: function () {
    let that = this;
    wx.getSystemInfo({
      success(res) {
        that.setData({
          windowHeight: res.windowHeight
        })
        console.log(res.windowHeight)
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})