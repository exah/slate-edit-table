const createRow = require('../utils/createRow')
const TablePosition = require('../utils/TablePosition')

/**
 * Insert a new row in current table
 *
 * @param {Object} opts
 * @param {Slate.Transform} change
 * @param {Number} at
 * @param {Function} textGetter
 * @return {Slate.Transform}
 */
function insertRow (opts, change, at, textGetter) {
  const { value } = change
  const { startBlock } = value

  const pos = TablePosition.create(change, startBlock, opts)
  const { table } = pos

  // Create a new row with the right count of cells
  const firstRow = table.nodes.get(0)
  const newRow = createRow(opts, firstRow.nodes.size, textGetter)

  if (typeof at === 'undefined') {
    at = pos.getRowIndex() + 1
  }

  return change
    .insertNodeByKey(table.key, at, newRow)
    .collapseToEndOf(
      newRow.nodes.get(pos.getColumnIndex())
    )
}

module.exports = insertRow
