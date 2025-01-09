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
          type="number"
          v-model="workHoursFrom"
          placeholder="Work hours from"
          class="border"
        />
        <input
          type="number"
          v-model="workHoursTo"
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
            type="checkbox"
            :value="country"
            v-model="selectedCountries"
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
            type="checkbox"
            :value="region"
            v-model="selectedRegions"
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
            type="radio"
            :value="employmentType"
            v-model="selectedEmplymentType"
          />
          {{ employmentType }}
        </label>
        <button
          @click="resetEmploymentType"
          class="bg-gray-400 px-2"
        >
          Reset
        </button>
      </div>
    </div>

    <button @click="sortBy('title')">Sort by Title</button>
    <button @click="sortBy('title:desc')">Sort by Title (Desc)</button>

    <div>
      <pre>{{ state.filter }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
const { setFilter, setSearch, state, setSortBy } = useJobPostings()

const computedFilter = computed(() => {
  const filter: Record<string, any> = {}

  const countryFilter = selectedCountries.value.map((country: string) => {
    return {
      job_location_address_country: {
        $eq: country,
      },
    }
  })

  if (countryFilter.length > 0) {
    filter.$or = countryFilter
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

const sortBy = (attr: string) => {
  setSortBy(attr)
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
