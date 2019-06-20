// pages/creditLife/lawService/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 顶部导航控制索引
    itemIndex: 0,
    // 法律援助和法律常识显示
    isShow: true,
    h_tab1: "490",
    h_tab2: "244",
    index: 0,

    tabs: [
      {
        key: 'tab1',
        title: '法律援助',
        dataList: [
          {
            face: "/pages/icons/fawu01.png",
            name: "夏之威",
            company: "四川成都大成律师事务所",
            beGoodAt: "擅长劳务纠纷、债权债务、合同纠纷等",
            price_text1: "1. 江湖信用>700，免费",
            price_text2: "2. 500<江湖信用<700，打8折",
            price_text3: "3. 300<江湖信用<500，打7折",
            price_text4: "4. 江湖信用<300，200每小时",
          },
          {
            face: "/pages/icons/fawu02.png",
            name: "张建峰",
            company: "北京天杨律师事务所",
            beGoodAt: "擅长劳务纠纷、债权债务、合同纠纷等",
            price_text1: "1. 江湖信用>700，免费",
            price_text2: "2. 500<江湖信用<700，打8折",
            price_text3: "3. 300<江湖信用<500，打7折",
            price_text4: "4. 江湖信用<300，200每小时",
          },
          {
            face: "/pages/icons/fawu03.png",
            name: "张建峰",
            company: "北京天杨律师事务所",
            beGoodAt: "擅长劳务纠纷、债权债务、合同纠纷等",
            price_text1: "1. 江湖信用>700，免费",
            price_text2: "2. 500<江湖信用<700，打8折",
            price_text3: "3. 300<江湖信用<500，打7折",
            price_text4: "4. 江湖信用<300，200每小时",
          },
        ],
      },
      {
        key: 'tab2',
        title: '法律常识',
        dataList: [
          {
            unique: 0,
            text: "劳动法",
            method: "openLabourLaw",
          },
          {
            unique: 1,
            text: "生产法",
            method: "openYieldLaw",
          },
          {
            unique: 2,
            text: "施工安全法",
            method: "openSafeLaw",
          }
        ],
      }
    ],
  },
  // 顶部导航控制
  onClickItem: function (e) {
    var index = e.currentTarget.dataset.item;
    this.setData({
      itemIndex: index,
      isShow: !this.data.isShow
    })
  },

  onTabsChange(e) {
    console.log('onTabsChange', e)
    const { key } = e.detail
    const index = this.data.tabs.map((n) => n.key).indexOf(key)
    this.setData({
      key,
      index,
    })
  },
  onSwiperChange(e) {
    console.log('onSwiperChange', e)
    const { current: index, source } = e.detail
    const { key } = this.data.tabs[index]
    if (!!source) {
      this.setData({
        key,
        index,
      })
    }
  },

  // 劳动法
  openLdLaw: function () {

  },
  // 生产法
  openScLaw: function () {

  },
  // 施工安全法
  openSgaqLaw: function () {

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let tab1_height = this.data.h_tab1;
    let num = this.data.tabs[0].dataList.length;
    console.log("tab1_height=" + tab1_height + ",,num=" + num);
    this.setData({
      h_tab1: tab1_height * num
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