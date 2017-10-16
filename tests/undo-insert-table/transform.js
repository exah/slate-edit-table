const expect = require('expect');

module.exports = function(plugin, state) {
    const cursorBlock = state.document.getDescendant('_cursor_');
    const change = state.change();

    change.moveToRangeOf(cursorBlock).move(6); // Cursor here: Before|After
    plugin.changes.insertTable(change);
    change.undo();

    // Back to previous cursor position
    expect(change.state.startBlock.text).toEqual('BeforeAfter');

    return change;
};
