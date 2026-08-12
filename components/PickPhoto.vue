<template>
  <div class=" mx-10 w-[30%] mt-10" @click="pickPicture" :title="title">
    <div v-if="name" class="flex justify-center w-full m-2 text-lg text-bold">{{ name }}({{ score }})</div>
    <div
      class="w-full aspect-square rounded-xl flex justify-center bg-slate-100 mb-3 transition hover:scale-105 duration-300">
      <img :src="url" alt="" :key="url" class="h-full transition duration-150" :class="{ 'opacity-0': isLoad }">
    </div>
    <div class="flex justify-center mt-4">
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
    name: String,
    id: Number,
    score: Number
  },
  data: () => ({
    isLoad: false
  }),
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
  },
  computed: {
    title() {
      if (this.id === 0) {
        return "Нажмите A/Left arrow/1 чтобы выбрать"
      }
      if (this.id === 1) {
        return "Нажмите S/D/Down arrow/Right arrow/2/3 чтобы выбрать"
      }
      if (this.id === 2) {
        return "Нажмите D/Right arrow/3 чтобы выбрать"
      }
      return `Нажмите ${this.id + 1} чтобы выбрать`
    }
  }
})
</script>

<style>
.transition {
  transition: opacity 0.5s ease;
}
</style>
