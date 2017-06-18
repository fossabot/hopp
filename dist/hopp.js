'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _mgr = require('./tasks/mgr');

var _mgr2 = _interopRequireDefault(_mgr);

var _watch = require('./tasks/watch');

var _watch2 = _interopRequireDefault(_watch);

var _load = require('./plugins/load');

var _load2 = _interopRequireDefault(_load);

var _parallel = require('./tasks/parallel');

var _parallel2 = _interopRequireDefault(_parallel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const { debug } = require('./utils/log')('hopp'

/**
 * Create hopp object based on plugins.
 */
); /**
    * @file src/hopp.js
    * @license MIT
    * @copyright 2017 Karim Alibhai.
    */

exports.default = async directory => {
  ;(await (0, _load2.default)(directory)).forEach(name => {
    let plugName = '';

    for (let tmp = _path2.default.basename(name), i = 5; i < tmp.length; i += 1) {
      plugName += tmp[i] === '-' ? tmp[i++].toUpperCase() : tmp[i];
    }

    debug('adding plugin %s from %s', plugName, name

    // add the plugin to the hopp prototype so it can be
    // used for the rest of the build process
    );_mgr2.default.prototype[plugName] = function () {
      // instead of actually loading the plugin at this stage,
      // we will just pop its call into our internal call stack
      // for use later. this is useful when we are stepping through
      // an entire hoppfile but might only be running a single task

      this.d.stack.push([name, arguments]);

      return this;
    };
  }

  /**
   * Expose hopp class for task creation.
   */
  );const init = src => new _mgr2.default(src);

  init.all = _parallel2.default;
  init.watch = _watch2.default;

  return init;
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9ob3BwLmpzIl0sIm5hbWVzIjpbImRlYnVnIiwicmVxdWlyZSIsImRpcmVjdG9yeSIsImZvckVhY2giLCJuYW1lIiwicGx1Z05hbWUiLCJ0bXAiLCJiYXNlbmFtZSIsImkiLCJsZW5ndGgiLCJ0b1VwcGVyQ2FzZSIsInByb3RvdHlwZSIsImQiLCJzdGFjayIsInB1c2giLCJhcmd1bWVudHMiLCJpbml0Iiwic3JjIiwiYWxsIiwid2F0Y2giXSwibWFwcGluZ3MiOiI7Ozs7OztBQU1BOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVBLE1BQU0sRUFBRUEsS0FBRixLQUFZQyxRQUFRLGFBQVIsRUFBdUI7O0FBRXpDOzs7QUFGa0IsQ0FBbEIsQyxDQVpBOzs7Ozs7a0JBaUJlLE1BQU1DLFNBQU4sSUFBbUI7QUFDaEMsR0FBQyxDQUFDLE1BQU0sb0JBQVlBLFNBQVosQ0FBUCxFQUErQkMsT0FBL0IsQ0FBdUNDLFFBQVE7QUFDOUMsUUFBSUMsV0FBVyxFQUFmOztBQUVBLFNBQUssSUFBSUMsTUFBTSxlQUFLQyxRQUFMLENBQWNILElBQWQsQ0FBVixFQUErQkksSUFBSSxDQUF4QyxFQUEyQ0EsSUFBSUYsSUFBSUcsTUFBbkQsRUFBMkRELEtBQUssQ0FBaEUsRUFBbUU7QUFDakVILGtCQUFZQyxJQUFJRSxDQUFKLE1BQVcsR0FBWCxHQUFpQkYsSUFBSUUsR0FBSixFQUFTRSxXQUFULEVBQWpCLEdBQTBDSixJQUFJRSxDQUFKLENBQXREO0FBQ0Q7O0FBRURSLFVBQU0sMEJBQU4sRUFBa0NLLFFBQWxDLEVBQTRDRDs7QUFFNUM7QUFDQTtBQUhBLE1BSUEsY0FBS08sU0FBTCxDQUFlTixRQUFmLElBQTJCLFlBQVk7QUFDckM7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsV0FBS08sQ0FBTCxDQUFPQyxLQUFQLENBQWFDLElBQWIsQ0FBa0IsQ0FDaEJWLElBRGdCLEVBRWhCVyxTQUZnQixDQUFsQjs7QUFLQSxhQUFPLElBQVA7QUFDRCxLQVpEO0FBYUQ7O0FBRUQ7OztBQTFCQyxJQTZCRCxNQUFNQyxPQUFPQyxPQUFPLGtCQUFTQSxHQUFULENBQXBCOztBQUVBRCxPQUFLRSxHQUFMO0FBQ0FGLE9BQUtHLEtBQUw7O0FBRUEsU0FBT0gsSUFBUDtBQUNELEMiLCJmaWxlIjoiaG9wcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGZpbGUgc3JjL2hvcHAuanNcbiAqIEBsaWNlbnNlIE1JVFxuICogQGNvcHlyaWdodCAyMDE3IEthcmltIEFsaWJoYWkuXG4gKi9cblxuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcbmltcG9ydCBIb3BwIGZyb20gJy4vdGFza3MvbWdyJ1xuaW1wb3J0IGNyZWF0ZVdhdGNoIGZyb20gJy4vdGFza3Mvd2F0Y2gnXG5pbXBvcnQgbG9hZFBsdWdpbnMgZnJvbSAnLi9wbHVnaW5zL2xvYWQnXG5pbXBvcnQgY3JlYXRlUGFyYWxsZWwgZnJvbSAnLi90YXNrcy9wYXJhbGxlbCdcblxuY29uc3QgeyBkZWJ1ZyB9ID0gcmVxdWlyZSgnLi91dGlscy9sb2cnKSgnaG9wcCcpXG5cbi8qKlxuICogQ3JlYXRlIGhvcHAgb2JqZWN0IGJhc2VkIG9uIHBsdWdpbnMuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGRpcmVjdG9yeSA9PiB7XG4gIDsoYXdhaXQgbG9hZFBsdWdpbnMoZGlyZWN0b3J5KSkuZm9yRWFjaChuYW1lID0+IHtcbiAgICBsZXQgcGx1Z05hbWUgPSAnJ1xuXG4gICAgZm9yIChsZXQgdG1wID0gcGF0aC5iYXNlbmFtZShuYW1lKSwgaSA9IDU7IGkgPCB0bXAubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgIHBsdWdOYW1lICs9IHRtcFtpXSA9PT0gJy0nID8gdG1wW2krK10udG9VcHBlckNhc2UoKSA6IHRtcFtpXVxuICAgIH1cblxuICAgIGRlYnVnKCdhZGRpbmcgcGx1Z2luICVzIGZyb20gJXMnLCBwbHVnTmFtZSwgbmFtZSlcbiAgICBcbiAgICAvLyBhZGQgdGhlIHBsdWdpbiB0byB0aGUgaG9wcCBwcm90b3R5cGUgc28gaXQgY2FuIGJlXG4gICAgLy8gdXNlZCBmb3IgdGhlIHJlc3Qgb2YgdGhlIGJ1aWxkIHByb2Nlc3NcbiAgICBIb3BwLnByb3RvdHlwZVtwbHVnTmFtZV0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAvLyBpbnN0ZWFkIG9mIGFjdHVhbGx5IGxvYWRpbmcgdGhlIHBsdWdpbiBhdCB0aGlzIHN0YWdlLFxuICAgICAgLy8gd2Ugd2lsbCBqdXN0IHBvcCBpdHMgY2FsbCBpbnRvIG91ciBpbnRlcm5hbCBjYWxsIHN0YWNrXG4gICAgICAvLyBmb3IgdXNlIGxhdGVyLiB0aGlzIGlzIHVzZWZ1bCB3aGVuIHdlIGFyZSBzdGVwcGluZyB0aHJvdWdoXG4gICAgICAvLyBhbiBlbnRpcmUgaG9wcGZpbGUgYnV0IG1pZ2h0IG9ubHkgYmUgcnVubmluZyBhIHNpbmdsZSB0YXNrXG5cbiAgICAgIHRoaXMuZC5zdGFjay5wdXNoKFtcbiAgICAgICAgbmFtZSxcbiAgICAgICAgYXJndW1lbnRzXG4gICAgICBdKVxuXG4gICAgICByZXR1cm4gdGhpc1xuICAgIH1cbiAgfSlcblxuICAvKipcbiAgICogRXhwb3NlIGhvcHAgY2xhc3MgZm9yIHRhc2sgY3JlYXRpb24uXG4gICAqL1xuICBjb25zdCBpbml0ID0gc3JjID0+IG5ldyBIb3BwKHNyYylcbiAgXG4gIGluaXQuYWxsID0gY3JlYXRlUGFyYWxsZWxcbiAgaW5pdC53YXRjaCA9IGNyZWF0ZVdhdGNoXG5cbiAgcmV0dXJuIGluaXRcbn0iXX0=