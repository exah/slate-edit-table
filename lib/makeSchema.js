const Slate = require('slate')
const { Range, List } = require('immutable')
const createAlign = require('./createAlign')

/**
 * Create a schema for tables
 * @param {String} opts.typeTable The type of table blocks
 * @param {String} opts.typeRow The type of row blocks
 * @param {String} opts.typeCell The type of cell blocks
 * @return {Object} A schema definition with rules to normalize tables
 */
function makeSchema (opts) {
  return {
    rules: [
      cellsWithinTable(opts),
      rowsWithinTable(opts),
      tablesContainOnlyRows(opts),
      rowsContainRequiredColumns(opts),
      tableContainAlignData(opts),
      tableIsAtTopLevel(opts),
      ...(opts.typeDefault != null ? [ cellsContainBlocks(opts) ] : [])
    ]
  }
}

/**
 * Rule to ensure table is at top (document) level
 *
 * @param {String} opts.typeTable The type of table blocks
 * @param {String} opts.typeRow The type of row blocks
 * @return {Object} rule
 */

function tableIsAtTopLevel (opts) {
  return {
    match (node) {
      return (
        node.kind === 'block' &&
                node.type !== opts.typeTable
      )
    },
    validate (block) {
      const invalid = block.nodes.filter(n => n.type === opts.typeTable)
      return invalid.size ? invalid : null
    },
    normalize (change, block, invalid) {
      const { document } = change.state
      const furthest = document.getFurthestBlock(block.key)
      const index = document.nodes.findIndex(n => n.key === furthest.key)
      return invalid.reduce(
        (tr, n) => tr.moveNodeByKey(n.key, document.key, index + 1),
        change
      )
    }
  }
}

/**
 * Rule to enforce cells are always surrounded by a row.
 *
 * @param {String} opts.typeTable The type of table blocks
 * @param {String} opts.typeRow The type of row blocks
 * @param {String} opts.typeCell The type of cell blocks
 * @return {Object} A rule to ensure cells are always surrounded by a row.
 */
function cellsWithinTable (opts) {
  return {
    match (node) {
      return (node.kind === 'document' || node.kind === 'block') &&
                node.type !== opts.typeRow
    },

    // Find child cells nodes not in a row
    validate (node) {
      const cells = node.nodes.filter((n) => {
        return n.type === opts.typeCell
      })

      if (cells.isEmpty()) return

      return {
        cells
      }
    },

    // If any, wrap all cells in a row block
    normalize (change, node, { cells }) {
      change = cells.reduce((tr, cell) => {
        return tr.wrapBlockByKey(cell.key, opts.typeRow, { normalize: false })
      }, change)

      return change
    }
  }
}

/**
 * Rule to enforce rows are always surrounded by a table.
 *
 * @param {String} opts.typeTable The type of table blocks
 * @param {String} opts.typeRow The type of row blocks
 * @param {String} opts.typeCell The type of cell blocks
 * @return {Object} A rule to ensure rows are always surrounded by a table.
 */
function rowsWithinTable (opts) {
  return {
    match (node) {
      return (node.kind === 'document' || node.kind === 'block') &&
                node.type !== opts.typeTable
    },

    // Find child cells nodes not in a row
    validate (node) {
      const rows = node.nodes.filter((n) => {
        return n.type === opts.typeRow
      })

      if (rows.isEmpty()) return

      return {
        rows
      }
    },

    // If any, wrap all cells in a row block
    normalize (change, node, { rows }) {
      change = rows.reduce((tr, row) => {
        return tr.wrapBlockByKey(row.key, {
          type: opts.typeTable,
          data: {
            align: createAlign(row.nodes.size)
          }
        }, { normalize: false })
      }, change)

      return change
    }
  }
}

/**
 * @param {String} opts.typeTable The type of table blocks
 * @param {String} opts.typeRow The type of row blocks
 * @param {String} opts.typeCell The type of cell blocks
 * @return {Object} A rule that ensures tables only contain rows and
 * at least one.
 */
