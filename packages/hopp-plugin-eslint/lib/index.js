/**
 * @file index.src.js
 * @license MIT
 */

import { CLIEngine } from 'eslint'

/**
 * For node v4.
 */
require('regenerator-runtime/runtime')

export const config = {
  mode: 'buffer',
  readonly: true
}

export default async (ctx, data) => {
  // create new linter
  if (!ctx.linter) {
    ctx.linter = new CLIEngine(ctx.args[0] || {})
  }

  // lint file
  data.results = ctx.linter.executeOnText(data.body.toString('utf8'))

  return data
}
