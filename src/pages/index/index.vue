<template>
  <div id="content">
    <img class="img" :src="curImg" alt="图片加载中..." />
    <van-icon class="nav" name="weapp-nav" size="30px" info="new"></van-icon>
    <a class="linkpage normal" href="/pages/normal/main">练一练</a>
    <picker @change="bindPickerChange " class="linkpage barrier" :value="index" :range="array">闯关模式</picker>
  </div>
</template>

<script>
export default {
  data() {
    return {
      imgs: [],
      index: 0,
      array: ['简单', '中等', '高难'],
      arrMapper: ['0', '1', '2'],
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
  },
  computed: {
    curImg() {
      if (this.imgs.length === 0) {
        return ''
      }
      var id = Math.floor(Math.random() * this.imgs.length)
      return this.imgs[id].url
    },
  },
  created() {
    const page = this
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