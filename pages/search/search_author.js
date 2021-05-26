// pages/search/search_author.js
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
    try {
      var value = wx.getStorageSync('authors20')
      if (value) {
        this.setData({
          authors: value
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
    db.collection('authors_new').where({
      AuthorId: Number(this.data.authorid)
    }).skip(curpage * 20).limit(20).get({
      success: res => {
        console.log(res.data)
        if (res.data == '') {
          console.log("END")
          this.setData({
            bottominfo: "没有更多数据了",
            endFlag: true
          })
        }
        else {
          curpage++
          this.setData({
            starWorkList: this.data.starWorkList.concat(res.data),
            pageindex: curpage
          })
        }
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})