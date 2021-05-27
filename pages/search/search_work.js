// pages/search/search_work.js
wx.cloud.init()
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    emptyFlag: true,
    pageindex: 2
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    try {
      var value = wx.getStorageSync('works20')
      if (value) {
        this.setData({
          works:value,
          keyword:options.keyword
        })
      }
      for (var i = 0; i < value; i++) {
        this.searchWorkIds.push(i.workid)
      }
    } catch (e) {
      // Do something when catch error
      console.log("get storage failed.")
      console.log(e)
    }
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    util.logRecord(util.getCurrentPageUrlWithArgs())
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let curpage = this.data.pageindex
    var searchWorkIds = []

    console.log('00000000' + this.data.keyword)

    const _ = db.command
    db.collection("works_hot").where(_.or([
      {
        Content: {
          $regex: '.*' + this.data.keyword,
          $options: 'i'
        }
      },
      {
        Title: {
          $regex: '.*' + this.data.keyword,
          $options: 'i'
        }
      }
    ])).orderBy('LikesCount', 'desc').skip(curpage * 20).limit(20).get({
      success: res => {
        if(res.data.length > 0){
          curpage++;
          if (res.data.length < 20) {
            this.setData({
              endFlag: true,
            })
          }
          for (var i = 0; i < res.data.length; i++) {
            searchWorkIds.push(res.data[i].WorkId)
          }
          console.log(searchWorkIds)
          const _ = db.command
          db.collection("works_all").where({
            WorkId: _.in(searchWorkIds)
          }).get().then(res => {
            wx.hideLoading()
            this.setData({
              works: this.data.works.concat(res.data),
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
   * 用户点击右上角分享
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
      duration: 100000
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
            works: res.data
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
          }
        },
        fail: err => {
          console.error(err)
        },
        complete: () => {
          wx.hideToast()
        }
      })

    this.setData({
      inputVal: e.detail
    });
  }
})