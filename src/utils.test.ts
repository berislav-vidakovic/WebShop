// UNIT test for module utils.ts

import { describe, it, expect } from 'vitest'
import { numToString, strToNum } from './utils'

describe('utils', () => {

  describe('numToString', () => {
    it('formats number with US locale and two decimals', () => {
      expect(numToString(0)).toBe('0.00')
      expect(numToString(5)).toBe('5.00')
      expect(numToString(5.5)).toBe('5.50')
      expect(numToString(1234.567)).toBe('1,234.57')
    })
  })

  describe('strToNum', () => {
    it('converts numeric string without commas', () => {
      expect(strToNum('123.45')).toBe(123.45)
    })

    it('converts numeric string with commas', () => {
      expect(strToNum('1,234.56')).toBe(1234.56)
      expect(strToNum('10,000')).toBe(10000)
    })

    it('returns NaN for invalid input', () => {
      expect(strToNum('abc')).toBeNaN()
      expect(strToNum('1,23a')).toBeNaN()
    })
  })

})
