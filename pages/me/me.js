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
    checkedRadio: wx.getStorageSync('homeRandom') || 1,
    // nickname: wx.getStorageSync('nickname'),
    loggedIn: false,
    userinfo: wx.getStorageSync('userinfo')
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

  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value);

    // 如果选择的是我收藏的作品，先判断一下是否有过收藏
    if(e.detail.value == 2){
      db.collection('star_works_empty').count().then(res=>{
        if(res.total == 0){
          wx.showModal({
            content: '暂无收藏，\r\n请先收藏喜欢的作品吧~',
            showCancel: false,
          })
          this.data.radioItems[Number(this.data.checkedRadio)].checked = true
        }
        else{
          wx.setStorageSync('homeRandom', e.detail.value)

          var radioItems = this.data.radioItems;
          for (var i = 0, len = radioItems.length; i < len; ++i) {
            radioItems[i].checked = radioItems[i].value == e.detail.value;
          }
      
          this.setData({
            radioItems: radioItems
          });
        }
      })
    }
    else{
      wx.setStorageSync('homeRandom', e.detail.value)

      var radioItems = this.data.radioItems;
      for (var i = 0, len = radioItems.length; i < len; ++i) {
        radioItems[i].checked = radioItems[i].value == e.detail.value;
      }
  
      this.setData({
        radioItems: radioItems
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

    let checkedRadio = wx.getStorageSync('homeRandom')
    // 默认选择唐诗三百首
    if (!checkedRadio){
      checkedRadio = 1
    }
    var radioItems = this.data.radioItems;
    radioItems[Number(checkedRadio)].checked = true    
    this.setData({
      radioItems: radioItems,
      userinfo: wx.getStorageSync('userinfo')
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