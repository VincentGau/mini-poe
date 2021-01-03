// pages/feihualing/shuangfei.js
import util from '../../utils/util.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    value: '',
    result: [],
    showRule: true, // 是否在搜索框下展示规则
    clueError: false, // 诗题是否有误
    errMsg: "", // 错误提示信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log("asdfasdfasdf: ", util.stringIntersect("1234", "567"))
    // console.log("asdfasdfasdf: ", util.splitParagraph("123,123123,123123,123 456"))
  },

  onChange(e) {
    this.setData({
      value: e.detail
    });
  },

  // onSearch() {
  //   var that = this
  //   wx.showLoading({
  //     title: '加载中',
  //   })
  //   if (this.data.value) {      
  //     wx.request({
  //       url: 'https://tc.hakucc.com/api/shuangfeiV2',
  //       data: {
  //         clue: this.data.value,
  //       },
  //       header: {
  //         'content-type': 'application/json'
  //       },
  //       success(res) {
  //         // console.log(res.data.data)
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
      var result = this.processShuangfei(this.data.value)
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

  // 处理诗题
  clueFormat: function(clue){    
    clue = clue.trim() // 先去除首尾空格
    clue = clue.replace(/[，。！？,!?]/g, ' ')  // 将标点替换成空格
    clue = clue.replace(/\s+/g, " ") // 如有连续空格，只保留一个空格

    var clues = clue.split(" ")
    // clues为诗题中的诗句，如果无法分成两句的话则认为题目有误
    if(clues.length != 2){
      this.setData({
        clueError: true
      })
      return null
    }
    return clues
  },

  // 处理双飞逻辑
  processShuangfei: function(clue){
    var result = []  // 答案结果集    
    var clues = this.clueFormat(clue)  // clues为处理后的诗题，包括三个元素，分别是诗题中的诗句、关键字以及长度限制
    // clues为null时表示处理诗题出现错误
    if(!clues){
      this.setData({
        errMsg: "格式不正确！ 正确示例：柴门闻犬吠，风雪夜归人"
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
      // 将作品按句号拆分成区域
      var sections = util.splitWithEnd(work.Content)
      sections.forEach(function(section, index){
        if(util.stringIntersect(section, clues[0]) && util.stringIntersect(section, clues[1])){
          var sentences = util.splitParagraph(section)
          // 区域内句子书
          var bound = sentences.length - 1
          // 如果section只有一句，则无法满则双飞规则
          if(sentences.length > 1){
            for(let index = 0; index < bound; index++){
              if((util.stringIntersect(sentences[index], clues[0]) && util.stringIntersect(sentences[index + 1], clues[1]) && sentences[index] != clues[0]) || (util.stringIntersect(sentences[index], clues[1]) && util.stringIntersect(sentences[index + 1], clues[0]) && sentences[index] != clues[1])){
                var objResult = new Object;
                objResult.workid = work.WorkId;
                objResult.content = sentences[index].replaceAll('\\r\\n', '') + ", " + sentences[index + 1].replaceAll('\\r\\n', '')
                result.push(objResult)
              }
            }
          }
          
        }
      })
      
    })
    return result
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