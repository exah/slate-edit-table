const expect = require('expect')

module.exports = function (plugin, state) {
  const cursorBlock = state.document.getDescendant('_cursor_')
  const initial = state.change()
  initial.moveToRangeOf(cursorBlock)

  const change = initial.state.change()
  plugin.changes.insertColumn(change)
  change.undo()

  // Back to previous cursor position
  expect(change.state.startBlock.text).toEqual('Col 1, Row 1')

  return change
}
