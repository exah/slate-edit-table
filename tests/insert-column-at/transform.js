module.exports = function(plugin, state) {
    const cursorBlock = state.document.getDescendant('_cursor_');
    const change = state.change();
    state = change.moveToRangeOf(cursorBlock).apply();

    return plugin.changes.insertColumn(state.change())
        .apply();
};
