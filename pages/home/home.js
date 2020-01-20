// pages/home/home.js

var WxParse = require('../../wxParse/wxParse.js');
var util = require('../../utils/util.js')
wx.cloud.init()
const db = wx.cloud.database()

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
    
    this.randomQuote();
    // this.random10();
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