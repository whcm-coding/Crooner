// https://vuex.vuejs.org/zh-cn/intro.html
// make sure to call Vue.use(Vuex) if using a module system

import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
var questionCount = wx.getStorageSync('questionCount')
console.log('get questionCount', questionCount)

const store = new Vuex.Store({
  state: {
    nickName: '',
    avatarUrl: '',
    questionCount: questionCount || 0
  },
  mutations: {
    setState(state, newState) {
      state = { ...newState }
    },
    setNickName(state, nickName) {
      if (nickName) {
        state.nickName = nickName
      }
    },
    setAvatarUrl(state, avatarUrl) {
      if (avatarUrl) {
        state.avatarUrl = avatarUrl
      }
    },
    updateQuestionCnt(state, cnt) {
      state.questionCount += cnt
      console.log('updateQuestionCnt', state.questionCount)
      wx.setStorageSync('questionCount', state.questionCount)
    }
  }
})

export default store