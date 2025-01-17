[![npm version][npm-version-src]][npm-version-href]
![CI](https://github.com/aw-studio/nuxt-laravel-model-index/actions/workflows/ci.yml/badge.svg)

# Nuxt Laravel Model Index

This Nuxt Module provides an opinionated API for Laravel Model Indexes.

It is recommended to use the [Laravel Model Index](https://github.com/aw-studio/laravel-model-index) package in your Laravel project.

- [Features](#features)
- [Setup](#setup)
- [Usage](#usage)
  - [Configuration](#configuration)
  - [SSR](#ssr)
  - [Data Fetching](#data-fetching)
  - [Retrieving Data](#retrieving-data)
  - [Searching](#searching)
  - [Filtering](#filtering)
  - [Sorting](#sorting)
  - [Meta / Loading State](#meta--loading-state)
- [Example](#example)

## Features
- Laravel API index queries with URL-encoded parameters
- Complex Filtering
- Pagination
- Searching
- Sorting
- Mutateable Index State

## Setup

### 1. Install the module

Add `@aw-studio/nuxt-laravel-model-index` as a dependency in your project:

```bash
npm i @aw-studio/nuxt-laravel-model-index
```

### 2. Configure the module

Add the module to your `nuxt.config.ts` file and configure the settings:

```ts
export default defineNuxtConfig({
  modules: [
    '@aw-studio/nuxt-laravel-model-index',
  ],
  modelIndex: {
    baseUrl: 'https://your-laravel-api.tld',
  },
});
```

You can now create indexes for all your Laravel models.

## Usage

The `useModelIndex` composable is auto-imported. Pass the relative path to your API endpoint as a parameter, which also serves as the identifier for the state object. Ensure this parameter is unique.

### Example Setup

Create a composable for reusability:

```ts
import { ModelIndexOptions } from '@aw-studio/nuxt-laravel-model-index';
import { Product } from '@/types';

export const useProducts = (options?: ModelIndexOptions) => {
  return useModelIndex<Product>('/api/products', options);
};
```

This composable now provides a stateful, filterable Laravel API index.

### Configuration

You can set up the index configuration when initializing the composable:

```ts
const {items} = await useJobPostings({
  perPage: 6,
  syncUrl: true,
  sort: 'title',
  ssr: true,
})
```

You can also dynamically update the configuration during runtime:

```ts
const { setConfig, setPerPage, setSyncUrl } = await useProducts();

setConfig({
  perPage: 6,
  syncUrl: true,
});

setPerPage(10);
setSyncUrl(false);
```

### SSR

Enable SSR compatibility by passing the `ssr` option. Items will be loaded during server-side rendering:

```ts
const { items } = await useProducts({
  perPage: 6,
  syncUrl: true,
  sort: 'title',
  ssr: true,
});
```

### Data Fetching

These functions allow you to interact with the API:

```ts
const { load, loadAll, loadMore, nextPage, prevPage } = await useProducts();

// Load the first page
await load();

// Load the next page
await nextPage();

// Load the previous page
await prevPage();

// Load a specific page (e.g., page 6)
await load(6);

// Append more items (useful for infinite scrolling)
await loadMore();
```

### Retrieving Data

The model items are stored in a reactive state:

```ts
const { items } = await useProducts()
```

### Searching

Trigger a search by setting a search string:

```ts
const { setSearch } = await useProducts();

setSearch('Foo');
```

### Filtering

Apply filters by passing a filter object:

```ts
const { setFilter } = await useProducts()

// Basic filter
setFilter({
    size: 'M',
    color: 'blue'
})

// Filter with operators
setFilter({
  price: { $lt: 100 },
});

// Complex conditions
setFilter({
  $and: [
    {
        $or: [
            { title: { $contains: 'John' } },
            { title: { $contains: 'Paul' } },
        ],
    },
    { title: { $contains: 'John' } },
    { price: { $lt: 100 } },
    { size: { $in: ['S', 'M'] } },
  ],
});
```

#### Available Operators

| Operator        | Description             |
---|
| `$eq`           | Equal to                |
| `$ne`           | Not equal to            |
| `$lt`           | Less than               |
| `$lte`          | Less than or equal to   |
| `$gt`           | Greater than            |
| `$gte`          | Greater than or equal to|
| `$in`           | In array                |
| `$notIn`        | Not in array            |
| `$contains`     | Contains                |
| `$notContains`  | Does not contain        |
| `$between`      | Between values          |


### Sorting

Sort the index with the following syntax:

```ts
const { setSort } = await useProducts();

// Sort ascending by title
setSort('title');

// Sort descending by title
setSort('title:desc');
setSort('-title');
```

### Meta / Loading State 

Pagination metadata and loading state are available:

```vue
<template>
    <div>
        <Spinner v-if="loading">
        Page: {{ meta?.current_page }} / {{ meta?.last_page }}
    </div>
</template>

<script setup lang="ts">
const { meta, loading } = await useProducts()
</script>
```

## Example

### Product Index Setup

```ts
import { ModelIndexOptions } from '@aw-studio/nuxt-laravel-model-index';
import { Product } from '@/types';

export const useProducts = (options?: ModelIndexOptions) => {
  return useModelIndex<Product>('/api/products', options);
};
```

### Display Products

```vue
<template>
  <div>
    <YourFilterComponent />
    <YourProductComponent
      v-for="item in items"
      :key="item.id"
      :product="item"
    />
    <button @click="prevPage" :disabled="!hasPrevPage">Previous</button>
    <button @click="nextPage" :disabled="!hasNextPage">Next</button>
    <div>Page: {{ meta?.current_page }} / {{ meta?.last_page }}</div>
  </div>
</template>

<script setup lang="ts">
const { items, meta, hasNextPage, hasPrevPage, nextPage, prevPage, load, setConfig } = await useProducts();

onMounted(async () => {
  setConfig({
    perPage: 6,
    syncUrl: true,
  });

  await load();
});
</script>
```

### Add Search Functionality

```vue
<template>
  <div>
    <input v-model="searchTerm" type="search" placeholder="Search" />
  </div>
</template>

<script setup lang="ts">
const { setSearch } = await useProducts();
const searchTerm = ref('');

watch(searchTerm, () => {
  setSearch(searchTerm.value);
});
</script>
```

### Add Filter Functionality

```vue
<template>
    <div>
        <label
          v-for="size in sizes"
          :key="size"
        >
          <input
            v-model="selectedSizes"
            type="checkbox"
            :value="size"
          />
          {{ size }}
        </label>
    </div>
</template>

<script setup lang="ts">
const { setFilter } = await useProducts();

const sizes = ['S', 'M', 'L', 'XL']
const selectedSizes = ref<string[]>([])

const filter = computed(()=>{
    if (selectedSizes.length > 0) {
        filter.$or = selectedSizes.value.map((size: string) => {
            return {
                size
            }
        })
    }
})

watch(
  () => filter.value,
  () => {
    setFilter(filter.value)
  },
  { deep: true }
)
</script>
```


[npm-version-src]: https://img.shields.io/npm/v/@aw-studio/nuxt-laravel-model-index/latest.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-version-href]: https://npmjs.com/package/@aw-studio/nuxt-laravel-model-index