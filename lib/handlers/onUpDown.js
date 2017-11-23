const isHotKey = require('is-hotkey').default
const TablePosition = require('../utils/TablePosition')
const moveSelectionBy = require('../changes/moveSelectionBy')

function onUpDown (event, change, opts) {
  if (isHotKey('mod', event)) return
  const direction = isHotKey('up', event) === 'up' ? -1 : +1
  const pos = TablePosition.create(change, change.value.startBlock)

  if ((pos.isFirstRow() && direction === -1) || (pos.isLastRow() && direction === +1)) {
    // Let the default behavior move out of the table
    return change
  } else {
    event.preventDefault()

    moveSelectionBy(opts, change, 0, direction)
    return change
  }
}

module.exports = onUpDown
