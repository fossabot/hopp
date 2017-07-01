'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _pump = require('pump');

var _pump2 = _interopRequireDefault(_pump);

var _glob = require('../fs/glob');

var _glob2 = _interopRequireDefault(_glob);

var _through = require('through2');

var _through2 = _interopRequireDefault(_through);

var _cache = require('../cache');

var cache = _interopRequireWildcard(_cache);

var _getPath = require('../fs/get-path');

var _getPath2 = _interopRequireDefault(_getPath);

var _utils = require('../utils');

var _streams = require('../streams');

var _fs3 = require('../fs');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @file src/tasks/mgr.js
 * @license MIT
 * @copyright 2017 10244872 Canada Inc.
 */

const { debug } = (0, _utils.createLogger)('hopp');
const watchlog = (0, _utils.createLogger)('hopp:watch').log;

/**
 * Plugins storage.
 */
const plugins = {};
const pluginConfig = {};

/**
 * Test for undefined or null.
 */
function isUndefined(value) {
  return value === undefined || value === null;
}

/**
 * Hopp class to manage tasks.
 */
class Hopp {
  /**
   * Creates a new task with the glob.
   * DOES NOT START THE TASK.
   *
   * @param {Glob} src
   * @return {Hopp} new hopp object
   */
  constructor(src) {
    if (!(src instanceof Array)) {
      src = [src];
    }

    // store context local to each task
    this.pluginCtx = {};

    // persistent info
    this.d = {
      src,
      stack: []
    };
  }

  /**
   * Sets the destination of this pipeline.
   * @param {String} out
   * @return {Hopp} task manager
   */
  dest(out) {
    this.d.dest = out;
    return this;
  }

  /**
   * Allow renaming of destination files.
   * @param {Function} fn a renaming function
   * @returns {Hopp} current object for chaining
   */
  rename(fn) {
    if (typeof fn !== 'function' && typeof fn !== 'object') {
      throw new Error('Rename must be given a function or object.');
    }

    this.d.rename = fn;
    return this;
  }

  /**
   * Actually do the renaming.
   * @param {String} filename the original name
   * @returns {String} renamed filename
   */
  doRename(filename, dirname, source) {
    // if no rename is defined, just use current filename
    if (!this.d.rename) return dirname + '/' + filename;

    // functions are easy, but they break caching
    if (typeof this.d.rename === 'function') {
      return this.d.rename(filename, dirname, source);
    }

    // remove extension
    let ext = filename.substr(1 + filename.lastIndexOf('.'));
    filename = filename.substr(0, filename.lastIndexOf('.'));

    // add prefix
    if (this.d.rename.prefix) {
      filename = this.d.rename.prefix + filename;
    }

    // add suffix, before extension
    if (this.d.rename.suffix) {
      filename += this.d.rename.suffix;
    }

    // change extension
    if (this.d.rename.ext) {
      ext = this.d.rename.ext;
    }

    // output final filename into same dest directory
    return dirname + '/' + filename + '.' + ext;
  }

  /**
   * Run task in continuous mode.
   */
  watch(name, directory, recache = false) {
    name = `watch:${name}`;

    const watchers = [];

    this.d.src.forEach(src => {
      // get most definitive path possible
      let newpath = _path2.default.resolve(directory, _glob2.default.nonMagic(src));

      // disable fs caching for watch
      (0, _fs3.disableFSCache)();

      // start watch
      watchlog('Watching for %s ...', name);
      watchers.push(_fs2.default.watch(newpath, {
        recursive: src.indexOf('/**/') !== -1
      }, () => this.start(name, directory, recache, false)));
    });

    return new Promise(resolve => {
      process.on('SIGINT', () => {
        watchers.forEach(watcher => watcher.close());
        resolve();
      });
    });
  }

