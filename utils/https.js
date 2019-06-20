const url = {
  root1: 'https://www.qqwc.top/', //测试
  root3: 'https://www.baogongxia.com/', //部署
  root2: 'http://192.168.0.121:9000/', //本地岳
  root4: 'http://192.168.0.129:9000/', //本地唐
  root5: 'http://192.168.0.111:9000/' //本地钟
}
const root = url.root3;
function req(url, data, method, cb) {
  wx.request({
    url: root + url,
    data: data,
    method: method,
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    success: function(res) {
      if (parseInt(res.data.errorCode) === 201) {
        wx.showModal({
          title: '登录超时',
          content: '请重新登录',
          confirmText: "重新登录",
          cancelText: "返回",
          success: function(res) {
            if (res.confirm) {
              //清除密码
              wx.navigateTo({
                url: '/pages/login/login'
              })
            } else {
              console.log('用户点击辅助操作');
            }
          }
        });
      } else if (parseInt(res.data.errorCode) === 202) {
        wx.showModal({
          title: '密码过期',
          content: '请重新登录',
          confirmText: "重新登录",
          cancelText: "返回",
          success: function(res) {
            if (res.confirm) {
              //清除密码
              wx.clearStorageSync("pwd");
              wx.navigateTo({
                url: '/pages/login/login'
              })
            } else {
              console.log('用户点击辅助操作');
            }
          }
        });
      } else if (parseInt(res.data.errorCode) !== 200) {
        wx.showToast({
          title: '哎哟！网络出问题了',
          icon: 'none'
        })
      }
      return typeof cb == "function" && cb(res.data);
    },
    fail: function() {
      return typeof cb == "function" && cb(false);
    }
  })
}
module.exports = {
  req: req,
  url: root
}