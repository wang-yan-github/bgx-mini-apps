// pages/components/selfModal/index.js
/** * 自定义modal浮层 * 使用方法： * 
 * <modal show="{{showModal}}" height='60%' bindcancel="modalCancel" bindconfirm='modalConfirm'> 
 *    <view>你自己需要展示的内容</view> 
 * </modal> 
 * 属性说明： 
 * show： 控制modal显示与隐藏 
 * height：modal的高度 
 * bindcancel：点击取消按钮的回调函数 
 * bindconfirm：点击确定按钮的回调函数 
 *  */
var util = require("../../../utils/util.js");
var strToArr = util.strToArr;
var arrToStr = util.arrToStr;
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: { //是否显示侧边栏
      type: Boolean,
      value: false
    },
    checkboxArr: { // 需要展示的数据元数组
      type: Array,
      value: []
    },
    selectVal: { // 已选中的数组值
      type: Array,
      value: []
    },
    sideText: { // 侧边栏的标题
      type: String,
      value: ""
    },
    selectNum: { // 侧边栏能够多选的数量
      type: Number,
      value: 1,
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    // 单选还是多选
    radioCheckbox: true,
    // 顶部确定位置
    btnPos: false,
    // 备注文字显示
    showBz: true,
    // 选中的值
    checkValue: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    clickMask() {
      console.log("点击了蒙层");
      this.setData({
        show: false
      })
    },
    // 多选
    checkbox: function (e) {
      var index = e.currentTarget.dataset.index; //获取当前点击的下标
      var checkboxArr = this.data.checkboxArr; //选项集合
      var checkedTrue = 0;
      for (var i = 0; i < checkboxArr.length; i++) {
        if (checkboxArr[i].checked) {
          checkedTrue++;
        }
      }
      if (checkedTrue >= this.properties.selectNum) { // 控制选择class
        checkboxArr[index].checked = false;
      } else {
        checkboxArr[index].checked = !checkboxArr[index].checked; //改变当前选中的checked值
      }
      this.setData({
        checkboxArr: checkboxArr
      });
    },
    // 单选
    radio: function (e) {
      var index = e.currentTarget.dataset.index;//获取当前点击的下标
      var checkboxArr = this.data.checkboxArr;//选项集合
      if (checkboxArr[index].checked) return;//如果点击的当前已选中则返回
      checkboxArr.forEach(item => {
        item.checked = false
      })
      checkboxArr[index].checked = true;//改变当前选中的checked值
      this.setData({
        checkboxArr: checkboxArr
      });

      // console.log(checkboxArr);
    },

    checkboxChange: function (e) {
      var that = this;
      var checkValue = e.detail.value;                     
      checkValue = checkValue.slice(0, that.properties.selectNum)
      
      // console.log("当前已有的值=" + checkValue);
      that.setData({
        checkValue: checkValue
      });
    },
    radioChange: function (e) {
      var that = this;
      var radioValue = e.detail.value;
      var _checkValue = [];
      _checkValue.push(radioValue);
      that.setData({
        checkValue: _checkValue
      });
    },
    // 确定
    onConfirm: function () { 
      this.setData({
        show: false,
      })
      console.log(this.data.checkValue);
      var check_text_str = "";
      var check_code_str = "";
      var check_text_arr = [];
      var check_code_arr = [];
      var item_arr = this.data.checkValue;
      if (item_arr.length > 0) {
        for (var i = 0; i < item_arr.length; i++) {
          check_text_arr.push(item_arr[i].split("/")[0]);
          check_code_arr.push(item_arr[i].split("/")[1]);
        }
        check_text_str = arrToStr(check_text_arr);
        check_code_str = arrToStr(check_code_arr);
      }

      var myEventDetail = {}; // detail对象，提供给事件监听函数
      myEventDetail.checkValue_text = check_text_str;
      myEventDetail.checkValue_code = check_code_str;
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('myevent', myEventDetail, myEventOption)
      console.log("选择的项参数myEventDetail==" + JSON.stringify(myEventDetail)) //所有选中的项的value
    },
    // 重置
    onReset: function () {
      var checkboxArr = this.properties.checkboxArr;
      console.log(checkboxArr);
      for (let i = 0; i < checkboxArr.length; i++) {
        checkboxArr[i].checked = false;
      }

      this.setData({
        checkboxArr: checkboxArr,
        checkValue: []
      });
    },
    // 初始化对顶部确定按钮的位置判定
    loadBtnpos: function () {
      var len = this.properties.checkboxArr.length;
      // console.log(len);
      if (len > 36) { 
        this.setData({
          btnPos: true,
        })
      }
    },
    // 若是只传值选择数量为1，则不显示多选文字提醒，单选多选判定
    showBeizh: function () {
      if (this.properties.selectNum == 1) {
        this.setData({
          showBz: false,
          radioCheckbox: false,
        })
      }
    },
  },
  ready () {
    let checkboxArr = this.data.checkboxArr;
    let selectVal = this.data.selectVal;
    // 给初始化数组对象加checked属性以控制焦点
    checkboxArr.forEach( (item) => {
      // 先失去所有焦点
      item.checked = false;
      selectVal.forEach( (item2) => {
        // 再设置所选值的焦点
        if (item.name == item2) {
          item.checked = true
        }
      })
    })
    this.setData({
      checkboxArr: checkboxArr
    })
    this.showBeizh();
  }
})