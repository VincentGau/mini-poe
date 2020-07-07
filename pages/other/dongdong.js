// pages/other/dongdong.js
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    startTime: '',  //开始计时时间
    dongdongRecord: wx.getStorageSync('dongdongRecord'),  //dongdong记录 
    dongdongCount: wx.getStorageSync('dongdongCount')
  },

  countStart:function(){
    var dt = util.formatTime(new Date())
    
    wx.setStorageSync('dongdongRecord', [])
    wx.setStorageSync('dongdongCount', 0)

    this.setData({
      startTime: '开始计时：' + dt.split(' ')[1],
      dongdongRecord: [],
      dongdongCount: 0
    })
  },

  dongdong: function(){
    var dt = util.formatTime(new Date())
    this.data.dongdongRecord.push(dt.split(' ')[1])
    this.setData({
      dongdongRecord: this.data.dongdongRecord,
      dongdongCount: this.data.dongdongCount + 1
    })

    wx.setStorageSync('dongdongRecord', this.data.dongdongRecord)
    wx.setStorageSync('dongdongCount', this.data.dongdongCount)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  }
})