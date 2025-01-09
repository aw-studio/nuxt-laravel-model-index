<template>
  <JobPostingIndex />
</template>

<script setup lang="ts">
useHead({
  title: 'Job Postings',
  meta: [
    {
      name: 'description',
      content: 'Job Postings',
    },
  ],
  //  add script
  // https://cdn.tailwindcss.com
  script: [
    {
      src: 'https://cdn.tailwindcss.com',
    },
  ],
})
</script>
