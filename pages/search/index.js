// pages/search/index.js
wx.cloud.init()
const db = wx.cloud.database()

Page({

  /**
   * Page initial data
   */
  data: {
    hasMoreWorks: false,
    hasMoreAuthors: false,
    completed:false,
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    this.setData({
      inputShowed:true
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

  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  naviback: function () {    
    wx.navigateBack({
      delta: 1
    })
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e) {
    this.setData({
      hasMoreWorks: false,
      hasMoreAuthors: false,
      searchResultWorks: '',
      searchResultAuthors: '',
      keyword :e.detail.value,
    })

    wx.showToast({
      title: '数据加载中',
      icon: 'loading',
      duration: 100000
    })

    const _ = db.command
    
    db.collection("works_hot").where(_.or([
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
    ])).orderBy('LikesCount', 'desc').get({
        success: res => {
          this.setData({
            searchResultWorks: res.data,
            completed: true
          })

          wx.setStorage({
            key: "works20",
            data: res.data
          })

          if (res.data == '') {
            this.setData({
              noResultWork: true
            })
          }
          else {
            this.setData({
              noResultWork: false
            })
            if (res.data.length > 4) {
              this.setData({
                hasMoreWorks: true
              })
            }
          }
        },
        fail: err => {
          console.error(err)
        },
        complete: () => {
          wx.hideToast()
        }
      })

    // db.collection("works_hot").where(
    //   {
    //     Content: {
    //       $regex: '.*' + e.detail.value,
    //       $options: 'i'
    //     }
    //   }).orderBy('WorkId', 'asc').get({
    //     success: res => {
    //       this.setData({
    //         searchResultWorks: res.data,
    //         completed: true
    //       })

    //       if (res.data == '') {
    //         this.setData({
    //           noResultWork: true
    //         })
    //       }
    //       else {
    //         this.setData({
    //           noResultWork: false
    //         })
    //         if (res.data.length > 4) {
    //           this.setData({
    //             hasMoreWorks: true
    //           })
    //         }
    //       }
    //     },
    //     fail: err => {
    //       console.error(err)
    //     },
    //     complete: () => {
    //       wx.hideToast()
    //     }
    //   })

    db.collection("authors_all").where({
      authorname: {
        $regex: '.*' + e.detail.value,
        $options: 'i'
      }
    }).orderBy('authorid', 'asc').get({
      success: res => {
        this.setData({
          searchResultAuthors: res.data,
        })

        if (res.data == '') {
          this.setData({
            noResultAuthor: true
          })
        }
        else {
          this.setData({
            noResultAuthor: false
          })
          if (res.data.length > 4) {
            this.setData({
              hasMoreAuthors: true
            })
          }
        }
      }
    })

    this.setData({
      inputVal: e.detail.value
    });
  }
})