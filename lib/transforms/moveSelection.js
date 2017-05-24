const TablePosition = require('../TablePosition');
const findBlock = require('../findBlock');

/**
 * Move selection to {x,y}
 *
 * @param {Object} opts
 * @param {Slate.Transform} transform
 * @param {Number} x
 * @param {Number} y
 * @return {Slate.Transform}
 */
function moveSelection(opts, transform, x, y) {
    const { state } = transform;

    const block = findBlock(opts.typeCell, state);
    if (block == null) {
        throw new Error('moveSelection can only be applied from within a cell');
    }

    const pos = TablePosition.create(state, block, opts);
    const { table } = pos;

    const row  = table.nodes.get(y);
    const cell = row.nodes.get(x);

    // Calculate new offset
    let { startOffset } = state;
    if (startOffset > cell.length) {
        startOffset = cell.length;
    }

    return transform
        .collapseToEndOf(cell)
        .moveOffsetsTo(startOffset);
}

module.exports = moveSelection;
