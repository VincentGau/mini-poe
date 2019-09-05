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
    touchS: [0, 0],
    touchE: [0, 0]
  },

  toDetail: function (e) {
    wx.navigateTo({
      url: '../poe-detail/poe-detail?WorkId=' + e.currentTarget.dataset.workid,
    })
  },

  getRandom:function(){
    var that = this
    db.collection('star_works')
      .aggregate()
      .sample({
        size: 1
      })
      .end().then(res => {
        var workid = res.list[0].WorkId
        db.collection('works_all').where({
          WorkId:workid
        }).get({
          success:res=>{
            let content = res.data[0].Content
            if (res.data[0].Kind == 'shi') {
              let contentParse = util.parseShi(content)
              WxParse.wxParse('content', 'html', contentParse, that);
            }
            else {
              let contentParse = util.parseTag(content)
              WxParse.wxParse('content', 'html', contentParse, that);
            }
            this.setData({
              work: res.data[0]
            })
          }
        })
      })
  },

  randomCi300: function(){
    var that = this
    db.collection('ci_300')
      .aggregate()
      .sample({
        size: 1
      })
      .end().then(res => {
        var workid = res.list[0].workid
        db.collection('works_all').where({
          WorkId: workid
        }).get({
          success: res => {
            let content = res.data[0].Content
            if (res.data[0].Kind == 'shi') {
              let contentParse = util.parseShi(content)
              WxParse.wxParse('content', 'html', contentParse, that);
            }
            else {
              let contentParse = util.parseTag(content)
              WxParse.wxParse('content', 'html', contentParse, that);
            }
            this.setData({
              work: res.data[0]
            })
          }
        })
      })
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        console.log(res)
        console.log(res.windowHeight)
        that.setData({
          wheight: res.windowHeight
        })
      }
    })
    // this.getRandom()
    this.randomCi300()
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

  touchStart:function(e){
    var that = this
    let sx = e.touches[0].pageX
    let sy = e.touches[0].pageY
    that.data.touchS = [sx, sy]
  },

  touchMove: function (e){
    var that = this
    let sx = e.touches[0].pageX
    let sy = e.touches[0].pageY
    that.data.touchE = [sx, sy]
  },

  touchEnd: function (e){
    var that = this
    let start = that.data.touchS
    let end = that.data.touchE
    console.log(start)
    console.log(end)
    if (start[0] < end[0] - 50) {
      console.log('右滑')
      this.getRandom()
    } else if (start[0] > end[0] + 50) {
      console.log('左滑')
      this.getRandom()
    } else {
      console.log('静止')
    }
  }
})