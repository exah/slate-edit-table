const { Block, Text } = require('slate')
const { Range, List } = require('immutable')

/**
 * @param {String} opts.typeTable The type of table blocks
 * @param {String} opts.typeRow The type of row blocks
 * @param {String} opts.typeCell The type of cell blocks
 * @return {Function} A change that ensures rows contains only cells, and
 * as much cells as there is columns in the table.
 */

const validateNode = (opts) => {
  const isRow = (node) => node.type === opts.typeRow
  const isCell = (node) => node.type === opts.typeCell
  const countCells = (row) => row.nodes.count(isCell)

  return (node) => {
    if (node.type !== opts.typeTable) return

    const rows = node.nodes.filter(isRow)

    // The number of column this table has
    const columns = rows.reduce((count, row) => {
      return Math.max(count, countCells(row))
    }, 1) // Min 1 column

    // else normalize, by padding with empty cells
    const invalidRows = rows
      .map(row => {
        const cells = countCells(row)
        const invalids = row.nodes.filterNot(isCell)
        const add = (columns - cells)

        // Row is valid: right count of cells and no extra node
        if (invalids.isEmpty() && add === 0) {
          return null
        }

        // Otherwise, remove the invalids and append the missing cells
        return {
          row,
          invalids,
          add
        }
      })
      .filter(Boolean)

    if (invalidRows.size === 0) return

    return (change) => {
      invalidRows.forEach(
        ({ row, invalids, add }) => {
          invalids.forEach((child) => {
            change.removeNodeByKey(child.key, { normalize: false })
          })

          Range(0, add).forEach(() => {
            const cell = Block.create({
              type: opts.typeCell,
              nodes: List([ Text.create('') ])
            })
            change.insertNodeByKey(row.key, row.size, cell, { normalize: false })
          })
        }
      )
      return change
    }
  }
}

module.exports = validateNode
