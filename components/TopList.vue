<template>
  <div>
    <div v-for="(url, id) in topListUrls" class="flex">
        <div class="w-20">{{ id + 1 }} место</div>
        <div class="w-40 aspect-square rounded-xl flex justify-center bg-slate-100 mb-3 transition hover:scale-105 duration-300">
          <img :src="url" alt="" class="h-full" />
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
      type: Array as PropType<string[]>
    }
  }
})
</script>
