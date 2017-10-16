module.exports = function(plugin, state) {
    const cursorBlock = state.document.getDescendant('_cursor_');
    const change = state.change();
    state = change
        .moveToRangeOf(cursorBlock)
        .move(6) // Cursor here: Before|After
        .apply();

    return plugin.changes.insertTable(state.change())
        .apply();
};
