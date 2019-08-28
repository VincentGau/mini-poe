// pages/poe-detail/poe-detail.js
wx.cloud.init()

const db = wx.cloud.database()

var WxParse = require('../../wxParse/wxParse.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  toAuthor: function(e){
    wx.navigateTo({
      url: '../author-detail/author-detail?AuthorId=' + e.currentTarget.dataset.authorid,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("----" + options.WorkId)
    var that = this;

    db.collection('works_all').where({
      WorkId: Number(options.WorkId)
    }).orderBy('WorkId', 'asc').limit(10)
    .get({
      success: res => {
        console.log(res.data)
        let content = res.data[0].Content
        let intro = res.data[0].Intro
        let contentParse = that.parseTag(content)
        let introParse = that.parseTag(intro)
        WxParse.wxParse('content', 'html', contentParse, that);
        WxParse.wxParse('intro', 'html', introParse, that);
        this.setData({
          work: res.data[0]
        })
      },
      fail:err=>{
        console.error(err)
      }
    })
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

  parseTag : function (str) {
    console.log("line break " + str)
    var p = str.split("\\r\\n")
    var s = ""
    
    for (var i = 0; i < p.length; i++){
      console.log(i)      
    }

    for (i = 0; i < p.length; i++) {
      s = s + "<view class='p'>" + p[i] + "</view>"
    }
    return s
  }
})