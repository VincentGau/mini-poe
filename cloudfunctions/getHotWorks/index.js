// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const MAX_LIMIT = 100

exports.main = async (event, context) => {
  // collection 上的 get 方法会返回一个 Promise，因此云函数会在数据库异步取完数据后返回结果
  const countResult = await db.collection('works_hot').count()
  console.log(countResult)
  const total = countResult.total
  // 计算需分几次取
  var batchTimes = Math.ceil(total / MAX_LIMIT)
  batchTimes = 40 // 防止并发超过一定数量 Promise.all + reduce也算并发
  // 承载所有读操作的 promise 的数组
  const tasks = []
  const _ = db.command
  for (let i = 0; i < batchTimes; i++) {
    //get()操作返回的是Promise对象，每获取一个Promise就压栈进入tasks数组
    const promise = db.collection('works_hot').field({
      WorkId: true,
      Content: true
    }).where({
      Kind: _.or(_.eq('shi'), _.eq('ci'))
    }).orderBy("WorkId", "asc").skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
    tasks.push(promise)
  }
  console.log(tasks)
  console.log(await Promise.all(tasks))
  // 等待所有
  /* Promise.all 方法用于将多个 Promise 实例，包装成一个新的 Promise 实例
    在任何情况下，Promise.all 返回的 promise 的完成状态的结果都是一个数组。
    在这里，返回的数组的元素就是res.data
    数组reduce操作：array.reduce(function(total, currentValue, currentIndex, arr), initialValue)
    total  必需。初始值, 或者计算结束后的返回值。
    currentValue  必需。当前元素
    currentIndex  可选。当前元素的索引
    arr  可选。当前元素所属的数组对象。
    initialValue  可选。传递给函数的初始值
    **此处acc为初始值，cur为当前元素
    concat() 方法用于连接两个或多个数组
  */
  return (await Promise.all(tasks)).reduce((acc, cur) => {
    return {
      data: acc.data.concat(cur.data),
      errMsg: acc.errMsg,
    }
  })
}