const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('-');
  // return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatTime1 = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function trim(str) {
  return str.replace(/(^\s*)|(\s*$)/g, "");
}
var area = require('area.js').area;
// 根据code获得相应地区
function getAreaText(areaCode) {
  if (!areaCode) {
    return "";
  }
  var addr = "";
  var prov = "";
  var city = "";
  var qu = "";
  var prov_code = areaCode.substring(0, 2);
  var city_code = areaCode.substring(2, 4);
  var qu_code = areaCode.substring(4);

  area.find(item1 => {
    if (prov_code == item1.value.substring(0, 2)) {
      prov = item1.label;
      if (areaCode == item1.value) {
        addr = prov;
        return false;
      }
      item1.children.find(item2 => {
        if (city_code == item2.value.substring(2, 4)) {
          city = item2.label;
          if (areaCode == item2.value) {
            addr = prov + "/" + city
            return false;
          }
          item2.children.find(item3 => {
            if (areaCode == item3.value) {
              qu = item3.label;
              addr = prov + "/" + city + "/" + qu;
              return false;
            }
          })
        }
      })
    }
  })
  return addr;
}

// 字符串转数组
function strToArr(str) {
  if (str && (typeof str == 'string') && str.constructor == String) {
    return str.split(",")
  }
  return [];
}
// 数组转字符串
function arrToStr(arr) {
  if ((typeof arr == 'object') && arr.constructor == Array) {
    if (arr.length == 0) {
      return "";
    }
    return arr.join(",");
  }
  return "";
}
/* 选择 consType 
consType 工种类型
education 学历
nation 民salary 期望薪资族
technicalType 项目类型
salary 期望薪资
level 等级
将codes编码值转化成相应的文字
*/
function codeToTextArr(_list, code_arr) {
  var text_arr = [];
  if (code_arr.length > 0) {
    code_arr.forEach(codeItem => {
      _list.forEach(listItem => {
        if (listItem.skey == codeItem) {
          text_arr.push(listItem.name);
        }
      });
    })
    return text_arr;
  } else {
    return [];
  }
}

function textArrToCode(_list, text_arr) {
  var text_arr1 = [];
  if (text_arr.length > 0) {
    text_arr.forEach(codeItem => {
      _list.forEach(listItem => {
        if (listItem.name == codeItem) {
          text_arr1.push(listItem.skey);
        }
      });
    })
    return text_arr1;
  } else {
    return [];
  }
}
// 根据code解析地区当前默认全部code 返回数组
function defaultAllAreaCode(areaCode) {
  if (!areaCode) {
    return [];
  }
  var allCode = [];
  var prov_code = areaCode.substring(0, 2);
  var city_code = areaCode.substring(2, 4);
  var qu_code = areaCode.substring(4);
  if (qu_code == "00") {
    if (city_code == "00") { // 到省
      allCode[0] = prov_code + "0000";
    } else { // 到市
      allCode[0] = prov_code + "0000";
      allCode[1] = prov_code + city_code + "00";
    }
  } else {
    // 到区
    allCode[0] = prov_code + "0000";
    allCode[1] = prov_code + city_code + "00";
    allCode[2] = areaCode;
  }
  return allCode;
}
module.exports = {
  formatTime: formatTime,
  formatTime1: formatTime1,
  trim: trim,
  getAreaText: getAreaText,
  codeToTextArr: codeToTextArr,
  textArrToCode: textArrToCode,
  strToArr: strToArr,
  arrToStr: arrToStr,
  defaultAllAreaCode: defaultAllAreaCode
}