<template>
  <div id="content">
    <div class="question_count">答题总量排行榜</div>
    <div v-for="r in questionCountRanking" :key="r._id">
      <div>
        {{ r.nick_name }}
        <img :src=" r.avatar_url" />
        {{ r.question_count }}
      </div>
    </div>
  </div>
</template>

<script>
import store from '../store'
import * as Utils from './utils'

export default {
  data() {
    return {
      questionCountRanking: null,
    }
  },
  methods: {
    getRankingList(onSuccess) {
      const db = wx.cloud.database()
      const page = this
      Utils.getRankingList(db, 'question_count', data => {
        page.questionCountRanking = data
        onSuccess && onSuccess(data)
      })
    },
    updateRankingList(data) {
      const page = this
      const state = store.state
      const db = wx.cloud.database()
      // 当前用户已经在排行榜上时，更新排名
      // 在判断当前用户是否存在时，为了避免获取用户的敏感信息openid，
      // 这里采用一种简化但可用的策略，将用户的姓名和头像组合作为唯一标识
      for (var idx = 0; idx < data.length; ++idx) {
        if (
          Utils.genId(data[idx].nick_name, data[idx].avatar_url) ===
          Utils.genId(state.nickName, state.avatarUrl)
        ) {
          Utils.updateRanking(db, data[idx]._id, {
            question_count: state.questionCount,
          })
        }
        page.getRankingList()
        return
      }

      var i = data.length - 1
      const questionCount = state.questionCount
      while (i >= 0 && questionCount >= data[i]['question_count']) {
        i--
      }

      const maxRankingLen = 3
      if (i !== data.length - 1) {
        console.log('should update rankelist')
        if (data.length === 3) {
          Utils.rmRankingOne(db, data[i + 1]._id)
        }

        Utils.addRanking(db, state, newRanking => {
          data.splice(i + 1, 1, newRanking)
          page.questionCountRanking = data
        })
      }
    },
  },
  computed: {},
  onTabItemTap() {
    const page = this
    page.getRankingList(data => page.updateRankingList(data))
  },
}
</script>

<style scoped>
</style>