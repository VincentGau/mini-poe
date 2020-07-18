//app.js
App({
  onLaunch: function () {
    console.log("onLaunch")
    // 展示本地存储能力
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        var code = res.code
        if(code){
          wx.request({
            url: 'https://tc.hakucc.com/wechat/getOpenId',
            method: 'post',
            data:{
              code: code
            },
            header:{
              "Content-Type": "application/x-www-form-urlencoded"
            },
            success: function (res) {
              wx.setStorageSync('openid', res.data.openid);
              wx.request({
                url: 'https://tc.hakucc.com/wechat/record',
                method:'POST',
                data:{
                  openid: wx.getStorageSync('openid'),
                  nickname: wx.getStorageSync('userinfo').nickName || '',
                  avatarUrl: wx.getStorageSync('userinfo').avatarUrl || '',
                  country: wx.getStorageSync('userinfo').country || '',
                  province: wx.getStorageSync('userinfo').province || '',
                  gender: Number(wx.getStorageSync('userinfo').gender) || -2,
                  lang: wx.getStorageSync('userinfo').language || '',
                  page: 'onLaunch',
                },
                header:{
                  "Content-Type": "application/x-www-form-urlencoded"
                },
                success:function(r){
                  // console.log(r.data)
                }
              })
            }
          })
        }
        else{
          console.log('登录失败！' + res.errMsg)
        }
      }
    })

    // wx.getUserInfo({
    //   success: (res) => {},
    //   fail: res =>{
    //     wx.navigateTo({
    //       url: '../login/login',
    //     })
    //   }
    // })

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              wx.setStorageSync('userinfo', res.userInfo)

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null
  }
})