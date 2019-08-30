// pages/poe-detail/poe-detail.js
wx.cloud.init()
const db = wx.cloud.database()
const util = require('../../utils/util.js')
var WxParse = require('../../wxParse/wxParse.js');
const like_url = "../../images/like.svg"
const like_filled_url = "../../images/like_filled.svg"
Page({


  /**
   * 页面的初始数据
   */
  data: {
    completed: false,
    like_icon: like_url,
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
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    this.starCheck(options.WorkId)
    db.collection('works_all').where({
      WorkId: Number(options.WorkId)
    }).orderBy('WorkId', 'asc').limit(10)
    .get({
      success: res => {
        let content = res.data[0].Content
        let intro = res.data[0].Intro
        if(res.data[0].Kind == 'shi'){
          let contentParse = util.parseShi(content)
          WxParse.wxParse('content', 'html', contentParse, that);
        }
        else{
          let contentParse = util.parseTag(content)
          WxParse.wxParse('content', 'html', contentParse, that);
        }
        if(intro){
          let introParse = that.parseTag(intro)
          WxParse.wxParse('intro', 'html', introParse, that);
          this.setData({
            introFlag:true,
          })
        }
        wx.hideLoading()
        this.setData({
          work: res.data[0],
          completed: true
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

  toggleStar: function (e) {
    var workid = e.currentTarget.dataset.workid
    if (this.data.starFlag) {
      this.unstarWork(workid)

    }
    else {
      this.starWork(workid)

    }
  },

  // 判断是否已收藏
  starCheck: function (workid) {
    var that = this
    db.collection("star_works").where({
      WorkId: Number(workid)
    }).get({
      success: res => {
        if (res.data != '') {
          that.setData({
            starFlag: true,
            like_icon: like_filled_url
          })
        }
      }
    })
  },

  starWork: function (workid) {
    var that = this
    db.collection("star_works").add({
      data: {
        WorkId: workid,
        StarDate: util.formatTime(new Date())
      },
      success: function (res) {
        console.log(workid + " starred")
        that.setData({
          starFlag: true,
          like_icon: like_filled_url
        })
      },
      fail: console.error
    })
  },

  unstarWork: function (workid) {
    var that = this
    db.collection("star_works").where({
      WorkId: workid
    }).get({
      success: res => {
        var delete_id = res.data[0]._id
        db.collection("star_works").doc(delete_id).remove({
          success: function (res) {
            console.log(workid + " successfully removed")
            that.setData({
              starFlag: false,
              like_icon: like_url
            })
          }
        })
      }
    })
  },
})