const expect = require('expect')

module.exports = function (plugin, state) {
  const blockStart = state.document.getDescendant('anchor')

  const change = state.change()
    .collapseToStartOf(blockStart)

  const result = plugin.onKeyDown(
    {
      preventDefault () {},
      stopPropagation () {}
    },
    { key: 'backspace' },
    change
  )

  expect(result).toBe(undefined)
  return change
}
