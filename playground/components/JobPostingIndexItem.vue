<template>
  <div>
    ({{ jobPosting.id }})
    <h3>{{ jobPosting.title }}</h3>
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
