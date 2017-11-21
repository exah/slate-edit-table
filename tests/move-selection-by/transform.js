const expect = require('expect')

module.exports = function (plugin, value) {
  const cursorBlock = value.document.getDescendant('_cursor_')
  const offset = 2
  const change = value.change()
  change
    .moveToRangeOf(cursorBlock)
    .move(offset)

  plugin.changes
    .moveSelectionBy(change, -1, -1)

  expect(change.value.startBlock.text).toEqual('Col 0, Row 0')
  const selection = change.value.selection
  expect(selection.startKey).toEqual(selection.endKey)
  // Keep same offset
  expect(selection.startOffset).toEqual(offset)

  return change
}
