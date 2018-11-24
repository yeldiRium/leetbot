import moment from 'moment-timezone'

export const timer = () => {

}

/**
 * Date must be a moment time object.
 * @param {*} date
 */
export const callAt = (date, callback) => {
  const now = moment().utc().valueOf()
  const then = date.utc().valueOf()

  if (then <= now) {
    return callback()
  }
  return setTimeout(callback, then - now)
}

/**
 * A promise that resolves when it is time.
 * @param {*} date
 * @return Promise
 */
export const whenItIsTime = date => new Promise((resolve, reject) => {
  const now = moment().utc().valueOf()
  const then = date.utc().valueOf()
  if (then <= now) {
    return resolve()
  }
  setTimeout(resolve, then - now)
})
