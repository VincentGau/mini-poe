// pages/feihualing/shefu.js
wx.cloud.init()
const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    value: '',
    howWorks: '',
    result: [],
    showRule: true,
  },

  onChange(e) {
    this.setData({
      value: e.detail
    });
  },

  onSearch() {
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    if (this.data.value) {      
      wx.request({
        url: 'https://tc.hakucc.com/api/shefuV2',
        data: {
          clue: this.data.value,
        },
        header: {
          'content-type': 'application/json'
        },
        success(res) {
          console.log(res.data.data)
          wx.hideLoading()
          if(res.data.code=="0000"){
            that.setData({
              result: res.data.data,
              showRule: false
            })
          }
          else{
            wx.showToast({
              title: res.data.msg,
              icon: "none",
              duration: 1000
            })
          }
          
        }
      })
    }
  },

  // 点击搜索框右侧取消
  onCancel() {
    this.setData({
      result:[],
      showRule: true,
    })
  },

  // 点击搜索框的×
  onClear() {
    this.setData({
      result:[],
      showRule: true,
    })
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