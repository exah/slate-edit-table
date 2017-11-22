const { Block, Text } = require('slate')

/**
 * Create a new cell
 * @param {String} type
 * @param {String} text?
 * @return {Slate.Node}
 */
function createCell (type, text = '') {
  return Block.create({
    type,
    nodes: [
      Text.fromJSON({ kind: 'text', text })
    ]
  })
}

module.exports = createCell
