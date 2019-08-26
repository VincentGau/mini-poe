// pages/author-detail/author-detail.js
wx.cloud.init()
const db = wx.cloud.database()
const util = require('../../utils/util.js')
Page({

  /**
   * Page initial data
   */
  data: {
    starFlag: false,
    starcontent: "star"
  },

  

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    var that = this
    this.starCheck(options.AuthorId)
    db.collection('authors_all').where({
      authorid: Number(options.AuthorId)
    }).get({
        success: res => {
          this.setData({
            author: res.data[0]
          })
        }
      })    
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  },

  toggleStar: function (e){
    var authorid = e.currentTarget.dataset.authorid
    if(this.data.starFlag){
      this.unstarAuthor(authorid)
      
    }
    else{
      this.starAuthor(authorid)
      
    }
  },

  // 判断是否已收藏
  starCheck: function (authorid) {
    var that = this
    console.log("running starred")
    console.log(authorid)
    db.collection("star_authors").where({
      AuthorId: Number(authorid)
    }).get({
      success: res => {
        console.log("RES")
        console.log(res)
        console.log(res.data)
        if (res.data != '') {
          console.log("NOT NULL")
          that.setData({
            starFlag: true,
            starcontent:"unstar"
          })
        }
      }
    })
  },

  starAuthor1: function(e){
    console.log("author star")
    var that = this
    db.collection("star_authors").add({
      data:{
        AuthorId: e.currentTarget.dataset.authorid,
        StarDate: util.formatTime(new Date())
      },
      success: function(res){
        console.log(res)
      },
      fail: console.error
    })
  },

  starAuthor: function (authorid) {
    var that = this
    db.collection("star_authors").add({
      data: {
        AuthorId: authorid,
        StarDate: util.formatTime(new Date())
      },
      success: function (res) {
        console.log(authorid + " starred")
        that.setData({
          starFlag: true,
          starcontent: "UNSTAR"
        })
      },
      fail: console.error
    })
  },

  unstarAuthor1: function (e) {
    console.log("unauthor star")
    console.log(e.currentTarget.dataset.authorid)
    var that = this
    db.collection("star_authors").where({
      AuthorId: e.currentTarget.dataset.authorid
    }).get({
      success: res =>{
        var delete_id = res.data[0]._id
        console.log(delete_id)
        
        db.collection("star_authors").doc(delete_id).remove({
          success: function (res) {
            console.log("successfully removed")
            console.log(res)
          }
        })
      }
    })
  },

  unstarAuthor: function (authorid) {
    console.log("----unauthor star")
    var that = this
    db.collection("star_authors").where({
      AuthorId: authorid
    }).get({
      success: res => {
        var delete_id = res.data[0]._id
        db.collection("star_authors").doc(delete_id).remove({
          success: function (res) {
            console.log(authorid + " successfully removed")
            that.setData({
              starFlag: false,
              starcontent: "STAR"
            })
          }
        })
      }
    })
  }
})