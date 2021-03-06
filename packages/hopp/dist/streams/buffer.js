'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _map = require('./map');

var _map2 = _interopRequireDefault(_map);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = () => {
  const buffers = [];

  return (0, _map2.default)((data, next) => {
    // add to buffer
    buffers.push(data.body);

    // check for end
    if (data.done) {
      return next(null, Buffer.concat(buffers));
    }

    // otherwise drop from stream
    next();
  });
}; /**
    * @file src/tasks/buffer.js
    * @license MIT
    * @copyright 2017 10244872 Canada Inc.
    */

//# sourceMappingURL=buffer.js.map