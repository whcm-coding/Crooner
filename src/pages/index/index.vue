<template>
  <div id="content">
    <img class="img" :src="curImg.url" alt="图片加载中..." />
    <van-icon class="nav" :name="imgIcon" size="30px" info="new" @click="onClickNav"></van-icon>
    <a class="linkpage normal" href="/pages/normal/main">练一练</a>
    <picker @change="bindPickerChange " class="linkpage barrier" :value="index" :range="array">闯关模式</picker>
  </div>
</template>

<script>
import store from '../store'
export default {
  data() {
    return {
      imgs: [],
      index: 0,
      array: ['简单', '中等', '高难'],
      arrMapper: ['0', '1', '2'],
      shouldPlayMusic: false,
    }
  },
  methods: {
    bindPickerChange(args) {
      this.index = args.mp.detail.value
      setTimeout(() => {
        wx.navigateTo({
          url: '/pages/barrier/main?thread=' + this.arrMapper[this.index],
        })
      }, 300)
    },
    onClickNav() {
      console.log('click', this.curImg)
      const page = this
      this.shouldPlayMusic = !this.shouldPlayMusic
      if (this.shouldPlayMusic && this.curImg) {
        wx.showModal({
          title: '贴心小提示',
          content: '请检查你的音量，最怕空气突然的不安静哦~',
          success(res) {
            if (res.confirm) {
              wx.playBackgroundAudio({
                dataUrl: page.curImg.audio,
                title: '背景音乐',
              })
            } else if (res.cancel) {
              page.shouldPlayMusic = !page.shouldPlayMusic
            }
          },
        })
      } else {
        wx.stopBackgroundAudio()
      }
    },
  },
  computed: {
    curImg() {
      if (this.imgs.length === 0) {
        return ''
      }
      var id = Math.floor(Math.random() * this.imgs.length)
      return this.imgs[id]
    },
    imgIcon() {
      if (this.shouldPlayMusic) {
        return 'music-o'
      }
      return 'pause-circle-o'
    },
  },
  created() {
    const page = this
    const fail = res => console.error('getSetting failed: ', err)
    const success = res => {
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
          wx.authorize({
            scope: 'scope.userInfo',
            success,
            faill,
          })
        }
      },
      fail,
    })

    const db = wx.cloud.database()
    var imgs = db.collection('images')
    imgs.get({
      success(res) {
        page.originImgs = res.data
        page.imgs = res.data
      },
    })
  },
}
</script>

<style scoped>
.img {
  opacity: 0.7;
  position: fixed;
  top: 0;
  bottom: 0;
  height: 100%;
  width: 100%;
}
.linkpage {
  width: 300px;
  height: 45px;
  text-align: center;
  line-height: 45px;
  font-size: 20px;
  position: fixed;
  top: 30%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #4caf50;
  color: white;
  padding: 5px 10px;
  border-radius: 2px;
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}
.barrier {
  margin-top: 70px;
  background-color: #f4511e;
}
.nav {
  position: absolute;
  right: 30px;
  top: 15px;
}
</style>