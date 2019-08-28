// pages/poe/poe.js

wx.cloud.init()

const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bottominfo:"加载中...",
    pageindex:1
  },

  toDetail:function(e){
    wx.navigateTo({
      url: '../poe-detail/poe-detail?WorkId=' + e.currentTarget.dataset.text,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    db.collection('works-1').get({
      success: res => {
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let curpage = this.data.pageindex
    db.collection('works-1').skip(curpage * 20).limit(20).get({
      
      success: res => {
        if(res.data == ''){
          this.setData({
            bottominfo:"没有更多数据了"
          })
        }
        else{
          curpage++
          this.setData({
            works: this.data.works.concat(res.data),
            pageindex:curpage
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