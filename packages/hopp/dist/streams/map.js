'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _through = require('through2');

var _through2 = _interopRequireDefault(_through);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = mapper => _through2.default.obj(function (data, _, done) {
  mapper(data, (err, newData) => {
    // if both undefined, just exit
    if (err === undefined && newData === undefined) return done();

    // otherwise, treat like usual async function
    if (err === null) {
      this.push(newData);
      done();
    } else done(err);
  });
}); /**
     * @file src/streams/map.js
     * @license MIT
     * @copyright 2017 10244872 Canada Inc.
     */
//# sourceMappingURL=map.js.map