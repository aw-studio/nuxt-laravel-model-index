<template>
  <div>
    <h2>Filter</h2>

    <div>
      <div>
        <input
          v-model="searchterm"
          type="text"
          placeholder="Search"
          class="border"
        />
        <!-- {{ state.search }} -->
      </div>
      <div>
        <input
          v-model="workHoursFrom"
          type="number"
          placeholder="Work hours from"
          class="border"
        />
        <input
          v-model="workHoursTo"
          type="number"
          placeholder="Work hours to"
          class="border"
        />
      </div>
      <div>
        <label
          v-for="country in countries"
          :key="country"
        >
          <input
            v-model="selectedCountries"
            type="checkbox"
            :value="country"
          />
          {{ country }}
        </label>
      </div>
      <div class="flex gap-4">
        <label
          v-for="employmentType in employmentTypes"
          :key="employmentType"
        >
          <input
            v-model="selectedEmplymentType"
            type="radio"
            :value="employmentType"
          />
          {{ employmentType }}
        </label>
        <button
          class="bg-gray-400 px-2"
          @click="resetEmploymentType()"
        >
          Reset
        </button>
      </div>
    </div>

    <button @click="sort('title')">Sort by Title</button>
    <button @click="sort('-title')">Sort by Title (Desc)</button>

    <div>
      <pre>{{ state?.filter }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
const { setFilter, setSearch, state, setSort } = await useJobPostings()

const computedFilter = computed(() => {
  const filter: Record<string, any> = {}

  if (selectedCountries.value.length > 0) {
    filter.$or = selectedCountries.value.map((country: string) => {
      return {
        job_location_address_country: country,
      }
    })
  }

  if (selectedEmplymentType.value !== undefined) {
    filter.$and = [
      {
        employment_type: {
          $eq: selectedEmplymentType.value,
        },
      },
    ]
  }

  if (workHoursFrom.value > 0 && workHoursTo.value > workHoursFrom.value) {
    filter.$and.push({
      work_hours: {
        $between: [workHoursFrom.value, workHoursTo.value],
      },
    })
  }

  return filter
})

const countries = ['Nepal', 'Denmark', 'Lesotho']
const selectedCountries = ref<string[]>([])

const searchterm = ref('')

const employmentTypes = ['OTHER', 'INTERN', 'FULL_TIME', 'TEMPORARY']
const selectedEmplymentType = ref<string | undefined>()
const resetEmploymentType = () => {
  selectedEmplymentType.value = undefined
}

const workHoursFrom = ref(0)
const workHoursTo = ref(0)

const sort = (attr: string) => {
  setSort(attr)
}

watch(
  () => computedFilter.value,
  () => {
    setFilter(computedFilter.value)
  },
  { deep: true }
)

watch(
  () => searchterm.value,
  () => {
    setSearch(searchterm.value)
  }
)
</script>
