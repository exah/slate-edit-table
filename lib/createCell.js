const { Block, Text } = require('slate')
const { List } = require('immutable')

/**
 * Create a new cell
 * @param {String} type
 * @param {String} text?
 * @return {Slate.Node}
 */
function createCell (opts, text = '') {
  return Block.create({
    type: opts.typeCell,
    nodes: List([
      Block.create({
        type: opts.typeDefault,
        nodes: List([ Text.create(text) ])
      })
    ])
  })
}

module.exports = createCell
