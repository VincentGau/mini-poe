// pages/discover/discover.js
wx.cloud.init()
const db = wx.cloud.database()

Page({

  /**
   * Page initial data
   */
  data: {

  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {

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

  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e) {
    const _ = db.command
    db.collection("works-1").where(_.or([
      {
        Content: {
          $regex: '.*' + e.detail.value,
          $options: 'i'
        }
      },
      {
        Title: {
          $regex: '.*' + e.detail.value,
          $options: 'i'
        }
      }
    ])).get({
      success: res => {
        console.log(res.data)
        this.setData({
          searchResultWorks: res.data
        })
      }
    })

    db.collection("authors_all").where({
      authorname: {
        $regex: '.*' + e.detail.value,
        $options: 'i'
      }
    }).get({
      success: res => {
        if(res.data != ''){
          console.log("author not null")
        }
        else{
          console.log("authors null")
        }
        this.setData({
          searchResultAuthors: res.data
        })
      }
    })    

    this.setData({
      inputVal: e.detail.value
    });
  }
})