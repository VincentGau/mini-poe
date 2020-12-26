//app.js
wx.cloud.init()
const db = wx.cloud.database()
const MAX_LIMIT = 20

App({
  onLaunch: function () {
    // 查看本地存储是否已经有热门作品
    let hotworksInStorage = wx.getStorage({
      key: 'hotworks',
    })
    if(hotworksInStorage){
      console.log(123)
      this.globalData.allHotWorkRecords = hotworksInStorage
    }
    else{
      console.log(234)
      this.getAllHotWorks();
    }
    

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
            success: res => {
              this.globalData.openid = res.data.openid
              wx.setStorageSync('openid', res.data.openid);
              if(this.openidCallback){
                console.log("callback...")
                this.openidCallback(res.data.openid)
              }              
            }
          })
        }
        else{
          console.log('登录失败！' + res.errMsg)
        }
      }
    })

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          console.log("已授权")
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

  // 获取所有热门作品
  getAllHotWorks:function (){
    var that = this
    db.collection("works_hot").count().then(async res =>{
      let total = res.total
      console.log("hot works count: " + total)

      // 计算需要分几次获取全部数据 每次请求最多可以20条数据（云函数可以100条）
      let batchTimes = Math.ceil(total / MAX_LIMIT)
      batchTimes = 200  // 控制最多返回200 * 20 = 4000条记录
      console.log(batchTimes)

      // 按WorkId升序排序，
      for(let i = 0; i < batchTimes; i++){
        await db.collection("works_hot").field({
          WorkId: true,
          Content: true
        }).orderBy("WorkId", "asc").skip(i * MAX_LIMIT).limit(MAX_LIMIT).get().then(async res =>{
          let tmp_data = res.data
          // console.log("-----"+tmp_data[0].WorkId)

          
          let cur_data = that.globalData.allHotWorkRecords
          // console.log(cur_data)
          that.globalData.allHotWorkRecords = cur_data.concat(tmp_data)
          
        })
      }

      // 将热门作品放入localstorage
      wx.setStorage({
        data: that.globalData.allHotWorkRecords,
        key: 'hotworks',
      })
    })
  },

  globalData: {
    userInfo: null,
    openid: '',
    allHotWorkRecords: [],
  }
})