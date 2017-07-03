const hopp = require('hopp')

exports.default =
  hopp('src/*.js')
    .eslint()
