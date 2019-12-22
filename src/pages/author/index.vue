<template>
  <div id="content">
    <div class="title text">允许微信授权后</div>
    <div class="text">可登上排行榜哦~</div>
    <button
      class="author-btn"
      plain="true"
      @getuserinfo="onGotUserInfo"
      open-type="getUserInfo"
    >点击授权</button>
  </div>
</template>

<script>
import store from '../store'
export default {
  data() {
    return {}
  },
  methods: {
    onGotUserInfo() {
      console.log('onGotUserInfo')
      wx.getUserInfo({
        success(res) {
          var userInfo = res.userInfo
          console.log('userInfo', userInfo)
          store.commit('setNickName', userInfo.nickName)
          store.commit('setAvatarUrl', userInfo.avatarUrl)
        },
      })
      wx.navigateBack()
    },
  },
}
</script>

<style scoped>
#content {
  text-align: center;
}
.title {
  margin-top: 42%;
}
.text {
  color: rgba(0, 0, 0, 0.38);
  font-size: 26px;
}
.author-btn {
  margin-top: 30px;
  background: #3ff3f3;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-color: #3ff3f3;
  border-radius: 15px;
  width: 360px;
  height: 62px;
  color: #ffffff;
  font-weight: bold;
  font-size: 32px;
  line-height: 62px;
}
</style>