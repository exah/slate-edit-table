module.exports = function(plugin, state) {
    let change = state.change();

    const cursorBlock = state.document.getDescendant('_cursor_1');
    state = change.moveToRangeOf(cursorBlock).apply();
    change = plugin.changes.setColumnAlign(state.change(), 'center');

    const cursorBlock2 = state.document.getDescendant('_cursor_2');
    state = change.moveToRangeOf(cursorBlock2).apply();
    return plugin.changes.setColumnAlign(state.change(), 'right').apply();
};
