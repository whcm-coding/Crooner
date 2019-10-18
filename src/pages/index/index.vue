<template>
  <div id="body">
    <img src="/static/images/timg.jpg" id="bg-img">
    <div v-if="questions.length === 0 && cnt === 0">
      题目加载中，请稍后
    </div>

    <div id="content" v-if="questions.length !== 0"  >
      <div id="title">
        <p>今日第</p> 
        <p>{{ cnt }}</p>
        <p>题</p>
      </div>

      <div id="question" v-if="randomQuestion">
        {{ randomQuestion.text }}
        <div>
          <div class="question-anws" @click="seletBoolHandler(randomQuestion, 'Y')">
            正确
          </div> 
          <div class="question-anws question-no" @click="seletBoolHandler(randomQuestion, 'N')">
            错误
          </div>
        </div> 
      </div>
    </div>

    <div id="result">
      {{ resultTip }}
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      cnt: 0,
      questions: [],
      resultTip: "",
      userInfo: {
        nickName: 'mpvue',
        avatarUrl: 'http://mpvue.com/assets/logo.png'
      }
    }
  },

  methods: {
    seletBoolHandler (question, result) {
      this.resultTip = "回答错误，再想一想吧"
      if (question.answer === result) {
        this.resultTip = "回答正确"
        setTimeout(() =>{
          this.nextQuestion(question._id)
          this.cnt++
        }, 1000)
      }
    },
    nextQuestion(curQid) {
      console.log("nextQuestion")
      this.resultTip = ""
      this.questions = this.questions.filter(q => q._id !== curQid)
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
    const db = wx.cloud.database()
    var questions = db.collection('questions')

    const page = this
    questions.get({
      success (res) {
        page.questions = res.data
        console.log("all question count: ", res.data, page.questions.length)
      },
      // fail: (res) => {
      //   console.log("fail", res)
      // },
      // complete () {
      //   console.log("complete")
      // }
    })
  }
}
</script>

<style scoped>
#body {
  text-align: center;
}
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
  text-align: center;
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
