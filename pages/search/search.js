// pages/search/search.js
wx.cloud.init()
const db = wx.cloud.database()

Page({

  /**
   * Page initial data
   */
  data: {
    hasMoreWorks: false, //是否显示[查看更多作品]字样
    hasMoreAuthors: false, //是否显示[查看更多作者]字样
    completed:false, //是否已加载完成
    searchHistory:[], //搜索历史记录
    hideSearchHistory:false, //是否显示搜索历史记录
    hasSearchHistory:false, //是否存在搜索历史记录
    inputVal: '', // 搜索关键词
    showClear: false, //是否显示清除历史记录字样
    showHint: false, //是否显示无搜索记录字样
    showNoResult: false, // 是否展示没有找到相关诗句字样
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    var a = wx.getStorageSync('searchHistory')
    // 将搜索历史转为set，防止出现重复元素
    let set_a = new Set(a)
    
    this.setData({
      inputShowed:true,
      searchHistory: [...set_a] //set再转换回array
    })
    if (wx.getStorageSync('searchHistory')){
      this.setData({
        showClear:true, // 是否显示清除历史记录字样
        showHint:false,
      })
    }
  },

  onCancel: function(){
    wx.navigateBack({
      delta: 1
    })
  },

  // 点击搜索框的×
  onClear:function(){
    this.setData({
      hasMoreWorks: false,
      hasMoreAuthors: false,
      searchResultWorks: '',
      searchResultAuthors: '',
      keyword: '',
      showClear: true,
      showHint: false,
      hideSearchHistory: false,
      showNoResult: false,
      inputVal: '',
      completed:false,
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

  },

  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },

  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  }, 

  // deprecated
  inputTyping: function (e) {
    console.log(123)
    console.log(e.detail)
    var that = this
    this.setData({
      hasMoreWorks: false,
      hasMoreAuthors: false,
      searchResultWorks: '',
      searchResultAuthors: '',
      keyword :e.detail,
      showClear:false,
      hideSearchHistory:true,
    })

    // 搜索后将搜索记录缓存到本地
    if ("" != e.detail) {
      var searchHistory = that.data.searchHistory;
      if(searchHistory == ''){
        searchHistory = []
      }
      // 使用队列，保证在查看搜索历史记录时最近搜索内容在顶部
      searchHistory.unshift(e.detail);
      wx.setStorageSync('searchHistory', searchHistory);
    }

    // 停止输入时显示加载中提示，查询完成后隐藏
    wx.showLoading({
      title: '数据加载中',
      icon: 'loading',
    })

    const _ = db.command
    
    db.collection("works_hot").where(_.or([
      {
        Content: {
          $regex: '.*' + e.detail,
          $options: 'i'
        }
      },
      {
        Title: {
          $regex: '.*' + e.detail,
          $options: 'i'
        }
      }
    ])).orderBy('LikesCount', 'desc').get({
        success: res => {
          this.setData({
            searchResultWorks: res.data,
            completed: true
          })

          // 将查询到的头20首作品放入缓存，以便在点击查看更多后直接显示在新的查询页上；
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
          wx.hideLoading()
        }
      })

    db.collection("authors_new").where({
      authorname: {
        $regex: '.*' + e.detail,
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
      inputVal: e.detail
    });
  },

  // 清除搜索历史记录
  clearSearchHistory: function(){
    wx.removeStorageSync('searchHistory')
    this.setData({
      hideSearchHistory:true,
      showClear:false,
      showHint: true,
    })
  },



  // 搜索逻辑
  doSearch:function(){
    var p = this.data.inputVal
    var that = this
    this.setData({
      hasMoreWorks: false,
      hasMoreAuthors: false,
      searchResultWorks: '',
      searchResultAuthors: '',
      keyword: p,
      showClear: false,
      showHint: false,
      hideSearchHistory: true,
      showNoResult: false,
    })

    // 搜索后将搜索记录缓存到本地
    if ("" != p) {
      var searchHistory = that.data.searchHistory;
      if (searchHistory == '') {
        searchHistory = []
      }
      // 使用队列，保证在查看搜索历史记录时最近搜索内容在顶部
      searchHistory.unshift(p);
      let set_a = new Set(searchHistory)
      searchHistory = [...set_a]
      wx.setStorageSync('searchHistory', searchHistory);
      this.setData({
        searchHistory: searchHistory
      })
    }

    // 停止输入时显示加载中提示，查询完成后隐藏
    wx.showLoading({
      title: '数据加载中',
      icon: 'loading',
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
          workCompleted: true
        })
        if(this.data.authorCompleted){
          this.setData({
            completed: true
          })
        }

        // 将查询到的头20首作品放入缓存，以便在点击查看更多后直接显示在新的查询页上；
        wx.setStorage({
          key: "works20",
          data: res.data
        })

        if (res.data == '') {
          // 如果同时也没有搜到作者，则提示无结果
          if(this.data.noResultAuthor){
            this.setData({
              showNoResult: true,
              completed: true,
            })
          }
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
        wx.hideLoading()
      }
    })

    

    db.collection("authors_new").where({
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
          authorCompleted: true
        })
        if(this.data.workCompleted){
          this.setData({
            completed: true
          })
        }

        if (res.data == '') {
          // 如果作品结果也为空则提示无结果
          if(this.data.noResultWork){
            this.setData({
              showNoResult: true,
              completed: true,
            })
          }
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

  // 回车搜索
  onSearch:function(e){
    var p = e.detail
    this.setData({
      inputVal: p
    })
    this.doSearch()
  },

  // 直接点击搜索记录进行查询
  clickHistory:function(e){
    var p = e.currentTarget.dataset.text
    this.setData({
      inputVal: p
    })   
    this.doSearch() 
  },
})