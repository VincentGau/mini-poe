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
    // canIUse: wx.canIUse('button.open-type.getUserInfo'),
    noStarYet: false, // 尚未收藏任何作品
  },
  

  // getUserInfo: function (e) {
  //   // console.log(e)
  //   app.globalData.userInfo = e.detail.userInfo
  //   this.setData({
  //     userInfo: e.detail.userInfo,
  //     hasUserInfo: true
  //   })
  // },


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
      db.collection("works_all").where({
        WorkId: res.list[0].WorkId
      }).get().then(res => {
        let firstSen = util.firstSentence(res.data[0].Content)

        let quote = util.splitQuote(firstSen)
        this.setData({
          quote: quote,
          workId: res.data[0].WorkId
        })
      }).catch(err => {
        console.error(err)
        console.error(res.list[0].WorkId)
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
      db.collection("works_all").where({
        WorkId: res.list[0].workid
      }).get().then(res => {
        let firstSen = util.firstSentence(res.data[0].Content)

        let quote = util.splitQuote(firstSen)
        this.setData({
          quote: quote, 
          workId: res.data[0].WorkId
        })
      }).catch(err => {
        console.error(err)
        console.error(res)
      })
    }).catch(err => {
      console.error(err)
      console.error(res.list[0].WorkId)
    })
  },

  // 首页随机来一首
  randomRefresh: function () {
    // if(wx.getStorageSync('userinfo') && wx.getStorageSync('userinfo') != {}){
    //   console.log("userinfo already exist.")
    // }
    // else{
    //   wx.showModal({
    //     title: '温馨提示',
    //     content: '正在请求您的头像等信息',
    //     showCancel: false,
    //     success(res) {
    //       wx.getUserProfile({
    //         desc: "获取你的昵称、头像、地区及性别",
    //         success: res => {
    //           console.log(res)
    //           wx.setStorageSync('userinfo', res.userInfo)

    //           this.setData({
    //             userinfo: wx.getStorageSync('userinfo'),
    //             radio: wx.getStorageSync('homeRandom') || 0
    //           });
    //         },
    //         fail: res => {
    //           //拒绝授权
    //           return;
    //         }
    //       })
    //     }
    //   })
    // }
    
    let homeRandom = wx.getStorageSync('homeRandom')
    switch (homeRandom) {
      case 0:
        this.randomShiCi(db.collection('ci_300'))
        break;
      case 1:
        this.randomShiCi(db.collection('shi_300'))
        break;
      case 2:
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


    this.randomRefresh()

    // if(app.globalData.openid && app.globalData.openid != ''){
    //   // 表示onlaunch接口调用成功，已经获得openid
    //   // console.log("onload after onlaunch")
    //   wx.request({
    //     url: 'https://tc.hakucc.com/wechat/record',
    //     method:'POST',
    //     data:{
    //       openid: wx.getStorageSync('openid'),
    //       nickname: wx.getStorageSync('userinfo').nickName || '',
    //       avatarUrl: wx.getStorageSync('userinfo').avatarUrl || '',
    //       country: wx.getStorageSync('userinfo').country || '',
    //       province: wx.getStorageSync('userinfo').province || '',
    //       gender: wx.getStorageSync('userinfo').gender,
    //       lang: wx.getStorageSync('userinfo').language || '',
    //       page: '/home',
    //       actionType: '',
    //       actionDetail: '',
    //     },
    //     header:{
    //       "Content-Type": "application/x-www-form-urlencoded"
    //     }
    //   })
    // }
    // else{
    //   // 给app定义一个回调函数
    //   // console.log("onload before onlaunch, define callback")
    //   app.openidCallback = openid => {
    //     wx.request({
    //       url: 'https://tc.hakucc.com/wechat/record',
    //       method:'POST',
    //       data:{
    //         openid: openid,
    //         nickname: wx.getStorageSync('userinfo').nickName || '',
    //         avatarUrl: wx.getStorageSync('userinfo').avatarUrl || '',
    //         country: wx.getStorageSync('userinfo').country || '',
    //         province: wx.getStorageSync('userinfo').province || '',
    //         gender: wx.getStorageSync('userinfo').gender,
    //         lang: wx.getStorageSync('userinfo').language || '',
    //         page: '/home',
    //         actionType: '',
    //         actionDetail: '',
    //       },
    //       header:{
    //         "Content-Type": "application/x-www-form-urlencoded"
    //       }
    //     })
    //   }
    // }
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
    util.logRecord(util.getCurrentPageUrlWithArgs())
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