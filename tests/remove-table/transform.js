module.exports = function(plugin, state) {
    const cursorBlock = state.document.getDescendant('_cursor_');
    const change = state.change();
    state = change.moveToRangeOf(cursorBlock);

    return plugin.changes.removeTable(state.change())
        ;
};
