// pages/materialCenter/index/index.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //banner参数开始
    imgUrls: [
      'http://baogongxia1.oss-cn-shenzhen.aliyuncs.com/bgx-admin/20190125/3217da927b814471a04f830d2212c1bc.png',
      'http://baogongxia1.oss-cn-shenzhen.aliyuncs.com/bgx-admin/20190125/a303a0dea2a8478b9ba9b4bb1ae6375e.png',
      'http://baogongxia1.oss-cn-shenzhen.aliyuncs.com/bgx-admin/20190125/0bfe73cd9df24186bf37e3c7350297a8.png',
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    //banner参数结束

    //功能按钮
    buttonList: [
      {
        id: "0",
        img: "http://baogongxia1.oss-cn-shenzhen.aliyuncs.com/bgx-admin/20190125/903dfa9627834994810f812d580a995d.png",
        name: "材料供应",
        url: "../shareBill/index",
      },
      {
        id: "1",
        img: "http://baogongxia1.oss-cn-shenzhen.aliyuncs.com/bgx-admin/20190125/9ab9585ead1f420087b45464a1252ca5.png",
        name: "系统设备",
        url: "../deviceIndex/index",
      },
      {
        id: "2",
        img: "http://baogongxia1.oss-cn-shenzhen.aliyuncs.com/bgx-admin/20190125/0d18dc17a190490aab46d53d75321474.png",
        name: "求购订单",
        url: "../orderPool/index",
      },
      {
        id: "3",
        img: "http://baogongxia1.oss-cn-shenzhen.aliyuncs.com/bgx-admin/20190125/b4012ab56db5416f8179f0090de8f725.png",
        name: "二手材料",
        url: "../secondMaterial/index",
      }
    ],
    // 悬浮按钮
    buttons: [
      {
        // openType: "/pages/materialCenter/fabuOrder/index",
        label: '发布订单',
        icon: "/pages/icons/fabu_icon.png",
        url: "/pages/materialCenter/fabuOrder/index"
      },
    ],
    // 热门商品 热门订单
    index: 0,
    key: "tab1",
    // currentKey: 'tab1',
    tab_item1: 262, // 单个列表的高度
    tab_item2: 212,
    h_tab: 0, // 列表整体高度
    
    tabs: [
      {
        key: 'tab1',
        title: '热门商品',
        dataList: [
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
        ],
      },
      {
        key: 'tab2',
        title: '热门订单',
        dataList: [
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
          // 七氟丙烷灭火系统
          {
            sp_id: 7,
            sp_img: "http://baogongxia1.oss-cn-shenzhen.aliyuncs.com/bgx-admin/20190125/21d56714b01b466493290d33fe2704ec.png",
            sp_banner: "http://baogongxia1.oss-cn-shenzhen.aliyuncs.com/bgx-admin/20190125/d526408ad9ef4ff78b7fd34644f7a2a3.png",
            sp_name: "5.6，4.2七氟丙烷灭火系统",
            sp_version: "无",
            sp_sold: "123",
            sp_supplier: "北京原杰",
            sp_storage_location: "四川成都",
            sp_new_price: "价格面议",
            sp_old_price: "125",
            sp_unit: "套",
            sp_industry: "消防器材",
            sp_brand: "无",
            sp_purchase_num: "200",
            sp_size: "无",
            sp_receive_time: "2019-08-08",
            sp_abort_time: "2019-06-06",
            sp_purchase_type: "单次采购",
            sp_remark: "无",
            sp_order_status: "报价中",
            sp_nstallation: "无",
            sp_intro: "七氟丙烷灭火剂的化学分子式为CF3CH FCF3，熔点1310C，沸点16.40C，是一种无色、无味、具有良好的清洁性(在大气中完全消化不留痕)和良好的气相电绝缘性，无毒，不耗损大气臭氧层，是哈龙的取代品，目前在世界和全国范围得到全面推广和广泛使用",
            sp_types: [
              "原厂", "性价比高"
            ],

          },
        ],
      }
    ],
  },
  // 悬浮按钮
  onChangeFb(e) {
    // console.log('onChange', e)
  },
  // 悬浮按钮选项
  onClickFb(e) {
    let url = this.data.buttons[e.detail.index].url;
    wx.navigateTo({
      url: url,
    })
    console.log(e.detail.index);
  },
  // 功能按钮区
  openButton: function (e) {
    var index = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: this.data.buttonList[index].url,
    })
  },
  // 列表点击
  onClickSp: function (e) {
    let spid = e.currentTarget.dataset.spid;
    console.log("首页spid=" + spid);
    wx.navigateTo({
      url: '../productDetail/index?spid=' + spid,
    })
  },
  // 列表点击
  onClickOrder: function (e) {
    let spid = e.currentTarget.dataset.spid;
    console.log("首页spid=" + spid);
    wx.navigateTo({
      url: '../orderPoolDet/index?spid=' + spid,
    })
  },
  onTabsChange(e) {
    console.log('onTabsChange', e)
    const { key } = e.detail
    const index = this.data.tabs.map((n) => n.key).indexOf(key)
    let tab_item = 0;
    if (index == 0) {
      tab_item = this.data.tab_item1
    }
    else {
      tab_item = this.data.tab_item2
    }
    
    this.setData({
      key,
      index,
    })
    this.calcHeight(tab_item, index);
  },
  onSwiperChange(e) {
    console.log('onSwiperChange', e)
    const { current: index, source } = e.detail
    const { key } = this.data.tabs[index]
    let tab_item = 0;
    if (index == 0) {
      tab_item = this.data.tab_item1
    }
    else {
      tab_item = this.data.tab_item2
    }
    if (!!source) {
      this.setData({
        key,
        index,
      })
    }
    this.calcHeight(tab_item,index);
  },
  // 动态计算当前swiper的高度
  calcHeight: function (item_h, _index) {
    let num = this.data.tabs[_index].dataList.length;
    if (num == 0) {
      this.setData({
        h_tab: 470
      })
    }
    else {
      this.setData({
        h_tab: item_h * num - 12
      })
    }
    console.log("item_h * num=" + item_h * num + ",,_index==" + _index + ",,num=" + num);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let tab_item = 0;
    if (this.data.index == 0) {
      tab_item = this.data.tab_item1
    }
    else {
      tab_item = this.data.tab_item2
    }
    this.calcHeight(tab_item, this.data.index);
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})