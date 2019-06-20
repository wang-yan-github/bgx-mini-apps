// pages/materialCenter/deviceDetail/index.js
import { $wuxCountDown } from '../../vux/index';
const materialList = require("../materialList/materialList.js").materialList;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 拼单滚动
    vertical: true,
    autoplay: true,
    interval: 5000,
    duration: 500,
    // 显示张数
    displayMultipleItems: 2,
    // 首尾衔接
    circular: true,

    // 收藏
    isShoucang: false,
    // 更多拼单
    isMorePd: false,
    // 单采、拼团
    isTccShow: false,
    // 去拼单
    isQupindan: false,
    spImgs: ['http://baogongxia1.oss-cn-shenzhen.aliyuncs.com/banner/index1.jpg',
      'http://baogongxia1.oss-cn-shenzhen.aliyuncs.com/banner/index2.jpg',
      'http://baogongxia1.oss-cn-shenzhen.aliyuncs.com/banner/index3.jpg',
    ],
    spImg: 'http://baogongxia1.oss-cn-shenzhen.aliyuncs.com/banner/index1.jpg',
    // 拼单列表
    billList: [
      {
        img: "/pages/icons/fawu01.png",
        c_name: "王喜文",
        cha_num: "100",
        s_time: "23:59:59"
      },
      {
        img: "/pages/icons/fawu02.png",
        c_name: "李达",
        cha_num: "150",
        s_time: "20:00:00"
      },
      {
        img: "/pages/icons/fawu03.png",
        c_name: "张国桥",
        cha_num: "100",
        s_time: "8:08:08"
      },
      {
        img: "/pages/icons/fawu01.png",
        c_name: "张洪明",
        cha_num: "150",
        s_time: "20:00:00"
      },
      {
        img: "/pages/icons/fawu02.png",
        c_name: "赵大宣",
        cha_num: "100",
        s_time: "8:08:08"
      },
      {
        img: "/pages/icons/fawu03.png",
        c_name: "陈建国",
        cha_num: "150",
        s_time: "20:00:00"
      },
      {
        img: "/pages/icons/fawu01.png",
        c_name: "李宏斌",
        cha_num: "100",
        s_time: "8:08:08"
      }
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
        img: "/pages/icons/fawu03.png",
        phone: "19966668888",
        score: "4.5",
        rater: "好评",
        time: "2019-01-01",
        content: "在平台上买了好几台设备了，货真价实，比外面便宜很多，以后还会继续来这儿买，超级推荐",
      },
    ],
    // 详情对象
    dataDetail: {},
  },
  // 点击单买或拼团
  onClickBuy: function (e) {
    this.setData({
      isTccShow: true,
      danpin: e.currentTarget.dataset.danpin
    })
  },
  onCloseBuy: function () {
    this.setData({
      isTccShow: false,
    })
  },
  // 去拼单
  onQupindan: function (e) {
    let firstName = e.currentTarget.dataset.name;
    let firstFace = e.currentTarget.dataset.face;
    this.setData({
      isQupindan: true,
      firstName,
      firstFace,

    })
  },
  // 关闭拼单
  onClosePindan: function (e) {
    this.setData({
      isQupindan: false,
    })
  },
  // 防止数字加减事件穿透
  onInputNum: function () {

  },
  // 查看更多拼单
  onMorePd: function () {
    this.setData({
      isMorePd: true
    })
  },
  // 点击更多拼单蒙层进行隐藏
  onCloseMorePd: function () {
    this.setData({
      isMorePd: false
    })
  },
  // 更多评论
  onMOreEvaluate: function (e) {
    wx.navigateTo({
      url: '../evaluateList/index',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},                                                                
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
  // 收藏
  onShoucang: function () {
    this.setData({
      isShoucang: !this.data.isShoucang
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    _this.getScreeHeight();
    let spid = options.spid;
    materialList.forEach((item) => {
      if (spid == item.sp_id) {
        console.log(JSON.stringify(item));
        _this.setData({
          dataDetail: item
        })
      }
    })
    // let currDate = (new Date) + 60000 * 60 * 24 - 1000;
    // this.setCountDownTime(currDate);
   
    //定时器
    this.countDown = new $wuxCountDown({
      date: +(new Date) + 60000 * 60 * 24 - 1000,
      refresh: 100,
      render(date) {
        const hours = this.leadingZeros(date.hours, 2) + ':'
        const min = this.leadingZeros(date.min, 2) + ':'
        const sec = this.leadingZeros(date.sec, 2) + '.'
        const millisec = Math.floor(this.leadingZeros(date.millisec, 1) / 100)
        this.setData({
          countDown: hours + min + sec + millisec
        })
      },
    })
  },

  setCountDownTime: function (date) {
    // 定时器
    this.countDown = new $wuxCountDown({
      date: date,
      refresh: 100,
      render(date) {
        const hours = this.leadingZeros(date.hours, 2) + ':'
        const min = this.leadingZeros(date.min, 2) + ':'
        const sec = this.leadingZeros(date.sec, 2) + '.'
        const millisec = Math.floor(this.leadingZeros(date.millisec, 1) / 100)
        this.setData({
          countDown: hours + min + sec + millisec
        })
      },
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