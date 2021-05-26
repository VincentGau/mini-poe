// pages/me/me.js
import util from '../../utils/util.js';

var app = getApp()
const db = wx.cloud.database()

Page({

  /**
   * Page initial data
   */
  data: {
    radioItems: [{
        name: '宋词三百首',
        value: '0'
      },
      {
        name: '唐诗三百首',
        value: '1'
      },
      {
        name: '我收藏的作品',
        value: '2'
      },
    ],
    loggedIn: false,
    userinfo: wx.getStorageSync('userinfo'),
    radio: wx.getStorageSync('homeRandom') || 0,
  },

  // 更新用户信息
  updateUserProfile(){
    wx.getUserProfile({
      desc: "获取你的昵称、头像、地区及性别",
      success: res => {
        console.log(res)
        wx.setStorageSync('userinfo', res.userInfo)

        this.setData({
          userinfo: wx.getStorageSync('userinfo'),
          radio: wx.getStorageSync('homeRandom') || 0
        });
      },
      fail: res => {
        //拒绝授权
        return;
      }
    })
  },

  onRadioClick(event) {
    const {
      name
    } = event.currentTarget.dataset;
    if (name == 2) {
      db.collection('star_works').count().then(res => {
        if (res.total == 0) {
          wx.showModal({
            content: '暂无收藏，\r\n请先收藏喜欢的作品吧~',
            showCancel: false,
          })
        } else {
          wx.setStorageSync('homeRandom', name)
          this.setData({
            radio: name,
          });
        }
      })
    } else {
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
    
    if (wx.getStorageSync('userinfo') && wx.getStorageSync('userinfo') != {}) {
      console.log("me: userinfo already exist.")
    } else {
      wx.showModal({
        title: '温馨提示',
        content: 'Haku Poe申请获取您的昵称等信息',
        showCancel: false,
        success() {
          wx.getUserProfile({
            desc: "获取你的昵称、头像、地区及性别",
            success: res => {
              console.log(res)
              wx.setStorageSync('userinfo', res.userInfo)

              this.setData({
                userinfo: wx.getStorageSync('userinfo'),
                radio: wx.getStorageSync('homeRandom') || 0
              });
            },
            fail: res => {
              //拒绝授权
              return;
            }
          })
        }
      })
    }

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
    util.logRecord(util.getCurrentPageUrlWithArgs())
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

  toStar: function () {
    wx.navigateTo({
      url: '../star/star',
    })
  }
})