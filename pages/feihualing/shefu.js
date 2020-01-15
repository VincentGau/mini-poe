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
    result: []
  },

  onChange(e) {
    this.setData({
      value: e.detail
    });
  },

  onSearch() {
    var that = this
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
          that.setData({
            result: res.data.data
          })
        }
      })
    }
  },

  
  onCancel() {
    wx.showToast({
      title: '取消',
      icon: 'none'
    });
  },

  onClear() {
    wx.showToast({
      title: '清空',
      icon: 'none'
    });
  },

  shefu:function(sentence, keyword){
    return this.data.hotWorks[0].Content;
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    // db.collection('works_hot').orderBy('WorkId', 'asc').get({
    //   success: res => {
    //     console.log(res)
    //     this.setData({
    //       hotWorks: res.data,
    //     })
    //   }
    // })

    
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