//app.js
wx.cloud.init()
const db = wx.cloud.database()
const MAX_LIMIT = 20
const MAX_LIMIT_CLOUD = 100

App({
  onLaunch: function () {
    if(wx.getStorageSync('hotworks')){
      console.log("hot works already in local storage")
    }
    else{
      
      this.getAllHotWorksCloud()
      // setTimeout(() => {
      //   this.getAllHotWorksCloud2()
      // }, 5000);
    }
    // else{
    //   const countResult = 12459 // 热门作品数量
    //   wx.cloud.callFunction({
    //     // 云函数名称
    //     name: 'getHotWorks',
    //     // 传给云函数的参数
    //     data: {
    //       "startBatch": 0,
    //       "endBatch": 70
    //     },
    //     success: function(res) {
    //       console.log("[getHotWorks] CALL CLOUD FUNCTION SUCCESS!")
    //       wx.setStorage({
    //         data: res.result.data,
    //         key: 'hotworks',
    //       })
    //       // var tmp = wx.getStorageSync('hotworks')
    //       // console.log("[gethotworks] ", tmp)
    //     },
    //     fail: console.error
    //   })
    // }
    



    // 获取热门作品，先查看本地存储是否已经有热门作品 （弃用 改用云函数）
    // var that = this
    // wx.getStorage({
    //   key: "hotworks",
    //   success: function(res){
    //     console.log("Got hot works from local storage")
    //     that.globalData.allHotWorkRecords = res
    //   },
    //   fail:(err) => {
    //     console.log("Hot works not in local storage, get hot works from db.")
    //     console.log(err)
    //     this.getAllHotWorks();
    //   }
    // })
        

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
              console.log('getOpenId:' + res.data.openid)
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

  },

  async getAllHotWorksCloud(){
    console.log("==================")
    let hotworksArr = []
    let promiseArr = []
    // 12459总数量
    for(let i = 0; i < 5; i++){
      promiseArr.push(new Promise((resolve, reject) =>{
          wx.cloud.callFunction({
            name: "getHotWorks",
            data:{
              "startBatch": i * 10,
              "endBatch": (i + 1) * 10
            },
            success: res =>{
              console.log("Success: ", i)
              resolve(res)
              hotworksArr = hotworksArr.concat(res.result.data)
            },
            fail: err =>{
              console.log("failed: ", err)
              reject(err)
            }
          })
        
      }))
    }

    await Promise.all(promiseArr)
    console.log(hotworksArr)
    wx.setStorage({
      data: hotworksArr,
      key: 'hotworks',
    })

    console.log("set localstorage [hotworks]")

    // setTimeout(() => {
    //   this.getAllHotWorksCloud2()
    // }, 5000);
  },

  async getAllHotWorksCloud2(){
    let hotworksArr = []
    let promiseArr = []
    // 12459总数量
    for(let i = 5; i < 9; i++){
      promiseArr.push(new Promise((resolve, reject) =>{
          wx.cloud.callFunction({
            name: "getHotWorks",
            data:{
              "startBatch": i * 10,
              "endBatch": (i + 1) * 10
            },
            success: res =>{
              console.log("Success: ", i)
              resolve(res)
              hotworksArr = hotworksArr.concat(res.result.data)
            },
            fail: err =>{
              console.log("failed: ", err)
              reject(err)
            }
          })
        
      }))
    }

    await Promise.all(promiseArr)
    console.log(hotworksArr)

    var tmp = wx.getStorageSync('hotworks')
    wx.setStorage({
      data: tmp.concat(hotworksArr),
      key: 'hotworks',
    })

    console.log("set localstorage [hotworks]2")

    // setTimeout(() => {
    //   this.getAllHotWorksCloud3()
    // }, 5000);
  },

  async getAllHotWorksCloud3(){
    let hotworksArr = []
    let promiseArr = []
    // 12459总数量
    for(let i = 10; i < 15; i++){
      promiseArr.push(new Promise((resolve, reject) =>{
          wx.cloud.callFunction({
            name: "getHotWorks",
            data:{
              "startBatch": i * 10,
              "endBatch": (i + 1) * 10
            },
            success: res =>{
              console.log("Success: ", i)
              resolve(res)
              hotworksArr = hotworksArr.concat(res.result.data)
            },
            fail: err =>{
              console.log("failed: ", err)
              reject(err)
            }
          })
        
      }))
    }

    await Promise.all(promiseArr)
    console.log(hotworksArr)

    var tmp = wx.getStorageSync('hotworks')
    wx.setStorage({
      data: tmp.concat(hotworksArr),
      key: 'hotworks',
    })

    console.log("set localstorage [hotworks]3")
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