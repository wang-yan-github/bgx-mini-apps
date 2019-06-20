let cityData = require('../../../utils/area.js');
import { $wuxBackdrop } from '../../vux/index';
Page({
  data: {
    // 下拉菜单
    tabList: [{
      itemshow: '工种',
      itemhide: ''
    }, {
      itemshow: '区域',
      itemhide: ''
    }, {
      itemshow: '认证',
      itemhide: ''
    }, {
      itemshow: '筛选',
      itemhide: ''
    }],
    _num: 0,
    //筛选单项选择配置
    tab_item1: ['已认证', '未认证', '不限'],
    //默认选中项
    _res1: 0,
    clickOne1:"clickOne1",
    //筛选左右结构配置-----------------------------开始
    //左边选项配置
    shaixuan_lr_l: ['管理岗', '技术岗', '不限'],
    //左边默认项索引
    selected_index: 0,
    //左边选项的显示与隐藏
    selected0: 'show',
    selected1: 'hidden',
    selected2: 'hidden',
    //右边分项配置
    gc_type: ['一级建造师', '项目经理', '普通工长'],
    gz_type: ['水电工', '木工', '架子工', '钢筋工'],
    //筛选左右结构配置 -------------------------------结束

    //筛选左中右结构配置------------------------------开始
    //每个分享的默认索引
    selected_index1: 0,
    selected_index2: 0,
    selected_index3: 0,
    //左边选项的配置
    cityleft: cityData.area,
    //中间选项
    citycenter: {},
    //右边选项
    cityright: {},
    // 更多筛选配置
    shaixuan: [{
      title: '从业年限',
      name: [{
        name: '不限',
        type: 0
      }, {
        name: '2年内',
        type: 0
      }, {
        name: '2年到5年',
        type: 0
      }, {
        name: '5年到10年',
        type: 0
      }, {
        name: '10年以上',
        type: 0
      }]
    }, {
      title: '工作状态',
      name: [{
        name: '空闲',
        type: 1
      }, {
        name: '忙绿',
        type: 1
      }, {
        name: '忙绿可以接活',
        type: 1
      }]
    }, {
      title: '工程领域',
      name: [{
        name: '不限',
        type: 2
      }, {
        name: '消防',
        type: 2
      }, {
        name: '机电',
        type: 2
      }, {
        name: '建筑',
        type: 2
      }, {
        name: '家装',
        type: 2
      }]
    }, {
      title: '工种特征',
      name: [{
        name: '不限',
        type: 3
      }, {
        name: '大工',
        type: 3
      }, {
        name: '小工',
        type: 3
      }]
    }],
    //更多筛选分项的默认索引
    shaixuan_: [0, 0, 0, 0],
    //下拉的显示与隐藏
    displays: "none",
    isShow: true,
    //默认的tab项
    currentTab: 0,
    
  },


  //下拉和背景幕隐藏
  hideNav: function() {
    this.setData({
      displays: "none"
    })
    this.$wuxBackdrop.release();
  },
  // tab切换
  tabNav: function(e) {
    //下拉和背景幕显示
    this.setData({
      displays: "block"
    })
    this.$wuxBackdrop.retain();
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      var showMode = e.target.dataset.current == 0;
      this.setData({
        currentTab: e.target.dataset.current,
        isShow: showMode
      })
    }
  },
  // 下拉左中右结构切换
  selectleft: function(e) {
    var that = this;
    //左边选择的索引
    that.setData({
      selected_index1: e.target.dataset.index
    })
    var cityleft = that.data.cityleft;
    for (var item_ in cityleft) {
      if (cityleft[item_].value == e.target.dataset.code) {
        that.setData({
          cityright: {},
          citycenter: cityleft[item_].children,
        });
      }
    }
  },
  selectcenter: function(e) {
    const that = this;
    that.setData({
      selected_index2: e.target.dataset.index
    });
    var citycenter = that.data.citycenter;
    console.log(citycenter)
    for (var item_ in citycenter) {
      if (citycenter[item_].value == e.target.dataset.code) {
        that.setData({
          cityright: citycenter[item_].children
        });
      }
    }
  },
  selectaddr: function(e) {
    this.setData({
      displays: "none"
    })
    //给头部tab赋值
    var item3 = "tabList[" + 1 + "].itemshow";
    var item4 = "tabList[" + 1 + "].itemhide";
    if (e.currentTarget.dataset.name.length > 3) {
      var value = e.currentTarget.dataset.name.substring(0, 3) + "...";
      this.setData({
        [item3]: value,
        [item4]: e.currentTarget.dataset.code,
      })
    } else {
      this.setData({
        [item3]: e.currentTarget.dataset.name,
        [item4]: e.currentTarget.dataset.code,
        selected_index3: e.target.dataset.index
      })
    }
  },
  // 下拉切换中的左右结构切换
  selected: function(e) {
    var index = e.target.dataset.index;
    this.setData({
      selected_index: index
    })
    if (index == 0) {
      this.setData({
        selected0: 'show',
        selected1: 'hidden',
        selected2: 'hidden'
      })
    } else if (index == 1) {
      this.setData({
        selected0: 'hidden',
        selected1: 'show',
        selected2: 'hidden'
      })
    } else if (index == 2) {
      this.setData({
        selected0: 'hidden',
        selected1: 'hidden',
        selected2: 'show'
      })
    }
  },
  // 下拉菜单1 2 3 4
  // 区域
  clickSum: function(e) {
    this.setData({
      _sum: e.target.dataset.num
    })
    //给头部tab赋值
    var item1 = "tabList[" + 0 + "].itemshow";
    var item2 = "tabList[" + 0 + "].itemhide";
    //对长字段进行截取操作
    if (e.target.dataset.name.length > 3) {
      var item3 = e.target.dataset.name.substring(0, 3) + "...";
      this.setData({
        [item1]: item3,
        [item2]: e.target.dataset.name
      })
    } else {
      this.setData({
        [item1]: e.target.dataset.name,
        [item2]: e.target.dataset.name
      })
    }
    this.setData({
      displays: "none"
    })
  },
  onLoad: function(options) {
    console.log("区域左边的项", cityData.area);
    this.$wuxBackdrop = $wuxBackdrop("#backdrop");
  },
  clickMum: function(e) {
    this.setData({
      _mum: e.target.dataset.num
    })
    //给头部tab赋值
    var item1 = "tabList[" + 0 + "].itemshow";
    var item2 = "tabList[" + 0 + "].itemhide";
    //对长字段进行截取操作
    if (e.target.dataset.name.length > 3) {
      var item3 = e.target.dataset.name.substring(0, 3) + "...";
      this.setData({
        [item1]: item3,
        [item2]: e.target.dataset.name
      })
    } else {
      this.setData({
        [item1]: e.target.dataset.name,
        [item2]: e.target.dataset.name
      })
    }
    this.setData({
      displays: "none"
    })

  },
  clickCum: function(e) {
    this.setData({
      _cum: e.target.dataset.num
    })
    var item1 = "tabList[" + 0 + "].itemshow";
    this.setData({
      [item1]: e.target.dataset.name,
      displays: "none"
    })
    var text = this.data.name
    console.log(text)
  },
  clickNum: function(e) {
    console.log(e.target.dataset.num)
    this.setData({
      _num: e.target.dataset.num
    })
    this.setData({
      second: e.target.dataset.name
    })
    this.setData({
      displays: "none"
    })
    var text = this.data.name
    console.log(text)
  },

  clickOne1: function(e) {
    this.setData({
      _res: e.target.dataset.index
    })
    //给头部tab赋值
    var item5 = "tabList[" + 2 + "].itemshow";
    this.setData({
      [item5]: e.target.dataset.name
    })
    this.setData({
      displays: "none"
    })
  },
  // 筛选
  shuanxuan_click: function(e) {
    var index = e.currentTarget.dataset.index; //获取自定义的ID值  
    console.log(index)
    if (e.currentTarget.dataset.type == 0) {
      this.data.shaixuan_[0] = index;
      this.setData({
        shaixuan_: this.data.shaixuan_
      })

    } else if (e.currentTarget.dataset.type == 1) {
      this.data.shaixuan_[1] = index;
      this.setData({
        shaixuan_: this.data.shaixuan_
      })
    } else if (e.currentTarget.dataset.type == 2) {
      this.data.shaixuan_[2] = index;
      this.setData({
        shaixuan_: this.data.shaixuan_
      })
    } else if (e.currentTarget.dataset.type == 3) {
      this.data.shaixuan_[3] = index;
      this.setData({
        shaixuan_: this.data.shaixuan_
      })
    }
  }
})