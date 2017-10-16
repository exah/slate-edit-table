const expect = require('expect');

module.exports = function(plugin, state) {
    const cursorBlock = state.document.getDescendant('_cursor_');
    const change = state.change();

    state = change
        .moveToRangeOf(cursorBlock)
        .move(6) // Cursor here: Before|After
        .apply();

    state = plugin.changes.insertTable(state.change()).apply();

    state = state.change().undo().apply();

    // Back to previous cursor position
    expect(state.startBlock.text).toEqual('BeforeAfter');

    return state;
};
