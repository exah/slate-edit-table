const TablePosition = require('../TablePosition')
const moveSelection = require('./moveSelection')
const createCell = require('../createCell')

/**
 * Insert a new column in current table
 *
 * @param {Object} opts
 * @param {Slate.Transform} change
 * @param {Number} at
 * @return {Slate.Transform}
 */
function insertColumn (opts, change, at) {
  const { value } = change
  const { startBlock } = value

  const pos = TablePosition.create(change, startBlock, opts)
  const { table } = pos

  if (typeof at === 'undefined') {
    at = pos.getColumnIndex() + 1
  }

  // Insert the new cell
  table.nodes.forEach((row) => {
    const newCell = createCell(opts.typeCell)
    change = change.insertNodeByKey(row.key, at, newCell)
  })

  // Update the selection (not doing can break the undo)
  return moveSelection(opts, change, pos.getColumnIndex() + 1, pos.getRowIndex())
}

module.exports = insertColumn
