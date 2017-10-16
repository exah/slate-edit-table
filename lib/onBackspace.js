const { Selection } = require('slate');
const findBlock = require('./findBlock');

function onBackspace(event, data, state, opts) {
    const { startBlock, startOffset, isCollapsed, endBlock } = state;

    // If a cursor is collapsed at the start of the block,
    // Or if it is "normal" deletion, do nothing
    if (startOffset === 0 && isCollapsed || startBlock === endBlock) {
        event.preventDefault();
        return;
    }

    // If cursor is between multiple blocks,
    // we clear the content of the cells
    event.preventDefault();

    const { blocks, focusBlock } = state;

    const change = blocks.reduce(
        (tr, block) => {
            block = findBlock(opts.typeCell, state, block);

            if (block == null) {
                return tr;
            }

            const cellRange = Selection
                .create()
                .moveToRangeOf(block);

            return tr.deleteAtRange(cellRange);
        },
        state.change()
    );

    // Clear selected cells
    return change
        .collapseToStartOf(focusBlock)
        .apply();
}

module.exports = onBackspace;
