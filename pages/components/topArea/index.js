// pages/components/getTwoArea/index.js
var area = require("../../../utils/area.js").area;
var util = require("../../../utils/util.js");
var getAreaText = util.getAreaText;
var defaultAllAreaCode = util.defaultAllAreaCode;
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    regionCode: {
      type: String,
      value: ""
    },
    areaName: {
      type: String,
      value: "地区"
    },
    areaNum: {
      type: Number,
      value: 3
    },
    title: {
      type: String,
      value: "选择区域"
    },
    position: {
      type: String,
      value: "bottom"
    },
    visible: {
      type: Boolean,
      value: true
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    options: [],
    // 地区默认值
    defaultValue: [],
    address_code: [],

  },

  /**
   * 组件的方法列表
   */
  methods: {

    onClose() {
      this.setData({
        visible: false,
        defaultValue: this.data.address_code
      })
      var address_code = this.data.address_code;
      console.log("address_code=" + address_code);
      if (address_code.length > 0) {
        var region_code = address_code[address_code.length - 1];
        const myEventDetail = { "region_code": region_code } // detail对象，提供给事件监听函数
        const myEventOption = {} // 触发事件的选项
        this.triggerEvent('myeventArea', myEventDetail, myEventOption);
      }
    },
    onChange(e) {
      this.setData({
        address_text: e.detail.options.map((n) => n.label).join('/'),
        address_code: e.detail.options.map((n) => n.value),
      })
      console.log('onChange1=', JSON.stringify(e.detail));
    },
  },
  attached() {
    var regionCode = this.data.regionCode;
    let defaultValue = defaultAllAreaCode(regionCode);
    this.setData({
      defaultValue: defaultValue,
    })
  },
  ready() {
    var regionCode = this.data.regionCode;
    console.log("getArea初始化==" + regionCode + "||默认值=" + defaultAllAreaCode(regionCode));

    if (this.properties.areaNum == '2') {
      var i;
      var j;
      for (i = 0; i < area.length; i++) {
        for (j = 0; j < area[i].children.length; j++) {
          delete area[i].children[j]["children"]
        }
      }
      console.log("address_text===" + getAreaText(regionCode));
      console.log("address_code===" + regionCode);
      this.setData({
        options: area,
        address_text: getAreaText(regionCode),
      })
    }
    else {
      console.log("address_text===" + getAreaText(regionCode));
      console.log("address_code===" + regionCode);
      this.setData({
        options: area,
        address_text: getAreaText(regionCode),
      })
    }
  }

})