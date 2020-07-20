// pages/home/home.js

var WxParse = require('../../wxParse/wxParse.js');
var util = require('../../utils/util.js')
wx.cloud.init()
const db = wx.cloud.database()

//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    duration: 500, //swiper参数
    previousMargin: 0, //swiper参数
    nextMargin: 0, //swiper参数
    cur: 0, //swiper参数 当前滑块index
    pageIndex: 0, //页数 
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    noStarYet: false, // 尚未收藏任何作品
  },

  getUserInfo: function (e) {
    // console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },


  random10: function () {
    let workIds = []
    db.collection('shi_300').aggregate().sample({
      size: 5
    }).end().then(res => {
      // console.log(res)
      for (var i = 0; i < res.list.length; i++) {
        workIds.push(res.list[i].workid)
      }
      // console.log(workIds)
      const _ = db.command
      db.collection("works_all").where({
        WorkId: _.in(workIds)
      }).get().then(res => {
        // console.log(res.data)
        this.setData({
          works: res.data,
        })
      }).catch(err => {
        console.error(err)
      })
    })
  },

  // 随机获取一个quote
  randomQuote: function () {
    var that = this
    wx.request({
      url: 'https://tc.hakucc.com/quote/random',

      header: {
        'content-type': 'application/json'
      },
      success(res) {
        // console.log(res.data)
        let quote = util.splitQuote(res.data.quote)
        // console.log(res.data.workId)
        that.setData({
          quote: quote,
          authorName: res.data.authorName,
          title: res.data.workTitle,
          workId: res.data.workId,
        })
      },
      fail: res=>{
        wx.showToast({
          title: '获取随机诗词失败',
        })
      }
    })
  },

  // 随机获取收藏过的诗词
  randomLike: function () {
    db.collection('star_works').aggregate().sample({
      size: 1
    }).end().then(res => {
      // console.log(res)
      db.collection("works_all").where({
        WorkId: res.list[0].WorkId
      }).get().then(res => {
        // console.log(res.data)
        let firstSen = util.firstSentence(res.data[0].Content)

        let quote = util.splitQuote(firstSen)
        this.setData({
          quote: quote,
          workId: res.data[0].WorkId
        })
      }).catch(err => {
        console.error(err)
      })
    }).catch(err => {
      console.log("no star")
      this.setData({
        noStarYet: true
      })
      console.error(err)
    })
  },

  // 随机唐诗三百首或宋词三百首，注意和收藏过的诗词列表中workid大小写的不同
  randomShiCi: function (source) {
    source.aggregate().sample({
      size: 1
    }).end().then(res => {
      // console.log(res.list[0].workid)
      db.collection("works_all").where({
        WorkId: res.list[0].workid
      }).get().then(res => {
        // console.log(res.data)
        let firstSen = util.firstSentence(res.data[0].Content)

        let quote = util.splitQuote(firstSen)
        this.setData({
          quote: quote,
          workId: res.data[0].WorkId
        })
      }).catch(err => {
        console.error(err)
      })
    }).catch(err => {
      console.error(err)
    })
  },

  // 首页随机来一首
  randomRefresh: function () {
    let homeRandom = wx.getStorageSync('homeRandom')
    switch (homeRandom) {
      case 0:
        this.randomShiCi(db.collection('ci_300'))
        break;
      case 1:
        this.randomShiCi(db.collection('shi_300'))
        break;
      case 3:
        this.randomLike()
        break;
      default:
        this.randomShiCi(db.collection('shi_300'))
        break;
    }
  },

  toDetail: function (e) {
    wx.navigateTo({
      url: '../poe-detail/poe-detail?WorkId=' + e.currentTarget.dataset.workid,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("onLoad")
    this.randomRefresh()

    if(app.globalData.openid && app.globalData.openid != ''){
      // 表示onlaunch接口调用成功，已经获得openid
      // console.log("onload after onlaunch")
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
          page: '/home',
        },
        header:{
          "Content-Type": "application/x-www-form-urlencoded"
        }
      })
    }
    else{
      // 给app定义一个回调函数
      // console.log("onload before onlaunch, define callback")
      app.openidCallback = openid => {
        wx.request({
          url: 'https://tc.hakucc.com/wechat/record',
          method:'POST',
          data:{
            openid: openid,
            nickname: wx.getStorageSync('userinfo').nickName || '',
            avatarUrl: wx.getStorageSync('userinfo').avatarUrl || '',
            country: wx.getStorageSync('userinfo').country || '',
            province: wx.getStorageSync('userinfo').province || '',
            gender: Number(wx.getStorageSync('userinfo').gender) || -2,
            lang: wx.getStorageSync('userinfo').language || '',
            page: '/home',
          },
          header:{
            "Content-Type": "application/x-www-form-urlencoded"
          }
        })
      }
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log("onShow")
    // if (!wx.getStorageSync('userinfo') || !wx.getStorageSync('openid')) {
    //   wx.getUserInfo({
    //     success: (res) => {
    //       app.globalData.userInfo = res.userInfo
    //       wx.setStorageSync('userinfo', res.userInfo)
    //       wx.login({
    //         success: res=>{
    //           var code = res.code
    //           if(code){
    //             wx.request({
    //               url: 'https://tc.hakucc.com/wechat/getOpenId',
    //               method: 'post',
    //               data:{
    //                 code: code
    //               },
    //               header:{
    //                 "Content-Type": "application/x-www-form-urlencoded"
    //               },
    //               success: function (res) {
    //                 wx.setStorageSync('openid', res.data.openid);
  
    //                 wx.request({
    //                   url: 'https://tc.hakucc.com/wechat/record',
    //                   method:'POST',
    //                   data:{
    //                     openid: wx.getStorageSync('openid'),
    //                     nickname: wx.getStorageSync('userinfo').nickName,
    //                     avatarUrl: wx.getStorageSync('userinfo').avatarUrl,
    //                     country: wx.getStorageSync('userinfo').country,
    //                     province: wx.getStorageSync('userinfo').province,
    //                     gender: wx.getStorageSync('userinfo').gender,
    //                     lang: wx.getStorageSync('userinfo').language,
    //                     page: '/home',
    //                   },
    //                   header:{
    //                     "Content-Type": "application/x-www-form-urlencoded"
    //                   },
    //                   success:function(r){
    //                     console.log(r.data)
    //                   }
    //                 })
    //               }
    //             })
    //           }
    //           else{
    //             console.log('登录失败！' + res.errMsg)
    //           }
              
    //         }
    //       })
    //     },
    //     fail: () => {
    //       wx.navigateTo({
    //         url: '../login/login',
    //       })
    //     }
    //   })
    // }
    // else{
    //   let openid = wx.getStorageSync('openid')
    //   let userinfo = wx.getStorageSync('userinfo')
    //   wx.request({
    //     url: 'https://tc.hakucc.com/wechat/record',
    //     method:'POST',
    //     data:{
    //       openid: openid,
    //       nickname: userinfo.nickName,
    //       avatarUrl: userinfo.avatarUrl,
    //       country: userinfo.country,
    //       province: userinfo.province,
    //       gender: userinfo.gender,
    //       lang: userinfo.language,
    //       page: '/home',
    //     },
    //     header:{
    //       "Content-Type": "application/x-www-form-urlencoded"
    //     },
    //     success:function(res){
    //       // console.log(res.data)
    //     }
    //   })
    // }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },


})