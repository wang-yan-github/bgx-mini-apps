const https = require('./https.js');

//返回所需参数
const getFormData = function(token, dir, callback_) {
  let that_2 = this;
  var data = {};
  data.token = token;
  data.dir = dir;
  https.req('oss_api_controller/getSignature', data, 'POST', function(res) {
    if (parseInt(res.errorCode) == 200) {
      const formData = {};
      var arr = [];
      let rand = parseInt(Math.random()*1000);
      arr.push(res.data.expire + '_' + rand);
      formData.key = res.data.dir + '/' + res.data.expire + '_' + rand + '.png';
      formData.policy = res.data.policy;
      formData.OSSAccessKeyId = res.data.accessid;
      formData.signature = res.data.signature;
      formData.success_action_status = '200';
      formData.timeStamp = arr;
      callback_(formData);
    } else {
      that_2.getFormData(token, dir, callback_);
    }
  })
}

module.exports = {
  getFormData: getFormData
};