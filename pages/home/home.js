// pages/home/home.js

var WxParse = require('../../wxParse/wxParse.js');
wx.cloud.init()
const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {

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
              let contentParse = that.parseShi(content)
              WxParse.wxParse('content', 'html', contentParse, that);
            }
            else {
              let contentParse = that.parseTag(content)
              WxParse.wxParse('content', 'html', contentParse, that);
            }
            this.setData({
              work: res.data[0]
            })
          }
        })
      })
  },

  parseTag: function (str) {
    var p = str.split("\\r\\n")
    var s = ""

    for (var i = 0; i < p.length; i++) {
      s = s + "<view class='p'>" + p[i] + "</view>"
    }
    return s
  },

  parseShi: function (str) {
    str = str.replace('\\r\\n', '')
    const reg = new RegExp("(.*?[。！？])", 'gi')
    var p = str.match(reg)    
    var s = ""
    console.log(p)

    for (var i = 0; i < p.length; i++) {
      s = s + "<view class='p'>" + p[i] + "</view>"
    }
    return s
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
    this.getRandom()
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

  }
})