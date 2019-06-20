var app = getApp();
Component({
  externalClasses: ['wux-class'],
  properties: {
    //上传的张数
    count: {
      type: Number,
      value: 9,
    },
    //原图或缩略图mode
    sizeType: {
      type: Array,
      value: ['original', 'compressed']
    },
    //选图方式：相册、拍照
    sourceType: {
      type: Array,
      value: ['album', 'camera']
    },
    //上传地址
    url: {
      type: String,
      value: '',
    },
    //上传文件对应的key
    name: {
      type: String,
      value: 'file',
    },
    //HTTP 请求 Header, header 中不能设置 Referer
    header: {
      type: Object,
      value: {},
    },
    //请求的表单数据
    formData: {
      type: Object,
      value: {},
    },
    //默认的上传行为
    uploaded: {
      type: Boolean,
      value: true,
    },
    //是否禁用
    disabled: {
      type: Boolean,
      value: false,
    },
    //是否监听上传进度变化
    progress: {
      type: Boolean,
      value: false,
    },
    //上传列表的内建样式
    listType: {
      type: String,
      value: 'text',
    },
    //已经上传的文件列表
    fileList: {
      type: Array,
      value: [],
    },
    //是否展示上传文件列表
    showUploadList: {
      type: Boolean,
      value: true,
    },
    //是否展示删除图标
    showRemoveIcon: {
      type: Boolean,
      value: true,
    },
    //上传的张数
    uploadKeys: {
      type: Array,
      value: [],
    },
    //一次选择的张数
    oneSelectNum: {
      type: Number,
      value: 1,
    }
  },
  methods: {
    /**
     * 从本地相册选择图片或使用相机拍照
     */
    onSelect() {
      const {
        count,
        sizeType,
        sourceType,
        uploaded,
        disabled,
        fileList
      } = this.data
      const success = (res) => {
        this.tempFilePaths = res.tempFilePaths.map((item) => ({
          url: item,
          uid: this.getUid()
        }))
        this.triggerEvent('before', res);
        // 判断是否取消默认的上传行为
        if (uploaded) {
          this.uploadFile()
        }
      }

      if (disabled) {
        return false;
      }

      wx.chooseImage({
        count,
        sizeType,
        sourceType,
        success,
      })
    },
    /**
     * 上传文件改变时的回调函数
     * @param {Object} info 文件信息
     */
    onChange(info = {}) {
      this.setData({
        fileList: info.fileList,
      })
      this.triggerEvent('change', info);
    },
    /**
     * 开始上传文件的回调函数
     * @param {Object} file 文件对象
     */
    onStart(file) {
      const targetItem = {
        ...file,
        status: 'uploading',
      }

      this.onChange({
        file: targetItem,
        fileList: [...this.data.fileList, targetItem],
      })
    },
    /**
     * 上传文件成功时的回调函数
     * @param {Object} file 文件对象
     * @param {Object} res 请求响应对象
     */
    onSuccess(file, res) {
      const fileList = [...this.data.fileList]
      const index = fileList.map((item) => item.uid).indexOf(file.uid)

      if (index !== -1) {
        const targetItem = {
          ...file,
          status: 'done',
          res,
        }
        const info = {
          file: targetItem,
          fileList,
        }
        fileList.splice(index, 1, targetItem);
        this.triggerEvent('success', info);
        this.onChange(info);
      }
    },
    /**
     * 上传文件失败时的回调函数
     * @param {Object} file 文件对象
     * @param {Object} res 请求响应对象
     */
    onFail(file, res) {
      const fileList = [...this.data.fileList];
      const index = fileList.map((item) => item.uid).indexOf(file.uid);
      if (index !== -1) {
        const targetItem = {
          ...file,
          status: 'error',
          res,
        }
        const info = {
          file: targetItem,
          fileList,
        }

        fileList.splice(index, 1, targetItem)

        this.triggerEvent('fail', info)

        this.onChange(info)
      }
    },
    /**
     * 监听上传进度变化的回调函数
     * @param {Object} file 文件对象
     * @param {Object} res 请求响应对象
     */
    onProgress(file, res) {
      const fileList = [...this.data.fileList]
      const index = fileList.map((item) => item.uid).indexOf(file.uid)

      if (index !== -1) {
        const targetItem = {
          ...file,
          progress: res.progress,
          res,
        }
        const info = {
          file: targetItem,
          fileList,
        }

        fileList.splice(index, 1, targetItem)

        this.triggerEvent('progress', info)

        this.onChange(info)
      }
    },
    /**
     * 上传文件，支持多图递归上传
     */
    uploadFile() {
      if (!this.tempFilePaths.length) {
        return false
      }
      const {
        url,
        name,
        header,
        formData,
        disabled,
        progress,
        fileList,
        uploadKeys,
        count,
        oneSelectNum
      } = this.data
      //判断设置的图片数
      if (fileList.length == count) {
        wx.showToast({
          title: '图片只能上传' + count + '张',
          icon: 'none'
        })
        return;
      }
      uploadKeys.push(formData.timeStamp);
      var that = this;
      //大于一张图片的时候
      if (uploadKeys.length > 1) {
        if (uploadKeys[uploadKeys.length - 1] == uploadKeys[uploadKeys.length - 2]) {
          //删除一个元素
          uploadKeys.pop();
          setTimeout(function() {
            that.uploadFile();
          }, 300)
        } else {
          console.log("这是传的值", formData);
          uploadStart(that, uploadKeys, oneSelectNum);
        }
      } else {
        //只有一张图片的时候
        console.log("这是传的值", formData);
        //第一次没有得到签名
        if (uploadKeys.length == 0) {
          setTimeout(function() {
            that.uploadFile();
          }, 300);
        } else {
          oneSelectNum: that.tempFilePaths.length;
          uploadStart(that, uploadKeys, oneSelectNum);
        }
      }

      function uploadStart(that, uploadKeys, oneSelectNum) {
        //一次上传结束，把uploadKeys初始化
        if (uploadKeys.length === oneSelectNum) {
          uploadKeys = [];
        }
        const file = that.tempFilePaths.shift()
        const {
          uid,
          url: filePath
        } = file

        if (!url || !filePath || disabled) {
          return false
        }
        that.onStart(file);
        that.uploadTask[uid] = wx.uploadFile({
          url,
          filePath,
          name,
          header,
          formData,
          success: (res) => that.onSuccess(file, res),
          fail: (res) => that.onFail(file, res),
          complete: (res) => {
            delete that.uploadTask[uid];
            that.triggerEvent('complete', res);
            that.uploadFile();
          },
        })
        // 判断是否监听上传进度变化
        if (progress) {
          that.uploadTask[uid].onProgressUpdate((res) => that.onProgress(file, res))
        }
      }
    },
    /**
     * 点击文件时的回调函数
     * @param {Object} e 参数对象
     */
    onPreview(e) {
      this.triggerEvent('preview', { ...e.currentTarget.dataset,
        fileList: this.data.fileList
      })
    },
    /**
     * 点击删除图标时的回调函数
     * @param {Object} e 参数对象
     */
    onRemove(e) {
      const {
        file
      } = e.currentTarget.dataset
      const fileList = [...this.data.fileList]
      const index = fileList.map((item) => item.uid).indexOf(file.uid)
      var that = this;
      if (index !== -1) {
        const targetItem = {
          ...file,
          status: 'remove',
        }
        const info = {
          file: targetItem,
          fileList,
        }
        wx.showModal({
          title: '删除',
          content: '确认要删除这张图片么？',
          confirmText: "确认",
          cancelText: "返回",
          success: function(res) {
            if (res.confirm) {
              wx.showLoading({
                title: '删除中',
              })
              //如果是是上传失败的
              console.log("file", file);
              if (file.status == 'error') {
                wx.hideLoading();
                fileList.splice(index, 1);
                that.triggerEvent('remove', {
                  ...info,
                  index: e.currentTarget.dataset.index
                })
                that.onChange(info);
                return false;
              }
              let data = {};
              data.token = app.globalData.token;
              data.url = file.uid;
              app.ajax.req('upload_api_controller/removeImge', data, 'POST', function(res) {
                wx.hideLoading();
                if (parseInt(res.errorCode) !== 200) {
                  wx.showToast({
                    title: res.errorDesc,
                    icon: 'none'
                  })
                } else {
                  fileList.splice(index, 1);
                  that.triggerEvent('remove', {
                    ...info,
                    index: e.currentTarget.dataset.index
                  })
                  that.onChange(info)
                }
              })
            }
          }
        });
      }
    },
    /**
     * 中断上传任务
     * @param {String} uid 文件唯一标识
     */
    abort(uid) {
      const {
        uploadTask
      } = this

      if (uid) {
        if (uploadTask[uid]) {
          uploadTask[uid].abort()
          delete uploadTask[uid]
        }
      } else {
        Object.keys(uploadTask).forEach((uid) => {
          if (uploadTask[uid]) {
            uploadTask[uid].abort()
            delete uploadTask[uid]
          }
        })
      }
    },
  },
  /**
   * 组件生命周期函数，在组件实例进入页面节点树时执行
   */
  created() {
    this.index = 0
    this.createdAt = Date.now()
    this.getUid = () => `wux-upload--${this.createdAt}-${++this.index}`
    this.uploadTask = {}
    this.tempFilePaths = []
  },
  /**
   * 组件生命周期函数，在组件实例被从页面节点树移除时执行
   */
  detached() {
    this.abort()
  },
})