function tablesContainOnlyRows (opts) {
  const isRow = (node) => node.type === opts.typeRow

  return {
    match (node) {
      return node.type === opts.typeTable
    },

    validate (table) {
      // Figure out invalid rows
      const invalids = table.nodes.filterNot(isRow)

      // Figure out valid rows
      const add = invalids.size === table.nodes.size ? [ makeEmptyRow(opts) ] : []

      if (invalids.isEmpty() && add.length === 0) {
        return null
      }

      return {
        invalids,
        add
      }
    },

    /**
         * Replaces the node's children
         * @param {List<Nodes>} value.nodes
         */
    normalize (change, node, { invalids = [], add = [] }) {
      // Remove invalids
      change = invalids.reduce((t, child) => {
        return t.removeNodeByKey(child.key, { normalize: false })
      }, change)

      // Add valids
      change = add.reduce((t, child) => {
        return t.insertNodeByKey(node.key, 0, child)
      }, change)

      return change
    }
  }
}

/**
 * @param {String} opts.typeTable The type of table blocks
 * @param {String} opts.typeRow The type of row blocks
 * @param {String} opts.typeCell The type of cell blocks
 * @return {Object} A rule that ensures rows contains only cells, and
 * as much cells as there is columns in the table.
 */
function rowsContainRequiredColumns (opts) {
  const isRow = (node) => node.type === opts.typeRow
  const isCell = (node) => node.type === opts.typeCell
  const countCells = (row) => row.nodes.count(isCell)

  return {
    match (node) {
      return node.type === opts.typeTable
    },

    validate (table) {
      const rows = table.nodes.filter(isRow)

      // The number of column this table has
      const columns = rows.reduce((count, row) => {
        return Math.max(count, countCells(row))
      }, 1) // Min 1 column

      // else normalize, by padding with empty cells
      const invalidRows = rows
        .map(row => {
          const cells = countCells(row)
          const invalids = row.nodes.filterNot(isCell)

          // Row is valid: right count of cells and no extra node
          if (invalids.isEmpty() && cells === columns) {
            return null
          }

          // Otherwise, remove the invalids and append the missing cells
          return {
            row,
            invalids,
            add: (columns - cells)
          }
        })
        .filter(Boolean)

      return invalidRows.size > 0 ? invalidRows : null
    },

    /**
         * Updates by key every given nodes
         * @param {List<Nodes>} value.toUpdate
         */
    normalize (change, node, rows) {
      return rows.reduce((tr, { row, invalids, add }) => {
        tr = invalids.reduce((t, child) => {
          return t.removeNodeByKey(child.key, { normalize: false })
        }, tr)

        tr = Range(0, add).reduce(t => {
          const cell = makeEmptyCell(opts)
          return t.insertNodeByKey(row.key, 0, cell, { normalize: false })
        }, tr)

        return tr
      }, change)
    }
  }
}

/**
 * @param {String} opts.typeTable The type of table blocks
 * @param {String} opts.typeRow The type of row blocks
 * @param {String} opts.typeCell The type of cell blocks
 * @return {Object} A rule that ensures table node has all align data
 */
function tableContainAlignData (opts) {
  return {
    match (node) {
      return node.type === opts.typeTable
    },

    validate (table) {
      const align = table.data.get('align', List())
      const row = table.nodes.first()
      const columns = row.nodes.size

      return align.length === columns ? null : { align, columns }
    },

    /**
         * Updates by key the table to add the data
         * @param {Map} align
         * @param {Number} columns
         */
    normalize (change, node, { align, columns }) {
      return change.setNodeByKey(node.key, {
        data: { align: createAlign(columns, align) }
      }, { normalize: false })
    }
  }
}

/**
 * @param {String} opts.typeCell The type of cell blocks
 * @param {String} opts.typeDefault The type of default block that could be inside cell
 * @return {Object} A rule that ensures table cell has default block
 */
function cellsContainBlocks (opts) {
  return {
    match: (node) => node.type === opts.typeCell,
    validate (item) {
      const shouldWrap = item.nodes.some(node => node.kind !== 'block')
      return shouldWrap || null
    },
    normalize (change, { nodes, key }) {
      const changeOptions = { normalize: false }
      change = change.wrapBlockByKey(nodes.first().key, opts.typeDefault, changeOptions)

      const wrapper = change.state.document
        .getDescendant(key)
        .nodes.first()

      return nodes.rest().reduce(
        (tr, n, index) => tr.moveNodeByKey(n.key, wrapper.key, index + 1, changeOptions),
        change
      )
    }
  }
}

function makeEmptyCell (opts) {
  return Slate.Block.create({
    type: opts.typeCell
  })
}

function makeEmptyRow (opts) {
  return Slate.Block.create({
    type: opts.typeRow,
    nodes: List([ makeEmptyCell(opts) ])
  })
}

module.exports = makeSchema
