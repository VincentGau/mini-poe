// pages/star/star_works.js
wx.cloud.init()
const db = wx.cloud.database()
const star_works = db.collection("star_works")
const works_all = db.collection("works_all")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    emptyFlag: true,
    pageindex: 1
  },

  toDetail: function (e) {
    wx.navigateTo({
      url: '../poe-detail/poe-detail?WorkId=' + e.currentTarget.dataset.text,
    })
  },

  // 对已显示的作品乱序处理
  shuffle: function (e) {
    let shuffleWorks = this.data.works
    let m = shuffleWorks.length;
    while (m) {
      const i = Math.floor(Math.random() * m--);
      [shuffleWorks[m], shuffleWorks[i]] = [shuffleWorks[i], shuffleWorks[m]];
    }
    this.setData({
      works: shuffleWorks
    })
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })

    var starWorkIds = []
    star_works.orderBy("StarDate", "desc").get().then(res => {
      if (res.data.length > 0) {
        if (res.data.length < 20) {
          this.setData({
            endFlag: true,
          })
        }
        for (var i = 0; i < res.data.length; i++) {
          starWorkIds.push(res.data[i].WorkId)
        }
        console.log(starWorkIds)
        const _ = db.command
        db.collection("works_all").where({
          WorkId: _.in(starWorkIds)
        }).get().then(res => {
          wx.hideLoading()
          this.setData({
            starWorkList: res.data,
            emptyFlag: false,
            completed:true,
          })
        }).catch(err => {
          console.error(err)
        })
      }
      else {
        wx.hideLoading()
        this.setData({
          emptyFlag:true,          
          completed:true,
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
    var starWorkIds = []
    star_works.skip(curpage * 20).limit(20).orderBy("StarDate", "desc").get({
      success: res => {
        if(res.data.length > 0){
          curpage++;
          if (res.data.length < 20) {
            this.setData({
              endFlag: true,
            })
          }
          for (var i = 0; i < res.data.length; i++) {
            starWorkIds.push(res.data[i].WorkId)
          }
          console.log(starWorkIds)
          const _ = db.command
          db.collection("works_all").where({
            WorkId: _.in(starWorkIds)
          }).get().then(res => {
            wx.hideLoading()
            this.setData({
              starWorkList: this.data.starWorkList.concat(res.data),
              pageindex: curpage,
              emptyFlag: false,
              completed:true,
            })
          }).catch(err => {
            console.error(err)
          })
        }
        else {
          wx.hideLoading()
          this.setData({         
            completed:true,
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