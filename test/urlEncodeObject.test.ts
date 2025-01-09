import { describe, it, expect } from 'vitest'
import { urlEncodeObject } from '../src/runtime/utils/urlEncodeObject'

describe('urlEncodeObject', async () => {
  it('encodes a simple object into URLSearchParams', () => {
    const testFilter1 = {
      title: 'Hello',
      price: 100,
      stock: true,
    }

    const encodedParams = urlEncodeObject(testFilter1, 'filter')

    expect(encodedParams.get('filter[title]')).toBe('Hello')
    expect(encodedParams.get('filter[price]')).toBe('100')
    expect(encodedParams.get('filter[stock]')).toBe('true')
  })

  it('encodes a simple object into URLSearchParams that can be converted to a string', () => {
    const testFilter1 = {
      title: 'Hello',
      price: 100,
      stock: true,
    }

    const encodedParams = urlEncodeObject(testFilter1, 'filter')

    // Prettify the URL-encoded string
    const prettified = decodeURIComponent(encodedParams.toString())

    expect(prettified).toBe(
      'filter[title]=Hello&filter[price]=100&filter[stock]=true'
    )
  })

  it('encodes a simple object with all filter operations', () => {
    const testFilter2 = {
      title: { $eq: 'Hello' },
      price: { $gt: 100 },
      stock: { $lt: 100 },
      brand: { $ne: 'Beatles' },
      color: { $in: ['red', 'blue'] },
      size: { $notIn: ['XL', 'XXL'] },
      title2: { $contains: 'John' },
      title3: { $notContains: 'Paul' },
      title4: { $containsi: 'George' },
      title5: { $notContainsi: 'Ringo' },
      price2: { $between: [100, 200] },
    }

    const encodedParams = urlEncodeObject(testFilter2, 'filter')

    const prettified = decodeURIComponent(encodedParams.toString())

    expect(prettified).toBe(
      'filter[title][$eq]=Hello&filter[price][$gt]=100&filter[stock][$lt]=100&filter[brand][$ne]=Beatles&filter[color][$in][0]=red&filter[color][$in][1]=blue&filter[size][$notIn][0]=XL&filter[size][$notIn][1]=XXL&filter[title2][$contains]=John&filter[title3][$notContains]=Paul&filter[title4][$containsi]=George&filter[title5][$notContainsi]=Ringo&filter[price2][$between][0]=100&filter[price2][$between][1]=200'
    )
  })

  it('encodes a complex nested object into URLSearchParams', () => {
    const testFilter3 = {
      stock: { $gt: 0 },
      brand: 'Beatles',
      $or: [
        { title: { $contains: 'John' } },
        { title: { $contains: 'Paul' } },
        {
          $and: [
            { color: { $eq: 'blue' } },
            { size: { $eq: 'S' } },
            { title: { $contains: 'Paul' } },
          ],
        },
      ],
      $and: [
        { title: { $notContains: 'George' } },
        { title: { $notContains: 'Ringo' } },
        { price: { $lt: 100 } },
        { size: { $in: ['S', 'M'] } },
        {
          $or: [
            { title: { $contains: 'John' } },
            { title: { $contains: 'Paul' } },
          ],
        },
      ],
    }

    const encodedParams = urlEncodeObject(testFilter3, 'filter')

    const prettified = decodeURIComponent(encodedParams.toString())

    expect(prettified).toBe(
      'filter[stock][$gt]=0&filter[brand]=Beatles&filter[$or][0][title][$contains]=John&filter[$or][1][title][$contains]=Paul&filter[$or][2][$and][0][color][$eq]=blue&filter[$or][2][$and][1][size][$eq]=S&filter[$or][2][$and][2][title][$contains]=Paul&filter[$and][0][title][$notContains]=George&filter[$and][1][title][$notContains]=Ringo&filter[$and][2][price][$lt]=100&filter[$and][3][size][$in][0]=S&filter[$and][3][size][$in][1]=M&filter[$and][4][$or][0][title][$contains]=John&filter[$and][4][$or][1][title][$contains]=Paul'
    )
  })
})
