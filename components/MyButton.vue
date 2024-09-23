<template>
  <button @click="click" class=" bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-2xl">
    <slot></slot>
  </button>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'MyButton',
  methods: {
    click() {
      this.$emit('click')
    }
  },
})
</script>