  /**
   * Handles bundling.
   */
  async startBundling(name, directory, modified, dest, useDoubleCache = true) {
    const { log, debug } = (0, _utils.createLogger)(`hopp:${name}`);
    debug('Switched to bundling mode');

    /**
     * Fetch sourcemap from cache.
     */
    const sourcemap = cache.sourcemap(name);

    /**
     * Get full list of current files.
     */
    const files = await (0, _glob2.default)(name, this.d.src, directory, useDoubleCache, true);

    /**
     * Create list of unmodified.
     */
    let freshBuild = true;
    const unmodified = {};

    for (let file of files) {
      if (modified.indexOf(file) === -1) {
        unmodified[file] = true;
        freshBuild = false;
      }
    }

    /**
     * Get old bundle & create new one.
     */
    const originalFd = freshBuild ? null : await (0, _fs3.openFile)(dest, 'r');
    const [tmpBundle, tmpBundlePath] = await (0, _fs3.tmpFile)();

    /**
     * Create new bundle to forward to.
     */
    const bundle = new _streams.Bundle(directory, tmpBundle);

    /**
     * Since bundling starts streaming right away, we can count this
     * as the start of the build.
     */
    const start = Date.now();
    log('Starting task');

    /**
     * Add all files.
     */
    for (let file of files) {
      let stream;

      if (unmodified[file]) {
        debug('forward: %s', file);
        stream = _fs2.default.createReadStream(null, {
          fd: originalFd,
          autoClose: false,
          start: sourcemap[file.replace(directory, '.')].start,
          end: sourcemap[file.replace(directory, '.')].end
        });
      } else {
        debug('transform: %s', file);
        stream = (0, _pump2.default)([(0, _streams.createReadStream)(file, dest + '/' + _path2.default.basename(file))].concat(this.buildStack(name)));
      }

      bundle.add(file, stream);
    }

    /**
     * Wait for bundling to end.
     */
    await bundle.end(tmpBundlePath);

    /**
     * Move the bundle to the new location.
     */
    if (originalFd) originalFd.close();
    await (0, _fs3.mkdirp)(_path2.default.dirname(dest).replace(directory, ''), directory);
    await new Promise((resolve, reject) => {
      const stream = _fs2.default.createReadStream(tmpBundlePath).pipe(_fs2.default.createWriteStream(dest));

      stream.on('close', resolve);
      stream.on('error', reject);
    });

    /**
     * Update sourcemap.
     */
    cache.sourcemap(name, bundle.map);

    log('Task ended (took %s ms)', Date.now() - start);
  }

  /**
   * Converts all plugins in the stack into streams.
   */
  buildStack(name) {
    const { error } = (0, _utils.createLogger)(`hopp:${name}`);
    const that = this;

    let mode = 'stream';

    return this.d.stack.map(([plugin]) => {
      const pluginStream = _through2.default.obj(async function (data, _, done) {
        try {
          const handler = plugins[plugin](that.pluginCtx[plugin], data);

          // for async functions/promises
          if ('then' in handler) {
            try {
              this.push((await handler));
              done();
            } catch (err) {
              done(err);
            }
          } else if ('next' in handler) {
            let retval;

            // for async generators
            do {
              retval = await handler.next();
              this.push(retval.value);
            } while (!retval.done);

            done();
          } else {
            // otherwise, fail
            done(new Error('Unknown return value received from ' + plugin));
          }
        } catch (err) {
          done(err);
        }
      });

      /**
       * Enable buffer mode if required.
       */
      if (mode === 'stream' && pluginConfig[plugin].mode === 'buffer') {
        mode = 'buffer';
        return (0, _pump2.default)((0, _streams.buffer)(), pluginStream, err => {
          if (err) error(err && err.stack ? err.stack : err);
        });
      }

      /**
       * Otherwise keep pumping.
       */
      return pluginStream;
    });
  }

  /**
   * Loads a plugin, manages its env.
   */
  loadPlugin(taskName, plugin, args, directory) {
    let mod = plugins[plugin];

    if (!mod) {
      // convert plugin path from relative back to absolute
      try {
        let pathToPlugin = plugin;

        if (plugin[0] !== '/') {
          pathToPlugin = _path2.default.join(directory, 'node_modules', plugin);
        }

        mod = require(pathToPlugin);
      } catch (err) {
        debug('failed to load plugin: %s', err && err.stack ? err.stack : err);
        throw new Error('Failed to load plugin: ' + plugin);
      }

      // expose module config
      pluginConfig[plugin] = mod.config || {};

      // if defined as an ES2015 module, assume that the
      // export is at 'default'
      if (mod.__esModule === true) {
        mod = mod.default;
      }

      // add plugins to loaded plugins
      plugins[plugin] = mod;
    }

    // create plugin logger
    const logger = (0, _utils.createLogger)(`hopp:${taskName}:${_path2.default.basename(plugin).substr(5)}`);

    // load/create cache for plugin
    const pluginCache = cache.plugin(plugin);

    // create a new context for this plugin
    this.pluginCtx[plugin] = {
      args,
      cache: pluginCache,
      log: logger.log,
      debug: logger.debug,
      error: logger.error
    };
  }

