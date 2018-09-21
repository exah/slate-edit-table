const expect = require('expect')

module.exports = function (plugin, value) {
  const cursorBlock = value.document.getDescendant('_cursor_')
  const offset = 2
  const change = value.change()

  change
    .moveToRangeOfNode(cursorBlock)
    .moveForward(offset)

  plugin.changes
    .moveSelection(change, 2, 2)

  expect(change.value.startBlock.text).toEqual('Col 2, Row 2')
  const selection = change.value.selection
  expect(selection.start.key).toEqual(selection.end.key)
  // Keep same offset
  expect(selection.start.offset).toEqual(offset)

  return change
}
