const TablePosition = require('../TablePosition');

/**
 * Delete the whole table
 *
 * @param {Object} opts
 * @param {Slate.Transform} change
 * @return {Slate.Transform}
 */
function removeTable(opts, change) {
    const { state } = change;
    const { startBlock } = state;

    const pos = TablePosition.create(change, startBlock, opts);
    const { table } = pos;

    return change.deselect().removeNodeByKey(table.key);
}

module.exports = removeTable;
