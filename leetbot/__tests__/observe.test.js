import { createStore } from 'redux'
import { observableForPath } from '../observe'

describe('observableForPath', () => {
  describe('subscribe', () => {
    it('subscribes to store, calls next once with state at path and unsubscribes on return function call', () => {
      const store = jest.fn()
      store.getState = jest.fn().mockReturnValue({
        some: 'value'
      })
      const storeUnsubscribe = jest.fn()
      store.subscribe = jest.fn().mockReturnValue(storeUnsubscribe)
      const path = ['some']

      const observable = observableForPath(path, store)

      const observer = {
        next: jest.fn()
      }

      const unsubscribe = observable.subscribe(observer)

      expect(store.subscribe.mock.calls.length).toBe(1)
      expect(observer.next.mock.calls.length).toBe(1)
      expect(observer.next.mock.calls[0][0]).toBe('value')

      expect(storeUnsubscribe.mock.calls.length).toBe(0)
      unsubscribe()
      expect(storeUnsubscribe.mock.calls.length).toBe(1)
    })

    const testAction = value => ({
      type: 'TEST_ACTION',
      value
    })
    const testReducer = (state = { some: 'value' }, action) => {
      switch (action.type) {
        case 'TEST_ACTION':
          return {
            some: action.value
          }
        default:
          return state
      }
    }

    it('calls next with new value when it changes', () => {
      const store = createStore(testReducer)

      const observable = observableForPath(['some'], store)

      const observer = {
        next: jest.fn()
      }

      observable.subscribe(observer)
      expect(observer.next.mock.calls.length).toBe(1)
      expect(observer.next.mock.calls[0][0]).toBe('value')

      store.dispatch(testAction('newValue'))
      expect(observer.next.mock.calls.length).toBe(2)
      expect(observer.next.mock.calls[1][0]).toBe('newValue')
    })

    it('does not call next after an action that doesn\'t change the observed state', () => {
      const store = createStore(testReducer)

      const observable = observableForPath(['some'], store)

      const observer = {
        next: jest.fn()
      }

      observable.subscribe(observer)
      expect(observer.next.mock.calls.length).toBe(1)
      expect(observer.next.mock.calls[0][0]).toBe('value')

      store.dispatch(testAction('value'))
      expect(observer.next.mock.calls.length).toBe(1)
    })

    it('can unsubscribe itself on value change', () => {
      const store = createStore(testReducer)

      const observable = observableForPath(['some'], store)

      const changeHandler = () => unsubscribe()

      const unsubscribe = jest.fn(observable.subscribe({
        next: value => {
          if (value === 'unsubscribe') {
            changeHandler()
          }
        }
      }))

      expect(unsubscribe.mock.calls.length).toBe(0)
      store.dispatch(testAction('unsubscribe'))
      expect(unsubscribe.mock.calls.length).toBe(1)
    })
  })
})
