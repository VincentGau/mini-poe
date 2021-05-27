// pages/star/star.js
// wx.cloud.init()
const db = wx.cloud.database()
Page({

  /**
   * Page initial data
   */
  data: {
    starAuthorCount: '-',
    starWorkCount: '-'
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    db.collection('star_works').count().then(res => {
      this.setData({
        starWorkCount: res.total
      })
    })

    db.collection('star_authors').count().then(res => {
      this.setData({
        starAuthorCount: res.total
      })
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
    util.logRecord(util.getCurrentPageUrlWithArgs())
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

  }
})