const expect = require('expect');

module.exports = function(plugin, state) {
    const cursorBlock = state.document.getDescendant('_cursor_');
    const change = state.change();

    state = change.moveToRangeOf(cursorBlock).apply();

    state = plugin.changes.insertRow(state.change()).apply();

    state = state.change().undo().apply();

    // Back to previous cursor position
    expect(state.startBlock.text).toEqual('Col 1, Row 1');

    return state;
};
