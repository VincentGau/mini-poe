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
    str = str.replace('\\r\\n', '')
    const reg = new RegExp("(.*?[。！？])", 'gi')
    var p = str.match(reg)    
    var s = ""
    console.log(p)

    for (var i = 0; i < p.length; i++) {
      s = s + "<view class='p'>" + p[i] + "</view>"
    }
    return s
}

const parseTag = str => {
  var p = str.split("\\r\\n")
  var s = ""

  for (var i = 0; i < p.length; i++) {
    s = s + "<view class='p'>" + p[i] + "</view>"
  }
  return s
}

module.exports = {
  formatTime: formatTime,
  contentDigest: contentDigest,
  parseShi: parseShi,
  parseTag: parseTag,
}