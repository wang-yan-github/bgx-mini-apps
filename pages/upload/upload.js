// pages/upload/upload.js
let app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    fileList: [],
    fileUrl: '',
    formData: '',
    countNumber: 9,
    fileName: '',
    method: ''
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
    console.log('onSuccess', e);
  },

  onFail(e) {
    console.log('onFail', e);
    wx.showToast({
      title: '上传失败'
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
      app.getQianming(that, that.data.fileName);
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log("传输的值", options);
    let that = this;
    //设置上传的图片数,上传文件名，修改的图片数组
    let fileList = [];
    //将传过来的url拼装
    if (options.url) {
      let url = options.url.split(';');
      for (let i = 0; i < url.length; i++) {
        //有值的情况下才拼装
        if (url[i]) {
          let data = {};
          data.uid = url[i];
          data.status = "done";
          data.url = url[i] + '?x-oss-process=style/thumb';
          data.originalUrl = url[i] + '?x-oss-process=style/original';
          fileList.push(data);
        }
      }
    }
    that.setData({
      countNumber: options.countNumber,
      fileName: options.fileName,
      fileList: fileList,
      method: options.method
    })
    //获取签名,传入要保存的文件夹
    //发现传入discover
    //发包方传入 fbf
    //包工侠传入 bgx
    //劳务传入 lw
    app.getQianming(that, that.data.fileName);
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
    //上传图片后返回的对象
    let fileList = this.data.fileList;
    if (fileList) {
      let uploadStr = [];
      for (let i = 0; i < fileList.length; i++) {
        uploadStr.push(fileList[i].uid)
      }
      let data = {
        upload: uploadStr,
        method: this.data.method
      }
      app.globalData.uploadList = data;
    }
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