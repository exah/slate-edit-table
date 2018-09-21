const { toKeyCode } = require('is-hotkey')

const insertTable = require('./changes/insertTable')
const insertRow = require('./changes/insertRow')
const removeRow = require('./changes/removeRow')
const insertColumn = require('./changes/insertColumn')
const removeColumn = require('./changes/removeColumn')
const removeTable = require('./changes/removeTable')
const moveSelection = require('./changes/moveSelection')
const moveSelectionBy = require('./changes/moveSelectionBy')

const onTab = require('./handlers/onTab')
const onUpDown = require('./handlers/onUpDown')
const makeSchema = require('./validation/makeSchema')
const normalizeNode = require('./validation/normalizeNode')

const KEY_TAB = 'tab'
const KEY_DOWN = 'down'
const KEY_UP = 'up'

/**
 * @param {String} opts.typeTable The type of table blocks
 * @param {String} opts.typeRow The type of row blocks
 * @param {String} opts.typeCell The type of cell blocks
 * @param {String} opts.typeDefault The type of default block that could be inside cell
 */
function EditTable (opts = {}) {
  opts.typeDefault = opts.typeDefault || 'paragraph'
  opts.typeTable = opts.typeTable || 'table'
  opts.typeRow = opts.typeRow || 'table_row'
  opts.typeCell = opts.typeCell || 'table_cell'

  /**
   * Is the selection in a table
   */
  function isSelectionInTable (value) {
    if (!value || !value.selection.startKey) return false

    const tableBlock = value.document.getFurthestAncestor(value.selection.startKey)

    // Only handle events in cells
    return tableBlock && tableBlock.type === opts.typeTable
  }

  /**
   * Bind a change
   */
  function bindTransform (fn) {
    return function (change, ...args) {
      if (!isSelectionInTable(change.value)) {
        return change
      }

      return fn(opts, change, ...args)
    }
  }

  /**
   * User is pressing a key in the editor
   */
  function onKeyDown (e, change) {
    // Only handle events in cells
    if (!isSelectionInTable(change.value)) {
      return
    }

    // Build arguments list
    const args = [ e, change, opts ]

    switch (e.keyCode) {
      case toKeyCode(KEY_TAB):
        return onTab(...args)
      case toKeyCode(KEY_DOWN):
      case toKeyCode(KEY_UP):
        return onUpDown(...args)
    }
  }

  return {
    schema: makeSchema(opts),
    normalizeNode: normalizeNode(opts),
    onKeyDown,
    utils: {
      isSelectionInTable
    },
    changes: {
      insertTable: insertTable.bind(null, opts),
      insertRow: bindTransform(insertRow),
      removeRow: bindTransform(removeRow),
      insertColumn: bindTransform(insertColumn),
      removeColumn: bindTransform(removeColumn),
      removeTable: bindTransform(removeTable),
      moveSelection: bindTransform(moveSelection),
      moveSelectionBy: bindTransform(moveSelectionBy)
    }
  }
}

module.exports = EditTable
