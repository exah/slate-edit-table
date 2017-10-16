const { Selection } = require('slate');
const findBlock = require('./findBlock');

function onBackspace(event, data, change, opts) {
    const { startBlock, startOffset, isCollapsed, endBlock } = change.state;

    // If a cursor is collapsed at the start of the block,
    // Or if it is "normal" deletion, do nothing
    if (startOffset === 0 && isCollapsed || startBlock === endBlock) {
        event.preventDefault();
        return;
    }

    // If cursor is between multiple blocks,
    // we clear the content of the cells
    event.preventDefault();

    const { blocks, focusBlock } = change.state;

    const nextChange = blocks.reduce(
        (tr, block) => {
            block = findBlock(opts.typeCell, change, block);

            if (block == null) {
                return tr;
            }

            const cellRange = Selection
                .create()
                .moveToRangeOf(block);

            return tr.deleteAtRange(cellRange);
        },
        change.state.change()
    );

    // Clear selected cells
    return nextChange
        .collapseToStartOf(focusBlock)
        ;
}

module.exports = onBackspace;
