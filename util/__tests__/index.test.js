import { validToken } from '../'

describe('validToken', () => {
  it('returns false for the string "<TOKEN>"', () => {
    expect(validToken('<TOKEN>')).toBeFalse()
  })

  it('returns false for whitespace', () => {
    expect(validToken('    \t ')).toBeFalse()
  })

  it('returns true for anything else', () => {
    const examples = [
      'uiae',
      'nqxeg81389',
      '  en18390e\t',
      'ngqx<TOKEN>xelnqfv q exnne8349 e',
      'whatever'
    ]
    examples.forEach(example => expect(validToken(example)).toBeTrue())
  })
})
