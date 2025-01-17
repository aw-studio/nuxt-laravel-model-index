import { ofetch } from 'ofetch'
import {
  useAsyncData,
  useRoute,
  useRouter,
  useRuntimeConfig,
  useState,
} from 'nuxt/app'
import { computed, toRefs, watch } from 'vue'
import type { ModuleOptions } from '../../module'
import { md5 } from '../utils/md5'
import type {
  Filter,
  IndexResponse,
  LaravelResponseMeta,
  ModelIndexOptions,
  ModelIndexState,
} from '../types'
import { prepareQueryParams } from '../utils/prepareQueryParams'

export async function useModelIndex<T extends object>(
  endpoint: string,
  options?: ModelIndexOptions
) {
  const router = useRouter()
  const route = useRoute()
  const config = useRuntimeConfig().public.modelIndex as ModuleOptions

  /**
   * State for the model index.
   *
   */
  const state = useState<ModelIndexState<T>>(`index-${endpoint}`, () => ({
    items: [] as T[],
    error: null as {
      message: string
      errors: { [key: string]: string[] }
    } | null,
    loading: false,
    meta: undefined as LaravelResponseMeta | undefined,
    page: undefined as number | undefined,
    perPage: undefined as number | undefined,
    syncUrl: false,
    sort: undefined as string | undefined,
    search: undefined as string | undefined,
    filter: {} as Filter,
    __updated: new Date(),
    __hash: undefined as string | undefined,
    __ssr: false,
  }))

  const setConfig = (config: ModelIndexOptions) => {
    if (config.perPage) {
      state.value.perPage = config.perPage
    }
    if (config.syncUrl) {
      state.value.syncUrl = config.syncUrl
    }
    if (config.sort) {
      state.value.sort = config.sort
    }
    if (config.ssr) {
      state.value.__ssr = config.ssr
    }
  }

  /**
   * Fetch items from the Laravel API.
   * @param append Whether to append the items to the existing
   */
  const fetchFromApi = async (append: boolean = false) => {
    state.value.loading = true
    state.value.error = null

    const params = prepareQueryParams(state.value)

    try {
      const response: IndexResponse<T> = await ofetch(
        `${endpoint}?${params.toString()}`,
        {
          baseURL: config.baseUrl,
          headers: {
            Accept: 'application/json',
          },
        }
      )

      // if append is true, append the new items to the existing items
      // otherwise, replace the existing items with the new items.
      // append is used for infinite scrolling.
      if (append) {
        state.value.items = state.value.items.concat(response.data)
      } else {
        state.value.items = response.data
      }

      state.value.meta = response.meta
      state.value.page = response.meta?.current_page
    } catch (e: any) {
      if (!append) {
        state.value.items = []
      }
      state.value.error = e.response._data
    } finally {
      state.value.loading = false
    }
  }

  const hasNextPage = computed(() => {
    return (
      state.value.meta &&
      state.value.meta.current_page &&
      state.value.meta.current_page < state.value.meta.last_page
    )
  })

  const hasPrevPage = computed(() => {
    return (
      state.value.meta &&
      state.value.meta.current_page &&
      state.value.meta.current_page > 1
    )
  })

  const nextPage = () => {
    if (hasNextPage.value) {
      load(state.value.meta!.current_page! + 1)
    }
  }

  const prevPage = () => {
    if (hasPrevPage.value) {
      load(state.value.meta!.current_page! - 1)
    }
  }

  const setPage = (page: number) => {
    load(page)
  }

  const setPerPage = (perPage: number) => {
    state.value.perPage = perPage
  }

  const setSearch = (search: string) => {
    state.value.search = search
  }

  const setFilter = (filter: Filter) => {
    state.value.filter = filter
  }

  const setSort = (sort: string) => {
    state.value.sort = sort
  }

  const setSyncUrl = (syncUrl: boolean) => {
    state.value.syncUrl = syncUrl
  }

  /**
   * Load all items from the API without pagination.
   */
  const loadAll = async () => {
    state.value.page = undefined
    state.value.perPage = undefined
    await fetchFromApi()
  }

  /**
   * Load items from the API with pagination.
   * @param page The page number to load.
   * @param append Whether to append the items to the existing
   * items or replace the existing items in the state.
   */
  const load = async (page?: number, append: boolean = false) => {
    // if a page is passed, set the current page to that page
    // if no page is passed, check, if syncUrl is enabled and if so,
    // set the current page to the page in the URL.
    // if no page is passed and syncUrl is disabled, set the current page to 1.
    // then, if syncUrl is enabled, update the URL with the new page

    if (page) {
      state.value.page = page
    } else if (state.value.syncUrl) {
      state.value.page = Number(route.query.page) || 1
    } else {
      state.value.page = 1
    }

    if (state.value.syncUrl) {
      router.push({
        query: { ...route.query, page: state.value.page },
      })
    }

    await fetchFromApi(append)
  }

  const loadMore = () => {
    if (state.value.loading) {
      return
    }

    if (!state.value.meta) {
      return
    }

    if (state.value.meta.current_page === state.value.meta.last_page) {
      return
    }

    load(state.value.meta.current_page! + 1, true)
  }

  /**
   * Mutate an item in the state.
   * @param id
   * @param data
   */
  const mutateStateItem = (
    id: string | number,
    data: Partial<T>,
    idKey?: string
  ) => {
    if (!idKey) {
      idKey = 'id'
    }

    const index = state.value.items.findIndex((item: T) => {
      if (!(idKey in item)) {
        throw new Error(
          `Key ${idKey} not found in item ${JSON.stringify(item)}`
        )
      }
      return item[idKey as keyof typeof item] === id
    })

    if (index !== -1) {
      state.value.items[index] = {
        ...state.value.items[index],
        ...data,
      }
    }
  }

  const stateHash = () => {
    const hash = md5(
      JSON.stringify({
        sort: state.value.sort,
        search: state.value.search,
        filter: state.value.filter,
      })
    )
    // if the hash is the same as the previous hash, don't fetch
    if (state.value.__updated && state.value.__hash === hash) {
      return
    }
    state.value.__updated = new Date()
    state.value.__hash = hash
  }

  watch(
    [
      () => state.value.sort,
      () => state.value.search,
      () => state.value.filter,
    ],
    () => {
      stateHash()

      if (state.value.page) {
        load(1)
      } else {
        loadAll()
      }
    }
  )

  if (options) {
    setConfig(options)
  }

  // load the first page on init
  if (state.value.__hash === undefined) {
    stateHash()
    await useAsyncData(`${endpoint}`, async () => {
      return await load()
    })
  }

  return {
    ...toRefs(state.value),
    state,
    hasNextPage,
    hasPrevPage,
    nextPage,
    prevPage,
    setPerPage,
    setPage,
    setSearch,
    setFilter,
    setSort,
    setSyncUrl,
    setConfig,
    load,
    loadAll,
    loadMore,
    mutateStateItem,
  }
}
