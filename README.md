[![npm version][npm-version-src]][npm-version-href]
![CI](https://github.com/aw-studio/nuxt-laravel-model-index/actions/workflows/ci.yml/badge.svg)

# Nuxt Laravel Model Index

This Nuxt Module provides an opinionated API for Laravel Model Indexes.

It is recommended to use the [Laravel Model Index](https://github.com/aw-studio/laravel-model-index) package in your Laravel project.

-   [Features](#features)
-   [Setup](#setup)
-   [Usage](#usage)
-   [Example](#example)

## Features
- Laravel API index queries with URL-encoded parameters
- Complex Filtering
- Pagination
- Searching
- Sorting
- Mutateable Index State

## Setup

1. Add `@aw-studio/nuxt-laravel-model-index` as a dependency in your project. The package can be found [here](https://www.npmjs.com/package/@aw-studio/nuxt-laravel-model-index).

```bash
npm i @aw-studio/nuxt-laravel-model-index
```

2. Add the module config to you `nuxt.config.ts`

```ts
export default defineNuxtConfig({
    // add the module
    modules: [
         // ...
        '@aw-studio/nuxt-laravel-model-index',
    ],
    // Add module specific settings
    modelIndex: {
        baseUrl: 'https://your-laravel-api.tld',
    },
});
```

You can now add indexes for all of your Laravel Models.

## Usage

The `useModelIndex` composable is auto-imported. It takes the relative path to your api endpoint as a parameter which is also used as an identifier for the state object so make shure it is unique.

Setting up an index as as simple as creating a composable for reusability like this:

```ts
import { Product } from '@/types';

export const useProducts = () => {
    // pass the relative path to your products API
    return useModelIndex<Product>('/api/products');
};
```

Thats it. You have now a stateful, filterable Laravel API.

### Configuration

You can set your index config like this:

```ts
const { setConfig, setPerPage, setSyncUrl } = useProducts()

setConfig({
    perPage: 6, // Pagination items per page
    syncUrl: true, // wheter or not to sync the index with the URL
})

setPerPage(10)

setSyncUrl(false)
```

### Data Fetching

These functions allow you to fetch data from your API:
```ts
const { load, loadAll, loadMore, nextPage, prevPage } = useProducts()

const getProducts = async () => {
  // Load the first page of products
  await load() 

  // Load the next page of products
  await nextPage()

  // Load the previous page of products
  await prevPage()

  // Load the sixth page of products
  await load(6)

  // Load more products and append to the existing list, useful for infinite scrolling
  await loadMore()
}
```

### Retrieving Data

The model `items` are stored state:
```ts
const { items } = useProducts()
```

### Searching

You can trigger an index search by setting a search string:
```ts
const { setSearch } = useProducts()

setSearch('Foo')
```

### Filtering
You can filter an index passing a filter object:
```ts
const { setFilter } = useProducts()

// basic filter
setFilter({
    size: 'M',
    color: 'blue'
})

// smaller operation
setFilter({
    { price: { $lt: 100 } },
})

// or condition
setFilter({
   $or: [
        { title: { $contains: 'John' } },
        { title: { $contains: 'Paul' } },
    ],
})

// more complex 
setFilter({
    $and: [
        {
            $or: [
                { title: { $contains: 'John' } },
                { title: { $contains: 'Paul' } },
            ],
        },
        { title: { $notContains: 'George' } },
        { title: { $notContains: 'Ringo' } },
        { price: { $lt: 100 } },
        { size: { $in: ['S', 'M'] } },
        { color: { $in: ['red', 'blue'] } },
    ],
})
```

Available Operators:

| Operator  | Description  |
|---|---|
|$eq    | equal to|
|$ne    | not equal to|
|$lt    | smaller |
|$lte   | smaller or equal|
|$gt    | greater |
|$gte   | greater or equal|
|$in    | in array|
|$notIn | not in array|
|$contains  | contains|
|$notContains   | doesn't contain|
|$between   | is between|


### Sorting

You can sort your index like this:
```ts
const { setSortBy } = useProducts()

// sort by title in asc order
setSortBy('title')

// sort by title in desc order
setSortBy('title:desc')
setSortBy('-title')
```


### Meta / Loading State 

The response meta with all pagination info is stored in the `meta` object.
The `loading` element outputes the current loading state of the index.


```vue
<template>
    <div>
        <Spinner v-if="loading">
        Page: {{ meta?.current_page }} / {{ meta?.last_page }}
    </div>
</template>

<script setup lang="ts">
const { meta, loading } = useProducts()
</script>
```


## Example


Setup an index for your `Products` Model by creating a `useProducts` composable.

```ts
import { Product } from '@/types';

export const useProducts = () => {
    // pass the relative path to your products API
    return useModelIndex<Product>('/api/products');
};
```


Show the product index in a component:

```vue
<template>
    <div>
        <YourFilterComponent />
        <YourProductComponent
            v-for="item in items"
            :product="item"
        />
        <button
            @click="prevPage"
            :disabled="!hasPrevPage"
        >
            prev
        </button>
        <button
            @click="nextPage"
            :disabled="!hasNextPage"
        >
            next
        </button>
        <div>
            Page: {{ meta?.current_page }} / {{ meta?.last_page }}
        </div>
    </div>
</template>

<script setup lang="ts">
const {
  items,
  load,
  perPage,
  meta,
  hasNextPage,
  hasPrevPage,
  nextPage,
  prevPage,
  setConfig,
} = useProducts();

onMounted(async () => {
  setConfig({
    perPage: 6,
    syncUrl: true,
  })

  await load()
})
</script>
```

Create a Search

```vue
<template>
    <div>
        <input
            type="search"
            v-model="searchterm"
            placeholder="Search"
        />
    </div>
</template>

<script setup lang="ts">
const { setSearch } = useProducts();

watch(
  () => searchterm.value,
  () => {
    setSearch(searchterm.value)
  }
)
</script>
```

Create a Filter

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
const { setFilter } = useProducts();

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
  [
    selectedSizes
  ],
  () => {
    setFilter(filter.value)
  },
  { deep: true }
)
</script>
```


[npm-version-src]: https://img.shields.io/npm/v/@aw-studio/nuxt-laravel-model-index/latest.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-version-href]: https://npmjs.com/package/@aw-studio/nuxt-laravel-model-index