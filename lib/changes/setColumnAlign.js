const TablePosition = require('../TablePosition')
const ALIGN = require('../ALIGN')
const createAlign = require('../createAlign')

/**
 * Sets column alignment for a given column
 *
 * @param {Object} opts
 * @param {Slate.Transform} change
 * @param {Number} at
 * @param {String} align
 * @return {Slate.Transform}
 */
function setColumnAlign (opts, change, align = ALIGN.DEFAULT, at) {
  const { state } = change
  const { startBlock } = state

  const pos = TablePosition.create(change, startBlock, opts)
  const { table } = pos

  // Figure out column position
  if (typeof at === 'undefined') {
    at = pos.getColumnIndex()
  }

  const newAlign = createAlign(pos.getWidth(), table.data.get('align'))
  newAlign[at] = align

  change.setNodeByKey(table.key, {
    data: {
      align: newAlign
    }
  })

  return change
}

module.exports = setColumnAlign
