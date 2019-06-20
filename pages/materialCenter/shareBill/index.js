// pages/AmyTest/cascader/index.js
var util = require("../../../utils/util.js");
var getAreaText = util.getAreaText;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 区域编码
    region_code: "",
    // 地区
    region_text: "",
    // 区域组件位置
    position: "top",
    // 是否打开地区
    visible: false,
    // 价格 true 升序 false 降序
    priceUpDown: false,
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
        label: "价格",
      },
      {
        id: 2,
        type: "text",
        label: "销量",
      },
      {
        id: 3,
        type: "oneTrg",
        label: "地区",
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
    prodList: [
      // 应急标志灯具
      {
        sp_id: 0,
        sp_img: "http://baogongxia1.oss-cn-shenzhen.aliyuncs.com/bgx-admin/20190125/f443043eb0a04ec9bca09afa0c17d169.png",
        sp_name: "消防应急标志灯具",
        sp_version: "GD-BLJC-2LREⅡ1W-401G",
        sp_sold: "111",
        sp_supplier: "北京原杰",
        sp_storage_location: "四川成都",
        sp_new_price: "190",
        sp_old_price: "200",
        sp_unit: "个",
        sp_industry: "消防器材",
        sp_brand: "时代威盾",
        sp_purchase_num: "100",
        sp_size: "365mmX150mmX28mm，功率两总线制；DC36V电压。",
        sp_receive_time: "2019-08-08",
        sp_abort_time: "2019-06-06",
        sp_purchase_type: "单次采购",
        sp_remark: "无",
        sp_order_status: "待接单",
        sp_nstallation: "吊装双面双向",
        sp_intro: "无",
        sp_types: [
          "原厂", "性价比高"
        ],
      },
      // 应急照明灯具
      {
        sp_id: 1,
        sp_img: "http://baogongxia1.oss-cn-shenzhen.aliyuncs.com/bgx-admin/20190125/7cb840bee17446b4ae258dd2575cc58a.png",
        sp_name: "消防应急照明灯具",
        sp_version: "GD-ZFJC-E5W-601G5",
        sp_sold: "222",
        sp_supplier: "北京原杰",
        sp_storage_location: "四川成都",
        sp_new_price: "280",
        sp_old_price: "290",
        sp_unit: "个",
        sp_industry: "消防器材",
        sp_brand: "时代威盾",
        sp_purchase_num: "100",
        sp_size: "265mmX240mmX45mm，功率两总线制；DC36V电压。",
        sp_receive_time: "2019-08-08",
        sp_abort_time: "2019-06-06",
        sp_purchase_type: "单次采购",
        sp_remark: "无",
        sp_order_status: "报价中",
        sp_nstallation: "壁挂",
        sp_intro: "无",
        sp_types: [
          "原厂", "性价比高"
        ],
      },
      // 碟阀
      {
        sp_id: 2,
        sp_img: "http://baogongxia1.oss-cn-shenzhen.aliyuncs.com/bgx-admin/20190125/b1d5c5ec37ab4bb28989c34d921f69ce.png",
        sp_name: "球墨铸铁蝶阀",
        sp_version: "DN200",
        sp_sold: "222",
        sp_supplier: "北京原杰",
        sp_storage_location: "四川成都",
        sp_new_price: "610",
        sp_old_price: "620",
        sp_unit: "套",
        sp_industry: "消防器材",
        sp_brand: "时代威盾",
        sp_purchase_num: "50",
        sp_size: "无",
        sp_receive_time: "2019-08-08",
        sp_abort_time: "2019-06-06",
        sp_purchase_type: "单次采购",
        sp_remark: "无",
        sp_order_status: "待接单",
        sp_nstallation: "无",
        sp_intro: "无",
        sp_types: [
          "原厂", "性价比高"
        ],
      },
      // 闸阀
      {
        sp_id: 3,
        sp_img: "http://baogongxia1.oss-cn-shenzhen.aliyuncs.com/bgx-admin/20190125/75dd61f147eb48fb9397270355045aad.png",
        sp_name: "球墨铸铁闸阀",
        sp_version: "DN300",
        sp_sold: "222",
        sp_supplier: "北京原杰",
        sp_storage_location: "四川成都",
        sp_new_price: "3160",
        sp_old_price: "3167",
        sp_unit: "套",
        sp_industry: "消防器材",
        sp_brand: "时代威盾",
        sp_purchase_num: "80",
        sp_size: "无",
        sp_receive_time: "2019-08-08",
        sp_abort_time: "2019-06-06",
        sp_purchase_type: "单次采购",
        sp_remark: "明杆",
        sp_order_status: "报价中",
        sp_nstallation: "无",
        sp_intro: "无",
        sp_types: [
          "原厂", "性价比高"
        ],
      },
      // 水表
      {
        sp_id: 4,
        sp_img: "http://baogongxia1.oss-cn-shenzhen.aliyuncs.com/bgx-admin/20190125/3336b5112c224de89510c86ce86693e2.png",
        sp_name: "水表",
        sp_version: "DN150",
        sp_sold: "222",
        sp_supplier: "北京原杰",
        sp_storage_location: "四川成都",
        sp_new_price: "550",
        sp_old_price: "560",
        sp_unit: "个",
        sp_industry: "消防器材",
        sp_brand: "甬欣",
        sp_purchase_num: "200",
        sp_size: "无",
        sp_receive_time: "2019-08-08",
        sp_abort_time: "2019-06-06",
        sp_purchase_type: "单次采购",
        sp_remark: "无",
        sp_order_status: "待接单",
        sp_nstallation: "无",
        sp_intro: "无",
        sp_types: [
          "原厂", "性价比高"
        ],
      },
      // 普通消防栓
      {
        sp_id: 5,
        sp_img: "http://baogongxia1.oss-cn-shenzhen.aliyuncs.com/bgx-admin/20190125/6fd5925a80ae4bada5cbcbbb2975ef35.png",
        sp_name: "普通消防栓",
        sp_version: "SN65",
        sp_sold: "555",
        sp_supplier: "北京原杰",
        sp_storage_location: "四川成都",
        sp_new_price: "65",
        sp_old_price: "68",
        sp_unit: "个",
        sp_industry: "消防器材",
        sp_brand: "双龙",
        sp_purchase_num: "200",
        sp_size: "无",
        sp_receive_time: "2019-08-08",
        sp_abort_time: "2019-06-06",
        sp_purchase_type: "单次采购",
        sp_remark: "无",
        sp_order_status: "报价中",
        sp_nstallation: "无",
        sp_intro: "无",
        sp_types: [
          "原厂", "性价比高"
        ],
      },
      // 消防水带
      {
        sp_id: 6,
        sp_img: "http://baogongxia1.oss-cn-shenzhen.aliyuncs.com/bgx-admin/20190125/a0d20e0097be449ea23eab38c3956763.png",
        sp_name: "消防水带",
        sp_version: "25米",
        sp_sold: "123",
        sp_supplier: "北京原杰",
        sp_storage_location: "四川成都",
        sp_new_price: "120",
        sp_old_price: "125",
        sp_unit: "个",
        sp_industry: "消防器材",
        sp_brand: "百应",
        sp_purchase_num: "200",
        sp_size: "无",
        sp_receive_time: "2019-08-08",
        sp_abort_time: "2019-06-06",
        sp_purchase_type: "单次采购",
        sp_remark: "无",
        sp_order_status: "待接单",
        sp_nstallation: "无",
        sp_intro: "无",
        sp_types: [
          "原厂", "性价比高"
        ],
      },
    ],
  },
  // 列表点击
  onClickItem: function (e) {
    let spid = e.currentTarget.dataset.spid;
    console.log("供应商spid=" + spid);
    wx.navigateTo({
      url: '../productDetail/index?spid=' + spid,
    })
  },
  // 点击一级菜单
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
  // 点击二级级菜单
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
        priceUpDown: false
      })
    }
    else if (index == 1) {
      console.log("点击了价格降序升序");
      this.setData({
        pm_show: false,
        priceUpDown: !this.data.priceUpDown
      })
    }
    else if (index == 2) {
      console.log("点击了销量排序");
      this.setData({
        pm_show: false,
        priceUpDown: false
      })
    }
    else if (index == 3) {
      this.setData({
        visible: true,
        pm_show: false,
        priceUpDown: false
      })
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
    let pmchildrenList = [];
    if (this.data.currOneIndex != -1) {
      pmchildrenList = this.data.pmList[this.data.currOneIndex].children
    }
    else {
      pmchildrenList = this.data.pmList[0].children
    }
    this.setData({
      pmchildrenList: pmchildrenList
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