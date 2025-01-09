<template>
  <div>
    <h3>{{ jobPosting.title }}</h3>
    {{ jobPosting.workHours }}
  </div>
</template>

<script setup lang="ts">
defineProps({
  jobPosting: {
    type: Object as PropType<any>,
    required: true,
  },
})
</script>
