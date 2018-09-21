const TablePosition = require('../utils/TablePosition')

/**
 * Delete current column in a table
 *
 * @param {Object} opts
 * @param {Slate.Transform} change
 * @param {Number} at
 * @return {Slate.Transform}
 */
function removeColumn (opts, change, at) {
  const { value } = change
  const { startBlock } = value

  const pos = TablePosition.create(change, startBlock, opts)
  const { table } = pos

  if (typeof at === 'undefined') {
    at = pos.getColumnIndex()
  }

  const rows = table.nodes

  // Remove the cell from every row
  if (pos.getWidth() > 1) {
    rows.forEach((row) => {
      const cell = row.nodes.get(at)
      change.moveToStartOfNextBlock().removeNodeByKey(cell.key, { normalize: false })
    })
  // If last column, clear text in cells instead
  } else {
    rows.forEach((row) => {
      row.nodes.forEach((cell) => {
        cell.nodes.forEach((node) => {
          // We clear the texts in the cells
          change.moveToStartOfNextBlock().removeNodeByKey(node.key)
        })
      })
    })
  }

  // Replace the table
  return change
}

module.exports = removeColumn
