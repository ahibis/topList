<template>
  <div>
    <div v-if="!topList.isWin">
      <h1 class="text-3xl text-center mt-5">Поиск {{ topList.stage + 1 }} место. Ход №{{ topList.stepOnStage + 1 }}/{{
        topList.stepsOnStage }}</h1>
      <div class="flex justify-around">
        <PickPhoto :url="leftUrl" @picked="chooseWinner(false)" :id="0" />
        <PickPhoto :url="rightUrl" @picked="chooseWinner(true)" :id="1" />
      </div>
    </div>

    <div>
      <TopList :topListUrls="topListUrls" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { NodeItem } from "~/assets/topList";
import PickPhoto from "~/components/PickPhoto.vue";

// import streamers from "~/assets/streamers.json";
import tikTok from "~/assets/tikTok.json";
import { debug } from "console";

class Member<T> {
  id: number;
  data: T;
  losingOpponents: Member<T>[] = [];
  constructor(id: number, data: T) {
    this.id = id;
    this.data = data;
  }
  defeat(opponent: Member<T>) {
    this.losingOpponents.push(opponent);
  }
}

class TopList2<T> {
  currentOpponents: Member<T>[] = [];
  nextOpponents: Member<T>[] = [];
  arrangedList: Member<T>[] = []
  isWin = false;
  stepOnStage = 0;
  stepsOnStage = 0;
  opponentIndex = 0;
  stage = 0;
  opponents: Member<T>[] = []


  rebalance() {
    while ((this.opponentIndex * 2 > this.currentOpponents.length - 2) || this.currentOpponents.length == 1) {
      if (this.currentOpponents.length == 0) {
        this.isWin = true
        break;
      }
      if (this.currentOpponents.length == 1) {
        console.log("смех")
        const winner = this.currentOpponents[0];
        this.arrangedList.push(winner);
        const candidates = winner.losingOpponents;
        console.log("кандидаты", candidates)
        this.stage += 1;
        this.currentOpponents = candidates;
        this.nextOpponents = []
        this.stepsOnStage = candidates.length - 1;
        this.stepOnStage = 0;
        continue;
      }
      if (this.currentOpponents.length % 2 == 1) {
        this.nextOpponents.push(this.currentOpponents[this.currentOpponents.length - 1])
      }
      this.currentOpponents = this.nextOpponents;
      console.log(this.currentOpponents)
      this.nextOpponents = [];
      this.opponentIndex = 0;
    }
  }
  defeat(winner: Member<T>, looser: Member<T>) {
    winner.defeat(looser);
    this.nextOpponents.push(winner);
    this.opponentIndex += 1;
    this.stepOnStage += 1;
    this.rebalance()
    // console.log("fdfdf", this)
    this.getNextOpponents()
  }


  getNextOpponents() {
    const res = this.currentOpponents.slice(this.opponentIndex * 2, this.opponentIndex * 2 + 2);
    this.opponents = res;
    return res;
  }

  chooseWinner(isRight: boolean) {
    // console.log(this);
    if (isRight) {
      this.defeat(this.opponents[1], this.opponents[0])
      return;
    }
    this.defeat(this.opponents[0], this.opponents[1])
  }
  constructor(data: T[]) {
    this.currentOpponents = data.map((v, i) => new Member(i, v));
    this.stepsOnStage = data.length - 1;
    this.getNextOpponents();
  }
}

const urls = tikTok.slice(0, 64);


export default Vue.extend({
  name: "IndexPage",
  components: {
    PickPhoto,
  },
  data: () => ({
    urls,
    topList: new TopList2(urls)
  }),
  methods: {
    chooseWinner(isRight: boolean) {
      this.$data.topList.chooseWinner(isRight);
    },
    onkeydown(e: KeyboardEvent) {
      const $data = this.$data;
      const key = e.key;
      if (key == "ArrowLeft" || key == "a") {
        this.chooseWinner(false);
      }
      if (key == "ArrowRight" || key == "d") {
        this.chooseWinner(true);
      }
    }
  },
  computed: {
    leftUrl() {
      return (this.$data.topList as TopList2<string>).opponents[0].data;
    },
    rightUrl() {
      return (this.$data.topList as TopList2<string>).opponents[1].data;
    },
    topListUrls() {
      return (this.$data.topList as TopList2<string>).arrangedList.map(d => d.data);
    }
  },

  mounted() {

    document.addEventListener("keydown", this.onkeydown)
  },
  destroyed() {
    removeEventListener("keydown", this.onkeydown);
  },
});
</script>
