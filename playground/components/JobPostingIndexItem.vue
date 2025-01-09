<template>
  <div>
    <h3>{{ jobPosting.title }}</h3>
    {{ jobPosting.workHours }}
  </div>
</template>

<script setup lang="ts">
import { JobPosting } from '~/types'

defineProps({
  jobPosting: {
    type: Object as PropType<JobPosting>,
    required: true,
  },
})
</script>
