/**
 * @file src/plugins/steps.js
 * @license MIT
 * @copyright 2017 10244872 Canada Inc.
 */

let taskTree
let bustedTasks

/**
 * Creates a Hopp-ish object that runs
 * subtasks in steps.
 */
const steps = tasks => ({
  /**
   * Starts all tasks one by one.
   *
   * @return {Promise} a promise that will be resolved when all tasks are done
   */
  async start (name, directory) {
    for (let task of tasks) {
      await taskTree[task].start(`${name}:${task}`, directory, !!bustedTasks[task])
    }
  },

  /**
   * Watch all subtasks.
   */
  watch (name, directory) {
    return Promise.all(tasks.map(task => {
      return taskTree[task].watch(name + ':' + task, directory)
    }))
  },

  /**
   * Converts tasks to JSON.
   * Just converts them into an tasksay of
   * JSON objects.
   *
   * @return {tasksay}
   */
  toJSON () {
    return ['steps', tasks]
  }
})

steps.defineTasks = (defns, busted) => {
  taskTree = defns
  bustedTasks = busted
}

export default steps
