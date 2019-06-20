import {
  $wuxSelect
} from '../../vux/index';
const isTel = (value) => !/^1[34578]\d{9}$/.test(value);
let app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [
      'http://baogongxia1.oss-cn-shenzhen.aliyuncs.com/banner/dabaitiao1.jpg',
      'http://baogongxia1.oss-cn-shenzhen.aliyuncs.com/banner/dabaitiao2.jpg',
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    value1: '',
    title1: '',
    value2: '',
    title2: '',
    region_code: ""
  },
  name: function(e) {
    this.setData({
      name: e.detail.value
    })
  },
  //预约办理
  banli: function() {
    let data = {};
    data.token = app.globalData.token;
    data.purpose = this.data.title1;
    data.sum = this.data.title2;
    data.name = this.data.name;
    data.phone = this.data.value;
    data.region = this.data.region_code;
    app.ajax.req('credit_api_controller/whiteBarAdd', data, 'POST', function(res) {
      if (Number.parseInt(res.errorCode) === 200) {
        wx.showToast({
          title: '预约成功，我们会有专门的客服人员联系您',
          icon: 'none',
          duration: 3000
        })
        setTimeout(function() {
          wx.navigateBack();
        }, 3500);
      }
    })
  },
  //所在区域
  onOpen3() {
    this.setData({
      visible3: true
    })
  },
  onClose3() {
    this.setData({
      visible3: false
    })
  },
  // 设置户籍
  onGetArea: function(e) {
    this.setData({
      region_code: e.detail.region_code
    })
  },
  onClick1() {
    $wuxSelect('#wux-select1').open({
      value: this.data.value1,
      options: [
        '发工资',
        '买材料',
        '装饰装修',
        '项目保证金',
        '其他',
      ],
      onConfirm: (value, index, options) => {
        console.log('onConfirm', value, index, options)
        if (index !== -1) {
          this.setData({
            value1: value,
            title1: options[index],
          })
        }
      },
    })
  },
  onClick2() {
    $wuxSelect('#wux-select2').open({
      value: this.data.value2,
      options: [
        '1万到5万',
        '5万到10万',
        '10万到20万',
        '20万到50万',
        '其他',
      ],
      onConfirm: (value, index, options) => {
        console.log('onConfirm', value, index, options)
        if (index !== -1) {
          this.setData({
            value2: value,
            title2: options[index],
          })
        }
      },
    })
  },
  onChange(e) {
    console.log('onChange', e)
    this.setData({
      error: isTel(e.detail.value),
      value: e.detail.value,
    })
  },
  onFocus(e) {
    this.setData({
      error: isTel(e.detail.value),
    })
    console.log('onFocus', e)
  },
  onBlur(e) {
    this.setData({
      error: isTel(e.detail.value),
    })
    console.log('onBlur', e)
  },
  onConfirm(e) {
    console.log('onConfirm', e)
  },
  onClear(e) {
    console.log('onClear', e)
    this.setData({
      error: true,
      value: '',
    })
  },
  onError() {
    wx.showModal({
      title: '请输入11位数字',
      showCancel: !1,
    })
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