var app = getApp();
var QQMapWX = require('../../../utils/qqmap-wx-jssdk.min.js');
var util = require('../../../utils/util.js');
var uploadAliyun = require('../../../utils/uploadAliyun.js');
var qqmapsdk;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    array: ['话题', '招工找活', '官方专区', '二手市场', '技术问答', '施工安全'],
    index: 0,
    info: '',
    //位置信息
    province: '',
    city: '',
    latitude: '',
    longitude: '',
    address: '获取当前位置',
    //上传文件
    formData: {},
    fileList: [],
    fileUrl: '',
    isPic: true,
    //上传类型
    uploadType: null,
  },
  before(e) {
    console.log("上传文件之前");
    if (!this.data.uploadType) {
      console.log("上传文件之前",e);
      return false;
    }
  },
  onChange(e) {
    console.log("onChange", e);
    const {
      file
    } = e.detail
    if (file.status === 'uploading') {
      this.setData({
        progress: 0
      })
      wx.showLoading();
    } else if (file.status === 'done') {
      this.setData({
        imageUrl: file.url
      })
    }
  },

  onSuccess(e) {
    console.log('onSuccess', e)
  },

  onFail(e) {
    console.log('onFail', e);
    wx.showToast({
      title: '上传失败',
    })
    that.setData({
      fileList: that.data.fileList.pop()
    })
  },
  onComplete(e) {
    var that = this;
    wx.showToast({
      title: '上传完成',
      icon: 'none'
    })
    console.log('onComplete', e);
    if (parseInt(e.detail.statusCode) !== 200) {
      wx.showToast({
        title: '上传失败',
        icon: 'none'
      })
    } else {
      wx.showToast({
        title: '上传完成',
        icon: 'none'
      })
      var data = {};
      data.uid = app.globalData.uploadUrl + '' + that.data.formData.key;
      data.status = 'done';
      data.url = app.globalData.uploadUrl + '' + that.data.formData.key + '?x-oss-process=style/thumb';
      data.originalUrl = app.globalData.uploadUrl + '' + that.data.formData.key + '?x-oss-process=style/original';
      that.data.fileList.push(data);
      that.setData({
        fileList: that.data.fileList,
      })
      //刷新签名
      app.getQianming(that, 'discover');
    }
    wx.hideLoading();
  },

  onPreview(e) {
    console.log('onPreview', e)
    const {
      file,
      fileList
    } = e.detail
    wx.previewImage({
      current: file.uid,
      urls: fileList.map((n) => n.uid),
    })
  },

  onRemove(e) {
    console.log('onRemove', e)
    var that = this;
    const {
      file,
      fileList
    } = e.detail
    that.setData({
      fileList: fileList.filter((n) => n.uid !== file.uid)
    })
  },
  getUserLocation: function() {
    let vm = this;
    wx.getSetting({
      success: (res) => {
        console.log(JSON.stringify(res))
        // res.authSetting['scope.userLocation'] == undefined    表示 初始化进入该页面
        // res.authSetting['scope.userLocation'] == false    表示 非初始化进入该页面,且未授权
        // res.authSetting['scope.userLocation'] == true    表示 地理位置授权
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
          wx.showModal({
            title: '请求授权当前位置',
            content: '需要获取您的地理位置，请确认授权',
            success: function(res) {
              if (res.cancel) {
                wx.showToast({
                  title: '拒绝授权',
                  icon: 'none',
                  duration: 1000
                })
              } else if (res.confirm) {
                wx.openSetting({
                  success: function(dataAu) {
                    if (dataAu.authSetting["scope.userLocation"] == true) {
                      wx.showToast({
                        title: '授权成功',
                        icon: 'success',
                        duration: 1000
                      })
                      //再次授权，调用wx.getLocation的API
                      vm.getLocation();
                    } else {
                      wx.showToast({
                        title: '授权失败',
                        icon: 'none',
                        duration: 1000
                      })
                    }
                  }
                })
              }
            }
          })
        } else if (res.authSetting['scope.userLocation'] == undefined) {
          //调用wx.getLocation的API
          vm.getLocation();
        } else {
          //调用wx.getLocation的API
          vm.getLocation();
        }
      }
    })
  },
  // 微信获得经纬度
  getLocation: function() {
    let vm = this;
    wx.getLocation({
      type: 'wgs84',
      success: function(res) {
        var latitude = res.latitude;
        var longitude = res.longitude;
        var speed = res.speed;
        var accuracy = res.accuracy;
        vm.getLocal(latitude, longitude);
      },
      fail: function(res) {
        console.log('fail' + JSON.stringify(res))
      }
    })
  },
  // 获取当前地理位置
  getLocal: function(latitude, longitude) {
    let vm = this;
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: latitude,
        longitude: longitude
      },
      success: function(res) {
        console.log(res)
        let province = res.result.ad_info.province
        let city = res.result.ad_info.city
        vm.setData({
          address: res.result.address,
          province: province,
          city: city,
          latitude: latitude,
          longitude: longitude
        })
      },
      fail: function(res) {
        console.log(res);
      },
      complete: function(res) {
        // console.log(res);
      }
    });
  },
  //信息发布
  submit: function() {
    wx.showLoading({
      title: '提交中',
    })
    var that = this;
    var data = {};
    data.token = app.globalData.token;
    if (that.data.index == 0) {
      data.topic = '';
    } else {
      data.topic = that.data.array[that.data.index];
    }
    data.region = that.data.address == "获取当前位置" ? "" : that.data.address;
    //图片处理
    var imgArr = [];
    for (let i = 0; i < that.data.fileList.length; i++) {
      imgArr.push(that.data.fileList[i].uid);
    }
    data.imgs = imgArr.join(',');
    data.content = that.data.info;
    //对发布内容进行判断
    var content = util.trim(data.content);
    var imgs = util.trim(data.imgs);
    if (!content && !imgs) {
      wx.hideLoading();
      wx.showModal({
        title: '内容为空',
        content: '文字和图片内容均为空',
        confirmText: "重新输入",
        cancelText: "返回",
        success: function(res) {
          if (res.confirm) {
            console.log('重新输入');
          } else {
            wx.navigateBack();
          }
        }
      })
    } else {
      app.ajax.req('circle_friends_api_controller/releaseArticle', data, 'GET', function(res) {
        wx.hideLoading();
        if (parseInt(res.errorCode) === 200) {
          wx.showToast({
            title: '发布成功！',
            duration: 1000
          })
          //跳转
          setTimeout(function() {
            wx.switchTab({
              url: '../discover/index',
            })
          }, 1500);
        }
      })
    }
  },
  //话题选择
  bindPickerChange: function(e) {
    this.setData({
      index: e.detail.value
    })
  },
  //内容描述
  info: function(e) {
    this.setData({
      info: e.detail.value,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    let time = util.formatTime(new Date());
    app.getQianming(that, 'discover/' + time);
    qqmapsdk = new QQMapWX({
      key: 'IOHBZ-4NN36-VB6SR-ETY6F-Q5GRJ-57FYG' //这里自己的key秘钥进行填充
    });
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
    // this.onLoad();
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