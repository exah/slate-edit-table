const expect = require('expect')

module.exports = function (plugin, state) {
  const cursorBlock = state.document.getDescendant('_cursor_')
  const initial = state.change({ save: false })
  initial.moveToRangeOf(cursorBlock)

  const toTest = initial.state.change()
  plugin.changes.insertRow(toTest)
  toTest.undo()

  // Back to previous cursor position
  expect(toTest.state.startBlock.text).toEqual('Col 1, Row 1')

  return toTest
}
