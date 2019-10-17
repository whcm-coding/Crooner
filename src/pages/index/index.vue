<template>
  <div>
    <img src="/static/images/timg.jpg" id="bg-img">
    <div id="content">
      <div id="title">
        <p>今日第</p> 
        <p>{{ cnt }}</p>
        <p>题</p>
      </div>

      <div id="question" v-if="randomQuestion">
        {{ randomQuestion.text }}
        <div>
          <div class="question-anws" @click="seletBoolHandler(randomQuestion.id, 'Y')">
            正确
          </div> 
          <div class="question-anws question-no" @click="seletBoolHandler(randomQuestion.id, 'N')">
            错误
          </div>
        </div> 
      </div>

      <div id="result">
        {{ resultTip }}
      </div>
    </div>
  </div>
</template>

<script>
import card from '@/components/card'
import questions from '@/data/questions'
export default {
  data () {
    return {
      cnt: 0,
      // randomNumber：this.randomRange(),
      questions,
      resultTip: "",
      userInfo: {
        nickName: 'mpvue',
        avatarUrl: 'http://mpvue.com/assets/logo.png'
      }
    }
  },

  methods: {
    seletBoolHandler (qId, result) {
      this.resultTip = "回答错误，再想一想吧"
      var q = this.questions.filter(q => q.id === qId)
      if (q && q[0] && q[0].answer === result) {
        this.resultTip = "回答正确"
        this.cnt++
        setTimeout(() => this.nextQuestion(qId), 1000)
      }
    },
    nextQuestion(curQid) {
      console.log("nextQuestion")
      this.resultTip = ""
      this.questions = this.questions.filter(q => q.id !== curQid)
      if (this.questions.length === 0) {
        this.resultTip = "你把所有题目都答完啦，明天再来试试吧！"
      }
    }
  },
  computed: {
    randomQuestion () {
      if (this.questions.length === 0 ) {
        return null
      }
      var id = Math.floor(Math.random() * (this.questions.length))
      return this.questions[id]
    },
  },
  created () {
    // let app = getApp()
  }
}
</script>

<style scoped>
#bg-img {
  width: 100%;
  height: 50px;
}
#content {
  margin-top: 50px;
  text-align: center;
}
#question {
  margin-top: 30px;
}
.question-anws {
  margin: 0 auto;
  width: 50px;
  height: 10px;
  line-height: 10px;
  margin-top: 30px;
  padding: 1em 1.2em;
	text-align: center;
  background: linear-gradient(135deg, #6e8efb, #a777e3);
  border-radius:5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, .2);
  color:#FFF;
  box-shadow:0 1px 0 rgba(255, 255, 255, .5) inset, 0 -1px 0 rgba(255, 255, 255, .1) inset, 0 4px 0 #AD4257, 0 4px 2px rgba(0, 0, 0, .5);
}

.question-no {
	background-image:linear-gradient(to bottom, #F66C7B, #D25068);
}

#result {
  margin-top: 50px;
}

p {
  display: inline-block;
}
.userinfo {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.userinfo-avatar {
  width: 128rpx;
  height: 128rpx;
  margin: 20rpx;
  border-radius: 50%;
}

.userinfo-nickname {
  color: #aaa;
}

.usermotto {
  margin-top: 150px;
}


</style>
