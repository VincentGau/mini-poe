// pages/poe/poe.js

wx.cloud.init()

const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  toDetail:function(e){
    console.log(e.currentTarget.dataset.text)
    wx.navigateTo({
      url: '../poe-detail/poe-detail?title=' + e.currentTarget.dataset.text,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // db.collection('authors').get({
    //   success: res => {
    //     // console.log(res)
    //     this.setData({
    //       authors: res.data
    //     })
    //   }
    // })

    db.collection('works').get({
      success: res => {
        console.log(res)
        this.setData({
          works: res.data
        })
      }
    })
    
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
    // console.log("2")
    // db.collection('authors').skip(20).limit(20).get({
    //   success: res => {
    //     console.log(res.data)
    //     this.setData({
    //       authors: this.data.authors.concat(res.data)
    //     })
    //   }
    // })
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

  }
})