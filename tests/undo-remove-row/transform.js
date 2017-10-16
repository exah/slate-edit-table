
module.exports = function(plugin, state) {
    const cursorBlock = state.document.getDescendant('_cursor_');
    const change = state.change();

    state = change.moveToRangeOf(cursorBlock).apply();

    state = plugin.changes.removeRow(state.change()).apply();

    state = state.change().undo().apply();

    return state;
};
