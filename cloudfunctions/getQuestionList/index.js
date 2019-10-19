const cloud = require('wx-server-sdk')

cloud.init({ env: 'dev-nusl4' })
const db = cloud.database()

// var cache = null
exports.main = (event, context) => {
  // if (cache) {
    // return Promise.resolve(cache)
  // }
  var questions = db.collection('questions')
  return questions.get({
      success (res) {
        console.log("all questiones: ", res.data.length)
        // cache = res
        return res
      },
      fail: (res) => {
        console.log("fail", res)
      }
  })
};
