<template>
  <div class=" mx-10 w-[30%] mt-10" @click="pickPicture">
    <div
      class="w-full aspect-square rounded-xl flex justify-center bg-slate-100 mb-3 transition hover:scale-105 duration-300">
      <img :src="url" alt="" :key="url" class="h-full transition duration-150" :class="{ 'opacity-0': isLoad }">
    </div>
    <div class="flex justify-center">
      <MyButton>Выбрать</MyButton>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import MyButton from '~/components/MyButton.vue'

export default Vue.extend({
  name: 'PickPhoto',
  components: {
    MyButton
  },
  props: {
    url: String,
    id: Number
  },
  data() {
    return {
      isLoad: false
    }
  },
  methods: {
    pickPicture() {
      this.$emit("picked", this.id)
    }
  },
  watch: {
    url() {
      this.isLoad = true
      setTimeout(() => {
        this.isLoad = false
      }, 50)
    }
  }
})
</script>

<style>
.transition {
  transition: opacity 0.5s ease;
}
</style>