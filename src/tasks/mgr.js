/**
 * @file src/tasks/mgr.js
 * @license MIT
 * @copyright 2017 Karim Alibhai.
 */

import glob from '../glob'
import * as cache from '../cache'
import createLogger from '../utils/log'

/**
 * Hopp class to manage tasks.
 */
export default class Hopp {
  /**
   * Creates a new task with the glob.
   * DOES NOT START THE TASK.
   * 
   * @param {Glob} src
   * @return {Hopp} new hopp object
   */
  constructor (src) {
    this.src = src
    this.stack = []
  }

  /**
   * Sets the destination of this pipeline.
   * @param {String} out
   * @return {Hopp} task manager
   */
  dest (out) {
    this.dest = out
    return this
  }

  /**
   * Starts the pipeline.
   * @return {Promise} resolves when task is complete
   */
  async start (name, directory) {
    const { log, debug } = createLogger(`hopp:${name}`)
    const start = Date.now()
    log('Starting task')

    /**
     * Create a tree of the current state.
     */
    const tree = await glob(this.src, directory)

    // console.log(tree)

    log('Task ended (took %s ms)', Date.now() - start)
  }

  /**
   * Converts task manager to JSON for storage.
   * @return {Object} proper JSON object
   */
  toJSON () {
    return {
      dest: this.dest,
      src: this.src,
      stack: this.stack
    }
  }

  /**
   * Deserializes a JSON object into a manager.
   * @param {Object} json
   * @return {Hopp} task manager
   */
  fromJSON (json) {
    this.dest = json.dest
    this.src = json.src
    this.stack = json.stack

    return this
  }
}