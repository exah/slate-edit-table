module.exports = function (plugin, state) {
  const cursorBlock = state.document.getDescendant('_cursor_')
  const change = state.change()
  change
    .moveToRangeOf(cursorBlock)
    .move(6) // Cursor here: Before|After

  return plugin.changes.insertTable(change)
}
