// pages/collection/index.js
const db = wx.cloud.database()
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageindex:2,
    workIds:[], // 作品id列表
    works: [], //作品列表
    pagesize: 20,
    pagenum: 0,
  },


  // 从接口获取
  getCollectionWorksByPage: function(collectionid, pagesize, pagenum){
    // var that = this
    wx.request({
      url: 'https://tc.hakucc.com/works/getWorksByCollection/' + collectionid,
      data:{
        pagesize:pagesize,
        pagenum:pagenum,
      },
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        
        console.log(res.data)
        if(res.data.length < pagesize){
          this.setData({
            endFlag: true,
          })
        }
        this.setData({
          works: res.data
        })
      }
    })
  },

  // 从云数据库获取
  getCollectionWorksByPageFromCloud: function(collectionName, pagesize, pagenum){
    db.collection(collectionName).skip(pagenum * pagesize).limit(pagesize).get().then(res =>{           
      var curWorkIds = []
      var curWorks = []
      for(var i in res.data){
        curWorkIds.push(res.data[i].workid)
      }
      const _ = db.command
      db.collection("works_all").where({
        WorkId: _.in(curWorkIds)
      }).get().then(res1 => {
        curWorks = res1.data
        this.setData({
          works: this.data.works.concat(curWorks),
          pagenum: pagenum + 1,
          emptyFlag: false,
          completed:true,
        })
      })
      
      if(res.data.length < pagesize){
        this.setData({
          endFlag: true
        })
      }
    })
  },

  // 从云数据库查询词牌对应的作品
  getWorksByCipaiName: function(cipainame, pagesize, pagenum){
    db.collection('works_all').where({
      Title: db.RegExp({
        regexp: cipainame,          
        options: 'i',        
      })
    }).orderBy('LikesCount', 'desc').skip(pagenum * pagesize).limit(pagesize).get().then(res => {
      console.log(res.data)
      this.setData({
        pagenum : pagenum + 1,
        works: this.data.works.concat(res.data),
        emptyFlag: false
      })

      if(res.data.length < pagesize){
        this.setData({
          endFlag: true
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.setData({
    //   collectionid:options.collectionid
    // })

    // let pagesize = 20
    // let pagenum = 1
    // var that = this
    // wx.request({
    //   url: 'https://tc.hakucc.com/works/getWorksByCollection/' + this.data.collectionid,
    //   data:{
    //     pagesize:pagesize,
    //     pagenum:pagenum,
    //   },
    //   header: {
    //     'content-type': 'application/json'
    //   },
    //   success(res) {     
    //     if(res.data.length < pagesize){
    //       that.setData({
    //         endFlag: true,
    //       })
    //     }
    //     that.setData({
    //       works: res.data
    //     })
    //   }
    // })


    this.setData({
      type: options.type
    })
    console.log("SET TYPE:" + this.data.type)
    // 词牌
    if(options.type == 1){
      console.log("type 1")
      let cipainame = options.cipaiName
      this.setData({
        cipainame: cipainame
      })
      this.getWorksByCipaiName(cipainame, this.data.pagesize, this.data.pagenum)
      
    }
    // 唐诗三百首，宋词三百首等，单独维护列表的
    else if(options.type == 0){
      let collectionDict = {
        '1': 'shi_300',
        '2': 'ci_300'
      }
  
      this.setData({
        collectionName: collectionDict[options.collectionid]
      })
  
      this.getCollectionWorksByPageFromCloud(this.data.collectionName, this.data.pagesize, this.data.pagenum)
    }
    
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
    //从接口获取
    // let curpage = this.data.pageindex
    // let pagesize = 20
    
    // var that = this
    // wx.request({
    //   url: 'https://tc.hakucc.com/works/getWorksByCollection/' + this.data.collectionid,
    //   data:{
    //     pagesize:pagesize,
    //     pagenum:curpage,
    //   },
    //   header: {
    //     'content-type': 'application/json'
    //   },
    //   success(res) {
    //     curpage++
    //     if(res.data.length < pagesize){
    //       that.setData({
    //         endFlag: true,
    //       })
    //     }
    //     that.setData({
    //       works: that.data.works.concat(res.data),
    //       pageindex:curpage,
    //     })
    //   }
    // })


    switch(this.data.type){
      case '0':
        console.log(this.data.collectionName, this.data.pagesize, this.data.pagenum)
        this.getCollectionWorksByPageFromCloud(this.data.collectionName, this.data.pagesize, this.data.pagenum)
        break;
      case '1':
        console.log(this.data.cipainame, this.data.pagesize, this.data.pagenum)
        this.getWorksByCipaiName(this.data.cipainame, this.data.pagesize, this.data.pagenum)
        break;
      default:
        break;

    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})