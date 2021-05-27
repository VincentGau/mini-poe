var app = getApp()

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const contentDigest = n => {
  return n.split("。")[0]
}

const parseShi = str=> {
    str = str.replaceAll('\\r\\n', '')
    const reg = new RegExp("(.*?[。！？])", 'gi')
    var p = str.match(reg)    
    var s = ""
    console.log(p)

    for (var i = 0; i < p.length; i++) {
      s = s + "<view class='p'>" + p[i] + "</view>"
    }
    return s
}

// 将摘录名句按标点符号拆分
const splitQuote = str => {
  //先删除\r\n
  str = str.replaceAll('\\r\\n', '')
  const reg = new RegExp("(.*?[，。！？])", 'gi')
  var p = str.match(reg)    
  return p;
}

const parseTag = str => {
  var p = str.split("\\r\\n")
  var s = ""

  for (var i = 0; i < p.length; i++) {
    s = s + "<view class='p'>" + p[i] + "</view>"
  }
  return s
}

// 获取作品首句 用于首页随机展示
const firstSentence = str => {
  const reg = new RegExp("(.*?[。！？；])", 'gi')
  var p = str.match(reg)
  return p[0]
}

String.prototype.replaceAll = function (search, replacement) {
  var target = this;
  return target.split(search).join(replacement);
}

// 判断两个字符串是否有交集
// this.stringIntersect("夜饮东坡醒复醉", "归来仿佛醉三更")
const stringIntersect = (s1, s2) => {
  let ls1 = s1.split("")
  let ls2 = s2.split("")
  var intersect = ls1.filter((val)=>new Set(ls2).has(val));
  return intersect.length > 0
}

// 将整段作品文字拆分成单句
const splitParagraph = para => {
  var sentences = para.split(/[，。！？：；,.!?:;\s]/)
  return sentences
}

// 将整段文字按句号拆分成区域，不同区域的诗句不能作为上下句处理
const splitWithEnd = para => {
  var sections = para.split(/[。]/)
  return sections
}

const logRecord = page => {
  if(app.globalData.openid && app.globalData.openid != ''){
    // 表示onlaunch接口调用成功，已经获得openid
    // console.log("onload after onlaunch")
    wx.request({
      url: 'https://tc.hakucc.com/wechat/record',
      method:'POST',
      data:{
        openid: wx.getStorageSync('openid'),
        nickname: wx.getStorageSync('userinfo').nickName || '',
        avatarUrl: wx.getStorageSync('userinfo').avatarUrl || '',
        country: wx.getStorageSync('userinfo').country || '',
        province: wx.getStorageSync('userinfo').province || '',
        gender: wx.getStorageSync('userinfo').gender,
        lang: wx.getStorageSync('userinfo').language || '',
        page: page,
        actionType: '',
        actionDetail: '',
      },
      header:{
        "Content-Type": "application/x-www-form-urlencoded"
      }
    })
  }
  else{
    // 给app定义一个回调函数
    // console.log("onload before onlaunch, define callback")
    app.openidCallback = openid => {
      wx.request({
        url: 'https://tc.hakucc.com/wechat/record',
        method:'POST',
        data:{
          openid: openid,
          nickname: wx.getStorageSync('userinfo').nickName || '',
          avatarUrl: wx.getStorageSync('userinfo').avatarUrl || '',
          country: wx.getStorageSync('userinfo').country || '',
          province: wx.getStorageSync('userinfo').province || '',
          gender: wx.getStorageSync('userinfo').gender,
          lang: wx.getStorageSync('userinfo').language || '',
          page: page,
          actionType: '',
          actionDetail: '',
        },
        header:{
          "Content-Type": "application/x-www-form-urlencoded"
        }
      })
    }
  }
}

/*获取当前页url*/
function getCurrentPageUrl(){
  var pages = getCurrentPages()    //获取加载的页面
  var currentPage = pages[pages.length-1]    //获取当前页面的对象
  var url = currentPage.route    //当前页面url
  return url
}

/*获取当前页带参数的url*/
function getCurrentPageUrlWithArgs(){
  var pages = getCurrentPages()    //获取加载的页面
  var currentPage = pages[pages.length-1]    //获取当前页面的对象
  var url = currentPage.route    //当前页面url
  var options = currentPage.options    //如果要获取url中所带的参数可以查看options
  
  //拼接url的参数
  var urlWithArgs = url + '?'
  for(var key in options){
      var value = options[key]
      urlWithArgs += key + '=' + value + '&'
  }
  urlWithArgs = urlWithArgs.substring(0, urlWithArgs.length-1)
  
  return urlWithArgs
}

module.exports = {
  formatTime: formatTime,
  contentDigest: contentDigest,
  parseShi: parseShi,
  parseTag: parseTag,
  splitQuote: splitQuote,
  firstSentence: firstSentence,
  stringIntersect: stringIntersect,
  splitParagraph: splitParagraph,
  splitWithEnd: splitWithEnd,
  logRecord: logRecord,
  getCurrentPageUrl: getCurrentPageUrl, 
  getCurrentPageUrlWithArgs: getCurrentPageUrlWithArgs,
}