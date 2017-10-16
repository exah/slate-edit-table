const TablePosition = require('../TablePosition');
const findBlock = require('../findBlock');

/**
 * Move selection to {x,y}
 *
 * @param {Object} opts
 * @param {Slate.Transform} change
 * @param {Number} x
 * @param {Number} y
 * @return {Slate.Transform}
 */
function moveSelection(opts, change, x, y) {
    const { state } = change;

    const block = findBlock(opts.typeCell, change);
    if (block == null) {
        throw new Error('moveSelection can only be applied from within a cell');
    }

    const pos = TablePosition.create(change, block, opts);
    const { table } = pos;

    const row  = table.nodes.get(y);
    const cell = row.nodes.get(x);

    // Calculate new offset
    let { startOffset } = state;
    if (startOffset > cell.text.length) {
        startOffset = cell.text.length;
    }

    return change
        .collapseToEndOf(cell)
        .moveOffsetsTo(startOffset);
}

module.exports = moveSelection;
