/**
 * @file src/plugins/watch.js
 * @license MIT
 * @copyright 2017 Karim Alibhai.
 */

import * as Goal from './goal'

/**
 * Creates a Hopp-ish object that runs
 * subtasks in watch mode.
 */
export default tasks => ({
  /**
   * Starts all tasks in watch mode.
   * 
   * @return {Promise} joins all watch promises under .all()
   */
  start (name, directory) {
    return Goal.create(tasks, directory, 'watch')
  },

  /**
   * Converts tasks to JSON.
   * Just converts them into an array of
   * JSON objects.
   * 
   * @return {Array} 
   */
  toJSON () {
    return ['watch', tasks]
  }
})