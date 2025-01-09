import { describe, it, expect } from 'vitest'
import { prepareQueryParams } from '../src/runtime/utils/prepareQueryParams'

describe('prepareQueryParams', async () => {
  it('should return URLSearchParams', async () => {
    const state = {
      items: [],
      error: null,
      loading: false,
      meta: undefined,
      page: 1,
      perPage: 10,
      syncUrl: false,
      sortBy: 'name',
      search: 'john',
      filter: {
        name: { $eq: 'john' },
        age: { $gte: 18 },
      },
      __updated: new Date(),
      __hash: 'hash',
    }

    const result = prepareQueryParams(state)

    expect(result instanceof URLSearchParams).toBe(true)
  })

  it('should return URLSearchParams with correct values', async () => {
    const state = {
      items: [],
      error: null,
      loading: false,
      meta: undefined,
      page: 1,
      perPage: 10,
      syncUrl: false,
      sortBy: 'name',
      search: 'john',
      filter: {},
      __updated: new Date(),
      __hash: 'hash',
    }

    const result = prepareQueryParams(state)

    expect(result.get('page')).toBe('1')
    expect(result.get('perPage')).toBe('10')
    expect(result.get('sortBy')).toBe('name')
    expect(result.get('search')).toBe('john')
  })

  it('should return URLSearchParams with filter values', async () => {
    const state = {
      items: [],
      error: null,
      loading: false,
      page: 1,
      perPage: 10,
      syncUrl: false,
      filter: {
        name: { $eq: 'john' },
        age: { $gte: 18 },
      },
      __updated: new Date(),
      __hash: 'hash',
    }

    const result = prepareQueryParams(state)

    expect(result.get('filter[name][$eq]')).toBe('john')
    expect(result.get('filter[age][$gte]')).toBe('18')
  })
})
