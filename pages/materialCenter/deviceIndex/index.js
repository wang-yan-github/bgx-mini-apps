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
            name :'探测器',
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
      // 七氟丙烷灭火系统
      {
        sp_id: 7,
        sp_img: "http://baogongxia1.oss-cn-shenzhen.aliyuncs.com/bgx-admin/20190125/21d56714b01b466493290d33fe2704ec.png",
        sp_banner: "http://baogongxia1.oss-cn-shenzhen.aliyuncs.com/bgx-admin/20190125/d526408ad9ef4ff78b7fd34644f7a2a3.png",
        sp_name: "5.6/4.2七氟丙烷灭火系统",
        sp_version: "无",
        sp_sold: "123",
        sp_supplier: "陕西坚瑞消防工程有限公司",
        sp_storage_location: "四川成都",
        sp_new_price: "价格面议",
        sp_old_price: "125",
        sp_unit: "套",
        sp_industry: "消防器材",
        sp_brand: "无",
        sp_purchase_num: "200",
        sp_size: "无",
        sp_receive_time: "2019-06-08",
        sp_abort_time: "2019-05-12",
        sp_purchase_type: "单次采购",
        sp_remark: "无",
        sp_order_status: "报价中",
        sp_nstallation: "无",
        sp_intro: "七氟丙烷灭火剂的化学分子式为CF3CH FCF3，熔点1310C，沸点16.40C，是一种无色、无味、具有良好的清洁性(在大气中完全消化不留痕)和良好的气相电绝缘性，无毒，不耗损大气臭氧层，是哈龙的取代品，目前在世界和全国范围得到全面推广和广泛使用",
        sp_types: [
          "原厂", "性价比高"
        ],

      },
      // IG521混合型气体灭火系统
      {
        sp_id: 8,
        sp_img: "http://baogongxia1.oss-cn-shenzhen.aliyuncs.com/bgx-admin/20190125/345133cd57d8477182e1fc219ef3e452.png",
        sp_banner: "http://baogongxia1.oss-cn-shenzhen.aliyuncs.com/bgx-admin/20190125/72540f7d20d94361ba8bc0d349be10ef.png",
        sp_name: "IG541混合型气体灭火系统",
        sp_version: "无",
        sp_sold: "123",
        sp_supplier: "陕西坚瑞消防工程有限公司",
        sp_storage_location: "四川成都",
        sp_new_price: "价格面议",
        sp_old_price: "125",
        sp_unit: "套",
        sp_industry: "消防器材",
        sp_brand: "无",
        sp_purchase_num: "200",
        sp_size: "无",
        sp_receive_time: "2019-10-12",
        sp_abort_time: "2019-09-06",
        sp_purchase_type: "单次采购",
        sp_remark: "无",
        sp_order_status: "待接单",
        sp_nstallation: "无",
        sp_intro: "IG-541灭火剂由N2、Ar、CO2三种惰性气体按一定比例混合而成。其ODP=0，使用后以其原有成分回归自然，是一种绿色灭火剂，是哈龙灭火剂的理想替代品。无色无味，不导电、无腐蚀、无环保限制，在灭火过程中无任何分解物。IG541的无毒性反应（NOAEL）浓度为43%，有毒性反应（LOAEL）浓度为52%，I IG541设计浓度一般在37%~43%之间，在此浓度内人员短时停留不会造成生理影响，相对安全。",
        sp_types: [
          "原厂", "性价比高"
        ],
      },
      // 柜式七氟丙烷灭火装置
      {
        sp_id: 9,
        sp_img: "http://baogongxia1.oss-cn-shenzhen.aliyuncs.com/bgx-admin/20190125/ae11d392d82c45c49f15d675da5058ab.png",
        sp_banner: "http://baogongxia1.oss-cn-shenzhen.aliyuncs.com/bgx-admin/20190125/1ca6ab23d36d4c1abb3f0c793cbc45b5.png",
        sp_name: "柜式七氟丙烷灭火装置",
        sp_version: "无",
        sp_sold: "123",
        sp_supplier: "陕西坚瑞消防工程有限公司",
        sp_storage_location: "四川成都",
        sp_new_price: "价格面议",
        sp_old_price: "125",
        sp_unit: "套",
        sp_industry: "消防器材",
        sp_brand: "无",
        sp_purchase_num: "200",
        sp_size: "无",
        sp_receive_time: "2019-09-01",
        sp_abort_time: "2019-07-20",
        sp_purchase_type: "单次采购",
        sp_remark: "无",
        sp_order_status: "报价中",
        sp_nstallation: "无",
        sp_intro: "柜式七氟丙烷灭火装置是将贮存瓶组、管路、喷咀、压力讯号器、阀驱动装a等组件.装在柜件里面的装皿。 柜式七氟丙烷灭火装置为电磁阀启动型.柜体外观设计美观大方.对于不同面积的保护区。可选择不同型号规格的灭火瓶组、柜体。减少占地面积。喷咀采用螺旋式或径向射流型喷咀，使灭火剂喷洒迅速，均匀。施工安装方便.工程投资减少等优点。",
        sp_types: [
          "原厂", "性价比高"
        ],
      },
    ],
  
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
    console.log("地区设置==" + region_text );
    this.setData({
      topList,
      region_code: e.detail.region_code,
    })
  },
  // 列表点击
  onClickList: function (e) {
    let spid = e.currentTarget.dataset.spid;
    console.log("首页spid=" + spid);
    wx.navigateTo({
      url: '../deviceDetail/index?spid=' + spid,
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