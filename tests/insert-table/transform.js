module.exports = function (plugin, value) {
  const cursorBlock = value.document.getDescendant('_cursor_')
  const change = value.change()
  change
    .moveToRangeOfNode(cursorBlock)
    .moveForward(6) // Cursor here: Before|After

  return plugin.changes.insertTable(change)
}
