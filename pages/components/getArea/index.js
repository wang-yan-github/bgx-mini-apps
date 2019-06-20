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
  },

  /**
   * 组件的初始数据
   */
  data: {
    options: [],
    // 地区默认值
    defaultValue: [],
    address_code: [],
    visible: false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onOpen() {
      this.setData({
        visible: true,
        address_code: this.data.defaultValue
      })
    },
    onClose() {
      this.setData({
        visible: false,
        defaultValue: this.data.address_code
      })
      var address_code = this.data.address_code;
      if (address_code.length > 0) {
        var region_code = address_code[address_code.length - 1];
        const myEventDetail = {
          "region_code": region_code
        } // detail对象，提供给事件监听函数
        const myEventOption = {} // 触发事件的选项
        this.triggerEvent('myeventArea', myEventDetail, myEventOption);
      }
    },
    onChange(e) {
      // console.log("改变值");
      this.setData({
        address_text: e.detail.options.map((n) => n.label).join('/'),
        address_code: e.detail.options.map((n) => n.value)
      })
    },
  },
  attached() {
    var regionCode = this.data.regionCode;
    let defaultValue = defaultAllAreaCode(regionCode);
    this.setData({
      defaultValue: defaultValue
    })
  },
  ready() {
    var regionCode = this.data.regionCode;

    if (this.properties.areaNum == '2') {
      var i;
      var j;
      for (i = 0; i < area.length; i++) {
        for (j = 0; j < area[i].children.length; j++) {
          delete area[i].children[j]["children"]
        }
      }
      this.setData({
        options: area,
        address_text: getAreaText(regionCode)
      })
    } else {
      this.setData({
        options: area,
        address_text: getAreaText(regionCode),
      })
    }
  }

})