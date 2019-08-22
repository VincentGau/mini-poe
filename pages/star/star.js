// pages/star/star.js
// pages/poe/poe.js

wx.cloud.init()

const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bottominfo: "加载中...",
    pageindex: 1
  },

  toDetail: function (e) {
    console.log(e.currentTarget.dataset.text)
    wx.navigateTo({
      url: '../poe-detail/poe-detail?WorkId=' + e.currentTarget.dataset.text,
    })
  },

  // 对已显示的作品乱序处理
  shuffle: function(e){
    let shuffleWorks = this.data.works
    let m = shuffleWorks.length;
    while (m) {
      const i = Math.floor(Math.random() * m--);
      [shuffleWorks[m], shuffleWorks[i]] = [shuffleWorks[i], shuffleWorks[m]];
    }
    this.setData({
      works:shuffleWorks
    })
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    db.collection('works-1').get({
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
    console.log("bottom refreshing...")
    console.log(this.data.pageindex)
    let curpage = this.data.pageindex
    db.collection('works-1').skip(curpage * 20).limit(20).get({

      success: res => {
        console.log(res.data)
        if (res.data == '') {
          this.setData({
            bottominfo: "没有更多数据了"
          })
        }
        else {
          curpage++
          this.setData({
            works: this.data.works.concat(res.data),
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