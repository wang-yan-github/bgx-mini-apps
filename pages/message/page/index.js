let util = require('../../../utils/util.js');
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    shuru_text: '',
    faceDisabled: false,
    myId: -1,
    toId: -1,
    toType: -1,
    liaotian_content: [],
    face: [],
    currentId: -1,
    currentType: -1,
    touxiang: '',
    duty_name: ''
  },
  //缓存表情
  redisFace: function() {
    for (let i = 100; i < 173; i++) {
      if (!wx.getStorageSync('face' + i)) {
        wx.setStorageSync('face' + i, 'http://baogongxia1.oss-cn-shenzhen.aliyuncs.com/face/' + i + '.gif');
      }
    }
  },
  //节点解析
  parseText: function(shuru_text, bid) {
    let that = this;
    let nodes;
    if (parseInt(this.data.myId) != parseInt(bid)) {
      nodes = [{
        name: 'div',
        attrs: {
          class: 'text'
        },
        children: []
      }];
    } else {
      nodes = [{
        name: 'div',
        attrs: {
          class: 'text1'
        },
        children: []
      }];
    }
    let arr = shuru_text.split('$_');
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] != "") {
        let marker = false;
        for (let j = 0; j < that.data.face.length; j++) {
          if (arr[i] == that.data.face[j].discrible) {
            let obj = {};
            let attrs = {};
            let children = [];
            obj.name = 'img';
            attrs.src = that.data.face[j].src;
            attrs.class = 'liantian_face';
            obj.attrs = attrs;
            children.push(obj);
            nodes[0].children = nodes[0].children.concat(children);
            marker = true;
            break;
          }
        }
        if (!marker) {
          let children = [];
          let obj = {};
          obj.type = 'text';
          obj.text = arr[i]
          children.push(obj);
          console.log('子节点', children);
          nodes[0].children = nodes[0].children.concat(children);
        }
      }
    }
    return nodes;
  },
  fasong: function(e) {
    let shuru_text = this.data.shuru_text;
    if (shuru_text == "") {
      wx.showToast({
        title: '请输入内容',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    let that = this;
    let data = {};
    let message = {};
    let froms = {};
    let tos = {};
    message.content = this.data.shuru_text;
    froms.from = this.data.myId;
    froms.type = wx.getStorageSync('role');
    message.froms = froms;
    tos.to = this.data.toId;
    tos.type = this.data.toType;
    message.tos = tos;
    let date = new Date();
    message.time = util.formatTime1(date);
    data.message = message;
    data.toType = 'message';
    app.sendSocketMessage(data);
    that.setData({
      shuru_text: ''
    })
  },
  faceTap: function(e) {
    let text = e.currentTarget.dataset.text;
    let desc = e.currentTarget.dataset.desc;
    this.setData({
      shuru_text: this.data.shuru_text + '$_' + desc + '$_',
      faceDisabled: !this.data.faceDisabled
    })
    this.pageScrollToBottom();
  },
  clickFace: function() {
    this.setData({
      faceDisabled: !this.data.faceDisabled
    })
    this.pageScrollToBottom();
  },
  shuru_text: function(e) {
    this.setData({
      shuru_text: e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //对方的类型  -  ID
    this.setData({
      myId: app.globalData.infoId,
      toId: options.to_id,
      toType: options.to_type,
      touxiang: app.globalData.touxiang,
      duty_name: options.duty_name
    })
    //保存到全局
    app.globalData.toId = options.to_id;
    app.globalData.toType = options.to_type;
    //缓存表情
    this.redisFace();
    this.setData({
      face: [{
        src: wx.getStorageSync('face100'),
        text: '微笑',
        discrible: '::)'
      }, {
        src: wx.getStorageSync('face101'),
        text: '撇嘴',
        discrible: '::~'
      }, {
        src: wx.getStorageSync('face102'),
        text: '色',
        discrible: '::B'
      }, {
        src: wx.getStorageSync('face103'),
        text: '发呆',
        discrible: '::|'
      }, {
        src: wx.getStorageSync('face104'),
        text: '得意',
        discrible: ':8-)'
      }, {
        src: wx.getStorageSync('face105'),
        text: '流泪',
        discrible: '::<'
      }, {
        src: wx.getStorageSync('face106'),
        text: '害羞"',
        discrible: '::$'
      }, {
        src: wx.getStorageSync('face107'),
        text: '闭嘴',
        discrible: '::X'
      }, {
        src: wx.getStorageSync('face108'),
        text: '睡',
        discrible: '::Z'
      }, {
        src: wx.getStorageSync('face109'),
        text: '大哭',
        discrible: "::'("
      }, {
        src: wx.getStorageSync('face110'),
        text: '尴尬',
        discrible: '::-|'
      }, {
        src: wx.getStorageSync('face111'),
        text: '发怒',
        discrible: '::@'
      }, {
        src: wx.getStorageSync('face112'),
        text: '调皮',
        discrible: '::P'
      }, {
        src: wx.getStorageSync('face113'),
        text: '呲牙',
        discrible: '::D'
      }, {
        src: wx.getStorageSync('face114'),
        text: '惊讶',
        discrible: '::O'
      }, {
        src: wx.getStorageSync('face115'),
        text: '难过',
        discrible: '::('
      }, {
        src: wx.getStorageSync('face116'),
        text: '酷',
        discrible: '::+'
      }, {
        src: wx.getStorageSync('face117'),
        text: '冷汗',
        discrible: ':--b'
      }, {
        src: wx.getStorageSync('face118'),
        text: '抓狂',
        discrible: '::Q'
      }, {
        src: wx.getStorageSync('face119'),
        text: '吐',
        discrible: '::T'
      }, {
        src: wx.getStorageSync('face120'),
        text: '偷笑',
        discrible: ':,@P'
      }, {
        src: wx.getStorageSync('face121'),
        text: '愉快',
        discrible: ':,@-D'
      }, {
        src: wx.getStorageSync('face122'),
        text: '白眼',
        discrible: '::d'
      }, {
        src: wx.getStorageSync('face123'),
        text: '傲慢',
        discrible: ':,@o'
      }, {
        src: wx.getStorageSync('face124'),
        text: '饥饿',
        discrible: '::g'
      }, {
        src: wx.getStorageSync('face125'),
        text: '困',
        discrible: ':|-)'
      }, {
        src: wx.getStorageSync('face126'),
        text: '惊恐',
        discrible: '::!'
      }, {
        src: wx.getStorageSync('face127'),
        text: '流汗',
        discrible: '::L'
      }, {
        src: wx.getStorageSync('face128'),
        text: '憨笑',
        discrible: '::>'
      }, {
        src: wx.getStorageSync('face129'),
        text: '悠闲',
        discrible: '::,@'
      }, {
        src: wx.getStorageSync('face130'),
        text: '奋斗',
        discrible: ':,@f'
      }, {
        src: wx.getStorageSync('face131'),
        text: '咒骂',
        discrible: '::-S'
      }, {
        src: wx.getStorageSync('face132'),
        text: '疑问',
        discrible: ':?'
      }, {
        src: wx.getStorageSync('face133'),
        text: '嘘',
        discrible: ':,@x'
      }, {
        src: wx.getStorageSync('face134'),
        text: '晕',
        discrible: ':,@@'
      }, {
        src: wx.getStorageSync('face135'),
        text: '疯了',
        discrible: '::8'
      }, {
        src: wx.getStorageSync('face136'),
        text: '哀',
        discrible: ':,@!'
      }, {
        src: wx.getStorageSync('face137'),
        text: '骷髅',
        discrible: ':!!!'
      }, {
        src: wx.getStorageSync('face138'),
        text: '敲打',
        discrible: ':xx'
      }, {
        src: wx.getStorageSync('face139'),
        text: '再见',
        discrible: ':bye'
      }, {
        src: wx.getStorageSync('face140'),
        text: '擦汗',
        discrible: ':wipe'
      }, {
        src: wx.getStorageSync('face141'),
        text: '抠鼻',
        discrible: ':dig'
      }, {
        src: wx.getStorageSync('face142'),
        text: '鼓掌',
        discrible: ':handclap'
      }, {
        src: wx.getStorageSync('face143'),
        text: '糗大了',
        discrible: ':&-('
      }, {
        src: wx.getStorageSync('face144'),
        text: '坏笑',
        discrible: ':B-)'
      }, {
        src: wx.getStorageSync('face145'),
        text: '左哼哼',
        discrible: ':<@'
      }, {
        src: wx.getStorageSync('face146'),
        text: '右哼哼',
        discrible: ':@>'
      }, {
        src: wx.getStorageSync('face147'),
        text: '哈欠',
        discrible: '::-O'
      }, {
        src: wx.getStorageSync('face148'),
        text: '鄙视',
        discrible: ':>-|'
      }, {
        src: wx.getStorageSync('face149'),
        text: '委屈',
        discrible: ':P-('
      }, {
        src: wx.getStorageSync('face150'),
        text: '快哭了',
        discrible: "::'|"
      }, {
        src: wx.getStorageSync('face151'),
        text: '阴险',
        discrible: ':X-)'
      }, {
        src: wx.getStorageSync('face152'),
        text: '亲亲',
        discrible: '::*'
      }, {
        src: wx.getStorageSync('face153'),
        text: '吓',
        discrible: ':@x'
      }, {
        src: wx.getStorageSync('face154'),
        text: '可怜',
        discrible: ':8*'
      }, {
        src: wx.getStorageSync('face155'),
        text: '菜刀',
        discrible: ':pd'
      }, {
        src: wx.getStorageSync('face156'),
        text: '西瓜',
        discrible: ':<W>'
      }, {
        src: wx.getStorageSync('face157'),
        text: '咖啡',
        discrible: ':coffee'
      }, {
        src: wx.getStorageSync('face158'),
        text: '饭',
        discrible: ':eat'
      }, {
        src: wx.getStorageSync('face159'),
        text: '月亮',
        discrible: ':moon'
      }, {
        src: wx.getStorageSync('face160'),
        text: '强',
        discrible: ':strong'
      }, {
        src: wx.getStorageSync('face161'),
        text: '弱',
        discrible: ':weak'
      }, {
        src: wx.getStorageSync('face162'),
        text: '握手',
        discrible: ':share'
      }, {
        src: wx.getStorageSync('face163'),
        text: '胜利',
        discrible: ':v'
      }, {
        src: wx.getStorageSync('face164'),
        text: '抱拳',
        discrible: ':@)'
      }, {
        src: wx.getStorageSync('face165'),
        text: '勾引',
        discrible: ':jj'
      }, {
        src: wx.getStorageSync('face166'),
        text: '拳头',
        discrible: ':@@'
      }, {
        src: wx.getStorageSync('face167'),
        text: '差劲',
        discrible: ':bad'
      }, {
        src: wx.getStorageSync('face168'),
        text: '爱你',
        discrible: ':lvu'
      }, {
        src: wx.getStorageSync('face169'),
        text: 'NO',
        discrible: ':no'
      }, {
        src: wx.getStorageSync('face170'),
        text: 'OK',
        discrible: ':ok'
      }, {
        src: wx.getStorageSync('face171'),
        text: '拜托',
        discrible: ':oY'
      }, {
        src: wx.getStorageSync('face172'),
        text: '强壮',
        discrible: ':strong_'
      }]
    })

    // 链接websocket
    if (app.globalData.localSocket.readyState !== 0 && app.globalData.localSocket.readyState !== 1) {
      console.log('开始尝试连接WebSocket！readyState=' + app.globalData.localSocket.readyState)
      app.initSocket();
    }
    //数据解析
    let that = this;
    let data = {};
    let message = {};
    let froms = {};
    let tos = {};
    message.content = '';
    //我的类型 --ID
    let userId = app.globalData.infoId;
    let type_ = wx.getStorageSync('role');
    froms.from = userId;
    froms.type = type_;
    message.froms = froms;
    tos.to = that.data.toId;
    tos.type = that.data.toType;
    message.tos = tos;
    let date = new Date();
    message.time = util.formatTime1(date);
    data.message = message;
    data.toType = 'message';
    setTimeout(function() {
      app.sendSocketMessage(data);
    }, 300);
    app.globalData.callback = function(res) {
      let resData = JSON.parse(res.data);
      if (resData.type == "message") {
        let listData = resData.list;
        for (let i = 0; i < listData.length; i++) {
          if (Number.parseInt(listData[i].bid) === Number.parseInt(userId) || Number.parseInt(listData[i].bid) === Number.parseInt(that.data.toId)) {
            let text = that.parseText(listData[i].content, listData[i].bid);
            listData[i].nodes1 = text;
            //动态设置当前页面的标题，在线状态
            if (i == (listData.length - 1)) {
              wx.setNavigationBarTitle({
                title: that.data.duty_name + '(' + resData.isOnLine + ')'
              })
            }
          } else {
            console.log('别人发给我的', listData[i]);
            data.toType = 'isRead';
            data.id = listData[i].id;
            app.sendSocketMessage(data);
            //删除这条数据
            listData.splice(i, 1);
          }
        }
        let listData_ = that.data.liaotian_content.concat(listData);
        // console.log('聊天消息', listData_);
        that.setData({
          liaotian_content: listData_,
        })
        that.pageScrollToBottom();
      } else {
        //心跳的回应
      }
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  // 获取容器高度，使页面滚动到容器底部
  pageScrollToBottom: function() {
    wx.createSelectorQuery().select('#j_page').boundingClientRect(function(rect) {
      // 使页面滚动到底部
      wx.pageScrollTo({
        scrollTop: rect.height,
        duration: 0
      })
    }).exec();
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
    app.globalData.localSocket.close({
      success: function(res) {
        console.log('手动关闭成功', res);
        app.globalData.socketClose = true;
      },
      complate: function(res) {
        console.log('手动关闭', res);
      }
    });
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    let that = this;
    app.globalData.localSocket.close({
      success: function(res) {
        console.log('手动关闭成功', res);
        app.globalData.socketClose = true;
      },
      complate: function(res) {
        console.log('手动关闭', res);
      }
    });
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