export const getRankingList = (db, orderBy, success) => {
  wx.showLoading({
    title: '正在获取排行榜...',
  })
  var ranking = db.collection('ranking')
  return ranking
    .orderBy(orderBy || 'question_count', 'desc')
    .get({
      success(res) {
        console.log("ranking", res.data)
        wx.hideLoading()
        success && success(res.data)
      },
    })
}

export const rmRankingOne = (db, rmRankingId) => {
  var ranking = db.collection('ranking')
  ranking.where({
    '_id': rmRankingId
  }).remove()
}

export const addRanking = (db, rankingToAdd, onSuccess) => {
  wx.showLoading({
    title: '正在更新排行榜...addRanking ',
  })
  var ranking = db.collection('ranking')
  const data = {
    'nick_name': rankingToAdd.nickName || '',
    'avatar_url': rankingToAdd.avatarUrl || '',
    'question_count': rankingToAdd.questionCount || 0
  }

  return ranking.add({
    data
  })
    .then(() => {
      wx.hideLoading()
      onSuccess(data)
    })
}

export const updateRanking = (db, rankingId, state) => {
  wx.showLoading({
    title: '正在更新排行榜...',
  })
  var ranking = db.collection('ranking')
  return ranking.where({
    '_id': rankingId
  })
    .update({
      data: state
    }).then(() => wx.hideLoading())
}

export const genId = (nickName, avatarUrl) => {
  return nickName + '!@#$%^&*(' + avatarUrl
}