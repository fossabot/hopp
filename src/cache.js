/**
 * @file src/cache/load.js
 * @license MIT
 * @copyright 2017 Karim Alibhai.
 */

import {
  stat,
  mkdir,
  exists,
  readFile,
  writeFile,
} from './fs'
import path from 'path'

const { debug, log } = require('./utils/log')('hopp')
let lock

/**
 * Creates a new cache (overwrites existing).
 * @param {String} lockfile location of lockfile
 * @return {Object} contents of new cache
 */
async function createCache( lockfile ) {
  debug('Creating empty cache')

  // write empty cache
  await writeFile(lockfile, '{"s":{"lock":0}}')

  // return the empty cache
  return (lock = {
    s: {
      lock: 0
    }
  })
}

/**
 * Loads a cache from the project.
 * @param {String} directory project directory
 * @return {Object} the loaded cache
 */
export const load = async directory => {
  // send back internal cache if reloading
  if (lock) return lock

  // verify directory
  if (typeof directory !== 'string' || !await exists(directory)) {
    throw new Error('Invalid directory given: ' + directory)
  }

  // set cache file
  const lockfile = `${directory}/hopp.lock`

  // bring cache into existence
  if (!await exists(lockfile)) {
    return await createCache(lockfile)
  }

  // load lock file
  debug('Loading cache')
  try {
    return (lock = JSON.parse(await readFile(lockfile, 'utf8')))
  } catch (_) {
    log('Corrupted cache; ejecting.')
    return await createCache(lockfile)
  }
}

/**
 * Adds/replaces a value in the cache.
 * @param {String} key
 * @param {Any} value anything stringifiable
 */
export const val = (key, value) => {
  if (value === undefined) {
    return lock[key]
  }
  
  lock[key] = value
}

/**
 * Saves the lockfile again.
 * @param {*} directory 
 */
export const save = async directory => {
  await writeFile(directory + '/hopp.lock', JSON.stringify(lock))
}