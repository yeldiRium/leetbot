import * as R from 'ramda'

const chatIdInContext = R.path(['chat', 'id'])

const legibleUserInContext = R.compose(
  R.head,
  R.dropWhile(R.isNil),
  R.props(['username', 'first_name', 'last_name', 'id']),
  R.prop('from')
)

const messageInContext = R.path(['update', 'message', 'text'])

/**
 * Catch and log any error that might occur further down the line.
 *
 * @param {*} ctx
 * @param {*} next
 */
const crashHandler = (ctx, next) => {
  return next().catch(console.error)
}

export {
  chatIdInContext,
  crashHandler,
  legibleUserInContext,
  messageInContext
}
