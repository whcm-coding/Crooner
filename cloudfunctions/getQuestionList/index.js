const cloud = require('wx-server-sdk')

cloud.init({ env: 'dev-nusl4' })
const db = cloud.database()
const MAX_LIMIT = 100

// var cache = null
exports.main = async (event, context) => {
  // if (cache) {
  // return Promise.resolve(cache)
  // }
  // 云函数默认只返回100条数据,需要进行分页，参考示例3：
  // https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-server-api/database/collection.get.html#ex-get-all
  const countResult = await db.collection('questions').count()
  const total = countResult.total
  const batchTimes = Math.ceil(total / 100)
  const tasks = []
  for (let i = 0; i < batchTimes; i++) {
    const promise = db.collection('questions').skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
    tasks.push(promise)
  }
  // 等待所有
  return (await Promise.all(tasks)).reduce((acc, cur) => {
    return {
      data: acc.data.concat(cur.data),
      errMsg: acc.errMsg,
    }
  })
};
