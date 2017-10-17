const TablePosition = require('./TablePosition')
const moveSelectionBy = require('./changes/moveSelectionBy')

function onUpDown (event, data, change, opts) {
  if (data.isMod) return
  const direction = data.key === 'up' ? -1 : +1
  const pos = TablePosition.create(change, change.state.startBlock)

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
