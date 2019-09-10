// pages/test-swiper/test-swiper.js
wx.cloud.init()
const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    duration: 500,
    previousMargin: 0,
    nextMargin: 0
  },

  random10: function () {
    let workIds = []
    db.collection('ci_300').aggregate().sample({
      size: 10
    }).end().then(res => {
      console.log(res)
      for (var i = 0; i < res.list.length; i++) {
        workIds.push(res.list[i].workid)
      }
      console.log(workIds)
      const _ = db.command
      db.collection("works_all").where({
        WorkId: _.in(workIds)
      }).get().then(res => {
        console.log(res.data)
        this.setData({
          works: res.data,
        })
      }).catch(err => {
        console.error(err)
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var starWorkIds = []
    db.collection("star_works").get().then(res => {
      if (res.data.length > 0) {
       
        for (var i = 0; i < res.data.length; i++) {
          starWorkIds.push(res.data[i].WorkId)
        }
        console.log(starWorkIds)
        const _ = db.command
        db.collection("works_all").where({
          WorkId: _.in(starWorkIds)
        }).get().then(res => {
          this.setData({
            works: res.data,
          })
        }).catch(err => {
          console.error(err)
        })
      }
    }).catch(err => {
      console.error(err)
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})