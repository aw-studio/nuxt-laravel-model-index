<template>
  <div class="grid grid-cols-2">
    <div>
      <JobPostingIndexFilter />

      {{ meta?.current_page }} / {{ meta?.last_page }}, ({{ perPage }})
      <div class="grid grid-cols-3 gap-6">
        <JobPostingIndexItem
          v-for="(item, index) in items"
          :key="index"
          :job-posting="item"
        />
      </div>

      <div
        v-if="state?.loading"
        class="flex justify-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="lucide lucide-loader-circle animate-spin"
        >
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
      </div>

      <button
        :disabled="!hasPrevPage"
        class="border border-gray-500 p-2"
        @click="prevPage"
      >
        prev
      </button>
      <button
        :disabled="!hasNextPage"
        class="border border-gray-500 p-2"
        @click="nextPage"
      >
        next
      </button>
      <div class="bg-blue-950 text-white p-4">
        <Json
          :key="state?.__hash"
          :data="state?.meta"
        />
      </div>
    </div>
    <div class="text-xs bg-black text-green-500 p-4 overflow-scroll h-screen">
      <Json
        :key="state?.__hash"
        :data="state"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const {
  items,
  state,
  perPage,
  meta,
  hasNextPage,
  hasPrevPage,
  nextPage,
  prevPage,
} = await useJobPostings({
  perPage: 6,
  syncUrl: true,
  sort: 'title',
  ssr: true,
})
</script>
