const expect = require('expect');

module.exports = function(plugin, state) {
    const cursorBlock = state.document.getDescendant('_cursor_');
    const offset = 2;
    const change = state.change();
    state = change
        .moveToRangeOf(cursorBlock)
        .move(offset)
        ;

    state = plugin.changes
        .moveSelectionBy(state.change(), -1, -1)
        ;

    expect(state.startBlock.text).toEqual('Col 0, Row 0');
    const selection = state.selection;
    expect(selection.startKey).toEqual(selection.endKey);
    // Keep same offset
    expect(selection.startOffset).toEqual(offset);

    return state;
};
