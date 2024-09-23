<template>
  <div>
    <h1 class="text-3xl text-center mt-5">Поиск ТОП №{{ round + 1 }}. Ход №{{ step }}</h1>
    <div class="flex justify-around">
      <PickPhoto :url="leftUrl" @picked="pickPhoto" :id="leftId" />
      <PickPhoto :url="rightUrl" @picked="pickPhoto" :id="rightId" />
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
import TopListComp from "~/components/TopList.vue";

// import streamers from "~/assets/streamers.json";
import tikTok from "~/assets/tikTok.json";

const urls = tikTok.slice(0, 16);
const topList = new NodeItem(
  -1,
  urls.map((url, i) => new NodeItem(i))
);
let conflictNode: NodeItem | undefined;

export default Vue.extend({
  name: "IndexPage",
  components: {
    TopList: TopListComp,
    PickPhoto,
  },
  data: () => ({
    urls,
    leftId: 0,
    rightId: 0,
    isWin: false,
    topListUrls: [] as string[],
    step: 0,
    round: 0
  }),
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
        this.pickPhoto($data.leftId);
      }
      if (key == "ArrowRight" || key == "d") {
        this.pickPhoto($data.rightId);
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
