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
    starFlag: false,
    like_icon: like_url,
    emptyFlag: true,
    pageindex: 1
  },

  toDetail: function (e) {
    console.log(e.currentTarget.dataset.text)
    wx.navigateTo({
      url: '../poe-detail/poe-detail?WorkId=' + e.currentTarget.dataset.text,
    })
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    var that = this
    this.starCheck(options.AuthorId)
    db.collection('authors_all').where({
      authorid: Number(options.AuthorId)
    }).get({
        success: res => {
          this.setData({
            author: res.data[0]
          })
        }
      })

    db.collection('works_all').where({
      AuthorName:"李煜"
    }).get({
      success: res => {
        console.log("aaaaaaaaaa")
        console.log(res)
        that.setData({
          emptyFlag: false,
          works: res.data
        })
      },
      fail: err => {
        console.log("fail to load works")
        console.error(err)
        that.setData({
          emptyFlag: true,
        })
      }
      })
      
    db.collection('works_all').where({
      AuthorName: "李煜"
    }).count({
        success: res => {
          console.log(res.total)
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
      AuthorName: "李煜"
    }).skip(curpage * 20).limit(20).get({
      success: res => {
        console.log(res.data)
        if (res.data == '') {
          this.setData({
            bottominfo: "没有更多数据了",
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
    console.log("running starred")
    console.log(authorid)
    db.collection("star_authors").where({
      AuthorId: Number(authorid)
    }).get({
      success: res => {
        console.log("RES")
        console.log(res)
        console.log(res.data)
        if (res.data != '') {
          console.log("NOT NULL")
          that.setData({
            starFlag: true,
            starcontent:"unstar",
            like_icon:like_filled_url
          })
        }
      }
    })
  },

  starAuthor: function (authorid) {
    var that = this
    db.collection("star_authors").add({
      data: {
        AuthorId: authorid,
        StarDate: util.formatTime(new Date())
      },
      success: function (res) {
        console.log(authorid + " starred")
        that.setData({
          starFlag: true,
          like_icon: like_filled_url
        })
      },
      fail: console.error
    })
  },

  unstarAuthor: function (authorid) {
    console.log("----unauthor star")
    var that = this
    db.collection("star_authors").where({
      AuthorId: authorid
    }).get({
      success: res => {
        var delete_id = res.data[0]._id
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

  getWorks: authorid=>{
    console.log("loading works for ")
    db.collection("works_all").where({
      AuthorName: "苏轼"
    }).get({
      success:res=>{

      }
    })
  },
})