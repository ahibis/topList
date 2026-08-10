<template>
  <div class="flex justify-center flex-wrap gap-5]">
    <div v-for="(data, id) in topListUrls">
      <div class="flex justify-center p-1">{{ id + 1 }} место</div>
      <div class="flex justify-center p-1" v-if="data.name">{{ data.name }} место</div>
      <div
        class="w-40 aspect-square rounded-xl flex justify-center bg-slate-100 mb-3 transition hover:scale-105 duration-300">
        <img :src="data.url" alt="" class="h-full" />
      </div>

    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { PropType } from 'vue'

export default Vue.extend({
  name: 'TopList',
  props: {
    topListUrls: {
      type: Array as PropType<{ url: string, name: string }[]>
    }
  }
})
</script>
