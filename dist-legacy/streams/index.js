'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * @file src/streams/index.js
 * @license MIT
 * @copyright 2017 Karim Alibhai.
 */

var buffer = exports.buffer = require('./buffer').default;
var createBundle = exports.createBundle = require('./bundle').default;
var createReadStream = exports.createReadStream = require('./readstream').default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zdHJlYW1zL2luZGV4LmpzIl0sIm5hbWVzIjpbImJ1ZmZlciIsInJlcXVpcmUiLCJkZWZhdWx0IiwiY3JlYXRlQnVuZGxlIiwiY3JlYXRlUmVhZFN0cmVhbSJdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQTs7Ozs7O0FBTU8sSUFBTUEsMEJBQVNDLFFBQVEsVUFBUixFQUFvQkMsT0FBbkM7QUFDQSxJQUFNQyxzQ0FBZUYsUUFBUSxVQUFSLEVBQW9CQyxPQUF6QztBQUNBLElBQU1FLDhDQUFtQkgsUUFBUSxjQUFSLEVBQXdCQyxPQUFqRCIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGZpbGUgc3JjL3N0cmVhbXMvaW5kZXguanNcbiAqIEBsaWNlbnNlIE1JVFxuICogQGNvcHlyaWdodCAyMDE3IEthcmltIEFsaWJoYWkuXG4gKi9cblxuZXhwb3J0IGNvbnN0IGJ1ZmZlciA9IHJlcXVpcmUoJy4vYnVmZmVyJykuZGVmYXVsdFxuZXhwb3J0IGNvbnN0IGNyZWF0ZUJ1bmRsZSA9IHJlcXVpcmUoJy4vYnVuZGxlJykuZGVmYXVsdFxuZXhwb3J0IGNvbnN0IGNyZWF0ZVJlYWRTdHJlYW0gPSByZXF1aXJlKCcuL3JlYWRzdHJlYW0nKS5kZWZhdWx0Il19