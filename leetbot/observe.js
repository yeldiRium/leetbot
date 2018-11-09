import * as R from 'ramda'

export const observableForPath = (path, store) => {
  const getPath = R.path(path)
  let state = getPath(store.getState())

  return {
    subscribe ({ next }) {
      const unsubscribe = store.subscribe(() => {
        const newState = getPath(store.getState())

        if (!R.equals(newState, state)) {
          state = newState
          next(newState)
        }
      })

      next(state)

      return unsubscribe
    }
  }
}
