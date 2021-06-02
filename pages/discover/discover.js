// pages/discover/discover.js
wx.cloud.init()
const db = wx.cloud.database()
const util = require('../../utils/util.js')

Page({

  /**
   * Page initial data
   */
  data: {
    hasMoreWorks: false,
    hasMoreAuthors: false,
    topCipai: []
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    this.getTopCipai();
    
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  // 获取前20个词牌
  getTopCipai: function() {
    if(wx.getStorageSync('topCipai')){
      this.setData({
        topCipai: wx.getStorageSync('topCipai')
      })
    }
    else{
      db.collection('cipai').orderBy('oorder', 'asc').get({
        success: res =>{
          this.setData({
            topCipai: res.data
          })
          wx.setStorageSync('topCipai', this.data.topCipai)
          console.log(this.data.topCipai)
        }
      })
    }
    
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

  },

})