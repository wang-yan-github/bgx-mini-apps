// pages/materialCenter/evaluateList/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 评论相关
    currPlun: 0,
    // 评论数量
    evaluateNum: 0,
    evaluateArr: [
      {
        id: 0,
        text: "全部",
        num: 1020
      },
      {
        id: 1,
        text: "优秀",
        num: 600
      },
      {
        id: 2,
        text: "较好",
        num: 200
      },
      {
        id: 3,
        text: "一般",
        num: 120
      },
      {
        id: 4,
        text: "较差",
        num: 60
      },
      {
        id: 5,
        text: "很差",
        num: 40
      },
    ],
    // 评论列表
    evaluateList: [
      {
        img: "/pages/icons/fawu03.png",
        phone: "19966668888",
        score: "4.5",
        rater: "好评",
        time: "2019-01-01",
        content: "在平台上买了好几台设备了，货真价实，比外面便宜很多，以后还会继续来这儿买，超级推荐",
      },
      {
        img: "/pages/icons/fawu02.png",
        phone: "19966668888",
        score: "4.5",
        rater: "好评",
        time: "2019-01-01",
        content: "平台真实可靠，性价比高，发货及时，好评",
      },
      {
        img: "/pages/icons/fawu01.png",
        phone: "19966668888",
        score: "4.5",
        rater: "好评",
        time: "2019-01-01",
        content: "产品真实，拼团的价格也比较低，很划算，推荐",
      },
    ]
  },
  // 点击当前类评论
  onCurrPlun: function (e) {
    console.log(e.currentTarget.dataset.index);
    this.setData({
      currPlun: e.currentTarget.dataset.index
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