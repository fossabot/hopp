/**
 * @file src/tasks/buffer.js
 * @license MIT
 * @copyright 2017 10244872 Canada Inc.
 */

import map from './map'

export default () => {
  const buffers = []

  return map((data, next) => {
    // add to buffer
    buffers.push(data.body)

    // check for end
    if (data.done) {
      return next(null, Buffer.concat(buffers))
    }

    // otherwise drop from stream
    next()
  })
}
