// app.js
App({

  //全局共享的数据
 globalData1:{
   access_token: ' '
 },

 onLaunch: function(){
//this.globalData1.access_token = 'aaa'
wx.request({
  method: 'POST',
  url: 'https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=AOiTzcOQ3a9BmNTY4eiHljEc&client_secret=rZ4PDGe6RxqdbS1PEtW8ybHpteDxBh8m',
  success: (res) => {
//console.log(res)
this.globalData1.access_token = res.data.access_token
  },
  fail: () => {
wx.showToast({
  title: '鉴权失败了唔!',
})
  }
})
 },
  //onLaunch() {
    // 展示本地存储能力
    //const logs = wx.getStorageSync('logs') || []
    //logs.unshift(Date.now())
    //wx.setStorageSync('logs', logs)

    // 登录
    //wx.login({
      //success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      //}
    //})
  //},
  globalData: {
    userInfo: null
  }
})
