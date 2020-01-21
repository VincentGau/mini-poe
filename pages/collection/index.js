// pages/collection/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageindex:2,
  },

  getCollectionWorksByPage: function(collectionid, pagesize, pagenum){
    // var that = this
    wx.request({
      url: 'https://tc.hakucc.com/works/getWorksByCollection/' + collectionid,
      data:{
        pagesize:pagesize,
        pagenum:pagenum,
      },
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        
        console.log(res.data)
        if(res.data.length < pagesize){
          this.setData({
            endFlag: true,
          })
        }
        this.setData({
          works: res.data
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      collectionid:options.collectionid
    })

    let pagesize = 20
    let pagenum = 1
    var that = this
    wx.request({
      url: 'https://tc.hakucc.com/works/getWorksByCollection/' + this.data.collectionid,
      data:{
        pagesize:pagesize,
        pagenum:pagenum,
      },
      header: {
        'content-type': 'application/json'
      },
      success(res) {     
        if(res.data.length < pagesize){
          that.setData({
            endFlag: true,
          })
        }
        that.setData({
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
    let pagesize = 20
    
    var that = this
    wx.request({
      url: 'https://tc.hakucc.com/works/getWorksByCollection/' + this.data.collectionid,
      data:{
        pagesize:pagesize,
        pagenum:curpage,
      },
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        curpage++
        if(res.data.length < pagesize){
          that.setData({
            endFlag: true,
          })
        }
        that.setData({
          works: that.data.works.concat(res.data),
          pageindex:curpage,
        })
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})