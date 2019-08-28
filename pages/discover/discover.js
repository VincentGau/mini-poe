// pages/discover/discover.js
wx.cloud.init()
const db = wx.cloud.database()

Page({

  /**
   * Page initial data
   */
  data: {
    hasMoreWorks: false,
    hasMoreAuthors: false
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
    this.setData({
      hasMoreWorks: false,
      hasMoreAuthors: false,
      searchResultWorks: '',
      searchResultAuthors: '',
    })
    
    wx.showToast({
      title: '数据加载中',
      icon: 'loading',
      duration:100000
    })

    const _ = db.command
    // db.collection("works_all").where(_.or([
    //   {
    //     Content: {
    //       $regex: '.*' + e.detail.value,
    //       $options: 'i'
    //     }
    //   },
    //   {
    //     Title: {
    //       $regex: '.*' + e.detail.value,
    //       $options: 'i'
    //     }
    //   }
    // ])).orderBy('WorkId', 'asc').get({
    //   success: res => {
    //     console.log(res.data)
    //     this.setData({
    //       searchResultWorks: res.data
    //     })
        
    //     if(res.data == ''){
    //       this.setData({
    //         noResultWork: true
    //       })
    //     }
    //     else{
    //       this.setData({
    //         noResultWork: false
    //       })
    //       if (res.data.length > 4) {
    //         this.setData({
    //           hasMoreWorks: true
    //         })
    //       }
    //     }
    //   }
    // })

    db.collection("works_all").where(
      {
        Content: {
          $regex: '.*' + e.detail.value,
          $options: 'i'
        }
      }).orderBy('WorkId', 'asc').get({
      success: res => {
        this.setData({
          searchResultWorks: res.data
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
      fail:err=>{
        console.error(err)
      },
      complete:()=>{
        wx.hideToast()
      }
    })

    db.collection("authors_all").where({
      authorname: {
        $regex: '.*' + e.detail.value,
        $options: 'i'
      }
    }).orderBy('authorid', 'asc').get({
      success: res => {
        this.setData({
          searchResultAuthors: res.data
        })

        if(res.data == ''){
          this.setData({
            noResultAuthor: true
          })
        }
        else{
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