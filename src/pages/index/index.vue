<template>
  <div id="body">
    <img src="/static/images/timg.jpg" id="bg-img">
    <div v-if="questions.length === 0 && cnt === 0">
      题目加载中，请稍后
    </div>
    <!-- <div  v-if="randomQuestion">{{randomQuestion.answer}}</div> -->
    <div id="content" v-if="questions.length !== 0"  >
      <div id="title">
        <p>今日第</p> 
        <p>{{ cnt }}</p>
        <p>题</p>
      </div>

      <div class="question" v-if="randomQuestion">
        {{ randomQuestion.text }}
        <div v-if="randomQuestion.type === 'bool'">
          <div class="question-anws" @click="seletBoolHandler(randomQuestion, 'Y')">
            正确
          </div> 
          <div class="question-anws question-no" @click="seletBoolHandler(randomQuestion, 'N')">
            错误
          </div>
        </div>

        <ol class="question choice" v-if="!forceClear && randomQuestion.type === 'choice'">
          <checkbox-group class="choice-list" v-for="(l, idx) in randomQuestion.list" v-bind:key="l._id" @change="selectChoice">
            <checkbox :id="l._id" :value="idx" />
            {{ l }}
          </checkbox-group>

          <div class="question-anws" @click="onSubmitChoice(randomQuestion)">提交</div>
        </ol>

    </div>
  </div>

  <div id="result" v-if="resultTip" :class="resultactive">
    <div class="tip-text">
      {{ resultTip }}
    </div>
  </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      cnt: 0,
      questions: [],
      checkedChoiceList: [],
      resultTip: "",
      forceClear: false
    }
  },

  methods: {
    showError () {
      this.resultTip = "回答错误，再想一想吧"
      setTimeout(() => {
        this.resultTip = ""
      }, 600)
    },
    showSucceed(question) {
      this.resultTip = "回答正确"
      setTimeout(() =>{
        this.resultTip = ""
        this.nextQuestion(question._id)
        this.cnt++
      }, 1000)
    },
    seletBoolHandler (question, result) {
      if (question.answer === result) {
        this.showSucceed(question)
      } else {
        this.showError()
      }
    },
    selectChoice (evt) {
      const target = evt.target
      // hack：取消选中checkbox
      if (target.value.length === 0) {
        var targetIndex = target.dataset.eventid.split('_')[1]
        // hack!
        this.checkedChoiceList = this.checkedChoiceList.filter(idx => idx !== targetIndex)
      }else {
        this.checkedChoiceList.push(target.value[0])
      }
    },
    onSubmitChoice (question) {
      if (this.checkedChoiceList.length !== question.answer.length) {
        return this.showError()
      }
      var sortedCheckedList = this.checkedChoiceList.sort()
      var answer = question.answer.sort()
      if (sortedCheckedList.every((checked, idx) => checked === (answer[idx]+''))) {
        this.checkedChoiceList = []
        this.forceClear = true
        // hack: to reset checkbox
        setTimeout(() => this.forceClear = false, 0)
        
        return this.showSucceed(question)
      } else {
        return this.showError()
      }
    },
    nextQuestion(curQid) {
      this.resultTip = ""
      this.questions = this.questions.filter(q => q._id !== curQid)
      if (this.questions.length === 0) {
        this.resultTip = "你把所有题目都答完啦，明天再来试试吧！"
      }
    }
  },
  computed: {
    resultactive () {
      return this.resultTip ? 'resultactive' : ''
    },
    randomQuestion () {
      if (this.questions.length === 0 ) {
        return null
      }
      var id = Math.floor(Math.random() * (this.questions.length))
      return this.questions[id]
    }
  },
  created () {
    const page = this
    wx.cloud.callFunction({
      name:"getQuestionList",
      data: {},
      success: res => {
        var data = res.result.data
        // data = data.filter(d => d.type==="choice")
        console.log("success", data.length)
        page.questions = data
      },
      fail: err => {
        console.log(err)
      }
    })
  }
}
</script>

<style scoped>
#body {
  text-align: center;
  padding: 0 10px;
}
#bg-img {
  width: 100%;
  height: 50px;
}
#content {
  margin-top: 50px;
  text-align: center;
}
.question {
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
  opacity: 1;
  text-align: center;
  position: fixed;
  /* top: 50%; */
  /* left: 50%; */
  width: 100%;
  height: 100%; 
  top: 0;
  bottom: 0;
  /* transform: translate(-50%, -50%); */
  transition: opacity 0.5s ease-in;  
  color: white;
}
#result.resultactive {
  opacity: 0.5;
  background:rgba(0,0,0);
}
.tip-text {
  position: absolute;
  top: 50%;
  left: 50%;
  bottom: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-weight: bold;
  font-size: 18px;
}
.choice {
  margin: 30px auto 0 auto;
  width: 50%;
}
.choice-list {
  text-align: left;
  margin-bottom: 15px;
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
