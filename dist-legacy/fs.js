'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.writeFile = exports.readFile = exports.readdir = exports.mkdir = exports.stat = exports.exists = undefined;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Similar to bluebird's Promise.promisify.
 * @param {Function} fn the async-callback function to transform
 * @return {Function} a new promise-based function
 */
function promisify(fn) {
  return function () {
    var _this = this;

    var args = [].slice.call(arguments);
    return new Promise(function (resolve, reject) {
      fn.apply(_this, args.concat([function (err) {
        if (err) reject(err);else resolve.apply(null, [].slice.call(arguments, 1));
      }]));
    });
  };
}

/**
 * Transform only needed methods (instead of using mz
 * or doing a promisifyAll).
 */
/**
 * @file src/fs.js
 * @license MIT
 * @copyright 2017 Karim Alibhai.
 */

var exists = exports.exists = function exists(dir) {
  return new Promise(function (res) {
    return _fs2.default.exists(dir, res);
  });
};
var stat = exports.stat = promisify(_fs2.default.stat);
var mkdir = exports.mkdir = promisify(_fs2.default.mkdir);
var readdir = exports.readdir = promisify(_fs2.default.readdir);
var readFile = exports.readFile = promisify(_fs2.default.readFile);
var writeFile = exports.writeFile = promisify(_fs2.default.writeFile);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9mcy5qcyJdLCJuYW1lcyI6WyJwcm9taXNpZnkiLCJmbiIsImFyZ3MiLCJzbGljZSIsImNhbGwiLCJhcmd1bWVudHMiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsImFwcGx5IiwiY29uY2F0IiwiZXJyIiwiZXhpc3RzIiwiZGlyIiwicmVzIiwic3RhdCIsIm1rZGlyIiwicmVhZGRpciIsInJlYWRGaWxlIiwid3JpdGVGaWxlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBTUE7Ozs7OztBQUVBOzs7OztBQUtBLFNBQVNBLFNBQVQsQ0FBbUJDLEVBQW5CLEVBQXVCO0FBQ3JCLFNBQU8sWUFBWTtBQUFBOztBQUNqQixRQUFNQyxPQUFPLEdBQUdDLEtBQUgsQ0FBU0MsSUFBVCxDQUFjQyxTQUFkLENBQWI7QUFDQSxXQUFPLElBQUlDLE9BQUosQ0FBWSxVQUFDQyxPQUFELEVBQVVDLE1BQVYsRUFBcUI7QUFDdENQLFNBQUdRLEtBQUgsUUFBZVAsS0FBS1EsTUFBTCxDQUFZLENBQUMsVUFBVUMsR0FBVixFQUFlO0FBQ3pDLFlBQUlBLEdBQUosRUFBU0gsT0FBT0csR0FBUCxFQUFULEtBQ0tKLFFBQVFFLEtBQVIsQ0FBYyxJQUFkLEVBQW9CLEdBQUdOLEtBQUgsQ0FBU0MsSUFBVCxDQUFjQyxTQUFkLEVBQXlCLENBQXpCLENBQXBCO0FBQ04sT0FIMEIsQ0FBWixDQUFmO0FBSUQsS0FMTSxDQUFQO0FBTUQsR0FSRDtBQVNEOztBQUVEOzs7O0FBekJBOzs7Ozs7QUE2Qk8sSUFBTU8sMEJBQVMsU0FBVEEsTUFBUztBQUFBLFNBQU8sSUFBSU4sT0FBSixDQUFZO0FBQUEsV0FBTyxhQUFHTSxNQUFILENBQVVDLEdBQVYsRUFBZUMsR0FBZixDQUFQO0FBQUEsR0FBWixDQUFQO0FBQUEsQ0FBZjtBQUNBLElBQU1DLHNCQUFPZixVQUFVLGFBQUdlLElBQWIsQ0FBYjtBQUNBLElBQU1DLHdCQUFRaEIsVUFBVSxhQUFHZ0IsS0FBYixDQUFkO0FBQ0EsSUFBTUMsNEJBQVVqQixVQUFVLGFBQUdpQixPQUFiLENBQWhCO0FBQ0EsSUFBTUMsOEJBQVdsQixVQUFVLGFBQUdrQixRQUFiLENBQWpCO0FBQ0EsSUFBTUMsZ0NBQVluQixVQUFVLGFBQUdtQixTQUFiLENBQWxCIiwiZmlsZSI6ImZzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAZmlsZSBzcmMvZnMuanNcbiAqIEBsaWNlbnNlIE1JVFxuICogQGNvcHlyaWdodCAyMDE3IEthcmltIEFsaWJoYWkuXG4gKi9cblxuaW1wb3J0IGZzIGZyb20gJ2ZzJ1xuXG4vKipcbiAqIFNpbWlsYXIgdG8gYmx1ZWJpcmQncyBQcm9taXNlLnByb21pc2lmeS5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIHRoZSBhc3luYy1jYWxsYmFjayBmdW5jdGlvbiB0byB0cmFuc2Zvcm1cbiAqIEByZXR1cm4ge0Z1bmN0aW9ufSBhIG5ldyBwcm9taXNlLWJhc2VkIGZ1bmN0aW9uXG4gKi9cbmZ1bmN0aW9uIHByb21pc2lmeShmbikge1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIGNvbnN0IGFyZ3MgPSBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cylcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgZm4uYXBwbHkodGhpcywgYXJncy5jb25jYXQoW2Z1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgaWYgKGVycikgcmVqZWN0KGVycilcbiAgICAgICAgZWxzZSByZXNvbHZlLmFwcGx5KG51bGwsIFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSlcbiAgICAgIH1dKSlcbiAgICB9KVxuICB9XG59XG5cbi8qKlxuICogVHJhbnNmb3JtIG9ubHkgbmVlZGVkIG1ldGhvZHMgKGluc3RlYWQgb2YgdXNpbmcgbXpcbiAqIG9yIGRvaW5nIGEgcHJvbWlzaWZ5QWxsKS5cbiAqL1xuZXhwb3J0IGNvbnN0IGV4aXN0cyA9IGRpciA9PiBuZXcgUHJvbWlzZShyZXMgPT4gZnMuZXhpc3RzKGRpciwgcmVzKSlcbmV4cG9ydCBjb25zdCBzdGF0ID0gcHJvbWlzaWZ5KGZzLnN0YXQpXG5leHBvcnQgY29uc3QgbWtkaXIgPSBwcm9taXNpZnkoZnMubWtkaXIpXG5leHBvcnQgY29uc3QgcmVhZGRpciA9IHByb21pc2lmeShmcy5yZWFkZGlyKVxuZXhwb3J0IGNvbnN0IHJlYWRGaWxlID0gcHJvbWlzaWZ5KGZzLnJlYWRGaWxlKVxuZXhwb3J0IGNvbnN0IHdyaXRlRmlsZSA9IHByb21pc2lmeShmcy53cml0ZUZpbGUpIl19