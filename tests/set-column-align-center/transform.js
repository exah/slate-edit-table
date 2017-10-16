module.exports = function(plugin, state) {
    const change = state.change();

    const cursorBlock = state.document.getDescendant('_cursor_1');
    change.moveToRangeOf(cursorBlock);
    plugin.changes.setColumnAlign(change, 'center');

    const cursorBlock2 = change.state.document.getDescendant('_cursor_2');
    change.moveToRangeOf(cursorBlock2);
    return plugin.changes.setColumnAlign(change, 'right');
};
