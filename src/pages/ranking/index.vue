<template>
  <div id="content">
    <img
      class="banner"
      src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1576948228984&di=7fce54dcfaa67f8bdb0f223f266d1e2a&imgtype=0&src=http%3A%2F%2Fhbimg.b0.upaiyun.com%2Fdbc739b9f7b68bf63b823703b9d7a62622db98bd11c21-iBpavz_fw658"
      alt
    />
    <span class="text text1">看看</span>
    <span class="text text2">谁</span>
    <span class="text text3">最棒</span>
    <span class="text text4">?</span>
    <div class="question_count" v-if="questionCountRanking && questionCountRanking.length">
      <div class="top top1">
        <div class="top-star">
          <img src="/static/images/star1.png" class="star-icon" />
          <img src="/static/images/star1.png" class="star-icon" />
          <img src="/static/images/star1.png" class="star-icon" />
        </div>

        <div class="detail">
          <img :src="questionCountRanking[0].avatar_url" class="avatar" />
          <span class="nick-name">{{ questionCountRanking[0].nick_name }}</span>
        </div>
      </div>
      <div class="top top2" v-if="questionCountRanking[1]">
        <div class="top-star">
          <img src="/static/images/star2.png" class="star-icon" />
          <img src="/static/images/star2.png" class="star-icon" />
        </div>
        <div class="detail">
          <img :src="questionCountRanking[1].avatar_url" class="avatar" />

          <span class="nick-name">{{ questionCountRanking[1].nick_name }}</span>
        </div>
      </div>
      <div class="top top3" v-if="questionCountRanking[2]">
        <div class="top-star">
          <img src="/static/images/star3.png" class="star-icon" />
        </div>
        <div class="detail">
          <img :src="questionCountRanking[2].avatar_url" class="avatar" />
          <span class="nick-name">{{ questionCountRanking[2].nick_name }}</span>
        </div>
      </div>
    </div>
    <swiper
      v-if="imgUrls.length > 0"
      indidator-dots="imgUrls.length > 1"
      autoplay
      circular
      class="swiper-view"
    >
      <div v-for="(item, index) in imgUrls" :key="index">
        <swiper-item>
          <image :src="item" class="swiper-item" />
        </swiper-item>
      </div>
    </swiper>
  </div>
</template>

<script>
import store from '../store'
import * as Utils from './utils'

export default {
  data() {
    return {
      questionCountRanking: null,
      imgUrls: [
        '/static/images/gzh.png',
        '/static/images/mp.png',
        '/static/images/t.png',
      ],
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
      const maxRankingLen = 3
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
          //1. 当缓存的总数大于数据库中的总数时，更新数据库
          //2. 否则，更新缓存
          if (state.questionCount > data[idx].question_count) {
            Utils.updateRanking(db, data[idx]._id, {
              question_count: state.questionCount,
            })
          } else {
            store.commit(
              'updateQuestionCnt',
              data[idx].question_count - state.questionCount
            )
          }
          page.getRankingList()
          return
        }
      }

      if (data.length < maxRankingLen) {
        Utils.addRanking(db, state, newRanking => {
          page.getRankingList()
        })
        return
      }

      var i = data.length - 1
      const questionCount = state.questionCount
      while (i >= 0 && questionCount >= data[i]['question_count']) {
        i--
      }

      if (i !== data.length - 1) {
        if (data.length === 3) {
          Utils.rmRankingOne(db, data[i + 1]._id)
        }

        Utils.addRanking(db, state, newRanking => {
          data.splice(i + 1, 1, newRanking)
          page.questionCountRanking = data
        })
      }
      console.log('no update', state)
    },
  },
  created() {
    const fail = res => console.error('getSetting failed: ', res)
    const success = res => {
      console.log('getSetting', res)
      wx.getUserInfo({
        success(res) {
          var userInfo = res.userInfo
          console.log('userInfo', userInfo)
          store.commit('setNickName', userInfo.nickName)
          store.commit('setAvatarUrl', userInfo.avatarUrl)
        },
      })
    }
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          success(res)
        } else {
          console.log('to author')
          wx.navigateTo({
            url: '/pages/author/main',
          })
        }
      },
      fail,
    })
  },
  computed: {},
  onTabItemTap() {
    const page = this
    page.getRankingList(data => page.updateRankingList(data))
  },
}
</script>

<style scoped>
#content {
  text-align: center;
}
.banner {
  width: 100%;
  height: 115px;
  margin-top: -56px;
}
.swiper-item {
  height: 100%;
  width: 100%;
}

.question_count {
  text-align: center;
}
.text {
  display: inline-block;
  font-weight: bold;
  font-size: 30px;
  letter-spacing: 8px;
  line-height: 52px;
  -webkit-text-fill-color: #61c4ee;
  -webkit-text-stroke: 1px #4ae86d;
}
.text1 {
  transform: rotate(-7.12deg);
  margin-left: 25px;
}
.text2 {
  font-size: 40px;
  margin: 0 15px;
  transform: rotate(-4.46deg);
  -webkit-text-fill-color: #f466ab;
  -webkit-text-stroke: 1px #60c3ed;
  animation: rotate 1s ease infinite;
}
.text3 {
  transform: rotate(2.93deg);
}
.text4 {
  font-size: 40px;
  transform: rotate(3.93deg);
  vertical-align: bottom;
  margin-left: 10px;
}
.top {
  margin-top: 20px;
  animation: blink 3s ease-in-out infinite;
}
.avatar {
  width: 38px;
  height: 38px;
  vertical-align: middle;
  background-clip: padding-box;
  border-radius: 50%;
}

.nick-name {
  margin-left: 15px;
  vertical-align: middle;
  font-weight: bold;
  text-overflow: ellipsis;
  width: 80px;
  display: inline-block;
  overflow: hidden;
  font-size: 16px;
}
.detail {
  display: inline-block;
  width: 140px;
  text-overflow: ellipsis;
  text-align: left;
}
.star-icon {
  width: 22px;
  height: 100%;
  vertical-align: middle;
}

.top-star {
  display: inline-block;
  width: 100px;
  height: 22px;
}

.swiper-view {
  width: 100%;
  position: fixed;
  bottom: 0;
}

@keyframes rotate {
  0% {
    transform: translateY(-20);
  }
  25% {
    transform: translateY(-10px);
  }
  50% {
    transform: translateY(0px) scale(1.1, 0.9);
  }
  75% {
    ransform: translateY(-10px);
  }
  100% {
    transform: translateY(-20);
  }
}

@keyframes blink {
  0% {
    opacity: 0.9;
    filter: alpha(opacity=20);
    -webkit-transform: scale(1);
  }
  50% {
    opacity: 1;
    filter: alpha(opacity=50);
    -webkit-transform: scale(1.2);
  }
  100% {
    opacity: 0.9;
    filter: alpha(opacity=20);
    -webkit-transform: scale(1);
  }
}
</style>