// pages/author-detail/author-detail.js
wx.cloud.init()
const db = wx.cloud.database()
const util = require('../../utils/util.js')
const like_url = "../../images/like.svg"
const like_filled_url = "../../images/like_filled.svg"
Page({

  /**
   * Page initial data
   */
  data: {
    completed: false, //作者信息加载完成标记
    starFlag: false, //是否收藏
    like_icon: like_url, //心形图片地址（灰/红）
    emptyFlag: false, //该作者是否有作品
    pageindex: 1, //页数，每次加载20首作品
  },

  // 转到作品详情页
  toDetail: function (e) {
    wx.navigateTo({
      url: '../poe-detail/poe-detail?WorkId=' + e.currentTarget.dataset.text,
    })
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    var that = this

    // 页面数据加载完成之前显示loading
    wx.showLoading({
      title: '加载中',
    })

    this.setData({
      authorid: options.AuthorId
    })

    this.starCheck(options.AuthorId)
    db.collection('authors_new').where({
      authorid: Number(options.AuthorId)
    }).get({
        success: res => {
          wx.hideLoading()
          this.setData({
            author: res.data[0],
            completed: true
          })
        }
      })

    db.collection('works_all').where({
      AuthorId: Number(options.AuthorId)
    }).orderBy('WorkId', 'asc').get({
      success: res => {
        if(res.data == ''){
          this.setData({
            emptyFlag:true,
          })
        }
        
        if(res.data.length < 20){
          this.setData({
            endFlag:true
          })
        }
        that.setData({
          works: res.data
        })
      },
      fail: err => {
        console.error(err)
        that.setData({
          emptyFlag: true,
        })
      }
      })
      
    db.collection('works_all').where({
      AuthorId: Number(options.AuthorId)
    }).count({
        success: res => {
          this.setData({
            works_count: res.total
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
    let curpage = this.data.pageindex
    db.collection('works_all').where({
      AuthorId: Number(this.data.authorid)
    }).skip(curpage * 20).limit(20).get({
      success: res => {
        if (res.data == '') {
          this.setData({
            // bottominfo: "没有更多数据了",
            endFlag: true
          })
        }
        else {
          curpage++
          this.setData({
            works: this.data.works.concat(res.data),
            pageindex: curpage
          })
        }
      }
    })
  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  },

  // 收藏与取消收藏
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
    db.collection("star_authors").where({
      AuthorId: Number(authorid)
    }).get({
      success: res => {
        if (res.data != '') {
          that.setData({
            starFlag: true,
            // starcontent:"unstar",
            like_icon:like_filled_url
          })
        }
      }
    })
  },

  // 收藏作者
  starAuthor: function (authorid) {
    var that = this
    db.collection("star_authors").add({
      data: {
        AuthorId: authorid,
        StarDate: util.formatTime(new Date())
      },
      success: function (res) {
        that.setData({
          starFlag: true,
          like_icon: like_filled_url
        })
      },
      fail: console.error
    })
  },

  // 取消收藏
  unstarAuthor: function (authorid) {
    var that = this
    db.collection("star_authors").where({
      AuthorId: authorid
    }).get({
      success: res => {
        var delete_id = res.data[0]._id
        // 需先找到作者对应的_id再删除
        db.collection("star_authors").doc(delete_id).remove({
          success: function (res) {
            console.log(authorid + " successfully removed")
            that.setData({
              starFlag: false,
              like_icon: like_url
            })
          }
        })
      }
    })
  },  
})