import * as R from 'ramda'

export const chatIdInContext = R.path(['chat', 'id'])

export const messageIdInContext = R.path(['update', 'message', 'message_id'])

export const legibleUserInContext = R.compose(
  R.head,
  R.dropWhile(R.isNil),
  R.props(['username', 'first_name', 'last_name', 'id']),
  R.prop('from')
)

export const messageInContext = R.path(['update', 'message', 'text'])

/**
 * Catch and log any error that might occur further down the line.
 *
 * @param {*} ctx
 * @param {*} next
 */
export const crashHandler = (ctx, next) => {
  return next().catch(console.log)
}
