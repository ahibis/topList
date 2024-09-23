<template>
  <div>
    <h1 class="text-3xl text-center mt-5">Поиск топ №{{ round+1 }}. Ход №{{ step }}</h1>
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




export default {
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
      conflictNode: undefined as NodeItem | undefined,
      topListUrls: [] as string[],
      step: 0,
      round: 0
    };
  },
  methods: {
    pickPhoto(id: number) {
      if (!this.conflictNode) return;
      this.conflictNode?.solveConflict(
        id,
        id == this.leftId ? this.rightId : this.leftId
      );
      this.getConflict();
    },
    getConflict() {
      const data = topList.getConflict();
      if (!data) {
        this.isWin = true;
        this.conflictNode = undefined;
        const topListIds = topList.getChildList();
        // topListIds.shift();
        console.log(topListIds);
        this.topListUrls = topListIds.map((id) => this.urls[id]);
        return;
      }
      this.step += 1
      this.leftId = data.childsId[0];
      this.rightId = data.childsId[1];
      console.log(this.leftId, this.rightId);
      this.conflictNode = data.node;
      console.log(topList.toString());
      this.round = topList.getDepth();
    },
    onkeydown(e: KeyboardEvent) {
      const key = e.key;
      if (key == "ArrowLeft" || key == "a") {
        this.pickPhoto(this.leftId);
      }
      if (key == "ArrowRight" || key == "d") {
        this.pickPhoto(this.rightId);
      }
      
    }
  },
  computed: {
    leftUrl() {
      return this.urls[this.leftId];
    },
    rightUrl() {
      return this.urls[this.rightId];
    },
  },
  mounted() {
    this.getConflict();
    document.addEventListener("keydown", this.onkeydown)
  },
  unmounted() {
    removeEventListener("keydown", this.onkeydown);
  },
};
</script>
