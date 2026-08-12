<template>
  <div v-if="topList">
    <div class="p-5">
      Количество в группе <input class=" rounded text-md" type="number" v-model="maxOpponentsOnGroupNeed" step="1"
        min="2" max="30" />
    </div>

    <div v-if="!topList.isWin">
      <h1 class="text-3xl text-center mt-5">Поиск {{ topList.stage + 1 }} место. Ход №{{ topList.stepOnStage + 1 }}/{{
        topList.stepsOnStage }}</h1>
      <div class="flex justify-around" v-for="line in indexesGrid">
        <template v-for="i in line">
          <PickPhoto :url="opponentsData[i].url" :name="opponentsData[i].name" @picked="chooseWinner(i)" :id="i"
            :score="topList.opponents[i].score" />
        </template>

      </div>
      <div class="flex justify-center mt-5">
        <MyButton @click="topList.skip()">пропустить</MyButton>
      </div>
    </div>

    <div class="mx-[5vw]">
      <TopList :topListUrls="topListData" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { NodeItem } from "~/assets/topList";
import PickPhoto from "~/components/PickPhoto.vue";

import streamers from "~/assets/streamers.json";
import tikTok from "~/assets/tikTok.json";
import { debug } from "console";
import { watch } from "fs";

function randomize<T>(arr: T[]): T[] {
  return arr.sort(() => Math.random() - 0.5);
}
function randomizeFrom<T>(arr: T[], start: number): T[] {
  return [...arr.slice(0, start), ...randomize(arr.slice(start))];
}

interface OpponentData {
  url: string;
  name: string
}

class Member<T> {
  id: number;
  data: T;
  losingOpponents: Member<T>[] = [];
  score = 0;
  constructor(id: number, data: T) {
    this.id = id;
    this.data = data;
  }
  defeat(opponent: Member<T>) {
    this.losingOpponents.push(opponent);
    this.score += opponent.score + 1
  }
}

class TopList2<T> {
  currentOpponents: Member<T>[] = [];
  nextOpponents: Member<T>[] = [];
  arrangedList: Member<T>[] = []
  isWin = false;
  stepOnStage = 0;
  stepsOnStage = 0;
  opponentGroupIndex = 0;
  stage = 0;
  needRandomize = false;
  opponents: Member<T>[] = []
  maxOpponentsOnGroup = 2;
  maxOpponentsOnGroupNeed = 2;

  get opponentIndex() {
    return this.opponentGroupIndex * this.maxOpponentsOnGroup
  }

  smartMixMembers(members: Member<T>[]) {
    const _members = [...members].sort((a, b) => b.score - a.score);
    let count = _members.length;
    if (count < this.maxOpponentsOnGroup + 1) return _members;
    const countOnGroup = this.maxOpponentsOnGroup;
    const res: Member<T | undefined>[] = new Array(count).fill(undefined);
    const groupCount = Math.ceil(count / countOnGroup);
    let index = 0;
    for (let i = 0; i < countOnGroup; i++) {
      for (let j = 0; j < groupCount; j++) {
        const ind = j * countOnGroup + i;
        if (ind >= count) continue;
        res[ind] = _members[index];
        index += 1;
      }
    }
    return res as Member<T>[]

  }

  countStepsOnStage(opponentsCount: number) {
    let res = 0;
    let count = opponentsCount;
    while (count > 1) {
      let next = Math.floor(count / this.maxOpponentsOnGroup);
      if ((count % this.maxOpponentsOnGroup) != 0) {
        next += 1
      }
      let add = next;
      if ((count % this.maxOpponentsOnGroup) == 1) {
        add -= 1;
      }
      console.log("j", add, next)
      res += add;
      count = next
    }
    return res
  }

  tryChangeOpponentsOnGroup(countFrom: number | string) {
    let count = Number.parseInt(countFrom as string)
    if (isNaN(count)) {
      return
    }
    console.log(count)
    if (count < 2) {
      this.maxOpponentsOnGroupNeed = 2;
      return;
    }
    if (count > 30) {
      this.maxOpponentsOnGroupNeed = 30;
      return
    }
    this.maxOpponentsOnGroupNeed = count
    if (this.opponentGroupIndex == 0) {
      this.maxOpponentsOnGroup = count
    }
    this.stepsOnStage = this.countStepsOnStage(this.currentOpponents.length);
    this.currentOpponents = this.smartMixMembers(this.currentOpponents);
    this.getNextOpponents()
  }

