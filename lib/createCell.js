const Slate = require('slate')

/**
 * Create a new cell
 * @param {String} type
 * @param {String} text?
 * @return {Slate.Node}
 */
function createCell (type, text) {
  text = text || ''

  const node = Slate.Block.create({
    type,
    nodes: [
      Slate.Text.fromJSON({ kind: 'text', text })
    ]
  })

  return node
}

module.exports = createCell
