import * as api from './api'        // sendGraphQLquery lives here
import * as queries from './queries'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { numToString } from '../utils'

afterEach(() => {
  vi.restoreAllMocks() // reset mocks between tests
})

describe('GraphQL queries integration (mocked backend)', () => {
  it('fetchCustomers returns mocked data', async () => {
    vi.spyOn(api, 'sendGraphQLquery').mockResolvedValue({
      data: {
        customers: [
          { id: 1, name: 'Alice', city: 'NY', country: 'USA' },
          { id: 2, name: 'Bob', city: 'LA', country: 'USA' },
        ]
      }
    })

    const customers = await queries.fetchCustomers()
    expect(customers).toHaveLength(2)
    expect(customers[0].name).toBe('Alice')
    expect(customers[1].city).toBe('LA')
  })

  it('fetchOrderItems returns mocked data with correct subtotal', async () => {
    vi.spyOn(api, 'sendGraphQLquery').mockResolvedValue({
      data: {
        order_details_v: [
          { order_id: 1, customer: 'Alice', product: 'Keyboard', quantity: 2, price_usd: 50 },
          { order_id: 2, customer: 'Bob', product: 'Mouse', quantity: 1, price_usd: 25 },
        ]
      }
    })

    const orderItems = await queries.fetchOrderItems()
    expect(orderItems).toHaveLength(2)
    expect(orderItems[0].subtotal).toBe(numToString(50*2))
    expect(orderItems[1].price).toBe(numToString(25))
  })

  it('fetchProducts returns mocked data with formatted price', async () => {
    vi.spyOn(api, 'sendGraphQLquery').mockResolvedValue({
      data: {
        products: [
          { id: 1, name: 'Keyboard', description: 'Mechanical', manufacturer: 'Logi', price_usd: 50 },
          { id: 2, name: 'Mouse', description: 'Wireless', manufacturer: 'Logi', price_usd: 25 },
        ]
      }
    })

    const products = await queries.fetchProducts()
    expect(products).toHaveLength(2)
    expect(products[0].priceUSD).toBe(numToString(50))
    expect(products[1].manufacturer).toBe('Logi')
  })

})
