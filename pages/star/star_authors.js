// pages/star/star_authors.js
wx.cloud.init()
const db = wx.cloud.database()
const star_authors = db.collection("star_authors")
const authors_all = db.collection("authors_all")

Page({

  /**
   * Page initial data
   */
  data: {
    emptyFlag: true,
    pageindex: 1
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    var starAuthorIds = []
    star_authors.get().then(res =>{
      if(res.data.length > 0){
        for (var i = 0; i < res.data.length; i++) {
          console.log(res.data[i].AuthorId)
          starAuthorIds.push(res.data[i].AuthorId)
        }
        const _ = db.command
        db.collection("authors_all").where({
          authorid: _.in(starAuthorIds)
        }).get().then(res => {
          this.setData({
            starAuthorList: res.data,
            emptyFlag: false
          })
        }).catch(err => {
          console.error(err)
        })
      }
      else{

      }

    }).catch(err =>{
      console.error(err)
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
    var starAuthorIds = []
    star_authors.get().then(res => {
      console.log(res)
      if (res.data.length > 0) {
        for (var i = 0; i < res.data.length; i++) {
          console.log(res.data[i].AuthorId)
          starAuthorIds.push(res.data[i].AuthorId)
        }
        const _ = db.command
        db.collection("authors_all").where({
          authorid: _.in(starAuthorIds)
        }).get().then(res => {
          this.setData({
            starAuthorList: res.data,
            emptyFlag: false
          })
        }).catch(err => {
          console.error(err)
        })
      }
      else {
        this.setData({
          starAuthorList: null,
          emptyFlag: true
        })
      }

    }).catch(err => {
      console.error(err)
    })
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

  }
})