import * as R from 'ramda'

const validToken = token => token !== '<TOKEN>' && R.trim(token) !== ''

export {
  validToken
}
