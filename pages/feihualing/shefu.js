// pages/feihualing/shefu.js
wx.cloud.init()
import util from '../../utils/util.js';
const db = wx.cloud.database()
const MAX_LIMIT = 20
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    value: '',  //搜索的内容
    howWorks: '',
    result: [],  // 答案结果集
    showRule: true,
    showNoResult: false, // 提示无结果
    allHotWorkRecords: [], // 所有热门作品
    clueError: false, // 诗题是否有误
    errMsg: "", // 错误提示信息
  },

  onChange(e) {
    this.setData({
      value: e.detail
    });
  },

  // 直接调用服务端接口获取结果（弃用）
  // onSearch() {
  //   var that = this
  //   wx.showLoading({
  //     title: '加载中',
  //   })
  //   if (this.data.value) {      
  //     wx.request({
  //       url: 'https://tc.hakucc.com/api/shefuV2',
  //       data: {
  //         clue: this.data.value,
  //       },
  //       header: {
  //         'content-type': 'application/json'
  //       },
  //       success(res) {
  //         wx.hideLoading()
  //         if(res.data.code=="0000"){
  //           that.setData({
  //             result: res.data.data,
  //             showRule: false
  //           })
  //           if(res.data.count == 0){
  //             that.setData({
  //               showNoResult: true
  //             })
  //           }
  //         }
  //         else{
  //           wx.showToast({
  //             title: res.data.msg,
  //             icon: "none",
  //             duration: 1000
  //           })
  //         }
          
  //       }
  //     })
  //   }
  // },


  onSearch() {
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    if (this.data.value) {  
      var result = this.processShefu(this.data.value)
      wx.hideLoading()

      if(this.data.clueError){
        wx.showToast({
          title: this.data.errMsg,
          icon: "none",
          duration: 1000
        })
      }
      else{
        that.setData({
          result: result,
          showRule: false
        })
        if(result.length == 0){
          that.setData({
            showNoResult: true
          })
        }
      }
    }
  },

  // 点击搜索框右侧取消
  onCancel() {
    wx.switchTab({
      url: '/pages/me/me',
    })
  },

  // 点击搜索框的×
  onClear() {
    this.setData({
      result:[],
      showRule: true,
      showNoResult: false,
    })
  },

  /**
   * 处理给定的诗题线索
   * 1.如有标点符号，替换成空格；
   * 2.如有连续空格，保留一个；
   * @param clue 题目线索
   * @return 格式化后的题目线索
   */
  clueFormat: function(clue){    
    clue = clue.trim() // 先取出首尾空格
    clue = clue.replace(/[，。！？,!?]/g, ' ')  // 将标点替换成空格
    clue = clue.replace(/\s+/g, " ") // 如有连续空格，只保留一个空格

    var targetLength = -1  // 答案长度，默认-1为不规定长度
    if(!isNaN(clue.charAt(clue.length - 1))){
      targetLength = clue.charAt(clue.length - 1)
      clue = clue.substring(0, clue.length - 1) // 长度已经获取到 去掉最后一位数字
    }
    clue = clue.trim() //再次清楚尾部空格，应对最后一位数字前可能出现的空格   如：“倚杖听江声 云   7”
    var clues = clue.split(" ")
    // clues为诗题中的诗句和关键字，如果不是的话则认为题目有误
    if(clues.length != 2){
      this.setData({
        clueError: true
      })
      return null
    }
    clues.push(targetLength)
    return clues
  },

  // 判断target句子是否符合射覆条件 sentence是诗题中的诗句，keyword是诗题中的射字， 默认参数slen是答案的长度（可选）
  fitShefu: function(target, sentence, keyword, slen=-1){
    if(slen != -1 && target.length != slen){
      return 0
    }
    return this.stringIntersect(target, sentence) & this.stringIntersect(target, keyword)
  },

  // 处理射覆逻辑
  processShefu: function(clue){
    var result = []  // 答案结果集    
    var clues = this.clueFormat(clue)  // clues为处理后的诗题，包括三个元素，分别是诗题中的诗句、关键字以及长度限制
    // clues为null时表示处理诗题出现错误
    if(!clues){
      this.setData({
        errMsg: "格式不正确！ 正确示例：倚杖听江声 云7"
      })
      return -1
    }

    // var hotworks = app.globalData.allHotWorkRecords
    var hotworks = wx.getStorageSync('hotworks')
    // console.log("BBBBBB ", hotworks)
    var that = this
    // 循环处理hotworks中的作品
    hotworks.forEach(function (work, index){
      // console.log(work.Content)
      // 将作品拆分成单句
      var sentences = util.splitParagraph(work.Content)
      sentences.forEach(function(sentence, index){
        // 如果sentence符合射覆规则，则加入结果集，否则继续处理下一句
        if(that.fitShefu(sentence, clues[0], clues[1], clues[2]) == 1){
          var objResult = new Object;
          objResult.workid = work.WorkId;
          objResult.content = sentence
          result.push(objResult)
        }
      })
    })
    return result
  },

  


  // 判断两个字符串是否有交集
  // this.stringIntersect("夜饮东坡醒复醉", "归来仿佛醉三更")
  stringIntersect: function(s1, s2){
    let ls1 = s1.split("")
    let ls2 = s2.split("")
    var intersect = ls1.filter((val)=>new Set(ls2).has(val));
    return intersect.length > 0
  },

  // 将整段文字拆分成单句
  // splitParagraph: function(para){
  //   var sentences = para.split(/[，。！？]/)
  //   return sentences
  // },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.stringIntersect("夜饮东坡醒复醉", "归来仿佛醉三更醒来复习")
    // console.log("BBBBBBBBBBBBBB" + this.splitParagraph("夜饮东坡醒复醉，归来仿佛三更。家童鼻息已雷鸣，敲门都不应，倚杖听江声。")[0])
    // this.processShefu("倚杖听江声 云7")
    // var yes = this.fitShefu("江阔云低断燕叫西风", "倚杖听江声", "云", 9)
    // this.clueFormat("倚杖听江声，   云   7")
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})