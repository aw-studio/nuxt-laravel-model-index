<template>
  <div class="relative p-5 border rounded-md bg-athens-gray-900">
    <button
      class="absolute top-0 right-0 p-2 bg-blue-800 rounded-bl-11 rounded-tr-11"
      @click="show = !show"
    >
      {{ title }}
    </button>
    <ul
      v-if="!show"
      class="font-mono"
    >
      <Element
        v-for="(el, key) in data"
        :key="key"
        :el="el"
        :label="`${key}`"
      />
    </ul>
  </div>
</template>

<script setup lang="ts">
import Element from './Element.vue'

const props = defineProps({
  data: {
    type: Object,
    default: () => ({}),
  },
  title: {
    type: String,
    default: 'JSON',
  },
  collapse: {
    type: Boolean,
    default: false,
  },
})

const show = ref(props.collapse)
</script>

<style>
.font-mono {
  font-family: monospace;
}
</style>