  rebalance() {
    while ((this.opponentGroupIndex * this.maxOpponentsOnGroup > this.currentOpponents.length - 2) || this.currentOpponents.length == 1) {
      if (this.currentOpponents.length == 0) {
        this.isWin = true
        break;
      }
      if (this.currentOpponents.length == 1) {
        const winner = this.currentOpponents[0];
        this.arrangedList.push(winner);
        const candidates = this.smartMixMembers(winner.losingOpponents);
        console.log("кандидаты", candidates.map(v => v.id))
        this.stage += 1;
        this.currentOpponents = candidates;
        this.nextOpponents = []
        this.stepsOnStage = this.countStepsOnStage(this.currentOpponents.length);
        this.stepOnStage = 0;
        continue;
      }
      if (this.currentOpponents.length % this.maxOpponentsOnGroup == 1) {
        this.nextOpponents.push(this.currentOpponents[this.currentOpponents.length - 1])
      }
      this.currentOpponents = this.nextOpponents;
      this.maxOpponentsOnGroup = this.maxOpponentsOnGroupNeed
      if (this.needRandomize) {
        this.currentOpponents = randomize(this.currentOpponents)
        this.needRandomize = false
      }
      console.log(this.currentOpponents.map(v => v.id))
      this.nextOpponents = [];
      this.opponentGroupIndex = 0;
    }
  }
  skip() {
    this.currentOpponents = randomizeFrom(this.currentOpponents, this.opponentIndex);
    this.rebalance()
    this.getNextOpponents()
  }

  getNextOpponents() {
    console.log(this.opponentIndex, this.opponentIndex + this.maxOpponentsOnGroup)
    const res = this.currentOpponents.slice(this.opponentIndex, this.opponentIndex + this.maxOpponentsOnGroup);
    this.opponents = res;
    return res;
  }

  chooseWinner(index: number) {
    const winner = this.opponents[index];
    console.log(this.opponents)
    console.log(this.maxOpponentsOnGroup)

    // console.log(winner.id, this.opponents)
    this.opponents.forEach(v => {
      if (v != winner) {
        winner.defeat(v);
      }
    })
    console.log("оппоненты", this.opponents.map(v => v.losingOpponents))
    this.nextOpponents.push(winner);
    this.opponentGroupIndex += 1;
    this.stepOnStage += 1;
    this.rebalance()
    // console.log("fdfdf", this)
    this.getNextOpponents()
  }

  constructor(data: T[]) {
    this.currentOpponents = data.map((v, i) => new Member(i, v));
    this.stepsOnStage = this.countStepsOnStage(this.currentOpponents.length);
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
    topList: undefined,
    maxOpponentsOnGroupNeed: 2
  }),
  methods: {
    chooseWinner(index: number) {
      this.$data.topList.chooseWinner(index);
    },
    onkeydown(e: KeyboardEvent) {
      const $data = this.$data;
      const key = e.key;

      if (e.target instanceof HTMLInputElement) {
        return
      }
      if (key == "ArrowLeft" || key == "a" || key == "1") {
        this.chooseWinner(0);
        return
      }
      const maxOpponentsCount = ($data.topList as TopList2<string>).maxOpponentsOnGroup;
      if (key == "ArrowRight" || key == "d" || key == "3") {
        if (maxOpponentsCount == 2) {
          this.chooseWinner(1);
        } else {
          this.chooseWinner(2);
        }
        return
      }
      if (key == "ArrowDown" || key == "s" || key == "2") {
        this.chooseWinner(1);
        return
      }
      if (Number.isInteger(+key)) {
        if (+key <= maxOpponentsCount) {
          this.chooseWinner(+key - 1);
        }

      }

    }
  },
  computed: {
    opponentsData() {
      return (this.$data.topList as TopList2<string>).opponents.map(d => d.data);
    },
    topListData() {
      return (this.$data.topList as TopList2<string>).arrangedList.map(d => d.data);
    },
    indexesGrid() {
      // console.log("перестройка")
      const maxOpponentsCount = Math.min((this.$data.topList as TopList2<string>).maxOpponentsOnGroup, this.$data.topList.opponents.length);
      const indexes: number[][] = [];
      let line: number[] = [];
      for (let i = 0; i < maxOpponentsCount; i++) {
        line.push(i)
        if (line.length == 4) {
          indexes.push(line)
          line = []
        }
      }
      if (line.length > 0) {
        if (line.length == 1) {
          const data = indexes[indexes.length - 1]?.pop()
          if (data != undefined) {
            line.push(data)
          }
        }
        indexes.push(line)
      }
      return indexes
    },

  },
  watch: {
    maxOpponentsOnGroupNeed(value) {
      console.log("изменено", value)
      this.$data.topList.tryChangeOpponentsOnGroup(value)
    }
  },

  mounted() {
    const db = String(this.$route.query.db || '').toLowerCase();
    const count = Number.parseInt(String(this.$route.query.count || '256').toLowerCase()) || 256;
    let fileName = '/tikTok.json';
    if (new Set(["streamers", "porn"]).has(db)) {
      fileName = `/${db}.json`;
    }
    fetch(fileName).then((r) => r.json()).then((data) => {
      this.$data.topList = new TopList2(randomize(data).slice(0, count));
    });
    document.addEventListener("keydown", this.onkeydown)
  },

  destroyed() {
    removeEventListener("keydown", this.onkeydown);
  },
});
</script>
