const isHotKey = require('is-hotkey').default
const TablePosition = require('../utils/TablePosition')
const moveSelectionBy = require('../changes/moveSelectionBy')
const insertRow = require('../changes/insertRow')

/**
 * Select all text of current block.
 * @param {Slate.Transform} change
 * @return {Slate.Transform}
 */
function selectAllText (change) {
  const { value } = change
  const { startBlock } = value

  return change
    .moveAnchorTo(0)
    .extend(startBlock.text.length)
}

/**
 * Pressing "Tab" moves the cursor to the next cell
 * and select the whole text
 */
function onTab (event, change, opts) {
  event.preventDefault()
  const direction = (isHotKey('shift+tab', event) ? -1 : +1)
  const { value } = change

  if (opts.isTabCreateRow) {
    // Create new row if needed
    const { startBlock } = value
    const pos = TablePosition.create(change, startBlock)
    if (pos.isFirstCell() && direction === -1) {
      insertRow(opts, change, 0)
    } else if (pos.isLastCell() && direction === 1) {
      insertRow(opts, change)
    }
  }

  // Move
  change = moveSelectionBy(opts, change, direction, 0)

  // Select all cell.
  return selectAllText(change)
}

module.exports = onTab
