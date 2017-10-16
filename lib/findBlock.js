/**
 * Find block by type
 *
 * @param {String} object type
 * @param {Sltate.State} current state
 * @param {Slate.Block} block to comp
 * @return {Slate.Block}
 */

const findBlock = (type, change, block = change.state.startBlock) => (
    block.type === type
        ? block
        : change.state.document.getClosest(block.key, node => node.type === type) ||
          change.state.document.findDescendant(node => node.type === type)
);

module.exports = findBlock;
