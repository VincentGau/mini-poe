// pages/me/me.js

var app = getApp()
const db = wx.cloud.database()
Page({

  /**
   * Page initial data
   */
  data: {
    radioItems: [
      { name: '宋词三百首', value: '0'},
      { name: '唐诗三百首', value: '1' },
      { name: '我收藏的作品', value: '2'},
    ],
    loggedIn: false,
    userinfo: wx.getStorageSync('userinfo'),
    radio: wx.getStorageSync('homeRandom') || 1,
  },

  bindGetUserInfo: function(){
    var that=this
    wx.getUserInfo({
      success: res => {
        // 可以将 res 发送给后台解码出 unionId
        app.globalData.userInfo = res.userInfo
        wx.setStorageSync('userinfo', res.userInfo)
        that.onLoad()
      },
      fail: e => {
        console.log("eeeeeee : " + e.detail)
      }
    })
  },

  onRadioClick(event) {
    const { name } = event.currentTarget.dataset;
    if(name == 2){
      db.collection('star_works').count().then(res=>{
        if(res.total == 0){
          wx.showModal({
            content: '暂无收藏，\r\n请先收藏喜欢的作品吧~',
            showCancel: false,
          })          
        }
        else{
          wx.setStorageSync('homeRandom', name)
          this.setData({
            radio: name,
          });
        }
      })
    }
    else{
      wx.setStorageSync('homeRandom', name)
      this.setData({
        radio: name,
      });
    }   
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    if(wx.getStorageSync('userinfo') && wx.getStorageSync('userinfo') != {}){
      this.setData({
        loggedIn:true
      })
    }

    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          console.log("已授权")
        }
        else{
          wx.navigateTo({
            url: '/pages/login/login',
          })
        }
      }
    })
 
    this.setData({
      userinfo: wx.getStorageSync('userinfo'),
      radio: wx.getStorageSync('homeRandom')
    });
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {
    this.setData({
      userinfo: wx.getStorageSync('userinfo')
    })
  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {
    this.onLoad()
  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  },

  toStar: function(){
    wx.navigateTo({
      url: '../star/star',
    })
  }
})