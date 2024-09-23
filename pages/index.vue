<template>
  <div>
    <h1 class="text-3xl text-center mt-5">Поиск ТОП №{{ round+1 }}. Ход №{{ step }}</h1>
    <div class="flex justify-around">
      <PickPhoto :url="leftUrl" @picked="pickPhoto" :id="leftId" />
      <PickPhoto :url="rightUrl" @picked="pickPhoto" :id="rightId" />
    </div>
    <div>
      <div v-for="(url, id) in topListUrls" class="flex">
        <div class="w-20">{{ id + 1 }} место</div>
        <div class="w-40 aspect-square rounded-xl flex justify-center bg-slate-100 mb-3 transition hover:scale-105 duration-300">
          <img :src="url" alt="" class="h-full" />
        </div>
        
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import MyButton from "~/components/MyButton.vue";
import PickPhoto from "~/components/PickPhoto.vue";
import { NodeItem } from "~/assets/topList";
// import streamers from "~/assets/streamers.json";
import tikTok from "~/assets/tikTok.json";

const urls = tikTok.slice(0,16);
const topList = new NodeItem(
  -1,
  urls.map((url, i) => new NodeItem(i))
);
let conflictNode: NodeItem | undefined;

export default Vue.extend({
  name: "IndexPage",
  components: {
    MyButton,
    PickPhoto,
  },
  data() {
    return {
      urls,
      leftId: 0,
      rightId: 0,
      isWin: false,
      topListUrls: [] as string[],
      step: 0,
      round: 0
    };
  },
  methods: {
    pickPhoto(id: number) {
      const $data = this.$data;
      if (!conflictNode) return;
      conflictNode?.solveConflict(
        id,
        id == $data.leftId ? $data.rightId : $data.leftId
      );
      this.getConflict();
    },
    getConflict() {
      const data = topList.getConflict();
      const $data = this.$data;
      if (!data) {
        $data.isWin = true;
        conflictNode = undefined;
        const topListIds = topList.getChildList();
        // topListIds.shift();
        console.log(topListIds);
        $data.topListUrls = topListIds.map((id) => $data.urls[id]);
        return;
      }
      $data.step += 1
      $data.leftId = data.childsId[0];
      $data.rightId = data.childsId[1];
      console.log($data.leftId, $data.rightId);
      conflictNode = data.node;
      console.log(topList.toString());
      $data.round = topList.getDepth();
    },
    onkeydown(e: KeyboardEvent) {
      const $data = this.$data;
      const key = e.key;
      if (key == "ArrowLeft" || key == "a") {
        $data.pickPhoto($data.leftId);
      }
      if (key == "ArrowRight" || key == "d") {
        $data.pickPhoto($data.rightId);
      }
      
    }
  },
  computed: {
    leftUrl() {
      return this.$data.urls[this.$data.leftId];
    },
    rightUrl() {
      return this.$data.urls[this.$data.rightId];
    },
  },
  mounted() {
    this.getConflict();
    document.addEventListener("keydown", this.onkeydown)
  },
  destroyed() {
    removeEventListener("keydown", this.onkeydown);
  },
});
</script>
