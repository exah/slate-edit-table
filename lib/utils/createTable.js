const { Range } = require('immutable')
const Slate = require('slate')
const createRow = require('./createRow')

/**
 * Create a table
 *
 * @param {Slate.State} value
 * @param {Object} opts
 * @param {Number} columns
 * @param {Number} rows
 * @param {Function} textGetter
 * @return {ValueBlock}
 */
function createTable (opts, columns, rows, textGetter) {
  const rowNodes = Range(0, rows)
    .map(i => createRow(opts, columns, textGetter ? textGetter.bind(null, i) : null))
    .toList()

  return Slate.Block.create({
    type: opts.typeTable,
    nodes: rowNodes
  })
}

module.exports = createTable
