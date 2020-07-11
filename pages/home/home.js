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
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  getUserInfo: function(e) {
    console.log(e)
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
      console.log(res)
      for (var i = 0; i < res.list.length; i++) {
        workIds.push(res.list[i].workid)
      }
      console.log(workIds)
      const _ = db.command
      db.collection("works_all").where({
        WorkId: _.in(workIds)
      }).get().then(res => {
        console.log(res.data)
        this.setData({
          works: res.data,
        })
      }).catch(err => {
        console.error(err)
      })
    })
  },

  // 随机获取一个quote
  randomQuote: function(){
    var that = this
    wx.request({
      url: 'https://tc.hakucc.com/quote/random',
      
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        console.log(res.data)
        let quote = util.splitQuote(res.data.quote)        
        console.log(res.data.workId)
        that.setData({
          quote: quote,
          authorName:res.data.authorName,
          title: res.data.workTitle,
          workId: res.data.workId,
        })
      }
    })
  },

  // 随机获取收藏过的诗词
  randomLike: function(){
    db.collection('star_works').aggregate().sample({
      size:1
    }).end().then(res =>{
      console.log(res)
      db.collection("works_all").where({
        WorkId: res.list[0].WorkId
      }).get().then(res => {
        // console.log(res.data)
        let firstSen = util.firstSentence(res.data[0].Content)
        
        let quote = util.splitQuote(firstSen)    
        this.setData({
          quote:quote,
          workId:res.data[0].WorkId
        })
      }).catch(err => {
        console.error(err)
      })
    }).catch(err => {
      console.error(err)
    })
  },

  // 随机唐诗三百首或宋词三百首，注意和收藏过的诗词列表中workid大小写的不同
  randomShiCi: function(source){
    source.aggregate().sample({
      size:1
    }).end().then(res =>{
      console.log(res.list[0].workid)
      db.collection("works_all").where({
        WorkId: res.list[0].workid
      }).get().then(res => {
        // console.log(res.data)
        let firstSen = util.firstSentence(res.data[0].Content)
        
        let quote = util.splitQuote(firstSen)    
        this.setData({
          quote:quote,
          workId:res.data[0].WorkId
        })
      }).catch(err => {
        console.error(err)
      })
    }).catch(err => {
      console.error(err)
    })
  },

  // 首页随机来一首
  randomRefresh: function(){
    let homeRandom = wx.getStorageSync('homeRandom')
    switch(homeRandom){
      case '0':        
        this.randomShiCi(db.collection('ci_300'))
        break;
      case '1':
        this.randomShiCi(db.collection('shi_300'))
        break;
      case '2':
        this.randomLike()
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

  // 滑动切换
  swipeChange: function (e) {
    // console.log("Page: " + this.data.pageIndex)
    // console.log("Total works: " + this.data.works.length)
    let current = e.detail.current;
    let source = e.detail.source
    //console.log(source);
    // console.log(current, this.data.index, this.data.cur)
    // this.setData({
    //   index: current
    // })

    let workIds = []
    //滑动到最后一个swiper-item的时候加载新的作品
    if ((current + 1) / 5 == this.data.pageIndex + 1) {
      db.collection('shi_300').aggregate().sample({
        size: 5
      }).end().then(res => {
        this.data.pageIndex++
        console.log(res)
        for (var i = 0; i < res.list.length; i++) {
          workIds.push(res.list[i].workid)
        }
        console.log(workIds)
        const _ = db.command
        db.collection("works_all").where({
          WorkId: _.in(workIds)
        }).get().then(res => {
          console.log(res.data)
          this.setData({
            works: this.data.works.concat(res.data),
          })
        }).catch(err => {
          console.error(err)
        })
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.randomRefresh()
    console.log("UserInfo: " + app.globalData.userInfo)
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
      wx.setStorageSync('nickname', this.data.userInfo.nickName)
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        // console.log(res.userInfo)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        wx.setStorageSync('nickname', this.data.userInfo.nickName)
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
          wx.setStorageSync('nickname', this.data.userInfo.nickName)
        }
      })
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