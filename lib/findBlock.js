/**
 * Find block by type
 *
 * @param {String} object type
 * @param {Sltate.State} current value
 * @param {Slate.Block} block to comp
 * @return {Slate.Block}
 */

const findBlock = (type, change, block = change.value.startBlock) => (
  block.type === type
    ? block
    : change.value.document.getClosest(block.key, node => node.type === type) ||
      change.value.document.findDescendant(node => node.type === type)
)

module.exports = findBlock
