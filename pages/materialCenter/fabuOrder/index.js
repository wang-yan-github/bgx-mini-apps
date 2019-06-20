// pages/materialCenter/fabuOrder/index.js
import { $wuxSelect, $wuxCalendar } from '../../vux/index';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 项目名称
    itemName: "",
    // 联系人姓名
    linkman: "",
    // 联系人电话
    itemPhone: "",
    // 报价时间
    quoteTime: ["请输入报价时间"],
    // 收货区域
    region_code: "",
    // 详细地址
    address: "",
    // 显示折叠当前采购
    isShow: false,
    // 材料列表
    buyList: [
      {
        itemName: "普通消防栓",
        hangye: "消防行业",
        guige: "200*200",
        pinpai: "百兴",
        getTime: "2019-01-31",
        buyType: "单次采购",
        buyNum: "10",
        bzText: "需上门安装",
        isShow: false,
      },
      {
        itemName: "水泵",
        hangye: "消防行业",
        guige: "200*200",
        pinpai: "百兴",
        getTime: "2019-01-31",
        buyType: "单次采购",
        buyNum: "10",
        bzText: "需上门安装",
        isShow: false,
      },
      {
        itemName: "应急照明灯",
        hangye: "消防行业",
        guige: "200*200",
        pinpai: "百兴",
        getTime: "2019-01-31",
        buyType: "单次采购",
        buyNum: "10",
        bzText: "需上门安装",
        isShow: false,
      },
    ]
  },
  // 添加材料
  addMaterial: function (e) {
    wx.navigateTo({
      url: '../addMaterial/index'
    })
  },
  openCurrItem: function (e) {
    let index = e.currentTarget.dataset.index;
    let buyList = this.data.buyList;
    buyList[index].isShow = !buyList[index].isShow;
    this.setData({
      buyList,
    })
  },
  // 修改功能
  onEditItem: function () {

  },
  // 删除功能
  onDeleteItem: function (e) {
    let _this = this;
    wx.showModal({
      title: '温馨提示',
      content: '您确定要删除该条材料采购吗？',
      success(res) {
        if (res.confirm) {
          let index = e.currentTarget.dataset.index;
          let buyList = _this.data.buyList;
          buyList.splice(index, 1);
          _this.setData({
            buyList,
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  // 报价时间
  openCalendar: function () {
    let quoteTime = this.data.quoteTime;
    if (quoteTime[0] == "请输入报价时间") {
      quoteTime = [];
    }
    $wuxCalendar().open({
      value: quoteTime,
      onChange: (values, displayValues) => {
        this.setData({
          quoteTime: displayValues
        })
      }
    })
  },

  // 收货区域
  onGetArea: function (e) {
    this.setData({
      region_code: e.detail.region_code
    })
  },
  // 详细地址
  onAddress: function (e) {
    this.setData({
      address: e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    // let buyList = app.globalData.buyList;
    // console.log("初始化=" + JSON.stringify(buyList));
    // this.setData({
    //   buyList,
    // })
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