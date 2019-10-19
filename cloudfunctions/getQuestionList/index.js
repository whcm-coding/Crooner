const cloud = require('wx-server-sdk')

cloud.init({ env: 'dev-nusl4' })
const db = cloud.database()

exports.main = (event, context) => {
  var questions = db.collection('questions')
  return questions.get({
      success (res) {
        console.log("all questiones: ", res.data.length)
        return res
      },
      fail: (res) => {
        console.log("fail", res)
      }
  })
};
