// pages/search/search_work.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    console.log(options.keyword)
    try {
      var value = wx.getStorageSync('works20')
      if (value) {
        this.setData({
          works:value
        })
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
        fail: err => {
          console.error(err)
        },
        complete: () => {
          wx.hideToast()
        }
      })

    db.collection("authors_new").where({
      authorname: {
        $regex: '.*' + e.detail.value,
        $options: 'i'
      }
    }).orderBy('authorid', 'asc').get({
      success: res => {
        this.setData({
          searchResultAuthors: res.data
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