  /**
   * Starts the pipeline.
   * @return {Promise} resolves when task is complete
   */
  async start(name, directory, recache = false, useDoubleCache = true) {
    const { log, debug, error } = (0, _utils.createLogger)(`hopp:${name}`);

    /**
     * Add timeout for safety.
     */
    const safeTimeout = setTimeout(() => {
      error('Timeout exceeded! Task was hung.');
      process.exit(-1);
    }, 10 * 60 * 1000);

    /**
     * Figure out if bundling is needed & load plugins.
     */
    if (isUndefined(this.needsBundling) || isUndefined(this.needsRecaching) || isUndefined(this.readonly) || this.d.stack.length > 0 && !this.loadedPlugins) {
      this.loadedPlugins = true;

      this.d.stack.forEach(([plugin, args]) => {
        if (!this.pluginCtx.hasOwnProperty(plugin)) {
          this.loadPlugin(name, plugin, args, directory);
        }

        this.needsBundling = !!(this.needsBundling || pluginConfig[plugin].bundle);
        this.needsRecaching = !!(this.needsRecaching || pluginConfig[plugin].recache);
        this.readonly = !!(this.readonly || pluginConfig[plugin].readonly);

        if (this.needsBundling && this.readonly) {
          throw new Error('Task chain enabled bundling and readonly mode at the same time. Not sure what to do.');
        }
      });
    }

    /**
     * Override recaching.
     */
    if (this.needsRecaching) {
      recache = true;
    }

    /**
     * Get the modified files.
     */
    debug('task recache = %s', recache);
    let files = await (0, _glob2.default)(name, this.d.src, directory, useDoubleCache, recache);

    /**
     * Quit now if we want to build skipping.
     */
    if (process.env.SKIP_BUILD === 'true') {
      log('Updated cache');
      return;
    }

    if (files.length > 0) {
      const dest = this.d.dest ? _path2.default.resolve(directory, (0, _getPath2.default)(this.d.dest)) : '';

      /**
       * Switch to bundling mode if need be.
       */
      if (this.needsBundling) {
        await this.startBundling(name, directory, files, dest, useDoubleCache);
        clearTimeout(safeTimeout);
        return;
      }

      /**
       * Ensure dist directory exists.
       */
      if (!this.readonly || !this.d.dest) {
        await (0, _fs3.mkdirp)(dest.replace(directory, ''), directory);
      }

      /**
       * Create streams.
       */
      files = (0, _utils._)(files).map(file => {
        const outfile = this.doRename(_path2.default.basename(file), dest, file);

        return {
          file,
          outfile,
          stream: [(0, _streams.createReadStream)(file, outfile)]
        };
      });

      /**
       * Connect plugin streams with pipelines.
       */
      if (this.d.stack.length > 0) {
        files.map(file => {
          file.stream = file.stream.concat(this.buildStack(name));
          return file;
        });
      }

      /**
       * Connect with destination.
       */
      files.map(file => {
        if (!this.readonly) {
          // strip out the actual body and write it
          file.stream.push((0, _streams.map)((data, next) => {
            if (typeof data !== 'object' || !data.hasOwnProperty('body')) {
              return next(new Error('A plugin has destroyed the stream by returning a non-object.'));
            }

            next(null, data.body);
          }));

          // add the writestream at the end
          let output;

          if (!this.d.dest) {
            const { fd: tmp, name: tmppath } = (0, _fs3.tmpFileSync)();
            output = _fs2.default.createWriteStream(null, {
              fd: tmp
            });

            file.promise = new Promise((resolve, reject) => {
              output.on('close', () => {
                const newStream = _fs2.default.createReadStream(tmppath).pipe(_fs2.default.createWriteStream(file.file));

                newStream.on('error', reject);
                newStream.on('close', resolve);
              });
            });
          } else {
            debug('Set output: %s', file.outfile);
            (0, _fs3.mkdirpSync)(_path2.default.dirname(file.outfile).replace(directory, ''), directory);
            output = _fs2.default.createWriteStream(file.outfile);
          }

          file.stream.push(output);
        }

        // promisify the current pipeline
        return new Promise((resolve, reject) => {
          // connect all streams together to form pipeline
          file.stream = (0, _pump2.default)(file.stream, err => {
            if (err) reject(err);
          });

          if (file.promise) {
            file.promise.then(resolve, reject);
          } else {
            file.stream.on('close', resolve);
          }
        });
      });

      // start & wait for all pipelines to end
      const start = Date.now();
      log('Starting task');
      await Promise.all(files.val());
      log('Task ended (took %s ms)', Date.now() - start);

      // clear the timeout
      clearTimeout(safeTimeout);
    } else {
      log('Skipping task');
    }
  }

  /**
   * Converts task manager to JSON for storage.
   * @return {Object} proper JSON object
   */
  toJSON() {
    return {
      d: this.d,
      needsBundling: this.needsBundling,
      needsRecaching: this.needsRecaching,
      readonly: this.readonly
    };
  }

  /**
   * Deserializes a JSON object into a manager.
   * @param {Object} json
   * @return {Hopp} task manager
   */
  fromJSON(json) {
    this.d = json.d;
    this.needsBundling = json.needsBundling;
    this.needsRecaching = json.needsRecaching;
    this.readonly = json.readonly;

    return this;
  }
}
exports.default = Hopp;
//# sourceMappingURL=mgr.js.map