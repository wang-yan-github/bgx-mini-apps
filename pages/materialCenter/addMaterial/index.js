// pages/materialCenter/addMaterial/index.js
import {
  $wuxSelect,
  $wuxCalendar
} from '../../vux/index';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 材料名称
    itemName: "",
    // 所属行业
    hangye: "请选择所属行业",
    // 采购数量
    buyNum: "",
    // 材料规格
    guige: "",
    // 材料品牌
    pinpai: "",
    // 收货时间
    getTime: ["请选择收货时间"],
    // 采购类型
    buyType: "请选择采购类型",
    // 备注默认文字
    bzText: ""

  },
  // 材料名称
  onItemNameL: function(e) {
    this.setData({
      itemName: e.detail.value
    })
  },

  // 所属行业
  openHangye() {
    let hangye = this.data.hangye;
    if (hangye == "请选择所属行业") {
      hangye = ""
    }
    $wuxSelect('#wux-select-hangye').open({
      value: hangye,
      options: [
        '消防', '建筑', '装饰装修', '土方', '市政道路', '桥梁', '园林绿化', '节能环保', '铁路','公路'
      ],
      onConfirm: (value, index, options) => {
        if (index !== -1) {
          this.setData({
            hangye: options[index],
          })
        }
      },
    })
  },
  // 采购数量
  onBuyNum: function(e) {
    this.setData({
      buyNum: e.detail.value
    })
  },
  // 材料规格
  onGuige: function(e) {
    this.setData({
      guige: e.detail.value
    })
  },
  // 材料规格
  onPinpai: function(e) {
    this.setData({
      pinpai: e.detail.value
    })
  },
  // 报价时间
  openCalendar: function() {
    let getTime = this.data.getTime;
    if (getTime[0] == "请选择收货时间") {
      getTime = [];
    }
    $wuxCalendar().open({
      value: getTime,
      onChange: (values, displayValues) => {
        this.setData({
          getTime: displayValues
        })
      }
    })
  },
  // 采购类型
  openBuyType() {
    let buyType = this.data.buyType;
    if (buyType == "请选择采购类型") {
      buyType = ""
    }
    $wuxSelect('#wux-select-buytype').open({
      value: buyType,
      options: [
        '单次采购',
        '多次采购'
      ],
      onConfirm: (value, index, options) => {
        if (index !== -1) {
          this.setData({
            buyType: options[index],
          })
        }
      },
    })
  },
  // 备注
  onTextarea: function(e) {
    this.setData({
      bzText: e.detail.value
    })
  },

  // 保存
  onSave: function() {
    let _this = this;
    let buyList = app.globalData.buyList;
    let data = {};
    data.itemName = _this.data.itemName;
    data.hangye = _this.data.hangye;
    data.buyNum = _this.data.buyNum;
    data.guige = _this.data.guige;
    data.pinpai = _this.data.pinpai;
    data.getTime = _this.data.getTime;
    data.buyType = _this.data.buyType;
    data.bzText = _this.data.bzText;
    data.isShow = false;

    buyList.shift(data);
    console.log("提交data=" + JSON.stringify(data));
    app.globalData.buyList = buyList;
    // 回到上一页面
    setTimeout(() => {
      wx.navigateBack()
    }, 1000)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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