'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

let glob = (() => {
  var _ref = _asyncToGenerator(function* (pattern, cwd, useDoubleCache = false, recache = false) {

    /**
     * Recursive walk.
     */
    let walk = (() => {
      var _ref2 = _asyncToGenerator(function* (relative, pttn, directory, recursive = false) {
        debug('walk(relative = %s, pttn = %s, directory = %s, recursive = %s) in %s [recache:%s, curr:%s]', relative, pttn, directory, recursive, cwd, recache, pttn[0]);

        if (pttn.length === 0) {
          return [];
        }

        pttn = pttn.slice();

        const curr = pttn.shift();
        let localResults = [];

        for (let file of yield (0, _.readdir)(directory)) {
          // fix file path
          const filepath = directory + _path2.default.sep + file;
          const relativepath = relative + _path2.default.sep + file;

          // get stat from temp cache (for non-watch tasks) or stat()
          let fstat;

          if (useDoubleCache) {
            fstat = tempCache[filepath] = tempCache[filepath] || (yield (0, _.stat)(filepath));
          } else {
            fstat = yield (0, _.stat)(filepath);
          }

          debug('match(%s,%s) => %s [%s]', filepath, curr, (0, _minimatch2.default)(file, curr), fstat.isFile() ? 'file' : 'dir');

          // has been modified
          debug('stat(%s) :: %s', +fstat.mtime, statCache[relativepath]);

          if ((0, _minimatch2.default)(file, curr)) {
            if (fstat.isFile()) {
              if (recache || !statCache.hasOwnProperty(relativepath) || statCache[relativepath] !== +fstat.mtime) {
                statCache[relativepath] = +fstat.mtime;
                localResults.push(filepath);

                debug('add: %s', filepath);
              }
            } else {
              localResults = localResults.concat((yield walk(relativepath, pttn, filepath, recursive || curr === '**')));
            }
          } else if (fstat.isDirectory() && recursive) {
            localResults = localResults.concat((yield walk(relativepath, [curr].concat(pttn), filepath, recursive)));
          }
        }

        return localResults;
      });

      return function walk(_x3, _x4, _x5) {
        return _ref2.apply(this, arguments);
      };
    })();

    /**
     * Run all patterns against directory.
     */


    // prefer arrays
    if (!(pattern instanceof Array)) {
      pattern = [pattern];
    }

    // get cache
    if (statCache === undefined) {
      statCache = cache.val('sc') || {};
    }

    // allow overrides from the env
    recache = recache || process.env.RECACHE === 'true';let results = [];
    for (let pttn of pattern) {
      if (pttn[0] === '/') {
        throw new Error('Not sure what to do with the / in your glob.');
      }

      const nm = glob.nonMagic(pttn);
      debug('nm = %j', nm);

      if (!nm) {
        results = results.concat((yield walk('.', pttn.split('/'), cwd)));
      } else {
        results = results.concat((yield walk(nm, pttn.replace(nm, '').substr(1).split('/'), _path2.default.resolve(cwd, nm))));
      }
    }

    /**
     * Update cache.
     */
    cache.val('sc', statCache);

    /**
     * Return final results object.
     */
    return results;
  });

  return function glob(_x, _x2) {
    return _ref.apply(this, arguments);
  };
})();

/**
 * Get non-magical start of glob.
 * @param {String} pattern glob pattern
 * @returns {String} definitive path
 */


var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _minimatch = require('minimatch');

var _minimatch2 = _interopRequireDefault(_minimatch);

var _cache = require('../cache');

var cache = _interopRequireWildcard(_cache);

var _ = require('./');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            * @file src/glob.js
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            * @license MIT
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            * @copyright 2017 10244872 Canada Inc.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            */

const { debug } = require('../utils/log')('hopp:glob');

let statCache;
const tempCache = {};

glob.nonMagic = function (pattern) {
  let newpath = '';

  for (let sub of pattern.split('/')) {
    if (sub) {
      if (sub.indexOf('*') !== -1) {
        break;
      }

      newpath += _path2.default.sep + sub;
    }
  }

  return newpath.substr(1);
};

exports.default = glob;