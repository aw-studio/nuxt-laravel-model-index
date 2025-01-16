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
        {{ state.search }}
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
      <div>
        <label
          v-for="region in regions"
          :key="region"
        >
          <input
            v-model="selectedRegions"
            type="checkbox"
            :value="region"
          />
          {{ region }}
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
          @click="resetEmploymentType"
        >
          Reset
        </button>
      </div>
    </div>

    <button @click="setSort('title')">Sort by Title</button>
    <button @click="setSort('title:desc')">Sort by Title (Desc)</button>

    <div>
      <pre>{{ state.filter }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
const { setFilter, setSearch, state, setSort } = useJobPostings()

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

  const regionFilter =
    selectedRegions.value.length > 0
      ? {
          job_location_address_region: {
            $in: selectedRegions.value,
          },
        }
      : {}

  if (selectedRegions.value.length > 0) {
    filter.$and.push(regionFilter)
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

const regions = ['Kansas', 'Arkansas']
const selectedRegions = ref<string[]>([])

const searchterm = ref('')

const employmentTypes = ['OTHER', 'INTERN', 'FULL_TIME', 'TEMPORARY']
const selectedEmplymentType = ref<string | undefined>()
const resetEmploymentType = () => {
  selectedEmplymentType.value = undefined
}

const workHoursFrom = ref(0)
const workHoursTo = ref(0)

const setSort = (attr: string) => {
  setSort(attr)
}

watch(
  [
    selectedCountries,
    selectedRegions,
    selectedEmplymentType,
    searchterm,
    workHoursFrom,
    workHoursTo,
  ],
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
