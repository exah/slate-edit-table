const { Selection } = require('slate');

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

    const transform = blocks.reduce(
        (tr, block) => {
            if (block.type !== opts.typeCell) {
                return tr;
            }

            const cellRange = Slate.Selection.create()
                .moveToRangeOf(block);

            return tr.deleteAtRange(cellRange);
        },
        state.transform()
    );

    // Clear selected cells
    return transform
        .collapseToStartOf(focusBlock)
        .apply();
}

module.exports = onBackspace;
