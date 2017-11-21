const TablePosition = require('../TablePosition')

/**
 * Remove current row in a table. Clear it if last remaining row
 *
 * @param {Object} opts
 * @param {Slate.Transform} change
 * @param {Number} at
 * @return {Slate.Transform}
 */
function removeRow (opts, change, at) {
  const { value } = change
  const { startBlock } = value

  const pos = TablePosition.create(change, startBlock, opts)
  const { table } = pos

  if (typeof at === 'undefined') {
    at = pos.getRowIndex()
  }

  const row = table.nodes.get(at)
  // Update table by removing the row
  if (pos.getHeight() > 1) {
    change.removeNodeByKey(row.key)
  // If last remaining row, clear it instead
  } else {
    row.nodes.forEach((cell) => {
      cell.nodes.forEach((node) => {
        change.removeNodeByKey(node.key)
      })
    })
  }

  return change
}

module.exports = removeRow
