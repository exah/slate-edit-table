const TablePosition = require('../utils/TablePosition')

/**
 * Delete the whole table
 *
 * @param {Object} opts
 * @param {Slate.Transform} change
 * @return {Slate.Transform}
 */
function removeTable (opts, change) {
  const { value } = change
  const { startBlock } = value

  const pos = TablePosition.create(change, startBlock, opts)
  const { table } = pos

  return change.moveToStartOfNextBlock().removeNodeByKey(table.key)
}

module.exports = removeTable
