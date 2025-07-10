import { describe, it, expect } from 'vitest'
import { detect_search_type } from '../search'

describe('detect_search_type', () => {
  it('ISBN strings return \'isbn\'', () => {
    expect(detect_search_type('9781234567897')).toBe('isbn')
  })

  it('MD5 strings return \'md5\'', () => {
    expect(detect_search_type('d41d8cd98f00b204e9800998ecf8427e')).toBe('md5')
  })

  it('Regular strings return \'normal\'', () => {
    expect(detect_search_type('hello world')).toBe('normal')
  })
})