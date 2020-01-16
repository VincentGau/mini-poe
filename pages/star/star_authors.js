// pages/star/star_authors.js
wx.cloud.init()
const db = wx.cloud.database()
const star_authors = db.collection("star_authors")
const authors_all = db.collection("authors_new")

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
    wx.showLoading({
      title: '加载中',
    })
    var starAuthorIds = []
    star_authors.get().then(res =>{
      if(res.data.length > 0){
        //结果小于20表示已经加载完
        if(res.data.length < 20){
          this.setData({
            endFlag:true,
          })
        }
        for (var i = 0; i < res.data.length; i++) {
          starAuthorIds.push(res.data[i].AuthorId)
        }
        const _ = db.command
        db.collection("authors_new").where({
          authorid: _.in(starAuthorIds)
        }).get().then(res => {
          wx.hideLoading()
          this.setData({
            starAuthorList: res.data,
            emptyFlag: false,
            completed: true,
          })
        }).catch(err => {
          console.error(err)
        })
      }
      else{
        wx.hideLoading()
        this.setData({
          emptyFlag: true,
          completed: true,
        })
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
      if (res.data.length > 0) {
        for (var i = 0; i < res.data.length; i++) {
          starAuthorIds.push(res.data[i].AuthorId)
        }
        const _ = db.command
        db.collection("authors_new").where({
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
    let curpage = this.data.pageindex
    var starAuthorIds = []
    star_authors.skip(curpage * 20).limit(20).get({
      success: res => {
        if(res.data.length > 0){
          curpage++;
          if (res.data.length < 20) {
            this.setData({
              endFlag: true,
            })
          }
          for (var i = 0; i < res.data.length; i++) {
            starAuthorIds.push(res.data[i].AuthorId)
          }
          console.log(starAuthorIds)
          const _ = db.command
          db.collection("authors_new").where({
            authorid: _.in(starAuthorIds)
          }).get().then(res => {
            wx.hideLoading()
            this.setData({
              starAuthorList: this.data.starAuthorList.concat(res.data),
              pageindex: curpage,
              emptyFlag: false,
              completed:true,
            })
          }).catch(err => {
            console.error(err)
          })
        }
        else {
          wx.hideLoading()
          this.setData({         
            completed:true,
          })
          
        }
      }
    })
  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  }
})