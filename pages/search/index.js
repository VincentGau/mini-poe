// pages/search/index.js
wx.cloud.init()
const db = wx.cloud.database()

Page({

  /**
   * Page initial data
   */
  data: {
    hasMoreWorks: false, //是否显示查看更多作品
    hasMoreAuthors: false, //是否显示查看更多作者
    completed:false,
    searchHistory:[], //搜索历史记录
    hideSearchHistory:false,
    hasSearchHistory:false,
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    var a = wx.getStorageSync('searchHistory') 
    console.log('STORAGE') 
    console.log(a)
    this.setData({
      inputShowed:true,
      searchHistory: wx.getStorageSync('searchHistory')  
    })
    if (wx.getStorageSync('searchHistory')){
      this.setData({
        showClear:true,
      })
    }
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
    var that = this
    this.setData({
      hasMoreWorks: false,
      hasMoreAuthors: false,
      searchResultWorks: '',
      searchResultAuthors: '',
      keyword :e.detail.value,
      showClear:false,
      hideSearchHistory:true,
    })

    // 搜索后将搜索记录缓存到本地
    if ("" != e.detail.value) {
      var searchHistory = that.data.searchHistory;
      if(searchHistory == ''){
        searchHistory = []
      }
      // 使用队列，保证在查看搜索历史记录时最近搜索内容在顶部
      searchHistory.unshift(e.detail.value);
      wx.setStorageSync('searchHistory', searchHistory);
    }

    // 停止输入时显示加载中提示，查询完成后隐藏
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

    db.collection("authors").where({
      authorname: {
        $regex: '.*' + e.detail.value,
        $options: 'i'
      }
    }).orderBy('authorid', 'asc').get({
      success: res => {
        wx.setStorage({
          key: "authors20",
          data: res.data 
        })
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
  },

  // 清除搜索历史记录
  clearSearchHistory: function(){
    wx.removeStorageSync('searchHistory')
    this.setData({
      hideSearchHistory:true,
      showClear:false
    })
  },

  doSearch:function(e){
    var p = e.currentTarget.dataset.text
    var that = this
    this.setData({
      hasMoreWorks: false,
      hasMoreAuthors: false,
      searchResultWorks: '',
      searchResultAuthors: '',
      keyword: p,
      showClear: false,
      hideSearchHistory: true,
    })

    // 搜索后将搜索记录缓存到本地
    if ("" != p) {
      var searchHistory = that.data.searchHistory;
      if (searchHistory == '') {
        searchHistory = []
      }
      // 使用队列，保证在查看搜索历史记录时最近搜索内容在顶部
      searchHistory.unshift(p);
      wx.setStorageSync('searchHistory', searchHistory);
    }

    // 停止输入时显示加载中提示，查询完成后隐藏
    wx.showToast({
      title: '数据加载中',
      icon: 'loading',
      duration: 100000
    })

    const _ = db.command

    db.collection("works_hot").where(_.or([
      {
        Content: {
          $regex: '.*' + p,
          $options: 'i'
        }
      },
      {
        Title: {
          $regex: '.*' + p,
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

    

    db.collection("authors_all").where({
      authorname: {
        $regex: '.*' + p,
        $options: 'i'
      }
    }).orderBy('authorid', 'asc').get({
      success: res => {
        wx.setStorage({
          key: "authors20",
          data: res.data
        })
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
      inputVal: p
    });
  },
})